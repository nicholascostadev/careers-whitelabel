import fastify from "fastify";
import { env } from "./lib/env";

export const app = fastify({
	logger: true,
});

app.get("/", async (_request, reply) => {
	return reply.send({ message: "Hello World" });
});

app.listen({ port: env.PORT }, (error) => {
	if (error) {
		console.error(error);
		process.exit(1);
	}
});
