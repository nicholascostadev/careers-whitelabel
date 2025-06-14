import { verifyJwt } from "@/http/middlewares/verify-jwt.js";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	ApplyToJobBodySchema,
	ApplyToJobResponseSchema,
	applyToJobController,
} from "./apply-to-job.js";
import {
	CreateJobBodySchema,
	CreateJobResponseSchema,
	createJobController,
} from "./create-job.js";
import {
	GetJobInfoResponseSchema,
	getJobInfoController,
} from "./get-job-info.js";
import {
	ListJobsQuerySchema,
	ListJobsResponseSchema,
	listJobsController,
} from "./list-jobs.js";
import {
	UpdateJobBodySchema,
	UpdateJobParamsSchema,
	UpdateJobResponseSchema,
	updateJobController,
} from "./update-job.js";

export function jobsRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "post",
		url: "/",
		preHandler: [verifyJwt],
		schema: {
			tags: ["jobs"],
			body: CreateJobBodySchema,
			response: CreateJobResponseSchema,
		},
		handler: createJobController,
	});

	app.withTypeProvider<ZodTypeProvider>().route({
		method: "get",
		url: "/",
		schema: {
			tags: ["jobs"],
			query: ListJobsQuerySchema,
			response: ListJobsResponseSchema,
		},
		handler: listJobsController,
	});

	app.withTypeProvider<ZodTypeProvider>().route({
		method: "get",
		url: "/:id",
		schema: {
			tags: ["jobs"],
			response: GetJobInfoResponseSchema,
		},
		handler: getJobInfoController,
	});

	app.withTypeProvider<ZodTypeProvider>().route({
		method: "put",
		url: "/:id",
		preHandler: [verifyJwt],
		schema: {
			tags: ["jobs"],
			params: UpdateJobParamsSchema,
			body: UpdateJobBodySchema,
			response: UpdateJobResponseSchema,
		},
		handler: updateJobController,
	});

	app.withTypeProvider<ZodTypeProvider>().route({
		method: "post",
		url: "/:id/apply",
		preHandler: [verifyJwt],
		schema: {
			tags: ["jobs"],
			body: ApplyToJobBodySchema,
			response: ApplyToJobResponseSchema,
		},
		handler: applyToJobController,
	});
}
