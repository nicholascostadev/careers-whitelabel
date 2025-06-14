import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	GetOrganizationInfoResponseSchema,
	getOrganizationInfoController,
} from "./get-organization-info.js";

export const organizationRoutes = (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "get",
		url: "/info",
		schema: {
			tags: ["organization"],
			response: GetOrganizationInfoResponseSchema,
		},
		handler: getOrganizationInfoController,
	});
};
