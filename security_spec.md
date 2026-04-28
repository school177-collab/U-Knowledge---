# Security Specification - U Knowledge

## 1. Data Invariants
- A question cannot be created without a valid authorId matching the authenticated user.
- A user can only edit their own profile fields (grade, class, number) but cannot elevate their own role to 'admin'.
- Comments must belong to a valid question.
- Standard users cannot create or modify events.
- Points can only be incremented by the system or teachers (simplified: users can't self-grant points).

## 2. The Dirty Dozen Payloads
1. **Identity Theft**: User A tries to create a question as User B.
2. **Privilege Escalation**: User A tries to set `role: 'admin'` on their own profile.
3. **Ghost Field Injection**: User A adds `isVerified: true` to their question.
4. **ID Poisoning**: User A uses a 2KB string as a question ID.
5. **PII Leak**: User A tries to read User B's private email.
6. **Relational Sync Failure**: User A tries to delete someone else's comment.
7. **Temporal Fraud**: User A sends a 10-year-old `createdAt` timestamp.
8. **Orphaned Write**: User A adds a comment to a non-existent question.
9. **Spam Attack**: User A tries to submit a 1MB string as a question content.
10. **Role Spoofing**: User A (student) tries to create a school event.
11. **Update Gap**: User A tries to change the `authorId` of an existing question.
12. **Negative Points**: User A tries to set their points to `99999`.

## 3. Test Runner
(I will implement `firestore.rules.test.ts` as part of the implementation turn)
