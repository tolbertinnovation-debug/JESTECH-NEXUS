import { DRAFT_NOTE, type CourseContent } from "./types";

export const smallBusiness: CourseContent = {
  slug: "start-a-small-business",
  title: "Starting a Small Business",
  reviewNote: "Draft lesson · to be reviewed by a JesTech subject reviewer",
  finale: "Course complete: now write your one-page business plan",
  lessons: [
    {
      title: "Finding an idea",
      summary: "Find a business idea that solves a real problem you can serve.",
      minutes: 10,
      body: `The best small businesses solve a problem people already have, and will pay to solve.

### Where ideas come from
- **Problems around you:** what do people complain about, travel far for, or wait long for?
- **Your skills:** tailoring, phone repair, baking, hair, farming, tutoring, design.
- **Your resources:** land, a shop space, tools, a motorbike, a network of people.
- **What sells nearby:** what do people already buy often? Can you do it better, closer or cheaper?

### Score your ideas
For each idea, ask:
- Do enough people need this, often?
- Can I start small, with little money?
- Do I have, or can I learn, the skills?
- What makes mine different from others nearby?

### Test before you invest
Make a small batch, offer the service to a few people, or take pre-orders. Real sales teach you more than any plan.

${DRAFT_NOTE}`,
      checklist: ["List three problems you see around you", "Match them with your skills and resources", "Score your ideas", "Plan one small test"],
      video: {
        intro: "Welcome to Starting a Small Business. The best businesses solve a real problem.",
        scenes: [
          {
            art: "idea",
            heading: "Where ideas come from",
            points: [
              ["Problems around you", "Look for problems around you: what people complain about, or travel far for."],
              ["Your skills and resources", "Match them with your skills and resources, like tools, space or land."],
              ["Start small", "Choose an idea you can start small, with little money."],
              ["Test before you invest", "Then test it: make a small batch, or take a few orders first."],
            ],
          },
        ],
      },
    },
    {
      title: "Knowing your customer",
      summary: "Find out who will buy, what they need and what they will pay.",
      minutes: 10,
      body: `A business without customers is only a hobby. Know exactly who you are serving.

### Describe your customer
- **Who** are they? Students, market women, office workers, farmers?
- **Where** do they buy now, and how much do they pay?
- **When** do they need your product: daily, weekly, at school opening, in the rainy season?
- **What** matters most to them: price, quality, speed or being close by?

### Talk to real people
Speak with at least ten possible customers. Ask about their problem and what they do now, not only "would you buy this?" People are polite, so listen for what they actually do.

### Keep listening
After you start selling, ask customers what they like and what to improve. Happy customers bring new customers.

${DRAFT_NOTE}`,
      checklist: ["Write a short customer description", "Talk to ten possible customers", "Note what they pay now", "Ask one customer for feedback"],
      video: {
        intro: "A business without customers is only a hobby. Know who you serve.",
        scenes: [
          {
            art: "customer",
            heading: "Know your customer",
            points: [
              ["Who and where", "Describe who your customers are, and where they buy now."],
              ["What matters to them", "Find out what matters most: price, quality, speed, or being close by."],
              ["Talk to ten people", "Talk to at least ten real people about their problem."],
              ["Keep listening", "And keep asking for feedback after you start selling."],
            ],
          },
        ],
      },
    },
    {
      title: "Costs and pricing",
      summary: "Work out what each item costs you, and set a price that makes a profit.",
      minutes: 12,
      body: `Many small businesses sell a lot and still lose money, because they do not know their costs.

### Two kinds of costs
- **Variable costs** change with how much you make: ingredients, fabric, packaging, transport for each order.
- **Fixed costs** stay the same each month: rent, a phone plan, a stall fee.

### Cost per item
Example: baking 50 buns uses flour, sugar, oil and charcoal costing LRD 2,500. The variable cost per bun is 2,500 ÷ 50 = **LRD 50**.

Add a share of fixed costs. If rent is LRD 6,000 a month and you sell 1,200 buns a month, that is 6,000 ÷ 1,200 = **LRD 5** per bun. Total cost: **LRD 55** per bun.

### Set your price
- Price must be **higher than your cost,** or you lose money on every sale.
- Check what similar sellers charge nearby.
- Price = cost + profit. Selling at LRD 75 leaves LRD 20 profit per bun.

### Watch the currency
Prices in Liberia move between Liberian dollars and US dollars. Write down which currency you use, and update your costs when prices change.

${DRAFT_NOTE}`,
      checklist: ["List your variable and fixed costs", "Calculate cost per item", "Compare with prices nearby", "Set a price with a profit"],
      video: {
        intro: "Many businesses sell a lot and still lose money, because they don't know their costs.",
        scenes: [
          {
            art: "pricing",
            heading: "Costs and price",
            points: [
              ["Variable costs", "Variable costs change with how much you make, like ingredients and packaging."],
              ["Fixed costs", "Fixed costs stay the same each month, like rent."],
              ["Cost per item", "Divide your costs by the number you make, to get the cost per item."],
              ["Price above cost", "Set a price above your cost, and check what others charge nearby."],
            ],
          },
        ],
      },
    },
    {
      title: "Record keeping",
      summary: "Keep simple daily records so you always know if you are making money.",
      minutes: 10,
      body: `Records show whether your business is really making money, and help you get loans and plan.

### Keep a simple daily book
Use a notebook or a spreadsheet with these columns:
- **Date**
- **What** (sale or expense, and what for)
- **Money in**
- **Money out**

### Separate business and personal money
Do not pay family expenses from the business cash without writing it down. Pay yourself a set amount instead. Mixing money is the most common reason small businesses fail.

### Keep proof
Keep receipts, and save mobile money transaction messages or statements.

### Check every week and month
- Total money in minus total money out = **profit** (or loss).
- Which products earn the most?
- Which costs are growing?

${DRAFT_NOTE}`,
      checklist: ["Start a daily money in and money out book", "Keep business and personal money separate", "Save receipts and mobile money messages", "Work out this week's profit"],
      video: {
        intro: "Records show whether your business is really making money.",
        scenes: [
          {
            art: "records",
            heading: "Simple records",
            points: [
              ["Write every sale and expense", "Write down every sale and every expense, every day."],
              ["Separate personal money", "Keep business money and personal money separate. Pay yourself a set amount."],
              ["Keep proof", "Keep receipts, and save mobile money messages."],
              ["Check your profit", "Each week, money in minus money out tells you your profit."],
            ],
          },
        ],
      },
    },
    {
      title: "Your one-page plan",
      summary: "Bring it all together in a one-page business plan.",
      minutes: 12,
      body: `A one-page plan keeps your thinking clear. It is also useful when you talk to partners, savings groups (susu) or lenders.

### The sections
- **The problem and your idea:** what you sell, and the problem it solves.
- **Your customers:** who they are, and why they will buy from you.
- **Product and price:** what you sell, and at what price.
- **Costs and money needed:** your cost per item, monthly costs, and how much money you need to start.
- **How you will sell:** location, WhatsApp, market days, delivery.
- **First three steps:** what you will do in the next month.

### Keep it honest and simple
Use real numbers from your costing, and plain words. Update the plan as you learn.

### Your project
Write a one-page plan for your business idea using the workbook in the library, and submit it as a document or a photo.

${DRAFT_NOTE}`,
      checklist: ["Fill in each section of the plan", "Use real cost numbers", "List your first three steps", "Submit your plan"],
      video: {
        intro: "Now bring it all together in a one-page business plan.",
        scenes: [
          {
            art: "plan",
            heading: "Your one-page plan",
            points: [
              ["Idea and customers", "Write your idea, the problem it solves, and who your customers are."],
              ["Product and price", "Write what you sell, and your price."],
              ["Costs and money needed", "Add your costs, and how much money you need to start."],
              ["First three steps", "Finish with your first three steps for the next month."],
            ],
          },
        ],
      },
    },
  ],
};
