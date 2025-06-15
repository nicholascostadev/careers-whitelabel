import { DepartmentWithSameNameException } from "@/exceptions/department-with-same-name-exception.js";
import type { CreateDepartmentDTO } from "@/lib/dtos/create-department.dto.js";
import { Department } from "@/models/index.js";
import type { DepartmentsRepository } from "@/repositories/departments-repository.js";

export class CreateDepartmentService {
	constructor(private departmentsRepository: DepartmentsRepository) {}

	async execute(dto: CreateDepartmentDTO): Promise<Department> {
		const departmentWithSameName = await this.departmentsRepository.findByName(
			dto.name,
		);

		if (departmentWithSameName) {
			throw new DepartmentWithSameNameException();
		}

		// Create Department domain model with validation
		const department = Department.create({
			name: dto.name.trim(),
		});

		// Save using repository (repository handles domain model)
		const createdDepartment =
			await this.departmentsRepository.create(department);

		return createdDepartment;
	}
}
