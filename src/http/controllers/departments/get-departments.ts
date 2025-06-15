import { DepartmentDtoSchema } from "@/lib/dtos/department.js";
import { makeGetDepartmentsService } from "@/services/factories/make-get-departments-service.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod/v4";

export const GetDepartmentsResponseSchema = {
	200: z.object({
		departments: z.array(DepartmentDtoSchema),
	}),
};

type GetDepartmentsReplyType = {
	[statusCode in keyof typeof GetDepartmentsResponseSchema]: z.infer<
		(typeof GetDepartmentsResponseSchema)[statusCode]
	>;
};

export type GetDepartmentsRequest = FastifyRequest<{
	Reply: GetDepartmentsReplyType;
}>;

export type GetDepartmentsReply = FastifyReply<{
	Reply: GetDepartmentsReplyType;
}>;

export async function getDepartments(
	_request: GetDepartmentsRequest,
	reply: GetDepartmentsReply,
) {
	const getDepartmentsService = makeGetDepartmentsService();

	const { departments } = await getDepartmentsService.execute();

	return reply.status(200).send({
		departments,
	});
}
