export const SIGN_IN_PATH = "/sign-in";
export const DEFAULT_AUTH_CALLBACK = "/dashboard";
export function getSafeCallbackPath(
  callbackUrl: string | null | undefined
): string {
  // Must start with `/` but not `//` — the latter is treated as an external URL by browsers.
  if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  return DEFAULT_AUTH_CALLBACK;
}