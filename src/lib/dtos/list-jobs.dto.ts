import type { EmploymentType, WorkplaceLocation } from "@prisma/client";

export type ListJobsDTO = {
	page: number;
	itemsPerPage?: number;
	departmentName?: string;
	jobTitle?: string;
	salaryMin?: number;
	salaryMax?: number;
	workplaceLocation?: WorkplaceLocation;
	employmentType?: EmploymentType;
	country?: string;
	city?: string;
	tags?: string[];
};
