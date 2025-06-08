import { PrismaDepartmentsRepository } from "@/repositories/prisma/prisma-departments-repository";
import { CreateDepartmentService } from "../departments/create-department";

export function makeCreateDepartmentService() {
	const departmentsRepository = new PrismaDepartmentsRepository();
	const createDepartmentService = new CreateDepartmentService(
		departmentsRepository,
	);

	return createDepartmentService;
}
