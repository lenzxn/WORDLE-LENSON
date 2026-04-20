import { vi, describe, test, expect } from "vitest";
import request from "supertest";

vi.stubGlobal("fetch", async () => ({
  text: async () => "crane\nslate\nstare\n",
}));

vi.mock("../server/chooseWord.js", () => ({
  default: () => "crane",
}));

const { default: app } = await import("../server/app.js");

describe("Game flow", () => {
  test("POST /api/game/start returns gameId and wordLength", async () => {
    const res = await request(app)
      .post("/api/game/start")
      .send({ wordLength: 5, uniqueOnly: false });

    expect(res.status).toBe(200);
    expect(res.body.gameId).toBeDefined();
    expect(res.body.wordLength).toBe(5);
  });

  test("POST /api/game/guess returns feedback for wrong guess", async () => {
    const startRes = await request(app)
      .post("/api/game/start")
      .send({ wordLength: 5, uniqueOnly: false });

    const { gameId } = startRes.body;

    const guessRes = await request(app)
      .post("/api/game/guess")
      .send({ gameId, guess: "hello" });

    expect(guessRes.status).toBe(200);
    expect(guessRes.body.won).toBe(false);
    expect(guessRes.body.feedback).toHaveLength(5);
  });

  test("Full game flow — guess correct word wins the game", async () => {
    const startRes = await request(app)
      .post("/api/game/start")
      .send({ wordLength: 5, uniqueOnly: false });

    const { gameId } = startRes.body;

    const guessRes = await request(app)
      .post("/api/game/guess")
      .send({ gameId, guess: "crane" });

    expect(guessRes.status).toBe(200);
    expect(guessRes.body.won).toBe(true);
    expect(guessRes.body.time).toBeDefined();
  });

  test("Feedback is correct for known word", async () => {
    const startRes = await request(app)
      .post("/api/game/start")
      .send({ wordLength: 5, uniqueOnly: false });

    const { gameId } = startRes.body;

    const guessRes = await request(app)
      .post("/api/game/guess")
      .send({ gameId, guess: "crane" });

    guessRes.body.feedback.forEach((f) => {
      expect(f.result).toBe("correct");
    });
  });

  test("Invalid gameId returns 404", async () => {
    const res = await request(app)
      .post("/api/game/guess")
      .send({ gameId: "invalid-id", guess: "hello" });

    expect(res.status).toBe(404);
  });

  test("Wrong word length returns 400", async () => {
    const startRes = await request(app)
      .post("/api/game/start")
      .send({ wordLength: 5, uniqueOnly: false });

    const { gameId } = startRes.body;

    const res = await request(app)
      .post("/api/game/guess")
      .send({ gameId, guess: "hi" });

    expect(res.status).toBe(400);
  });

  test("Invalid wordLength returns 400", async () => {
    const res = await request(app)
      .post("/api/game/start")
      .send({ wordLength: 99, uniqueOnly: false });

    expect(res.status).toBe(400);
  });

  test("Non-alpha guess returns 400", async () => {
    const startRes = await request(app)
      .post("/api/game/start")
      .send({ wordLength: 5, uniqueOnly: false });

    const { gameId } = startRes.body;

    const res = await request(app)
      .post("/api/game/guess")
      .send({ gameId, guess: "12345" });

    expect(res.status).toBe(400);
  });
});
