import type { AuthenticateDTO } from "@/lib/dtos/authenticate.dto.js";
import { generateTokens } from "@/lib/generateTokens.js";
import { makeAuthenticateOrganizationService } from "@/services/factories/make-authenticate-organization-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod/v4";

export const AuthenticateBodySchema = z.object({
	password: z.string().min(1, { message: "Password is required" }),
});
type AuthenticateBody = z.infer<typeof AuthenticateBodySchema>;

export const AuthenticateResponseSchema = {
	200: z.object({
		accessToken: z.string(),
	}),
	401: z.object({
		message: z.string(),
	}),
};

type AuthenticateReplyType = {
	[statusCode in keyof typeof AuthenticateResponseSchema]: z.infer<
		(typeof AuthenticateResponseSchema)[statusCode]
	>;
};

export type AuthenticateRequest = FastifyRequest<{
	Body: AuthenticateBody;
	Reply: AuthenticateReplyType;
}>;

export type AuthenticateReply = FastifyReply<{
	Reply: AuthenticateReplyType;
}>;

export async function authenticateOrganizationController(
	request: AuthenticateRequest,
	reply: AuthenticateReply,
) {
	const { password } = request.body;

	const authenticateDTO: AuthenticateDTO = {
		password,
	};

	const authenticateOrganizationService = makeAuthenticateOrganizationService();

	const { organization } =
		await authenticateOrganizationService.execute(authenticateDTO);

	const { accessToken, refreshToken } = generateTokens({
		organizationId: organization.id,
	});

	reply.setCookie("refreshToken", refreshToken, {
		httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
		secure: false, // Set to true in production with HTTPS for secure transmission
		sameSite: "strict", // Protects against CSRF attacks
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
	});

	return reply.status(200).send({ accessToken });
}
