// src/app/helpers/product-image-helper.ts - VERSIÓN CORREGIDA PARA PLUGS

export class ProductImageHelper {
  
  // ✅ MAPEO ACTUALIZADO CON RUTAS CORREGIDAS SEGÚN NUEVA ESTRUCTURA
  private static readonly PRODUCT_FOLDER_MAP: { [key: string]: { folder: string; colors: string[]; fallbackColor: string } } = {
    // ========== ANILLOS (dentro de piercing/) ==========
    'anillo con corazón': { 
      folder: 'piercing/anillo/anillo-corazon', 
      colors: ['dorado', 'negro', 'plateado'],
      fallbackColor: 'dorado'
    },
    'anillo corazón': { 
      folder: 'piercing/anillo/anillo-corazon', 
      colors: ['dorado', 'negro', 'plateado'],
      fallbackColor: 'dorado'
    },
    'anillo con corazon': { 
      folder: 'piercing/anillo/anillo-corazon', 
      colors: ['dorado', 'negro', 'plateado'],
      fallbackColor: 'dorado'
    },
    'anillo corazon': { 
      folder: 'piercing/anillo/anillo-corazon', 
      colors: ['dorado', 'negro', 'plateado'],
      fallbackColor: 'dorado'
    },
    
    'anillo con bisagra': { 
      folder: 'piercing/anillo/anillo-bisagra', 
      colors: ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
      fallbackColor: 'dorado'
    },
    'anillo bisagra': { 
      folder: 'piercing/anillo/anillo-bisagra', 
      colors: ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
      fallbackColor: 'dorado'
    },
    'anillo fino': { 
      folder: 'piercing/anillo/anillo-bisagra', 
      colors: ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
      fallbackColor: 'dorado'
    },
    
    'aro para nostril': { 
      folder: 'piercing/anillo/aro-nostril', 
      colors: ['azul', 'multicolor', 'negro'],
      fallbackColor: 'azul'
    },
    'aro nostril': { 
      folder: 'piercing/anillo/aro-nostril', 
      colors: ['azul', 'multicolor', 'negro'],
      fallbackColor: 'azul'
    },
    
    'segment ring': { 
      folder: 'piercing/anillo/segment-ring', 
      colors: ['azul', 'dorado', 'multicolor', 'rosa'],
      fallbackColor: 'dorado'
    },
    
    // ========== BANANAS (dentro de piercing/) ==========
    'banana con rosa': { 
      folder: 'piercing/banana/banana-flor', 
      colors: ['azul', 'celeste', 'rojo', 'rosa', 'verde'],
      fallbackColor: 'rosa'
    },
    'banana flor': { 
      folder: 'piercing/banana/banana-flor', 
      colors: ['azul', 'celeste', 'rojo', 'rosa', 'verde'],
      fallbackColor: 'rosa'
    },
    'banana con flor': { 
      folder: 'piercing/banana/banana-flor', 
      colors: ['azul', 'celeste', 'rojo', 'rosa', 'verde'],
      fallbackColor: 'rosa'
    },
    
    'banana con gema': { 
      folder: 'piercing/banana/banana-gema', 
      colors: ['azul', 'morado', 'transparente', 'rojo', 'verde', 'trebol'],
      fallbackColor: 'azul'
    },
    'banana gema': { 
      folder: 'piercing/banana/banana-gema', 
      colors: ['azul', 'morado', 'transparente', 'rojo', 'verde', 'trebol'],
      fallbackColor: 'azul'
    },
    
    'banana simple': { 
      folder: 'piercing/banana/banana-simple', 
      colors: ['dorado', 'plateado', 'multicolor'],
      fallbackColor: 'dorado'
    },
    'banana para el ombligo': { 
      folder: 'piercing/banana/banana-simple', 
      colors: ['dorado', 'plateado', 'multicolor'],
      fallbackColor: 'dorado'
    },
    'banana para ombligo': { 
      folder: 'piercing/banana/banana-simple', 
      colors: ['dorado', 'plateado', 'multicolor'],
      fallbackColor: 'dorado'
    },
    
    // ========== BARBELLS (dentro de piercing/) ==========
    'barbell con alas': { 
      folder: 'piercing/barbell/barbell-alas', 
      colors: ['plateado'],
      fallbackColor: 'plateado'
    },
    'barbells alas': { 
      folder: 'piercing/barbell/barbell-alas', 
      colors: ['plateado'],
      fallbackColor: 'plateado'
    },
    'barbell alas': { 
      folder: 'piercing/barbell/barbell-alas', 
      colors: ['plateado'],
      fallbackColor: 'plateado'
    },
    
    'barbell flecha': { 
      folder: 'piercing/barbell/barbell-flecha', 
      colors: ['dorado', 'negro', 'plateado'],
      fallbackColor: 'plateado'
    },
    'barbells flecha': { 
      folder: 'piercing/barbell/barbell-flecha', 
      colors: ['dorado', 'negro', 'plateado'],
      fallbackColor: 'plateado'
    },
    'barbell con flecha': { 
      folder: 'piercing/barbell/barbell-flecha', 
      colors: ['dorado', 'negro', 'plateado'],
      fallbackColor: 'plateado'
    },
    
    'barbell largo': { 
      folder: 'piercing/barbell/barbell-largo', 
      colors: ['azul', 'cobre', 'dorado', 'mulicolor'],
      fallbackColor: 'dorado'
    },
    'barbells largo': { 
      folder: 'piercing/barbell/barbell-largo', 
      colors: ['azul', 'cobre', 'dorado', 'mulicolor'],
      fallbackColor: 'dorado'
    },
    
    // ========== CIRCULAR BARBELLS (dentro de piercing/) ==========
    'circular barbell con piedra': { 
      folder: 'piercing/circular-barbell/circular-barbell-piedra', 
      colors: ['cristal', 'negro'],
      fallbackColor: 'cristal'
    },
    'circular barbell piedra': { 
      folder: 'piercing/circular-barbell/circular-barbell-piedra', 
      colors: ['cristal', 'negro'],
      fallbackColor: 'cristal'
    },
    
    'circular barbell con flecha': { 
      folder: 'piercing/circular-barbell/circular-barbell-coni', 
      colors: ['dorado', 'cobre', 'negro'],
      fallbackColor: 'dorado'
    },
    'circular barbell flecha': { 
      folder: 'piercing/circular-barbell/circular-barbell-coni', 
      colors: ['dorado', 'cobre', 'negro'],
      fallbackColor: 'dorado'
    },
    'circular barbell con bola cóni': { 
      folder: 'piercing/circular-barbell/circular-barbell-coni', 
      colors: ['dorado', 'cobre', 'negro'],
      fallbackColor: 'dorado'
    },
    'circular barbell con bola coni': { 
      folder: 'piercing/circular-barbell/circular-barbell-coni', 
      colors: ['dorado', 'cobre', 'negro'],
      fallbackColor: 'dorado'
    },
    
    // ========== LABRETS (dentro de piercing/) ==========
    'labret corazón': { 
      folder: 'piercing/labret/labret-corazon', 
      colors: ['dorado', 'negro', 'plateado', 'rosa'],
      fallbackColor: 'dorado'
    },
    'labret con corazón': { 
      folder: 'piercing/labret/labret-corazon', 
      colors: ['dorado', 'negro', 'plateado', 'rosa'],
      fallbackColor: 'dorado'
    },
    'labret corazon': { 
      folder: 'piercing/labret/labret-corazon', 
      colors: ['dorado', 'negro', 'plateado', 'rosa'],
      fallbackColor: 'dorado'
    },
    
    'labret simple': { 
      folder: 'piercing/labret/labret-simple', 
      colors: ['cobre', 'dorado', 'negro', 'multicolor'],
      fallbackColor: 'dorado'
    },
    
    'labret triángulo': { 
      folder: 'piercing/labret/labret-triangulos', 
      colors: ['dorado', 'negro', 'plateado', 'rosa'],
      fallbackColor: 'dorado'
    },
    'labret triangulo': { 
      folder: 'piercing/labret/labret-triangulos', 
      colors: ['dorado', 'negro', 'plateado', 'rosa'],
      fallbackColor: 'dorado'
    },
    'labret con triángulo': { 
      folder: 'piercing/labret/labret-triangulos', 
      colors: ['dorado', 'negro', 'plateado', 'rosa'],
      fallbackColor: 'dorado'
    },
    'labret triangulos': { 
      folder: 'piercing/labret/labret-triangulos', 
      colors: ['dorado', 'negro', 'plateado', 'rosa'],
      fallbackColor: 'dorado'
    },
    
    // ========== PLUGS - MAPEO CORREGIDO SEGÚN IMÁGENES REALES ==========
    'plug simple': { 
      folder: 'dilatador/plug/plug-simple', 
      colors: ['amarillo', 'azul', 'blanco', 'default', 'morado', 'negro', 'verde'],
      fallbackColor: 'default'
    },
    'plug': { 
      folder: 'dilatador/plug/plug-simple', 
      colors: ['amarillo', 'azul', 'blanco', 'default', 'morado', 'negro', 'verde'],
      fallbackColor: 'default'
    },
    
    // ✅ CORREGIDO: Plug de Acrílico → negro (según imagen funcional)
    'plug de acrílico': { 
      folder: 'dilatador/plug/plug-simple', 
      colors: ['amarillo', 'azul', 'blanco', 'default', 'morado', 'negro', 'verde'],
      fallbackColor: 'negro' // ✅ CAMBIADO: era 'default', ahora 'negro'
    },
    'plug de acrilico': { 
      folder: 'dilatador/plug/plug-simple', 
      colors: ['amarillo', 'azul', 'blanco', 'default', 'morado', 'negro', 'verde'],
      fallbackColor: 'negro' // ✅ CAMBIADO: era 'default', ahora 'negro'
    },
    
    // ✅ CORREGIDO: Plug de Silicona → rojo (lo más parecido a rosa según imagen funcional)
    'plug de silicona': { 
      folder: 'dilatador/plug/plug-dobles', 
      colors: ['azul', 'beige', 'caoba', 'default', 'morado', 'rojo', 'verde'],
      fallbackColor: 'rojo' // ✅ CAMBIADO: era 'default', ahora 'rojo' (rosa)
    },
    'plug silicona': { 
      folder: 'dilatador/plug/plug-dobles', 
      colors: ['azul', 'beige', 'caoba', 'default', 'morado', 'rojo', 'verde'],
      fallbackColor: 'rojo' // ✅ CAMBIADO: era 'default', ahora 'rojo' (rosa)
    },
    
    // ✅ CORREGIDO: Plug con Corazón → caoba (según especificación del usuario)
    'plug con corazón': { 
      folder: 'dilatador/plug/plug-dobles', // ✅ CAMBIADO: era plug-simple, ahora plug-dobles
      colors: ['azul', 'beige', 'caoba', 'default', 'morado', 'rojo', 'verde'], // ✅ CAMBIADO: colores de plug-dobles
      fallbackColor: 'caoba' // ✅ CAMBIADO: era 'default', ahora 'caoba'
    },
    'plug con corazon': { 
      folder: 'dilatador/plug/plug-dobles', // ✅ CAMBIADO: era plug-simple, ahora plug-dobles
      colors: ['azul', 'beige', 'caoba', 'default', 'morado', 'rojo', 'verde'], // ✅ CAMBIADO: colores de plug-dobles
      fallbackColor: 'caoba' // ✅ CAMBIADO: era 'default', ahora 'caoba'
    },
    
    // ✅ MANTENIDO: Dobles → plug-dobles
    'plug doble': { 
      folder: 'dilatador/plug/plug-dobles', 
      colors: ['azul', 'beige', 'caoba', 'default', 'morado', 'rojo', 'verde'],
      fallbackColor: 'default'
    },
    'plug dobles': { 
      folder: 'dilatador/plug/plug-dobles', 
      colors: ['azul', 'beige', 'caoba', 'default', 'morado', 'rojo', 'verde'],
      fallbackColor: 'default'
    },
    
    // ========== DILATADORES Y EXPANDERS - RUTAS CORREGIDAS ==========
    'set de dilatadores': { 
      folder: 'dilatador/set-dilatadores', 
      colors: ['blanco', 'default', 'rosa', 'plateado', 'violeta'], 
      fallbackColor: 'rosa' // ✅ CAMBIADO: volver a 'rosa' para el abanico morado
    },
    'set dilatadores': { 
      folder: 'dilatador/set-dilatadores', 
      colors: ['blanco', 'default', 'rosa', 'plateado', 'violeta'], 
      fallbackColor: 'plateado' // ✅ MANTENER: 'plateado' para diferenciación
    },
    'set de expanders de 1.1 a 15 mm': { 
      folder: 'dilatador/set-dilatadores', 
      colors: ['blanco', 'default', 'rosa', 'plateado', 'violeta'], 
      fallbackColor: 'rosa' // ✅ NUEVO: Mapeo específico para este producto
    },
    'set de expanders de 1,1 a 15 mm': { 
      folder: 'dilatador/set-dilatadores', 
      colors: ['blanco', 'default', 'rosa', 'plateado', 'violeta'], 
      fallbackColor: 'rosa' // ✅ NUEVO: Variación con coma decimal
    },
    
    'dilatador': { 
      folder: 'dilatador/dilatador simple', 
      colors: ['default', 'negro', 'rojo'],
      fallbackColor: 'default'
    },
    'dilatadores': { 
      folder: 'dilatador/dilatador simple', 
      colors: ['default', 'negro', 'rojo'],
      fallbackColor: 'default'
    },
    
    'expander duo': { 
      folder: 'dilatador/expander/expander-duo', 
      colors: ['celeste', 'default', 'dorado', 'verde'],
      fallbackColor: 'default'
    },
    'expander con duo': { 
      folder: 'dilatador/expander/expander-duo', 
      colors: ['celeste', 'default', 'dorado', 'verde'],
      fallbackColor: 'default'
    },
    
    'expander medusa': { 
      folder: 'dilatador/expander/expander-medusa', 
      colors: ['default', 'negro', 'verde'],
      fallbackColor: 'default'
    },
    'expander con medusa': { 
      folder: 'dilatador/expander/expander-medusa', 
      colors: ['default', 'negro', 'verde'],
      fallbackColor: 'default'
    },
    
    'expander espiral': { 
      folder: 'dilatador/expander/expander-duo', 
      colors: ['celeste', 'default', 'dorado', 'verde'],
      fallbackColor: 'celeste'
    },
    'expander en espiral': { 
      folder: 'dilatador/expander/expander-duo', 
      colors: ['celeste', 'default', 'dorado', 'verde'],
      fallbackColor: 'celeste'
    },
    
    'set de expanders curvados': { 
      folder: 'dilatador/expander/expander-medusa', // ✅ CAMBIADO: de 'set-dilatadores' a 'expander-medusa'
      colors: ['default', 'negro', 'verde'],
      fallbackColor: 'negro' // ✅ CAMBIADO: de 'default' a 'negro'
    },
    'set de expanders': { 
      folder: 'dilatador/set-dilatadores', 
      colors: ['blanco', 'default', 'rosa', 'plateado', 'violeta'],
      fallbackColor: 'default'
    },
    'set expanders curvados': { 
      folder: 'dilatador/expander/expander-medusa', // ✅ CAMBIADO: de 'set-dilatadores' a 'expander-medusa'
      colors: ['default', 'negro', 'verde'],
      fallbackColor: 'negro' // ✅ CAMBIADO: de 'default' a 'negro'
    },
    'set expanders': { 
      folder: 'dilatador/set-dilatadores', 
      colors: ['blanco', 'default', 'rosa', 'plateado', 'violeta'],
      fallbackColor: 'default'
    },
    
    // ========== TÚNELES - RUTAS CORREGIDAS (dentro de dilatador/) ==========
    'túnel de acrílico': { 
      folder: 'dilatador/tunel/tunel-acrilico', 
      colors: ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
      fallbackColor: 'azul'
    },
    'tunel de acrílico': { 
      folder: 'dilatador/tunel/tunel-acrilico', 
      colors: ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
      fallbackColor: 'azul'
    },
    'túnel acrílico': { 
      folder: 'dilatador/tunel/tunel-acrilico', 
      colors: ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
      fallbackColor: 'azul'
    },
    'tunel acrilico': { 
      folder: 'dilatador/tunel/tunel-acrilico', 
      colors: ['azul', 'blanco', 'rojo', 'negro', 'amarillo'],
      fallbackColor: 'azul'
    },
    
    'túnel de metal': { 
      folder: 'dilatador/tunel/tunel-metal', 
      colors: ['azul', 'cobre', 'dorado'],
      fallbackColor: 'dorado'
    },
    'tunel de metal': { 
      folder: 'dilatador/tunel/tunel-metal', 
      colors: ['azul', 'cobre', 'dorado'],
      fallbackColor: 'dorado'
    },
    'túnel metal': { 
      folder: 'dilatador/tunel/tunel-metal', 
      colors: ['azul', 'cobre', 'dorado'],
      fallbackColor: 'dorado'
    },
    'tunel metal': { 
      folder: 'dilatador/tunel/tunel-metal', 
      colors: ['azul', 'cobre', 'dorado'],
      fallbackColor: 'dorado'
    },
    'túnel de acero': { 
      folder: 'dilatador/tunel/tunel-metal', 
      colors: ['azul', 'cobre', 'dorado'],
      fallbackColor: 'dorado'
    },
    'tunel de acero': { 
      folder: 'dilatador/tunel/tunel-metal', 
      colors: ['azul', 'cobre', 'dorado'],
      fallbackColor: 'dorado'
    },
    
    'túnel orfebre': { 
      folder: 'dilatador/tunel/tunel-orfebre', 
      colors: ['dorado', 'plateado'],
      fallbackColor: 'dorado'
    },
    'tunel orfebre': { 
      folder: 'dilatador/tunel/tunel-orfebre', 
      colors: ['dorado', 'plateado'],
      fallbackColor: 'dorado'
    },
    'túnel mandala': { 
      folder: 'dilatador/tunel/tunel-orfebre', 
      colors: ['dorado', 'plateado'],
      fallbackColor: 'dorado'
    },
    'tunel mandala': { 
      folder: 'dilatador/tunel/tunel-orfebre', 
      colors: ['dorado', 'plateado'],
      fallbackColor: 'dorado'
    },
    
    'túnel de silicona': { 
      folder: 'dilatador/tunel/tunel-silicona', 
      colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
      fallbackColor: 'azul'
    },
    'tunel de silicona': { 
      folder: 'dilatador/tunel/tunel-silicona', 
      colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
      fallbackColor: 'azul'
    },
    'túnel silicona': { 
      folder: 'dilatador/tunel/tunel-silicona', 
      colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
      fallbackColor: 'azul'
    },
    'tunel silicona': { 
      folder: 'dilatador/tunel/tunel-silicona', 
      colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
      fallbackColor: 'azul'
    },
    
    // ========== GENÉRICOS ==========
    'túnel': { 
      folder: 'dilatador/tunel/tunel-silicona', 
      colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
      fallbackColor: 'azul'
    },
    'tunel': { 
      folder: 'dilatador/tunel/tunel-silicona', 
      colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'],
      fallbackColor: 'azul'
    },
    
    // ========== PIERCINGS GENERALES ==========
    'piercing': { 
      folder: 'piercing/anillo/anillo-bisagra', 
      colors: ['azul', 'cobre', 'dorado', 'negro', 'multicolor'],
      fallbackColor: 'dorado'
    }
  };

  /**
   * ✅ MÉTODO PRINCIPAL MEJORADO CON MEJOR MANEJO DE ERRORES
   */
  static getProductImageSrc(product: any, selectedColor?: string): string {
    if (!product || !product.nombre) {
      return this.getFallbackImage();
    }

    const nombre = product.nombre.toLowerCase().trim();
    console.log('🖼️ Obteniendo imagen para:', nombre, 'color:', selectedColor);

    // ESTRATEGIA 1: Buscar configuración específica del producto
    const productConfig = this.findProductConfig(nombre);
    
    if (productConfig) {
      const imagePath = this.getImagePathForProduct(productConfig, selectedColor, nombre);
      console.log('✅ Imagen específica construida:', imagePath);
      return imagePath;
    }

    // ESTRATEGIA 2: Buscar por palabras clave si no hay coincidencia exacta
    const keywordConfig = this.findByKeywords(nombre);
    if (keywordConfig) {
      const imagePath = this.getImagePathForProduct(keywordConfig, selectedColor, nombre);
      console.log('✅ Imagen por keyword construida:', imagePath);
      return imagePath;
    }

    // ESTRATEGIA 3: Buscar por tipo de producto
    const typeConfig = this.findByProductType(nombre);
    if (typeConfig) {
      const imagePath = this.getImagePathForProduct(typeConfig, selectedColor, nombre);
      console.log('✅ Imagen por tipo construida:', imagePath);
      return imagePath;
    }

    // ESTRATEGIA 4: Fallback final
    console.warn(`⚠️ No se encontró configuración para: ${nombre}`);
    return this.getFallbackImage();
  }

  /**
   * ✅ OBTENER IMAGEN DE FALLBACK ROBUSTA
   */
  private static getFallbackImage(): string {
    // Intentar primero con default.jpg en la raíz de images
    return 'assets/images/default.jpg';
  }

  /**
   * ✅ BUSCAR CONFIGURACIÓN ESPECÍFICA DEL PRODUCTO
   */
  private static findProductConfig(productName: string): { folder: string; colors: string[]; fallbackColor: string } | null {
    const normalizedName = productName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    // Buscar coincidencia exacta
    for (const [key, config] of Object.entries(this.PRODUCT_FOLDER_MAP)) {
      const normalizedKey = key
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

      if (normalizedName === normalizedKey) {
        console.log(`🎯 Configuración exacta encontrada: ${key}`);
        return config;
      }
    }

    return null;
  }

  /**
   * ✅ BUSCAR POR PALABRAS CLAVE ESPECÍFICAS - ACTUALIZADO CON NUEVAS RUTAS
   */
  private static findByKeywords(productName: string): { folder: string; colors: string[]; fallbackColor: string } | null {
    // Mapeo de palabras clave a configuraciones - RUTAS CORREGIDAS
    const keywordMap: { [key: string]: { folder: string; colors: string[]; fallbackColor: string } } = {
      'bisagra': { folder: 'piercing/anillo/anillo-bisagra', colors: ['azul', 'cobre', 'dorado', 'negro', 'multicolor'], fallbackColor: 'dorado' },
      'corazon': { folder: 'piercing/anillo/anillo-corazon', colors: ['dorado', 'negro', 'plateado'], fallbackColor: 'dorado' },
      'triangulo': { folder: 'piercing/labret/labret-triangulos', colors: ['dorado', 'negro', 'plateado', 'rosa'], fallbackColor: 'dorado' },
      'flecha': { folder: 'piercing/barbell/barbell-flecha', colors: ['dorado', 'negro', 'plateado'], fallbackColor: 'plateado' },
      'alas': { folder: 'piercing/barbell/barbell-alas', colors: ['plateado'], fallbackColor: 'plateado' },
      'gema': { folder: 'piercing/banana/banana-gema', colors: ['azul', 'morado', 'transparente', 'rojo', 'verde'], fallbackColor: 'azul' },
      'acrilico': { folder: 'tunel/tunel-acrilico', colors: ['azul', 'blanco', 'rojo', 'negro', 'amarillo'], fallbackColor: 'azul' },
      'acrílico': { folder: 'tunel/tunel-acrilico', colors: ['azul', 'blanco', 'rojo', 'negro', 'amarillo'], fallbackColor: 'azul' },
      'metal': { folder: 'tunel/tunel-metal', colors: ['azul', 'cobre', 'dorado'], fallbackColor: 'dorado' },
      'acero': { folder: 'tunel/tunel-metal', colors: ['azul', 'cobre', 'dorado'], fallbackColor: 'dorado' },
      'orfebre': { folder: 'tunel/tunel-orfebre', colors: ['dorado', 'plateado'], fallbackColor: 'dorado' },
      'mandala': { folder: 'tunel/tunel-orfebre', colors: ['dorado', 'plateado'], fallbackColor: 'dorado' },
      'silicona': { folder: 'tunel/tunel-silicona', colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'], fallbackColor: 'azul' },
      'nostril': { folder: 'piercing/anillo/aro-nostril', colors: ['azul', 'multicolor', 'negro'], fallbackColor: 'azul' },
      'ombligo': { folder: 'piercing/banana/banana-simple', colors: ['dorado', 'plateado', 'multicolor'], fallbackColor: 'dorado' },
      'piedra': { folder: 'piercing/circular-barbell/circular-barbell-piedra', colors: ['cristal', 'negro'], fallbackColor: 'cristal' },
      'cóni': { folder: 'piercing/circular-barbell/circular-barbell-coni', colors: ['dorado', 'cobre', 'negro'], fallbackColor: 'dorado' },
      'coni': { folder: 'piercing/circular-barbell/circular-barbell-coni', colors: ['dorado', 'cobre', 'negro'], fallbackColor: 'dorado' },
      'bola': { folder: 'piercing/circular-barbell/circular-barbell-coni', colors: ['dorado', 'cobre', 'negro'], fallbackColor: 'dorado' },
      'duo': { folder: 'dilatador/expander/expander-duo', colors: ['celeste', 'default', 'dorado', 'verde'], fallbackColor: 'celeste' },
      'medusa': { folder: 'dilatador/expander/expander-medusa', colors: ['default', 'negro', 'verde'], fallbackColor: 'negro' },
      'espiral': { folder: 'dilatador/expander/expander-duo', colors: ['celeste', 'default', 'dorado', 'verde'], fallbackColor: 'celeste' },
      'curvados': { folder: 'dilatador/expander/expander-medusa', colors: ['default', 'negro', 'verde'], fallbackColor: 'negro' },
      'curvado': { folder: 'dilatador/expander/expander-medusa', colors: ['default', 'negro', 'verde'], fallbackColor: 'negro' },
      'rosa': { folder: 'piercing/banana/banana-flor', colors: ['azul', 'celeste', 'rojo', 'rosa', 'verde'], fallbackColor: 'rosa' },
      'flor': { folder: 'piercing/banana/banana-flor', colors: ['azul', 'celeste', 'rojo', 'rosa', 'verde'], fallbackColor: 'rosa' }
    };
    
    for (const [keyword, config] of Object.entries(keywordMap)) {
      if (productName.includes(keyword)) {
        console.log(`🎯 Keyword match: "${keyword}"`);
        return config;
      }
    }
    
    return null;
  }

  /**
   * ✅ BUSCAR POR TIPO DE PRODUCTO - ACTUALIZADO CON NUEVAS RUTAS
   */
  private static findByProductType(productName: string): { folder: string; colors: string[]; fallbackColor: string } | null {
    const typeMap: { [key: string]: { folder: string; colors: string[]; fallbackColor: string } } = {
      'anillo': { folder: 'piercing/anillo/anillo-bisagra', colors: ['azul', 'cobre', 'dorado', 'negro', 'multicolor'], fallbackColor: 'dorado' },
      'aro': { folder: 'piercing/anillo/aro-nostril', colors: ['azul', 'multicolor', 'negro'], fallbackColor: 'azul' },
      'banana': { folder: 'piercing/banana/banana-simple', colors: ['dorado', 'plateado', 'multicolor'], fallbackColor: 'dorado' },
      'barbell': { folder: 'piercing/barbell/barbell-flecha', colors: ['dorado', 'negro', 'plateado'], fallbackColor: 'plateado' },
      'labret': { folder: 'piercing/labret/labret-simple', colors: ['cobre', 'dorado', 'negro', 'multicolor'], fallbackColor: 'dorado' },
      'plug': { folder: 'dilatador/plug/plug-simple', colors: ['amarillo', 'azul', 'blanco', 'default', 'morado', 'negro', 'verde'], fallbackColor: 'default' },
      'tunel': { folder: 'dilatador/tunel/tunel-silicona', colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'], fallbackColor: 'azul' },
      'túnel': { folder: 'dilatador/tunel/tunel-silicona', colors: ['azul', 'blanco', 'rojo', 'rosa', 'negro', 'verde'], fallbackColor: 'azul' },
      'expander': { folder: 'dilatador/expander/expander-duo', colors: ['celeste', 'default', 'dorado', 'verde'], fallbackColor: 'celeste' },
      'dilatador': { folder: 'dilatador/dilatador simple', colors: ['default', 'negro', 'rojo'], fallbackColor: 'default' },
      'piercing': { folder: 'piercing/anillo/anillo-bisagra', colors: ['azul', 'cobre', 'dorado', 'negro', 'multicolor'], fallbackColor: 'dorado' },
      'circular': { folder: 'piercing/circular-barbell/circular-barbell-piedra', colors: ['cristal', 'negro'], fallbackColor: 'cristal' },
      'set': { folder: 'dilatador/set-dilatadores', colors: ['blanco', 'default', 'rosa', 'plateado', 'violeta'], fallbackColor: 'rosa' }
    };
    
    for (const [type, config] of Object.entries(typeMap)) {
      if (productName.includes(type)) {
        console.log(`🎯 Type match: "${type}"`);
        return config;
      }
    }
    
    return null;
  }

  /**
   * ✅ OBTENER RUTA DE IMAGEN ROBUSTA CON MÚLTIPLES FALLBACKS Y VARIACIÓN DETERMINÍSTICA
   */
  private static getImagePathForProduct(
    config: { folder: string; colors: string[]; fallbackColor: string }, 
    selectedColor?: string,
    productName?: string
  ): string {
    const { folder, colors, fallbackColor } = config;

    // PASO 1: Si hay un color seleccionado y está disponible
    if (selectedColor && colors.includes(selectedColor.toLowerCase())) {
      const colorFileName = selectedColor.toLowerCase();
      const imagePath = `assets/images/${folder}/${colorFileName}.jpg`;
      console.log(`🎨 Usando color seleccionado: ${imagePath}`);
      return imagePath;
    }

    // PASO 2: Intentar con el color de fallback definido
    if (fallbackColor && colors.includes(fallbackColor)) {
      const imagePath = `assets/images/${folder}/${fallbackColor}.jpg`;
      console.log(`🔄 Usando color de fallback: ${imagePath}`);
      return imagePath;
    }

    // PASO 3: Usar una selección determinística basada en el nombre del producto
    if (colors.length > 0) {
      let colorIndex = 0;
      
      // ✅ NUEVO: Crear variación determinística basada en el nombre del producto
      if (productName && colors.length > 1) {
        // Crear un hash simple del nombre del producto para selección determinística
        let hash = 0;
        for (let i = 0; i < productName.length; i++) {
          hash = ((hash << 5) - hash + productName.charCodeAt(i)) & 0x7fffffff;
        }
        colorIndex = hash % colors.length;
      }
      
      const selectedColorFromArray = colors[colorIndex];
      const imagePath = `assets/images/${folder}/${selectedColorFromArray}.jpg`;
      console.log(`📝 Usando color determinístico (${colorIndex}): ${imagePath}`);
      return imagePath;
    }

    // PASO 4: Fallback final
    console.warn(`⚠️ No se pudo determinar imagen para la carpeta: ${folder}`);
    return this.getFallbackImage();
  }

  /**
   * ✅ OBTENER COLORES DISPONIBLES PARA UN PRODUCTO ESPECÍFICO
   */
  static getAvailableColors(productName: string): string[] {
    const config = this.findProductConfig(productName.toLowerCase()) || 
                   this.findByKeywords(productName.toLowerCase()) ||
                   this.findByProductType(productName.toLowerCase());
    
    if (config) {
      return config.colors.length > 0 ? config.colors : ['Estándar'];
    }
    
    return ['Estándar'];
  }

  /**
   * ✅ VERIFICAR SI EXISTE UNA IMAGEN ESPECÍFICA (SIMULADO)
   */
  static hasColorVariant(productName: string, color: string): boolean {
    const availableColors = this.getAvailableColors(productName);
    return availableColors.includes(color.toLowerCase());
  }

  /**
   * ✅ OBTENER CARPETA PRINCIPAL DE UN PRODUCTO
   */
  static getProductFolder(productName: string): string {
    const config = this.findProductConfig(productName.toLowerCase()) || 
                   this.findByKeywords(productName.toLowerCase()) ||
                   this.findByProductType(productName.toLowerCase());
    return config ? config.folder : 'default';
  }

  /**
   * ✅ MÉTODO PARA DEBUG - MOSTRAR INFORMACIÓN DE UN PRODUCTO
   */
  static debugProduct(productName: string): void {
    console.group(`🐛 Debug para producto: ${productName}`);
    
    const config = this.findProductConfig(productName.toLowerCase()) || 
                   this.findByKeywords(productName.toLowerCase()) ||
                   this.findByProductType(productName.toLowerCase());
    
    if (config) {
      console.log('📁 Carpeta:', config.folder);
      console.log('🎨 Colores disponibles:', config.colors);
      console.log('🔄 Color de fallback:', config.fallbackColor);
      console.log('🖼️ Imagen por defecto:', this.getImagePathForProduct(config, undefined, productName));
      
      config.colors.forEach(color => {
        console.log(`  • ${color}: ${this.getImagePathForProduct(config, color, productName)}`);
      });
    } else {
      console.log('❌ No se encontraron configuraciones para este producto');
    }
    
    console.groupEnd();
  }
}