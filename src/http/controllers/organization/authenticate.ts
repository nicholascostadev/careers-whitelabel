import { makeAuthenticateOrganizationService } from "@/services/factories/make-authenticate-organization-service";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const AuthenticateOrganizationBodySchema = z.object({
	password: z.string().min(1, { message: "Password is required" }),
});

export async function authenticateOrganizationController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { password } = AuthenticateOrganizationBodySchema.parse(request.body);

	const authenticateOrganizationService = makeAuthenticateOrganizationService();

	const { organization } = await authenticateOrganizationService.execute({
		password,
	});

	const token = await reply.jwtSign(
		{},
		{
			sign: {
				sub: organization.id,
			},
		},
	);

	const refreshToken = await reply.jwtSign(
		{},
		{
			sign: {
				sub: organization.id,
				expiresIn: "7d",
			},
		},
	);

	return reply
		.setCookie("refreshToken", refreshToken, {
			path: "/",
			secure: true,
			sameSite: true,
			httpOnly: true,
		})
		.status(200)
		.send({
			token,
		});
}
