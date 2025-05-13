import { InMemoryOrganizationRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { GetOrganizationInfoService } from "./get-organization-info";

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

		expect(organizationInfo).toEqual(organizationRepository.data);
	});
});
