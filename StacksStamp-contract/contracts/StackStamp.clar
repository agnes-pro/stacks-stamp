;; title: StackStamp
;; version: 1.0
;; summary: On-chain event attendance check-in system
;; description: A blockchain-based attendance tracker where event creators can publish events
;;              and users can check in with verifiable proof stored permanently on-chain.

;; traits
;;

;; token definitions
;;

;; constants
;;
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_EVENT_NOT_FOUND (err u100))
(define-constant ERR_ALREADY_CHECKED_IN (err u101))
(define-constant ERR_INVALID_NAME (err u102))
(define-constant ERR_NOT_EVENT_CREATOR (err u103))

;; data vars
;;
(define-data-var next-event-id uint u0)

;; data maps
;;
(define-map events uint {creator: principal, active: bool})
(define-map attendance {event-id: uint, attendee: principal} uint)

;; public functions
;;