import type { Organization } from "@prisma/client";

export const organizationToOrganizationDTO = (organization: Organization) => {
	return {
		id: organization.id,
		name: organization.name,
		email: organization.email,
		descriptionMarkdown: organization.descriptionMarkdown,
		imageURL: organization.imageURL,
		bannerURL: organization.bannerURL,
	};
};
