import { RefreshTokenService } from "../auth/refresh-token.js";

export function makeRefreshTokenService() {
	const refreshTokenService = new RefreshTokenService();

	return refreshTokenService;
}
