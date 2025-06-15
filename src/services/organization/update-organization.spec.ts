import { OrganizationNotCreatedException } from "@/exceptions/organization-not-created.js";
import type { UpdateOrganizationDTO } from "@/lib/dtos/update-organization.dto.js";
import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateOrganizationService } from "./update-organization.js";

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
		const updateOrganizationDTO: UpdateOrganizationDTO = {
			name: "Updated Organization",
		};

		const updatedOrganization = await updateOrganizationService.execute(
			updateOrganizationDTO,
		);

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				name: "Updated Organization",
			}),
		);
	});

	it("should be able to update organization description", async () => {
		const updateOrganizationDTO: UpdateOrganizationDTO = {
			descriptionMarkdown: "Updated description",
		};

		const updatedOrganization = await updateOrganizationService.execute(
			updateOrganizationDTO,
		);

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				descriptionMarkdown: "Updated description",
			}),
		);
	});

	it("should be able to update organization image URL", async () => {
		const updateOrganizationDTO: UpdateOrganizationDTO = {
			imageURL: "https://example.com/new-image.jpg",
		};

		const updatedOrganization = await updateOrganizationService.execute(
			updateOrganizationDTO,
		);

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				imageURL: "https://example.com/new-image.jpg",
			}),
		);
	});

	it("should be able to update organization banner URL", async () => {
		const updateOrganizationDTO: UpdateOrganizationDTO = {
			bannerURL: "https://example.com/new-banner.jpg",
		};

		const updatedOrganization = await updateOrganizationService.execute(
			updateOrganizationDTO,
		);

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				bannerURL: "https://example.com/new-banner.jpg",
			}),
		);
	});

	it("should be able to remove image URL by setting it to null", async () => {
		// First set an image URL
		const setImageDTO: UpdateOrganizationDTO = {
			imageURL: "https://example.com/image.jpg",
		};
		await updateOrganizationService.execute(setImageDTO);

		const removeImageDTO: UpdateOrganizationDTO = {
			imageURL: null,
		};
		const updatedOrganization =
			await updateOrganizationService.execute(removeImageDTO);

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				imageURL: undefined,
			}),
		);
	});

	it("should be able to remove banner URL by setting it to null", async () => {
		// First set a banner URL
		const setBannerDTO: UpdateOrganizationDTO = {
			bannerURL: "https://example.com/banner.jpg",
		};
		await updateOrganizationService.execute(setBannerDTO);

		const removeBannerDTO: UpdateOrganizationDTO = {
			bannerURL: null,
		};
		const updatedOrganization =
			await updateOrganizationService.execute(removeBannerDTO);

		expect(updatedOrganization).toEqual(
			expect.objectContaining({
				bannerURL: undefined,
			}),
		);
	});

	it("should be able to update multiple fields at once", async () => {
		const updateOrganizationDTO: UpdateOrganizationDTO = {
			name: "Updated Organization",
			descriptionMarkdown: "Updated description",
			imageURL: "https://example.com/new-image.jpg",
			bannerURL: "https://example.com/new-banner.jpg",
		};

		const updatedOrganization = await updateOrganizationService.execute(
			updateOrganizationDTO,
		);

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

		const updateOrganizationDTO: UpdateOrganizationDTO = {
			name: "Updated Organization",
		};
		const updatedOrganization = await updateOrganizationService.execute(
			updateOrganizationDTO,
		);

		expect(updatedOrganization.toData()).toEqual({
			...originalOrganization?.toData(),
			name: "Updated Organization",
		});
	});

	it("should not be able to update organization if it does not exist", async () => {
		organizationRepository.setOrganization(null);

		const updateOrganizationDTO: UpdateOrganizationDTO = {
			name: "Updated Organization",
		};

		await expect(
			updateOrganizationService.execute(updateOrganizationDTO),
		).rejects.toThrow(OrganizationNotCreatedException);
	});
});
