import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { storage } from "@/utils/storage";
import { getUser, login, register, logout } from "@/lib/auth";
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { paths } from "@/config/paths";

vi.mock("@/utils/storage", () => ({
  storage: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    clearToken: vi.fn(),
  },
}));

const server = setupServer(
  http.get("*/api/auth/me", ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (authHeader === "Bearer valid-token") {
      return HttpResponse.json({ id: 1, username: "testuser" });
    }
    return HttpResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }),

  http.post("*/api/auth/login", async ({ request }) => {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const username = params.get("username");
    const password = params.get("password");

    if (username === "testuser" && password === "password") {
      return HttpResponse.json({ access_token: "valid-token" });
    }

    return HttpResponse.json(
      { detail: "Invalid credentials" },
      { status: 401 },
    );
  }),

  http.post("*/api/user/register", async ({ request }) => {
    const body = await request.json();

    if (!body.username || !body.password || !body.email) {
      return HttpResponse.json(
        { detail: "Username, email and password are required." },
        { status: 400 },
      );
    }

    if (body.username === "takenuser") {
      return HttpResponse.json(
        { detail: "Username already taken." },
        { status: 409 },
      );
    }

    return HttpResponse.json({}, { status: 201 });
  }),

  http.options("*/api/auth/me", () => HttpResponse.json({})),
  http.options("*/api/auth/login", () => HttpResponse.json({})),
  http.options("*/api/user/register", () => HttpResponse.json({})),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
  Object.defineProperty(window, "location", {
    value: { assign: vi.fn() },
    writable: true,
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Auth API Client", () => {
  describe("getUser", () => {
    it("should return user data when authorized", async () => {
      storage.getToken.mockReturnValue("valid-token");

      const user = await getUser();
      expect(user).toEqual({ id: 1, username: "testuser" });
    });

    it("should return null when unauthorized", async () => {
      storage.getToken.mockReturnValue(null);

      const user = await getUser();
      expect(user).toBeNull();
    });

    it("should clear token and return null on error", async () => {
      storage.getToken.mockReturnValue("invalid-token");

      const user = await getUser();
      expect(user).toBeNull();
      expect(storage.clearToken).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should handle login successfully", async () => {
      storage.setToken.mockImplementation((token) => {
        storage.getToken.mockReturnValue(token);
      });

      const user = await login({ username: "testuser", password: "password" });
      expect(user).toEqual({ id: 1, username: "testuser" });
      expect(storage.setToken).toHaveBeenCalledWith("valid-token");
    });
    it("should throw error with invalid credentials", async () => {
      await expect(
        login({ username: "wronguser", password: "wrongpassword" }),
      ).rejects.toThrowError();
    });
  });

  describe("register", () => {
    it("should register successfully with valid data", async () => {
      await expect(
        register({
          username: "newuser",
          email: "user@example.com",
          password: "password",
        }),
      ).resolves.toBeNull();
    });

    it("should fail when username is missing", async () => {
      await expect(
        register({ email: "user@example.com", password: "password" }),
      ).rejects.toThrowError("Request failed with status code 400");
    });

    it("should fail when email is missing", async () => {
      await expect(
        register({ username: "newuser", password: "password" }),
      ).rejects.toThrowError("Request failed with status code 400");
    });

    it("should fail when password is missing", async () => {
      await expect(
        register({ username: "newuser", email: "user@example.com" }),
      ).rejects.toThrowError("Request failed with status code 400");
    });

    it("should fail when username is already taken", async () => {
      await expect(
        register({
          username: "takenuser",
          email: "user@example.com",
          password: "password",
        }),
      ).rejects.toThrowError("Request failed with status code 409");
    });
  });

  describe("logout", () => {
    it("should clear token and redirect", () => {
      logout();
      expect(storage.clearToken).toHaveBeenCalled();
      expect(window.location.href).toBe(paths.auth.main.getHref());
    });
  });
});
