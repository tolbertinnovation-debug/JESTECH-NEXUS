import { DRAFT_NOTE, type CourseContent } from "./types";

export const graphicDesign: CourseContent = {
  slug: "graphic-design-essentials",
  title: "Graphic Design Essentials",
  reviewNote: "Draft lesson · to be reviewed by a JesTech subject reviewer",
  finale: "Course complete: now design a poster for a real event",
  lessons: [
    {
      title: "Design principles",
      summary: "Five principles that make any design look clear and professional.",
      minutes: 10,
      body: `Good design is not about decoration. It helps people understand a message quickly.

### Five principles
- **Contrast:** make important things stand out with size, colour or weight. Dark text on a light background is easy to read.
- **Alignment:** line things up. Text and images that share an edge look organised.
- **Repetition:** reuse the same colours, fonts and styles, so the design feels like one piece.
- **Proximity:** put related things close together, and unrelated things apart.
- **White space:** leave empty space around elements. Crowded designs are hard to read.

### Try it
Find a poster or flyer near you. Which principles does it use well? Which does it break? How would you fix it?

${DRAFT_NOTE}`,
      checklist: ["Name the five principles", "Find one poster and list what works", "Suggest one improvement using a principle"],
      video: {
        intro: "Welcome to Graphic Design Essentials. Good design helps people understand a message quickly.",
        scenes: [
          {
            art: "principles",
            heading: "Five principles",
            points: [
              ["Contrast", "Contrast makes important things stand out, with size, colour or weight."],
              ["Alignment", "Alignment: line things up, so the design looks organised."],
              ["Repetition", "Repetition: reuse the same colours and fonts."],
              ["Proximity", "Proximity: keep related things close together."],
              ["White space", "And white space: leave room to breathe. Crowded designs are hard to read."],
            ],
          },
        ],
      },
    },
    {
      title: "Colour",
      summary: "Choose a small colour palette and keep text readable.",
      minutes: 10,
      body: `Colour attracts attention and sets the mood, but too many colours confuse.

### Use a small palette
- One **main colour** (often a brand colour)
- One **accent colour** for buttons and highlights
- **Neutrals** (black, white, greys) for text and backgrounds

### Keep text readable
Text needs strong **contrast** with its background. Dark text on a light background, or white on a dark background, works best. Avoid light grey text, and text on busy photos.

### Colour has meaning
Red can mean danger or urgency, green growth or safety. Meanings can differ between cultures, so think about your audience.

### Check in real life
Many people see designs on phones outdoors in bright sun. Check your colours on a phone screen, and print a test before printing many copies.

${DRAFT_NOTE}`,
      checklist: ["Pick a main colour, an accent and neutrals", "Check text contrast", "Test the colours on a phone outdoors"],
      video: {
        intro: "Colour attracts attention, but too many colours confuse.",
        scenes: [
          {
            art: "colour",
            heading: "Use colour well",
            points: [
              ["A small palette", "Use a small palette: one main colour, one accent, and neutrals."],
              ["Strong contrast for text", "Give text strong contrast with its background."],
              ["Colour has meaning", "Remember that colours carry meaning, like red for urgency."],
              ["Check on a phone outdoors", "And check your colours on a phone, outdoors in bright light."],
            ],
          },
        ],
      },
    },
    {
      title: "Typography",
      summary: "Choose and size fonts so your message is easy to read.",
      minutes: 10,
      body: `**Typography** is how you choose and arrange text. It decides whether people read your message or skip it.

### Simple rules
- Use **one or two fonts** at most: for example, a bold font for headings and a simple one for body text.
- Create a clear **size hierarchy:** the headline is biggest, then subheadings, then body text.
- Keep body text **large enough** to read on a phone.
- Avoid writing whole paragraphs in CAPITAL LETTERS; they are harder to read.
- Keep lines of text short, and leave space between lines.

### Choose readable fonts
Simple sans-serif fonts such as Inter or Poppins are easy to read on screens. Decorative fonts are fine for a short title, never for long text.

### Free fonts
Google Fonts offers hundreds of free fonts you can use in print and online.

${DRAFT_NOTE}`,
      checklist: ["Use at most two fonts", "Set a clear headline, subheading and body size", "Check text is readable on a phone"],
      video: {
        intro: "Typography decides whether people read your message, or skip it.",
        scenes: [
          {
            art: "type",
            heading: "Readable text",
            points: [
              ["One or two fonts", "Use one or two fonts at most."],
              ["Clear size hierarchy", "Make a clear size hierarchy: headline biggest, then subheadings, then body text."],
              ["No paragraphs in capitals", "Avoid whole paragraphs in capital letters."],
              ["Simple fonts for long text", "Use simple fonts for long text, and decorative fonts only for short titles."],
            ],
          },
        ],
      },
    },
    {
      title: "Layout and hierarchy",
      summary: "Guide the eye: what people see first, second and third.",
      minutes: 10,
      body: `**Hierarchy** decides the order in which people notice things. Plan it before you start designing.

### Decide the order
1. **First:** the main message. "Free Health Check, Saturday 9am"
2. **Second:** key details. Where, who it is for, what to bring.
3. **Third:** the action and contact. "Call 0777 000 000" or "Scan to register"

### Tools for hierarchy
- **Size:** bigger is seen first.
- **Colour and contrast:** a bright accent pulls the eye.
- **Position:** people usually start at the top left or the centre.
- **Space:** a lot of empty space around an element makes it stand out.

### Use a grid
Divide your page into columns and margins, and line everything up with them. Grids make designs look calm and professional.

### Cut words
Most posters have too much text. Keep only what people need to act.

${DRAFT_NOTE}`,
      checklist: ["Write the first, second and third message", "Use size and colour to show order", "Line elements up on a grid", "Cut unnecessary words"],
      video: {
        intro: "Hierarchy decides what people notice first, second and third.",
        scenes: [
          {
            art: "hierarchy",
            heading: "Guide the eye",
            points: [
              ["First: the main message", "First, the main message. Make it the biggest thing."],
              ["Second: key details", "Second, the key details: where, when and who it is for."],
              ["Third: the action", "Third, the action: call, visit or scan."],
              ["Line up on a grid", "Line everything up on a grid, and cut words people don't need."],
            ],
          },
        ],
      },
    },
    {
      title: "Designing for phones",
      summary: "Design graphics that work on WhatsApp, Facebook and small screens.",
      minutes: 10,
      body: `Most people will see your design on a phone, often as a WhatsApp status, a Facebook post or a forwarded image.

### Choose the right size
- **Square (1080 × 1080 pixels):** Facebook and Instagram posts.
- **Vertical (1080 × 1920 pixels):** WhatsApp status and stories.
- Keep important text away from the very top and bottom, where apps place buttons.

### Make it work small
- Use **few words** and **big text.**
- Make the main message readable in a small preview, before people tap.
- Use strong contrast, since screens are often used outdoors.

### Keep files small
Export as JPG for photos or PNG for flat graphics, and keep files small (often under 500 KB) so they send quickly on mobile data.

### Test before you share
Send it to yourself on WhatsApp and look at it on a small phone.

${DRAFT_NOTE}`,
      checklist: ["Design one square and one vertical version", "Check the preview is readable", "Export a small file", "Test on WhatsApp"],
      video: {
        intro: "Most people will see your design on a phone. Let's design for that.",
        scenes: [
          {
            art: "mobile-design",
            heading: "Design for small screens",
            points: [
              ["Square or vertical", "Use square for posts, and vertical for WhatsApp status."],
              ["Few words, big text", "Use few words and big text."],
              ["Readable in the preview", "Make the main message readable in the small preview."],
              ["Small files, then test", "Export small files, then send it to yourself on WhatsApp to test."],
            ],
          },
        ],
      },
    },
    {
      title: "Free design tools",
      summary: "Professional results with free tools, and images you are allowed to use.",
      minutes: 10,
      body: `You do not need expensive software to make good designs.

### Free tools
- **Canva** (phone and web): templates for posters, flyers and social posts. Many features are free.
- **Figma** (web): powerful layout and interface design, with a free plan.
- **Inkscape** (computer, free and open source): logos and vector graphics.
- **GIMP** (computer, free and open source): photo editing.

### Templates: a starting point
Templates save time, but change them to fit your message: your colours, your photos and your words. Do not leave the template's sample text in.

### Use images legally
Do not copy photos from Google Images. Use your own photos, or free-to-use sites such as **Unsplash** and **Pexels**, and check each image's licence. Ask permission before using a photo of a person.

### Save your work
Name files clearly and keep the editable version, so you can update the design later.

${DRAFT_NOTE}`,
      checklist: ["Create an account on one free tool", "Customise a template with your own content", "Use only images you are allowed to use"],
      video: {
        intro: "You don't need expensive software to make good designs.",
        scenes: [
          {
            art: "tools",
            heading: "Free tools",
            points: [
              ["Canva for quick designs", "Canva has templates for posters and social posts, on phone and web."],
              ["Figma, Inkscape and GIMP", "Figma, Inkscape and GIMP are powerful free options on a computer."],
              ["Make templates your own", "Change templates to fit your message: your colours, photos and words."],
              ["Use images legally", "Use your own photos, or free sites like Unsplash, and check each licence."],
            ],
          },
        ],
      },
    },
    {
      title: "Portfolio",
      summary: "Show your best work so clients and employers can trust your skills.",
      minutes: 10,
      body: `A **portfolio** is a small collection of your best work. It is how clients and employers decide to hire you.

### Choose your best 5 to 8 pieces
Quality matters more than quantity. Include different kinds of work: a poster, a social media post, a logo, a flyer.

### Tell the story of each piece
- **The problem:** "A church needed more people at a health fair."
- **Your solution:** the design and why you made each choice.
- **The result,** if you know it: "200 people attended."

### Real work beats practice work
Offer to design for a local business, school or community group. Real projects, with permission to show them, are the most convincing.

### Share it simply
Put your portfolio online (for example a free Behance profile or a simple website), and keep a small PDF you can send on WhatsApp.

### Your project
Design a poster for a real local event or message, and submit the design file or a screenshot with a short explanation of your choices.

${DRAFT_NOTE}`,
      checklist: ["Choose your best 5 to 8 pieces", "Write the problem and solution for each", "Make a small PDF version", "Submit your poster project"],
      video: {
        intro: "A portfolio is how clients and employers decide to hire you.",
        scenes: [
          {
            art: "portfolio",
            heading: "Build your portfolio",
            points: [
              ["Your best five to eight", "Choose your best five to eight pieces, of different kinds."],
              ["Problem, solution, result", "For each piece, explain the problem, your solution and the result."],
              ["Real projects convince", "Real projects for local businesses are the most convincing."],
              ["Share it simply", "Share it online, and keep a small PDF to send on WhatsApp."],
            ],
          },
        ],
      },
    },
  ],
};
