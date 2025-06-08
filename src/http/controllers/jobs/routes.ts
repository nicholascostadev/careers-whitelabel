import { verifyJwt } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { applyToJobController } from "./apply-to-job";
import { createJobController } from "./create-job";
import { getJobInfoController } from "./get-job-info";
import { listJobsController } from "./list-jobs";
import { updateJobController } from "./update-job";

export function jobsRoutes(app: FastifyInstance) {
	app.post("/", { preHandler: [verifyJwt] }, createJobController);
	app.get("/", listJobsController);
	app.put("/:id", { preHandler: [verifyJwt] }, updateJobController);
	app.get("/:id", getJobInfoController);
	app.post("/:id/apply", { preHandler: [verifyJwt] }, applyToJobController);
}
