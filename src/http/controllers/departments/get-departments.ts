import { makeGetDepartmentsService } from "@/services/factories/make-get-departments-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getDepartments(
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	const getDepartmentsService = makeGetDepartmentsService();

	const { departments } = await getDepartmentsService.execute();

	return reply.status(200).send({
		departments,
	});
}
