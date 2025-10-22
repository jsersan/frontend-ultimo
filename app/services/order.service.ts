// src/app/services/order.service.ts - Servicio completo y corregido

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Order, OrderBackend, OrderDetail, OrderUtils } from '../models/order';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    console.log('🔧 OrderService inicializado');
    console.log('📍 API URL:', this.apiUrl);
  }

  /**
   * ✅ Método privado para obtener headers con autenticación JWT
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    console.log('🔑 Headers de autenticación creados:', {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    });
    
    return headers;
  }

  /**
   * ✅ Verificar si el usuario está autenticado
   */
  private checkAuthentication(): boolean {
    if (!this.authService.isLoggedIn()) {
      console.error('❌ Usuario no autenticado');
      throw new Error('Usuario no autenticado. Por favor, inicia sesión.');
    }
    console.log('✅ Usuario autenticado correctamente');
    return true;
  }

  /**
   * ✅ Obtener todos los pedidos de un usuario específico por su ID
   */
  getOrders({ userId }: { userId: number }): Observable<Order[]> {
    console.log('🚀 Obteniendo pedidos para usuario:', userId);
    this.checkAuthentication();
    const headers = this.getAuthHeaders();
    
    return this.http.get<OrderBackend[]>(`${this.apiUrl}/user/${userId}`, { headers })
      .pipe(
        map(ordersBackend => ordersBackend.map(orderBackend => 
          OrderUtils.fromBackendFormat(orderBackend)
        )),
        catchError(this.handleError('obtener pedidos'))
      );
  }

  /**
   * ✅ Obtener un pedido específico por su ID
   */
  getOrder(id: number): Observable<OrderDetail> {
    console.log('🚀 Obteniendo pedido con ID:', id);
    this.checkAuthentication();
    const headers = this.getAuthHeaders();
    
    return this.http.get<OrderDetail>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(this.handleError('obtener pedido'))
      );
  }

  /**
   * ✅ Crear un nuevo pedido (MÉTODO PRINCIPAL MEJORADO)
   */
  createOrder(order: Order): Observable<Order> {
    console.log('🚀 Creando nuevo pedido:', order);
    
    // Verificar autenticación
    this.checkAuthentication();
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !currentUser.id) {
      console.error('❌ No hay usuario actual disponible o sin ID');
      throw new Error('Usuario no autenticado o sin ID válido');
    }

    // ✅ Validar el pedido antes de enviarlo
    const validation = OrderUtils.validateOrder(order);
    if (!validation.valid) {
      console.error('❌ Pedido inválido:', validation.errors);
      throw new Error(`Pedido inválido: ${validation.errors.join(', ')}`);
    }

    // ✅ Preparar datos para el backend con mapeo correcto
    const orderBackendData = {
      iduser: currentUser.id, // ✅ Usar el usuario autenticado actual
      fecha: new Date().toISOString().split('T')[0], // ✅ Solo fecha YYYY-MM-DD
      total: order.total,
      lineas: order.lineas?.map(line => ({
        idprod: line.idprod,
        color: line.color || 'Estándar',
        cant: line.cantidad, // ✅ Mapeo: cantidad -> cant (para el backend)
        nombre: line.nombre || ''
      })) || []
    };

    console.log('📦 Datos del pedido a enviar al backend:', orderBackendData);

    const headers = this.getAuthHeaders();
    
    // ✅ Realizar petición HTTP con manejo de respuesta
    return this.http.post<OrderBackend>(this.apiUrl, orderBackendData, { headers })
      .pipe(
        map(responseBackend => {
          console.log('✅ Respuesta del backend:', responseBackend);
          // Convertir respuesta del backend al formato frontend
          return OrderUtils.fromBackendFormat(responseBackend);
        }),
        catchError(this.handleError('crear pedido'))
      );
  }

  /**
   * ✅ Obtener pedidos del usuario actual
   */
  getUserOrders(): Observable<Order[]> {
    console.log('🚀 Obteniendo pedidos del usuario actual');
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) {
      throw new Error('Usuario no autenticado o sin ID');
    }

    return this.getOrders({ userId: currentUser.id });
  }

  /**
   * ✅ Alias para getOrder (mejor nombre)
   */
  getOrderById(orderId: number): Observable<OrderDetail> {
    return this.getOrder(orderId);
  }

  /**
   * ✅ Cancelar un pedido (nuevo método)
   */
  cancelOrder(orderId: number): Observable<any> {
    console.log('🚀 Cancelando pedido:', orderId);
    this.checkAuthentication();
    const headers = this.getAuthHeaders();
    
    return this.http.patch(`${this.apiUrl}/${orderId}/cancel`, {}, { headers })
      .pipe(
        catchError(this.handleError('cancelar pedido'))
      );
  }

  /**
   * ✅ Actualizar estado de un pedido (admin)
   */
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    console.log('🚀 Actualizando estado del pedido:', orderId, 'a:', status);
    this.checkAuthentication();
    const headers = this.getAuthHeaders();
    
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status }, { headers })
      .pipe(
        catchError(this.handleError('actualizar estado del pedido'))
      );
  }

  /**
   * ✅ Obtener resumen de pedidos del usuario
   */
  getOrdersSummary(): Observable<any> {
    console.log('🚀 Obteniendo resumen de pedidos del usuario actual');
    this.checkAuthentication();
    const headers = this.getAuthHeaders();
    
    return this.http.get(`${this.apiUrl}/summary`, { headers })
      .pipe(
        catchError(this.handleError('obtener resumen de pedidos'))
      );
  }

  /**
   * ✅ Método mejorado para manejo de errores
   */
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`❌ Error en ${operation}:`, error);
      
      let userMessage = 'Ha ocurrido un error inesperado';
      
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        console.error('💻 Error del cliente:', error.error.message);
        userMessage = 'Error de conexión. Verifica tu internet.';
      } else {
        // Error del servidor
        console.error(`🔥 Error del servidor ${error.status}:`, error.error);
        
        switch (error.status) {
          case 0:
            userMessage = 'No se puede conectar al servidor. ¿Está el backend ejecutándose?';
            console.error('🚨 CORS o servidor no accesible en:', this.apiUrl);
            break;
          case 401:
            userMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
            // Auto-logout en caso de error 401
            this.authService.logout();
            break;
          case 403:
            userMessage = 'No tienes permisos para realizar esta operación.';
            break;
          case 400:
            userMessage = error.error?.message || 'Datos inválidos enviados al servidor.';
            break;
          case 404:
            userMessage = 'Recurso no encontrado. Puede que el pedido no exista.';
            break;
          case 422:
            userMessage = 'Error de validación en los datos enviados.';
            break;
          case 500:
            userMessage = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          default:
            userMessage = `Error del servidor: ${error.status}. ${error.error?.message || ''}`;
        }
      }
      
      console.error('📢 Mensaje para el usuario:', userMessage);
      
      // Crear un error con el mensaje para el usuario
      const clientError = new Error(userMessage);
      (clientError as any).originalError = error;
      (clientError as any).status = error.status;
      
      return throwError(() => clientError);
    };
  }

  /**
   * ✅ Método de utilidad para debug
   */
  debug(): void {
    console.log('🔍 OrderService Debug Info:', {
      apiUrl: this.apiUrl,
      isLoggedIn: this.authService.isLoggedIn(),
      currentUser: this.authService.currentUserValue,
      hasToken: !!this.authService.getToken()
    });
  }

  enviarAlbaranPorEmail(
    pedido: any,
    usuario: any,
    pdfBase64: string
  ): Observable<any> {
    this.checkAuthentication();
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/enviar-albaran-email`,
      { pedido, usuario, pdfBase64 },
      { headers }
    ).pipe(
      catchError(this.handleError('enviar albarán por email'))
    );
  }
  
  
}