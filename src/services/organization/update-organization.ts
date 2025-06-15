import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created.js";
import type { UpdateOrganizationDTO } from "@/lib/dtos/update-organization.dto.js";
import type { Organization } from "@/models/index.js";
import type { OrganizationRepository } from "@/repositories/organization-repository.js";

export class UpdateOrganizationService {
	constructor(private organizationRepository: OrganizationRepository) {}

	async execute(dto: UpdateOrganizationDTO): Promise<Organization> {
		const organization =
			await this.organizationRepository.getOrganizationInfo();

		if (!organization) {
			throw new OrganizationNotCreatedException();
		}

		// Filter out undefined values to avoid overwriting existing data
		const updates: Parameters<typeof organization.updateProfile>[0] = {};
		if (dto.name !== undefined) updates.name = dto.name;
		if (dto.descriptionMarkdown !== undefined)
			updates.descriptionMarkdown = dto.descriptionMarkdown;
		if (dto.imageURL !== undefined)
			updates.imageURL = dto.imageURL ?? undefined;
		if (dto.bannerURL !== undefined)
			updates.bannerURL = dto.bannerURL ?? undefined;

		const updatedOrganization = organization.updateProfile(updates);

		const savedOrganization =
			await this.organizationRepository.update(updatedOrganization);

		return savedOrganization;
	}
}
