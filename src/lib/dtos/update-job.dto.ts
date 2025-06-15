import type {
	EmploymentType,
	JobStatus,
	WorkplaceLocation,
} from "@prisma/client";

export type UpdateJobDTO = {
	id: string;
	title?: string;
	descriptionMarkdown?: string;
	departmentId?: string;
	country?: string;
	city?: string;
	workplaceLocation?: WorkplaceLocation;
	employmentType?: EmploymentType;
	salaryMin?: number;
	salaryMax?: number;
	status?: JobStatus;
	tags?: string[];
	zipCode?: string;
};
