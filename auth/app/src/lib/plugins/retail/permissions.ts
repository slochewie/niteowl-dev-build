export const RETAIL_CAPABILITIES = [
  "retail:read",
  "retail:item:write",
  "retail:stock:adjust",
  "retail:stock:transfer",
  "retail:receive",
  "retail:purchase",
  "retail:cost:read",
  "retail:manage",
] as const;

export type RetailCapability = (typeof RETAIL_CAPABILITIES)[number];

/** Unknown persisted capabilities never grant authority. No capability implies another. */
export function retailCapabilities(values: readonly string[]): RetailCapability[] {
  return RETAIL_CAPABILITIES.filter(capability => values.includes(capability));
}
