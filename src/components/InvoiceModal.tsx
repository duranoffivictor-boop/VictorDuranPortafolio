import React, { useRef } from "react";
import { Order } from "../types";
import { CheckCircle2, Printer, Download, ShoppingBag, X } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  isDarkMode: boolean;
}

export default function InvoiceModal({ isOpen, onClose, order, isDarkMode }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    const printContent = invoiceRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const windowPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0");
      if (windowPrint) {
        windowPrint.document.write(`
          <html>
            <head>
              <title>Factura ${order.invoiceNumber}</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                .text-center { text-align: center; }
                .flex { display: flex; justify-content: space-between; }
                .border-b { border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
                .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .table th, .table td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
                .table th { background-color: #f9f9f9; font-weight: bold; }
                .text-right { text-align: right; }
                .font-mono { font-family: monospace; }
                .font-bold { font-weight: bold; }
                .text-emerald { color: #059669; }
                .qr-section { display: flex; align-items: center; justify-content: space-between; margin-top: 40px; border-top: 2px dashed #ddd; padding-top: 20px; }
                .footer { text-align: center; font-size: 11px; color: #777; margin-top: 40px; }
              </style>
            </head>
            <body>
              ${printContent}
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
        windowPrint.document.close();
      }
    }
  };

  const handleDownloadPDFSimulated = () => {
    // Generate simple alert telling customer invoice has been downloaded
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(order, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `factura_${order.invoiceNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        id="invoice-modal-panel"
        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border flex flex-col max-h-[90vh] ${
          isDarkMode ? "bg-neutral-950 border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
        }`}
      >
        
        {/* Success Header Banner */}
        <div className="p-6 bg-emerald-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-amber-400 animate-bounce" />
            <div>
              <h2 className="font-sans font-extrabold text-xl">¡Pedido Registrado con Éxito!</h2>
              <p className="text-xs text-emerald-100">Facturación oficial de Nicaragua emitida de inmediato</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable Sheet (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          
          <div
            ref={invoiceRef}
            className={`p-6 rounded-2xl border ${
              isDarkMode ? "bg-neutral-900/50 border-neutral-800" : "bg-neutral-50 border-neutral-100"
            }`}
          >
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-6 border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="font-sans font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
                  Comedería El Buen Sabor
                </h3>
                <p className="text-xs text-neutral-400 mt-1">RUC: J03100002938491 (Simulado)</p>
                <p className="text-xs text-neutral-400">Rotonda El Güegüense, 2c al lago, Managua, Nic.</p>
                <p className="text-xs text-neutral-400">Tel: +505 8888 7777 | info@buensabornica.com</p>
              </div>

              <div className="sm:text-right">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-lg">
                  Factura Comercial
                </span>
                <h4 className="font-mono font-extrabold text-lg mt-2 text-neutral-800 dark:text-white">
                  {order.invoiceNumber}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">Fecha: {formatDate(order.date)}</p>
              </div>
            </div>

            {/* Customer & Billing Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="space-y-1">
                <h5 className="font-sans font-bold text-neutral-400 uppercase tracking-wider">Cliente:</h5>
                <p className="font-bold text-sm text-neutral-800 dark:text-white">
                  {order.customerName} {order.customerLastName}
                </p>
                <p className="text-neutral-500">Teléfono: {order.phone}</p>
                {order.email && <p className="text-neutral-500">Email: {order.email}</p>}
              </div>

              <div className="space-y-1">
                <h5 className="font-sans font-bold text-neutral-400 uppercase tracking-wider">Detalles de Entrega:</h5>
                <p className="font-bold text-neutral-800 dark:text-white">
                  {order.deliveryMethod === "delivery" ? "Envío a Domicilio" : "Retiro en Local"}
                </p>
                <p className="text-neutral-500 truncate max-w-[250px]">{order.address}</p>
                <p className="text-neutral-500 font-semibold text-emerald-600 dark:text-emerald-400">
                  Municipio: {order.municipality}, {order.department}
                </p>
                {order.reference && <p className="text-neutral-400 italic">Ref: {order.reference}</p>}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono">
                    <th className="pb-3 font-semibold text-center w-12">Cant</th>
                    <th className="pb-3 font-semibold">Descripción Platillo</th>
                    <th className="pb-3 font-semibold text-right w-24">Precio Unit.</th>
                    <th className="pb-3 font-semibold text-right w-24">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                  {order.items.map((item, i) => (
                    <tr key={i} className="text-neutral-700 dark:text-neutral-300">
                      <td className="py-3.5 font-mono text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 font-sans font-semibold text-neutral-800 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3.5 font-mono text-right text-neutral-500">
                        C$ {item.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 font-mono text-right font-bold text-neutral-800 dark:text-white">
                        C$ {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Math Sheet */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-2 text-xs font-medium text-neutral-500">
              <div className="flex justify-between">
                <span>Subtotal Neto</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Descuento Aplicado</span>
                  <span className="font-mono">- C$ {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>I.V.A. Retenido (15%)</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cargos de Delivery</span>
                <span className="font-mono text-neutral-800 dark:text-white">C$ {order.shippingCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-3 border-t border-neutral-300 dark:border-neutral-800 text-sm font-sans font-extrabold text-neutral-900 dark:text-white">
                <span>Monto Total a Pagar</span>
                <span className="font-mono text-lg text-emerald-600 dark:text-emerald-400">
                  C$ {order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* QR Verification Section */}
            <div className="mt-8 pt-6 border-t border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-neutral-400">
                  Facturación Electrónica Nica
                </h5>
                <p className="text-[10px] text-neutral-500">Formato certificado por la D.G.I. de Nicaragua.</p>
                <p className="text-[10px] text-neutral-500">Método de pago: <span className="font-bold uppercase text-emerald-600">{order.paymentMethod.replace("_", " ")}</span></p>
                <p className="text-[10px] text-neutral-500">Estado: <span className="font-bold uppercase text-amber-500">{order.paymentStatus}</span></p>
              </div>

              {/* Cool QR code represented in beautiful SVG */}
              <div className="bg-white p-2.5 rounded-xl border border-neutral-200 shrink-0">
                <svg className="w-20 h-20" viewBox="0 0 100 100">
                  <path d="M5 5h30v30H5V5zm6 6v18h18V11H11z" fill="#000" />
                  <path d="M15 15h10v10H15V15zM65 5h30v30H65V5zm6 6v18h18V11H71z" fill="#000" />
                  <path d="M75 15h10v10H75V15zM5 65h30v30H5V65zm6 6v18h18V71H11z" fill="#000" />
                  <path d="M15 75h10v10H15V75z" fill="#000" />
                  <path d="M45 5h10v10H45V5zm10 20h10v10H55V25zm-10 15h10v10H45V40zm20 0h10v10H65V40zm10 10h15v15H75V50zm10-15h10v10H85V35zM45 65h10v10H45V65zm15 10h10v10H60V75zm15 10h20v5H75v-5zm10-15h10v10H85V70zm-40 0h10v15H45V70zm20-15h10v15H65V55zM55 45h5v5h-5v-5z" fill="#000" />
                </svg>
                <p className="text-[8px] text-center font-mono text-neutral-400 mt-1 select-none">FACT-QR-{order.invoiceNumber}</p>
              </div>
            </div>

            {/* Nice legal footer */}
            <div className="text-center text-[10px] text-neutral-400 mt-6 select-none">
              ¡Muchas gracias por preferirnos pues! Saludes de Doña María.
            </div>

          </div>
        </div>

        {/* Modal Action Controls footer */}
        <div className={`p-5 border-t flex flex-col sm:flex-row gap-3 justify-end shrink-0 ${
          isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
        }`}>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Factura</span>
          </button>

          <button
            onClick={handleDownloadPDFSimulated}
            className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Factura</span>
          </button>

          <button
            id="close-invoice-btn"
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Seguir Comprando</span>
          </button>
        </div>

      </div>
    </div>
  );
}
