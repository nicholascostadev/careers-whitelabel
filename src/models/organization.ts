import { z } from "zod/v4";

export const OrganizationSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	passwordHash: z.string().min(1),
	name: z.string().min(1),
	descriptionMarkdown: z.string().optional(),
	imageURL: z.url().optional(),
	bannerURL: z.url().optional(),
});

export type OrganizationData = z.infer<typeof OrganizationSchema>;

export class Organization {
	private constructor(private readonly data: OrganizationData) {}

	static create(input: Omit<OrganizationData, "id">): Organization {
		const id = crypto.randomUUID();
		const data = OrganizationSchema.parse({ ...input, id });
		return new Organization(data);
	}

	static fromData(data: OrganizationData): Organization {
		const validatedData = OrganizationSchema.parse(data);
		return new Organization(validatedData);
	}

	get id(): string {
		return this.data.id;
	}

	get email(): string {
		return this.data.email;
	}

	get passwordHash(): string {
		return this.data.passwordHash;
	}

	get name(): string {
		return this.data.name;
	}

	get descriptionMarkdown(): string | undefined {
		return this.data.descriptionMarkdown;
	}

	get imageURL(): string | undefined {
		return this.data.imageURL;
	}

	get bannerURL(): string | undefined {
		return this.data.bannerURL;
	}

	updateProfile(data: {
		name?: string;
		descriptionMarkdown?: string;
		imageURL?: string;
		bannerURL?: string;
	}): Organization {
		const updatedData = {
			...this.data,
			...data,
		};
		return Organization.fromData(updatedData);
	}

	updatePassword(newPasswordHash: string): Organization {
		const updatedData = {
			...this.data,
			passwordHash: newPasswordHash,
		};
		return Organization.fromData(updatedData);
	}

	toData(): OrganizationData {
		return { ...this.data };
	}

	toJSON(): OrganizationData {
		return this.toData();
	}
}
