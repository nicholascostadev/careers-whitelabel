import { z } from "zod/v4";

export const JobApplicationStatusEnum = z.enum([
	"PENDING",
	"REVIEWING",
	"INTERVIEWING",
	"HIRED",
	"REJECTED",
]);

export type JobApplicationStatus = z.infer<typeof JobApplicationStatusEnum>;

export const JobApplicationSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	phone: z.string().optional(),
	resumeURL: z.url().optional(),
	jobId: z.uuid(),
	status: JobApplicationStatusEnum.default("PENDING"),
	createdAt: z.date().default(() => new Date()),
});

export type JobApplicationData = z.infer<typeof JobApplicationSchema>;

export class JobApplication {
	private constructor(private readonly data: JobApplicationData) {}

	static create(
		input: Omit<JobApplicationData, "id" | "createdAt">,
	): JobApplication {
		const id = crypto.randomUUID();
		const data = JobApplicationSchema.parse({
			...input,
			id,
			createdAt: new Date(),
		});
		return new JobApplication(data);
	}

	static fromData(data: JobApplicationData): JobApplication {
		const validatedData = JobApplicationSchema.parse(data);
		return new JobApplication(validatedData);
	}

	get id(): string {
		return this.data.id;
	}

	get email(): string {
		return this.data.email;
	}

	get firstName(): string {
		return this.data.firstName;
	}

	get lastName(): string {
		return this.data.lastName;
	}

	get fullName(): string {
		return `${this.data.firstName} ${this.data.lastName}`;
	}

	get phone(): string | undefined {
		return this.data.phone;
	}

	get resumeURL(): string | undefined {
		return this.data.resumeURL;
	}

	get jobId(): string {
		return this.data.jobId;
	}

	get status(): JobApplicationStatus {
		return this.data.status;
	}

	get createdAt(): Date {
		return this.data.createdAt;
	}

	isPending(): boolean {
		return this.data.status === "PENDING";
	}

	isReviewing(): boolean {
		return this.data.status === "REVIEWING";
	}

	isInterviewing(): boolean {
		return this.data.status === "INTERVIEWING";
	}

	isHired(): boolean {
		return this.data.status === "HIRED";
	}

	isRejected(): boolean {
		return this.data.status === "REJECTED";
	}

	startReview(): JobApplication {
		if (this.data.status !== "PENDING") {
			throw new Error("Can only start review from pending status");
		}

		const updatedData = {
			...this.data,
			status: "REVIEWING" as JobApplicationStatus,
		};
		return JobApplication.fromData(updatedData);
	}

	startInterview(): JobApplication {
		if (this.data.status !== "REVIEWING") {
			throw new Error("Can only start interview from reviewing status");
		}

		const updatedData = {
			...this.data,
			status: "INTERVIEWING" as JobApplicationStatus,
		};
		return JobApplication.fromData(updatedData);
	}

	hire(): JobApplication {
		if (!["REVIEWING", "INTERVIEWING"].includes(this.data.status)) {
			throw new Error("Can only hire from reviewing or interviewing status");
		}

		const updatedData = {
			...this.data,
			status: "HIRED" as JobApplicationStatus,
		};
		return JobApplication.fromData(updatedData);
	}

	reject(): JobApplication {
		if (this.data.status === "HIRED") {
			throw new Error("Cannot reject a hired candidate");
		}

		if (this.data.status === "REJECTED") {
			return this; // Already rejected
		}

		const updatedData = {
			...this.data,
			status: "REJECTED" as JobApplicationStatus,
		};
		return JobApplication.fromData(updatedData);
	}

	updateContactInfo(updates: {
		firstName?: string;
		lastName?: string;
		phone?: string;
		resumeURL?: string;
	}): JobApplication {
		const updatedData = {
			...this.data,
			...updates,
		};
		return JobApplication.fromData(updatedData);
	}

	hasResume(): boolean {
		return this.data.resumeURL !== undefined;
	}

	hasPhone(): boolean {
		return this.data.phone !== undefined;
	}

	canTransitionTo(newStatus: JobApplicationStatus): boolean {
		const validTransitions: Record<
			JobApplicationStatus,
			JobApplicationStatus[]
		> = {
			PENDING: ["REVIEWING", "REJECTED"],
			REVIEWING: ["INTERVIEWING", "HIRED", "REJECTED"],
			INTERVIEWING: ["HIRED", "REJECTED"],
			HIRED: [],
			REJECTED: [],
		};

		return validTransitions[this.data.status].includes(newStatus);
	}

	updateStatus(newStatus: JobApplicationStatus): JobApplication {
		if (!this.canTransitionTo(newStatus)) {
			throw new Error(
				`Invalid status transition from ${this.data.status} to ${newStatus}`,
			);
		}

		const updatedData = {
			...this.data,
			status: newStatus,
		};
		return JobApplication.fromData(updatedData);
	}

	toData(): JobApplicationData {
		return { ...this.data };
	}

	toJSON(): JobApplicationData {
		return this.toData();
	}
}
