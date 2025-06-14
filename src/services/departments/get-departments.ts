import type { DepartmentsRepository } from "@/repositories/departments-repository.js";

export class GetDepartmentsService {
	constructor(private departmentsRepository: DepartmentsRepository) {}

	async execute() {
		const departments = await this.departmentsRepository.findAll();

		return { departments };
	}
}
