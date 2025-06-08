import type { FastifyInstance } from "fastify";
import { authenticateOrganizationController } from "./authenticate";
import { getOrganizationInfoController } from "./get-organization-info";

export const organizationRoutes = (app: FastifyInstance) => {
	app.get("/info", getOrganizationInfoController);
	app.post("/authenticate", authenticateOrganizationController);
};
