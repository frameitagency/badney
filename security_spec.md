# Security Specification - Badney Cotton Firestore Databases

## 1. Data Invariants
- A user profile can ONLY be created for the authenticated user, where the document ID matches `request.auth.uid` and the `uid` field matches the same.
- An order can ONLY be written if `userId` matches the currently authenticated user (`request.auth.uid`).
- Once created, orders are read-only (immutable) to prevent any tamper with dispatched transaction receipt histories.
- Sizing lists and list sizes must be strictly bounded to prevent Denial of Wallet resource exhaustion attacks.

## 2. The "Dirty Dozen" Payloads
These payloads describe attempts to bypass the security layers and will result in `PERMISSION_DENIED`:

1. **Anonymous Write to User Profile**: Attempting to create a user profile without auth.
2. **Identity Spoofing Profile**: Creating a user profile with ID `user_a` while authenticated as `user_b`.
3. **Shadow Field Injection**: Injecting a `role: "admin"` claim into user document fields.
4. **Incorrect Schema Format**: Missing required field `email` on profile creation.
5. **Wrong Creation Date**: Attempt to override `createdAt` with a client-side timestamp instead of `request.time`.
6. **Anonymous Order Placement**: Attempt to create an order without logging in.
7. **Order Identity Theft**: Creating an order with `userId: "customer_a"` while authenticated as `customer_b`.
8. **Malicious ID Poisoning**: Using a 1MB string or invalid characters for `{orderId}` path parameters.
9. **Tampering Dispatched Status**: Modifying the item values or shipping cost of an existing order.
10. **Listing Others' Orders**: Attempting to query the entire `/orders` collection without a security filter matching the user's UID.
11. **Injecting Malicious Items Array Size**: Orders containing a list of 10,000 items (Denial of Wallet).
12. **Modifying Immortal Fields**: Editing `createdAt` timestamp of a dispatched order.

## 3. Test Runner Design Blueprint
A automated or simulated test suite verifying each of the Dirty Dozen assertions denies write/read access.
