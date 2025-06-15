import type { Department } from "@/models/index.js";
import type { DepartmentsRepository } from "../departments-repository.js";

export class InMemoryDepartmentsRepository implements DepartmentsRepository {
	items: Department[] = [];

	async create(department: Department): Promise<Department> {
		// Domain model is already validated, just store it
		this.items.push(department);
		return department;
	}

	async findByName(name: string): Promise<Department | null> {
		return this.items.find((item) => item.name === name) ?? null;
	}

	async findById(id: string): Promise<Department | null> {
		return this.items.find((item) => item.id === id) ?? null;
	}

	async findAll(): Promise<Department[]> {
		return [...this.items];
	}
}
