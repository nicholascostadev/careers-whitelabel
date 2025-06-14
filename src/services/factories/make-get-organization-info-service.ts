import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository.js";
import { GetOrganizationInfoService } from "../organization/get-organization-info.js";

export function makeGetOrganizationInfoService() {
	const organizationRepository = new PrismaOrganizationRepository();
	const getOrganizationInfoService = new GetOrganizationInfoService(
		organizationRepository,
	);

	return getOrganizationInfoService;
}
