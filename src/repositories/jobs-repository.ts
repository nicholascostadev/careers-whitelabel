import type {
	EmploymentType,
	Job,
	JobStatus,
	WorkplaceLocation,
} from "@prisma/client";

export interface FindManyJobsRequest {
	departmentId?: string;
	jobTitle?: string;
	salaryMin?: number;
	salaryMax?: number;
	workplaceLocation?: WorkplaceLocation;
	employmentType?: EmploymentType;
	country?: string;
	city?: string;
	jobTags: string[];
}

export interface CreateJobRequest {
	id?: string;
	title: string;
	descriptionMarkdown: string;
	salaryMin?: number | null;
	salaryMax?: number | null;
	workplaceLocation: WorkplaceLocation;
	employmentType: EmploymentType;
	jobStatus: JobStatus;
	organizationId: string;
	departmentId: string;
	country: string;
	city: string;
	zipCode?: string | null;
	jobTags: string[];
	createdAt?: Date;
}

export interface JobsRepository {
	create(data: CreateJobRequest): Promise<Job>;
	findById(id: string): Promise<Job | null>;
	findMany(
		data: FindManyJobsRequest,
		page: number,
	): Promise<{
		jobs: Job[];
		totalCount: number;
	}>;
}
