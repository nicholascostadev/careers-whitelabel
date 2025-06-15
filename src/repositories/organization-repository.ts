import type { Organization } from "@/models/index.js";

export interface OrganizationRepository {
	getOrganizationInfo(): Promise<Organization | null>;
	update(organization: Organization): Promise<Organization>;
}
