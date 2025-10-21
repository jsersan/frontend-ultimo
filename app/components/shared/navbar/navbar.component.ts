import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { CategoryService } from '../../../services/category.service'
import { AuthService } from '../../../services/auth.service'
import { CartService } from '../../../services/cart.service'
import { Category } from '../../../models/category'
import { User } from '../../../models/user'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Propiedades del componente existentes
  isCartOpen: boolean = false;
  cartItemCount: number = 0;
  categories: Category[] = []
  currentUser: User | null = null
  searchTerm: string = ''

  // PROPIEDADES PARA LOS POPUPS
  showLoginPopup: boolean = false;
  showRegistroPopup: boolean = false;
  isUserLoggedIn: boolean = false;

  // Suscripciones para evitar memory leaks
  private userSubscription: Subscription = new Subscription();
  private cartSubscription: Subscription = new Subscription();

  constructor (
    private categoryService: CategoryService,
    private authService: AuthService,
    public cartService: CartService,
    public router: Router
  ) {}

  ngOnInit (): void {
    // Cargar categorías
    this.loadCategories()

    // Suscribirse a cambios en el usuario actual
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user
      this.isUserLoggedIn = !!user
      console.log('Estado de login actualizado:', this.isUserLoggedIn, user?.username || user?.nombre)
    })

    // Suscribirse a cambios en el carrito
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.reduce((total: number, item) => total + item.cantidad, 0);
    });

    // Limpiar estado del carrito al inicializar
    setTimeout(() => {
      if (this.cartService.isCartOpen) {
        this.cartService.closeCart()
      }

      const cartPopup = document.querySelector('.cart-popup') as HTMLElement
      const cartOverlay = document.querySelector('.cart-overlay') as HTMLElement

      if (cartPopup) cartPopup.classList.remove('active')
      if (cartOverlay) cartOverlay.classList.remove('active')

      document.body.style.overflow = 'auto'
    }, 1)
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    this.userSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  // ===== MÉTODOS PARA LOS POPUPS DE LOGIN Y REGISTRO =====

  /**
   * Maneja el click en el icono de perfil
   * Si el usuario está logueado, va al perfil. Si no, muestra el popup de login.
   */
  onProfileClick(): void {
    console.log('Profile clicked. User logged in:', this.isUserLoggedIn)
    
    if (this.isUserLoggedIn && this.currentUser) {
      // Si está logueado, ir al perfil
      this.router.navigate(['/profile']);
      console.log('Navegando al perfil del usuario:', this.currentUser.username || this.currentUser.nombre)
    } else {
      // Si no está logueado, mostrar popup de login
      this.showLoginPopup = true;
      this.showRegistroPopup = false; // Asegurar que registro esté cerrado
      console.log('Mostrando popup de login')
      
      // Prevenir scroll del body cuando el popup está abierto
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Cierra el popup de login
   */
  onCloseLoginPopup(): void {
    this.showLoginPopup = false;
    console.log('Popup de login cerrado')
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  /**
   * Maneja el login exitoso
   */
  onLoginSuccess(): void {
    this.showLoginPopup = false;
    console.log('Login exitoso - Usuario logueado:', this.currentUser?.username || this.currentUser?.nombre)
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
    
    // Opcional: mostrar mensaje de bienvenida
    if (this.currentUser?.nombre || this.currentUser?.username) {
      console.log(`¡Bienvenido/a ${this.currentUser.username || this.currentUser.nombre}!`)
    }
  }

  /**
   * Muestra el popup de registro (desde link "¡Regístrate!" del login)
   */
  mostrarRegistroPopup(): void {
    this.showRegistroPopup = true;
    this.showLoginPopup = false; // Cerrar login si estaba abierto
    console.log('Mostrando popup de registro')
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el popup de registro
   */
  onCloseRegistroPopup(): void {
    this.showRegistroPopup = false;
    console.log('Popup de registro cerrado')
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  /**
   * Maneja el registro exitoso
   */
  onRegistroSuccess(): void {
    this.showRegistroPopup = false;
    console.log('Registro exitoso')
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  /**
   * Cambia del popup de registro al popup de login
   */
  switchToLogin(): void {
    this.showRegistroPopup = false;
    this.showLoginPopup = true;
    console.log('Cambiando de registro a login')
  }

  /**
   * Cambia del popup de login al popup de registro
   */
  switchToRegistro(): void {
    this.showLoginPopup = false;
    this.showRegistroPopup = true;
    console.log('Cambiando de login a registro')
  }

  // ===== MÉTODOS EXISTENTES (CONSERVADOS) =====

  /**
   * Obtiene el ID de una subcategoría por nombre
   */
  getSubcategoryId(name: string): number {
    const normalizedSearchName = name.toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    const category = this.categories.find(cat => {
      const normalizedCatName = cat.nombre.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedCatName === normalizedSearchName;
    });
    
    // console.log(`Buscando categoría: "${name}" (normalizado: "${normalizedSearchName}")`);
    if (category) {
      // console.log(`Categoría encontrada: ${category.nombre} (ID: ${category.id})`);
    } else {
        console.log('Categoría no encontrada. Categorías disponibles:' 
        ,this.categories.map(c => `${c.nombre} (ID: ${c.id})`));
    }
    
    return category ? category.id : 0;
  }

  /**
   * Alternar visibilidad del carrito
   */
  toggleCartAndLog(): void {
    console.log('Cart icon clicked');
    this.cartService.toggleCart();
    console.log('After toggle, cart is open:', this.cartService.isCartOpen);
  }

  /**
   * Carga las categorías desde el servicio
   */
  loadCategories (): void {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        console.log('Categorías cargadas:', categories)
        this.categories = categories
      },
      error: error => console.error('Error loading categories', error)
    })
  }

  /**
   * Obtiene la categoría DILATACIONES
   */
  getDilatacionesCategory (): Category | undefined {
    return this.categories.find(
      category => category.nombre.toUpperCase() === 'DILATACIONES'
    )
  }

  /**
   * Obtiene la categoría PIERCINGS
   */
  getPiercingsCategory (): Category | undefined {
    return this.categories.find(
      category => category.nombre.toUpperCase() === 'PIERCINGS'
    )
  }

  /**
   * Obtiene subcategorías para DILATACIONES
   */
  getSubcategoriesForDilataciones (): Category[] {
    const dilataciones = this.getDilatacionesCategory()
    if (!dilataciones) return []

    const subcategories = this.categories.filter(
      category =>
        category.padre === dilataciones.id &&
        category.nombre.toUpperCase() !== 'DILATACIONES'
    )

    console.log('Subcategorías de DILATACIONES:', subcategories)
    return subcategories
  }

  /**
   * Obtiene subcategorías filtradas para DILATACIONES
   */
  getFilteredSubcategoriesForDilataciones (): Category[] {
    const dilataciones = this.getDilatacionesCategory()
    if (!dilataciones) return []

    const excludedNames = ['EXPANDERS', 'PLUGS', 'TUNELES','TÚNELES']

    return this.categories.filter(
      category =>
        category.padre === dilataciones.id &&
        !excludedNames.includes(category.nombre.toUpperCase())
    )
  }

  /**
   * Obtiene subcategorías filtradas para PIERCINGS
   */
  getFilteredSubcategoriesForPiercings(): Category[] {
    const piercings = this.getPiercingsCategory();
    if (!piercings) return [];
    
    const excludedNames = ['ANILLOS', 'BANANAS', 'BARBELLS', 'CIRCULAR BARBELLS', 'LABRETS'];
    
    return this.categories.filter(category => 
      category.padre === piercings.id && 
      !excludedNames.includes(category.nombre.toUpperCase())
    );
  }

  /**
   * Navega a una categoría específica
   */
  navigateToCategory (categoryId: number): void {
    console.log(`Navegando a categoría ID: ${categoryId}`)
    this.router.navigate(['/category', categoryId])
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  isAdmin (): boolean {
    return this.currentUser?.username === 'admin' || this.currentUser?.role === 'admin';
  }

  /**
   * Cierra la sesión del usuario
   */
  logout (): void {
    this.authService.logout()
    this.isUserLoggedIn = false
    this.currentUser = null
    this.router.navigate(['/'])
    console.log('Usuario deslogueado')
  }

  /**
   * Realiza una búsqueda
   */
  search(): void {
    if (this.searchTerm.trim()) {
      console.log('🔍 Navbar: Realizando búsqueda:', this.searchTerm);
      this.router.navigate(['/search'], {
        queryParams: { term: this.searchTerm.trim() }
      });
      // ✅ Limpiar el campo de búsqueda después de buscar
      this.searchTerm = '';
    } else {
      console.log('⚠️ Navbar: Término de búsqueda vacío');
    }
  }
}