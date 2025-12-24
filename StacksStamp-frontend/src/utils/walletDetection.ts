// Wallet detection and status utilities

export type WalletType = 'leather' | 'xverse' | 'hiro';

export interface WalletInfo {
  id: WalletType;
  name: string;
  icon: string;
  installed: boolean;
  downloadUrl: string;
}

/**
 * Detect if a specific wallet is installed
 */
export function detectWallet(walletType: WalletType): boolean {
  if (typeof window === 'undefined') return false;

  switch (walletType) {
    case 'leather':
      // Leather sets StacksProvider and has isLeather property
      return !!(window.StacksProvider && (window as any).StacksProvider?.isLeather);

    case 'xverse':
      // Xverse has XverseProviders or sets StacksProvider
      return !!((window as any).XverseProviders ||
                (window.StacksProvider && !(window as any).StacksProvider?.isLeather));

    case 'hiro':
      // Hiro sets StacksProvider (similar to Leather)
      return !!(window.StacksProvider && (window as any).StacksProvider?.isHiro);

    default:
      return false;
  }
}

/**
 * Get all available wallets with their installation status
 */
export function getAvailableWallets(): WalletInfo[] {
  return [
    {
      id: 'leather',
      name: 'Leather Wallet',
      icon: '🟣',
      installed: detectWallet('leather'),
      downloadUrl: 'https://leather.io/install-extension',
    },
    {
      id: 'xverse',
      name: 'Xverse Wallet',
      icon: '⚫',
      installed: detectWallet('xverse'),
      downloadUrl: 'https://www.xverse.app/download',
    },
    {
      id: 'hiro',
      name: 'Hiro Wallet',
      icon: '💙',
      installed: detectWallet('hiro'),
      downloadUrl: 'https://wallet.hiro.so/',
    },
  ];
}

/**
 * Get the currently active wallet (whichever loaded last)
 */
export function getActiveWallet(): WalletType | null {
  if (typeof window === 'undefined' || !window.StacksProvider) {
    return null;
  }

  // Check which wallet is currently injected
  if ((window as any).StacksProvider?.isLeather) {
    return 'leather';
  }

  if ((window as any).StacksProvider?.isHiro) {
    return 'hiro';
  }

  // If XverseProviders exists, it's Xverse
  if ((window as any).XverseProviders) {
    return 'xverse';
  }

  // Default to checking if StacksProvider exists (could be Xverse)
  if (window.StacksProvider) {
    return 'xverse'; // Assume Xverse if no other identifier
  }

  return null;
}

/**
 * Store user's preferred wallet in localStorage
 */
export function savePreferredWallet(walletType: WalletType): void {
  localStorage.setItem('preferred_wallet', walletType);
}

/**
 * Get user's preferred wallet from localStorage
 */
export function getPreferredWallet(): WalletType | null {
  const preferred = localStorage.getItem('preferred_wallet');
  return preferred as WalletType | null;
}

/**
 * Clear user's preferred wallet
 */
export function clearPreferredWallet(): void {
  localStorage.removeItem('preferred_wallet');
}
