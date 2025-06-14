import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	AuthenticateBodySchema,
	AuthenticateResponseSchema,
	authenticateOrganizationController,
} from "./authenticate.js";
import {
	RefreshAccessTokenResponseSchema,
	refreshAccessTokenController,
} from "./refreshAccessToken.js";

export function authRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "post",
		url: "/",
		schema: {
			tags: ["auth"],
			body: AuthenticateBodySchema,
			response: AuthenticateResponseSchema,
		},
		handler: authenticateOrganizationController,
	});
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "post",
		url: "/refresh",
		schema: {
			tags: ["auth"],
			response: RefreshAccessTokenResponseSchema,
		},
		handler: refreshAccessTokenController,
	});
}
