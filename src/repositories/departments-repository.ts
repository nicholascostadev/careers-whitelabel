import type { Department } from "@/models/index.js";

export interface DepartmentsRepository {
	findByName(name: string): Promise<Department | null>;
	findById(id: string): Promise<Department | null>;
	create(department: Department): Promise<Department>;
	findAll(): Promise<Department[]>;
}
