import { db } from "@/lib/infra/database";
import type { Organization, Prisma } from "@prisma/client";
import type { OrganizationRepository } from "../organization-repository";

export class PrismaOrganizationRepository implements OrganizationRepository {
	async getOrganizationInfo(): Promise<Organization> {
		const organization = await db.organization.findFirstOrThrow();

		return organization;
	}

	async update(
		data: Prisma.OrganizationUncheckedUpdateInput,
	): Promise<Organization> {
		const organization = await this.getOrganizationInfo();

		const updatedOrganization = await db.organization.update({
			where: {
				id: organization.id,
			},
			data,
		});

		return updatedOrganization;
	}
}
