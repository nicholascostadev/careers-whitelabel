import { db } from "@/lib/infra/database.js";
import { Department } from "@/models/index.js";
import type { DepartmentsRepository } from "../departments-repository.js";

export class PrismaDepartmentsRepository implements DepartmentsRepository {
	async create(department: Department): Promise<Department> {
		// Convert domain model to database entity
		const prismaDepartment = await db.department.create({
			data: {
				id: department.id,
				name: department.name,
			},
		});

		// Convert database entity back to domain model
		return Department.fromData({
			id: prismaDepartment.id,
			name: prismaDepartment.name,
		});
	}

	async findByName(name: string): Promise<Department | null> {
		const prismaDepartment = await db.department.findUnique({
			where: {
				name,
			},
		});

		if (!prismaDepartment) {
			return null;
		}

		// Convert database entity to domain model
		return Department.fromData({
			id: prismaDepartment.id,
			name: prismaDepartment.name,
		});
	}

	async findById(id: string): Promise<Department | null> {
		const prismaDepartment = await db.department.findUnique({
			where: {
				id,
			},
		});

		if (!prismaDepartment) {
			return null;
		}

		// Convert database entity to domain model
		return Department.fromData({
			id: prismaDepartment.id,
			name: prismaDepartment.name,
		});
	}

	async findAll(): Promise<Department[]> {
		const prismaDepartments = await db.department.findMany();

		// Convert database entities to domain models
		return prismaDepartments.map((prismaDepartment) =>
			Department.fromData({
				id: prismaDepartment.id,
				name: prismaDepartment.name,
			}),
		);
	}
}
