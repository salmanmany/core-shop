 import { useState } from 'react';
 import { Link } from 'react-router-dom';
 import { AnimatedBackground } from '@/components/AnimatedBackground';
 import { Navbar } from '@/components/Navbar';
 import { Footer } from '@/components/Footer';
 import { LoginModal } from '@/components/LoginModal';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useFeaturedStores, useSearchStores } from '@/hooks/useStore';
 import { SearchIcon, StoreIcon, StarIcon } from '@/components/icons';
 import { storeThemes, type StoreTheme } from '@/lib/storeThemes';
 
 const DiscoveryPage = () => {
   const [loginModalOpen, setLoginModalOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const { language } = useLanguage();
   const { stores: featuredStores, loading: loadingFeatured } = useFeaturedStores();
   const { stores: searchResults, loading: loadingSearch } = useSearchStores(searchQuery);
 
   const showSearchResults = searchQuery.length >= 2;
   const displayStores = showSearchResults ? searchResults : featuredStores;
   const isLoading = showSearchResults ? loadingSearch : loadingFeatured;
 
   return (
     <div className="min-h-screen relative overflow-x-hidden">
       <AnimatedBackground />
       <Navbar onLoginClick={() => setLoginModalOpen(true)} />
       
       <main className="container mx-auto px-4 pt-32 pb-16">
         {/* Hero Section */}
         <div className="text-center mb-12">
           <h1 className="text-4xl md:text-6xl font-bold mb-4">
             <span className="gradient-text">
               {language === 'ar' ? 'اكتشف المتاجر' : 'Discover Stores'}
             </span>
           </h1>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             {language === 'ar' 
               ? 'ابحث عن متجر سيرفرك المفضل واشترِ الرتب والمفاتيح'
               : 'Find your favorite server store and purchase ranks & keys'
             }
           </p>
         </div>
 
         {/* Search Bar */}
         <div className="max-w-xl mx-auto mb-12">
           <div className="relative">
             <SearchIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={language === 'ar' ? 'ابحث عن اسم السيرفر...' : 'Search for a server name...'}
               className="w-full ps-12 pe-4 py-4 rounded-2xl glass-card border-0 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
             />
           </div>
         </div>
 
         {/* Section Title */}
         <div className="flex items-center gap-3 mb-6">
           {showSearchResults ? (
             <SearchIcon className="w-6 h-6 text-primary" />
           ) : (
             <StarIcon className="w-6 h-6 text-primary" />
           )}
           <h2 className="text-2xl font-bold">
             {showSearchResults 
               ? (language === 'ar' ? 'نتائج البحث' : 'Search Results')
               : (language === 'ar' ? 'متاجر مميزة' : 'Featured Stores')
             }
           </h2>
         </div>
 
         {/* Stores Grid */}
         {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3].map((i) => (
               <div key={i} className="glass-card p-6 animate-pulse">
                 <div className="h-16 w-16 rounded-xl bg-muted mb-4" />
                 <div className="h-6 w-32 bg-muted rounded mb-2" />
                 <div className="h-4 w-full bg-muted rounded" />
               </div>
             ))}
           </div>
         ) : displayStores.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {displayStores.map((store) => {
               const theme = storeThemes[store.theme as StoreTheme] || storeThemes.minecraft_classic;
               return (
                 <Link
                   key={store.id}
                   to={`/store/${store.slug}`}
                   className="glass-card p-6 group hover:scale-[1.02] transition-all"
                   style={{
                     borderColor: `hsl(${theme.primary} / 0.3)`,
                     boxShadow: `0 0 20px hsl(${theme.primary} / 0.1)`,
                   }}
                 >
                   <div className="flex items-start gap-4">
                     <div 
                       className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
                       style={{
                         background: `hsl(${theme.primary} / 0.2)`,
                         color: `hsl(${theme.primary})`,
                       }}
                     >
                       {store.logo_url ? (
                         <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover rounded-xl" />
                       ) : (
                         <StoreIcon className="w-8 h-8" />
                       )}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                         <h3 className="font-bold text-lg truncate">{store.name}</h3>
                         {store.is_featured && (
                           <StarIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                         )}
                       </div>
                       <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                         {store.description || (language === 'ar' ? 'متجر ماينكرافت' : 'Minecraft Store')}
                       </p>
                       {store.server_ip && (
                         <p className="text-xs text-primary mt-2 font-mono">
                           {store.server_ip}
                         </p>
                       )}
                     </div>
                   </div>
                 </Link>
               );
             })}
           </div>
         ) : (
           <div className="text-center py-16 glass-card">
             <StoreIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
             <h3 className="text-xl font-semibold mb-2">
               {showSearchResults 
                 ? (language === 'ar' ? 'لم يتم العثور على متاجر' : 'No stores found')
                 : (language === 'ar' ? 'لا توجد متاجر مميزة حالياً' : 'No featured stores yet')
               }
             </h3>
             <p className="text-muted-foreground">
               {language === 'ar' 
                 ? 'جرب البحث باسم مختلف'
                 : 'Try searching with a different name'
               }
             </p>
           </div>
         )}
 
         {/* Become a Seller CTA */}
         <div className="mt-16 text-center glass-card p-8">
           <h2 className="text-2xl font-bold mb-4">
             {language === 'ar' ? 'هل تملك سيرفر ماينكرافت؟' : 'Own a Minecraft Server?'}
           </h2>
           <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
             {language === 'ar'
               ? 'انضم إلى منصتنا وابدأ ببيع الرتب والمفاتيح لسيرفرك'
               : 'Join our platform and start selling ranks & keys for your server'
             }
           </p>
           <Link
             to="/seller/register"
             className="btn-primary inline-flex items-center gap-2"
           >
             <StoreIcon className="w-5 h-5" />
             {language === 'ar' ? 'سجل كبائع' : 'Register as Seller'}
           </Link>
         </div>
       </main>
 
       <Footer />
       <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
     </div>
   );
 };
 
 export default DiscoveryPage;