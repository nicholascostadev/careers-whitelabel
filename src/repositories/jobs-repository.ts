import type {
	EmploymentType,
	Job,
	JobStatus,
	JobTag,
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
	departmentId: string;
	country: string;
	city: string;
	zipCode?: string | null;
	jobTags: string[];
	createdAt?: Date;
}

export interface UpdateJobRequest {
	title?: string;
	descriptionMarkdown?: string;
	salaryMin?: number | null;
	salaryMax?: number | null;
	workplaceLocation?: WorkplaceLocation;
	employmentType?: EmploymentType;
	country?: string;
	city?: string;
	zipCode?: string | null;
	jobTags?: string[];
	jobStatus?: JobStatus;
}

export interface JobWithTags extends Job {
	jobTags: JobTag[];
}

export interface JobsRepository {
	create(data: CreateJobRequest): Promise<JobWithTags>;
	findById(id: string): Promise<JobWithTags | null>;
	findMany(
		data: FindManyJobsRequest,
		page: number,
	): Promise<{
		jobs: JobWithTags[];
		totalCount: number;
	}>;
	update(id: string, data: UpdateJobRequest): Promise<JobWithTags>;
}
