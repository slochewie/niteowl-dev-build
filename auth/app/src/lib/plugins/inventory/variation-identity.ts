import { APIError } from "better-auth/api";

const reserved = new Set(["kind", "name", "sizeoz", "size_oz", "packagetype", "package_type", "defaultpricecents", "priceoverridecents"]);

/** The canonical JSON is both the attribute data and the unique combination key. */
export function canonicalVariation(attributes: Record<string, string>) {
  const entries = Object.entries(attributes);
  if (entries.length < 1 || entries.length > 8) {
    throw new APIError("BAD_REQUEST", { message: "Provide between one and eight variation attributes" });
  }
  const normalized = new Map<string, string>();
  for (const [rawName, rawValue] of entries) {
    const name = rawName.normalize("NFKC").trim().toLowerCase();
    const value = rawValue.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
    if (!/^[a-z][a-z0-9_-]{0,31}$/.test(name) || reserved.has(name) ||
        value.length < 1 || value.length > 80 || /[\u0000-\u001f\u007f]/.test(value) ||
        normalized.has(name)) {
      throw new APIError("BAD_REQUEST", { message: "Invalid or duplicate variation attribute" });
    }
    normalized.set(name, value);
  }
  const canonical = Object.fromEntries([...normalized.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  return { attributes: canonical, key: JSON.stringify(canonical) };
}

export function variationAttributes(key: string | null | undefined): Record<string, string> {
  if (key == null) return {};
  const attributes: unknown = JSON.parse(key);
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes) ||
      Object.values(attributes).some(value => typeof value !== "string")) {
    throw new Error("Invalid stored catalog variation identity");
  }
  const canonical = canonicalVariation(attributes as Record<string, string>);
  if (canonical.key !== key) throw new Error("Noncanonical stored catalog variation identity");
  return canonical.attributes;
}
