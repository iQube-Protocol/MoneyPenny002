import { useState } from 'react';

export interface WalletState {
  connected: boolean;
  address?: string;
  balance?: string;
  walletKind?: string;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
  });

  const connect = async () => {
    // Stub implementation
    setWallet({ connected: true, address: '0x...', balance: '0', walletKind: 'metamask' });
  };

  const disconnect = () => {
    setWallet({ connected: false });
  };

  return { 
    wallet, 
    connect, 
    disconnect,
    isConnected: wallet.connected,
    address: wallet.address,
    walletKind: wallet.walletKind
  };
}
