import { DRAFT_NOTE, type CourseContent } from "./types";

export const aiLiteracy: CourseContent = {
  slug: "ai-literacy",
  title: "AI Literacy and Applied AI",
  reviewNote: "Draft lesson · to be reviewed by a JesTech subject reviewer",
  finale: "Course complete: now use AI on a real local problem",
  lessons: [
    {
      title: "What AI is",
      summary: "What artificial intelligence is, what it is good at, and where it goes wrong.",
      minutes: 8,
      body: `**Artificial intelligence (AI)** is software that learns patterns from very large amounts of examples, then uses those patterns to make a guess: the next word in a sentence, what is in a photo, or the answer to a question.

### You already use AI
- Voice typing and translation on your phone
- Photo filters and face unlock
- Spam filters in your email
- Chat assistants that answer questions and write text

### What AI is good at
- Explaining ideas in simple words, and in different ways
- Drafting letters, plans and summaries quickly
- Spotting patterns in lots of information

### What AI is not
AI does not "know" things the way people do. It predicts likely answers, so it can sound confident and still be **wrong**. It may know little about Liberia, your community or recent events, because there may be few examples of them in the data it learned from.

**Rule of thumb:** treat AI as a fast, helpful assistant whose work you always check.

${DRAFT_NOTE}`,
      checklist: ["Name three AI tools you already use", "Say one thing AI is good at", "Say why AI answers must be checked"],
      video: {
        intro: "Welcome to AI Literacy. In this lesson, you will learn what artificial intelligence is, and what it is not.",
        scenes: [
          {
            art: "ai-what",
            heading: "What AI is",
            points: [
              ["Learns patterns from examples", "Artificial intelligence is software that learns patterns from huge numbers of examples."],
              ["Makes a best guess", "It then makes a best guess: the next word, what is in a photo, or an answer to a question."],
              ["You already use it", "You already use AI for voice typing, translation and face unlock on your phone."],
            ],
          },
          {
            art: "ai-limits",
            heading: "What AI is not",
            points: [
              ["It can be confidently wrong", "AI predicts likely answers, so it can sound sure of itself and still be wrong."],
              ["It may not know Liberia well", "It may know little about Liberia or your community, because it saw few examples."],
              ["Always check its work", "So treat AI as a fast assistant, and always check its work."],
            ],
          },
        ],
      },
    },
    {
      title: "Talking to AI assistants",
      summary: "How to write clear requests (prompts) that get useful answers.",
      minutes: 10,
      body: `The message you type to an AI assistant is called a **prompt**. Clear prompts get better answers.

### A good prompt has four parts
- **Task:** what you want. "Explain…", "Write…", "List…"
- **Context:** who you are and where. "I am a secondary school teacher in Gbarnga, Liberia."
- **Details:** the limits. "Use simple English, under 150 words."
- **Format:** how to show it. "Give 5 bullet points" or "Make a table."

### Example
Weak: "Tell me about cassava."

Strong: "I am a young farmer in Bong County, Liberia. Explain in simple English the three most important steps to prepare land for cassava. Use short bullet points."

### Keep the conversation going
The first answer is a starting point. Ask follow-up questions: "Make it shorter", "Explain step 2 again with an example", "What should I check before I trust this?"

### Do not share private information
Never type passwords, mobile money PINs, ID numbers or other people's private details into an AI tool.

${DRAFT_NOTE}`,
      checklist: ["Write a prompt with task, context, details and format", "Ask one follow-up question", "Keep private details out of prompts"],
      video: {
        intro: "The message you type to an AI assistant is called a prompt. Clear prompts get better answers.",
        scenes: [
          {
            art: "ai-prompt",
            heading: "A good prompt has four parts",
            points: [
              ["Task: what you want", "First, the task: say exactly what you want, like explain, write or list."],
              ["Context: who and where", "Second, context: who you are, and where. For example, a teacher in Gbarnga, Liberia."],
              ["Details: the limits", "Third, details: simple English, or under one hundred and fifty words."],
              ["Format: how to show it", "Fourth, the format: bullet points, a table, or a short letter."],
            ],
          },
          {
            art: "ai-chat",
            heading: "Keep the conversation going",
            points: [
              ["Ask follow-up questions", "The first answer is only a start. Ask it to shorten, explain again, or give an example."],
              ["Never share private details", "And never type passwords, PINs or ID numbers into an AI tool."],
            ],
          },
        ],
      },
    },
    {
      title: "Checking AI answers",
      summary: "How to spot mistakes, made-up facts and bias in AI answers.",
      minutes: 10,
      body: `AI tools sometimes **make things up**: facts, numbers, names, quotes and even sources that do not exist. This is often called a "hallucination". The answer can still sound very confident.

### Check before you trust
- **Facts and numbers:** confirm with a trusted source, such as an official website, a textbook or an expert.
- **Names, dates and laws:** these are often wrong or out of date, especially for Liberia.
- **Sources:** if the AI gives a link or a book title, open it and make sure it is real and says the same thing.
- **Health, money and legal questions:** always ask a qualified person before acting.

### Watch for bias
AI learns from data that may not represent everyone fairly. Ask yourself: does this answer fit my community? Who might be left out?

### A simple habit
Ask the AI: "What parts of your answer should I double-check?" Then check them.

${DRAFT_NOTE}`,
      checklist: ["Check one AI fact with a trusted source", "Open any source the AI gives you", "Ask an expert before health, money or legal actions"],
      video: {
        intro: "AI tools sometimes make things up. In this lesson, you will learn how to check their answers.",
        scenes: [
          {
            art: "ai-check",
            heading: "Check before you trust",
            points: [
              ["Confirm facts and numbers", "Confirm facts and numbers with a trusted source, like an official website or a textbook."],
              ["Names, dates and laws", "Names, dates and laws are often wrong or out of date, especially for Liberia."],
              ["Open every source", "If the AI gives a link or a book, open it, and make sure it is real."],
              ["Ask an expert", "For health, money or legal questions, always ask a qualified person."],
            ],
          },
          {
            art: "ai-bias",
            heading: "Watch for bias",
            points: [["Does it fit my community?", "AI learns from data that may not represent everyone. Ask: does this answer fit my community?"]],
          },
        ],
      },
    },
    {
      title: "AI for study and work",
      summary: "Practical, honest ways to use AI to learn faster and work better.",
      minutes: 10,
      body: `Used well, AI can help you learn and work faster. Used badly, it stops you learning.

### Good uses for study
- Ask it to **explain** a hard topic in simpler words, or with a local example
- Ask for **practice questions**, then answer them yourself
- Ask it to **check** your answer and explain any mistakes

### Good uses for work
- Draft an email, a letter or a short report, then edit it in your own voice
- Summarise long notes into key points
- Brainstorm ideas, names or plans
- Translate simple text, then check it with a speaker of that language

### Be honest
Copying AI answers as your own work is cheating, and you learn nothing. Follow your school's or employer's rules, and say when you used AI.

### Always review
You are responsible for anything you send or submit. Read it, check it, and make it yours.

${DRAFT_NOTE}`,
      checklist: ["Use AI to explain one topic you find hard", "Make practice questions and answer them yourself", "Edit an AI draft into your own words"],
      video: {
        intro: "Used well, AI helps you learn and work faster. Used badly, it stops you learning.",
        scenes: [
          {
            art: "ai-study",
            heading: "Study and work",
            points: [
              ["Explain hard topics", "Ask AI to explain a hard topic in simpler words, or with a local example."],
              ["Practice questions", "Ask for practice questions, then answer them yourself."],
              ["Draft, then edit", "At work, let it draft an email or a report, then edit it in your own voice."],
            ],
          },
          {
            art: "ai-honest",
            heading: "Be honest",
            points: [
              ["Don't copy as your own", "Copying AI answers as your own work is cheating, and you learn nothing."],
              ["You are responsible", "You are responsible for everything you send. Read it, check it, and make it yours."],
            ],
          },
        ],
      },
    },
    {
      title: "Privacy and safety",
      summary: "Protect your information and spot AI-powered scams.",
      minutes: 8,
      body: `What you type into an AI tool may be stored and seen by the company that runs it.

### Never share
- Passwords, mobile money PINs and one-time codes
- ID numbers, bank details and full home addresses
- Private information about other people, such as students, patients or customers
- Confidential work documents

### Fake voices, photos and videos
AI can copy a person's voice or face. Scammers use this to pretend to be a relative, a boss or a famous person and ask for money.
- Be suspicious of urgent requests for money, even from a familiar voice
- Call the person back on a number you already know
- Agree a family "safe word" to confirm emergencies

### Check your settings
Many AI tools let you turn off chat history or stop your chats being used for training. Look in the settings.

${DRAFT_NOTE}`,
      checklist: ["Keep PINs, passwords and ID numbers out of AI tools", "Call back before sending money on a voice request", "Check the privacy settings of an AI tool you use"],
      video: {
        intro: "What you type into an AI tool may be stored. Let's keep you and others safe.",
        scenes: [
          {
            art: "privacy",
            heading: "Never share",
            points: [
              ["Passwords, PINs and codes", "Never share passwords, mobile money PINs or one-time codes."],
              ["ID and bank details", "Keep ID numbers, bank details and home addresses private."],
              ["Other people's information", "And never paste private information about students, patients or customers."],
            ],
          },
          {
            art: "deepfake",
            heading: "Fake voices and videos",
            points: [
              ["AI can copy voices", "AI can copy a person's voice or face. Scammers use this to ask for money."],
              ["Call back to check", "If a familiar voice asks for money urgently, call them back on a number you know."],
            ],
          },
        ],
      },
    },
    {
      title: "Your AI project",
      summary: "Use AI to help plan a solution to a real local problem, and show your checking.",
      minutes: 12,
      body: `Now put it all together. Use an AI assistant to help you plan a solution to a small, real problem in your community, school or work.

### Steps
- **Choose a problem:** for example, students missing homework deadlines, or a shop losing track of stock.
- **Ask AI for ideas:** give context about where you are and what resources you have.
- **Pick one idea** that is cheap and realistic.
- **Check it:** test the facts, ask a person who knows the area, and note what you changed.
- **Make a simple plan:** what you will do in the first week.

### What to submit
Share your prompts, the AI's key answers, what you checked or corrected, and your final plan. Submit it from your dashboard as a document or Google Drive link.

${DRAFT_NOTE}`,
      checklist: ["Choose a real local problem", "Record your prompts and the AI's answers", "Write what you checked and changed", "Submit your plan"],
      video: {
        intro: "Now put it all together, with a small project about a real problem near you.",
        scenes: [
          {
            art: "ai-project",
            heading: "Your project",
            points: [
              ["Choose a real problem", "Choose a small, real problem in your community, school or work."],
              ["Ask AI for ideas", "Ask AI for ideas, and give it context about where you are."],
              ["Check and improve", "Check the ideas with facts and with people who know the area."],
              ["Submit your plan", "Then submit your prompts, what you checked, and your final plan."],
            ],
          },
        ],
      },
    },
  ],
};
