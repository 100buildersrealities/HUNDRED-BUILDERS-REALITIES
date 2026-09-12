import { Property, AuthUser } from '../types';

/**
 * Checks if a property belongs to or can be managed/deleted by the currently authenticated user.
 * Supports:
 * 1. Matching by creatorUserId
 * 2. Matching by contactPhone or contactEmail
 * 3. Matching by user-created flag and matching role
 * 4. Matching role-based inventory for owners, verified agents, hundred builders, and registered brokers
 */
export function isPropertyOwnedByUser(property: Property, user: AuthUser | null): boolean {
  if (!user) return false;

  // 1. Explicit creator ID match
  if (property.creatorUserId && property.creatorUserId === user.id) {
    return true;
  }

  // 2. Direct phone number matching (sanitized last 10 digits)
  if (property.contactPhone && user.phone) {
    const pDigits = property.contactPhone.replace(/\D/g, '').slice(-10);
    const uDigits = user.phone.replace(/\D/g, '').slice(-10);
    if (pDigits && uDigits && pDigits === uDigits) {
      return true;
    }
  }

  // 3. Email matching
  if (property.contactEmail && user.email) {
    if (property.contactEmail.trim().toLowerCase() === user.email.trim().toLowerCase()) {
      return true;
    }
  }

  // 4. Any newly posted property matching user's role
  if (property.id.startsWith('user-') && (property.listedBy === user.role || property.creatorUserRole === user.role)) {
    return true;
  }

  // 5. Role-specific catalog ownership:
  // Allows Owner, Verified Agent, Hundred Builders, and Registered Broker to manage their role's inventory
  if (property.listedBy === user.role) {
    return true;
  }

  return false;
}
