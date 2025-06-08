import type { Department, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import type { DepartmentsRepository } from "../departments-repository";

export class InMemoryDepartmentsRepository implements DepartmentsRepository {
	items: Department[] = [];

	async create({ id, ...data }: Prisma.DepartmentUncheckedCreateInput) {
		const department = {
			id: id ?? randomUUID(),
			...data,
		};

		this.items.push(department);

		return department;
	}

	async findByName(name: string) {
		return this.items.find((item) => item.name === name) ?? null;
	}

	async findById(id: string) {
		return this.items.find((item) => item.id === id) ?? null;
	}
}
