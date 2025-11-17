/**
 * Aggregates Module (DataQube)
 */

import type { MoneyPennyClient } from '../client';
import { supabase } from '@/integrations/supabase/client';

export class AggregatesModule {
  constructor(private client: MoneyPennyClient) {}

  async getAggregates(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('financial_aggregates')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching aggregates:', error);
      return null;
    }

    return data;
  }

  async getRecommendations(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('trading_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching recommendations:', error);
      return null;
    }

    return data;
  }

  async applyRecommendations(recs: any): Promise<void> {
    console.log('Apply recommendations:', recs);
    
    // Save to localStorage for intent form to read
    const config = {
      min_edge_bps: recs.min_edge_bps,
      max_notional_usd: recs.max_notional_usd,
      inventory_min: recs.inventory_min,
      inventory_max: recs.inventory_max,
      daily_loss_limit_bps: recs.daily_loss_limit_bps,
      saved_at: new Date().toISOString(),
    };
    
    localStorage.setItem('moneypenny_applied_config', JSON.stringify(config));
    
    // Optionally persist to profiles.trading_preferences
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          trading_preferences: config,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
    }
  }
}
