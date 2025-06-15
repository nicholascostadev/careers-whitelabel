export type ApplyToJobDTO = {
	jobId: string;
	applicantFirstName: string;
	applicantLastName: string;
	applicantEmail: string;
	applicantPhone?: string;
	applicantResumeUrl?: string;
};
