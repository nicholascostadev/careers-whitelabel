import { EmploymentType, JobStatus, WorkplaceLocation } from "@prisma/client";
import { z } from "zod/v4";

export const JobDtoSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	descriptionMarkdown: z.string(),
	departmentId: z.uuid(),
	country: z.string(),
	city: z.string(),
	workplaceLocation: z.enum(WorkplaceLocation),
	employmentType: z.enum(EmploymentType),
	salaryMin: z.number().nullish(),
	salaryMax: z.number().nullish(),
	status: z.enum(JobStatus),
	tags: z.array(
		z.object({
			id: z.uuid(),
			name: z.string(),
		}),
	),
	createdAt: z.date(),
	updatedAt: z.date(),
});
