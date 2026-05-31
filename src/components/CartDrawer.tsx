import { CartItem } from "../types";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const itemsTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" id="cart-drawer-container">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer box */}
      <div className="relative w-full max-w-md bg-[#f8f7f4] border-l-4 border-[#1a1a1a] h-full flex flex-col shadow-2xl z-10 animate-slide-left p-0">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-[#1a1a1a] bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1a1a1a]" />
            <h2 className="text-lg font-black uppercase tracking-tight text-[#1a1a1a]">Your Bag</h2>
            <span className="bg-[#1a1a1a] text-white text-xs font-black px-2.5 py-0.5 rounded-none font-mono">
              {totalItemsCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#1a1a1a] bg-white border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded-none transition-all cursor-pointer"
            title="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body - Items list */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white border-2 border-[#1a1a1a] rounded-none my-4">
              <div className="w-16 h-16 rounded-none border-2 border-[#1a1a1a] bg-[#e5e3de] flex items-center justify-center mb-4 rotate-3">
                <ShoppingBag className="w-8 h-8 text-[#1a1a1a] animate-pulse" />
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-[#1a1a1a] mb-1">Your bag is empty</h3>
              <p className="text-xs text-[#1a1a1a]/60 max-w-xs mb-6 font-medium">
                Explore our catalog of premium cotton essentials and style items to add them here!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-[#1a1a1a] text-white rounded-none text-xs font-black uppercase tracking-widest hover:bg-[#1a1a1a]/80 transition-all cursor-pointer"
              >
                Start Shop
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-white border-2 border-[#1a1a1a] p-3 rounded-none hover:shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] transition-all"
                id={`cart-item-${item.id}`}
              >
                {/* Product thumbnail */}
                <div className="w-20 h-20 bg-[#e5e3de] rounded-none border border-[#1a1a1a] overflow-hidden shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info and tools */}
                <div className="flex-grow flex flex-col justify-between min-w-0">
                  <div className="relative pr-5">
                    <h4 className="text-xs font-black uppercase tracking-tight text-[#1a1a1a] truncate mb-1">
                      {item.product.title}
                    </h4>
                    
                    {/* Selected specifics */}
                    <div className="flex flex-wrap gap-1.5 text-[9px] text-[#1a1a1a]/70 font-bold uppercase tracking-wider mb-1">
                      <span className="bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 px-1.5 py-0.5 rounded-none">
                        SZ: <strong className="text-[#1a1a1a] font-extrabold">{item.selectedSize}</strong>
                      </span>
                      <span className="bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 px-1.5 py-0.5 rounded-none flex items-center gap-1">
                        COL:
                        <span
                          className="w-2 h-2 rounded-full inline-block border border-black/10"
                          style={{ backgroundColor: item.selectedColor.value }}
                        />
                        <strong className="text-[#1a1a1a] font-extrabold">{item.selectedColor.name}</strong>
                      </span>
                    </div>

                    {/* Trash remove button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute right-0 top-0.5 text-[#1a1a1a]/50 hover:text-red-500 transition-colors p-0.5 rounded-md"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity editor & single item price summary */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1a1a1a]/10">
                    <div className="flex items-center gap-2 border-2 border-[#1a1a1a] bg-white rounded-none p-1 scale-90 origin-left">
                      <button
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="p-1 text-[#1a1a1a] hover:bg-[#1a1a1a]/10 rounded-none transition-colors"
                        title="Reduce"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black font-mono text-[#1a1a1a] px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="p-1 text-[#1a1a1a] hover:bg-[#1a1a1a]/10 rounded-none transition-colors"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-[#1a1a1a] font-mono">
                      R{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer - Totals & Actions */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t-2 border-[#1a1a1a] bg-[#e5e3de] space-y-4">
            <div className="space-y-1.5 text-xs text-[#1a1a1a]/85 font-bold uppercase tracking-wider">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-black text-[#1a1a1a]">R{itemsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Local Shipping</span>
                <span className="font-mono text-emerald-700 font-black uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20">Free Shipping</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#1a1a1a] pt-2 border-t-2 border-[#1a1a1a]/15">
                <span>Total Amount:</span>
                <span className="font-mono text-[#1a1a1a]">R{itemsTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="pt-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-[#D4AF37] text-white font-black uppercase tracking-widest py-4 px-5 border-2 border-[#1a1a1a] rounded-none text-xs flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-[#D4AF37] transition-all cursor-pointer group"
                id="cart-drawer-checkout-btn"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Safe assurances */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#1a1a1a]/60 uppercase tracking-widest font-black">
              <ShieldCheck className="w-4 h-4 text-[#1a1a1a]" />
              <span>Direct WhatsApp Integration</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
