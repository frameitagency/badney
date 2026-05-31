import React, { useState, useEffect } from "react";
import { Product, ProductColor } from "../types";
import { X, Minus, Plus, ShoppingBag, Check, ChevronLeft, ChevronRight, Star, Shield, Truck } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, qty: number) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Reset states when a new product is selected
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || "");
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      setActiveImageIdx(0);
    }
  }, [product]);

  // Handle outside overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "modal-backdrop") {
      onClose();
    }
  };

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddClick = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in"
    >
      <div
        id="product-quickview-box"
        className="w-full max-w-4xl bg-[#f8f7f4] border-4 border-[#1a1a1a] rounded-none overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative animate-scale-up max-h-[95vh] md:max-h-none overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#1a1a1a] bg-white border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded-none transition-all cursor-pointer"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Container (Left Panel) */}
          <div className="relative bg-[#e5e3de] flex flex-col justify-center min-h-[320px] md:min-h-[480px] border-b-2 md:border-b-0 md:border-r-2 border-[#1a1a1a]">
            {/* Absolute Rotating Accent tag */}
            <div className="absolute top-4 left-4 z-10 bg-white border-2 border-[#1a1a1a] text-[10px] font-black uppercase tracking-widest px-3 py-1 -rotate-6 shadow-sm">
              PREMIUM COTTON
            </div>

            <div className="relative aspect-square w-full overflow-hidden flex items-center justify-center">
              <img
                src={product.images[activeImageIdx]}
                alt={`${product.title} view ${activeImageIdx + 1}`}
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-none hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-none hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-2 p-4 justify-center bg-[#d9d7d2] border-t-2 border-[#1a1a1a]">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-12 border-2 rounded-none overflow-hidden bg-white transition-all cursor-pointer ${
                      idx === activeImageIdx ? "border-[#1a1a1a] scale-102 ring-2 ring-white" : "border-[#1a1a1a]/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Configuration and Details (Right Panel) */}
          <div className="p-6 md:p-8 flex flex-col max-h-[80vh] md:max-h-none overflow-y-auto bg-[#f8f7f4]">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#1a1a1a]/50 uppercase mb-2 block">
              Product SKU: BC-{product.id}-001
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-[#1a1a1a]/40 bg-[#1a1a1a]/10 px-2 py-0.5 inline-block self-start mb-2 uppercase">
              {product.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] uppercase tracking-tight mb-4 leading-none">
              {product.title}
            </h2>

            {/* Reviews Section */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#1a1a1a]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < Math.round(product.rating) ? "text-[#1a1a1a]" : "text-[#1a1a1a]/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-[#1a1a1a] font-mono">
                {product.rating} / 5
              </span>
              <span className="text-xs text-[#1a1a1a]/30">|</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 uppercase tracking-wider">In Stock</span>
            </div>

            {/* Prices */}
            <div className="flex items-baseline gap-3 mb-6 bg-white p-4 border-2 border-[#1a1a1a]">
              <span className="text-2xl font-black text-[#1a1a1a]">
                R{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#1a1a1a]/40 line-through font-bold">
                  R{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Short description */}
            <p className="text-[#1a1a1a]/70 text-sm mb-6 leading-relaxed font-medium">
              {product.description}
            </p>

            <hr className="border-[#1a1a1a]/10 mb-6" />

            {/* Sizes picker */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between text-[10px] font-black uppercase text-[#1a1a1a] tracking-wider mb-2">
                  <span>Select Size:</span>
                  <span className="underline">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[48px] h-[44px] border-2 px-3 flex items-center justify-center text-xs font-black rounded-none transition-all cursor-pointer ${
                        selectedSize === sz
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : "border-[#1a1a1a]/30 text-[#1a1a1a] hover:border-[#1a1a1a]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors picker */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-[10px] font-black uppercase text-[#1a1a1a] tracking-wider mb-2">
                  <span>Select Color:</span>
                  <span className="underline">{selectedColor?.name}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((col) => {
                    const isSelected = selectedColor?.name === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        style={{ backgroundColor: col.value }}
                        className={`w-8 h-8 rounded-full border border-black/10 focus:outline-hidden hover:scale-105 transition-transform flex items-center justify-center relative cursor-pointer ${
                          isSelected ? "ring-2 ring-[#1a1a1a] ring-offset-2" : ""
                        }`}
                        title={col.name}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white drop-shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector + Add Action */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-auto">
              {/* Counter */}
              <div className="flex items-center justify-between border-2 border-[#1a1a1a] bg-white rounded-none p-2 sm:max-w-[140px] w-full">
                <button
                  type="button"
                  onClick={decrementQty}
                  className="p-1 text-[#1a1a1a] hover:bg-[#1a1a1a]/10 rounded-none transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-black font-mono text-[#1a1a1a]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQty}
                  className="p-1 text-[#1a1a1a] hover:bg-[#1a1a1a]/10 rounded-none transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAddClick}
                className="flex-grow bg-[#D4AF37] text-white font-black uppercase tracking-widest border-2 border-[#1a1a1a] rounded-none text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-[#D4AF37] transition-all cursor-pointer w-full"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart • R{(product.price * quantity).toFixed(2)}
              </button>
            </div>

            {/* Details accordions or fine list */}
            {product.details && (
              <div className="border-t-2 border-[#1a1a1a]/10 pt-4 mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1a1a1a] block mb-2">
                  Composition & Care
                </span>
                <ul className="list-disc pl-4 text-xs text-[#1a1a1a]/60 space-y-1 font-medium">
                  {product.details.map((detail, dIdx) => (
                    <li key={dIdx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reassurance Info lines */}
            <div className="grid grid-cols-2 gap-4 border-t-2 border-[#1a1a1a]/10 pt-4 text-[9px] text-[#1a1a1a]/60 uppercase font-black tracking-wider">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1a1a1a] shrink-0" />
                <span>Fast RSA Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1a1a1a] shrink-0" />
                <span>WhatsApp Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
