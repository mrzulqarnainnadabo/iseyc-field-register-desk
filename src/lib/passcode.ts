import "server-only";

// Simple shared passcode for staff mode on the Field participation tab.
// Not an auth system — just a light gate to keep casual visitors off the
// batch-entry flow when REGISTER_PASSCODE is set.

export function passcodeRequired(): boolean {
  return Boolean(process.env.REGISTER_PASSCODE && process.env.REGISTER_PASSCODE.length > 0);
}

export function checkPasscode(submitted: string | undefined | null): boolean {
  const expected = process.env.REGISTER_PASSCODE;
  if (!expected) return true; // no gate configured
  if (!submitted) return false;
  return submitted === expected;
}
