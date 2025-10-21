// src/app/components/product/product-popup/product-popup.component.ts - VERSIÓN ACTUALIZADA

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ProductImageHelper } from '../../../helpers/product-image-helper';

@Component({
  selector: 'app-product-popup',
  templateUrl: './product-popup.component.html',
  styleUrls: []
})
export class ProductPopupComponent implements OnInit, OnDestroy {
  currentProduct: Product | null = null;
  isOpen: boolean = false;
  quantity: number = 1;
  selectedColor: string = '';
  availableColors: string[] = [];
  loading: boolean = false;
  currentImageSrc: string = '';
  private subscription: Subscription | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Suscripción al observable de producto seleccionado
    this.subscription = this.productService.selectedProduct$.subscribe(product => {
      if (product) {
        console.log('🛍️ ProductPopupComponent recibió producto:', product.nombre);
        this.currentProduct = product;
        this.isOpen = true;
        this.resetOptions();
        this.loadProductColors();
      } else {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * ✅ MÉTODO MEJORADO: Cargar colores específicos del producto
   */
  loadProductColors(): void {
    if (!this.currentProduct) return;

    this.loading = true;
    console.log('🎨 Cargando colores para:', this.currentProduct.nombre);
    
    // Llamar al método actualizado del servicio
    this.productService.getProductColors(this.currentProduct.id).subscribe({
      next: (colors) => {
        this.loading = false;
        console.log('✅ Colores recibidos del servicio:', colors);
        
        if (colors && colors.length > 0) {
          this.availableColors = colors;
          this.selectedColor = colors[0]; // Seleccionar el primer color por defecto
          console.log('🎯 Color seleccionado por defecto:', this.selectedColor);
        } else {
          this.availableColors = ['Estándar'];
          this.selectedColor = 'Estándar';
        }
        
        // Actualizar la imagen según el color seleccionado
        this.updateImageForSelectedColor();
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error loading product colors:', err);
        
        // ✅ FALLBACK: Usar ProductImageHelper si falla el servicio
        const fallbackColors = ProductImageHelper.getAvailableColors(this.currentProduct?.nombre || '');
        console.log('🔄 Usando colores de fallback:', fallbackColors);
        
        this.availableColors = fallbackColors;
        this.selectedColor = fallbackColors[0] || 'Estándar';
        this.updateImageForSelectedColor();
      }
    });
  }

  /**
   * ✅ NUEVO: Actualizar imagen cuando cambia el color
   */
  updateImageForSelectedColor(): void {
    if (this.currentProduct) {
      this.currentImageSrc = ProductImageHelper.getProductImageSrc(
        this.currentProduct, 
        this.selectedColor
      );
      console.log('🖼️ Imagen actualizada para color', this.selectedColor, ':', this.currentImageSrc);
    }
  }

  /**
   * ✅ MEJORADO: Manejar cambio de color
   */
  onColorChange(): void {
    console.log('🎨 Color cambiado a:', this.selectedColor);
    this.updateImageForSelectedColor();
  }

  // Cerrar el popup
  closePopup(): void {
    this.isOpen = false;
    setTimeout(() => {
      this.productService.clearSelectedProduct();
    }, 300); // Dar tiempo para la animación de cierre
  }

  // Añadir al carrito
  addToCart(): void {
    if (this.currentProduct) {
      console.log('🛒 Añadiendo al carrito:', {
        producto: this.currentProduct.nombre,
        color: this.selectedColor,
        cantidad: this.quantity
      });
      
      this.cartService.addToCart(
        this.currentProduct,
        this.quantity,
        this.selectedColor
      );
      this.closePopup();
      
      // Mostrar confirmación
      console.log(`✅ Producto añadido: ${this.currentProduct.nombre} - Color: ${this.selectedColor} - Cantidad: ${this.quantity}`);
    }
  }

  // Incrementar cantidad
  incrementQuantity(): void {
    this.quantity++;
  }

  // Decrementar cantidad (mínimo 1)
  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Resetear opciones al abrir el popup
  private resetOptions(): void {
    this.quantity = 1;
    this.selectedColor = '';
    this.availableColors = [];
    this.currentImageSrc = '';
  }

  /**
   * ✅ MEJORADO: Método para obtener la imagen con el color seleccionado
   */
  getImagePath(): string {
    if (this.currentImageSrc) {
      return this.currentImageSrc;
    }
    
    if (!this.currentProduct) {
      return 'assets/images/default.jpg';
    }
    
    return ProductImageHelper.getProductImageSrc(this.currentProduct, this.selectedColor);
  }

  /**
   * ✅ NUEVO: Verificar si hay múltiples colores disponibles
   */
  hasMultipleColors(): boolean {
    return this.availableColors.length > 1;
  }

  /**
   * ✅ NUEVO: Obtener mensaje de colores disponibles
   */
  getColorsMessage(): string {
    if (this.availableColors.length <= 1) {
      return 'Color único disponible';
    }
    return `${this.availableColors.length} colores disponibles`;
  }
}