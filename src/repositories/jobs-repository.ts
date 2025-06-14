import type {
	Department,
	EmploymentType,
	Job,
	JobStatus,
	JobTag,
	WorkplaceLocation,
} from "@prisma/client";

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
	status: JobStatus;
	departmentName: string;
	country: string;
	city: string;
	zipCode?: string | null;
	tags: string[];
	createdAt?: Date;
}

export interface ListJobsResponse {
	jobs: JobWithTagsAndDepartment[];
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
	departmentName?: string;
}

export interface JobWithTagsAndDepartment extends Job {
	tags: JobTag[];
	department: Department;
}

export interface JobsRepository {
	create(data: CreateJobRequest): Promise<JobWithTagsAndDepartment>;
	findById(id: string): Promise<JobWithTagsAndDepartment | null>;
	findMany(data: FindManyJobsRequest, page: number): Promise<ListJobsResponse>;
	update(id: string, data: UpdateJobRequest): Promise<JobWithTagsAndDepartment>;
}
