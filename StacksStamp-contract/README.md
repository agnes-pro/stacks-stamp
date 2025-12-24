# StackStamp

**On-chain event attendance verification on Stacks blockchain**

StackStamp is a decentralized attendance tracking system where event creators publish events to the Stacks blockchain and attendees check in with cryptographically verified proof stored permanently and immutably.

## Features

- **Create Events**: Publish events on-chain with unique IDs
- **Check-In System**: Attendees sign transactions to prove attendance
- **Permanent Records**: Blockchain-verified attendance with timestamps
- **Event Management**: Creators can close events to prevent new check-ins
- **No Duplicates**: Smart contract prevents double check-ins
- **Minimal Storage**: Event metadata stored off-chain, only essentials on-chain

## Smart Contract Overview

### Public Functions

#### `create-event`
```clarity
(create-event (name (string-ascii 100)))
```
Creates a new event and returns a unique event ID.
- **Parameters**: Event name (max 100 characters)
- **Returns**: `(ok event-id)`
- **Errors**: `ERR_INVALID_NAME (u102)` if name is empty

#### `check-in`
```clarity
(check-in (event-id uint))
```
Records attendance for the caller at the specified event.
- **Parameters**: Event ID
- **Returns**: `(ok check-in-timestamp)`
- **Errors**:
  - `ERR_EVENT_NOT_FOUND (u100)` - Event doesn't exist or is closed
  - `ERR_ALREADY_CHECKED_IN (u101)` - User already checked in

#### `close-event`
```clarity
(close-event (event-id uint))
```
Closes an event to prevent new check-ins. Only callable by event creator.
- **Parameters**: Event ID
- **Returns**: `(ok true)`
- **Errors**:
  - `ERR_EVENT_NOT_FOUND (u100)` - Event doesn't exist
  - `ERR_NOT_EVENT_CREATOR (u103)` - Caller is not the event creator

### Read-Only Functions

#### `get-event`
```clarity
(get-event (event-id uint))
```
Returns event details including creator and active status.
- **Returns**: `(optional {creator: principal, active: bool})`

#### `get-attendance`
```clarity
(get-attendance (event-id uint) (attendee principal))
```
Returns the timestamp when a user checked in, or none if they didn't attend.
- **Returns**: `(optional uint)` - Unix timestamp or none

#### `did-attend`
```clarity
(did-attend (event-id uint) (attendee principal))
```
Simple boolean check if a user attended an event.
- **Returns**: `bool` - true if attended, false otherwise

## Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| u100 | `ERR_EVENT_NOT_FOUND` | Event doesn't exist or is closed |
| u101 | `ERR_ALREADY_CHECKED_IN` | User already checked into this event |
| u102 | `ERR_INVALID_NAME` | Event name is empty |
| u103 | `ERR_NOT_EVENT_CREATOR` | Caller is not authorized to manage this event |

## Data Storage

The contract uses minimal on-chain storage:

- **Events Map**: `event-id → {creator: principal, active: bool}`
- **Attendance Map**: `{event-id, attendee} → timestamp`
- **Event Counter**: Auto-incrementing ID for new events

Event names and metadata are emitted via `print` statements for off-chain indexers, not stored in contract storage.

## Development Setup

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Stacks smart contract development tool
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run tests once
npm test

# Run tests with coverage and cost reports
npm run test:report

# Watch mode (auto-run tests on file changes)
npm run test:watch
```

### Local Development

```bash
# Check contract syntax
clarinet check

# Open Clarinet console
clarinet console

# Deploy to local devnet
clarinet integrate
```

## Deployment

### Testnet Deployment

```bash
clarinet deployment generate --testnet
clarinet deployment apply --testnet
```

### Mainnet Deployment

```bash
clarinet deployment generate --mainnet
clarinet deployment apply --mainnet
```

## Usage Examples

### Creating an Event

```clarity
(contract-call? .StackStamp create-event "Bitcoin Conference 2025")
;; Returns: (ok u0)  ;; Event ID is 0
```

### Checking Into an Event

```clarity
(contract-call? .StackStamp check-in u0)
;; Returns: (ok u1734134400)  ;; Returns timestamp of check-in
```

### Closing an Event

```clarity
(contract-call? .StackStamp close-event u0)
;; Returns: (ok true)  ;; Only if you're the event creator
```

### Querying Attendance

```clarity
;; Check if someone attended
(contract-call? .StackStamp did-attend u0 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
;; Returns: true

;; Get exact check-in time
(contract-call? .StackStamp get-attendance u0 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
;; Returns: (some u1734134400)
```

## Architecture Decisions

### Why Minimal On-Chain Storage?

- **Lower gas costs**: Only essential data stored on-chain
- **Frontend flexibility**: Event details (descriptions, images, etc.) managed off-chain
- **Scalability**: Reduced blockchain bloat
- **Cost-effective**: Users pay less for transactions

### Why Use `stacks-block-time`?

- **Verifiable timestamps**: Blockchain-native time source
- **No user manipulation**: Timestamp comes from block, not user input
- **Permanent record**: Proves exactly when attendance occurred

### Print Events for Metadata

The contract emits event data via `print` statements:
```clarity
(print {
  event: "event-created",
  event-id: u0,
  creator: 'SP...,
  name: "Conference Name",
  block-time: u1734134400
})
```

Off-chain indexers can capture and store this data for frontends while keeping the contract lean.

## Security Considerations

- All interactions require signed transactions (prevents spoofing)
- Double check-ins prevented by smart contract
- Event creators have exclusive control over their events
- No admin backdoors or pause mechanisms (fully decentralized)
- Input validation prevents empty event names

## Roadmap

Future versions may include:
- NFT attendance badges
- Event capacity limits
- Paid event check-ins
- Batch check-in operations
- Event categories and tags

## License

ISC

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Contact

For questions or support, please open an issue in this repository.
