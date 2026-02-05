 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 export function useSeller() {
   const [isSeller, setIsSeller] = useState(false);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     const checkSeller = async () => {
       const { data: { session } } = await supabase.auth.getSession();
       
       if (!session?.user) {
         setIsSeller(false);
         setLoading(false);
         return;
       }
 
       const { data, error } = await supabase
         .from('user_roles')
         .select('role')
         .eq('user_id', session.user.id)
         .eq('role', 'seller')
         .maybeSingle();
 
       if (!error && data) {
         setIsSeller(true);
       } else {
         setIsSeller(false);
       }
       
       setLoading(false);
     };
 
     checkSeller();
 
     const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
       checkSeller();
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   return { isSeller, loading };
 }