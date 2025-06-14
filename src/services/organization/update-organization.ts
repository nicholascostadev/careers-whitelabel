import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created.js";
import type { OrganizationRepository } from "@/repositories/organization-repository.js";

export interface UpdateOrganizationRequest {
	name?: string;
	// TODO: email not for now
	// email: string;
	descriptionMarkdown?: string;
	imageURL?: string | null;
	bannerURL?: string | null;
}

export class UpdateOrganizationService {
	constructor(private organizationRepository: OrganizationRepository) {}

	async execute(request: UpdateOrganizationRequest) {
		const organization =
			await this.organizationRepository.getOrganizationInfo();

		if (!organization) {
			throw new OrganizationNotCreatedException();
		}

		const updatedOrganization =
			await this.organizationRepository.update(request);

		return updatedOrganization;
	}
}
