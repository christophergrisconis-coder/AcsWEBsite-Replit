import assert from "node:assert/strict";
import test from "node:test";
import { filterPublishablePartnerProofs } from "../src/data/partner-proof.ts";

test("does not publish proof missing source approval", () => {
  const proofs = [
    {
      id: "source-pending",
      sourceApproved: false,
      publicationApproved: true,
      sourceContext: "Partner supplied a draft quote",
    },
  ];

  assert.deepEqual(filterPublishablePartnerProofs(proofs), []);
});

test("does not publish proof missing publication permission", () => {
  const proofs = [
    {
      id: "permission-pending",
      sourceApproved: true,
      publicationApproved: false,
      sourceContext: "Partner approved the wording",
    },
  ];

  assert.deepEqual(filterPublishablePartnerProofs(proofs), []);
});

test("keeps source context on explicitly cleared proof", () => {
  const sourceContext =
    "Approved case-study excerpt from a workforce board partner review";
  const proofs = [
    {
      id: "cleared-case-study",
      sourceApproved: true,
      publicationApproved: true,
      sourceContext,
    },
  ];

  assert.deepEqual(filterPublishablePartnerProofs(proofs), [
    {
      id: "cleared-case-study",
      sourceApproved: true,
      publicationApproved: true,
      sourceContext,
    },
  ]);
});