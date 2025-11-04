/**
 * Environment variable helper with validation
 */

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

export function requireEnvWithDefault<T>(key: string, defaultValue: T): string | T {
  return process.env[key] || defaultValue;
}

export function validateEnv(required: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  return {
    valid: missing.length === 0,
    missing,
  };
}
