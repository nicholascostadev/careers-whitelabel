import type { Department, Prisma } from "@prisma/client";

export interface DepartmentsRepository {
	findByName(name: string): Promise<Department | null>;
	findById(id: string): Promise<Department | null>;
	create(data: Prisma.DepartmentUncheckedCreateInput): Promise<Department>;
}
