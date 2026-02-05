 import { useState, useEffect } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useSeller } from '@/hooks/useSeller';
 import { useMyStore, type Store } from '@/hooks/useStore';
 import { supabase } from '@/integrations/supabase/client';
 import { AnimatedBackground } from '@/components/AnimatedBackground';
 import { Navbar } from '@/components/Navbar';
 import { LoginModal } from '@/components/LoginModal';
 import { storeThemes, themeLabels, type StoreTheme } from '@/lib/storeThemes';
 import {
   StoreIcon,
   SettingsIcon,
   PackageIcon,
   BarChartIcon,
   ClipboardIcon,
   EyeIcon,
   EyeOffIcon,
   RefreshIcon,
   SaveIcon,
   EditIcon,
   TrashIcon,
   PlusIcon,
 } from '@/components/icons';
 
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
 
 interface Order {
   id: string;
   buyer_email: string;
   buyer_minecraft_username: string | null;
   status: string;
   total_amount: number;
   currency: string;
   created_at: string;
 }
 
 const SellerDashboard = () => {
   const navigate = useNavigate();
   const { language } = useLanguage();
   const { isSeller, loading: loadingSeller } = useSeller();
   const { store, loading: loadingStore, setStore } = useMyStore();
   const [loginModalOpen, setLoginModalOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
   const [products, setProducts] = useState<StoreProduct[]>([]);
   const [orders, setOrders] = useState<Order[]>([]);
   const [showApiKey, setShowApiKey] = useState(false);
   const [saving, setSaving] = useState(false);
 
   // Store settings form
   const [storeName, setStoreName] = useState('');
   const [storeDescription, setStoreDescription] = useState('');
   const [storeTheme, setStoreTheme] = useState<StoreTheme>('minecraft_classic');
   const [serverIp, setServerIp] = useState('');
   const [discordUrl, setDiscordUrl] = useState('');
 
   useEffect(() => {
     if (store) {
       setStoreName(store.name);
       setStoreDescription(store.description || '');
       setStoreTheme(store.theme as StoreTheme);
       setServerIp(store.server_ip || '');
       setDiscordUrl(store.discord_url || '');
     }
   }, [store]);
 
   useEffect(() => {
     const fetchProducts = async () => {
       if (!store) return;
       const { data } = await supabase
         .from('store_products')
         .select('*')
         .eq('store_id', store.id)
         .order('sort_order');
       setProducts(data || []);
     };
 
     const fetchOrders = async () => {
       if (!store) return;
       const { data } = await supabase
         .from('orders')
         .select('*')
         .eq('store_id', store.id)
         .order('created_at', { ascending: false })
         .limit(50);
       setOrders(data || []);
     };
 
     if (store) {
       fetchProducts();
       fetchOrders();
     }
   }, [store]);
 
   const handleSaveSettings = async () => {
     if (!store) return;
     setSaving(true);
 
     const { data, error } = await supabase
       .from('stores')
       .update({
         name: storeName,
         description: storeDescription,
         theme: storeTheme,
         server_ip: serverIp,
         discord_url: discordUrl,
       })
       .eq('id', store.id)
       .select()
       .single();
 
     if (!error && data) {
       setStore(data);
     }
     setSaving(false);
   };
 
   const regenerateApiKey = async () => {
     if (!store) return;
     const newKey = crypto.randomUUID();
     
     const { data, error } = await supabase
       .from('stores')
       .update({ api_key: newKey })
       .eq('id', store.id)
       .select()
       .single();
 
     if (!error && data) {
       setStore(data);
     }
   };
 
   const copyApiKey = () => {
     if (store?.api_key) {
       navigator.clipboard.writeText(store.api_key);
     }
   };
 
   if (loadingSeller || loadingStore) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="animate-pulse text-center">
           <StoreIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
           <p className="text-muted-foreground">{language === 'ar' ? 'جارِ التحميل...' : 'Loading...'}</p>
         </div>
       </div>
     );
   }
 
   if (!isSeller) {
     return (
       <div className="min-h-screen relative">
         <AnimatedBackground />
         <Navbar onLoginClick={() => setLoginModalOpen(true)} />
         <main className="container mx-auto px-4 pt-32 pb-16 text-center">
           <div className="glass-card p-8 max-w-md mx-auto">
             <StoreIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
             <h1 className="text-2xl font-bold mb-4">
               {language === 'ar' ? 'ليس لديك صلاحية' : 'Access Denied'}
             </h1>
             <p className="text-muted-foreground mb-6">
               {language === 'ar'
                 ? 'يجب أن تكون بائعاً معتمداً للوصول لهذه الصفحة'
                 : 'You must be an approved seller to access this page'
               }
             </p>
             <Link to="/seller/register" className="btn-primary">
               {language === 'ar' ? 'سجل كبائع' : 'Register as Seller'}
             </Link>
           </div>
         </main>
         <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
       </div>
     );
   }
 
   if (!store) {
     return (
       <div className="min-h-screen relative">
         <AnimatedBackground />
         <Navbar onLoginClick={() => setLoginModalOpen(true)} />
         <main className="container mx-auto px-4 pt-32 pb-16 text-center">
           <div className="glass-card p-8 max-w-md mx-auto">
             <StoreIcon className="w-16 h-16 mx-auto text-primary mb-4" />
             <h1 className="text-2xl font-bold mb-4">
               {language === 'ar' ? 'أنشئ متجرك' : 'Create Your Store'}
             </h1>
             <p className="text-muted-foreground mb-6">
               {language === 'ar'
                 ? 'لم تقم بإنشاء متجر بعد. ابدأ الآن!'
                 : 'You haven\'t created a store yet. Start now!'
               }
             </p>
             <Link to="/seller/create-store" className="btn-primary">
               {language === 'ar' ? 'إنشاء متجر' : 'Create Store'}
             </Link>
           </div>
         </main>
         <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
       </div>
     );
   }
 
   const tabs = [
     { id: 'overview' as const, icon: BarChartIcon, label: language === 'ar' ? 'نظرة عامة' : 'Overview' },
     { id: 'products' as const, icon: PackageIcon, label: language === 'ar' ? 'المنتجات' : 'Products' },
     { id: 'orders' as const, icon: ClipboardIcon, label: language === 'ar' ? 'الطلبات' : 'Orders' },
     { id: 'settings' as const, icon: SettingsIcon, label: language === 'ar' ? 'الإعدادات' : 'Settings' },
   ];
 
   const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + Number(o.total_amount), 0);
 
   return (
     <div className="min-h-screen relative">
       <AnimatedBackground />
       <Navbar onLoginClick={() => setLoginModalOpen(true)} />
       
       <main className="container mx-auto px-4 pt-24 pb-16">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
           <div>
             <h1 className="text-3xl font-bold gradient-text">
               {language === 'ar' ? 'لوحة تحكم البائع' : 'Seller Dashboard'}
             </h1>
             <p className="text-muted-foreground">
               {store.name} • 
               <span className={`ms-2 px-2 py-0.5 rounded-full text-xs ${
                 store.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                 store.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                 'bg-red-500/20 text-red-500'
               }`}>
                 {store.status}
               </span>
             </p>
           </div>
           <Link 
             to={`/store/${store.slug}`}
             target="_blank"
             className="btn-outline-glass flex items-center gap-2"
           >
             <EyeIcon className="w-4 h-4" />
             {language === 'ar' ? 'عرض المتجر' : 'View Store'}
           </Link>
         </div>
 
         {/* Tabs */}
         <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                 activeTab === tab.id 
                   ? 'bg-primary text-primary-foreground' 
                   : 'glass-card hover:bg-primary/10'
               }`}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
             </button>
           ))}
         </div>
 
         {/* Tab Content */}
         {activeTab === 'overview' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="glass-card p-6">
               <h3 className="text-sm text-muted-foreground mb-2">
                 {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
               </h3>
               <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
             </div>
             <div className="glass-card p-6">
               <h3 className="text-sm text-muted-foreground mb-2">
                 {language === 'ar' ? 'عدد الطلبات' : 'Total Orders'}
               </h3>
               <p className="text-3xl font-bold">{orders.length}</p>
             </div>
             <div className="glass-card p-6">
               <h3 className="text-sm text-muted-foreground mb-2">
                 {language === 'ar' ? 'المنتجات النشطة' : 'Active Products'}
               </h3>
               <p className="text-3xl font-bold">{products.filter(p => p.is_active).length}</p>
             </div>
           </div>
         )}
 
         {activeTab === 'products' && (
           <div>
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold">{language === 'ar' ? 'المنتجات' : 'Products'}</h2>
               <Link to="/seller/products/new" className="btn-primary flex items-center gap-2">
                 <PlusIcon className="w-4 h-4" />
                 {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
               </Link>
             </div>
             {products.length > 0 ? (
               <div className="grid gap-4">
                 {products.map((product) => (
                   <div key={product.id} className="glass-card p-4 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${product.bg_class}`}>
                         <PackageIcon className={`w-5 h-5 ${product.color_class}`} />
                       </div>
                       <div>
                         <h3 className="font-semibold">{language === 'ar' ? product.name_ar : product.name_en}</h3>
                         <p className="text-sm text-muted-foreground">${Number(product.price).toFixed(2)} • {product.product_type}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className={`px-2 py-0.5 rounded-full text-xs ${product.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                         {product.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'معطل' : 'Inactive')}
                       </span>
                       <Link to={`/seller/products/${product.id}`} className="p-2 rounded-lg hover:bg-primary/10">
                         <EditIcon className="w-4 h-4" />
                       </Link>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="glass-card p-8 text-center">
                 <PackageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                 <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد منتجات بعد' : 'No products yet'}</p>
               </div>
             )}
           </div>
         )}
 
         {activeTab === 'orders' && (
           <div>
             <h2 className="text-xl font-bold mb-6">{language === 'ar' ? 'الطلبات' : 'Orders'}</h2>
             {orders.length > 0 ? (
               <div className="glass-card overflow-hidden">
                 <table className="w-full">
                   <thead className="bg-muted/50">
                     <tr>
                       <th className="text-start p-4">{language === 'ar' ? 'البريد' : 'Email'}</th>
                       <th className="text-start p-4">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                       <th className="text-start p-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                       <th className="text-start p-4">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {orders.map((order) => (
                       <tr key={order.id} className="border-t border-border">
                         <td className="p-4">
                           <p>{order.buyer_email}</p>
                           {order.buyer_minecraft_username && (
                             <p className="text-xs text-muted-foreground">{order.buyer_minecraft_username}</p>
                           )}
                         </td>
                         <td className="p-4 font-semibold">${Number(order.total_amount).toFixed(2)}</td>
                         <td className="p-4">
                           <span className={`px-2 py-0.5 rounded-full text-xs ${
                             order.status === 'paid' ? 'bg-green-500/20 text-green-500' :
                             order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                             'bg-red-500/20 text-red-500'
                           }`}>
                             {order.status}
                           </span>
                         </td>
                         <td className="p-4 text-muted-foreground">
                           {new Date(order.created_at).toLocaleDateString()}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="glass-card p-8 text-center">
                 <ClipboardIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                 <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}</p>
               </div>
             )}
           </div>
         )}
 
         {activeTab === 'settings' && (
           <div className="max-w-2xl">
             <h2 className="text-xl font-bold mb-6">{language === 'ar' ? 'إعدادات المتجر' : 'Store Settings'}</h2>
             
             <div className="glass-card p-6 space-y-6">
               {/* Store Name */}
               <div>
                 <label className="block text-sm font-medium mb-2">{language === 'ar' ? 'اسم المتجر' : 'Store Name'}</label>
                 <input
                   type="text"
                   value={storeName}
                   onChange={(e) => setStoreName(e.target.value)}
                   className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                 />
               </div>
 
               {/* Description */}
               <div>
                 <label className="block text-sm font-medium mb-2">{language === 'ar' ? 'الوصف' : 'Description'}</label>
                 <textarea
                   value={storeDescription}
                   onChange={(e) => setStoreDescription(e.target.value)}
                   rows={3}
                   className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none resize-none"
                 />
               </div>
 
               {/* Theme */}
               <div>
                 <label className="block text-sm font-medium mb-2">{language === 'ar' ? 'السمة' : 'Theme'}</label>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                   {(Object.keys(storeThemes) as StoreTheme[]).map((themeKey) => (
                     <button
                       key={themeKey}
                       onClick={() => setStoreTheme(themeKey)}
                       className={`p-3 rounded-xl border-2 transition-all ${
                         storeTheme === themeKey ? 'border-primary' : 'border-transparent'
                       }`}
                       style={{ 
                         background: `hsl(${storeThemes[themeKey].background})`,
                         boxShadow: storeTheme === themeKey ? `0 0 20px hsl(${storeThemes[themeKey].glowColor} / 0.5)` : 'none'
                       }}
                     >
                       <div 
                         className="w-6 h-6 rounded-full mx-auto mb-1"
                         style={{ background: `hsl(${storeThemes[themeKey].primary})` }}
                       />
                       <p className="text-xs text-center truncate" style={{ color: `hsl(${storeThemes[themeKey].primary})` }}>
                         {themeLabels[themeKey][language]}
                       </p>
                     </button>
                   ))}
                 </div>
               </div>
 
               {/* Server IP */}
               <div>
                 <label className="block text-sm font-medium mb-2">{language === 'ar' ? 'عنوان السيرفر' : 'Server IP'}</label>
                 <input
                   type="text"
                   value={serverIp}
                   onChange={(e) => setServerIp(e.target.value)}
                   placeholder="play.myserver.com"
                   className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none font-mono"
                 />
               </div>
 
               {/* Discord */}
               <div>
                 <label className="block text-sm font-medium mb-2">{language === 'ar' ? 'رابط Discord' : 'Discord URL'}</label>
                 <input
                   type="url"
                   value={discordUrl}
                   onChange={(e) => setDiscordUrl(e.target.value)}
                   placeholder="https://discord.gg/..."
                   className="w-full p-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none"
                 />
               </div>
 
               {/* API Key */}
               <div>
                 <label className="block text-sm font-medium mb-2">{language === 'ar' ? 'مفتاح API' : 'API Key'}</label>
                 <div className="flex gap-2">
                   <div className="flex-1 p-3 rounded-xl bg-background border border-border font-mono text-sm overflow-hidden">
                     {showApiKey ? store.api_key : '••••••••-••••-••••-••••-••••••••••••'}
                   </div>
                   <button onClick={() => setShowApiKey(!showApiKey)} className="p-3 rounded-xl bg-secondary hover:bg-secondary/80">
                     {showApiKey ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                   </button>
                   <button onClick={copyApiKey} className="p-3 rounded-xl bg-secondary hover:bg-secondary/80">
                     <ClipboardIcon className="w-5 h-5" />
                   </button>
                   <button onClick={regenerateApiKey} className="p-3 rounded-xl bg-destructive/20 text-destructive hover:bg-destructive/30">
                     <RefreshIcon className="w-5 h-5" />
                   </button>
                 </div>
                 <p className="text-xs text-muted-foreground mt-2">
                   {language === 'ar' 
                     ? 'استخدم هذا المفتاح لربط سيرفرك بالمتجر'
                     : 'Use this key to connect your Minecraft server to the store'
                   }
                 </p>
               </div>
 
               {/* Save Button */}
               <button
                 onClick={handleSaveSettings}
                 disabled={saving}
                 className="btn-primary w-full flex items-center justify-center gap-2"
               >
                 <SaveIcon className="w-4 h-4" />
                 {saving 
                   ? (language === 'ar' ? 'جارِ الحفظ...' : 'Saving...') 
                   : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
                 }
               </button>
             </div>
           </div>
         )}
       </main>
 
       <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
     </div>
   );
 };
 
 export default SellerDashboard;