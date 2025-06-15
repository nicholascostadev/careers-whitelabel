import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created.js";
import type { OrganizationRepository } from "@/repositories/organization-repository.js";

export class GetOrganizationInfoService {
	constructor(private organizationRepository: OrganizationRepository) {}

	async execute() {
		const organization =
			await this.organizationRepository.getOrganizationInfo();

		if (!organization) {
			throw new OrganizationNotCreatedException();
		}

		return {
			organization,
		};
	}
}
