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

          // Update creator stats
          const { data: stats } = await supabase
            .from('creator_stats')
            .select('*')
            .eq('creator_code', storedCreatorCode)
            .single();

          if (stats) {
            await supabase
              .from('creator_stats')
              .update({
                total_visits: (stats.total_visits || 0) + 1,
                updated_at: new Date().toISOString(),
              })
              .eq('creator_code', storedCreatorCode);
          } else {
            await supabase.from('creator_stats').insert([{
              creator_code: storedCreatorCode,
              total_visits: 1,
              total_signups: 0,
              total_conversions: 0,
              total_revenue: 0,
            }]);
          }

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

      // Update creator stats
      const { data: stats } = await supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_code', creatorCode)
        .single();

      if (stats) {
        await supabase
          .from('creator_stats')
          .update({
            total_signups: (stats.total_signups || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('creator_code', creatorCode);
      }
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

      // Update creator stats
      const { data: stats } = await supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_code', creatorCode)
        .single();

      if (stats) {
        await supabase
          .from('creator_stats')
          .update({
            total_conversions: (stats.total_conversions || 0) + 1,
            total_revenue: parseFloat(stats.total_revenue.toString()) + amount,
            updated_at: new Date().toISOString(),
          })
          .eq('creator_code', creatorCode);
      }
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }
};