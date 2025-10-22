import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { PdfService } from '../../services/pdf.service';
import { AuthService } from '../../services/auth.service';

// Usa el tipo que realmente exportas en tu proyecto
import { Order } from '../../models/order';

// Si tienes un modelo para User, impórtalo
import { User } from '../../models/user';

// Ajusta según tus datos reales de línea
interface LineaPedido { }

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.scss']
})
export class HistorialPedidosComponent implements OnInit, OnDestroy {
  pedidos: Order[] = [];
  currentUser: User | null = null;
  private subscription?: Subscription;

  constructor(
    private orderService: OrderService,
    private pdfService: PdfService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue || null;
    this.loadPedidos();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadPedidos(): void {
    try {
      this.subscription = this.orderService.getUserOrders().subscribe({
        next: (orders: Order[]) => {
          this.pedidos = orders;
        },
        error: (err) => console.error(err)
      });
    } catch (e) {
      console.error(e);
    }
  }

  descargarAlbaran(pedidoId: number): void {
    const pedido = this.pedidos.find((p) => p.id === pedidoId);
    if (!pedido || !this.currentUser) return;

    const lineas: LineaPedido[] = this.getLineasPedido(pedidoId);
    // Asegúrate que tu pdfService.generarAlbaran devuelve Promise<Blob>
    this.pdfService.generarAlbaran(pedido, lineas, this.currentUser).then(
      (pdfBlob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
          if (!reader.result) return;
          const base64data = reader.result.toString().split(',')[1];
          this.orderService.enviarAlbaranPorEmail(pedido, this.currentUser!, base64data)
            .subscribe({
              next: () => console.log('Email con albarán enviado'),
              error: (err) => console.error('Error enviando email', err),
            });
        };
      }
    );
  }

  getLineasPedido(pedidoId: number): LineaPedido[] {
    // Implementa la lógica real aquí según tu modelo/datos
    return [];
  }
}


