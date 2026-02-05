 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 export interface Store {
   id: string;
   owner_id: string;
   name: string;
   slug: string;
   description: string | null;
   logo_url: string | null;
   theme: string;
   is_featured: boolean;
   status: string;
   api_key: string;
   server_ip: string | null;
   discord_url: string | null;
   created_at: string;
   updated_at: string;
 }
 
 export function useMyStore() {
   const [store, setStore] = useState<Store | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     const fetchStore = async () => {
       const { data: { session } } = await supabase.auth.getSession();
       
       if (!session?.user) {
         setLoading(false);
         return;
       }
 
       const { data, error } = await supabase
         .from('stores')
         .select('*')
         .eq('owner_id', session.user.id)
         .maybeSingle();
 
       if (error) {
         setError(error.message);
       } else {
         setStore(data);
       }
       setLoading(false);
     };
 
     fetchStore();
 
     const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
       fetchStore();
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   return { store, loading, error, setStore };
 }
 
 export function useStoreBySlug(slug: string) {
   const [store, setStore] = useState<Store | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     const fetchStore = async () => {
       if (!slug) {
         setLoading(false);
         return;
       }
 
       const { data, error } = await supabase
         .from('stores')
         .select('*')
         .eq('slug', slug)
         .eq('status', 'approved')
         .maybeSingle();
 
       if (error) {
         setError(error.message);
       } else if (!data) {
         setError('Store not found');
       } else {
         setStore(data);
       }
       setLoading(false);
     };
 
     fetchStore();
   }, [slug]);
 
   return { store, loading, error };
 }
 
 export function useFeaturedStores() {
   const [stores, setStores] = useState<Store[]>([]);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const fetchStores = async () => {
       const { data } = await supabase
         .from('stores')
         .select('*')
         .eq('status', 'approved')
         .eq('is_featured', true)
         .order('created_at', { ascending: false })
         .limit(6);
 
       setStores(data || []);
       setLoading(false);
     };
 
     fetchStores();
   }, []);
 
   return { stores, loading };
 }
 
 export function useSearchStores(query: string) {
   const [stores, setStores] = useState<Store[]>([]);
   const [loading, setLoading] = useState(false);
 
   useEffect(() => {
     const searchStores = async () => {
       if (!query || query.length < 2) {
         setStores([]);
         return;
       }
 
       setLoading(true);
       const { data } = await supabase
         .from('stores')
         .select('*')
         .eq('status', 'approved')
         .ilike('name', `%${query}%`)
         .order('is_featured', { ascending: false })
         .limit(10);
 
       setStores(data || []);
       setLoading(false);
     };
 
     const debounce = setTimeout(searchStores, 300);
     return () => clearTimeout(debounce);
   }, [query]);
 
   return { stores, loading };
 }