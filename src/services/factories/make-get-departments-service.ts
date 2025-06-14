import { PrismaDepartmentsRepository } from "@/repositories/prisma/prisma-departments-repository.js";
import { GetDepartmentsService } from "../departments/get-departments.js";

export function makeGetDepartmentsService() {
	const departmentsRepository = new PrismaDepartmentsRepository();
	const getDepartmentsService = new GetDepartmentsService(
		departmentsRepository,
	);

	return getDepartmentsService;
}
