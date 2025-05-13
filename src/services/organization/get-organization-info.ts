import type { OrganizationRepository } from "@/repositories/organization-repository";

export class GetOrganizationInfoService {
	constructor(private organizationRepository: OrganizationRepository) {}

	async execute() {
		const organizationInfo =
			await this.organizationRepository.getOrganizationInfo();

		return organizationInfo;
	}
}
