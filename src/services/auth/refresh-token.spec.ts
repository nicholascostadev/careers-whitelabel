import { UnauthorizedException } from "@/exceptions/unauthorized-exception.js";
import type { RefreshTokenDTO } from "@/lib/dtos/refresh-token.dto.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the app module
vi.mock("@/app.js", () => ({
	app: {
		jwt: {
			verify: vi.fn(),
		},
	},
}));

// Mock the generateTokens function
vi.mock("@/lib/generateTokens.js", () => ({
	generateTokens: vi.fn(),
}));

import { app } from "@/app.js";
import { generateTokens } from "@/lib/generateTokens.js";
// Import the service after mocking
import { RefreshTokenService } from "./refresh-token.js";

describe("Refresh Token Service", () => {
	let refreshTokenService: RefreshTokenService;

	beforeEach(() => {
		refreshTokenService = new RefreshTokenService();
		vi.clearAllMocks();
	});

	it("should successfully refresh tokens with valid refresh token", async () => {
		const organizationId = "550e8400-e29b-41d4-a716-446655440000";
		const validRefreshToken = "valid-refresh-token";
		const newAccessToken = "new-access-token";
		const newRefreshToken = "new-refresh-token";

		// Mock JWT verification to return valid payload
		// biome-ignore lint/suspicious/noExplicitAny: The verify return might be wrong in this case
		vi.mocked(app.jwt.verify).mockReturnValue({ sub: organizationId } as any);

		// Mock token generation
		vi.mocked(generateTokens).mockReturnValue({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});

		const refreshTokenDTO: RefreshTokenDTO = {
			refreshToken: validRefreshToken,
		};

		const result = await refreshTokenService.execute(refreshTokenDTO);

		expect(vi.mocked(app.jwt.verify)).toHaveBeenCalledWith(validRefreshToken);
		expect(vi.mocked(generateTokens)).toHaveBeenCalledWith({ organizationId });
		expect(result).toEqual({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	});

	it("should throw UnauthorizedException with invalid refresh token", async () => {
		const invalidRefreshToken = "invalid-refresh-token";

		// Mock JWT verification to throw an error
		vi.mocked(app.jwt.verify).mockImplementation(() => {
			throw new Error("Invalid token");
		});

		const refreshTokenDTO: RefreshTokenDTO = {
			refreshToken: invalidRefreshToken,
		};

		await expect(refreshTokenService.execute(refreshTokenDTO)).rejects.toThrow(
			UnauthorizedException,
		);

		expect(vi.mocked(app.jwt.verify)).toHaveBeenCalledWith(invalidRefreshToken);
		expect(vi.mocked(generateTokens)).not.toHaveBeenCalled();
	});

	it("should generate new tokens with correct organization ID", async () => {
		const organizationId = "123e4567-e89b-12d3-a456-426614174000";
		const validRefreshToken = "valid-refresh-token";
		const expectedTokens = {
			accessToken: "new-access-token",
			refreshToken: "new-refresh-token",
		};

		// biome-ignore lint/suspicious/noExplicitAny: The verify return might be wrong in this case
		vi.mocked(app.jwt.verify).mockReturnValue({ sub: organizationId } as any);
		vi.mocked(generateTokens).mockReturnValue(expectedTokens);

		const refreshTokenDTO: RefreshTokenDTO = {
			refreshToken: validRefreshToken,
		};

		const result = await refreshTokenService.execute(refreshTokenDTO);

		expect(vi.mocked(generateTokens)).toHaveBeenCalledWith({
			organizationId,
		});
		expect(result).toEqual(expectedTokens);
	});
});
