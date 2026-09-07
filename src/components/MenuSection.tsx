import React, { useState } from "react";
import { Product, Category } from "../types";
import { Search, Star, Clock, AlertCircle, Eye, ShoppingCart, SlidersHorizontal, Check } from "lucide-react";

interface MenuSectionProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product, quantity: number) => void;
  isDarkMode: boolean;
}

export default function MenuSection({ products, categories, onAddToCart, isDarkMode }: MenuSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [sortBy, setSortBy] = useState("rating"); // rating, price-low, price-high, popularity
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filters & sorting logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory;
      const matchesAvailability = !showOnlyAvailable || product.isAvailable;
      
      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popularity") return b.salesCount - a.salesCount;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  const handleAddToCartClick = (product: Product, qty: number) => {
    onAddToCart(product, qty);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  return (
    <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">
          Nuestro Menú Tradicional
        </h2>
        <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
          Preparados al instante con ingredientes frescos del mercado y sazón tradicional nicaragüense.
        </p>
      </div>

      {/* Filter controls, Search bar & Sort order */}
      <div className={`p-6 rounded-2xl mb-8 transition-colors duration-300 ${
        isDarkMode ? "bg-neutral-900 border border-neutral-800" : "bg-neutral-50 border border-neutral-100"
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search Bar */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
            <input
              id="menu-search-input"
              type="text"
              placeholder="Buscar por gallo pinto, quesillo, yuca, cacao..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                isDarkMode 
                  ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              }`}
            />
          </div>

          {/* Sort By Order */}
          <div className="lg:col-span-3 flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" />
            <select
              id="menu-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full p-2.5 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
                isDarkMode 
                  ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                  : "bg-white border-neutral-200 text-neutral-800 focus:border-emerald-600"
              }`}
            >
              <option value="rating">Calificación ⭐</option>
              <option value="popularity">Más Vendidos 🔥</option>
              <option value="price-low">Precio: Bajo a Alto 📈</option>
              <option value="price-high">Precio: Alto a Bajo 📉</option>
            </select>
          </div>

          {/* Filter options (Availability) */}
          <div className="lg:col-span-4 flex items-center lg:justify-end">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                id="menu-available-checkbox"
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className="w-4.5 h-4.5 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500"
              />
              <span className={`text-sm font-medium ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}>
                Mostrar solo disponibles al instante
              </span>
            </label>
          </div>
        </div>

        {/* Categories Tab Pill Lists */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-5 scrollbar-thin scrollbar-thumb-emerald-500">
          <button
            id="cat-tab-todos"
            onClick={() => setSelectedCategory("todos")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase whitespace-nowrap ${
              selectedCategory === "todos"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                : isDarkMode
                  ? "bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                  : "bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            Todos
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all uppercase whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : isDarkMode
                    ? "bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                    : "bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing of products */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto animate-bounce mb-3" />
          <h3 className="font-sans font-bold text-lg">No encontramos platillos</h3>
          <p className={`text-sm mt-1 ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
            Prueba buscando con otros términos o seleccionando otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className={`group rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isDarkMode 
                  ? "bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/90 hover:border-neutral-700" 
                  : "bg-white border-neutral-200/60 hover:shadow-neutral-200"
              }`}
            >
              {/* Product Card Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-4 py-2 bg-neutral-900/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-neutral-700">
                      Agotado por Hoy
                    </span>
                  </div>
                )}
                {product.isAvailable && product.stock <= 5 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-neutral-950 font-bold text-[9px] uppercase tracking-wider rounded-lg border border-white dark:border-neutral-900">
                    ¡Quedan Pocos!
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-3 py-1 bg-neutral-950/80 backdrop-blur-xs text-white font-mono font-bold text-sm rounded-xl border border-neutral-800">
                  C$ {product.price}
                </span>
              </div>

              {/* Product Card Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="font-bold">{product.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 className="font-sans font-bold text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {product.name}
                </h3>
                
                <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                  {product.description}
                </p>

                {/* Preparation Time */}
                <div className="flex items-center space-x-4 text-xs font-medium text-neutral-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>~{product.preparationTime} min</span>
                  </div>
                  <span>•</span>
                  <span>{product.salesCount} vendidos</span>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    id={`view-detail-btn-${product.id}`}
                    onClick={() => openProductDetail(product)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                      isDarkMode 
                        ? "border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800" 
                        : "border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                    title="Ver ingredientes y detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    id={`add-to-cart-btn-${product.id}`}
                    disabled={!product.isAvailable}
                    onClick={() => handleAddToCartClick(product, 1)}
                    className={`flex-1 py-2.5 px-4 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
                      !product.isAvailable
                        ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed"
                        : addedProductId === product.id
                          ? "bg-amber-500 text-neutral-950 font-extrabold"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/10"
                    }`}
                  >
                    {addedProductId === product.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Agregado pues</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Agregar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            id="product-detail-modal"
            className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border ${
              isDarkMode ? "bg-neutral-950 border-neutral-800 text-white" : "bg-white border-neutral-100 text-neutral-900"
            }`}
          >
            {/* Modal Image */}
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
              <span className="absolute bottom-4 left-4 px-3 py-1 bg-emerald-600 text-white font-mono font-bold rounded-xl text-sm border border-emerald-500">
                C$ {selectedProduct.price}
              </span>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="font-bold">{selectedProduct.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              <h3 className="font-sans font-extrabold text-2xl leading-tight">
                {selectedProduct.name}
              </h3>

              <p className={`text-sm leading-relaxed ${isDarkMode ? "text-neutral-300" : "text-neutral-600"}`}>
                {selectedProduct.description}
              </p>

              {/* Ingredients List */}
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-400">
                  Ingredientes Tradicionales Incluidos:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        isDarkMode ? "bg-neutral-900 text-neutral-300" : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      ✓ {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 font-mono">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>Tiempo estimado de entrega: ~{selectedProduct.preparationTime} minutos</span>
                </div>
                <span>Inventario: {selectedProduct.stock} porciones</span>
              </div>

              {/* Modal footer order controls */}
              <div className="flex items-center space-x-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-xl overflow-hidden shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`px-3 py-2 font-bold ${isDarkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-mono font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`px-3 py-2 font-bold ${isDarkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}
                  >
                    +
                  </button>
                </div>

                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    handleAddToCartClick(selectedProduct, quantity);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl uppercase tracking-wider text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar {quantity} al carrito • C$ {selectedProduct.price * quantity}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
