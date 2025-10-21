import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  /**
   * Genera un albarán PDF de un pedido de forma profesional
   * @param pedido - Datos del pedido
   * @param lineas - Líneas del pedido
   * @param usuario - Datos del comprador
   */
  generarAlbaran(pedido: any, lineas: any[], usuario?: any): void {
    try {
      console.log('📋 Generando albarán para pedido:', pedido.id);
      console.log('📦 Líneas recibidas:', lineas);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      const primaryColor: [number, number, number] = [82, 102, 122];
      const lightGray: [number, number, number] = [242, 243, 244];

      // Encabezado
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text('ALBARÁN', 20, 25);
      
      pdf.setFontSize(10);
      pdf.text(`Ref: #${pedido.id}`, 20, 32);

      // Información del comprador (si se proporciona)
      yPosition = 55;
      if (usuario) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.text('Información del Comprador', 20, yPosition);
        
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.text(`Nombre: ${usuario.nombre || 'N/A'}`, 20, yPosition);
        
        yPosition += 7;
        pdf.text(`Email: ${usuario.email || 'N/A'}`, 20, yPosition);
        
        yPosition += 7;
        pdf.text(`Dirección: ${usuario.direccion || 'N/A'}`, 20, yPosition);
        
        yPosition += 7;
        pdf.text(`Ciudad: ${usuario.ciudad || 'N/A'} - CP: ${usuario.cp || 'N/A'}`, 20, yPosition);
        
        yPosition += 15;
      }

      // Información del pedido
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.text('Información del Pedido', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.text(`Fecha: ${this.formatearFecha(pedido.fecha)}`, 20, yPosition);
      
      yPosition += 7;
      pdf.text(`Referencia: #${pedido.id}`, 20, yPosition);
      
      yPosition += 7;
      pdf.text(`Total: €${pedido.total.toFixed(2)}`, 20, yPosition);

      // Tabla de productos
      yPosition += 20;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Productos', 20, yPosition);

      yPosition += 10;
      
      // Encabezado de tabla
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
      
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Producto', 25, yPosition);
      pdf.text('Color', 120, yPosition);
      pdf.text('Cantidad', 160, yPosition, { align: 'right' });
      pdf.text('Precio', pageWidth - 25, yPosition, { align: 'right' });

      yPosition += 10;

      // Filas de productos
      pdf.setFont('helvetica', 'normal');
      lineas.forEach((linea: any) => {
        const nombre = linea.nombre || 'Sin nombre';
        const color = linea.color || 'N/A';
        
        // Intentar obtener cantidad de 'cantidad' primero, luego 'cant'
        const cantidadRaw = linea.cantidad !== undefined ? linea.cantidad : linea.cant;
        const cantidad = parseInt(cantidadRaw) || 0;
        
        // Intentar obtener precio de 'precio' primero, luego 'product.precio'
        const precioRaw = linea.precio !== undefined ? linea.precio : linea.product?.precio;
        const precio = parseFloat(precioRaw) || 0;
        
        const precioLinea = precio * cantidad;
        
        console.log('📝 Línea procesada para PDF:', { 
          nombre, 
          color, 
          cantidad, 
          precio, 
          precioLinea,
          lineaOriginal: linea 
        });
        
        pdf.text(nombre, 25, yPosition);
        pdf.text(color, 120, yPosition);
        pdf.text(cantidad.toString(), 160, yPosition, { align: 'right' });
        pdf.text(`€ ${precioLinea.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });
        
        yPosition += 8;

        // Añadir nueva página si se llena
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          
          // Encabezado de tabla en nueva página
          yPosition = 20;
          pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
          pdf.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
          
          pdf.setFontSize(9);
          pdf.setTextColor(0, 0, 0);
          pdf.text('Producto', 25, yPosition);
          pdf.text('Color', 120, yPosition);
          pdf.text('Cantidad', 160, yPosition, { align: 'right' });
          pdf.text('Precio', pageWidth - 25, yPosition, { align: 'right' });
          
          yPosition += 10;
        }
      });

      // Línea separadora
      yPosition += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);

      // Total
      yPosition += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('TOTAL:', 20, yPosition);
      pdf.text(` € ${pedido.total.toFixed(2)}`, pageWidth - 21, yPosition, { align: 'right' });

      // Pie de página
      yPosition = pageHeight - 20;
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Este documento fue generado automáticamente', 20, yPosition);
      pdf.text(`Página 1`, pageWidth - 30, yPosition);

      // Descargar
      const filename = `Albaran_${pedido.id}_${new Date().getTime()}.pdf`;
      pdf.save(filename);
      console.log('✅ Albarán descargado:', filename);

    } catch (error) {
      console.error('❌ Error al generar albarán:', error);
    }
  }

  /**
   * Formatea la fecha
   */
  private formatearFecha(fecha: any): string {
    if (!fecha) return '';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  }
}