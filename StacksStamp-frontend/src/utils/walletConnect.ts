import { Core } from '@walletconnect/core';
import { IWeb3Wallet, Web3Wallet } from '@reown/walletkit';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';

// WalletConnect configuration
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

// Stacks network configuration
const STACKS_CHAINS = {
  mainnet: 'stacks:1',
  testnet: 'stacks:2147483648',
};

const STACKS_METHODS = [
  'stacks_signMessage',
  'stacks_signTransaction',
  'stacks_stxTransfer',
  'stacks_contractCall',
  'stacks_contractDeploy',
];

const STACKS_EVENTS = ['accountsChanged', 'chainChanged'];

let web3wallet: IWeb3Wallet | null = null;

/**
 * Initialize WalletConnect
 */
export async function initWalletConnect(): Promise<IWeb3Wallet> {
  if (web3wallet) {
    return web3wallet;
  }

  const core = new Core({
    projectId: WALLETCONNECT_PROJECT_ID,
  });

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'StacksStamp',
      description: 'Digital ticketing on Stacks blockchain',
      url: window.location.origin,
      icons: [`${window.location.origin}/logo.svg`],
    },
  });

  return web3wallet;
}

/**
 * Get WalletConnect instance
 */
export function getWalletConnect(): IWeb3Wallet | null {
  return web3wallet;
}

/**
 * Connect via WalletConnect URI
 */
export async function connectWalletConnect(uri: string, userAddress: string, network: 'mainnet' | 'testnet' = 'mainnet'): Promise<void> {
  try {
    const wallet = await initWalletConnect();

    // Pair with the dApp
    await wallet.pair({ uri });

    // Listen for session proposals
    wallet.on('session_proposal', async (proposal) => {
      try {
        const { id, params } = proposal;
        
        // Build approved namespaces based on the proposal
        const approvedNamespaces = buildApprovedNamespaces({
          proposal: params,
          supportedNamespaces: {
            stacks: {
              chains: [STACKS_CHAINS[network]],
              methods: STACKS_METHODS,
              events: STACKS_EVENTS,
              accounts: [`${STACKS_CHAINS[network]}:${userAddress}`],
            },
          },
        });

        // Approve the session
        await wallet.approveSession({
          id,
          namespaces: approvedNamespaces,
        });

        console.log('WalletConnect session approved');
      } catch (error) {
        console.error('Error approving session:', error);
        // Reject the session if there's an error
        await wallet.rejectSession({
          id: proposal.id,
          reason: getSdkError('USER_REJECTED'),
        });
      }
    });

    // Listen for session requests (transaction signing, etc.)
    wallet.on('session_request', async (event) => {
      const { topic, params, id } = event;
      const { request } = params;

      console.log('Session request received:', request.method);

      try {
        // Handle different request types
        switch (request.method) {
          case 'stacks_signMessage':
            // Implement message signing
            console.log('Sign message request:', request.params);
            // For now, reject - you'll implement signing logic later
            await wallet.respondSessionRequest({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                error: {
                  code: 5000,
                  message: 'User rejected the request',
                },
              },
            });
            break;

          case 'stacks_signTransaction':
          case 'stacks_stxTransfer':
          case 'stacks_contractCall':
            // Implement transaction signing
            console.log('Transaction request:', request.params);
            // For now, reject - you'll implement signing logic later
            await wallet.respondSessionRequest({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                error: {
                  code: 5000,
                  message: 'User rejected the request',
                },
              },
            });
            break;

          default:
            await wallet.respondSessionRequest({
              topic,
              response: {
                id,
                jsonrpc: '2.0',
                error: {
                  code: 5001,
                  message: 'Method not supported',
                },
              },
            });
        }
      } catch (error) {
        console.error('Error handling session request:', error);
        await wallet.respondSessionRequest({
          topic,
          response: {
            id,
            jsonrpc: '2.0',
            error: {
              code: 5000,
              message: 'Internal error',
            },
          },
        });
      }
    });

    wallet.on('session_delete', () => {
      console.log('WalletConnect session deleted');
    });

  } catch (error) {
    console.error('WalletConnect connection error:', error);
    throw error;
  }
}

/**
 * Disconnect WalletConnect session
 */
export async function disconnectWalletConnect(): Promise<void> {
  if (!web3wallet) return;

  try {
    const sessions = web3wallet.getActiveSessions();
    
    // Disconnect all active sessions
    for (const topic in sessions) {
      await web3wallet.disconnectSession({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    }

    console.log('All WalletConnect sessions disconnected');
  } catch (error) {
    console.error('Error disconnecting WalletConnect:', error);
    throw error;
  }
}

/**
 * Get active WalletConnect sessions
 */
export function getActiveSessions() {
  if (!web3wallet) return {};
  return web3wallet.getActiveSessions();
}

/**
 * Check if WalletConnect is connected
 */
export function isWalletConnectConnected(): boolean {
  if (!web3wallet) return false;
  const sessions = web3wallet.getActiveSessions();
  return Object.keys(sessions).length > 0;
}
