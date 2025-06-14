import { DepartmentWithSameNameException } from "@/exceptions/department-with-same-name-exception.js";
import { InMemoryDepartmentsRepository } from "@/repositories/in-memory/in-memory-departments.repository.js";
import { CreateDepartmentService } from "./create-department.js";

describe("Create Department Service", () => {
	let departmentsRepository: InMemoryDepartmentsRepository;
	let createDepartmentService: CreateDepartmentService;

	beforeEach(() => {
		departmentsRepository = new InMemoryDepartmentsRepository();
		createDepartmentService = new CreateDepartmentService(
			departmentsRepository,
		);
	});

	it("should not be able to create a department with same name", async () => {
		await createDepartmentService.execute({
			name: "Software Engineering",
		});

		await expect(
			createDepartmentService.execute({
				name: "Software Engineering",
			}),
		).rejects.toThrow(DepartmentWithSameNameException);
	});

	it("should be able to create a department", async () => {
		const department = await createDepartmentService.execute({
			name: "Software Engineering",
		});

		expect(department).toBeDefined();
		expect(departmentsRepository.items).toHaveLength(1);
		expect(departmentsRepository.items).toEqual([
			expect.objectContaining({
				id: department.id,
				name: "Software Engineering",
			}),
		]);
	});
});
