import type { OrganizationRepository } from "@/repositories/organization-repository";
import type { Organization } from "@prisma/client";

export class InMemoryOrganizationRepository implements OrganizationRepository {
	data: Organization = {
		id: "1",
		name: "Test Organization",
		email: "test@test.com",
		descriptionMarkdown: "Test Organization description",
		imageURL: "https://test.com/image.png",
		bannerURL: "https://test.com/banner.png",
	};

	async getOrganizationInfo() {
		return this.data;
	}
}
