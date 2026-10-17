import type { PoolClient } from "pg";

/** Parent rows are locked; participants share the Inventory-owned transaction. */
export type OrganizationVariantMerge = {
  organizationId: string;
  sourceOrganizationVariantId: string;
  targetOrganizationVariantId: string;
};

export type CatalogMergeParticipant = {
  beforeOrganizationVariantDelete(
    db: PoolClient,
    merge: OrganizationVariantMerge,
  ): Promise<void>;
};
