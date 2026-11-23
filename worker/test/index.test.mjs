// Tests for the contact Worker. Run from the repository root: node --test worker/test/index.test.mjs
// They mock fetch, so no request leaves the machine.
import assert from "node:assert/strict";
import { test } from "node:test";

import worker from "../src/index.js";

const ENV = { POSTMARK_SERVER_TOKEN: "test-token", TURNSTILE_SECRET: "test-secret" };

// Replaces fetch: Turnstile answers `human`, Postmark answers `postmark` (an HTTP status).
function mockFetch({ human = true, postmark = 200 } = {}) {
  const calls = { turnstile: 0, postmark: [] };
  globalThis.fetch = async (url, init) => {
    if (String(url).includes("turnstile")) {
      calls.turnstile += 1;
      return Response.json(human ? { success: true } : { success: false, "error-codes": ["invalid-input-secret"] });
    }
    calls.postmark.push(JSON.parse(init.body));
    return Response.json({ ErrorCode: postmark === 200 ? 0 : 400 }, { status: postmark });
  };
  return calls;
}

function post(origin, body) {
  return new Request("https://forms.mapstoneapps.com/", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const VALID = { name: "Ann", email: "ann@example.com", message: "Hello", turnstileToken: "token" };

test("mapstoneapps.com: emails support@mapstoneapps.com from noreply@mapstoneapps.com", async () => {
  const calls = mockFetch();
  const res = await worker.fetch(post("https://mapstoneapps.com", { ...VALID, interest: "Ledgerstone" }), ENV);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), "https://mapstoneapps.com");
  assert.deepEqual(calls.postmark, [
    {
      From: "Mapstone Apps Website <noreply@mapstoneapps.com>",
      To: "support@mapstoneapps.com",
      ReplyTo: "ann@example.com",
      Subject: "[Mapstone Apps · Ledgerstone] Ann",
      TextBody: "Site: https://mapstoneapps.com\nName: Ann\nEmail: ann@example.com\nTopic: Ledgerstone\n\nHello",
      MessageStream: "outbound",
    },
  ]);
});

test("FROM_EMAIL and TO_EMAIL variables override the defaults", async () => {
  const calls = mockFetch();
  await worker.fetch(post("https://mapstoneapps.com", VALID), { ...ENV, FROM_EMAIL: "a@mapstoneapps.com", TO_EMAIL: "b@mapstoneapps.com" });
  assert.equal(calls.postmark[0].From, "Mapstone Apps Website <a@mapstoneapps.com>");
  assert.equal(calls.postmark[0].To, "b@mapstoneapps.com");
});

test("www and other mapstoneapps.com subdomains are accepted; a missing topic gets the default", async () => {
  const calls = mockFetch();
  const res = await worker.fetch(post("https://www.mapstoneapps.com", VALID), ENV);
  assert.equal(res.status, 200);
  assert.equal(calls.postmark[0].Subject, "[Mapstone Apps · General question] Ann");
});

test("Postmark refusal: 502 naming support@mapstoneapps.com, with Postmark's code", async () => {
  mockFetch({ postmark: 422 });
  const res = await worker.fetch(post("https://mapstoneapps.com", VALID), ENV);
  assert.equal(res.status, 502);
  assert.deepEqual(await res.json(), {
    ok: false,
    error: "Message could not be sent. Please email support@mapstoneapps.com.",
    code: "postmark-400",
  });
});

test("other origins are refused, lookalikes included", async () => {
  for (const origin of [
    "https://example.com",
    "https://www.vestanabullc.com",
    "https://xmapstoneapps.com",
    "https://mapstoneapps.com.example.com",
    "http://mapstoneapps.com",
    "http://www.mapstoneapps.com",
    "https://mapstoneapps.com:8443",
    "null",
    "",
  ]) {
    const calls = mockFetch();
    const res = await worker.fetch(post(origin, VALID), ENV);
    assert.equal(res.status, 403, origin);
    assert.equal(res.headers.get("Access-Control-Allow-Origin"), "https://mapstoneapps.com", origin);
    assert.equal(calls.turnstile + calls.postmark.length, 0, origin);
  }
});

test("preflight answers each Mapstone Apps origin with itself", async () => {
  for (const origin of ["https://mapstoneapps.com", "https://www.mapstoneapps.com", "https://forms.mapstoneapps.com"]) {
    const res = await worker.fetch(new Request("https://forms.mapstoneapps.com/", { method: "OPTIONS", headers: { Origin: origin } }), ENV);
    assert.equal(res.status, 204);
    assert.equal(res.headers.get("Access-Control-Allow-Origin"), origin);
  }
});

test("GET reports whether the secrets are set, never their values", async () => {
  const res = await worker.fetch(new Request("https://forms.mapstoneapps.com/"), { TURNSTILE_SECRET: "s3cret" });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.turnstileSecretSet, true);
  assert.equal(body.postmarkTokenSet, false);
  assert.ok(!JSON.stringify(body).includes("s3cret"));
});

test("missing secrets: clear codes, nothing sent", async () => {
  let calls = mockFetch();
  let res = await worker.fetch(post("https://mapstoneapps.com", VALID), { POSTMARK_SERVER_TOKEN: "t" });
  assert.equal(res.status, 403);
  assert.equal((await res.json()).code, "not-configured");
  calls = mockFetch();
  res = await worker.fetch(post("https://mapstoneapps.com", VALID), { TURNSTILE_SECRET: "s" });
  assert.equal(res.status, 502);
  assert.equal((await res.json()).code, "not-configured");
  assert.equal(calls.postmark.length, 0);
});

test("honeypot: pretends success, checks and sends nothing", async () => {
  const calls = mockFetch();
  const res = await worker.fetch(post("https://mapstoneapps.com", { ...VALID, website: "spam.example" }), ENV);
  assert.equal(res.status, 200);
  assert.equal(calls.turnstile + calls.postmark.length, 0);
});

test("failed Turnstile check: 403 with Turnstile's code, nothing sent", async () => {
  const calls = mockFetch({ human: false });
  const res = await worker.fetch(post("https://mapstoneapps.com", VALID), ENV);
  assert.equal(res.status, 403);
  assert.equal((await res.json()).code, "invalid-input-secret");
  assert.equal(calls.postmark.length, 0);
});

test("missing fields and bad JSON: 400", async () => {
  mockFetch();
  for (const body of [{ ...VALID, name: " " }, { ...VALID, email: "nope" }, { ...VALID, message: "" }, "not json", "null", "7"]) {
    const res = await worker.fetch(post("https://mapstoneapps.com", body), ENV);
    assert.equal(res.status, 400, JSON.stringify(body));
  }
});

test("subject lines stay on one line", async () => {
  const calls = mockFetch();
  await worker.fetch(post("https://mapstoneapps.com", { ...VALID, name: "Ann\r\nBcc: x@example.com", interest: "A\nB" }), ENV);
  assert.equal(calls.postmark[0].Subject, "[Mapstone Apps · A B] Ann Bcc: x@example.com");
});
