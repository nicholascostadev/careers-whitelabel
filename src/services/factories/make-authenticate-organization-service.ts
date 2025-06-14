import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository.js";
import { AuthenticateOrganizationService } from "../organization/authenticate.js";

export const makeAuthenticateOrganizationService = () => {
	const organizationRepository = new PrismaOrganizationRepository();

	return new AuthenticateOrganizationService(organizationRepository);
};
