import { ExceptionSchema } from "@/exceptions/exceptionSchema.js";
import { OrganizationDtoSchema } from "@/lib/dtos/organization.js";
import { makeGetOrganizationInfoService } from "@/services/factories/make-get-organization-info-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod/v4";

export const GetOrganizationInfoResponseSchema = {
	200: z.object({
		organization: OrganizationDtoSchema,
	}),
	404: ExceptionSchema,
};

type GetOrganizationInfoReplyType = {
	[statusCode in keyof typeof GetOrganizationInfoResponseSchema]: z.infer<
		(typeof GetOrganizationInfoResponseSchema)[statusCode]
	>;
};

export type GetOrganizationInfoRequest = FastifyRequest<{
	Reply: GetOrganizationInfoReplyType;
}>;

export type GetOrganizationInfoReply = FastifyReply<{
	Reply: GetOrganizationInfoReplyType;
}>;

export async function getOrganizationInfoController(
	_: GetOrganizationInfoRequest,
	reply: GetOrganizationInfoReply,
) {
	const getOrganizationInfoService = makeGetOrganizationInfoService();

	const { organization } = await getOrganizationInfoService.execute();

	return reply.status(200).send({
		organization,
	});
}
