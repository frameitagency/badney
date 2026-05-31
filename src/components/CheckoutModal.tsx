import React, { useState, useEffect } from "react";
import { CartItem, CheckoutDetails } from "../types";
import { X, Phone, MessageSquare, Send, CheckCircle, Truck, MapPin, Loader2, ArrowRight } from "lucide-react";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from "firebase/auth";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void; // Clears cart and shows status card
}

const SA_PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [form, setForm] = useState<CheckoutDetails>({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "Gauteng",
    notes: "",
    paymentMethod: "WhatsApp Secure Confirmation",
    shippingMethod: "Standard Courier (Free)",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutDetails, string>>>({});
  const [whatsappMessage, setWhatsappMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  // Auth context states inside Checkout Flow
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        setForm((prev) => ({
          ...prev,
          customerName: prev.customerName || u.displayName || "",
        }));
      }
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignInFromCheckout = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error("Checkout login error: ", err);
    }
  };

  const itemsTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Calculate shipping cost added to final price
  const getShippingCost = (): number => {
    if (form.shippingMethod.includes("Express")) return 150.00;
    return 0;
  };

  const finalTotal = itemsTotal + getShippingCost();

  // Create the formatted WhatsApp text whenever the details or items change
  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const itemsText = cartItems
      .map(
        (item) =>
          `• *${item.quantity}x* ${item.product.title}\n` +
          `  └ _Size:_ ${item.selectedSize}\n` +
          `  └ _Color:_ ${item.selectedColor.name}\n` +
          `  └ _Price:_ R${(item.product.price * item.quantity).toFixed(2)}\n`
      )
      .join("\n");

    const message =
      `🛍️ *NEW ORDER - BADNEY COTTON* 🛍️\n` +
      `------------------------------------------\n` +
      `📅 *Date:* ${formattedDate}\n\n` +
      `👤 *CUSTOMER DETAIL:*\n` +
      `• *Name:* ${form.customerName || "[First & Last Name]"}\n` +
      `• *Phone:* ${form.phone || "[Your Mobile Number]"}\n` +
      `• *Delivery Address:*\n` +
      `  ${form.address || "[Street & Number]"}\n` +
      `  ${form.city || "[Suburb/City]"}, ${form.province}\n` +
      `  ${form.postalCode || "[Postal Code]"}\n\n` +
      `📦 *ORDERED ITEMS:*\n` +
      `${itemsText}\n` +
      `------------------------------------------\n` +
      `💰 *SUBTOTAL:* R${itemsTotal.toFixed(2)}\n` +
      `🚚 *SHIPPING:* ${form.shippingMethod} (R${getShippingCost().toFixed(2)})\n` +
      `💵 *FINAL TOTAL EXCL. TAX:* *R${finalTotal.toFixed(2)}*\n` +
      `------------------------------------------\n` +
      `📝 *ADDITIONAL NOTES:* ${form.notes || "_None provided_"}\n\n` +
      `✅ _I wish to checkout this cart. Please message me back to finalize the invoicing (EFT / Card) & delivery timeline._`;

    setWhatsappMessage(message);
  }, [form, cartItems, itemsTotal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error
    if (formErrors[name as keyof CheckoutDetails]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CheckoutDetails, string>> = {};
    if (!form.customerName.trim()) errors.customerName = "Full name is required";
    if (!form.phone.trim()) {
      errors.phone = "Phone contact number is required";
    } else if (form.phone.length < 8) {
      errors.phone = "Provide a valid contact number";
    }
    if (!form.address.trim()) errors.address = "Delivery street address is required";
    if (!form.city.trim()) errors.city = "City / Suburb is required";
    if (!form.postalCode.trim()) errors.postalCode = "Postal ZIP code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const orderId = `BC-${Math.floor(100000 + Math.random() * 900000)}`;

    if (user) {
      try {
        await setDoc(doc(db, "orders", orderId), {
          id: orderId,
          userId: user.uid,
          customerName: form.customerName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          province: form.province,
          notes: form.notes || "",
          shippingMethod: form.shippingMethod,
          items: cartItems,
          subtotal: itemsTotal,
          shippingCost: getShippingCost(),
          finalTotal: finalTotal,
          createdAt: serverTimestamp(),
          status: "PENDING"
        });
      } catch (err) {
        console.error("Failed to register order into Firestore: ", err);
        try {
          handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
        } catch (fErr) {
          // Continue with submit even if database write fails to ensure user checkout is not hard-blocked
        }
      }
    }

    setTimeout(() => {
      // Create WhatsApp redirect URL with our specific target number +27616100885
      const encodedMsg = encodeURIComponent(whatsappMessage);
      const whatsappURL = `https://wa.me/27616100885?text=${encodedMsg}`;

      // Open WhatsApp tab
      window.open(whatsappURL, "_blank");

      setIsSubmitting(false);
      setIsDispatched(true);
    }, 1200);
  };

  const handleFinishCheckout = () => {
    onOrderSuccess(); // Parent resets cart layout
    setIsDispatched(false);
    onClose();
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in"
    >
      <div
        id="checkout-wizard-box"
        className="w-full max-w-5xl bg-[#f8f7f4] border-4 border-[#1a1a1a] rounded-none overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative animate-scale-up max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* Close Button unless dispatched */}
        {!isDispatched && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-[#1a1a1a] bg-white border-2 border-[#1a1a1a] rounded-none hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer"
            title="Cancel Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Check Out Success Card */}
        {isDispatched ? (
          <div className="w-full p-8 md:p-12 flex flex-col items-center justify-center text-center bg-[#f8f7f4]">
            <div className="w-20 h-20 rounded-none border-4 border-[#1a1a1a] bg-[#D4AF37] flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <span className="text-[10px] font-black tracking-[0.25em] text-[#1a1a1a] bg-[#D4AF37] px-3.5 py-1.5 border-2 border-[#1a1a1a] mb-4 uppercase">
              Order Dispatched Successfully!
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] uppercase mb-4 tracking-tight leading-none">
              Awaiting WhatsApp Setup!
            </h2>
            <p className="text-[#1a1a1a]/70 text-sm max-w-lg mb-8 leading-relaxed font-medium">
              We have initiated a secure chat session to complete your order. If WhatsApp did not open automatically, please click the primary button below to proceed to checkout manually.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <a
                href={`https://wa.me/27616100885?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-[#D4AF37] text-white border-2 border-[#1a1a1a] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-[#D4AF37] transition-all cursor-pointer rounded-none"
              >
                <MessageSquare className="w-4 h-4" />
                Retry WhatsApp Trigger
              </a>
              <button
                onClick={handleFinishCheckout}
                className="px-6 py-4 bg-[#1a1a1a] text-white border-2 border-[#1a1a1a] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#1a1a1a]/80 transition-all cursor-pointer rounded-none"
              >
                Go Back to Catalog
              </button>
            </div>

            <div className="mt-8 border-t-2 border-[#1a1a1a]/10 pt-6 text-[10px] text-[#1a1a1a]/40 font-black uppercase tracking-wider w-full max-w-xl">
              Merchant direct helpline: <strong className="text-[#1a1a1a]/80 font-black">+27 61 610 0885</strong>. Payment details EFT/E-wallet timeline will be processed within our WhatsApp thread.
            </div>
          </div>
        ) : (
          <>
            {/* Form Fields (Left Side) */}
            <form onSubmit={handlePlaceOrder} className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[85vh] md:max-h-[92vh] border-r-2 border-[#1a1a1a] bg-[#f8f7f4]">
              <div className="flex items-center gap-2.5 mb-6">
                <MapPin className="w-5 h-5 text-[#1a1a1a]" />
                <h2 className="text-lg font-black uppercase tracking-tight text-[#1a1a1a]">Delivery & Contact Setup</h2>
              </div>

              {!user && (
                <div className="mb-6 bg-white border-2 border-[#1a1a1a] p-4 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] space-y-2.5 select-none">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#1a1a1a]">
                    💡 Track Your Order History Automatically
                  </p>
                  <p className="text-[9px] text-[#1a1a1a]/60 tracking-wider leading-relaxed font-bold uppercase">
                    You are checking out as a Guest. Sign in with Google to securely log this purchase in your order history database!
                  </p>
                  <button
                    type="button"
                    onClick={handleGoogleSignInFromCheckout}
                    className="h-9 px-4 bg-[#1a1a1a] hover:bg-[#D4AF37] hover:text-white text-white text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-2 border-[#1a1a1a] flex items-center gap-1.5"
                  >
                    Continue with Google
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {/* Contact Name */}
                <div>
                  <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a]/70 uppercase mb-1.5">
                    Contact Full Name <span className="text-red-650 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sipho Nkosi"
                    className={`w-full px-4 py-3 text-sm border-2 border-[#1a1a1a] rounded-none focus:bg-white bg-white text-[#1a1a1a] font-medium outline-hidden transition-all ${
                      formErrors.customerName ? "border-red-650" : "border-[#1a1a1a]"
                    }`}
                  />
                  {formErrors.customerName && (
                    <span className="text-red-500 font-bold text-[10px] block mt-1 uppercase tracking-wider">{formErrors.customerName}</span>
                  )}
                </div>

                {/* Telephone */}
                <div>
                  <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a]/70 uppercase mb-1.5">
                    WhatsApp/Call Contact No. <span className="text-red-650 font-black">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1a1a1a]/55">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +27 61 234 5678"
                      className={`w-full pl-10 pr-4 py-3 text-sm border-2 border-[#1a1a1a] rounded-none focus:bg-white bg-white text-[#1a1a1a] font-medium outline-hidden transition-all ${
                        formErrors.phone ? "border-red-650" : "border-[#1a1a1a]"
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <span className="text-red-500 font-bold text-[10px] block mt-1 uppercase tracking-wider">{formErrors.phone}</span>
                  )}
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a]/70 uppercase mb-1.5">
                    Street Address <span className="text-red-650 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    placeholder="House number, apartment unit, and street name"
                    className={`w-full px-4 py-3 text-sm border-2 border-[#1a1a1a] rounded-none focus:bg-white bg-white text-[#1a1a1a] font-medium outline-hidden transition-all ${
                      formErrors.address ? "border-red-650" : "border-[#1a1a1a]"
                    }`}
                  />
                  {formErrors.address && (
                    <span className="text-red-500 font-bold text-[10px] block mt-1 uppercase tracking-wider">{formErrors.address}</span>
                  )}
                </div>

                {/* City & Province & Postal Code row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a]/70 uppercase mb-1.5">
                      City / Suburb <span className="text-red-650 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      placeholder="Rosebank"
                      className={`w-full px-3 py-3 text-sm border-2 border-[#1a1a1a] rounded-none focus:bg-white bg-white text-[#1a1a1a] font-medium outline-hidden transition-all ${
                        formErrors.city ? "border-red-650" : "border-[#1a1a1a]"
                      }`}
                    />
                    {formErrors.city && (
                      <span className="text-red-500 font-bold text-[10px] block mt-1 uppercase tracking-wider">{formErrors.city}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a]/70 uppercase mb-1.5">
                      Province <span className="text-red-650 font-black">*</span>
                    </label>
                    <select
                      name="province"
                      value={form.province}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 text-sm border-2 border-[#1a1a1a] rounded-none focus:bg-white bg-white text-[#1a1a1a] font-medium outline-hidden"
                    >
                      {SA_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a]/70 uppercase mb-1.5">
                      Postal Code <span className="text-red-650 font-black">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 2196"
                      className={`w-full px-3 py-3 text-sm border-2 border-[#1a1a1a] rounded-none focus:bg-white bg-white text-[#1a1a1a] font-medium outline-hidden transition-all ${
                        formErrors.postalCode ? "border-red-650" : "border-[#1a1a1a]"
                      }`}
                    />
                    {formErrors.postalCode && (
                      <span className="text-red-500 font-bold text-[10px] block mt-1 uppercase tracking-wider">{formErrors.postalCode}</span>
                    )}
                  </div>
                </div>

                {/* Shipping Method */}
                <div>
                  <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a] uppercase mb-2">
                    Select Courier Delivery Speed
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                    <label
                      className={`flex items-center justify-between p-3 border-2 rounded-none cursor-pointer transition-all ${
                        form.shippingMethod.includes("Standard")
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : "border-[#1a1a1a]/30 bg-white text-[#1a1a1a] hover:border-[#1a1a1a]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="Standard Courier (Free)"
                          checked={form.shippingMethod === "Standard Courier (Free)"}
                          onChange={handleInputChange}
                          className="text-[#1a1a1a] border-gray-300 focus:ring-black h-4 w-4"
                        />
                        <div className="text-left">
                          <p className="text-xs font-black uppercase">Standard Delivery</p>
                          <p className={`text-[11px] ${form.shippingMethod.includes("Standard") ? "text-white/70" : "text-[#1a1a1a]/50"}`}>3-5 business days</p>
                        </div>
                      </div>
                      <span className={`text-xs font-black font-mono ${form.shippingMethod.includes("Standard") ? "bg-white text-[#1a1a1a]" : "bg-[#1a1a1a] text-white"} px-1.5 py-0.5 rounded-none`}>Free</span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3 border-2 rounded-none cursor-pointer transition-all ${
                        form.shippingMethod.includes("Express")
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : "border-[#1a1a1a]/30 bg-white text-[#1a1a1a] hover:border-[#1a1a1a]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="Express Overnight Courier"
                          checked={form.shippingMethod === "Express Overnight Courier"}
                          onChange={handleInputChange}
                          className="text-[#1a1a1a] border-gray-300 focus:ring-black h-4 w-4"
                        />
                        <div className="text-left">
                          <p className="text-xs font-black uppercase">Overnight Express</p>
                          <p className={`text-[11px] ${form.shippingMethod.includes("Express") ? "text-white/70" : "text-[#1a1a1a]/50"}`}>Next-day Courier</p>
                        </div>
                      </div>
                      <span className={`text-xs font-black font-mono ${form.shippingMethod.includes("Express") ? "bg-white text-[#1a1a1a]" : "bg-[#1a1a1a] text-white"} px-1.5 py-0.5 rounded-none`}>R150.00</span>
                    </label>
                  </div>
                </div>

                {/* Special Instructions (Notes) */}
                <div>
                  <label className="block text-[10px] font-black tracking-wider text-[#1a1a1a]/70 uppercase mb-1.5">
                    Special Shipping Instructions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Leave with security, buzzer code, call on arrival, etc..."
                    className="w-full px-4 py-3 text-sm border-2 border-[#1a1a1a] rounded-none focus:bg-white bg-white text-[#1a1a1a] font-medium outline-hidden transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] text-white font-black uppercase tracking-widest border-2 border-[#1a1a1a] py-4 px-6 rounded-none text-xs flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-[#D4AF37] disabled:bg-gray-400 transition-colors cursor-pointer"
                  id="checkout-trigger-button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Formatting Order Payload...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Place Order via WhatsApp • R{finalTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Live Message Preview (Right Side) */}
            <div className="w-full md:w-2/5 p-6 md:p-8 bg-[#1a1a1a] text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    WhatsApp Dispatch Receipt
                  </span>
                </div>

                <div className="bg-white/5 border-2 border-white/15 p-4 rounded-none font-mono text-[11px] leading-relaxed select-text overflow-y-auto max-h-[280px] md:max-h-[420px] text-amber-250">
                  <pre className="whitespace-pre-wrap font-sans tracking-wide">{whatsappMessage}</pre>
                </div>
              </div>

               {/* Cart contents sidebar checklist summaries */}
              <div className="mt-6 pt-5 border-t-2 border-white/10 text-gray-400 text-xs">
                <div className="text-[10px] font-black tracking-widest text-white uppercase mb-2">Cart Quick Ledger</div>
                <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between font-mono font-bold">
                      <span className="truncate max-w-[180px] text-gray-300">
                        {item.quantity}x {item.product.title}
                      </span>
                      <span className="text-gray-400 shrink-0">R{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t-2 border-dashed border-white/10 flex justify-between font-mono font-black text-white text-sm">
                  <span>Grand Total:</span>
                  <span className="text-[#D4AF37]">R{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
