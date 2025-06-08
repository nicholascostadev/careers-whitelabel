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
	tags: string[];
}

export interface CreateJobRequest {
	id?: string;
	title: string;
	descriptionMarkdown: string;
	salaryMin?: number | null;
	salaryMax?: number | null;
	workplaceLocation: WorkplaceLocation;
	employmentType: EmploymentType;
	status: JobStatus;
	departmentId: string;
	country: string;
	city: string;
	zipCode?: string | null;
	tags: string[];
	createdAt?: Date;
}

export interface ListJobsResponse {
	jobs: JobWithTags[];
	totalPages: number;
	totalCount: number;
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
	tags?: string[];
	status?: JobStatus;
	departmentId?: string;
}

export interface JobWithTags extends Job {
	tags: JobTag[];
}

export interface JobsRepository {
	create(data: CreateJobRequest): Promise<JobWithTags>;
	findById(id: string): Promise<JobWithTags | null>;
	findMany(data: FindManyJobsRequest, page: number): Promise<ListJobsResponse>;
	update(id: string, data: UpdateJobRequest): Promise<JobWithTags>;
}
