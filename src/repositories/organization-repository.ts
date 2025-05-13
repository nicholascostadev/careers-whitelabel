import type { Organization } from "@prisma/client";

export interface OrganizationRepository {
	getOrganizationInfo(): Promise<Organization>;
}
