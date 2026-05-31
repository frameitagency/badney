import React, { useState, useEffect } from "react";
import { 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { X, LogIn, LogOut, Package, Clock, MapPin, ClipboardList, Shield, RefreshCw } from "lucide-react";

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserAccountModal({ isOpen, onClose }: UserAccountModalProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(false);

  // Monitor auth status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setAuthError(null);
        // Load orders
        await loadUserOrders(currentUser.uid);
        // Provision user profile in firestore if not exists
        await syncUserProfile(currentUser);
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const syncUserProfile = async (currentUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        const username = currentUser.displayName || currentUser.email?.split("@")[0] || "Customer";
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: username,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Profile sync error: ", err);
    }
  };

  const loadUserOrders = async (uid: string) => {
    setFetchingOrders(true);
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      
      const ordersList: any[] = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });

      // Sort client-side safely by createdAt to avoid potential missing index errors
      ordersList.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds : 0;
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds : 0;
        return bTime - aTime; // Newest first
      });

      setOrders(ordersList);
    } catch (err) {
      console.error("Failed to load orders: ", err);
      // Implement guidelines specified error formatting
      try {
        handleFirestoreError(err, OperationType.LIST, 'orders');
      } catch (formattedError: any) {
        setAuthError("Failed to fetch order list securely: permissions denied or offline.");
      }
    } finally {
      setFetchingOrders(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google login error: ", err);
      setAuthError(err.message || "Authentication aborted by user.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      onClose();
    } catch (err: any) {
      console.error("Log out error: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl bg-[#f8f7f4] border-4 border-[#1a1a1a] rounded-none overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b-4 border-[#1a1a1a] bg-white select-none">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-sm font-black uppercase tracking-widest text-[#1a1a1a]">
              Secure Customer Portal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#1a1a1a] bg-white border-2 border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-wider text-[#1a1a1a]/60">
                Verifying Credentials & Workspace...
              </p>
            </div>
          ) : !user ? (
            /* SIGNUP / LOGIN PROMPT SCREEN */
            <div className="max-w-md mx-auto text-center py-10 space-y-6">
              <div className="inline-flex w-16 h-16 rounded-none border-4 border-[#1a1a1a] bg-white items-center justify-center shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <Package className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#1a1a1a] uppercase tracking-tight">
                  Track Your Wardrobe Orders
                </h3>
                <p className="text-xs text-[#1a1a1a]/70 font-bold uppercase tracking-wider leading-relaxed">
                  Sign up once and secure your checkout details automatically. You can retrieve historic WhatsApp orders, check logistics, and re-order with instant one-tap tracking.
                </p>
              </div>

              {authError && (
                <div className="bg-red-50 border-2 border-red-500 p-3.5 text-center text-red-700 text-[10px] font-mono font-bold uppercase tracking-wide">
                  Error: {authError}
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                className="w-full h-14 bg-white hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                {/* Standard SVG Google Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.42-2.519 4.114-5.147 4.114-3.478 0-6.301-2.823-6.301-6.3s2.823-6.3 6.301-6.3c1.512 0 2.89.54 3.974 1.428l3.14-3.141C18.99 2.222 15.822 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.894 0 10.957-4.244 10.957-11.24 0-.741-.06-1.428-.182-1.955H12.24z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          ) : (
            /* ACTIVE USER PORTAL & PAST ORDERS VIEW */
            <div className="space-y-6">
              {/* Profile Bar Dashboard */}
              <div className="bg-white p-5 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-black text-[#D4AF37] bg-[#1a1a1a] px-2 py-0.5 border border-[#1a1a1a] uppercase">
                    Session Profile Registered
                  </span>
                  <h3 className="text-base font-black text-[#1a1a1a] uppercase tracking-tight">
                    {user.displayName || "Elite Customer"}
                  </h3>
                  <p className="text-[10px] font-mono font-black text-gray-500 uppercase">
                    Email: {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 border-2 border-red-650 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>

              {/* Order Ledger Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                  <ClipboardList className="w-4.5 h-4.5 text-[#1a1a1a]" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]">
                    Your Purchase History Ledger ({orders.length})
                  </h3>
                </div>

                {fetchingOrders ? (
                  <div className="h-32 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                      Querying secure orders database...
                    </span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-gray-300 p-10 text-center uppercase space-y-2">
                    <Clock className="w-8 h-8 text-gray-300 mx-auto animate-pulse" />
                    <p className="text-[11px] font-black text-[#1a1a1a]/60">
                      No Historic Completed Transactions Found
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 leading-relaxed max-w-sm mx-auto">
                      Whenever you place an order using WhatsApp Direct, we securely register it under your customer profile automatically!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const dateObj = order.createdAt?.seconds 
                        ? new Date(order.createdAt.seconds * 1000) 
                        : new Date();
                      const formattedDate = dateObj.toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      return (
                        <div 
                          key={order.id} 
                          className="bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] overflow-hidden"
                        >
                          {/* Order sub-header info */}
                          <div className="bg-stone-50 border-b border-[#1a1a1a] p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 select-none">
                            <div className="space-y-0.5">
                              <p className="text-[9px] font-mono font-black text-[#1a1a1a]/60 uppercase">
                                Reference Tracking ID:
                              </p>
                              <code className="text-[10px] font-black text-[#1a1a1a] font-mono">
                                #{order.id}
                              </code>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right hidden sm:block">
                                <p className="text-[9px] font-mono font-black text-gray-400 uppercase">
                                  Placed Stamp:
                                </p>
                                <p className="text-[10px] font-bold text-gray-600 font-sans">
                                  {formattedDate}
                                </p>
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest bg-yellow-400 text-black px-2 py-1 border border-[#1a1a1a] rounded-none">
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Order items lists info */}
                          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Ordered Wardrobe List */}
                            <div className="md:col-span-2 space-y-2 border-r-0 md:border-r border-stone-100 pr-0 md:pr-4">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">
                                Ordered Wardrobe Items:
                              </p>
                              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                                {order.items?.map((item: any, idx: number) => (
                                  <div 
                                    key={idx} 
                                    className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 p-1.5"
                                  >
                                    <img 
                                      src={item.product?.images?.[0] || ""} 
                                      alt={item.product?.title}
                                      className="w-8 h-8 object-cover border border-[#1a1a1a]/15"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] font-black uppercase text-[#1a1a1a] truncate">
                                        {item.product?.title}
                                      </p>
                                      <p className="text-[9px] font-mono text-gray-500">
                                        Size: {item.selectedSize} | Color: {item.selectedColor?.name}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] font-black font-mono text-[#1a1a1a]">
                                        {item.quantity}x
                                      </p>
                                      <p className="text-[9px] font-bold text-stone-500 font-mono">
                                        R{item.product?.price}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery & Billing Summary */}
                            <div className="space-y-3 flex flex-col justify-between">
                              <div className="space-y-1 text-[10px] text-stone-600 font-medium">
                                <div className="flex items-center gap-1 font-black text-[#1a1a1a] uppercase text-[9px] tracking-wider mb-1 text-gray-400">
                                  <MapPin className="w-3 h-3 text-[#1a1a1a]" />
                                  Delivery Destination
                                </div>
                                <p className="font-black text-[#1a1a1a] uppercase">{order.customerName}</p>
                                <p>{order.address}</p>
                                <p>{order.city}, {order.province}, {order.postalCode}</p>
                                <p className="font-mono text-[9px]">Contact: {order.phone}</p>
                              </div>

                              <div className="border-t border-dashed border-stone-200 pt-2 font-mono text-[10px]">
                                <div className="flex justify-between font-medium text-stone-500">
                                  <span>Subtotal:</span>
                                  <span>R{order.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium text-stone-500">
                                  <span>Shipping Cost:</span>
                                  <span>R{order.shippingCost?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-black text-sm text-[#1a1a1a] pt-1">
                                  <span>TOTAL AMOUNT:</span>
                                  <span className="text-[#D4AF37]">R{order.finalTotal?.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
