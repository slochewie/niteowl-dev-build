import { apiKeyClient } from "@better-auth/api-key/client";
import { createAuthClient } from "better-auth/react";
import {
	adminClient,
	emailOTPClient,
	jwtClient,
	magicLinkClient,
	multiSessionClient,
	organizationClient,
	usernameClient,
} from "better-auth/client/plugins";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { sentinelClient } from "@better-auth/infra/client";
import {
	adminAccessControl,
	adminRole,
	adminViewerRole,
	userRole,
} from "./admin/permissions";

export const authClient = createAuthClient({
	plugins: [
		adminClient({
			ac: adminAccessControl,
			roles: {
				admin: adminRole,
				"admin-viewer": adminViewerRole,
				user: userRole,
			},
		}),
		usernameClient(),
		multiSessionClient(),
		organizationClient({
			teams: {
				enabled: true,
			},
		}),
		jwtClient(),
		oauthProviderClient(),
		magicLinkClient(),
		emailOTPClient(),
		apiKeyClient(),
		sentinelClient({
			identifyUrl: process.env.BETTER_AUTH_IDENTIFY_URL,
		}),
	],
});

const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "github",
	});
};
