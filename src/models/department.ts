import { z } from "zod/v4";

export const DepartmentSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
});

export type DepartmentData = z.infer<typeof DepartmentSchema>;

export class Department {
	private constructor(private readonly data: DepartmentData) {}

	static create(input: Omit<DepartmentData, "id">): Department {
		const id = crypto.randomUUID();
		const data = DepartmentSchema.parse({ ...input, id });
		return new Department(data);
	}

	static fromData(data: DepartmentData): Department {
		const validatedData = DepartmentSchema.parse(data);
		return new Department(validatedData);
	}

	get id(): string {
		return this.data.id;
	}

	get name(): string {
		return this.data.name;
	}

	updateName(newName: string): Department {
		if (newName.trim() === "") {
			throw new Error("Department name cannot be empty");
		}

		const updatedData = {
			...this.data,
			name: newName.trim(),
		};
		return Department.fromData(updatedData);
	}

	isEqual(other: Department): boolean {
		return this.data.id === other.data.id;
	}

	toData(): DepartmentData {
		return { ...this.data };
	}

	toJSON(): DepartmentData {
		return this.toData();
	}
}
