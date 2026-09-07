import React, { useState } from "react";
import { CartItem, Coupon } from "../types";
import { X, ShoppingBag, Trash2, Tag, ArrowRight, Minus, Plus } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  coupons: Coupon[];
  onCheckout: () => void;
  isDarkMode: boolean;
  taxPercent: number;
  shippingCost: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  coupons,
  onCheckout,
  isDarkMode,
  taxPercent,
  shippingCost
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate discount
  const discountPercent = activeCoupon ? activeCoupon.discountPercent : 0;
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  
  // Tax (IVA in Nicaragua is 15%)
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number(((taxableAmount * taxPercent) / 100).toFixed(2));
  
  // Total (if cart is empty, shipping is 0)
  const actualShippingCost = cartItems.length > 0 ? shippingCost : 0;
  const total = Number((taxableAmount + taxAmount + actualShippingCost).toFixed(2));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    
    if (!couponCode.trim()) return;

    const found = coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
    );

    if (found) {
      setActiveCoupon(found);
      setCouponCode("");
    } else {
      setCouponError("Código inválido o expirado");
    }
  };

  const handleProceedToCheckout = () => {
    // Store financial summary values temporarily for checkout
    sessionStorage.setItem("cart_summary", JSON.stringify({
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      shippingCost: actualShippingCost,
      total,
      couponCode: activeCoupon?.code || ""
    }));
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Background click close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Drawer content */}
      <div
        id="cart-drawer-panel"
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-neutral-950 text-white border-l border-neutral-800" : "bg-white text-neutral-900 border-l border-neutral-200"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-sans font-bold text-lg">Tu Pedido</h2>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 text-xs font-mono font-bold rounded-lg text-emerald-600">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto animate-bounce" />
              <h3 className="font-sans font-bold text-base">Carrito vacío</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                No has agregado ningún platillo tradicional de Nicaragua todavía. ¡Pide un delicioso gallo pinto o quesillo hoy!
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Volver al menú
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className={`p-3 rounded-xl flex items-start space-x-3 border ${
                  isDarkMode ? "bg-neutral-900/50 border-neutral-800" : "bg-neutral-50 border-neutral-200/60"
                }`}
              >
                {/* Thumb */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-lg bg-neutral-200"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-bold leading-tight truncate">{item.product.name}</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                    C$ {item.product.price} c/u
                  </p>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden scale-90 origin-left">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className={`p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 font-mono font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className={`p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 ${isDarkMode ? "text-neutral-400" : "text-neutral-600"}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove item */}
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-400 hover:text-red-500 rounded-lg shrink-0 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Coupon Form, calculations & checkout footer */}
        {cartItems.length > 0 && (
          <div className={`p-5 border-t border-neutral-200 dark:border-neutral-800 space-y-4 ${
            isDarkMode ? "bg-neutral-900/40" : "bg-neutral-50/60"
          }`}>
            {/* Coupon Code Entry */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                id="cart-coupon-input"
                type="text"
                placeholder="Código de cupón (Ej: FIESTANICA)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className={`flex-1 px-3 py-2 text-xs rounded-lg border uppercase outline-none font-mono ${
                  isDarkMode 
                    ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                    : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                }`}
              />
              <button
                type="submit"
                id="apply-coupon-btn"
                className="px-4 py-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-semibold text-xs rounded-lg hover:bg-neutral-800 transition-colors shrink-0 uppercase tracking-wider flex items-center space-x-1"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Aplicar</span>
              </button>
            </form>
            {couponError && <p className="text-[11px] text-red-500 font-semibold">{couponError}</p>}
            
            {activeCoupon && (
              <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                <span className="font-mono font-bold">✓ Cupón: {activeCoupon.code} (-{activeCoupon.discountPercent}%)</span>
                <button
                  onClick={() => setActiveCoupon(null)}
                  className="font-bold hover:text-red-500 text-[10px]"
                >
                  Quitar
                </button>
              </div>
            )}

            {/* Calculations summaries */}
            <div className="space-y-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Descuento aplicado</span>
                  <span className="font-mono">- C$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>IVA (15%)</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo de Envío (Delivery)</span>
                <span className="font-mono text-neutral-800 dark:text-white">
                  {actualShippingCost > 0 ? `C$ ${actualShippingCost.toFixed(2)}` : "C$ 0.00"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-sm font-sans font-extrabold text-neutral-900 dark:text-white">
                <span>Total de tu Pedido</span>
                <span className="font-mono text-lg text-emerald-600 dark:text-emerald-400">C$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                id="clear-cart-btn"
                onClick={onClearCart}
                className="py-3 px-2 border border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 font-bold text-xs rounded-xl uppercase tracking-wider transition-colors"
              >
                Vaciar
              </button>
              <button
                id="checkout-btn"
                onClick={handleProceedToCheckout}
                className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center space-x-1.5"
              >
                <span>Proceder a pagar</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
