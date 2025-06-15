import { z } from "zod/v4";

export const DepartmentDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
});
