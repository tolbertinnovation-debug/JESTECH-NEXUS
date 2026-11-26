# Ask Grandpa (AI tutor)

A floating **Ask Grandpa** button appears on every course page and lesson page. Learners can ask questions about
the course or the lesson they are on.

## How it works

1. The browser sends the question and the recent conversation to `POST /api/assistant`.
2. The server checks that the learner is logged in and within the **daily limit** (40 questions a day by default).
   Questions that fail because the AI is down don't count towards the limit.
3. It adds a **tutor system prompt** (`src/lib/assistant/tutor.ts`). The prompt tells Grandpa to:
   - use the lesson text as the main source
   - write simple English with local examples
   - stay on topic
   - help learners learn rather than doing their projects for them
   - say when it isn't sure
   - send health, money and legal questions to qualified people
   - never ask for passwords or PINs
4. It calls the Grandpa AI API (`src/lib/assistant/provider.ts`) and streams the answer back as plain text.
5. The chat panel shows the answer with simple formatting (bold, italics, lists and code). It never renders raw
   HTML.

The chat panel's code only downloads when a learner taps the button, so lesson pages stay light. The conversation
is kept in the browser tab only (`sessionStorage`). JesTech stores no question text, only a daily count per learner.

## When Grandpa AI's allowance runs out

Grandpa AI has its own spending allowance. When it is used up, the API answers with error 429 (or a message about
its allowance, quota or credit). Ask Grandpa then:

- shows learners a friendly message: *"Grandpa has answered a lot of questions today and is resting. Please try
  again later, or ask your mentor."* The question does not count towards the learner's daily limit.
- **pauses** for the wait Grandpa AI suggests (`Retry-After`), or 30 minutes if it suggests none, and at most
  6 hours. During the pause it answers straight away with the same message instead of calling Grandpa AI again.
  The pause is stored in the `app_state` table, so every server instance respects it.

To check or raise the allowance, use your Grandpa AI account. The Vercel logs show
`[assistant] AI provider responded 429: …` when this happens.

## Turning it on (Vercel)

In **Vercel → Project → Settings → Environment Variables**, add the following, then **Redeploy**:

| Key | Value |
| --- | --- |
| `GRANDPA_AI_API_KEY` | your key from Grandpa AI (secret: never put it in code or chat) |
| `GRANDPA_AI_API_URL` | the API base URL from the Grandpa AI docs, e.g. `https://…/v1` |
| `GRANDPA_AI_MODEL` | optional: the model name, if Grandpa AI asks for one |
| `GRANDPA_AI_AUTH_HEADER` | optional: `Authorization` (default; sends `Bearer <key>`) or the header their docs name, e.g. `x-api-key` |
| `ASSISTANT_DAILY_LIMIT` | optional: questions per learner per day (default 40) |

While the key or URL is missing, the button is hidden and the API answers "not available yet".

## If Grandpa AI uses a different request format

The connection uses the common **OpenAI-compatible** format: `POST {URL}/chat/completions` with
`{ model, messages: [{role, content}], stream: true }`. It accepts either streamed (server-sent events) or JSON
replies. The JSON reply can be in common shapes such as `choices[0].message.content`, `reply`, `response` or
`answer`.

If Grandpa AI's documentation shows something different, only `buildRequest()` and `readReply()` in
`src/lib/assistant/provider.ts` need to change. `tests/assistant.test.ts` covers that file.

## Testing without a key

`tests/e2e/mock-ai.mjs` is a stand-in API, used locally and in CI:

```bash
node tests/e2e/mock-ai.mjs 4010 &
# .env: GRANDPA_AI_API_URL=http://localhost:4010/v1  GRANDPA_AI_API_KEY=test-key
```
