import type { Organization } from "@prisma/client";

interface UpdateOrganizationRequest {
	name?: string;
	// TODO: email not for now
	// email: string;
	descriptionMarkdown?: string;
	imageURL?: string | null;
	bannerURL?: string | null;
}

export interface OrganizationRepository {
	getOrganizationInfo(): Promise<Organization>;
	update(data: UpdateOrganizationRequest): Promise<Organization>;
}
