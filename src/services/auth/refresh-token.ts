import { app } from "@/app.js";
import { UnauthorizedException } from "@/exceptions/unauthorized-exception.js";
import type { RefreshTokenDTO } from "@/lib/dtos/refresh-token.dto.js";
import { generateTokens } from "@/lib/generateTokens.js";

export class RefreshTokenService {
	async execute(
		dto: RefreshTokenDTO,
	): Promise<{ accessToken: string; refreshToken: string }> {
		try {
			// Verify the refresh token
			const { sub: organizationId } = app.jwt.verify(dto.refreshToken) as {
				sub: string;
			};

			// Generate new tokens
			const { accessToken, refreshToken } = generateTokens({
				organizationId,
			});

			return {
				accessToken,
				refreshToken,
			};
		} catch {
			throw new UnauthorizedException();
		}
	}
}
