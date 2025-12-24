import { useState } from 'react';
import { X, ExternalLink, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { getAvailableWallets, type WalletType } from '../utils/walletDetection';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: WalletType) => void;
  onConnectWithUri?: (uri: string) => Promise<void>;
  isConnecting: boolean;
}

export default function WalletSelectionModal({
  isOpen,
  onClose,
  onSelectWallet,
  onConnectWithUri,
  isConnecting,
}: WalletSelectionModalProps) {
  const [showUriInput, setShowUriInput] = useState(false);
  const [uri, setUri] = useState('');
  const [uriError, setUriError] = useState('');

  if (!isOpen) return null;

  const wallets = getAvailableWallets();

  const handleWalletClick = (walletType: WalletType) => {
    if (walletType === 'walletconnect') {
      setShowUriInput(true);
    } else {
      onSelectWallet(walletType);
    }
  };

  const handleUriConnect = async () => {
    if (!uri.trim()) {
      setUriError('Please enter a valid WalletConnect URI');
      return;
    }

    if (!uri.startsWith('wc:')) {
      setUriError('URI must start with "wc:"');
      return;
    }

    try {
      setUriError('');
      if (onConnectWithUri) {
        await onConnectWithUri(uri);
        setShowUriInput(false);
        setUri('');
      }
    } catch (error) {
      setUriError(error instanceof Error ? error.message : 'Failed to connect');
    }
  };

  const handleBackToWallets = () => {
    setShowUriInput(false);
    setUri('');
    setUriError('');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {showUriInput ? 'Connect via WalletConnect' : 'Connect Wallet'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {showUriInput 
                  ? 'Paste your WalletConnect URI to connect' 
                  : 'Choose your preferred Stacks wallet'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isConnecting}
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Wallet List or URI Input */}
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {showUriInput ? (
              // WalletConnect URI Input
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WalletConnect URI
                  </label>
                  <input
                    type="text"
                    value={uri}
                    onChange={(e) => {
                      setUri(e.target.value);
                      setUriError('');
                    }}
                    placeholder="wc:..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    disabled={isConnecting}
                  />
                  {uriError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {uriError}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Open your mobile wallet app and scan the QR code to get the WalletConnect URI
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBackToWallets}
                    disabled={isConnecting}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleUriConnect}
                    disabled={isConnecting || !uri.trim()}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            ) : (
              // Wallet Selection List
              wallets.map((wallet) => (
                <div key={wallet.id}>
                  {wallet.installed ? (
                    // Installed wallet - clickable
                    <button
                      onClick={() => handleWalletClick(wallet.id)}
                      disabled={isConnecting}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Icon */}
                      <div className="text-4xl">{wallet.icon}</div>

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {wallet.name}
                          </h3>
                          {wallet.id !== 'walletconnect' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isConnecting ? 'Connecting...' : wallet.id === 'walletconnect' ? 'Connect any wallet via QR' : 'Ready to connect'}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </button>
                  ) : (
                    // Not installed wallet - show install option
                    <div className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      {/* Icon (grayed out) */}
                      <div className="text-4xl opacity-50">{wallet.icon}</div>

                      {/* Info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {wallet.name}
                          </h3>
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Not installed
                        </p>
                      </div>

                      {/* Install button */}
                      <a
                        href={wallet.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Install
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              By connecting a wallet, you agree to StackStamp's Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
