import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { PdfService } from '../../services/pdf.service';
import { Order } from '../../models/order';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

interface PedidoExpandible extends Order {
  expanded?: boolean;
}

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.scss']
})
export class HistorialPedidosComponent implements OnInit, OnDestroy {
  pedidos: PedidoExpandible[] = [];
  loading: boolean = true;
  currentUser: User | null = null;
  error: string | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private pdfService: PdfService
  ) {
    console.log('🔧 HistorialPedidosComponent inicializado');
  }

  ngOnInit(): void {
    console.log('🚀 Inicializando HistorialPedidosComponent');
    
    this.currentUser = this.authService.currentUserValue;
    console.log('👤 Usuario actual:', this.currentUser?.username || 'No autenticado');
    
    if (this.currentUser && this.currentUser.id) {
      this.cargarPedidos();
    } else {
      console.warn('⚠️ Usuario no autenticado');
      this.loading = false;
      this.error = 'Usuario no autenticado';
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarPedidos(): void {
    if (!this.currentUser?.id) {
      console.error('❌ No hay usuario autenticado');
      this.loading = false;
      return;
    }

    console.log('📦 Cargando pedidos del usuario:', this.currentUser.id);
    this.loading = true;
    this.error = null;
    
    this.subscription = this.orderService.getUserOrders().subscribe({
      next: (orders: Order[]) => {
        console.log('📥 Pedidos recibidos:', orders.length);
        console.log('📋 Estructura de pedidos:', JSON.stringify(orders, null, 2));
        
        this.pedidos = orders.map(pedido => ({
          ...pedido,
          expanded: false
        }));
        
        this.pedidos.sort((a, b) => (b.id || 0) - (a.id || 0));
        
        console.log('✅ Pedidos procesados:', this.pedidos.length);
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar pedidos:', error);
        this.loading = false;
        this.error = error.message || 'Error al cargar los pedidos. Por favor, inténtalo de nuevo.';
      }
    });
  }

  togglePedido(index: number): void {
    if (this.pedidos[index]) {
      console.log(`🔄 Toggle pedido ${this.pedidos[index].id}`);
      this.pedidos[index].expanded = !this.pedidos[index].expanded;
    }
  }

  getLineasPedido(idPedido: number): any[] {
    const pedido = this.pedidos.find(p => p.id === idPedido);
    const lineas = pedido?.lineas || [];
    
    console.log(`📋 Líneas del pedido ${idPedido}:`, lineas);
    
    return lineas;
  }

  /**
   * ✅ Calcula correctamente el subtotal
   * Usa 'cantidad' (frontend) no 'cant' (backend)
   */
  calcularPrecioLinea(linea: any): number {
    const cantidad = linea.cantidad || linea.cant || 1;
    const precio = linea.precio || linea.product?.precio || 0;
    const subtotal = precio * cantidad;
    
    console.log(`💰 ${linea.nombre}: ${cantidad} x ${precio} = ${subtotal}`);
    
    return subtotal;
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return 'Fecha no disponible';
    
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Fecha no disponible';
    }
  }

  /**
   * ✅ MÉTODO PARA DESCARGAR ALBARÁN EN PDF
   */
  descargarAlbaran(pedidoId: number): void {
    console.log('📥 Descargando albarán para pedido:', pedidoId);
    
    const pedido = this.pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
      console.error('❌ Pedido no encontrado');
      alert('No se pudo encontrar el pedido');
      return;
    }

    const lineas = this.getLineasPedido(pedidoId);
    
    if (!lineas || lineas.length === 0) {
      console.error('❌ No hay líneas en el pedido');
      alert('Este pedido no tiene productos');
      return;
    }
    
    console.log('📄 Generando PDF con:', { pedido, lineas, usuario: this.currentUser });
    
    // Llamar al servicio PDF
    this.pdfService.generarAlbaran(pedido, lineas, this.currentUser);
  }

  recargarPedidos(): void {
    console.log('🔄 Recargando pedidos...');
    this.cargarPedidos();
  }

  hasPedidos(): boolean {
    return this.pedidos && this.pedidos.length > 0;
  }
}