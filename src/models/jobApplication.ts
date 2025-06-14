import { z } from "zod/v4";

export const JobApplicationSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string().optional(),
	resumeURL: z.url().optional(),
	jobId: z.uuid(),
	status: z
		.enum(["PENDING", "REVIEWING", "INTERVIEWING", "HIRED", "REJECTED"])
		.default("PENDING"),
	createdAt: z.date(),
});

export type JobApplication = z.infer<typeof JobApplicationSchema>;

export function jobApplicationToJobApplicationDTO(
	jobApplication: JobApplication,
) {
	return {
		id: jobApplication.id,
		email: jobApplication.email,
		firstName: jobApplication.firstName,
		lastName: jobApplication.lastName,
		phone: jobApplication.phone,
		resumeURL: jobApplication.resumeURL,
		jobId: jobApplication.jobId,
		status: jobApplication.status,
		createdAt: jobApplication.createdAt,
	};
}
