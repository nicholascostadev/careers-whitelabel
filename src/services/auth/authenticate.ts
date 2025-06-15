import { InvalidPasswordException } from "@/exceptions/invalid-password-exception.js";
import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created.js";
import type { AuthenticateDTO } from "@/lib/dtos/authenticate.dto.js";
import type { Organization } from "@/models/index.js";
import type { OrganizationRepository } from "@/repositories/organization-repository.js";
import { compare } from "bcryptjs";

export class AuthenticateOrganizationService {
	constructor(private organizationRepository: OrganizationRepository) {}

	async execute(dto: AuthenticateDTO): Promise<{ organization: Organization }> {
		const organization =
			await this.organizationRepository.getOrganizationInfo();

		if (!organization) {
			throw new OrganizationNotCreatedException();
		}

		const doesPasswordMatch = await compare(
			dto.password,
			organization.passwordHash,
		);

		if (!doesPasswordMatch) {
			throw new InvalidPasswordException();
		}

		return {
			organization,
		};
	}
}
