import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { ZodError } from "zod";
import { Exception } from "./exceptions/exception";
import { departmentRoutes } from "./http/controllers/departments/routes";
import { jobsRoutes } from "./http/controllers/jobs/routes";
import { organizationRoutes } from "./http/controllers/organization/routes";
import { env } from "./lib/env";

export const app = fastify({
	logger: true,
});

app.register(cors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
});
app.register(fastifyCookie);

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false,
	},
	sign: {
		expiresIn: "10m",
	},
});

app.register(organizationRoutes, {
	prefix: "/organization",
});
app.register(departmentRoutes, {
	prefix: "/departments",
});
app.register(jobsRoutes, {
	prefix: "/jobs",
});

app.listen({ port: env.PORT }, (error) => {
	if (error) {
		console.error(error);
		process.exit(1);
	}
});

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Validation error",
			issues: error.errors,
		});
	}

	if (error instanceof Exception) {
		return reply.status(error.statusCode).send({
			message: error.message,
		});
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	}

	return reply.status(500).send({
		message: "Internal server error",
	});
});
