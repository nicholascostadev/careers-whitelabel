import { PrismaOrganizationRepository } from "@/repositories/prisma/prisma-organization-repository";
import { GetOrganizationInfoService } from "../organization/get-organization-info";

export function makeGetOrganizationInfoService() {
	const organizationRepository = new PrismaOrganizationRepository();
	const getOrganizationInfoService = new GetOrganizationInfoService(
		organizationRepository,
	);

	return getOrganizationInfoService;
}
