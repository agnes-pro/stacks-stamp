import { Link } from 'react-router-dom';
import { Stamp, Shield, Clock, CheckCircle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: 'Verifiable Proof',
      description: 'Attendance records stored permanently on-chain with cryptographic proof',
    },
    {
      icon: Clock,
      title: 'Immutable Timestamps',
      description: 'Check-in times recorded using Stacks block time, impossible to forge',
    },
    {
      icon: CheckCircle,
      title: 'Simple & Fast',
      description: 'Create events and check in with just a few clicks',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
              <Stamp className="h-12 w-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              On-Chain Attendance
              <br />
              Verification
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Create events and verify attendance with blockchain-powered proof.
              Permanent, immutable, and decentralized.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create" className="btn-secondary text-lg px-8 py-3">
                Create Event
              </Link>
              <button className="bg-white text-primary hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-all duration-200 text-lg">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why StackStamp?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built on Stacks blockchain for maximum security and transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Create Event
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set up your event with a name and details. Your event gets a unique ID.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Share Event ID
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share the event ID with attendees so they can check in.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Verify Attendance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All check-ins are recorded on-chain with verifiable proof.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/create" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
