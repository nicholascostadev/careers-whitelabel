import { PrismaDepartmentsRepository } from "@/repositories/prisma/prisma-departments-repository.js";
import { CreateDepartmentService } from "../departments/create-department.js";

export function makeCreateDepartmentService() {
	const departmentsRepository = new PrismaDepartmentsRepository();
	const createDepartmentService = new CreateDepartmentService(
		departmentsRepository,
	);

	return createDepartmentService;
}
