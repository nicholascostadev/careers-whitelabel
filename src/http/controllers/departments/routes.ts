import { verifyJwt } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { createDepartmentsController } from "./create-departments";

export const departmentRoutes = (app: FastifyInstance) => {
	app.post("/", { preHandler: [verifyJwt] }, createDepartmentsController);
};
