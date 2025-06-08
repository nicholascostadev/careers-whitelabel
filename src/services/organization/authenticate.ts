import { InvalidPasswordException } from "@/exceptions/invalid-password-exception";
import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created";
import type { OrganizationRepository } from "@/repositories/organization-repository";
import { compare } from "bcryptjs";

interface AuthenticateOrganizationRequest {
	password: string;
}

export class AuthenticateOrganizationService {
	constructor(private organizationRepository: OrganizationRepository) {}

	async execute(data: AuthenticateOrganizationRequest) {
		const organization =
			await this.organizationRepository.getOrganizationInfo();

		if (!organization) {
			throw new OrganizationNotCreatedException();
		}

		const doesPasswordMatch = await compare(
			data.password,
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
