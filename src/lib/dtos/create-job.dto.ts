import { z } from "zod/v4";

export const CreateJobDtoSchema = z.object({
	title: z.string().min(1),
	descriptionMarkdown: z.string().min(1),
	departmentId: z.string().min(1),
	country: z.string().min(1),
	city: z.string().min(1),
	zipCode: z.string().optional(),
	workplaceLocation: z.enum(["REMOTE", "HYBRID", "ON_SITE"]),
	employmentType: z.enum([
		"FULL_TIME",
		"PART_TIME",
		"INTERNSHIP",
		"CONTRACTOR",
	]),
	salaryMin: z.number().positive().optional(),
	salaryMax: z.number().positive().optional(),
	status: z.enum(["OPEN", "CLOSED"]).optional(),
	tags: z.array(z.string()).optional(),
});

export type CreateJobDto = z.infer<typeof CreateJobDtoSchema>;
