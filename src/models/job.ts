import { z } from "zod/v4";

export const WorkplaceLocationEnum = z.enum(["REMOTE", "HYBRID", "ON_SITE"]);
export const EmploymentTypeEnum = z.enum([
	"FULL_TIME",
	"PART_TIME",
	"INTERNSHIP",
	"CONTRACTOR",
]);
export const JobStatusEnum = z.enum(["OPEN", "CLOSED"]);

export type WorkplaceLocation = z.infer<typeof WorkplaceLocationEnum>;
export type EmploymentType = z.infer<typeof EmploymentTypeEnum>;
export type JobStatus = z.infer<typeof JobStatusEnum>;

export const JobTagSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
});

export type JobTagData = z.infer<typeof JobTagSchema>;

export const JobSchema = z.object({
	id: z.uuid(),
	title: z.string().min(1),
	descriptionMarkdown: z.string().min(1),
	workplaceLocation: WorkplaceLocationEnum,
	country: z.string().min(1),
	city: z.string().min(1),
	zipCode: z.string().optional(),
	employmentType: EmploymentTypeEnum,
	salaryMin: z.number().positive().optional(),
	salaryMax: z.number().positive().optional(),
	status: JobStatusEnum.default("OPEN"),
	departmentId: z.uuid(),
	tags: z.array(JobTagSchema).default([]),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});

export type JobData = z.infer<typeof JobSchema>;

export class JobTag {
	private constructor(private readonly data: JobTagData) {}

	static create(input: Omit<JobTagData, "id">): JobTag {
		const id = crypto.randomUUID();
		const data = JobTagSchema.parse({ ...input, id });
		return new JobTag(data);
	}

	static fromData(data: JobTagData): JobTag {
		const validatedData = JobTagSchema.parse(data);
		return new JobTag(validatedData);
	}

	get id(): string {
		return this.data.id;
	}

	get name(): string {
		return this.data.name;
	}

	toData(): JobTagData {
		return { ...this.data };
	}
}

export class Job {
	private constructor(private readonly data: JobData) {}

	static create(input: Omit<JobData, "id" | "createdAt" | "updatedAt">): Job {
		const id = crypto.randomUUID();
		const now = new Date();
		const data = JobSchema.parse({
			...input,
			id,
			createdAt: now,
			updatedAt: now,
		});
		return new Job(data);
	}

	static fromData(data: JobData): Job {
		const validatedData = JobSchema.parse(data);
		return new Job(validatedData);
	}

	get id(): string {
		return this.data.id;
	}

	get title(): string {
		return this.data.title;
	}

	get descriptionMarkdown(): string {
		return this.data.descriptionMarkdown;
	}

	get workplaceLocation(): WorkplaceLocation {
		return this.data.workplaceLocation;
	}

	get country(): string {
		return this.data.country;
	}

	get city(): string {
		return this.data.city;
	}

	get zipCode(): string | undefined {
		return this.data.zipCode;
	}

	get employmentType(): EmploymentType {
		return this.data.employmentType;
	}

	get salaryMin(): number | undefined {
		return this.data.salaryMin;
	}

	get salaryMax(): number | undefined {
		return this.data.salaryMax;
	}

	get status(): JobStatus {
		return this.data.status;
	}

	get departmentId(): string {
		return this.data.departmentId;
	}

	get tags(): JobTagData[] {
		return this.data.tags;
	}

	get createdAt(): Date {
		return this.data.createdAt;
	}

	get updatedAt(): Date {
		return this.data.updatedAt;
	}

	isOpen(): boolean {
		return this.data.status === "OPEN";
	}

	isClosed(): boolean {
		return this.data.status === "CLOSED";
	}

	close(): Job {
		const updatedData = {
			...this.data,
			status: "CLOSED" as JobStatus,
			updatedAt: new Date(),
		};
		return Job.fromData(updatedData);
	}

	open(): Job {
		const updatedData = {
			...this.data,
			status: "OPEN" as JobStatus,
			updatedAt: new Date(),
		};
		return Job.fromData(updatedData);
	}

	update(updates: {
		title?: string;
		descriptionMarkdown?: string;
		workplaceLocation?: WorkplaceLocation;
		country?: string;
		city?: string;
		zipCode?: string;
		employmentType?: EmploymentType;
		salaryMin?: number;
		salaryMax?: number;
		status?: JobStatus;
	}): Job {
		this.validateSalaryRange(updates.salaryMin, updates.salaryMax);

		const updatedData = {
			...this.data,
			...updates,
			updatedAt: new Date(),
		};
		return Job.fromData(updatedData);
	}

	addTag(tagName: string): Job {
		const existingTag = this.data.tags.find(
			(tag) => tag.name.toLowerCase() === tagName.toLowerCase(),
		);
		if (existingTag) {
			return this; // Tag already exists
		}

		const newTag = JobTag.create({ name: tagName.trim() });
		const updatedData = {
			...this.data,
			tags: [...this.data.tags, newTag.toData()],
			updatedAt: new Date(),
		};
		return Job.fromData(updatedData);
	}

	removeTag(tagName: string): Job {
		const updatedTags = this.data.tags.filter(
			(tag) => tag.name.toLowerCase() !== tagName.toLowerCase(),
		);

		const updatedData = {
			...this.data,
			tags: updatedTags,
			updatedAt: new Date(),
		};
		return Job.fromData(updatedData);
	}

	setTags(tagNames: string[]): Job {
		const uniqueTagNames = [...new Set(tagNames.map((name) => name.trim()))];
		const tags = uniqueTagNames.map((name) => JobTag.create({ name }));

		const updatedData = {
			...this.data,
			tags: tags.map((tag) => tag.toData()),
			updatedAt: new Date(),
		};
		return Job.fromData(updatedData);
	}

	hasSalaryRange(): boolean {
		return (
			this.data.salaryMin !== undefined && this.data.salaryMax !== undefined
		);
	}

	isInSalaryRange(salary: number): boolean {
		if (!this.hasSalaryRange()) {
			return true; // No range specified, so any salary is acceptable
		}

		const min = this.data.salaryMin ?? 0;
		const max = this.data.salaryMax ?? Number.MAX_VALUE;

		return salary >= min && salary <= max;
	}

	private validateSalaryRange(salaryMin?: number, salaryMax?: number): void {
		const min = salaryMin ?? this.data.salaryMin;
		const max = salaryMax ?? this.data.salaryMax;

		if (min !== undefined && max !== undefined && min > max) {
			throw new Error("Minimum salary cannot be greater than maximum salary");
		}
	}

	getFullLocation(): string {
		const parts = [this.data.city, this.data.country];
		if (this.data.zipCode) {
			parts.unshift(this.data.zipCode);
		}
		return parts.join(", ");
	}

	matchesFilters(filters: {
		workplaceLocation?: WorkplaceLocation;
		employmentType?: EmploymentType;
		country?: string;
		city?: string;
		salaryMin?: number;
		salaryMax?: number;
		tags?: string[];
	}): boolean {
		if (
			filters.workplaceLocation &&
			this.data.workplaceLocation !== filters.workplaceLocation
		) {
			return false;
		}

		if (
			filters.employmentType &&
			this.data.employmentType !== filters.employmentType
		) {
			return false;
		}

		if (
			filters.country &&
			this.data.country.toLowerCase() !== filters.country.toLowerCase()
		) {
			return false;
		}

		if (
			filters.city &&
			this.data.city.toLowerCase() !== filters.city.toLowerCase()
		) {
			return false;
		}

		if (
			filters.salaryMin &&
			(!this.data.salaryMax || this.data.salaryMax < filters.salaryMin)
		) {
			return false;
		}

		if (
			filters.salaryMax &&
			(!this.data.salaryMin || this.data.salaryMin > filters.salaryMax)
		) {
			return false;
		}

		if (filters.tags && filters.tags.length > 0) {
			const jobTagNames = this.data.tags.map((tag) => tag.name.toLowerCase());
			const filterTagNames = filters.tags.map((tag) => tag.toLowerCase());
			const hasMatchingTag = filterTagNames.some((filterTag) =>
				jobTagNames.includes(filterTag),
			);
			if (!hasMatchingTag) {
				return false;
			}
		}

		return true;
	}

	toData(): JobData {
		return { ...this.data };
	}

	toJSON(): JobData {
		return this.toData();
	}
}
