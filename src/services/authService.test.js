import { describe, expect, it } from "vitest";
import { DEMO_CREDENTIALS, getCurrentUser, login, logout } from "./authService.js";

describe("demo authentication service", () => {
  it("persists a safe demo user without storing the password", async () => {
    const user = await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(user).toMatchObject({ email: DEMO_CREDENTIALS.email, isDemo: true });
    expect(await getCurrentUser()).toEqual(user);
    expect(window.localStorage.getItem("webstarzz.demo.user")).not.toContain(DEMO_CREDENTIALS.password);
    await logout();
    expect(await getCurrentUser()).toBeNull();
  });

  it("rejects incorrect credentials", async () => {
    await expect(login(DEMO_CREDENTIALS.email, "incorrect")).rejects.toThrow("email or password is incorrect");
  });
});
