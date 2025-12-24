import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  connect as connectWallet,
  disconnect as disconnectWallet,
  isConnected as checkConnection,
  getLocalStorage
} from '@stacks/connect';
import {
  getActiveWallet,
  savePreferredWallet,
  clearPreferredWallet,
  type WalletType
} from '../utils/walletDetection';

// Define all types inline to avoid module resolution issues
interface WalletContextType {
  userAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  network: 'mainnet' | 'testnet';
  selectedWallet: WalletType | null;
  connect: (walletType?: WalletType) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const network: 'mainnet' | 'testnet' = 'mainnet';

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      if (checkConnection()) {
        const data = getLocalStorage();
        // Get the first Stacks address from the stx array
        const stxAddress = data?.addresses?.stx?.[0]?.address;

        if (stxAddress) {
          setUserAddress(stxAddress);
          setIsConnected(true);
        }
      }
    };

    checkAuth();
  }, []);

  const connect = async (walletType?: WalletType): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      // Detect which wallet is currently active
      const activeWallet = getActiveWallet();

      console.log('=== WALLET CONNECTION INFO ===');
      console.log('Requested wallet:', walletType || 'auto');
      console.log('Active wallet:', activeWallet);

      // If user selected a specific wallet, verify it's the active one
      if (walletType && activeWallet && walletType !== activeWallet) {
        throw new Error(
          `Please disable other wallet extensions and keep only ${walletType.charAt(0).toUpperCase() + walletType.slice(1)} enabled, then try again.`
        );
      }

      // Check if any wallet extension is installed
      if (typeof window !== 'undefined' && !window.StacksProvider) {
        throw new Error('No wallet extension found. Please install Leather, Xverse, or Hiro wallet.');
      }

      console.log('Calling connectWallet()...');
      const response = await connectWallet();

      // Debug: Log the entire response structure
      console.log('=== CONNECT RESPONSE ===');
      console.log('Full response:', response);
      console.log('response.addresses type:', Array.isArray(response?.addresses) ? 'Array' : typeof response?.addresses);
      console.log('response.addresses:', response?.addresses);

      // Try to handle both possible structures
      let stxAddress: string | undefined;

      // Check if addresses is a flat array
      if (Array.isArray(response?.addresses)) {
        console.log('Addresses is an array, searching for STX address...');
        stxAddress = response.addresses.find((addr: any) =>
          addr.address?.startsWith('SP') || addr.address?.startsWith('ST')
        )?.address;
        console.log('Found STX address (array):', stxAddress);
      }
      // Check if addresses has stx property (object structure)
      else if (response?.addresses?.stx) {
        console.log('Addresses has stx property, getting first STX address...');
        stxAddress = response.addresses.stx[0]?.address;
        console.log('Found STX address (object):', stxAddress);
      }

      if (stxAddress) {
        console.log('✅ Successfully got address:', stxAddress);
        setUserAddress(stxAddress);
        setIsConnected(true);

        // Save the wallet that was used
        const connectedWallet = walletType || activeWallet;
        if (connectedWallet) {
          setSelectedWallet(connectedWallet);
          savePreferredWallet(connectedWallet);
          console.log('✅ Connected with:', connectedWallet);
        }
      } else {
        console.error('❌ Could not extract STX address from response');
        throw new Error('Could not extract Stacks address from wallet response');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);

      // Handle specific error cases with helpful messages
      let errorMessage = 'Failed to connect wallet';

      if (err instanceof Error) {
        const errMsg = err.message.toLowerCase();

        // Xverse: No account created yet
        if (errMsg.includes('failed to get selected account') ||
            errMsg.includes('no account') ||
            errMsg.includes('account not found')) {
          errorMessage = 'Please create or import an account in your Xverse wallet first, then try connecting again.';
        }
        // Wallet locked
        else if (errMsg.includes('locked') || errMsg.includes('unlock')) {
          errorMessage = 'Please unlock your wallet extension and try again.';
        }
        // User rejected the connection
        else if (errMsg.includes('user rejected') ||
                 errMsg.includes('user denied') ||
                 errMsg.includes('user cancelled')) {
          errorMessage = 'Connection cancelled. Click "Connect Wallet" to try again.';
        }
        // Generic error - show original message
        else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    disconnectWallet();
    setUserAddress(null);
    setIsConnected(false);
    setError(null);
    setSelectedWallet(null);
    clearPreferredWallet();
  };

  const value: WalletContextType = {
    userAddress,
    isConnected,
    isConnecting,
    error,
    network,
    selectedWallet,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
