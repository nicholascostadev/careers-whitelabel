import { db } from "@/lib/infra/database.js";
import { Organization } from "@/models/index.js";
import type { OrganizationRepository } from "../organization-repository.js";

export class PrismaOrganizationRepository implements OrganizationRepository {
	async getOrganizationInfo(): Promise<Organization | null> {
		const organizationData = await db.organization.findFirst();

		if (!organizationData) {
			return null;
		}

		// Convert database entity to domain model
		return Organization.fromData({
			id: organizationData.id,
			email: organizationData.email,
			passwordHash: organizationData.passwordHash,
			name: organizationData.name,
			descriptionMarkdown: organizationData.descriptionMarkdown ?? undefined,
			imageURL: organizationData.imageURL ?? undefined,
			bannerURL: organizationData.bannerURL ?? undefined,
		});
	}

	async update(organization: Organization): Promise<Organization> {
		// Save to database using domain model data
		const savedOrganization = await db.organization.update({
			where: {
				id: organization.id,
			},
			data: {
				name: organization.name,
				descriptionMarkdown: organization.descriptionMarkdown,
				imageURL: organization.imageURL,
				bannerURL: organization.bannerURL,
			},
		});

		// Convert database entity back to domain model
		return Organization.fromData({
			id: savedOrganization.id,
			email: savedOrganization.email,
			passwordHash: savedOrganization.passwordHash,
			name: savedOrganization.name,
			descriptionMarkdown: savedOrganization.descriptionMarkdown ?? undefined,
			imageURL: savedOrganization.imageURL ?? undefined,
			bannerURL: savedOrganization.bannerURL ?? undefined,
		});
	}
}
