import { X, ExternalLink, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { getAvailableWallets, type WalletType } from '../utils/walletDetection';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: WalletType) => void;
  isConnecting: boolean;
}

export default function WalletSelectionModal({
  isOpen,
  onClose,
  onSelectWallet,
  isConnecting,
}: WalletSelectionModalProps) {
  if (!isOpen) return null;

  const wallets = getAvailableWallets();

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
                Connect Wallet
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose your preferred Stacks wallet
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

          {/* Wallet List */}
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {wallets.map((wallet) => (
              <div key={wallet.id}>
                {wallet.installed ? (
                  // Installed wallet - clickable
                  <button
                    onClick={() => onSelectWallet(wallet.id)}
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
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isConnecting ? 'Connecting...' : 'Ready to connect'}
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
            ))}
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
