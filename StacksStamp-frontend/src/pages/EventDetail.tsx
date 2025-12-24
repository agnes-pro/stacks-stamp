import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle, LogIn } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Placeholder data - will be replaced with real blockchain data
  const event = {
    id: id || '0',
    name: 'Community Meetup 2024',
    creator: 'SP2J6...',
    createdAt: '2024-01-15T10:00:00Z',
    active: true,
    attendees: [
      { address: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', timestamp: '2024-01-15T11:30:00Z' },
      { address: 'SPVNRH0FC9XJP8J18C92J09MNBS2BS2TW55MYA15', timestamp: '2024-01-15T11:32:00Z' },
    ],
  };

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    // Wallet connection and check-in logic will go here
    console.log('Checking in to event:', id);
    setTimeout(() => setIsCheckingIn(false), 1000);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {event.name}
                </h1>
                {event.active ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-sm font-medium rounded-full">
                    Closed
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Event ID: <span className="font-mono font-semibold">{event.id}</span>
              </p>
            </div>
            {event.active && (
              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <LogIn className="h-5 w-5" />
                {isCheckingIn ? 'Checking In...' : 'Check In'}
              </button>
            )}
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendees</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {event.attendees.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {new Date(event.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Creator</p>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                  {shortenAddress(event.creator)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendees List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Attendees
          </h2>

          {event.attendees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No attendees yet. Be the first to check in!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {event.attendees.map((attendee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                        {attendee.address}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(attendee.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check-in Info */}
        {event.active && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              How to check in:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-400">
              <li>Connect your Leather wallet</li>
              <li>Click the "Check In" button above</li>
              <li>Confirm the transaction (~0.001 STX fee)</li>
              <li>Your attendance will be recorded on-chain</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
