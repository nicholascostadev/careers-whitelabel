import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created";
import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateOrganizationService } from "./update-organization";

describe("Update Organization Service", () => {
	let organizationRepository: InMemoryOrganizationRepository;
	let updateOrganizationService: UpdateOrganizationService;

	beforeEach(() => {
		organizationRepository = new InMemoryOrganizationRepository();
		updateOrganizationService = new UpdateOrganizationService(
			organizationRepository,
		);
	});

	it("should be able to update organization name", async () => {
		const updatedOrganization = await updateOrganizationService.execute({
			name: "Updated Organization",
		});

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				name: "Updated Organization",
			}),
		);
	});

	it("should be able to update organization description", async () => {
		const updatedOrganization = await updateOrganizationService.execute({
			descriptionMarkdown: "Updated description",
		});

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				descriptionMarkdown: "Updated description",
			}),
		);
	});

	it("should be able to update organization image URL", async () => {
		const updatedOrganization = await updateOrganizationService.execute({
			imageURL: "https://example.com/new-image.jpg",
		});

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				imageURL: "https://example.com/new-image.jpg",
			}),
		);
	});

	it("should be able to update organization banner URL", async () => {
		const updatedOrganization = await updateOrganizationService.execute({
			bannerURL: "https://example.com/new-banner.jpg",
		});

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				bannerURL: "https://example.com/new-banner.jpg",
			}),
		);
	});

	it("should be able to remove image URL by setting it to null", async () => {
		// First set an image URL
		await updateOrganizationService.execute({
			imageURL: "https://example.com/image.jpg",
		});

		const updatedOrganization = await updateOrganizationService.execute({
			imageURL: null,
		});

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				imageURL: null,
			}),
		);
	});

	it("should be able to remove banner URL by setting it to null", async () => {
		// First set a banner URL
		await updateOrganizationService.execute({
			bannerURL: "https://example.com/banner.jpg",
		});

		const updatedOrganization = await updateOrganizationService.execute({
			bannerURL: null,
		});

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				bannerURL: null,
			}),
		);
	});

	it("should be able to update multiple fields at once", async () => {
		const updatedOrganization = await updateOrganizationService.execute({
			name: "Updated Organization",
			descriptionMarkdown: "Updated description",
			imageURL: "https://example.com/new-image.jpg",
			bannerURL: "https://example.com/new-banner.jpg",
		});

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				name: "Updated Organization",
				descriptionMarkdown: "Updated description",
				imageURL: "https://example.com/new-image.jpg",
				bannerURL: "https://example.com/new-banner.jpg",
			}),
		);
	});

	it("should preserve unmodified fields", async () => {
		const originalOrganization =
			await organizationRepository.getOrganizationInfo();
		const updatedOrganization = await updateOrganizationService.execute({
			name: "Updated Organization",
		});

		expect(updatedOrganization).toEqual({
			...originalOrganization,
			name: "Updated Organization",
		});
	});

	it("should not be able to update organization if it does not exist", async () => {
		organizationRepository.setOrganization(null);

		await expect(
			updateOrganizationService.execute({
				name: "Updated Organization",
			}),
		).rejects.toThrow(OrganizationNotCreatedException);
	});
});
