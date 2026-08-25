export interface ApprovalGatedProof {
  sourceApproved: boolean;
  publicationApproved: boolean;
}

/**
 * Partner proof must have both source approval and publication permission.
 * Keep this predicate pure so the publication gate can be tested independently
 * from the page that renders the approved records.
 */
export function filterPublishablePartnerProofs<T extends ApprovalGatedProof>(
  proofs: T[],
): T[] {
  return proofs.filter(
    (proof) => proof.sourceApproved && proof.publicationApproved,
  );
}