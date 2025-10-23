import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { OrderService } from '../../services/order.service'
import { PdfService } from '../../services/pdf.service'
import { AuthService } from '../../services/auth.service'
import { Order, OrderLine } from '../../models/order'
import { User } from '../../models/user'

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.scss']
})
export class HistorialPedidosComponent implements OnInit, OnDestroy {
  pedidos: (Order & { expanded?: boolean })[] = []
  currentUser: User | null = null
  private subscription?: Subscription

  constructor (
    private orderService: OrderService,
    private pdfService: PdfService,
    private authService: AuthService
  ) {}

  ngOnInit (): void {
    this.currentUser = this.authService.currentUserValue || null
    this.loadPedidos()
  }

  ngOnDestroy (): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  loadPedidos (): void {
    this.subscription = this.orderService.getUserOrders().subscribe({
      next: (orders: Order[]) => {
        // Ordena del más reciente al más antiguo
        this.pedidos = orders
          .sort((a, b) => {
            const dateB = new Date(b.fecha).getTime()
            const dateA = new Date(a.fecha).getTime()
            if (dateB !== dateA) {
              return dateB - dateA
            }
            return (b.id ?? 0) - (a.id ?? 0)
          })
          .map(p => ({ ...p, expanded: false }))
      },
      error: err => console.error(err)
      
    })
  }

  descargarAlbaran (pedidoId: number): void {
    const pedido = this.pedidos.find(p => p.id === pedidoId);
    console.log('Lineas del pedido:', pedido?.lineas); // <--- aquí
    if (!pedido || !this.currentUser) return

    if (!pedido.lineas || pedido.lineas.length === 0) {
      // SOLO ejecuta si tienes implementado getOrderLines en el servicio
      if (typeof this.orderService.getOrderLines === 'function') {
        this.orderService
          .getOrderLines(pedido.id ?? 0)
          .subscribe((lineas: OrderLine[]) => {
            this.pdfService.generarAlbaran(pedido, lineas, this.currentUser)
          })
      } else {
        alert('No está implementado el método getOrderLines en OrderService')
      }
      return
    } else {
      this.pdfService.generarAlbaran(pedido, pedido.lineas, this.currentUser)
    }
  }
}
