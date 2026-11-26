/**
 * Stand-in for the Grandpa AI API (OpenAI-compatible chat completions), for local and CI tests.
 * - Requires "Authorization: Bearer test-key"
 * - A question containing __out_of_allowance__ gets the 429 "spending allowance" error
 * - GET /calls returns how many chat requests it has received
 * - Streams an answer (server-sent events) that names the lesson found in the system prompt,
 *   so tests can prove the tutor receives the lesson context.
 * Usage: node tests/e2e/mock-ai.mjs [port=4010]
 */
import http from "node:http";

const port = Number(process.argv[2] ?? 4010);

let calls = 0;

http
  .createServer((req, res) => {
    if (req.method === "GET" && req.url === "/calls") {
      res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ calls }));
      return;
    }
    if (req.method !== "POST" || !req.url.endsWith("/chat/completions")) {
      res.writeHead(404).end();
      return;
    }
    if (req.headers.authorization !== "Bearer test-key") {
      res.writeHead(401, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "bad key" }));
      return;
    }
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      const body = JSON.parse(raw);
      const system = body.messages.find((m) => m.role === "system")?.content ?? "";
      const lesson = /on the lesson "([^"]+)"/.exec(system)?.[1] ?? "the course overview";
      const question = body.messages.at(-1)?.content ?? "";
      calls++;
      // Imitates Grandpa AI when its daily spending allowance is used up.
      if (question.includes("__out_of_allowance__")) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: { message: "The Grandpa AI API has used its spending allowance for today." } }));
        return;
      }
      const answer = `**Good question!** You asked: "${question}". This is about *${lesson}*.\n- Point one\n- Point two`;
      if (!body.stream) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ choices: [{ message: { role: "assistant", content: answer } }] }));
        return;
      }
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
      const words = answer.split(/(?<= )/);
      let i = 0;
      const timer = setInterval(() => {
        if (i < words.length) {
          res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: words[i++] } }] })}\n\n`);
        } else {
          res.write("data: [DONE]\n\n");
          res.end();
          clearInterval(timer);
        }
      }, 15);
    });
  })
  .listen(port, () => console.log(`mock AI listening on ${port}`));
