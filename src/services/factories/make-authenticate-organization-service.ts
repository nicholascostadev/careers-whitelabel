import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository.js";
import { AuthenticateOrganizationService } from "../auth/authenticate.js";

export const makeAuthenticateOrganizationService = () => {
	const organizationRepository = new PrismaOrganizationRepository();

	return new AuthenticateOrganizationService(organizationRepository);
};
