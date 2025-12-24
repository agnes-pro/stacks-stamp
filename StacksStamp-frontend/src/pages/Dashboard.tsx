import { useState } from 'react';
import { Users, Calendar, CheckCircle, X } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'my-events' | 'attended'>('my-events');

  // Placeholder data - will be replaced with real data from blockchain
  const myEvents = [
    { id: 0, name: 'Community Meetup 2024', attendees: 12, active: true },
    { id: 1, name: 'Developer Workshop', attendees: 8, active: true },
    { id: 2, name: 'Product Launch', attendees: 25, active: false },
  ];

  const attendedEvents = [
    { id: 3, name: 'Tech Conference', timestamp: '2024-01-15' },
    { id: 4, name: 'Hackathon Kickoff', timestamp: '2024-01-10' },
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your events and view attendance records
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Events Created
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {myEvents.length}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Attendees
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {myEvents.reduce((sum, event) => sum + event.attendees, 0)}
                </p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Users className="h-8 w-8 text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Events Attended
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {attendedEvents.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('my-events')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'my-events'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                My Events ({myEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('attended')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'attended'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Events Attended ({attendedEvents.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'my-events' ? (
          <div className="space-y-4">
            {myEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {event.name}
                      </h3>
                      {event.active ? (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 text-xs font-medium rounded-full flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Closed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        Event ID: <span className="font-mono font-medium">{event.id}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} attendees
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors duration-200">
                      View Details
                    </button>
                    {event.active && (
                      <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg font-medium transition-colors duration-200">
                        Close Event
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {attendedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        Event ID: <span className="font-mono font-medium">{event.id}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Attended on {event.timestamp}
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors duration-200">
                    View Proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
