import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCreatorTracking = () => {
  useEffect(() => {
    const trackCreator = async () => {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const creatorCode = urlParams.get('ref');
      const referralCode = urlParams.get('referral');

      if (creatorCode || referralCode) {
        const code = creatorCode || referralCode;
        
        // Store in localStorage to persist across navigation
        if (code) {
          localStorage.setItem('creator_ref', code);
          localStorage.setItem('referral_code', code);
        }
      }

      // Check if we have a stored code and haven't tracked yet
      const storedCreatorCode = localStorage.getItem('creator_ref');
      const hasTracked = localStorage.getItem('creator_tracked');

      if (storedCreatorCode && !hasTracked) {
        try {
          // Detect country (you can use a geolocation API here)
          const country = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0];
          const device = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

          // Track the visit
          await supabase.from('creator_tracking').insert([{
            creator_code: storedCreatorCode,
            country,
            device,
            converted: false,
          }]);

          // Update creator stats using secure function
          await supabase.rpc('increment_creator_stats', {
            p_creator_code: storedCreatorCode,
            p_visits: 1,
            p_signups: 0,
            p_conversions: 0,
            p_revenue: 0,
          });

          localStorage.setItem('creator_tracked', 'true');
        } catch (error) {
          console.error('Error tracking creator:', error);
        }
      }
    };

    trackCreator();
  }, []);
};

export const trackSignup = async (userId: string) => {
  const creatorCode = localStorage.getItem('creator_ref');
  
  if (creatorCode) {
    try {
      // Update tracking record with user_id
      await supabase
        .from('creator_tracking')
        .update({ user_id: userId })
        .eq('creator_code', creatorCode)
        .is('user_id', null);

      // Update creator stats using secure function
      await supabase.rpc('increment_creator_stats', {
        p_creator_code: creatorCode,
        p_visits: 0,
        p_signups: 1,
        p_conversions: 0,
        p_revenue: 0,
      });
    } catch (error) {
      console.error('Error tracking signup:', error);
    }
  }
};

export const trackConversion = async (userId: string, amount: number) => {
  const creatorCode = localStorage.getItem('creator_ref');
  
  if (creatorCode) {
    try {
      // Update tracking record
      await supabase
        .from('creator_tracking')
        .update({
          converted: true,
          conversion_date: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('creator_code', creatorCode);

      // Update creator stats using secure function
      await supabase.rpc('increment_creator_stats', {
        p_creator_code: creatorCode,
        p_visits: 0,
        p_signups: 0,
        p_conversions: 1,
        p_revenue: amount,
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }
};