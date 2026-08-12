export type NiteOwlApp = "counter" | "unifi";

export const roleAppPermissions: Record<
  string,
  readonly NiteOwlApp[]
> = {
  Manager: ["counter", "unifi"],
  Door: ["counter"],
  "Counter Viewer": ["counter"],
  "Cover Charge": ["counter"],
};

export function appsForSevenShiftsRole(
  roleName: string,
): readonly NiteOwlApp[] {
  return roleAppPermissions[roleName] ?? [];
}
