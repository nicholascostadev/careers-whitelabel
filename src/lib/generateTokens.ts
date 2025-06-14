import { app } from "@/app.js";
import { randomUUID } from "node:crypto";

interface GenerateTokenParams {
	organizationId: string;
}
export function generateTokens({ organizationId }: GenerateTokenParams) {
	const accessToken = app.jwt.sign(
		{ type: "access", id: randomUUID() },
		{
			sub: organizationId,
			expiresIn: "15m",
		},
	);

	const refreshToken = app.jwt.sign(
		{ type: "refresh", id: randomUUID() },
		{
			sub: organizationId,
			expiresIn: "30d",
		},
	);

	return {
		accessToken,
		refreshToken,
	};
}
