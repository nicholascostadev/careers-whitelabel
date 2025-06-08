import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository";
import { AuthenticateOrganizationService } from "../organization/authenticate";

export const makeAuthenticateOrganizationService = () => {
	const organizationRepository = new PrismaOrganizationRepository();

	return new AuthenticateOrganizationService(organizationRepository);
};
