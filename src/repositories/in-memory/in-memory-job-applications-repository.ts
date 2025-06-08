import {
	type JobApplication,
	JobApplicationStatus,
	type Prisma,
} from "@prisma/client";
import { randomUUID } from "node:crypto";
import type { JobApplicationsRepository } from "../job-application-repository";

export class InMemoryJobApplicationsRepository
	implements JobApplicationsRepository
{
	items: JobApplication[] = [];

	async create({
		id,
		createdAt,
		...data
	}: Prisma.JobApplicationUncheckedCreateInput) {
		const jobApplication = {
			id: randomUUID(),
			createdAt: new Date(),
			status: data.status ?? JobApplicationStatus.PENDING,
			phone: data.phone ?? null,
			resumeURL: data.resumeURL ?? null,
			...data,
		};

		this.items.push(jobApplication);

		return jobApplication;
	}

	async findByApplicantEmailAndJobId(
		applicantEmail: string,
		jobId: string,
	): Promise<JobApplication | null> {
		const jobApplication = this.items.find(
			(item) => item.email === applicantEmail && item.jobId === jobId,
		);

		if (!jobApplication) {
			return null;
		}

		return jobApplication;
	}
}
