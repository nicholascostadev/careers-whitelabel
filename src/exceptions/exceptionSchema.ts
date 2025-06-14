import { z } from "zod/v4";

export const ExceptionSchema = z.object({
	message: z.string(),
});

export type Exception = z.infer<typeof ExceptionSchema>;
