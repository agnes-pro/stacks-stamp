import { useState } from 'react';
import { Calendar, Users, Info } from 'lucide-react';

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Wallet connection logic will go here
    console.log('Creating event:', eventName);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create New Event
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Set up your event and start tracking attendance on-chain
          </p>
        </div>

        {/* Info Alert */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Before you start:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                <li>Connect your Leather wallet</li>
                <li>Ensure you have enough STX for gas fees (~0.001 STX)</li>
                <li>Event names are limited to 100 characters</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name Input */}
            <div>
              <label
                htmlFor="eventName"
                className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g., Community Meetup 2024"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This will be displayed to attendees
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {eventName.length}/100
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!eventName.trim() || isLoading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </button>

            {/* Wallet Connection Notice */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have a wallet?{' '}
                <a
                  href="https://leather.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Get Leather Wallet
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* What Happens Next Section */}
        <div className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            What happens next?
          </h2>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Transaction Confirmation
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Confirm the transaction in your wallet (~0.001 STX fee)
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Get Your Event ID
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You'll receive a unique event ID after ~10 minutes
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Share with Attendees
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share the event ID for attendees to check in
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
