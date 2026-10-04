# Tip Claim Better Auth plugin

Provides organization-scoped authorization and persistence for the Tip Calculator application.

Despite the historical plugin ID `tip-claim`, the current plugin supports both claim-calculation shifts and tip-pool shifts, along with assignments, role eligibility, staffing snapshots, and reusable weight presets.

## Registration

```ts
tipClaim({
  pool,
  internalSecret: process.env.TIP_CLAIM_INTERNAL_SECRET,
})
```

## Data model

- `tipClaimEmployeeAssignment` — per-user application access, delegated assignment-manager flag, eligible Tip roles, and optional 7shifts integration flag.
- `tipWeightPreset` — organization presets for staffing counts, register count, claim percentage, weights, optional staffing snapshot, source, and expiration.
- `tipClaimShift` — saved claim-calculation result.
- `tipClaimRegister` — register totals for a claim shift.
- `tipClaimStaff` — staff allocations for a claim shift.
- `tipPoolShift` — saved tip-pool result.
- `tipPoolStaff` — staff allocations for a tip-pool shift.

## Session-authenticated endpoints

The plugin exposes organization administration/application routes for:

- assignments and employees;
- access and delegated manager state;
- weight presets;
- staffing snapshots;
- claim shifts;
- tip-pool shifts.

Current paths include:

```text
/tip-claim/assignments
/tip-claim/employees
/tip-claim/access
/tip-claim/manager
/tip-claim/weight-presets
/tip-claim/staffing-snapshots
/tip-claim/shifts
/tip-claim/tip-pool-shifts
```

The resource paths use GET/POST/PATCH/DELETE as appropriate for listing, creating, editing, and deleting records.

## Internal endpoints

Trusted Tip Calculator backend calls use corresponding internal routes protected by `TIP_CLAIM_INTERNAL_SECRET`:

```text
/tip-claim/available/internal
/tip-claim/access/internal
/tip-claim/assignments/internal
/tip-claim/employees/internal
/tip-claim/weight-presets/internal
/tip-claim/staffing-snapshots/internal
/tip-claim/shifts/internal
/tip-claim/tip-pool-shifts/internal
```

Do not expose the internal secret to browser clients.

## Authorization

Global admins may access enabled organizations without ordinary application assignments.

Non-global users require an enabled organization, active membership, non-banned user, and enabled Tip Calculator access assignment.

Delegated assignment managers can administer ordinary assignments but are constrained from escalating themselves or modifying protected system/organization managers in ways reserved for organization owners/admins or global admins.

## 7shifts integration

Assignments can enable 7shifts-backed behavior. The plugin can combine organization membership with 7shifts configuration/schedule data so Tip Calculator can present scheduled staff while still enforcing local application authorization.
