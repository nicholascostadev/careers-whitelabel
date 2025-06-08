import "dotenv/config";
import z from "zod";

const _env = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.number().default(8080),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	ORGANIZATION_ID: z.string().uuid(),
});

const parsedEnv = _env.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("Invalid environment variables", parsedEnv.error.format());
	process.exit(1);
}

export const env = parsedEnv.data;
