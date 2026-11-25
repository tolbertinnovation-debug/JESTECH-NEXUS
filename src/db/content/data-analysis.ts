import { DRAFT_NOTE, type CourseContent } from "./types";

export const dataAnalysis: CourseContent = {
  slug: "data-analysis-basics",
  title: "Data Analysis Basics",
  reviewNote: "Draft lesson · to be reviewed by a JesTech subject reviewer",
  finale: "Course complete: now answer a real question with data",
  lessons: [
    {
      title: "Asking good questions",
      summary: "Start every analysis with a clear question you can answer with data.",
      minutes: 8,
      body: `Data analysis starts with a **question**, not with numbers. A good question tells you what data to collect and what to do with the answer.

### A good question is
- **Specific:** "What is the average price of a cup of rice at Red Light Market this month?" not "How are prices?"
- **Measurable:** you can collect numbers or categories to answer it.
- **Useful:** the answer helps someone make a decision.

### Examples
- A shop owner: "Which three items sell the most on Saturdays?"
- A school: "How many students were absent each week this term?"
- A farmer group: "Which market paid the best price for gari last month?"

### Plan your data
For your question, write down:
- What you will record (for example: date, market, item, price)
- How often (every day, every week)
- Who will record it, and where

${DRAFT_NOTE}`,
      checklist: ["Write one specific, measurable question", "Say who the answer will help", "List the data you need to record"],
      video: {
        intro: "Welcome to Data Analysis Basics. Every analysis starts with a good question.",
        scenes: [
          {
            art: "question",
            heading: "A good question is",
            points: [
              ["Specific", "Specific: the average price of a cup of rice at one market this month."],
              ["Measurable", "Measurable: you can collect numbers or categories to answer it."],
              ["Useful", "Useful: the answer helps someone make a decision."],
              ["Plan your data", "Then plan what you will record, how often, and who will record it."],
            ],
          },
        ],
      },
    },
    {
      title: "Spreadsheets basics",
      summary: "Organise data in rows and columns, the right way from the start.",
      minutes: 10,
      body: `A **spreadsheet** organises data in a grid. Free options include Google Sheets (on a phone or computer), LibreOffice Calc, and Microsoft Excel.

### The parts
- **Columns** go down and have letters: A, B, C.
- **Rows** go across and have numbers: 1, 2, 3.
- A **cell** is one box, named by its column and row, like **B4**.

### Set up your data well
- Put **headings in row 1**: Date, Market, Item, Price (LRD).
- **One record per row:** each row is one sale, one student, or one price check.
- **One kind of value per column:** only numbers in the Price column. Do not type "LRD 250", type 250 and put the unit in the heading.
- Do not leave blank rows in the middle of your data.

### Save and share
Give the file a clear name, like \`market-prices-2026-11.xlsx\`, and keep a backup copy.

${DRAFT_NOTE}`,
      checklist: ["Create a sheet with headings in row 1", "Enter five records, one per row", "Keep only numbers in number columns"],
      video: {
        intro: "A spreadsheet organises your data in a grid of rows and columns.",
        scenes: [
          {
            art: "spreadsheet",
            heading: "Set up your data",
            points: [
              ["Headings in row one", "Put headings in row one, like date, market, item and price."],
              ["One record per row", "Use one row for each record: one sale, or one price check."],
              ["Numbers only in number columns", "Keep only numbers in number columns. Put the unit, like L R D, in the heading."],
              ["No blank rows", "And don't leave blank rows in the middle of your data."],
            ],
          },
        ],
      },
    },
    {
      title: "Cleaning data",
      summary: "Fix spelling, duplicates, blanks and mixed units before you analyse.",
      minutes: 10,
      body: `Real data is messy. Cleaning it before you analyse stops wrong answers.

### Common problems
- **Different spellings:** "Red Light", "Redlight" and "red light market" are the same place. Choose one spelling and use it everywhere.
- **Duplicates:** the same record entered twice. Remove the extra copy.
- **Blanks:** missing values. Find out the real value if you can, or mark it clearly and leave it out of averages.
- **Mixed units and currencies:** some prices in Liberian dollars (LRD) and some in US dollars (USD). Convert everything to one currency, and note the exchange rate and date you used.
- **Typing mistakes:** a price of 25000 instead of 250. Sort the column to spot numbers that look far too big or small.

### Keep the original
Always keep an untouched copy of the raw data, and clean a copy. Write down what you changed.

${DRAFT_NOTE}`,
      checklist: ["Fix inconsistent spellings", "Remove duplicate rows", "Convert all money to one currency", "Keep the raw data untouched"],
      video: {
        intro: "Real data is messy. Clean it first, and your answers will be right.",
        scenes: [
          {
            art: "clean",
            heading: "Common problems",
            points: [
              ["Different spellings", "Choose one spelling for each name, and use it everywhere."],
              ["Duplicates", "Remove records that were entered twice."],
              ["Mixed currencies", "Convert prices to one currency, L R D or U S D, and note the exchange rate."],
              ["Typing mistakes", "Sort each column to spot numbers that are far too big or too small."],
            ],
          },
          {
            art: "backup",
            heading: "Keep the original",
            points: [["Clean a copy", "Always keep the raw data untouched, clean a copy, and write down what you changed."]],
          },
        ],
      },
    },
    {
      title: "Summaries and formulas",
      summary: "Use simple formulas to total, average and count your data.",
      minutes: 12,
      body: `Formulas do the maths for you. Every formula starts with an equals sign \`=\`.

### The five most useful formulas
- \`=SUM(B2:B31)\` adds up the values in cells B2 to B31.
- \`=AVERAGE(B2:B31)\` gives the mean value.
- \`=MIN(B2:B31)\` and \`=MAX(B2:B31)\` give the smallest and largest values.
- \`=COUNT(B2:B31)\` counts how many cells contain numbers.

### Example: rice prices for a month
If column B has the daily price of a cup of rice:
- The average tells you a typical price.
- MIN and MAX show the range: how much prices moved.

### Count by category
\`=COUNTIF(C2:C31, "Saturday")\` counts how many rows say Saturday.
\`=SUMIF(C2:C31, "Saturday", D2:D31)\` adds the sales made on Saturdays.

### Check your answers
Look at the result and ask: does this make sense? If the average price is higher than every price you saw, something is wrong in the data or the formula.

${DRAFT_NOTE}`,
      checklist: ["Use SUM and AVERAGE on a column", "Find the MIN and MAX", "Try COUNTIF for one category", "Check that results make sense"],
      video: {
        intro: "Formulas do the maths for you. Every formula starts with an equals sign.",
        scenes: [
          {
            art: "formula",
            heading: "Five useful formulas",
            points: [
              ["SUM adds up", "SUM adds up a range of cells."],
              ["AVERAGE gives a typical value", "AVERAGE gives the typical value, the mean."],
              ["MIN and MAX show the range", "MIN and MAX show the smallest and largest values."],
              ["COUNTIF by category", "And COUNTIF counts the rows in one category, like Saturday."],
            ],
          },
        ],
      },
    },
    {
      title: "Charts",
      summary: "Choose the right chart and make it easy to read.",
      minutes: 10,
      body: `A good chart shows the answer at a glance.

### Pick the right chart
- **Bar chart:** compare categories, such as sales of each item, or prices at each market.
- **Line chart:** show change over time, such as the price of rice each week.
- **Pie chart:** only for parts of a whole with a few categories. A bar chart is usually clearer.

### Make it readable
- Give it a **title that states the finding:** "Rice prices rose 20% in November", not just "Rice prices".
- **Label the axes** and include units (LRD, kg, students).
- **Start bar charts at zero,** so differences are not exaggerated.
- Avoid 3D effects and too many colours. Use one highlight colour for what matters most.
- Check it is readable on a phone screen.

### In a spreadsheet
Select your data including the headings, then choose Insert, Chart, and pick the chart type.

${DRAFT_NOTE}`,
      checklist: ["Make a bar chart comparing categories", "Make a line chart over time", "Write a title that states the finding", "Label axes with units"],
      video: {
        intro: "A good chart shows the answer at a glance.",
        scenes: [
          {
            art: "chart",
            heading: "Choose and design",
            points: [
              ["Bar chart to compare", "Use a bar chart to compare categories, like prices at each market."],
              ["Line chart over time", "Use a line chart to show change over time."],
              ["Title states the finding", "Give it a title that states the finding, not just the topic."],
              ["Label axes, start at zero", "Label the axes with units, and start bars at zero."],
            ],
          },
        ],
      },
    },
    {
      title: "Presenting findings",
      summary: "Tell a clear story with your data, and be honest about its limits.",
      minutes: 10,
      body: `Your work matters only if people understand it and act on it.

### A simple structure
- **The question:** what you wanted to know.
- **The answer first:** one or two sentences, for example "Gari sold for the best price at Duala Market in October."
- **The evidence:** one or two key numbers and a clear chart.
- **What to do:** a practical recommendation.
- **Limits:** what the data cannot tell you, such as "only four weeks of prices from three markets".

### Know your audience
A farmer group may want a short WhatsApp message with one chart. A manager may want a one-page summary. Keep it short and use plain words.

### Be honest
Do not hide data that disagrees with you, and do not claim more than the data shows.

### Your project
Collect a small dataset that answers a real question, analyse it in a spreadsheet, and share a link to your sheet with your chart and conclusion.

${DRAFT_NOTE}`,
      checklist: ["State the answer in one or two sentences", "Show one clear chart", "Write a recommendation", "State the limits of your data"],
      video: {
        intro: "Your work matters only if people understand it, and act on it.",
        scenes: [
          {
            art: "present",
            heading: "Tell a clear story",
            points: [
              ["Answer first", "Start with the answer, in one or two sentences."],
              ["Key numbers and one chart", "Show one or two key numbers, and one clear chart."],
              ["What to do", "Say what people should do next."],
              ["Be honest about limits", "And be honest about what the data cannot tell you."],
            ],
          },
        ],
      },
    },
  ],
};
