import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifyScalarApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { Exception } from "./exceptions/exception.js";
import { authRoutes } from "./http/controllers/auth/routes.js";
import { departmentRoutes } from "./http/controllers/departments/routes.js";
import { jobsRoutes } from "./http/controllers/jobs/routes.js";
import { organizationRoutes } from "./http/controllers/organization/routes.js";
import { env } from "./lib/env.js";

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
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Careers API",
			description: "API for the Careers app",
			version: "1.0.0",
		},
		servers: [
			{
				url: "http://localhost:8080",
			},
		],
	},
	transform: jsonSchemaTransform,
});

app.get("/openapi.json", () => app.swagger());

app.register(fastifyScalarApiReference, {
	routePrefix: "/docs",
	configuration: {
		title: "Careers API",
		authentication: {
			preferredSecurityScheme: "httpBearer",
			securitySchemes: {
				httpBearer: {
					token: "Bearer <token>",
				},
			},
		},
	},
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(authRoutes, {
	prefix: "/auth",
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

app.setErrorHandler((error, _, reply) => {
	if (env.NODE_ENV !== "production") {
		console.error(error);
	}

	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.code(400).send({
			error: "Response Validation Error",
			message: "Request doesn't match the schema",
			details: {
				issues: error.validation,
				method: reply.request.method,
				url: reply.request.url,
			},
		});
	}

	if (isResponseSerializationError(error)) {
		return reply.code(500).send({
			error: "Internal Server Error",
			message: "Response doesn't match the schema",
			statusCode: 500,
			details: {
				issues: error.cause.issues,
				method: error.method,
				url: error.url,
			},
		});
	}

	if (error instanceof Exception) {
		return reply.code(error.statusCode).send({
			message: error.message,
		});
	}

	return reply.code(500).send({
		message: "Internal server error",
	});
});

await app.register(fastifyScalarApiReference, {
	routePrefix: "/reference",
	// Additional hooks for the API reference routes. You can provide the onRequest and preHandler hooks
	hooks: {
		onRequest: (_, __, done) => {
			done();
		},
		preHandler: (_, __, done) => {
			done();
		},
	},
});

await app.ready();

app.listen({ port: env.PORT }, (error) => {
	if (error) {
		console.error(error);
		process.exit(1);
	}
});
