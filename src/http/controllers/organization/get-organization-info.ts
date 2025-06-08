import { organizationToOrganizationDTO } from "@/lib/dtos/organization";
import { makeGetOrganizationInfoService } from "@/services/factories/make-get-organization-info-service";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getOrganizationInfoController(
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	const getOrganizationInfoService = makeGetOrganizationInfoService();

	const organizationInfo = await getOrganizationInfoService.execute();

	return reply.status(200).send({
		organization: organizationToOrganizationDTO(organizationInfo),
	});
}
