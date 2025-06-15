import type { EmploymentType, Job, WorkplaceLocation } from "@/models/index.js";

export interface FindManyJobsRequest {
	departmentName?: string;
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
	status: string;
	departmentName: string;
	country: string;
	city: string;
	zipCode?: string | null;
	tags: string[];
	createdAt?: Date;
}

export interface ListJobsResponse {
	jobs: Job[];
	totalPages: number;
	totalCount: number;
}

export interface JobsRepository {
	create(job: Job): Promise<Job>;
	findById(id: string): Promise<Job | null>;
	findMany(
		data: FindManyJobsRequest,
		page: number,
		itemsPerPage?: number,
	): Promise<ListJobsResponse>;
	update(job: Job): Promise<Job>;
}
