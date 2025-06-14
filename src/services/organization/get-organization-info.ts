import type { OrganizationRepository } from "@/repositories/organization-repository.js";

export class GetOrganizationInfoService {
	constructor(private organizationRepository: OrganizationRepository) {}

	async execute() {
		const organization =
			await this.organizationRepository.getOrganizationInfo();

		return {
			organization,
		};
	}
}
