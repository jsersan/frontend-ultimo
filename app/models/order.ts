// src/app/models/order.ts - Interfaces completas y corregidas

/**
 * Interfaz para items del carrito
 * Compatible con cart.service.ts y checkout.component.ts
 */
export interface CartItem {
  id: number;
  producto?: any; // Objeto Product completo (opcional)
  cantidad: number;
  color?: string;
  talla?: string;
  precio: number;
  nombre?: string;
  imagen?: string;
  quantity?: number; // Alias de cantidad para compatibilidad
}

/**
 * Interfaz para líneas de pedido (frontend)
 * Usa 'cantidad' para mantener consistencia en el frontend
 */
export interface OrderLine {
  id?: number;
  idpedido: number;
  idprod: number;
  color: string;
  cantidad: number; // ✅ Frontend usa 'cantidad'
  nombre?: string;
  precio?: number; // ✅ AÑADIDO: Precio unitario
  product?: any; // ✅ AÑADIDO: Objeto producto completo
}

/**
 * Interfaz para líneas de pedido (backend)
 * Mapea 'cantidad' -> 'cant' para el backend
 */
export interface OrderLineBackend {
  id?: number;
  idpedido: number;
  idprod: number;
  color: string;
  cant: number; // ✅ Backend espera 'cant'
  nombre?: string;
  precio?: number; // ✅ AÑADIDO: Precio unitario
  product?: any; // ✅ AÑADIDO: Objeto producto completo
}

/**
 * Interfaz para pedidos (frontend)
 * Estructura simplificada para el frontend
 */
export interface Order {
  id?: number;
  usuario_id: number; // ID del usuario (se mapea a iduser en backend)
  fecha: string; // Fecha en formato ISO string
  total: number;
  lineas?: OrderLine[]; // Líneas con 'cantidad'
}

/**
 * Interfaz para pedidos (backend)
 * Lo que realmente espera el backend
 */
export interface OrderBackend {
  id?: number;
  iduser: number; // ✅ Backend espera 'iduser'
  fecha: string; // Fecha en formato YYYY-MM-DD
  total: number;
  lineas?: OrderLineBackend[]; // Líneas con 'cant'
}

/**
 * Interfaz para respuesta completa de pedido (con relaciones)
 */
export interface OrderDetail extends Order {
  user?: {
    id: number;
    username: string;
    nombre: string;
    email: string;
  };
  lineas: Array<OrderLine & {
    product?: {
      id: number;
      nombre: string;
      precio: number;
      imagen: string;
      carpetaimg: string;
    }
  }>;
}

/**
 * Interfaz para el estado de checkout
 */
export interface CheckoutState {
  currentUser: any;
  cartItems: CartItem[];
  total: number;
  loading: boolean;
  useUserDataDirectly: boolean;
}

/**
 * Interfaz para datos de envío del formulario
 */
export interface ShippingData {
  nombre: string;
  direccion: string;
  ciudad: string;
  cp: string;
  telefono?: string;
}

/**
 * Funciones de utilidad para conversión entre formatos
 */
export class OrderUtils {
  
  /**
   * Convierte Order (frontend) a OrderBackend
   */
  static toBackendFormat(order: Order): OrderBackend {
    return {
      id: order.id,
      iduser: order.usuario_id,
      fecha: order.fecha.split('T')[0], // Asegurar formato YYYY-MM-DD
      total: order.total,
      lineas: order.lineas?.map(line => ({
        id: line.id,
        idpedido: line.idpedido,
        idprod: line.idprod,
        color: line.color,
        cant: line.cantidad, // cantidad -> cant
        nombre: line.nombre,
        precio: line.precio, // ✅ PRESERVAR: Precio unitario
        product: line.product // ✅ PRESERVAR: Objeto producto
      }))
    };
  }

  /**
   * ✅ CORREGIDO: Convierte OrderBackend a Order (frontend)
   * Ahora preserva el precio y el objeto product
   */
  static fromBackendFormat(orderBackend: OrderBackend): Order {
    console.log('📦 Transformando OrderBackend a Order:', orderBackend);
    
    return {
      id: orderBackend.id,
      usuario_id: orderBackend.iduser,
      fecha: orderBackend.fecha,
      total: orderBackend.total,
      lineas: orderBackend.lineas?.map(line => {
        const transformedLine = {
          id: line.id,
          idpedido: line.idpedido,
          idprod: line.idprod,
          color: line.color,
          cantidad: line.cant, // cant -> cantidad
          nombre: line.nombre,
          precio: line.precio || 0, // ✅ IMPORTANTE: Mapear precio
          product: line.product // ✅ IMPORTANTE: Incluir objeto product
        };
        
        console.log(`📋 Línea transformada: ${transformedLine.nombre} - Precio: ${transformedLine.precio}`);
        
        return transformedLine;
      })
    };
  }

  /**
   * Convierte CartItem[] a OrderLine[]
   */
  static cartItemsToOrderLines(cartItems: CartItem[], orderId: number = 0): OrderLine[] {
    return cartItems.map(item => ({
      idpedido: orderId,
      idprod: item.id,
      color: item.color || 'Estándar',
      cantidad: item.cantidad,
      nombre: item.nombre || '',
      precio: item.precio, // ✅ AÑADIDO: Incluir precio del carrito
      product: item.producto // ✅ AÑADIDO: Incluir producto
    }));
  }

  /**
   * Valida que un pedido tenga todos los campos requeridos
   */
  static validateOrder(order: Order): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!order.usuario_id || order.usuario_id <= 0) {
      errors.push('ID de usuario requerido');
    }

    if (!order.total || order.total <= 0) {
      errors.push('Total debe ser mayor a 0');
    }

    if (!order.lineas || order.lineas.length === 0) {
      errors.push('El pedido debe contener al menos un producto');
    }

    if (order.lineas) {
      order.lineas.forEach((line, index) => {
        if (!line.idprod || line.idprod <= 0) {
          errors.push(`Línea ${index + 1}: ID de producto requerido`);
        }
        if (!line.cantidad || line.cantidad <= 0) {
          errors.push(`Línea ${index + 1}: Cantidad debe ser mayor a 0`);
        }
        if (!line.color) {
          errors.push(`Línea ${index + 1}: Color requerido`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}