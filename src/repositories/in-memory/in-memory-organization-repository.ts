import { Organization } from "@/models/index.js";
import type { OrganizationRepository } from "../organization-repository.js";

export class InMemoryOrganizationRepository implements OrganizationRepository {
	private organization: Organization | null = Organization.fromData({
		id: "550e8400-e29b-41d4-a716-446655440000",
		name: "Default Organization",
		email: "test@organization.com",
		passwordHash: "123456",
		descriptionMarkdown: undefined,
		imageURL: undefined,
		bannerURL: undefined,
	});

	async getOrganizationInfo(): Promise<Organization | null> {
		return this.organization;
	}

	async create(organizationData: {
		name: string;
		email: string;
		passwordHash: string;
		descriptionMarkdown?: string;
		imageURL?: string;
		bannerURL?: string;
	}): Promise<Organization> {
		this.organization = Organization.create(organizationData);
		return this.organization;
	}

	async update(organization: Organization): Promise<Organization> {
		this.organization = organization;
		return this.organization;
	}

	// Test helper method
	setOrganization(organization: Organization | null) {
		this.organization = organization;
	}
}
