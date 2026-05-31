import React, { useState, useRef } from "react";
import { Product, ProductColor } from "../types";
import { X, Plus, Trash2, Edit2, Upload, RefreshCcw, Check, Sparkles, Image as ImageIcon, Lock } from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  onResetProducts: () => void;
  heroImage: string;
  onSaveHeroImage: (url: string) => void;
  lookbookLeftImage: string;
  onSaveLookbookLeftImage: (url: string) => void;
  lookbookRightTopImage: string;
  onSaveLookbookRightTopImage: (url: string) => void;
  lookbookRightBottomLeftImage: string;
  onSaveLookbookRightBottomLeftImage: (url: string) => void;
  lookbookRightBottomRightImage: string;
  onSaveLookbookRightBottomRightImage: (url: string) => void;
  aboutSectionImage: string;
  onSaveAboutSectionImage: (url: string) => void;
}

const PRESET_IMAGES = [
  { label: "Yellow Sweatshirt", path: "/src/assets/images/yellow_sweatshirt_1780198346869.png" },
  { label: "White Sweatshirt", path: "/src/assets/images/white_sweatshirt_1780198364843.png" },
  { label: "Grey heavy Hoodie", path: "/src/assets/images/grey_hoodie_1780198380942.png" },
  { label: "Coffee BD Crest Sweatshirt", path: "/src/assets/images/man_coffee_sweatshirt_1780198396172.png" },
  { label: "Purple Studio Tee", path: "/src/assets/images/man_purple_tshirt_1780198411762.png" },
  { label: "Ribbed Monogram Tee", path: "/src/assets/images/ribbed_tshirt_close_1780198427615.png" },
  { label: "Classic Afro Tee", path: "/src/assets/images/woman_bedroom_tshirt_1780198442699.png" },
  { label: "Midnight Onyx Flat", path: "/src/assets/images/black_tshirt_flat_1780198458828.png" },
  { label: "Heavy Checked Tag Tee", path: "/src/assets/images/black_tshirt_tag_1780198474031.png" },
  { label: "Model In Studio", path: "/src/assets/images/model_white_hoodie_1780196790776.png" },
  { label: "Chic Woman Streetwear", path: "/src/assets/images/model_chic_woman_1780196807605.png" }
];

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  onResetProducts,
  heroImage,
  onSaveHeroImage,
  lookbookLeftImage,
  onSaveLookbookLeftImage,
  lookbookRightTopImage,
  onSaveLookbookRightTopImage,
  lookbookRightBottomLeftImage,
  onSaveLookbookRightBottomLeftImage,
  lookbookRightBottomRightImage,
  onSaveLookbookRightBottomRightImage,
  aboutSectionImage,
  onSaveAboutSectionImage
}: AdminPanelProps) {
  // Navigation tabs: "list" | "form"
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  
  // Security constraints
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem("bc_admin_unlocked") === "true";
  });

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "frameit646") {
      setIsUnlocked(true);
      sessionStorage.setItem("bc_admin_unlocked", "true");
      setErrorMsg("");
    } else {
      setErrorMsg("INVALID HEADQUARTERS SECURITY ACCESS CODE");
      setPasscode("");
    }
  };
  
  // Form edit target
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("MEN");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [isNew, setIsNew] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [rating, setRating] = useState("5.0");
  
  // Multi-image fields
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Media Section Customizer Config
  const [selectedMediaSection, setSelectedMediaSection] = useState<
    "hero" | "lookbookLeft" | "lookbookRightTop" | "lookbookRightBottomLeft" | "lookbookRightBottomRight" | "about"
  >("hero");
  const [customMediaUrl, setCustomMediaUrl] = useState("");
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // Colors fields
  const [colors, setColors] = useState<ProductColor[]>([
    { name: "Coal Black", value: "#1a1a1a" },
    { name: "Chalk White", value: "#ffffff" }
  ]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#D4AF37");

  // Details bullet point helpers
  const [details, setDetails] = useState<string[]>([
    "100% Cotton construction tailored for city life",
    "Reinforced collar ribbing and dual-stitch margins"
  ]);
  const [newDetailPoint, setNewDetailPoint] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  if (!isUnlocked) {
    return (
      <div
        id="admin-backdrop-lock"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
      >
        <div
          id="admin-lock-card"
          className="w-full max-w-sm bg-[#f8f7f4] border-4 border-[#1a1a1a] p-6 text-center shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]"
        >
          <div className="flex flex-col items-center mb-5">
            <div className="w-12 h-12 bg-black flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-md font-black tracking-widest uppercase font-sans text-[#1a1a1a]">
              HQ SECURITY ACCESS
            </h2>
            <p className="text-[9px] font-mono font-bold tracking-wider text-gray-500 uppercase mt-1">
              Badney Cotton Restricted Domain
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-black tracking-wider text-gray-700 block">
                Enter HQ Security Code *
              </label>
              <input
                type="password"
                required
                placeholder="• • • • • • • •"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full text-center bg-white border-2 border-[#1a1a1a] p-3 text-xs tracking-wider font-mono font-black text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                autoFocus
                autoComplete="current-password"
              />
            </div>

            {errorMsg && (
              <p className="text-[9px] font-black text-red-600 tracking-wider text-center uppercase font-mono bg-red-50 border border-red-200 py-1.5 px-2">
                {errorMsg}
              </p>
            )}

            <div className="pt-2 flex gap-3 text-center">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] font-black uppercase tracking-widest hover:bg-gray-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 text-xs bg-[#D4AF37] text-white border-2 border-[#1a1a1a] font-black uppercase tracking-widest hover:bg-[#B89047] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Open Add Form
  const triggerAddForm = () => {
    setEditingProduct(null);
    setTitle("");
    setPrice("");
    setOriginalPrice("");
    setCategory("MEN");
    setDescription("");
    setSizes(["S", "M", "L", "XL"]);
    setIsNew(true);
    setIsBestSeller(false);
    setRating("5.0");
    setImages(["/src/assets/images/yellow_sweatshirt_1780198346869.png"]);
    setColors([
      { name: "Coal Black", value: "#1a1a1a" },
      { name: "Chalk White", value: "#ffffff" }
    ]);
    setDetails([
      "100% fine organic long-loop combed cotton",
      "Designed and crafted locally in Johannesburg, South Africa"
    ]);
    setActiveTab("form");
  };

  // Open Edit Form
  const triggerEditForm = (item: Product) => {
    setEditingProduct(item);
    setTitle(item.title);
    setPrice(item.price.toString());
    setOriginalPrice(item.originalPrice ? item.originalPrice.toString() : "");
    setCategory(item.category);
    setDescription(item.description);
    setSizes(item.sizes);
    setIsNew(!!item.isNew);
    setIsBestSeller(!!item.isBestSeller);
    setRating(item.rating.toString());
    setImages(item.images || []);
    setColors(item.colors || []);
    setDetails(item.details || []);
    setActiveTab("form");
  };

  // Remove a product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const filtered = products.filter((p) => p.id !== productId);
      onSaveProducts(filtered);
    }
  };

  // Add detail point
  const handleAddDetail = () => {
    if (newDetailPoint.trim()) {
      setDetails([...details, newDetailPoint.trim()]);
      setNewDetailPoint("");
    }
  };

  // Remove detail point
  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  // Add color
  const handleAddColor = () => {
    if (newColorName.trim() && newColorValue.trim()) {
      setColors([...colors, { name: newColorName.trim(), value: newColorValue.trim() }]);
      setNewColorName("");
    }
  };

  // Remove color
  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Toggle size check
  const handleToggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  // Select Preset Image
  const handleSelectPreset = (path: string) => {
    if (images.includes(path)) {
      setImages(images.filter((img) => img !== path));
    } else {
      setImages([...images, path]);
    }
  };

  // Custom Image Input
  const handleAddCustomImage = () => {
    if (customImageUrl.trim() && !images.includes(customImageUrl.trim())) {
      setImages([...images, customImageUrl.trim()]);
      setCustomImageUrl("");
    }
  };

  // Local File Upload Convert to Base64 (Perfect persistence support)
  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImages([...images, base64String]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const getActiveSectionImage = () => {
    switch (selectedMediaSection) {
      case "hero": return heroImage;
      case "lookbookLeft": return lookbookLeftImage;
      case "lookbookRightTop": return lookbookRightTopImage;
      case "lookbookRightBottomLeft": return lookbookRightBottomLeftImage;
      case "lookbookRightBottomRight": return lookbookRightBottomRightImage;
      case "about": return aboutSectionImage;
      default: return "";
    }
  };

  const saveActiveSectionImage = (url: string) => {
    switch (selectedMediaSection) {
      case "hero": onSaveHeroImage(url); break;
      case "lookbookLeft": onSaveLookbookLeftImage(url); break;
      case "lookbookRightTop": onSaveLookbookRightTopImage(url); break;
      case "lookbookRightBottomLeft": onSaveLookbookRightBottomLeftImage(url); break;
      case "lookbookRightBottomRight": onSaveLookbookRightBottomRightImage(url); break;
      case "about": onSaveAboutSectionImage(url); break;
    }
  };

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        saveActiveSectionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Save/Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || isNaN(Number(price))) {
      alert("Please provide a valid Title and Numeric Price.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload an image file or choose at least one photo preset!");
      return;
    }

    const payload: Product = {
      id: editingProduct ? editingProduct.id : `bc-${Date.now()}`,
      title: title.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      rating: parseFloat(rating) || 5.0,
      category,
      images,
      description: description.trim() || `Badney Cotton collection edition custom structured ${title}.`,
      sizes: sizes.length ? sizes : ["S", "M", "L", "XL"],
      colors,
      details: details.length ? details : ["Crafted with high-combed local organic cotton finish"],
      isNew,
      isBestSeller
    };

    if (editingProduct) {
      // Edit
      const updatedList = products.map((p) => (p.id === editingProduct.id ? payload : p));
      onSaveProducts(updatedList);
    } else {
      // Add
      onSaveProducts([payload, ...products]);
    }

    setActiveTab("list");
    setEditingProduct(null);
  };

  return (
    <div
      id="admin-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
    >
      <div
        id="admin-sidebar"
        className="relative w-full max-w-2xl h-full sm:h-[95vh] bg-[#f8f7f4] border-l-4 sm:border-4 border-[#1a1a1a] flex flex-col shadow-[8px_8px_0px_0px_rgba(212,175,55,1)]"
      >
        {/* Header decoration */}
        <div className="bg-[#1a1a1a] text-white py-4 px-6 flex items-center justify-between border-b-4 border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#D4AF37] rounded-none inline-block animate-pulse" />
            <h2 className="text-lg font-black tracking-widest uppercase font-sans">
              Badney HQ Catalog Control
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 text-white hover:text-[#D4AF37] transition-colors rounded-none outline-none cursor-pointer"
            title="Close Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white border-b-2 border-[#1a1a1a]">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider border-r-2 border-[#1a1a1a] transition-all cursor-pointer ${
              activeTab === "list" ? "bg-[#D4AF37] text-white" : "text-[#1a1a1a] hover:bg-gray-100"
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={triggerAddForm}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "form" && !editingProduct ? "bg-[#D4AF37] text-white" : "text-[#1a1a1a] hover:bg-gray-100"
            }`}
          >
            {editingProduct ? `Editing: ${editingProduct.title.substring(0, 18)}...` : "Upload New Product"}
          </button>
        </div>

        {/* Dynamic Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "list" ? (
            <div className="space-y-4 text-left">
              {/* Reset Control & Summary info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37] font-mono">
                    System Control
                  </p>
                  <p className="text-xs text-gray-500 font-bold mt-1">
                    Manage active store product prices, tags, categories, and visuals.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("This will erase custom uploads and restore the default 9 Badney products. Continue?")) {
                      onResetProducts();
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white hover:bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-[#1a1a1a] transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(37,211,102,1)]"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>

              {/* HQ WEBSITE SECTION IMAGES CONTROL BOARD */}
              <div className="bg-white p-4 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-dashed border-stone-200">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#1a1a1a] font-sans">
                      HQ Section Image & Showcase Control
                    </p>
                  </div>
                  <span className="text-[9px] font-mono font-black text-[#D4AF37] bg-black px-2 py-0.5 uppercase self-start sm:self-auto">
                    Live Theme Editor
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-gray-700 block">
                    Select Section to Customize *
                  </label>
                  <select
                    value={selectedMediaSection}
                    onChange={(e) => {
                      setSelectedMediaSection(e.target.value as any);
                      setCustomMediaUrl("");
                    }}
                    className="w-full bg-stone-50 border-2 border-[#1a1a1a] p-2 text-xs font-black uppercase tracking-wider text-[#1a1a1a] outline-none"
                  >
                    <option value="hero">1. MAIN HERO CAMPAIGN BANNER</option>
                    <option value="lookbookLeft">2. LOOKBOOK LEFT (COLLEGIATE CREST BANNER)</option>
                    <option value="lookbookRightTop">3. LOOKBOOK RIGHT TOP (AFRO EDITION BANNER)</option>
                    <option value="lookbookRightBottomLeft">4. LOOKBOOK RIGHT BOTTOM LEFT (RIBBED TEES MINI)</option>
                    <option value="lookbookRightBottomRight">5. LOOKBOOK RIGHT BOTTOM RIGHT (MIDNIGHT ONYX MINI)</option>
                    <option value="about">6. MANUFACTURING ETHOS SECTION BANNER</option>
                  </select>
                </div>

                {/* Current Section Preview */}
                <div className="relative w-full aspect-[21/9] bg-stone-900 border-2 border-[#1a1a1a] overflow-hidden select-none">
                  {getActiveSectionImage() ? (
                    <img
                      src={getActiveSectionImage()}
                      alt="Active Section Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90 animate-fade-in"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-xs font-bold text-gray-400">Empty Section Image. Enter URL or Upload reference below.</p>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-[#D4AF37] uppercase">
                      Active Image Preview
                    </span>
                    <span className="text-[8px] font-mono text-gray-300 truncate max-w-[200px]">
                      {getActiveSectionImage()?.startsWith("data:") ? "Custom Base64 Upload" : getActiveSectionImage()}
                    </span>
                  </div>
                </div>

                {/* Upload & Url config inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-600 font-sans font-bold">
                      Upload Custom Local File
                    </p>
                    <button
                      type="button"
                      onClick={() => mediaFileInputRef.current?.click()}
                      className="w-full h-10 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#D4AF37] hover:text-white text-white py-2 px-3 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-[#1a1a1a]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Browse PC/Mobile
                    </button>
                    <input
                      type="file"
                      ref={mediaFileInputRef}
                      onChange={handleMediaFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-600 font-sans font-bold">
                      Or Paste Any Image Web Link
                    </p>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={customMediaUrl}
                        onChange={(e) => setCustomMediaUrl(e.target.value)}
                        className="flex-1 bg-white border-2 border-[#1a1a1a] px-2.5 h-10 text-xs text-[#1a1a1a] outline-none font-bold placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customMediaUrl.trim()) {
                            saveActiveSectionImage(customMediaUrl.trim());
                            setCustomMediaUrl("");
                          }
                        }}
                        className="bg-[#1a1a1a] hover:bg-[#D4AF37] hover:text-white text-white px-3.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-2 border-[#1a1a1a] h-10"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Select Preset quick selectors */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    Quick Select From Wardrobe Shoots Portfolio:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {PRESET_IMAGES.map((preset) => {
                      const isActive = getActiveSectionImage() === preset.path;
                      return (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => saveActiveSectionImage(preset.path)}
                          className={`p-0.5 border-2 text-center text-[10px] relative transition-all overflow-hidden ${
                            isActive ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-200 bg-gray-50 hover:border-[#1a1a1a]"
                          }`}
                        >
                          <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative select-none">
                            <img
                              src={preset.path}
                              alt={preset.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {isActive && (
                              <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-[#D4AF37] stroke-[3px]" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items Card Grid */}
              <div className="grid grid-cols-1 gap-3">
                {products.length === 0 ? (
                  <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300">
                    <p className="font-bold text-gray-400">No products inside store catalog.</p>
                  </div>
                ) : (
                  products.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border-2 border-[#1a1a1a] p-3 flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:border-[#D4AF37] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 border border-gray-200 select-none shrink-0 overflow-hidden bg-gray-50 bg-center bg-cover">
                          <img
                            src={item.images[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150"}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-black tracking-wider uppercase text-[#D4AF37] bg-black px-1.5 py-0.5 font-mono">
                            {item.category}
                          </span>
                          <h4 className="font-black text-xs sm:text-sm text-[#1a1a1a] mt-1 truncate max-w-[240px] uppercase">
                            {item.title}
                          </h4>
                          <p className="font-mono text-xs text-gray-500 font-bold">
                            R {item.price.toFixed(2)}{" "}
                            {item.originalPrice && (
                              <span className="line-through text-gray-300 text-[11px] ml-1">
                                R {item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => triggerEditForm(item)}
                          className="p-2 border border-[#1a1a1a] hover:bg-[#D4AF37] hover:text-white transition-all cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-2 border border-[#1a1a1a] hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* ================= FORM TAB ================= */
            <form onSubmit={handleSubmit} className="space-y-6 text-left pb-10">
              <div className="bg-white p-4 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <span className="text-[9px] font-black tracking-widest text-[#D4AF37] bg-[#1a1a1a] px-2 py-0.5 font-mono">
                  {editingProduct ? "MODIFY MODE" : "CREATION ENGINE"}
                </span>
                <h3 className="text-sm font-black uppercase text-[#1a1a1a] mt-1">
                  {editingProduct ? `Edit metadata for: ${editingProduct.title}` : "Create and upload custom apparel baseline"}
                </h3>
              </div>

              {/* Title, Category & Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5Col font-bold">
                  <label className="text-xs uppercase font-black tracking-wider text-gray-700">Apparel Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Badney Cotton Oversized Crewneck"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border-2 border-[#1a1a1a] p-2.5 text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-black tracking-wider text-gray-700">Display Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border-2 border-[#1a1a1a] p-2.5 text-xs text-[#1a1a1a] font-bold focus:ring-1 focus:ring-[#D4AF37] outline-none"
                  >
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="ACCESSORIES">ACCESSORIES</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-black tracking-wider text-gray-700">Store Price (ZAR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="799"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border-2 border-[#1a1a1a] p-2.5 text-xs font-mono text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-black tracking-wider text-gray-700">Original Price (Strike)</label>
                  <input
                    type="number"
                    placeholder="e.g. 950"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-white border-2 border-[#1a1a1a] p-2.5 text-xs font-mono text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-black tracking-wider text-gray-700">Appeared Rating *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-white border-2 border-[#1a1a1a] p-2.5 text-xs font-mono text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none font-bold"
                  />
                </div>
              </div>

              {/* Status checkboxes */}
              <div className="flex items-center gap-6 p-3 bg-white border-2 border-[#1a1a1a]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs uppercase font-black tracking-wider text-gray-700 mt-0.5">Label as "NEW ENTRY"</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs uppercase font-black tracking-wider text-gray-700 mt-0.5">Label as "BEST SELLER"</span>
                </label>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-black tracking-wider text-gray-700">Apparel Description</label>
                <textarea
                  rows={3}
                  placeholder="Experience comfort styled in premium long-loop ringspun South African cotton with dropped seams..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border-2 border-[#1a1a1a] p-2.5 text-xs text-[#1a1a1a] leading-relaxed focus:ring-1 focus:ring-[#D4AF37] outline-none font-bold"
                />
              </div>

              {/* IMAGES COMPONENT - PRESET SELECT OR SOURCE DROP OR INPUT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-black tracking-wider text-gray-700">
                    Product Showcase Visuals *
                  </label>
                  <span className="text-[10px] font-bold text-gray-400">
                    ({images.length} added)
                  </span>
                </div>

                {/* Local dragging / file selection box */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-4 border-dashed p-6 text-center transition-all cursor-pointer rounded-none relative flex flex-col items-center justify-center ${
                    dragActive
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-gray-300 hover:border-[#1a1a1a] bg-white"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs font-black uppercase text-gray-700 tracking-wider">
                    Drag & Drop Local Image File Here
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-bold">
                    Or click to browse storage. High-res files convert locally to offline Base64.
                  </p>
                </div>

                {/* Preset selectors catalog */}
                <div className="space-y-2.5 p-3.5 bg-white border-2 border-[#1a1a1a]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Select Built-In Wardrobe Shoot Presets (Multi-select)
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((preset) => {
                      const selected = images.includes(preset.path);
                      return (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => handleSelectPreset(preset.path)}
                          className={`p-1 border-2 text-center text-[10px] relative transition-all group overflow-hidden ${
                            selected ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-gray-200 bg-gray-50 hover:border-[#1a1a1a]"
                          }`}
                        >
                          <div className="aspect-square bg-gray-200 border border-gray-100 overflow-hidden relative select-none">
                            <img
                              src={preset.path}
                              alt={preset.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {selected && (
                              <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                                <Check className="w-5 h-5 text-[#D4AF37]" />
                              </div>
                            )}
                          </div>
                          <span className="block mt-1 font-sans text-[8px] truncate leading-tight font-black uppercase tracking-tight">
                            {preset.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* External Custom Image Link */}
                <div className="space-y-1 bg-white p-3 border-2 border-[#1a1a1a] flex gap-2 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Or enter any web-hosted photo URL (Unsplash etc.)"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="w-full bg-white border border-gray-300 p-2 text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomImage}
                    className="bg-[#1a1a1a] text-white text-xs px-3.5 py-2 hover:bg-[#D4AF37] transition-colors font-black uppercase tracking-wider h-9"
                  >
                    Add
                  </button>
                </div>

                {/* Added Image list overview */}
                {images.length > 0 && (
                  <div className="p-3.5 bg-white border-2 border-[#1a1a1a]">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">
                      Active Slider Photos for this Product (first acts as core thumbnail):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-14 h-14 border-2 border-[#1a1a1a] relative group overflow-hidden bg-gray-50"
                        >
                          <img
                            src={img}
                            alt="Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="absolute top-0 right-0 bg-red-600 text-white p-0.5 hover:bg-black transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[7px] text-center font-bold tracking-tighter">
                            Slide {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Standard Sizes Selection */}
              <div className="space-y-2 p-3.5 bg-white border-2 border-[#1a1a1a]">
                <label className="text-xs uppercase font-black tracking-wider text-gray-700 block">
                  Available Sizing Selection *
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {DEFAULT_SIZES.map((sz) => {
                    const exists = sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`w-11 h-11 text-xs font-black border-2 transition-all rounded-none ${
                          exists
                            ? "bg-[#1a1a1a] text-[#D4AF37] border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(212,175,55,1)]"
                            : "bg-white text-gray-500 border-gray-200 hover:border-[#1a1a1a]"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apparel Colors palette selection */}
              <div className="space-y-3 p-4 bg-white border-2 border-[#1a1a1a]">
                <label className="text-xs uppercase font-black tracking-wider text-[#1a1a1a] block">
                  Available Thread/Fabric Colors
                </label>
                
                {colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {colors.map((col, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-300 rounded-none text-xs font-bold"
                      >
                        <span
                          className="w-3 h-3 border border-gray-300"
                          style={{ backgroundColor: col.value }}
                        />
                        <span>{col.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="text-gray-400 hover:text-red-500 font-bold ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Coal Black)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 p-2 text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                  />
                  <input
                    type="color"
                    value={newColorValue}
                    onChange={(e) => setNewColorValue(e.target.value)}
                    className="w-9 h-9 p-0 border border-gray-300 cursor-pointer bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="bg-[#1a1a1a] text-white text-xs px-4 py-2 hover:bg-[#D4AF37] uppercase font-black tracking-wider h-9"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Custom specs details lines */}
              <div className="space-y-3 p-4 bg-white border-2 border-[#1a1a1a]">
                <label className="text-xs uppercase font-black tracking-wider text-gray-700 block">
                  Product Details / Bullet Points
                </label>

                {details.length > 0 && (
                  <ul className="space-y-1.5 list-disc pl-5">
                    {details.map((pt, idx) => (
                      <li key={idx} className="text-xs font-bold text-gray-600">
                        <div className="flex items-center justify-between gap-2">
                          <span>{pt}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDetail(idx)}
                            className="text-red-600 hover:text-black font-black text-xs px-1"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Double brushed internal fleece structure"
                    value={newDetailPoint}
                    onChange={(e) => setNewDetailPoint(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 p-2 text-xs text-[#1a1a1a] focus:ring-1 focus:ring-[#D4AF37] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    className="bg-[#1a1a1a] text-white text-xs px-4 py-2 hover:bg-[#D4AF37] uppercase font-black tracking-wider h-9"
                  >
                    Add Point
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-4 pt-4 border-t-2 border-[#1a1a1a]">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="flex-1 py-3 text-xs bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] font-black uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs bg-[#D4AF37] text-white border-2 border-[#1a1a1a] font-black uppercase tracking-widest hover:bg-[#B89047] shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Publish Clothing Wear"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
