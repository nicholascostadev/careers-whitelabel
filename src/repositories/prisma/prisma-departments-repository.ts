import { db } from "@/lib/infra/database";
import type { Department, Prisma } from "@prisma/client";
import type { DepartmentsRepository } from "../departments-repository";

export class PrismaDepartmentsRepository implements DepartmentsRepository {
	async create(
		data: Prisma.DepartmentUncheckedCreateInput,
	): Promise<Department> {
		const department = await db.department.create({
			data,
		});

		return department;
	}

	async findByName(name: string): Promise<Department | null> {
		const department = await db.department.findUnique({
			where: {
				name,
			},
		});

		return department ?? null;
	}

	async findById(id: string): Promise<Department | null> {
		const department = await db.department.findUnique({
			where: {
				id,
			},
		});

		return department ?? null;
	}

	async findAll(): Promise<Department[]> {
		const departments = await db.department.findMany();
		return departments;
	}
}
