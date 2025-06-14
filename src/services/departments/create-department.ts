import { DepartmentWithSameNameException } from "@/exceptions/department-with-same-name-exception.js";
import type { DepartmentsRepository } from "@/repositories/departments-repository.js";

interface CreateDepartmentRequest {
	name: string;
}

export class CreateDepartmentService {
	constructor(private departmentsRepository: DepartmentsRepository) {}

	async execute(data: CreateDepartmentRequest) {
		const departmentWithSameName = await this.departmentsRepository.findByName(
			data.name,
		);

		if (departmentWithSameName) {
			throw new DepartmentWithSameNameException();
		}

		const createdDepartment = await this.departmentsRepository.create(data);

		return createdDepartment;
	}
}
