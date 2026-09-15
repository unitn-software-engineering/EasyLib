# Loan Lifecycle Specification

## Status

APPROVED for implementation within the approved scope.

## Traceability

RF4, RF5, RF6, RF8, RF9, US-04, US-05, US-06, US-07, US-08, CLAR-EASY-01, CLAR-EASY-02, CLAR-EASY-03.

## Intent and actors

An authenticated library user can borrow a book and consult their active and returned loans. A library operator can create loans on behalf of users, register returns and extend an active loan.

## Business rules

- `BR-LOAN-01`: only an authenticated user or operator can access loan operations.
- `BR-LOAN-02`: a regular user can access only their own loans.
- `BR-LOAN-03`: an operator can manage loans for any user.
- `BR-LOAN-04`: a book with an active loan cannot be borrowed again.
- `BR-LOAN-05`: a new loan starts at creation time and expires 30 days later.
- `BR-LOAN-06`: a return changes the loan to `returned`, records `returnedAt` and makes the book available; the loan record is not deleted.
- `BR-LOAN-07`: an operator can extend an active loan by 30 days from its current end date.
- `BR-LOAN-08`: reservations are deferred and do not affect the current loan decision.

## Acceptance scenarios

- Given an authenticated user and an available book, when the user borrows it, then the system creates an active loan with a 30-day due date.
- Given a book with an active loan, when another loan is requested, then the system returns `409 Conflict`.
- Given an active loan owned by the authenticated user, when it is returned, then the system returns `204`, preserves the record as `returned`, stores `returnedAt` and allows a new loan for the book.
- Given an invalid loan identifier, when a return or extension is requested, then the system returns `400`.
- Given a loan owned by another user and a regular user, when the loan is accessed or changed, then the system returns `403`.
- Given an operator and an active loan, when an extension is requested, then the due date increases by 30 days.

## Relevant RNF and verification

RNF1, RNF2, RNF4, RNF5 and RNF6 apply. Verification requires unit tests, API/integration tests, OpenAPI contract review, authorization tests and an exploratory UI test.
