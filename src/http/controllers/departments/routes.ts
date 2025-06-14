import { verifyJwt } from "@/http/middlewares/verify-jwt.js";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	CreateDepartmentBodySchema,
	CreateDepartmentResponseSchema,
	createDepartmentsController,
} from "./create-departments.js";
import { getDepartments } from "./get-departments.js";

export const departmentRoutes = (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "get",
		url: "/",
		schema: {
			tags: ["departments"],
		},
		handler: getDepartments,
	});
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "post",
		url: "/",
		preHandler: [verifyJwt],
		schema: {
			tags: ["departments"],
			body: CreateDepartmentBodySchema,
			response: CreateDepartmentResponseSchema,
		},
		handler: createDepartmentsController,
	});
};
