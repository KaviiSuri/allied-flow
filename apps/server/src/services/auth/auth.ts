import { IncomingHttpHeaders } from "http";
import type { IdTokenClaims } from "@logto/js";
import { createRemoteJWKSet, jwtVerify } from "jose";

import { env } from "../../config/env.js";

const extractBearerTokenFromHeaders = ({
  authorization,
}: IncomingHttpHeaders) => {
  if (!authorization) {
    throw new Error("Authorization header is missing");
  }

  if (!authorization.startsWith("Bearer")) {
    throw new Error("Authorization header is not in the Bearer scheme");
  }

  return authorization.slice(7); // The length of 'Bearer ' is 7
};

// Generate a JWKS using jwks_uri obtained from the Logto server
// Replace `<your-logto-endpoint>` with your Logto endpoint, e.g., `abc123.logto.app`
const jwks = createRemoteJWKSet(new URL(`${env.LOGTO_ENDPOINT}/oidc/jwks`));

export const extractClaimsFromHeader = async (headers: IncomingHttpHeaders) => {
  // Extract the token using the helper function defined above
  const token = extractBearerTokenFromHeaders(headers);

  const { payload } = await jwtVerify(
    // The raw Bearer Token extracted from the request header
    token,
    jwks,
    {
      // Expected issuer of the token, issued by the Logto server
      issuer: `${env.LOGTO_ENDPOINT}/oidc`,
      // Expected audience token, the resource indicator of the current API
      audience: `${env.LOGTO_AUDIENCE}/api`,
    },
  );

  return payload as IdTokenClaims;
};
