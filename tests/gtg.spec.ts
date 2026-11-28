import { test, expect } from "@playwright/test";

test("public event page presents the approved event facts", async ({ page }) => {
  const response = await page.goto("/");
  const contentSecurityPolicy = response?.headers()["content-security-policy"] || "";
  expect(contentSecurityPolicy).not.toContain("https://d8j0ntlcm91z4.cloudfront.net");
  await expect(page.locator(".hero-artwork")).toBeVisible();
  await expect(page.locator('img[src*="cloudfront.net"]')).toHaveCount(0);
  await expect(page).toHaveTitle(/From Girlhood to Greatness/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { name: /From Girlhood.*to Greatness/i })).toBeVisible();
  await expect(page.getByText(/Accepting My Greatness — From Becoming Her to Believing in Her/)).toBeVisible();
  await expect(page.getByText("Sunday, 29 November 2026").first()).toBeVisible();
  await expect(page.getByText("1:00 PM").first()).toBeVisible();
  await expect(page.getByText("Women aged 20 and above.").first()).toBeVisible();
  await expect(page.getByText("Yakubu Hub, Surami Road,").first()).toBeVisible();
  await expect(page.locator(".partner-lockups").getByText("Baytal Rihaa")).toBeVisible();
  await expect(page.getByText(/Initiative for Sustainable Evolution for Youth and Community/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /A space to meet.*the woman within/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /A few useful.*details/i })).toBeVisible();
  await expect(page.getByText("Do I need to register?")).toBeVisible();
  await expect(page.getByRole("link", { name: /Get directions to Yakubu Hub/ })).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="phone"]')).toBeVisible();
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.locator(".hero-artwork")).toBeVisible();
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport);
  await expect(page.getByRole("link", { name: /Register/ }).first()).toBeVisible();
});

test("registration never reports success when Notion persistence fails", async ({ page }) => {
  await page.goto("/");
  await page.locator('input[name="name"]').fill("CI Test Guest");
  await page.locator('input[name="phone"]').fill("+2348012345678");
  await page.locator('select[name="ageBand"]').selectOption("20–25");
  await page.locator('select[name="source"]').selectOption("Other");
  await page.locator('input[name="ageConfirmed"]').check();
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: /Complete registration/ }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText("Registration could not be saved");
  await expect(page.getByText("Registration recorded")).toHaveCount(0);
});

test("anonymous feedback rejects persistence failure and rate-limits repeated submissions", async ({ page }) => {
  await page.goto("/feedback");
  await page.locator('input[name="rating"][value="5"]').check();
  await page.locator('input[name="whatLanded"][value="Sisterhood and connection"]').check();
  await page.getByRole("button", { name: /Send anonymous feedback/ }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText("could not be saved");
  await expect(page.getByText("Feedback received")).toHaveCount(0);

  const payload = { rating: 5, whatLanded: ["Sisterhood and connection"], whatNext: [], clientSubmissionId: "GTG-CI-ANONYMOUS-FEEDBACK" };
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await page.request.post("/api/feedback", { data: payload });
    expect(response.status()).toBe(503);
  }
  const limited = await page.request.post("/api/feedback", { data: payload });
  expect(limited.status()).toBe(429);
});

test("staff access rejects bad credentials and protects check-in routes", async ({ page }) => {
  const unauthorised = await page.request.post("/api/staff/check-in", { data: { id: "00000000-0000-4000-8000-000000000000" } });
  expect(unauthorised.status()).toBe(401);

  await page.goto("/staff");
  await page.locator('input[type="password"]').fill("incorrect-ci-passcode");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText("Access code not recognised");

  await page.locator('input[type="password"]').fill("ci-test-passcode");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("heading", { name: "Guest check-in" })).toBeVisible();
  await expect(page.locator(".staff-message")).toContainText("registration list is temporarily unavailable");

  const authorisedCheckInStatus = await page.evaluate(async () => {
    const response = await fetch("/api/staff/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "00000000-0000-4000-8000-000000000000" }),
    });
    return response.status;
  });
  expect(authorisedCheckInStatus).toBe(503);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Staff access" })).toBeVisible();
});

test("API validation rejects empty registration and feedback payloads", async ({ request }) => {
  const registration = await request.post("/api/register", { data: {} });
  expect(registration.status()).toBe(400);
  const feedback = await request.post("/api/feedback", { data: {} });
  expect(feedback.status()).toBe(400);
});


test("walk-in registration is staff-only and never confirms an unsaved guest", async ({ page }) => {
  const unauthorised = await page.request.post("/api/staff/walk-in", { data: {} });
  expect(unauthorised.status()).toBe(401);

  await page.goto("/staff");
  await page.locator('input[type="password"]').fill("ci-test-passcode");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByRole("heading", { name: "Guest check-in" })).toBeVisible();

  const invalidStatus = await page.evaluate(async () => {
    const response = await fetch("/api/staff/walk-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    return response.status;
  });
  expect(invalidStatus).toBe(400);

  const unsaved = await page.evaluate(async () => {
    const response = await fetch("/api/staff/walk-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "CI Walk-in Guest",
        phone: "+2348012345678",
        ageBand: "20–25",
        source: "Other",
        returningGuest: false,
        supportNeeds: "",
        ageConfirmed: true,
        consent: true,
        clientSubmissionId: "GTG-CI-WALK-IN-UNSAVED",
        website: "",
      }),
    });
    return { status: response.status, body: await response.json() };
  });
  expect(unsaved.status).toBe(503);
  expect(unsaved.body.ok).toBe(false);
});
