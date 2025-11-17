import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useRealtimeNotifications(enabled: boolean = true) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsConnected(false);
      return;
    }

    const channel = supabase
      .channel('notifications')
      .on('broadcast', { event: 'notification' }, (payload) => {
        const notification: Notification = {
          id: payload.payload.id || Date.now().toString(),
          type: payload.payload.type || 'info',
          message: payload.payload.message || '',
          timestamp: new Date(payload.payload.timestamp || Date.now()),
          read: false,
        };
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [enabled]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const connect = () => {
    // Re-enable will trigger useEffect
  };

  const disconnect = () => {
    // Disable will trigger useEffect cleanup
  };

  return { notifications, unreadCount, markAsRead, clearAll, isConnected, connect, disconnect };
}
