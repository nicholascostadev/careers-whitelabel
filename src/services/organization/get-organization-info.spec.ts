import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository.js";
import { GetOrganizationInfoService } from "./get-organization-info.js";

describe("Get Organization Info Service", () => {
	let organizationRepository: InMemoryOrganizationRepository;
	let getOrganizationInfoService: GetOrganizationInfoService;

	beforeEach(() => {
		organizationRepository = new InMemoryOrganizationRepository();
		getOrganizationInfoService = new GetOrganizationInfoService(
			organizationRepository,
		);
	});

	it("should return the organization info", async () => {
		const organizationInfo = await getOrganizationInfoService.execute();

		expect(organizationInfo).toEqual(
			expect.objectContaining({
				organization: expect.objectContaining({
					id: "550e8400-e29b-41d4-a716-446655440000",
					name: "Default Organization",
					email: "test@organization.com",
				}),
			}),
		);
	});
});
