import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ChevronDown, LogOut, LayoutDashboard, Loader2, AlertCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import WalletSelectionModal from './WalletSelectionModal';
import type { WalletType } from '../utils/walletDetection';

export default function WalletButton() {
  const { userAddress, isConnected, isConnecting, error, network, selectedWallet, connect, disconnect } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  const handleMyEvents = () => {
    navigate('/dashboard');
    setIsDropdownOpen(false);
  };

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleSelectWallet = async (walletType: WalletType) => {
    setIsModalOpen(false);
    await connect(walletType);
  };

  const handleRetry = () => {
    setIsModalOpen(true);
  };

  // Error State
  if (error) {
    return (
      <div className="flex flex-col gap-2 max-w-md">
        <div className="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Connection Error</p>
            <p className="text-xs text-red-600/80 dark:text-red-400/80">{error}</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Connecting State
  if (isConnecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-6 py-2.5 bg-primary/50 text-white font-medium rounded-lg cursor-not-allowed"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        Connecting...
      </button>
    );
  }

  // Connected State
  if (isConnected && userAddress) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-primary rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
        >
          {/* Network Badge */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
              {network}
            </span>
          </div>

          {/* Address */}
          <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            {shortenAddress(userAddress)}
          </span>

          {/* Chevron */}
          <ChevronDown
            className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
            {/* Address Display */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Connected Address</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                {userAddress}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleMyEvents}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="font-medium">My Events</span>
              </button>

              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not Connected State
  return (
    <>
      <button
        onClick={handleConnect}
        className="flex items-center gap-2 btn-primary"
      >
        <Wallet className="h-5 w-5" />
        Connect Wallet
      </button>

      <WalletSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectWallet={handleSelectWallet}
        isConnecting={isConnecting}
      />
    </>
  );
}
