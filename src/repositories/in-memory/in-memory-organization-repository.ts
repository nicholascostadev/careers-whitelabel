import type { UpdateOrganizationRequest } from "@/services/organization/update-organization.js";
import type { OrganizationRepository } from "../organization-repository.js";

type Organization = {
	id: string;
	name: string;
	email: string;
	passwordHash: string;
	descriptionMarkdown: string | null;
	imageURL: string | null;
	bannerURL: string | null;
};

export class InMemoryOrganizationRepository implements OrganizationRepository {
	organization: Organization = {
		id: "1",
		name: "Default Organization",
		email: "test@organization.com",
		passwordHash: "123456",
		descriptionMarkdown: null,
		imageURL: null,
		bannerURL: null,
	};

	async getOrganizationInfo() {
		return this.organization;
	}

	async create(data: Partial<Organization>) {
		this.organization = {
			...this.organization,
			...data,
		};
		return this.organization;
	}

	async update(data: UpdateOrganizationRequest) {
		this.organization = {
			...this.organization,
			...data,
		};

		return this.organization;
	}

	// Test helper method
	setOrganization(organization: Organization | null) {
		// @ts-expect-error - This is a test helper method
		this.organization = organization;
	}
}
