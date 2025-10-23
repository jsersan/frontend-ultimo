// checkout.component.ts - CON SOLUCIÓN TEMPORAL

import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { CartService } from '../../services/cart.service'
import { AuthService } from '../../services/auth.service'
import { ProductService } from '../../services/product.service'
import { Order, OrderLine } from 'src/app/models/order'
import { CartItem } from 'src/app/models/order'
import { OrderService } from 'src/app/services/order.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup
  cartItems: CartItem[] = []
  total: number = 0
  loading: boolean = false
  showOrder: boolean = true
  showDelivery: boolean = false
  showPayment: boolean = false
  currentUser: any
  useUserDataDirectly: boolean = true

  constructor (
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    public productService: ProductService
  ) {
    console.log('🔧 CheckoutComponent inicializado')

    this.checkoutForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      ciudad: ['', [Validators.required, Validators.minLength(2)]],
      cp: ['', [Validators.required, Validators.pattern(/^\d{4,5}$/)]],
      telefono: ['']
    })
  }

  ngOnInit (): void {
    console.log('🚀 Inicializando CheckoutComponent')
    document.body.style.overflow = 'hidden'

    this.currentUser = this.authService.currentUserValue
    console.log('👤 Usuario actual:', this.currentUser?.username || 'No autenticado')

    if (!this.currentUser) {
      console.warn('⚠️ Usuario no autenticado, redirigiendo al login')
      Swal.fire({
        title: 'Debes iniciar sesión',
        text: 'Para proceder con la compra necesitas estar autenticado',
        icon: 'warning',
        confirmButtonColor: '#52667a'
      }).then(() => {
        this.closeCheckout()
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/checkout' }
        })
      })
      return
    }

    console.log('🔍 Verificando datos del usuario:', {
      nombre: this.currentUser?.nombre,
      direccion: this.currentUser?.direccion,
      ciudad: this.currentUser?.ciudad,
      cp: this.currentUser?.cp,
      email: this.currentUser?.email
    })

    const hasCompleteUserData =
      this.currentUser.nombre &&
      this.currentUser.direccion &&
      this.currentUser.ciudad &&
      this.currentUser.cp

    if (hasCompleteUserData) {
      console.log('✅ Usuario tiene datos completos, usando datos directamente')
      this.useUserDataDirectly = true
    } else {
      console.log('⚠️ Usuario con datos incompletos, usando formulario')
      this.useUserDataDirectly = false
    }

    this.cartService.cartItems.subscribe(items => {
      console.log('🛒 Items del carrito recibidos:', items.length)

       this.cartItems = items.map(item => {
        return {
          id: item.id,
          nombre: item.nombre || '',
          color: item.color || 'Estándar',
          cantidad: item.cantidad,
          precio: item.precio,
          imagen: item.imagen || '',
          producto:
            typeof item.producto === 'object'
              ? JSON.stringify(item.producto)
              : item.producto || ''
        } as CartItem
      })


      
      this.total = this.cartService.getCartTotal()
      console.log('💰 Total calculado:', this.total)

      if (this.cartItems.length === 0) {
        console.warn('⚠️ Carrito vacío, cerrando checkout')
        Swal.fire({
          title: 'Carrito vacío',
          text: 'No hay productos en el carrito para procesar',
          icon: 'info',
          confirmButtonColor: '#52667a'
        }).then(() => {
          this.closeCheckout()
        })
      }
    })

    if (this.currentUser && !this.useUserDataDirectly) {
      console.log('📝 Prellenando formulario con datos del usuario')
      const userData = this.preprocessUserData(this.currentUser)
      this.checkoutForm.patchValue(userData)
      this.checkoutForm.updateValueAndValidity()

      console.log('📊 Estado del formulario después de prellenar:', {
        valid: this.checkoutForm.valid,
        errors: this.getFormErrors(),
        values: this.checkoutForm.value
      })
    }

    document.addEventListener('keydown', this.handleEscapeKey.bind(this))
  }

  ngOnDestroy (): void {
    console.log('🧹 Destruyendo CheckoutComponent')
    document.body.style.overflow = 'auto'
    document.removeEventListener('keydown', this.handleEscapeKey.bind(this))
  }

  private preprocessUserData (user: any) {
    return {
      nombre: user.nombre || '',
      direccion: user.direccion || '',
      ciudad: user.ciudad || '',
      cp: user.cp || '',
      telefono: user.telefono || ''
    }
  }

  private getFormErrors (): any {
    const errors: any = {}
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key)
      if (control && control.errors) {
        errors[key] = control.errors
      }
    })
    return errors
  }

  getImageSrc (item: CartItem): string {
    if (item.producto) {
      if (typeof item.producto === 'string') {
        try {
          const productoObj = JSON.parse(item.producto)
          return this.productService.getProductImageSrc(productoObj)
        } catch (e) {
          return 'assets/images/default.jpg'
        }
      } else {
        return this.productService.getProductImageSrc(item.producto)
      }
    }
    return item.imagen || 'assets/images/default.jpg'
  }

  handleImageError (event: any): void {
    this.productService.handleImageError(event)
  }

  private handleEscapeKey (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      console.log('⌨️ Tecla ESC presionada, cerrando checkout')
      this.closeCheckout()
    }
  }

  closeCheckout (): void {
    console.log('🚪 Cerrando checkout')
    document.body.style.overflow = 'auto'
    this.router.navigate(['/'])
  }

  /**
   * ✅ VERSIÓN CON SOLUCIÓN TEMPORAL
   * Muestra el mensaje de éxito sin el número de pedido si el backend no lo devuelve
   */
  placeOrder(): void {
    console.log('🚀 Iniciando procesamiento del pedido...');
  
    if (!this.currentUser) {
      console.error('❌ Error de autenticación durante el procesamiento');
      Swal.fire({
        title: 'Error de autenticación',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        icon: 'error',
        confirmButtonColor: '#52667a'
      }).then(() => {
        this.closeCheckout();
        this.router.navigate(['/login']);
      });
      return;
    }
  
    if (this.cartItems.length === 0) {
      console.warn('⚠️ Intento de procesar pedido con carrito vacío');
      Swal.fire({
        title: 'El carrito está vacío',
        text: 'No puedes procesar un pedido sin productos',
        icon: 'warning',
        confirmButtonColor: '#52667a'
      });
      return;
    }
  
    let shippingData: any;
  
    if (this.useUserDataDirectly) {
      console.log('📋 Usando datos del usuario directamente');
      shippingData = {
        nombre: this.currentUser.nombre,
        direccion: this.currentUser.direccion,
        ciudad: this.currentUser.ciudad,
        cp: this.currentUser.cp
      };
  
      if (!shippingData.nombre || !shippingData.direccion || !shippingData.ciudad || !shippingData.cp) {
        console.warn('⚠️ Datos del usuario incompletos');
        Swal.fire({
          title: 'Perfil incompleto',
          text: 'Para proceder con la compra necesitas completar tu perfil (nombre, dirección, ciudad, código postal)',
          icon: 'warning',
          confirmButtonColor: '#52667a',
          showCancelButton: true,
          cancelButtonText: 'Más tarde',
          confirmButtonText: 'Completar perfil'
        }).then(result => {
          if (result.isConfirmed) {
            this.closeCheckout();
            this.router.navigate(['/profile']);
          }
        });
        return;
      }
    } else {
      console.log('📋 Usando datos del formulario');
      console.log('📊 Estado del formulario:', {
        valid: this.checkoutForm.valid,
        errors: this.getFormErrors(),
        values: this.checkoutForm.value
      });
  
      if (this.checkoutForm.invalid) {
        console.warn('⚠️ Formulario inválido:', this.getFormErrors());
        Object.keys(this.checkoutForm.controls).forEach(key => {
          const control = this.checkoutForm.get(key);
          control?.markAsTouched();
        });
        const errorMessages = Object.keys(this.getFormErrors())
          .map(field => {
            return `${field}: ${this.getErrorMessage(field)}`;
          })
          .join('\n');
        Swal.fire({
          title: 'Datos incompletos',
          text: `Por favor corrige los siguientes errores:\n${errorMessages}`,
          icon: 'warning',
          confirmButtonColor: '#52667a'
        });
        return;
      }
      shippingData = this.checkoutForm.value;
    }
  
    console.log('📦 Datos de envío a usar:', shippingData);
    this.loading = true;
    console.log('⏳ Iniciando carga...');
  
    try {
      // MODIFICA AQUÍ: usa 'cant' y 'precio', que espera el backend
      console.log(this.cartItems) 
      const orderLines: OrderLine[] = this.cartItems.map(item => {
        return {
          idpedido: 0,
          idprod: item.id,
          color: item.color || 'Estándar',
          cantidad: item.cantidad,
          precio: !isNaN(Number(item.precio)) && Number(item.precio) > 0
          ? Number(item.precio)
          : item.producto && typeof item.producto === 'object' && item.producto.precio
            ? Number(item.producto.precio)
            : 0,        
          nombre: item.nombre,
          cant: item.cantidad
        }
      });
      
      
      const order: Order = {
        id: 0,
        usuario_id: this.currentUser.id,
        fecha: new Date().toISOString().split('T')[0],
        total: this.total,
        lineas: orderLines,
        estado: 'pendiente'
      };
  
      if (!this.currentUser?.id) {
        console.error('❌ CRÍTICO: currentUser.id no está disponible');
        Swal.fire({
          title: 'Error de sesión',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          icon: 'error',
          confirmButtonColor: '#52667a'
        });
        this.loading = false;
        return;
      }
  
      console.log('✅ Pedido preparado con usuario_id:', order.usuario_id);
      console.log("Pedido completo:", order);
  
      this.orderService.createOrder(order).subscribe({
        next: response => {
          console.log('✅ Pedido creado exitosamente:', response);
          this.loading = false;
          this.cartService.clearCart();
          console.log('🧹 Carrito vaciado');
          // ✅ Mensaje de éxito, mostrando el número de pedido si lo devuelve el backend
          let mensajeExito = '¡Tu pedido ha sido procesado correctamente!';
          if (response && response.id) {
            mensajeExito = `Tu pedido ha sido procesado correctamente. Número de pedido: ${response.id}`;
            console.log('🎫 Número de pedido:', response.id);
          } else {
            console.warn('⚠️ El backend no devolvió el ID del pedido');
            mensajeExito = 'Tu pedido ha sido procesado correctamente. Podrás verlo en tu historial de pedidos.';
          }
          Swal.fire({
            title: '¡Pago realizado con éxito!',
            text: mensajeExito,
            icon: 'success',
            confirmButtonColor: '#52667a',
            confirmButtonText: 'Ver mis pedidos'
          }).then(() => {
            this.closeCheckout();
            this.router.navigate(['/profile']);
          });
        },
        error: error => {
          console.error('❌ Error al crear el pedido:', error);
          this.loading = false;
          const errorMessage =
            error.message ||
            'Hubo un problema al procesar tu pedido. Por favor, inténtalo de nuevo.';
          Swal.fire({
            title: 'Error al procesar el pedido',
            text: errorMessage,
            icon: 'error',
            confirmButtonColor: '#52667a',
            confirmButtonText: 'Intentar de nuevo'
          });
          if (error.status === 401) {
            console.warn('🔒 Error de autenticación, cerrando sesión');
            this.authService.logout();
            this.closeCheckout();
            this.router.navigate(['/login']);
          }
        }
      });
    } catch (error) {
      console.error('💥 Error inesperado:', error);
      this.loading = false;
      Swal.fire({
        title: 'Error inesperado',
        text: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonColor: '#52667a'
      });
    }
  }
  

  goToDelivery (): void {
    this.showOrder = false
    this.showDelivery = true
    this.showPayment = false
  }

  goToPayment (): void {
    if (!this.useUserDataDirectly && this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key)
        control?.markAsTouched()
      })
      return
    }

    this.showOrder = false
    this.showDelivery = false
    this.showPayment = true
  }

  goToOrder (): void {
    this.showOrder = true
    this.showDelivery = false
    this.showPayment = false
  }

  hasError (field: string): boolean {
    if (this.useUserDataDirectly) return false
    const control = this.checkoutForm.get(field)
    return control ? control.invalid && control.touched : false
  }

  getErrorMessage (field: string): string {
    if (this.useUserDataDirectly) return ''
    const control = this.checkoutForm.get(field)

    if (!control || !control.errors) return ''

    if (control.hasError('required')) {
      return 'Este campo es obligatorio'
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength
      return `Debe tener al menos ${minLength} caracteres`
    }

    if (control.hasError('pattern')) {
      if (field === 'cp') {
        return 'Debe ser un código postal válido de 4-5 dígitos'
      }
      if (field === 'telefono') {
        return 'Debe ser un número de teléfono válido de 9 dígitos'
      }
    }

    return 'Campo inválido'
  }

  private convertOrderLinesToCartItems (orderLines: OrderLine[]): CartItem[] {
    return orderLines.map(line => {
      return {
        id: line.idprod,
        nombre: line.nombre || '',
        cantidad: line.cantidad,
        color: line.color,
        precio: this.findCartItemPrice(line.idprod, line.color),
        imagen: this.findCartItemImage(line.idprod, line.color),
        producto: this.findCartItemProducto(line.idprod, line.color)
      } as CartItem
    })
  }

  private findCartItemPrice (id: number, color: string): number {
    const item = this.cartItems.find(i => i.id === id && i.color === color)
    return item?.precio ?? 0
  }

  private findCartItemImage (id: number, color: string): string {
    const item = this.cartItems.find(i => i.id === id && i.color === color)
    return item?.imagen ?? ''
  }

  private findCartItemProducto (id: number, color: string): string {
    const item = this.cartItems.find(i => i.id === id && i.color === color)
    return item?.producto ?? ''
  }
}