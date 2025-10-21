import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// Importaciones correctas de RxJS
import { Observable, of } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Product } from '../models/product'
import { Category } from '../models/category'
import { environment } from '../../environments/environment'
import { ProductImageHelper } from '../helpers/product-image-helper';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Corregido: Usando la ruta correcta
  private apiUrl = `${environment.apiUrl}/productos`
  private categoryUrl = `${environment.apiUrl}/categorias`

  // Subject para el popup de producto
  private selectedProductSubject = new BehaviorSubject<Product | null>(null)
  selectedProduct$ = this.selectedProductSubject.asObservable()

  // ✅ MAPEO ACTUALIZADO BASADO EN LA ESTRUCTURA REAL DE ASSETS
  private readonly PRODUCT_COLORS_MAP: { [key: string]: string[] } = {
    // ========== ANILLOS (dentro de piercing/) ==========
    'anillo con corazón': ['dorado', 'negro', 'plateado'],
    'anillo corazón': ['dorado', 'negro', 'plateado'], 
    'anillo con corazon': ['dorado', 'negro', 'plateado'],
    'anillo corazon': ['dorado', 'negro', 'plateado'],
    
    'anillo fino': ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
    'anillo con bisagra': ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
    'anillo bisagra': ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
    
    'aro para nostril': ['azul', 'multicolor', 'negro'],
    'aro nostril': ['azul', 'multicolor', 'negro'],
    
    'segment ring': ['azul', 'dorado', 'multicolor', 'rosa'],
    
    // ========== BANANAS (dentro de piercing/) ==========
    'banana con rosa': ['azul', 'celeste', 'rojo', 'rosa', 'verde'],
    'banana flor': ['azul', 'celeste', 'rojo', 'rosa', 'verde'],
    'banana con flor': ['azul', 'celeste', 'rojo', 'rosa', 'verde'],
    
    'banana con gema': ['azul', 'morado', 'transparente', 'rojo', 'verde', 'trebol'],
    'banana gema': ['azul', 'morado', 'transparente', 'rojo', 'verde', 'trebol'],
    
    'banana simple': ['dorado', 'plateado', 'multicolor'],
    'banana para el ombligo': ['dorado', 'plateado', 'multicolor'],
    'banana para ombligo': ['dorado', 'plateado', 'multicolor'],
    
    // ========== BARBELLS (dentro de piercing/) ==========
    'barbell con alas': ['plateado'],
    'barbells alas': ['plateado'],
    'barbell alas': ['plateado'],
    
    'barbell flecha': ['dorado', 'negro', 'plateado'],
    'barbells flecha': ['dorado', 'negro', 'plateado'],
    'barbell con flecha': ['dorado', 'negro', 'plateado'],
    
    'barbell largo': ['azul', 'cobre', 'dorado', 'mulicolor'],
    'barbells largo': ['azul', 'cobre', 'dorado', 'mulicolor'],
    
    // ========== CIRCULAR BARBELLS (dentro de piercing/) ==========
    'circular barbell con flecha': ['dorado', 'cobrejpg', 'negro'],
    'circular barbell flecha': ['dorado', 'cobrejpg', 'negro'],
    
    'circular barbell con piedra': ['cristal', 'negro'],
    'circular barbell piedra': ['cristal', 'negro'],
    
    // ========== LABRETS (dentro de piercing/) ==========
    'labret corazón': ['dorado', 'negro', 'plateado', 'rosa'],
    'labret con corazón': ['dorado', 'negro', 'plateado', 'rosa'],
    'labret corazon': ['dorado', 'negro', 'plateado', 'rosa'],
    
    'labret simple': ['cobre', 'dorado', 'negro', 'multicolor'],
    
    'labret triángulo': ['dorado', 'negro', 'plateado', 'rosa'],
    'labret triangulo': ['dorado', 'negro', 'plateado', 'rosa'],
    'labret con triángulo': ['dorado', 'negro', 'plateado', 'rosa'],
    'labret triangulos': ['dorado', 'negro', 'plateado', 'rosa'],
    
    // ========== PLUGS ==========
    'plug simple': ['amarillo', 'azul', 'morado', 'negro', 'blanco', 'verde'],
    'plug': ['amarillo', 'azul', 'morado', 'negro', 'blanco', 'verde'],
    
    'plug doble': ['amarillo', 'azul', 'beige', 'caoba', 'morado', 'rojo', 'verde'],
    'plug dobles': ['amarillo', 'azul', 'beige', 'caoba', 'morado', 'rojo', 'verde'],
    'plug de silicona': ['amarillo', 'azul', 'beige', 'caoba', 'morado', 'rojo', 'verde'],
    'plug silicona': ['amarillo', 'azul', 'beige', 'caoba', 'morado', 'rojo', 'verde'],
    
    // ========== DILATADORES Y EXPANDERS ==========
    'set de dilatadores': ['blanco', 'rosa', 'plateado', 'violeta'],
    'dilatadores': ['negro', 'rojo'],
    'dilatador': ['negro', 'rojo'],
    
    'expander duo': ['celeste', 'dorado', 'verde'],
    'expander con duo': ['celeste', 'dorado', 'verde'],
    
    'expander medusa': ['negro', 'verde'],
    'expander con medusa': ['negro', 'verde'],
    
    // ========== TÚNELES (organizados por material) ==========
    'túnel de acrílico': ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
    'tunel de acrílico': ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
    'túnel acrílico': ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
    'tunel acrilico': ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
    
    'túnel de metal': ['azul', 'cobre', 'dorado'],
    'tunel de metal': ['azul', 'cobre', 'dorado'],
    'túnel metal': ['azul', 'cobre', 'dorado'],
    'tunel metal': ['azul', 'cobre', 'dorado'],
    
    'túnel orfebre': ['dorado', 'plateado'],
    'tunel orfebre': ['dorado', 'plateado'],
    'túnel mandala': ['dorado', 'plateado'],
    'tunel mandala': ['dorado', 'plateado'],
    
    'túnel de silicona': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    'tunel de silicona': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    'túnel silicona': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    'tunel silicona': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    
    // ========== GENÉRICOS ==========
    'túnel simple': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    'tunel simple': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    'túnel': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    'tunel': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
    
    // ========== PIERCINGS GENERALES ==========
    'piercing': ['azul', 'cobre', 'dorado', 'negro', 'multicolor']
  };

  // Imagen por defecto
  defaultImage = 'assets/images/default.jpg'

  constructor (private http: HttpClient) {}

  // Método para obtener todos los productos
  getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener productos:', error)
        return of([])
      })
    )
  }

  // Método para obtener un producto específico
  getProduct (id: number): Observable<Product> {
    const url = `${this.apiUrl}/${id}`
    return this.http.get<Product>(url).pipe(
      catchError(error => {
        console.error(`Error al obtener producto ${id}:`, error)
        throw error
      })
    )
  }

  // Método pour obtener productos por categoría
  getProductsByCategory (categoryId: number): Observable<Product[]> {
    const url = `${this.apiUrl}/categoria/${categoryId}`
    console.log(
      'Solicitando productos por categoría:',
      categoryId,
      'desde:',
      url
    )
    return this.http.get<Product[]>(url).pipe(
      catchError(error => {
        return of([])
      })
    )
  }

  // Método para obtener una categoría específica
  getCategory (id: number): Observable<Category> {
    const url = `${this.categoryUrl}/${id}`
    return this.http.get<Category>(url)
  }

  // ✅ MÉTODO MEJORADO PARA OBTENER COLORES ESPECÍFICOS DEL PRODUCTO
  getProductColors(productId: number): Observable<string[]> {
    console.log('🎨 Obteniendo colores para producto ID:', productId);
    
    // Primero obtenemos el producto para conocer su nombre
    return this.getProduct(productId).pipe(
      map(product => {
        if (!product || !product.nombre) {
          console.warn('⚠️ Producto no encontrado o sin nombre');
          return ['Estándar'];
        }
        
        const productName = product.nombre.toLowerCase().trim();
        console.log('🔍 Buscando colores para:', productName);
        
        // Usar ProductImageHelper para obtener colores consistentes
        const availableColors = ProductImageHelper.getAvailableColors(productName);
        
        console.log('✅ Colores disponibles:', availableColors);
        return availableColors.length > 0 ? availableColors : ['Estándar'];
      }),
      catchError(error => {
        console.error('❌ Error obteniendo colores del producto:', error);
        return of(['Estándar']);
      })
    );
  }

  // ✅ MÉTODO ALTERNATIVO PARA OBTENER COLORES (usando mapeo local como fallback)
  private getAvailableColorsForProduct(productName: string): string[] {
    // Normalizar el nombre del producto
    const normalizedName = productName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
      .trim();
    
    console.log('🔍 Nombre normalizado:', normalizedName);
    
    // PASO 1: Buscar coincidencias exactas primero
    for (const [key, colors] of Object.entries(this.PRODUCT_COLORS_MAP)) {
      const normalizedKey = key
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      
      if (normalizedName === normalizedKey) {
        console.log(`🎯 Coincidencia exacta: "${key}" -> [${colors.join(', ')}]`);
        return colors;
      }
    }
    
    // PASO 2: Estrategia de coincidencias parciales flexibles
    const bestMatch = this.findBestPartialMatch(normalizedName);
    if (bestMatch.length > 0) {
      return bestMatch;
    }
    
    // PASO 3: Buscar por palabras clave específicas
    const keywordMatch = this.findByKeywords(normalizedName);
    if (keywordMatch.length > 0) {
      return keywordMatch;
    }
    
    // PASO 4: Buscar por tipo de producto
    const typeMatch = this.findByProductType(normalizedName);
    if (typeMatch.length > 0) {
      return typeMatch;
    }
    
    // Si no hay coincidencias específicas, devolver colores por defecto
    console.log('⚠️ No se encontraron colores específicos, usando por defecto');
    return ['Estándar'];
  }

  // ✅ ESTRATEGIA 3: Coincidencias parciales flexibles mejoradas
  private findBestPartialMatch(productName: string): string[] {
    let bestMatch: { key: string, colors: string[], score: number } = { key: '', colors: [], score: 0 };
    
    for (const [key, colors] of Object.entries(this.PRODUCT_COLORS_MAP)) {
      const normalizedKey = key
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      
      // Calcular puntuación de similitud
      const score = this.calculateSimilarityScore(productName, normalizedKey);
      
      if (score > bestMatch.score && score > 0.6) { // Umbral de similitud
        bestMatch = { key, colors, score };
      }
    }
    
    if (bestMatch.score > 0.6) {
      console.log(`🎯 Mejor coincidencia parcial: "${bestMatch.key}" (score: ${bestMatch.score.toFixed(2)}) -> [${bestMatch.colors.join(', ')}]`);
      return bestMatch.colors;
    }
    
    return [];
  }

  // ✅ Calcular puntuación de similitud entre dos strings
  private calculateSimilarityScore(str1: string, str2: string): number {
    const words1 = str1.split(' ').filter(w => w.length > 2); // Solo palabras de más de 2 caracteres
    const words2 = str2.split(' ').filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    let matchCount = 0;
    let totalWords = Math.max(words1.length, words2.length);
    
    // Contar palabras que coinciden exactamente
    for (const word1 of words1) {
      if (words2.includes(word1)) {
        matchCount += 1;
      } else {
        // Buscar coincidencias parciales (una palabra contiene a la otra)
        for (const word2 of words2) {
          if (word1.includes(word2) || word2.includes(word1)) {
            matchCount += 0.7; // Puntuación menor para coincidencias parciales
            break;
          }
        }
      }
    }
    
    return matchCount / totalWords;
  }

  // ✅ Búsqueda por palabras clave específicas
  private findByKeywords(productName: string): string[] {
    const keywordMatches: { [key: string]: string[] } = {
      'bisagra': ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
      'corazon': ['dorado', 'negro', 'plateado', 'rosa'],
      'triangulo': ['dorado', 'negro', 'plateado', 'rosa'],
      'flecha': ['dorado', 'negro', 'plateado'],
      'alas': ['plateado'],
      'gema': ['azul', 'morado', 'transparente', 'rojo', 'verde'],
      'acrilico': ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
      'acrílico': ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
      'silicona': ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
      'metal': ['azul', 'cobre', 'dorado'],
      'orfebre': ['dorado', 'plateado'],
      'mandala': ['dorado', 'plateado'],
      'nostril': ['azul', 'multicolor', 'negro'],
      'ombligo': ['dorado', 'plateado', 'multicolor'],
      'piedra': ['cristal', 'negro'],
      'duo': ['celeste', 'dorado', 'verde'],
      'medusa': ['negro', 'verde'],
      'rosa': ['azul', 'celeste', 'rojo', 'rosa', 'verde'],
      'flor': ['azul', 'celeste', 'rojo', 'rosa', 'verde']
    };
    
    for (const [keyword, colors] of Object.entries(keywordMatches)) {
      if (productName.includes(keyword)) {
        console.log(`🎯 Keyword match: "${keyword}" -> [${colors.join(', ')}]`);
        return colors;
      }
    }
    
    return [];  
  }

  // ✅ Búsqueda por tipo de producto
  private findByProductType(productName: string): string[] {
    const typeMatches: { [key: string]: string[] } = {
      'anillo': ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
      'aro': ['azul', 'multicolor', 'negro'],
      'banana': ['azul', 'dorado', 'plateado', 'verde', 'rojo'],
      'barbell': ['azul', 'cobre', 'dorado', 'negro', 'plateado'],
      'labret': ['cobre', 'dorado', 'negro', 'plateado', 'rosa'],
      'plug': ['amarillo', 'azul', 'negro', 'blanco', 'verde'],
      'tunel': ['azul', 'blanco', 'dorado', 'plateado', 'rojo', 'verde'],
      'túnel': ['azul', 'blanco', 'dorado', 'plateado', 'rojo', 'verde'],
      'expander': ['celeste', 'dorado', 'negro', 'verde'],
      'dilatador': ['blanco', 'negro', 'rosa', 'rojo', 'plateado', 'violeta'],
      'piercing': ['azul', 'cobre', 'dorado', 'negro', 'multicolor']
    };
    
    for (const [type, colors] of Object.entries(typeMatches)) {
      if (productName.includes(type)) {
        console.log(`🎯 Type match: "${type}" -> [${colors.join(', ')}]`);
        return colors;
      }
    }
    
    return [];
  }

  // Método para seleccionar un producto para el popup
  selectProductForPopup(product: Product): void {
    this.selectedProductSubject.next(product);
  }

  // Método para limpiar el producto seleccionado
  clearSelectedProduct(): void {
    console.log('Limpiando producto seleccionado');
    this.selectedProductSubject.next(null);
  }

  // Método para cerrar el popup
  closeProductPopup (): void {
    this.selectedProductSubject.next(null)
  }

  // Método para añadir un nuevo producto
  addProduct (product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
  }

  // Método para subir imágenes de productos
  uploadProductImages (productId: number, files: File[]): Observable<any> {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append('images', file, file.name)
    })
    return this.http.post<any>(`${this.apiUrl}/${productId}/images`, formData)
  }

  // Método para actualizar un producto existente
  updateProduct (productId: number, product: Product): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`
    return this.http.put<Product>(url, product)
  }

  // Método para eliminar un producto
  deleteProduct (productId: number): Observable<any> {
    const url = `${this.apiUrl}/${productId}`
    return this.http.delete<any>(url)
  }

  // Método para buscar productos
  searchProducts (term: string): Observable<Product[]> {
    const url = `${this.apiUrl}/search?q=${term}`
    return this.http.get<Product[]>(url).pipe(
      catchError(error => {
        console.error(`Error al buscar productos con término "${term}":`, error)
        return of([])
      })
    )
  }

  // Método para obtener la ruta de la imagen del producto
  getProductImageSrc(product: Product, selectedColor?: string): string {
    return ProductImageHelper.getProductImageSrc(product, selectedColor);
  }

  // Método para obtener productos destacados (para la página principal)
  getFeaturedProducts(): Observable<Product[]> {
    console.log('Solicitando productos destacados desde:', this.apiUrl);
    
    return this.getProducts().pipe(
      map(products => {
        return products.slice(0, 8);
      })
    );
  }

  // Método mejorado para manejar errores de carga de imágenes
  handleImageError (event: Event): void {
    const img = event.target as HTMLImageElement
    const originalSrc = img.src
    console.error(`Error al cargar imagen: ${originalSrc}`)

    img.src = this.defaultImage
    img.onerror = null
  }
}