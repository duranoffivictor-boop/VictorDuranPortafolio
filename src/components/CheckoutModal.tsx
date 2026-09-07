import React, { useState, useEffect } from "react";
import { CartItem } from "../types";
import { X, CreditCard, Landmark, Truck, ShieldCheck, MapPin, Notebook, AlertCircle, ShoppingBag } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: any) => void;
  isDarkMode: boolean;
}

const DEPARTMENTS = [
  "Managua",
  "Masaya",
  "Granada",
  "León",
  "Carazo",
  "Chinandega",
  "Rivas",
  "Estelí",
  "Matagalpa",
  "Chontales"
];

const PAYMENT_METHODS = [
  { id: "contra_entrega", name: "Pago Contra Entrega", icon: Truck, desc: "Pagas en efectivo al recibir tu pedido." },
  { id: "efectivo", name: "Pago en Efectivo", icon: Notebook, desc: "Pagas en caja física al retirar o al repartidor." },
  { id: "transferencia", name: "Transferencia Bancaria", icon: Landmark, desc: "Transferencia a cuentas LAFISE o BANPRO." },
  { id: "stripe", name: "Tarjeta de Crédito / Débito (Stripe)", icon: CreditCard, desc: "Pago en línea seguro simulado." }
];

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess, isDarkMode }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    department: "Managua",
    municipality: "",
    reference: "",
    deliveryMethod: "delivery", // delivery or takeout
    paymentMethod: "contra_entrega",
    notes: ""
  });

  const [financials, setFinancials] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    shippingCost: 0,
    total: 0,
    couponCode: ""
  });

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const summaryStr = sessionStorage.getItem("cart_summary");
      if (summaryStr) {
        setFinancials(JSON.parse(summaryStr));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodSelect = (id: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: id }));
  };

  const handleDeliverySelect = (method: "delivery" | "takeout") => {
    setFormData((prev) => {
      // Recalculate shipping cost in financials
      const prevShipping = financials.shippingCost;
      const isTakeout = method === "takeout";
      const newShipping = isTakeout ? 0 : 50; // default shipping cost C$ 50
      
      const newTotal = Number((financials.total - prevShipping + newShipping).toFixed(2));
      setFinancials(prevFin => ({
        ...prevFin,
        shippingCost: newShipping,
        total: newTotal
      }));

      return { ...prev, deliveryMethod: method };
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Simple validations
    if (!formData.name.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setValidationError("Por favor, llena todos los campos obligatorios (*).");
      return;
    }

    if (formData.phone.trim().length < 8) {
      setValidationError("Ingresa un número de teléfono de Nicaragua válido (mínimo 8 dígitos).");
      return;
    }

    setLoading(true);

    try {
      // Structure the order items for the backend
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerLastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          department: formData.department,
          municipality: formData.municipality || formData.department,
          reference: formData.reference,
          deliveryMethod: formData.deliveryMethod,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          items: orderItems,
          subtotal: financials.subtotal,
          tax: financials.tax,
          shippingCost: financials.shippingCost,
          discount: financials.discount,
          total: financials.total
        })
      });

      if (!response.ok) {
        throw new Error("No se pudo procesar tu pedido. Intenta de nuevo.");
      }

      const orderData = await response.json();
      onOrderSuccess(orderData);
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || "Fallo de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        id="checkout-modal-panel"
        className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[85vh] ${
          isDarkMode ? "bg-neutral-950 border-neutral-800 text-white" : "bg-white border-neutral-100 text-neutral-900"
        }`}
      >
        {/* Form Container (Scrollable) */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-extrabold text-2xl flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-6 h-6 animate-pulse" />
              <span>Checkout del Pedido</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {validationError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Method Select (Delivery vs Takeout) */}
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-neutral-400">
              1. Método de Entrega
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                id="delivery-method-delivery"
                onClick={() => handleDeliverySelect("delivery")}
                className={`p-4 rounded-xl border text-center font-semibold text-sm transition-all flex flex-col items-center justify-center space-y-1 ${
                  formData.deliveryMethod === "delivery"
                    ? "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                }`}
              >
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Envío a domicilio (Delivery)</span>
                <span className="text-[10px] font-mono opacity-80">C$ 50.00</span>
              </button>

              <button
                type="button"
                id="delivery-method-takeout"
                onClick={() => handleDeliverySelect("takeout")}
                className={`p-4 rounded-xl border text-center font-semibold text-sm transition-all flex flex-col items-center justify-center space-y-1 ${
                  formData.deliveryMethod === "takeout"
                    ? "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                    : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span>Retiro en Comedería</span>
                <span className="text-[10px] font-mono opacity-80">Gratuito</span>
              </button>
            </div>
          </div>

          {/* 2. Customer Personal Info */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-neutral-400">
              2. Información del Cliente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nombre *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Juan"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Apellido *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Teléfono de Nicaragua *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="88887777"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Correo Electrónico (Opcional)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="juan@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery address details */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-neutral-400">
              3. Dirección de Envío
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Departamento</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-800 focus:border-emerald-600"
                  }`}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Municipio</label>
                <input
                  type="text"
                  name="municipality"
                  placeholder="Municipio (Ej: Managua)"
                  value={formData.municipality}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                  }`}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold">Dirección Exacta *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Ej: De los semáforos del Club Terraza 2c abajo, 1c al lago"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                  }`}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold">Punto de Referencia del Repartidor</label>
                <input
                  type="text"
                  name="reference"
                  placeholder="Ej: Casa portón café de rejas, contiguo a la ferretería"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDarkMode 
                      ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                      : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 4. Payment methods selection */}
          <div className="space-y-3">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-neutral-400">
              4. Método de Pago
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                      formData.paymentMethod === method.id
                        ? "border-emerald-600 bg-emerald-600/10"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold">{method.name}</h4>
                      <p className="text-[10px] sm:text-xs text-neutral-400 leading-tight mt-0.5">{method.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Kitchen notes */}
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-neutral-400">
              5. Notas Especiales para la Cocina
            </h3>
            <textarea
              name="notes"
              rows={2}
              placeholder="Ej: Sin cebolla en el quesillo, el cacao con poco hielo, etc."
              value={formData.notes}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-xl border text-sm outline-none transition-all resize-none ${
                isDarkMode 
                  ? "bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500" 
                  : "bg-white border-neutral-200 text-neutral-900 focus:border-emerald-600"
              }`}
            ></textarea>
          </div>
        </form>

        {/* Sidebar Summary & Final calculations (Stick on right) */}
        <div className={`w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l ${
          isDarkMode ? "bg-neutral-900/60 border-neutral-800" : "bg-neutral-50 border-neutral-200"
        }`}>
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-neutral-400 border-b pb-2">
              Resumen de Compra
            </h3>
            
            {/* List short cart items */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span className="truncate max-w-[150px] font-medium">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-mono font-semibold">C$ {item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="space-y-2 text-xs font-medium border-t pt-3 border-neutral-300 dark:border-neutral-800 text-neutral-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {financials.subtotal.toFixed(2)}</span>
              </div>
              {financials.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Descuento</span>
                  <span className="font-mono">- C$ {financials.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>IVA (15%)</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {financials.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo Envío (Delivery)</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {financials.shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-2.5 border-t border-neutral-300 dark:border-neutral-800 text-sm font-sans font-extrabold text-neutral-900 dark:text-white">
                <span>Total Final</span>
                <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                  C$ {financials.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start space-x-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-neutral-400 leading-normal">
                Tu pedido es 100% seguro. Al presionar Confirmar, se registrará tu factura nicaragüense con código QR oficial.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              id="confirm-checkout-btn"
              onClick={handleSubmitOrder}
              disabled={loading || cartItems.length === 0}
              className={`w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 ${
                loading ? "opacity-75 cursor-wait" : ""
              }`}
            >
              <span>{loading ? "Procesando..." : "Confirmar y Ordenar"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
