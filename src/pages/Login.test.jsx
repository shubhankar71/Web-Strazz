import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import * as authService from "../services/authService.js";

vi.mock("../services/authService.js", () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  getAuthMode: vi.fn(() => "demo"),
  DEMO_CREDENTIALS: { email: "demo@webstarzz.local", password: "demo1234" },
}));

function Destination() {
  const location = useLocation();
  return <div>Reached {location.pathname}</div>;
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/login", state: { from: { pathname: "/sessions" } } }]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sessions" element={<Destination />} />
          <Route path="/" element={<Destination />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Login", () => {
  afterEach(cleanup);

  beforeEach(() => {
    authService.getCurrentUser.mockResolvedValue(null);
    authService.login.mockReset();
  });

  it("validates fields and associates messages with controls", async () => {
    renderLogin();
    await screen.findByRole("heading", { name: "Sign in" });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Enter your email address.")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or username/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
  });

  it("rejects malformed email addresses before calling authentication", async () => {
    renderLogin();
    await screen.findByRole("heading", { name: "Sign in" });
    fireEvent.change(screen.getByLabelText(/Email or username/), { target: { value: "not-an-email@" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "example-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("shows a generic credential error when authentication rejects the sign-in", async () => {
    authService.login.mockRejectedValue(new Error("The email or password is incorrect."));
    renderLogin();
    await screen.findByRole("heading", { name: "Sign in" });
    fireEvent.change(screen.getByLabelText(/Email or username/), { target: { value: "demo@webstarzz.local" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("The email or password is incorrect.");
  });

  it("signs in and returns to the protected destination", async () => {
    authService.login.mockResolvedValue({ id: "demo-user" });
    renderLogin();
    await screen.findByRole("heading", { name: "Sign in" });
    fireEvent.change(screen.getByLabelText(/Email or username/), { target: { value: "demo@webstarzz.local" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "demo1234" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => expect(screen.getByText("Reached /sessions")).toBeInTheDocument());
    expect(authService.login).toHaveBeenCalledWith("demo@webstarzz.local", "demo1234");
  });
});
