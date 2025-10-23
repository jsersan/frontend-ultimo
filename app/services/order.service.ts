// src/app/services/order.service.ts - VERSIÓN CORREGIDA

import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { environment } from '../../environments/environment'
import { Order, OrderBackend, OrderDetail, OrderUtils } from '../models/order'
import { AuthService } from './auth.service'
import { OrderLine } from '../models/order' // Ajusta la ruta si tu modelo está en otra carpeta

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/pedidos`

  constructor (private http: HttpClient, private authService: AuthService) {
    console.log('🔧 OrderService inicializado')
    console.log('📍 API URL:', this.apiUrl)
  }

  /**
   * ✅ Método privado para obtener headers con autenticación JWT
   */
  private getAuthHeaders (): HttpHeaders {
    const token = this.authService.getToken()
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    })

    console.log('🔐 Headers de autenticación creados:', {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    })

    return headers
  }

  /**
   * ✅ Verificar si el usuario está autenticado
   */
  private checkAuthentication (): boolean {
    if (!this.authService.isLoggedIn()) {
      console.error('❌ Usuario no autenticado')
      throw new Error('Usuario no autenticado. Por favor, inicia sesión.')
    }
    console.log('✅ Usuario autenticado correctamente')
    return true
  }

  /**
   * ✅ CORREGIDO: Obtener todos los pedidos de un usuario específico por su ID
   */
  getOrders ({ userId }: { userId: number }): Observable<Order[]> {
    console.log('🚀 Obteniendo pedidos para usuario:', userId)
    this.checkAuthentication()
    const headers = this.getAuthHeaders()

    return this.http
      .get<any>(`${this.apiUrl}/user/${userId}`, { headers })
      .pipe(
        map(response => {
          console.log('📦 Respuesta del backend (getOrders):', response)

          // ✅ MANEJO DE DIFERENTES FORMATOS DE RESPUESTA
          let ordersBackend: OrderBackend[]

          if (Array.isArray(response)) {
            // El backend devuelve directamente un array
            ordersBackend = response
          } else if (response && Array.isArray(response.data)) {
            // El backend devuelve { data: [...] }
            ordersBackend = response.data
          } else if (response && Array.isArray(response.pedidos)) {
            // El backend devuelve { pedidos: [...] }
            ordersBackend = response.pedidos
          } else {
            // No hay pedidos o formato desconocido
            console.warn(
              '⚠️ Formato de respuesta inesperado o sin pedidos:',
              response
            )
            return []
          }

          console.log(`✅ Se encontraron ${ordersBackend.length} pedidos`)

          // Transformar cada pedido del formato backend al frontend
          return ordersBackend.map(orderBackend =>
            OrderUtils.fromBackendFormat(orderBackend)
          )
        }),
        catchError(this.handleError('obtener pedidos'))
      )
  }

  /**
   * ✅ Obtener un pedido específico por su ID
   */
  getOrder (id: number): Observable<OrderDetail> {
    console.log('🚀 Obteniendo pedido con ID:', id)
    this.checkAuthentication()
    const headers = this.getAuthHeaders()

    return this.http
      .get<OrderDetail>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError('obtener pedido')))
  }

  /**
   * ✅ Crear un nuevo pedido (VERSIÓN CORREGIDA)
   */
  createOrder (order: Order): Observable<Order> {
    console.log('🚀 Creando nuevo pedido:', order)

    // Verificar autenticación
    this.checkAuthentication()
    const currentUser = this.authService.currentUserValue

    if (!currentUser || !currentUser.id) {
      console.error('❌ No hay usuario actual disponible o sin ID')
      throw new Error('Usuario no autenticado o sin ID válido')
    }

    // ✅ CRÍTICO: Asegurar que userId está presente
    const userId = order.usuario_id || currentUser.id

    console.log('👤 Usuario ID final:', userId)

    // ✅ Validar el pedido antes de enviarlo
    const validation = OrderUtils.validateOrder(order)
    if (!validation.valid) {
      console.error('❌ Pedido inválido:', validation.errors)
      throw new Error(`Pedido inválido: ${validation.errors.join(', ')}`)
    }

    // ✅ Preparar datos para el backend con verificación explícita
    const orderBackendData = {
      iduser: userId,
      fecha: new Date().toISOString().split('T')[0],
      total: Number(order.total.toFixed(2)),
      // CRÍTICO: envía las líneas bajo la clave 'lineas'
      lineas: order.lineas?.map(line => ({
        idprod: line.idprod,
        color: line.color || 'Estándar',
        cant: line.cantidad,
        nombre: line.nombre || '',
        precio: line.precio !== undefined ? line.precio : line.product.precio
      })) || []
    };

    // ✅ VERIFICACIÓN ADICIONAL antes de enviar
    if (!orderBackendData.iduser || orderBackendData.iduser <= 0) {
      console.error(
        '❌ CRÍTICO: iduser inválido antes de enviar:',
        orderBackendData
      )
      throw new Error('ID de usuario inválido')
    }

    console.log(
      '📦 Datos finales a enviar al backend:',
      JSON.stringify(orderBackendData, null, 2)
    )

    const headers = this.getAuthHeaders()

    // ✅ Realizar petición HTTP con manejo de respuesta
    console.log("Datos finales a enviar al backend", JSON.stringify(orderBackendData, null, 2));

    return this.http.post(this.apiUrl, orderBackendData, { headers }).pipe(
      map((response:any) => {
        console.log(
          '✅ Respuesta completa del backend (createOrder):',
          response
        )

        // ✅ MANEJO DE DIFERENTES FORMATOS DE RESPUESTA
        let orderBackend: OrderBackend

        // EXTRA CRÍTICO - sólo el pedido!
        if (response.data && response.data.pedido) {
          orderBackend = response.data.pedido // ← PEDIDO DIRECTO
        } else if (response.pedido) {
          orderBackend = response.pedido
        } else if (response.id) {
          orderBackend = response
        } else {
          orderBackend = response
        }

        console.log('📦 OrderBackend extraído:', orderBackend)
        // Transformar al formato frontend
        const orderFrontend = OrderUtils.fromBackendFormat(orderBackend)

        console.log('✅ Order Frontend (con ID):', orderFrontend)
        console.log('🎫 NÚMERO DE PEDIDO:', orderFrontend.id)

        return orderFrontend // ← DEVUELVE SOLO EL PEDIDO
      }),
      catchError(this.handleError('crear pedido'))
    )
  }
  /**
   * ✅ Obtener pedidos del usuario actual
   */
  getUserOrders (): Observable<Order[]> {
    console.log('🚀 Obteniendo pedidos del usuario actual')
    const currentUser = this.authService.currentUserValue
    if (!currentUser || !currentUser.id) {
      throw new Error('Usuario no autenticado o sin ID')
    }

    return this.getOrders({ userId: currentUser.id })
  }

  /**
   * ✅ Alias para getOrder (mejor nombre)
   */
  getOrderById (orderId: number): Observable<OrderDetail> {
    return this.getOrder(orderId)
  }

  /**
   * ✅ Cancelar un pedido
   */
  cancelOrder (orderId: number): Observable<any> {
    console.log('🚀 Cancelando pedido:', orderId)
    this.checkAuthentication()
    const headers = this.getAuthHeaders()

    return this.http
      .patch(`${this.apiUrl}/${orderId}/cancel`, {}, { headers })
      .pipe(catchError(this.handleError('cancelar pedido')))
  }

  /**
   * ✅ Actualizar estado de un pedido (admin)
   */
  updateOrderStatus (orderId: number, status: string): Observable<any> {
    console.log('🚀 Actualizando estado del pedido:', orderId, 'a:', status)
    this.checkAuthentication()
    const headers = this.getAuthHeaders()

    return this.http
      .patch(`${this.apiUrl}/${orderId}/status`, { status }, { headers })
      .pipe(catchError(this.handleError('actualizar estado del pedido')))
  }

  /**
   * ✅ Obtener resumen de pedidos del usuario
   */
  getOrdersSummary (): Observable<any> {
    console.log('🚀 Obteniendo resumen de pedidos del usuario actual')
    this.checkAuthentication()
    const headers = this.getAuthHeaders()

    return this.http
      .get(`${this.apiUrl}/summary`, { headers })
      .pipe(catchError(this.handleError('obtener resumen de pedidos')))
  }

  /**
   * ✅ Método mejorado para manejo de errores
   */
  private handleError (operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`❌ Error en ${operation}:`, error)

      let userMessage = 'Ha ocurrido un error inesperado'

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        console.error('💻 Error del cliente:', error.error.message)
        userMessage = 'Error de conexión. Verifica tu internet.'
      } else {
        // Error del servidor
        console.error(`🔥 Error del servidor ${error.status}:`, error.error)

        switch (error.status) {
          case 0:
            userMessage =
              'No se puede conectar al servidor. ¿Está el backend ejecutándose?'
            console.error('🚨 CORS o servidor no accesible en:', this.apiUrl)
            break
          case 401:
            userMessage =
              'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
            this.authService.logout()
            break
          case 403:
            userMessage = 'No tienes permisos para realizar esta operación.'
            break
          case 400:
            userMessage =
              error.error?.message || 'Datos inválidos enviados al servidor.'
            break
          case 404:
            userMessage =
              'Recurso no encontrado. Puede que el pedido no exista.'
            break
          case 422:
            userMessage = 'Error de validación en los datos enviados.'
            break
          case 500:
            userMessage = 'Error interno del servidor. Inténtalo más tarde.'
            break
          default:
            userMessage = `Error del servidor: ${error.status}. ${
              error.error?.message || ''
            }`
        }
      }

      console.error('📢 Mensaje para el usuario:', userMessage)

      const clientError = new Error(userMessage)
      ;(clientError as any).originalError = error
      ;(clientError as any).status = error.status

      return throwError(() => clientError)
    }
  }

  /**
   * ✅ Método de utilidad para debug
   */
  debug (): void {
    console.log('🔍 OrderService Debug Info:', {
      apiUrl: this.apiUrl,
      isLoggedIn: this.authService.isLoggedIn(),
      currentUser: this.authService.currentUserValue,
      hasToken: !!this.authService.getToken()
    })
  }

  // Añade esto en la clase OrderService

  /**
   * Obtener las líneas de un pedido concreto por su ID
   */
  getOrderLines (pedidoId: number): Observable<OrderLine[]> {
    const headers = this.getAuthHeaders()
    return this.http.get<OrderLine[]>(`${this.apiUrl}/${pedidoId}/lineas`, {
      headers
    })
  }

  /**
   * ✅ Enviar albarán por email
   */
  enviarAlbaranPorEmail (
    pedido: any,
    usuario: any,
    pdfBase64: string
  ): Observable<any> {
    this.checkAuthentication()
    const headers = this.getAuthHeaders()
    return this.http
      .post(
        `${this.apiUrl}/enviar-albaran-email`,
        { pedido, usuario, pdfBase64 },
        { headers }
      )
      .pipe(catchError(this.handleError('enviar albarán por email')))
  }
}
