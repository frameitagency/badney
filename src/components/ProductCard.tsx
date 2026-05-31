import React from "react";
import { Product } from "../types";
import { Star, Eye, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onAddToCartDirect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  onAddToCartDirect,
}) => {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-[#f8f7f4] border-2 border-[#1a1a1a] rounded-none overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all duration-200 h-full"
    >
      {/* Visual BADGES */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest uppercase text-white bg-blue-600 border border-[#1a1a1a]">
            NEW ARRIVAL
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest uppercase text-white bg-indigo-950 border border-[#1a1a1a]">
            BEST SELLER
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="px-2 py-0.5 text-[9px] font-extrabold tracking-widest uppercase text-white bg-red-650 border border-[#1a1a1a]">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Frame Container */}
      <div className="relative aspect-square w-full bg-[#e5e3de] overflow-hidden cursor-pointer" onClick={() => onOpenQuickView(product)}>
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-103"
        />
        
        {/* Hover overlay controls */}
        <div className="absolute inset-0 bg-[#1a1a1a]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="p-3 bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white rounded-none shadow-sm transition-colors duration-150"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCartDirect(product);
            }}
            className="p-3 bg-[#D4AF37] text-white border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#D4AF37] rounded-none shadow-sm transition-colors duration-150"
            title="Quick Add"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow p-5 border-t border-[#1a1a1a]/10">
        {/* Category string */}
        <span className="text-[9px] font-black tracking-[0.25em] text-[#1a1a1a]/45 uppercase mb-1">
          {product.category}
        </span>
        
        {/* Title */}
        <h3
          onClick={() => onOpenQuickView(product)}
          className="text-xs font-black uppercase tracking-tight text-[#1a1a1a] hover:text-blue-600 cursor-pointer min-h-[40px] line-clamp-2 mb-2 transition-colors duration-150"
        >
          {product.title}
        </h3>

        {/* Rating stars */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex text-[#1a1a1a]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 fill-current ${
                  i < Math.round(product.rating) ? "text-[#1a1a1a]" : "text-[#1a1a1a]/20"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#1a1a1a]/60 font-mono">({product.rating})</span>
        </div>

        {/* Pricing Layout */}
        <div className="mt-auto flex items-baseline gap-2 pt-3 border-t border-[#1a1a1a]/10">
          <span className="text-sm font-black text-[#1a1a1a] tracking-tight">
            R{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#1a1a1a]/40 line-through">
              R{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
