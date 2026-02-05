 import { useState } from 'react';
 import { useParams, Link } from 'react-router-dom';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useStoreBySlug } from '@/hooks/useStore';
 import { useCart } from '@/contexts/CartContext';
 import { useToastContext } from '@/contexts/ToastContext';
 import { supabase } from '@/integrations/supabase/client';
 import { storeThemes, type StoreTheme } from '@/lib/storeThemes';
 import { 
   StoreIcon, 
   CartIcon, 
   ServerIcon, 
   DiscordIcon,
   ShieldIcon,
   KeyIcon,
   PackageIcon 
 } from '@/components/icons';
 import { CartDrawer } from '@/components/CartDrawer';
 import { useEffect } from 'react';
 
 interface StoreProduct {
   id: string;
   store_id: string;
   product_type: string;
   name_en: string;
   name_ar: string;
   desc_en: string;
   desc_ar: string;
   price: number;
   icon: string;
   color_class: string;
   bg_class: string;
   border_class: string;
   sort_order: number;
   is_active: boolean;
 }
 
 const StorePage = () => {
   const { slug } = useParams<{ slug: string }>();
   const { language } = useLanguage();
   const { store, loading, error } = useStoreBySlug(slug || '');
   const { addItem, totalItems } = useCart();
   const { showToast } = useToastContext();
   const [products, setProducts] = useState<StoreProduct[]>([]);
   const [loadingProducts, setLoadingProducts] = useState(true);
   const [cartOpen, setCartOpen] = useState(false);
 
   const theme = store ? storeThemes[store.theme as StoreTheme] || storeThemes.minecraft_classic : storeThemes.minecraft_classic;
 
   useEffect(() => {
     const fetchProducts = async () => {
       if (!store) return;
       
       const { data } = await supabase
         .from('store_products')
         .select('*')
         .eq('store_id', store.id)
         .eq('is_active', true)
         .order('sort_order');
 
       setProducts(data || []);
       setLoadingProducts(false);
     };
 
     if (store) {
       fetchProducts();
     }
   }, [store]);
 
   const handleAddToCart = (product: StoreProduct) => {
     addItem({
       id: product.id,
       type: product.product_type as 'rank' | 'key',
       name: language === 'ar' ? product.name_ar : product.name_en,
       nameAr: product.name_ar,
       price: Number(product.price),
       colorClass: product.color_class,
     });
     showToast(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart', 'success');
   };
 
   const getProductIcon = (type: string) => {
     switch (type) {
       case 'rank': return ShieldIcon;
       case 'key': return KeyIcon;
       default: return PackageIcon;
     }
   };
 
   if (loading) {
     return (
       <div 
         className="min-h-screen flex items-center justify-center"
         style={{ background: `hsl(${theme.background})` }}
       >
         <div className="animate-pulse flex flex-col items-center gap-4">
           <StoreIcon className="w-16 h-16 text-muted-foreground" />
           <p className="text-muted-foreground">{language === 'ar' ? 'جارِ التحميل...' : 'Loading...'}</p>
         </div>
       </div>
     );
   }
 
   if (error || !store) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="text-center glass-card p-8">
           <StoreIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
           <h1 className="text-2xl font-bold mb-2">
             {language === 'ar' ? 'المتجر غير موجود' : 'Store Not Found'}
           </h1>
           <p className="text-muted-foreground mb-6">
             {language === 'ar' 
               ? 'هذا المتجر غير موجود أو غير متاح حالياً'
               : 'This store does not exist or is not available'
             }
           </p>
           <Link to="/" className="btn-primary">
             {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
           </Link>
         </div>
       </div>
     );
   }
 
   return (
     <div 
       className="min-h-screen"
       style={{
         background: `linear-gradient(180deg, hsl(${theme.backgroundStart}) 0%, hsl(${theme.backgroundEnd}) 100%)`,
         '--store-primary': `hsl(${theme.primary})`,
         '--store-glow': `hsl(${theme.glowColor})`,
       } as React.CSSProperties}
     >
       {/* Header */}
       <header 
         className="sticky top-0 z-50 backdrop-blur-md border-b"
         style={{ 
           background: `hsl(${theme.cardBg})`,
           borderColor: `hsl(${theme.borderColor})`,
         }}
       >
         <div className="container mx-auto px-4 py-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div 
                 className="w-12 h-12 rounded-xl flex items-center justify-center"
                 style={{ 
                   background: `hsl(${theme.primary} / 0.2)`,
                   boxShadow: `0 0 20px hsl(${theme.glowColor} / 0.3)`,
                 }}
               >
                 {store.logo_url ? (
                   <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover rounded-xl" />
                 ) : (
                   <StoreIcon className="w-6 h-6 text-primary" />
                 )}
               </div>
               <div>
                 <h1 className="font-bold text-lg" style={{ color: `hsl(${theme.primary})` }}>{store.name}</h1>
                 {store.server_ip && (
                   <p className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                     <ServerIcon className="w-3 h-3" />
                     {store.server_ip}
                   </p>
                 )}
               </div>
             </div>
 
             <div className="flex items-center gap-3">
               {store.discord_url && (
                 <a 
                   href={store.discord_url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                   style={{ background: `hsl(${theme.primary} / 0.2)` }}
                 >
                   <DiscordIcon className="w-5 h-5 text-primary" />
                 </a>
               )}
               <button 
                 onClick={() => setCartOpen(true)}
                 className="p-2 rounded-lg relative"
                 style={{ background: `hsl(${theme.primary} / 0.2)` }}
               >
                 <CartIcon className="w-5 h-5 text-primary" />
                 {totalItems > 0 && (
                   <span 
                     className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-semibold"
                     style={{ 
                       background: `hsl(${theme.primary})`,
                       color: `hsl(${theme.primaryForeground})`,
                     }}
                   >
                     {totalItems}
                   </span>
                 )}
               </button>
             </div>
           </div>
         </div>
       </header>
 
       {/* Hero Section */}
       <section className="py-16 text-center">
         <div className="container mx-auto px-4">
           <h2 
             className="text-4xl md:text-5xl font-bold mb-4"
             style={{ color: `hsl(${theme.primary})` }}
           >
             {language === 'ar' ? 'مرحباً بك في' : 'Welcome to'} {store.name}
           </h2>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             {store.description || (language === 'ar' ? 'متجر ماينكرافت الرسمي' : 'Official Minecraft Store')}
           </p>
         </div>
       </section>
 
       {/* Products Grid */}
       <section className="pb-16">
         <div className="container mx-auto px-4">
           {loadingProducts ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2, 3].map((i) => (
                 <div 
                   key={i} 
                   className="rounded-2xl p-6 animate-pulse"
                   style={{ background: `hsl(${theme.cardBg})` }}
                 >
                   <div className="h-12 w-12 rounded-xl bg-muted mb-4" />
                   <div className="h-6 w-32 bg-muted rounded mb-2" />
                   <div className="h-4 w-full bg-muted rounded" />
                 </div>
               ))}
             </div>
           ) : products.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {products.map((product) => {
                 const Icon = getProductIcon(product.product_type);
                 return (
                   <div
                     key={product.id}
                     className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
                     style={{ 
                       background: `hsl(${theme.cardBg})`,
                       border: `1px solid hsl(${theme.borderColor})`,
                       boxShadow: `0 0 20px hsl(${theme.glowColor} / 0.1)`,
                     }}
                   >
                     <div className="flex items-start gap-4 mb-4">
                       <div 
                         className="w-12 h-12 rounded-xl flex items-center justify-center"
                         style={{ background: `hsl(${theme.primary} / 0.2)` }}
                       >
                         <Icon className="w-6 h-6 text-primary" />
                       </div>
                       <div className="flex-1">
                         <h3 className="font-bold text-lg">
                           {language === 'ar' ? product.name_ar : product.name_en}
                         </h3>
                         <span 
                           className="text-xs px-2 py-0.5 rounded-full"
                           style={{ 
                             background: `hsl(${theme.primary} / 0.2)`,
                             color: `hsl(${theme.primary})`,
                           }}
                         >
                           {product.product_type}
                         </span>
                       </div>
                     </div>
                     <p className="text-sm text-muted-foreground mb-4">
                       {language === 'ar' ? product.desc_ar : product.desc_en}
                     </p>
                     <div className="flex items-center justify-between">
                       <span 
                         className="text-2xl font-bold"
                         style={{ color: `hsl(${theme.primary})` }}
                       >
                         ${Number(product.price).toFixed(2)}
                       </span>
                       <button
                         onClick={() => handleAddToCart(product)}
                         className="px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105"
                         style={{ 
                           background: `hsl(${theme.primary})`,
                           color: `hsl(${theme.primaryForeground})`,
                           boxShadow: `0 0 20px hsl(${theme.glowColor} / 0.4)`,
                         }}
                       >
                         {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                       </button>
                     </div>
                   </div>
                 );
               })}
             </div>
           ) : (
             <div 
               className="text-center py-16 rounded-2xl"
               style={{ background: `hsl(${theme.cardBg})` }}
             >
               <PackageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
               <h3 className="text-xl font-semibold mb-2">
                 {language === 'ar' ? 'لا توجد منتجات حالياً' : 'No products yet'}
               </h3>
               <p className="text-muted-foreground">
                 {language === 'ar' ? 'سيتم إضافة المنتجات قريباً' : 'Products will be added soon'}
               </p>
             </div>
           )}
         </div>
       </section>
 
       {/* Footer */}
       <footer 
         className="py-8 border-t"
         style={{ borderColor: `hsl(${theme.borderColor})` }}
       >
         <div className="container mx-auto px-4 text-center">
           <p className="text-sm text-muted-foreground">
             {language === 'ar' ? 'مدعوم من' : 'Powered by'}{' '}
             <Link to="/" className="font-semibold hover:opacity-80" style={{ color: `hsl(${theme.primary})` }}>
               Core CMS
             </Link>
           </p>
         </div>
       </footer>
 
       <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
     </div>
   );
 };
 
 export default StorePage;