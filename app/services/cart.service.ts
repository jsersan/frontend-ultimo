import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';

// Interfaz para los elementos del carrito
export interface CartItem {
  id: number;
  producto?: Product;
  cantidad: number;
  color?: string;
  talla?: string;
  precio: number;
  nombre?: string; // Añadido para compatibilidad
  imagen?: string; // Añadido para compatibilidad
  quantity?: number; // Alias de cantidad para compatibilidad con algunos componentes
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private _cartItems = new BehaviorSubject<CartItem[]>([]);
  private _isCartOpen = new BehaviorSubject<boolean>(false);

  // Getters para los observables
  get cartItems() {
    return this._cartItems.asObservable();
  }
  
  // Añadido: Alias para cartItems como cart$ para solucionar el error en navbar.component.ts
  get cart$() {
    return this._cartItems.asObservable();
  }
  
  // Getter y setter para isCartOpen
  get isCartOpen(): boolean {
    return this._isCartOpen.value;
  }
  
  set isCartOpen(value: boolean) {
    this._isCartOpen.next(value);
  }
  
  // Observable para isCartOpen (por si se necesita suscribir)
  get isCartOpenObservable() {
    return this._isCartOpen.asObservable();
  }

  constructor() {
    // Recuperar carrito del localStorage al iniciar
    this.loadCart();
  }

  // Cargar carrito desde localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        // Asegurar compatibilidad - añadir quantity como alias de cantidad
        const updatedItems = items.map((item: CartItem) => ({
          ...item,
          quantity: item.cantidad // Agregar quantity como alias de cantidad
        }));
        this._cartItems.next(updatedItems);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        this._cartItems.next([]);
      }
    }
  }

  // Métodos para abrir/cerrar el carrito
  openCart(): void {
    console.log('CartService.openCart: Abriendo carrito...');
    
    // Establecer el estado
    this._isCartOpen.next(true);
    this.isCartOpen = true;
    
    // Manipular el DOM directamente para asegurar visibilidad
    setTimeout(() => {
      // Añadir clase a body
      document.body.classList.add('cart-open');
      
      // Obtener referencias a los elementos del carrito
      const cartModal = document.querySelector('.cart-modal') as HTMLElement;
      const cartPopup = document.querySelector('.cart-popup') as HTMLElement;
      const cartOverlay = document.querySelector('.cart-overlay') as HTMLElement;
      
      // Aplicar clases active
      if (cartModal) {
        cartModal.classList.add('active');
        console.log('CartService: Añadida clase active a .cart-modal');
      } else {
        console.warn('CartService: No se encontró elemento .cart-modal');
      }
      
      if (cartPopup) {
        cartPopup.classList.add('active');
        // Asegurar visibilidad con estilos inline
        cartPopup.style.display = 'flex';
        cartPopup.style.transform = 'translateX(0)';
        console.log('CartService: Añadida clase active a .cart-popup');
      } else {
        console.warn('CartService: No se encontró elemento .cart-popup');
      }
      
      if (cartOverlay) {
        cartOverlay.classList.add('active');
        // Asegurar visibilidad con estilos inline
        cartOverlay.style.display = 'block';
        console.log('CartService: Añadida clase active a .cart-overlay');
      } else {
        console.warn('CartService: No se encontró elemento .cart-overlay');
      }
      
      // Truco fallback adicional para estilos problemáticos
      const styleEl = document.createElement('style');
      styleEl.id = 'cart-force-styles';
      styleEl.innerHTML = `
        .cart-popup.active {
          display: flex !important;
          transform: translateX(0) !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        .cart-overlay.active {
          display: block !important;
          opacity: 1 !important;
        }
      `;
      // Eliminar si ya existe
      const existingStyle = document.getElementById('cart-force-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      document.head.appendChild(styleEl);
      
      console.log('CartService.openCart: Carrito abierto y visible');
    }, 0);
  }

  closeCart(): void {
    console.log('CartService.closeCart: Cerrando carrito...');
    
    // Establecer el estado
    this._isCartOpen.next(false);
    this.isCartOpen = false;
    
    // Manipular el DOM directamente para asegurar ocultamiento
    setTimeout(() => {
      // Quitar clase del body
      document.body.classList.remove('cart-open');
      
      // Obtener referencias a los elementos del carrito
      const cartModal = document.querySelector('.cart-modal') as HTMLElement;
      const cartPopup = document.querySelector('.cart-popup') as HTMLElement;
      const cartOverlay = document.querySelector('.cart-overlay') as HTMLElement;
      
      // Quitar clases active
      if (cartModal) {
        cartModal.classList.remove('active');
      }
      
      if (cartPopup) {
        cartPopup.classList.remove('active');
        // Opcional: resetear el transform para que la próxima apertura tenga animación
        setTimeout(() => {
          if (!this.isCartOpen) { // Verificamos que no se haya abierto de nuevo
            cartPopup.style.transform = 'translateX(100%)';
          }
        }, 300); // Esperamos a que termine la transición
      }
      
      if (cartOverlay) {
        cartOverlay.classList.remove('active');
      }
      
      console.log('CartService.closeCart: Carrito cerrado correctamente');
    }, 0);
  }

  // Método para alternar la visibilidad del carrito
  toggleCart(): void {
    if (this.isCartOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  // Método compatible con la nueva implementación
  setCartVisibility(isVisible: boolean): void {
    if (isVisible) {
      this.openCart();
    } else {
      this.closeCart();
    }
  }

  // Guardar carrito en localStorage
  private saveCart(items: CartItem[]): void {
    // Asegurar que cada item tenga quantity como alias de cantidad
    const itemsWithQuantity = items.map(item => ({
      ...item,
      quantity: item.cantidad
    }));
    
    this._cartItems.next(itemsWithQuantity);
    localStorage.setItem('cart', JSON.stringify(itemsWithQuantity));
  }

  // Obtener elementos del carrito actual
  getCartItems(): CartItem[] {
    return this._cartItems.getValue();
  }

  // Añadir producto al carrito
  addToCart(
    product: Product,
    quantity: number = 1,
    color?: string,
    size?: string
  ): void {
    const currentItems = this.getCartItems();
  
    // Buscar si el producto ya está en el carrito con las mismas opciones
    const existingItemIndex = currentItems.findIndex(
      item =>
        item.producto?.id === product.id &&
        item.color === color &&
        item.talla === size
    );
  
    if (existingItemIndex !== -1) {
      // Si ya existe, incrementamos la cantidad
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].cantidad += quantity;
      updatedItems[existingItemIndex].quantity = updatedItems[existingItemIndex].cantidad;
      this._cartItems.next(updatedItems);
    } else {
      // Si no existe, añadimos un nuevo item
      const newItem: CartItem = {
        id: product.id || Date.now(),
        producto: product, // Guardar el producto completo
        cantidad: quantity,
        quantity: quantity,
        color: color,
        talla: size,
        precio: product.precio,
        nombre: product.nombre,
        // Esta línea es opcional ahora que usamos producto
        imagen: `assets/images/${product.carpetaimg}/${product.imagen}`
      };
      this._cartItems.next([...currentItems, newItem]);
    }
  
    // Guardar en localStorage
    this.saveCart(this.getCartItems());
    
    // Abrir el carrito automáticamente al añadir producto
    // this.openCart();
  }

  // Actualizar cantidad de un item
  updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const currentItems = this.getCartItems();
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, cantidad: quantity, quantity: quantity } : item
    );

    this._cartItems.next(updatedItems);
    this.saveCart(updatedItems);
  }

  // Para compatibilidad con código existente
  updateItemQuantity(
    itemId: number,
    color: string,
    quantity: number
  ): void {
    if (quantity <= 0) {
      this.removeItem(itemId, color);
      return;
    }

    const currentItems = this.getCartItems();
    const updatedItems = currentItems.map(item => {
      if (item.id === itemId && item.color === color) {
        return { ...item, cantidad: quantity, quantity: quantity };
      }
      return item;
    });

    this._cartItems.next(updatedItems);
    this.saveCart(updatedItems);
  }

  // Eliminar un item del carrito
  removeItem(itemId: number, color?: string): void {
    const currentItems = this.getCartItems();
    let updatedItems;

    if (color) {
      // Si se especifica el color, filtramos por ID y color
      updatedItems = currentItems.filter(
        item => !(item.id === itemId && item.color === color)
      );
    } else {
      // Si no se especifica color, filtramos solo por ID
      updatedItems = currentItems.filter(item => item.id !== itemId);
    }

    this._cartItems.next(updatedItems);
    this.saveCart(updatedItems);
    
    // IMPORTANTE: Comentado para evitar el cierre automático del carrito
    // Ahora dejamos que el componente decida cuándo cerrar el carrito
    // if (updatedItems.length === 0) {
    //   this.closeCart();
    // }
  }

  // Vaciar el carrito
  clearCart(): void {
    this._cartItems.next([]);
    localStorage.removeItem('cart');
    
    // Cerrar el carrito al vaciarlo
    this.closeCart();
  }

  // Calcular el total del carrito
  getTotal(): number {
    return this.getCartItems().reduce(
      (total: number, item) => total + item.precio * item.cantidad,
      0
    );
  }

  // Alias para getTotal (para compatibilidad)
  getCartTotal(): number {
    return this.getTotal();
  }

  // Obtener el número de items en el carrito
  getItemCount(): number {
    return this.getCartItems().reduce((count, item) => count + item.cantidad, 0);
  }
}