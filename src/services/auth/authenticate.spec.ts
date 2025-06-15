import { InvalidPasswordException } from "@/exceptions/invalid-password-exception.js";
import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created.js";
import type { AuthenticateDTO } from "@/lib/dtos/authenticate.dto.js";
import { Organization } from "@/models/index.js";
import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateOrganizationService } from "./authenticate.js";

describe("Authenticate Organization Service", () => {
	let organizationRepository: InMemoryOrganizationRepository;
	let authenticateOrganizationService: AuthenticateOrganizationService;

	beforeEach(() => {
		organizationRepository = new InMemoryOrganizationRepository();
		authenticateOrganizationService = new AuthenticateOrganizationService(
			organizationRepository,
		);
	});

	it("should authenticate organization with correct password", async () => {
		const password = "test123";
		const passwordHash = await hash(password, 6);

		const organization = Organization.fromData({
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Test Organization",
			email: "test@organization.com",
			passwordHash,
			descriptionMarkdown: undefined,
			imageURL: undefined,
			bannerURL: undefined,
		});

		organizationRepository.setOrganization(organization);

		const authenticateDTO: AuthenticateDTO = {
			password,
		};

		const result =
			await authenticateOrganizationService.execute(authenticateDTO);

		expect(result).toEqual({
			organization: expect.objectContaining({
				id: "550e8400-e29b-41d4-a716-446655440000",
				name: "Test Organization",
				email: "test@organization.com",
			}),
		});
		expect(result.organization).toBeInstanceOf(Organization);
	});

	it("should throw InvalidPasswordException with wrong password", async () => {
		const correctPassword = "test123";
		const wrongPassword = "wrongpassword";
		const passwordHash = await hash(correctPassword, 6);

		const organization = Organization.fromData({
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Test Organization",
			email: "test@organization.com",
			passwordHash,
			descriptionMarkdown: undefined,
			imageURL: undefined,
			bannerURL: undefined,
		});

		organizationRepository.setOrganization(organization);

		const authenticateDTO: AuthenticateDTO = {
			password: wrongPassword,
		};

		await expect(
			authenticateOrganizationService.execute(authenticateDTO),
		).rejects.toThrow(InvalidPasswordException);
	});

	it("should throw OrganizationNotCreatedException when organization does not exist", async () => {
		organizationRepository.setOrganization(null);

		const authenticateDTO: AuthenticateDTO = {
			password: "anypassword",
		};

		await expect(
			authenticateOrganizationService.execute(authenticateDTO),
		).rejects.toThrow(OrganizationNotCreatedException);
	});

	it("should return organization domain model on successful authentication", async () => {
		const password = "test123";
		const passwordHash = await hash(password, 6);

		const organization = Organization.fromData({
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Test Organization",
			email: "test@organization.com",
			passwordHash,
			descriptionMarkdown: "Test description",
			imageURL: "https://example.com/image.jpg",
			bannerURL: "https://example.com/banner.jpg",
		});

		organizationRepository.setOrganization(organization);

		const authenticateDTO: AuthenticateDTO = {
			password,
		};

		const result =
			await authenticateOrganizationService.execute(authenticateDTO);

		expect(result.organization.toData()).toEqual({
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Test Organization",
			email: "test@organization.com",
			passwordHash,
			descriptionMarkdown: "Test description",
			imageURL: "https://example.com/image.jpg",
			bannerURL: "https://example.com/banner.jpg",
		});
	});

	it("should work with organization that has minimal data", async () => {
		const password = "test123";
		const passwordHash = await hash(password, 6);

		const organization = Organization.fromData({
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Minimal Organization",
			email: "minimal@organization.com",
			passwordHash,
			descriptionMarkdown: undefined,
			imageURL: undefined,
			bannerURL: undefined,
		});

		organizationRepository.setOrganization(organization);

		const authenticateDTO: AuthenticateDTO = {
			password,
		};

		const result =
			await authenticateOrganizationService.execute(authenticateDTO);

		expect(result.organization.toData()).toEqual({
			id: "550e8400-e29b-41d4-a716-446655440000",
			name: "Minimal Organization",
			email: "minimal@organization.com",
			passwordHash,
			descriptionMarkdown: undefined,
			imageURL: undefined,
			bannerURL: undefined,
		});
	});
});
