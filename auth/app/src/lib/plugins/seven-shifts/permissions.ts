export type NiteOwlApp = "counter" | "unifi" | "schedules";

export const roleAppPermissions: Record<
  string,
  readonly NiteOwlApp[]
> = {
  Manager: ["counter", "unifi", "schedules"],
  Door: ["counter"],
  "Counter Viewer": ["counter"],
  "Cover Charge": ["counter"],
};

export function appsForSevenShiftsRole(
  roleName: string,
): readonly NiteOwlApp[] {
  return roleAppPermissions[roleName] ?? [];
}
