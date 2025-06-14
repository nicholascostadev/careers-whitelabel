import { z } from "zod/v4";

export const OrganizationDtoSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	email: z.string(),
	descriptionMarkdown: z.string().nullish(),
	imageURL: z.string().nullish(),
	bannerURL: z.string().nullish(),
});
