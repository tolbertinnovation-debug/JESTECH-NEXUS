/**
 * Development / demo content. Names, figures and sample content are placeholders
 * (as the blueprint states) and must be replaced and reviewed before launch.
 */

type LessonSeed = { title: string; summary: string; body: string; checklist: string[]; minutes?: number };
type ModuleSeed = { title: string; lessons: LessonSeed[] };
export type CourseSeed = {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  category: "Technology" | "Agriculture" | "Education" | "Entrepreneurship";
  level: "BEGINNER" | "INTERMEDIATE";
  format: "ONLINE" | "HYBRID" | "OFFLINE_GUIDE";
  icon: string;
  outcomes: string;
  isPilot?: boolean;
  isFeatured?: boolean;
  reviewNote?: string;
  guideSlug?: string;
  activity: { title: string; prompt: string };
  modules: ModuleSeed[];
};

/** Quick helper for courses whose lessons are still outlines. */
const outline = (titles: string[], topic: string): ModuleSeed[] =>
  titles.map((title) => ({
    title,
    lessons: [
      {
        title,
        summary: `Key ideas and a short practice task on ${title.toLowerCase()}.`,
        body: `This lesson introduces **${title.toLowerCase()}** as part of ${topic}.\n\nFull lesson content is being written and reviewed by the JesTech team. Use the checklist to practise what you learn.`,
        checklist: ["Read the lesson summary", "Try the short practice task", "Note one question for your mentor"],
      },
    ],
  }));

const DRAFT_NOTE =
  "Draft lesson for the pilot. It must be checked by qualified agricultural reviewers and tested with farmers before launch.";

export const courseSeeds: CourseSeed[] = [
  {
    slug: "grow-cassava",
    title: "How to Grow Cassava",
    summary:
      "Step-by-step lessons, checklists and a downloadable field guide for beginner farmers, young people and community groups.",
    audience:
      "For beginner farmers, young people, agricultural learners and community groups. Short lessons, images, checklists and a downloadable guide.",
    category: "Agriculture",
    level: "BEGINNER",
    format: "HYBRID",
    icon: "leaf",
    outcomes:
      "Plan a site and prepare land. Plant and maintain a crop. Manage weeds and pests. Harvest and handle produce for market.",
    isPilot: true,
    isFeatured: true,
    reviewNote: "Content is checked by qualified agricultural reviewers before it is published.",
    guideSlug: "cassava-field-guide",
    activity: {
      title: "Plan your cassava plot",
      prompt:
        "Draw or photograph a simple plan of a plot you could plant: where it is, the soil, how you will prepare the land, spacing, and when you will plant. Share a photo, a Google Drive link or a short written plan.",
    },
    modules: [
      {
        title: "Site and soil selection",
        lessons: [
          {
            title: "Choosing a good site",
            summary: "Pick land where cassava can grow well and roots can swell.",
            body: `Cassava grows in many soils, but it does best in **loose, well-drained soil** with plenty of sun.\n\n### What to look for\n- Land that does not stay flooded after rain — standing water rots the roots\n- Loamy or sandy-loam soil that crumbles in your hand\n- Full sun for most of the day\n- Easy access for weeding, harvesting and carrying produce\n\n### Avoid\n- Swampy or low-lying land\n- Very stony or hard, compacted ground\n- Fields where diseased cassava grew last season\n\n${DRAFT_NOTE}`,
            checklist: ["Walk the land after rain and check for standing water", "Squeeze a handful of soil — it should crumble", "Check the site gets sun most of the day"],
          },
        ],
      },
      {
        title: "Suitable planting materials",
        lessons: [
          {
            title: "Healthy stems make healthy plants",
            summary: "Select clean, mature stems and cut them correctly.",
            body: `Cassava is planted from **stem cuttings**, not seeds. Good cuttings are the cheapest way to a good harvest.\n\n### Choosing stems\n- Use mature stems from healthy plants (about 8–12 months old)\n- Choose stems without yellow, twisted or mottled leaves — signs of disease\n- Ask your extension worker or agricultural office about improved local varieties\n\n### Cutting\n- Cut pieces about **20–25 cm long** with 5–7 nodes (buds)\n- Use a sharp cutlass so the ends are clean, not crushed\n- Plant within a few days of cutting and keep them in the shade until then\n\n${DRAFT_NOTE}`,
            checklist: ["Select stems from healthy-looking plants", "Cut 20–25 cm pieces with a sharp tool", "Keep cuttings shaded and plant within a few days"],
          },
        ],
      },
      {
        title: "Land preparation",
        lessons: [
          {
            title: "Preparing the land",
            summary: "Clear the site, mark rows and prepare mounds or ridges.",
            body: `Good preparation makes planting, weeding and harvesting easier.\n\n### Steps\n- **Clear the site** of bush, stumps and large stones\n- **Mark planting rows** so plants are evenly spaced\n- **Prepare mounds or ridges** — these help water drain and make roots easier to harvest, especially on heavier soils\n\nOn loose, well-drained soil, cassava can also be planted on flat land.\n\n${DRAFT_NOTE}`,
            checklist: ["Clear the site", "Mark planting rows", "Prepare mounds or ridges"],
          },
        ],
      },
      {
        title: "Planting",
        lessons: [
          {
            title: "Planting your cuttings",
            summary: "When, how deep and how far apart to plant.",
            body: `### When\nPlant at the **start of the rainy season** so cuttings have moisture to root.\n\n### How\n- Space plants about **1 metre apart** in each direction\n- Push the cutting into the soil with the buds pointing up\n- Bury about two-thirds of the cutting, either upright or at a slant\n\n### Tip\nKeep a few spare cuttings to replace any that do not sprout after 2–3 weeks (gap filling).\n\n${DRAFT_NOTE}`,
            checklist: ["Plant at the start of the rains", "Space plants about 1 m apart", "Bury two-thirds of each cutting, buds up", "Check for gaps after 2–3 weeks"],
          },
        ],
      },
      {
        title: "Crop maintenance",
        lessons: [
          {
            title: "Caring for young cassava",
            summary: "The first months decide the harvest.",
            body: `Young cassava grows slowly and needs help in the **first 3–4 months**.\n\n- Fill gaps where cuttings failed\n- Keep the field weeded until the leaves cover the ground\n- Where available, add compost or manure to improve poor soil\n- Walk the field each week and look for sick plants\n\n${DRAFT_NOTE}`,
            checklist: ["Fill any gaps", "Weed regularly in the first months", "Inspect plants every week"],
          },
        ],
      },
      {
        title: "Weed and pest management",
        lessons: [
          {
            title: "Spotting and managing problems",
            summary: "Recognise common weeds, pests and diseases early.",
            body: `### Weeds\nWeeds compete with cassava for light, water and nutrients. Weed early and often while plants are young.\n\n### Common problems\n- **Cassava mosaic disease** — yellow, mottled, twisted leaves. Remove and destroy badly affected plants and never use their stems for planting.\n- **Mealybugs and green mites** — small insects on leaves and shoot tips, more common in the dry season.\n\nIf many plants are affected, contact your local agricultural extension officer for advice.\n\n${DRAFT_NOTE}`,
            checklist: ["Weed while plants are young", "Learn the signs of mosaic disease", "Remove badly diseased plants", "Know who your extension officer is"],
          },
        ],
      },
      {
        title: "Harvesting",
        lessons: [
          {
            title: "When and how to harvest",
            summary: "Harvest at the right time and avoid damaging roots.",
            body: `Most varieties are ready **9–18 months** after planting, depending on the variety and conditions.\n\n- Dig a test plant to check root size\n- Loosen the soil around the plant, then pull gently from the base of the stem\n- Avoid cutting or bruising roots — damaged roots spoil faster\n- Fresh roots spoil within **2–3 days**, so harvest only what you can sell or process quickly\n\n${DRAFT_NOTE}`,
            checklist: ["Dig a test plant first", "Loosen soil before pulling", "Harvest only what you can sell or process soon"],
          },
        ],
      },
      {
        title: "Post-harvest handling",
        lessons: [
          {
            title: "Handling and processing",
            summary: "Keep roots fresh and add value by processing.",
            body: `Because fresh roots spoil quickly, many farmers process cassava into longer-lasting products such as **gari, fufu or flour**.\n\n- Keep harvested roots in the shade and move them quickly\n- Peel and wash roots with clean water\n- Follow proper processing steps (grating, fermenting, pressing, drying or roasting) — these also make cassava safe to eat\n\n${DRAFT_NOTE}`,
            checklist: ["Keep roots shaded after harvest", "Process or sell within 2–3 days", "Use clean water and tools"],
          },
        ],
      },
      {
        title: "Basic marketing",
        lessons: [
          {
            title: "Selling your produce",
            summary: "Plan where and how you will sell before you harvest.",
            body: `### Before harvest\n- Ask buyers at nearby markets what they want: fresh roots, gari, fufu or flour\n- Compare prices and transport costs\n- Consider selling together with other farmers to reach bigger buyers\n\n### Keep simple records\nWrite down what you spend and what you earn. Records help you plan next season and show what works.\n\n${DRAFT_NOTE}`,
            checklist: ["Talk to at least two buyers", "Decide fresh or processed", "Start a simple record book"],
          },
        ],
      },
    ],
  },
  {
    slug: "ai-literacy",
    title: "AI Literacy and Applied AI",
    summary: "Understand what AI can and cannot do, and use AI tools responsibly for study and work.",
    audience: "For students, teachers and young professionals who are new to AI.",
    category: "Technology",
    level: "BEGINNER",
    format: "ONLINE",
    icon: "cpu",
    outcomes: "Explain how AI tools work at a high level. Use AI assistants safely. Spot errors and bias.",
    activity: {
      title: "Solve a local problem with an AI assistant",
      prompt: "Use an AI assistant to help plan a solution to a small local problem. Share what you asked, what it answered, and what you checked or corrected.",
    },
    modules: outline(
      ["What AI is", "Talking to AI assistants", "Checking AI answers", "AI for study and work", "Privacy and safety", "Your AI project"],
      "AI literacy",
    ),
  },
  {
    slug: "web-development-fundamentals",
    title: "Web Development Fundamentals",
    summary: "Build and publish your first responsive website with HTML, CSS and a little JavaScript.",
    audience: "For beginners who want to build websites. A laptop or a phone with a code editor app is enough to start.",
    category: "Technology",
    level: "BEGINNER",
    format: "ONLINE",
    icon: "layout",
    outcomes: "Write semantic HTML. Style pages with CSS. Make layouts responsive. Publish a live site.",
    isFeatured: true,
    activity: {
      title: "Publish a personal or community website",
      prompt: "Build a small website for yourself, a local business or a community group and publish it. Submit the live link and your GitHub repository.",
    },
    modules: outline(
      ["How the web works", "HTML structure", "CSS basics", "Layouts with flexbox", "Responsive layouts", "Forms and accessibility", "A little JavaScript", "Publishing your site"],
      "web development",
    ),
  },
  {
    slug: "cybersecurity-awareness",
    title: "Cybersecurity Awareness",
    summary: "Protect your phone, accounts and money from common online threats.",
    audience: "For everyone who uses a phone, mobile money or social media.",
    category: "Technology",
    level: "BEGINNER",
    format: "ONLINE",
    icon: "shield",
    outcomes: "Create strong passwords. Recognise scams and phishing. Secure your phone and accounts.",
    activity: {
      title: "Secure your digital life",
      prompt: "Complete the security checklist on your own phone and accounts. Describe three changes you made (do not share passwords or private details).",
    },
    modules: outline(["Why security matters", "Passwords and 2-step verification", "Scams and phishing", "Mobile money safety", "Securing your phone"], "cybersecurity"),
  },
  {
    slug: "data-analysis-basics",
    title: "Data Analysis Basics",
    summary: "Collect, clean and summarise data with spreadsheets to answer real questions.",
    audience: "For students, NGO staff and small business owners.",
    category: "Technology",
    level: "BEGINNER",
    format: "ONLINE",
    icon: "data",
    outcomes: "Organise data in a spreadsheet. Calculate summaries. Build simple charts. Tell a story with data.",
    activity: {
      title: "Answer a question with data",
      prompt: "Collect a small dataset (for example market prices for a week), analyse it in a spreadsheet and share a link with your chart and conclusion.",
    },
    modules: outline(["Asking good questions", "Spreadsheets basics", "Cleaning data", "Summaries and formulas", "Charts", "Presenting findings"], "data analysis"),
  },
  {
    slug: "graphic-design-essentials",
    title: "Graphic Design Essentials",
    summary: "Design clear posters, social media graphics and simple brand materials.",
    audience: "For young creatives, small businesses and community organisers.",
    category: "Technology",
    level: "BEGINNER",
    format: "ONLINE",
    icon: "pen",
    outcomes: "Apply layout, colour and type basics. Design for print and phone screens. Build a small portfolio.",
    activity: {
      title: "Design a community poster",
      prompt: "Design a poster for a real local event or message. Submit the design file or a screenshot and explain your choices.",
    },
    modules: outline(["Design principles", "Colour", "Typography", "Layout and hierarchy", "Designing for phones", "Free design tools", "Portfolio"], "graphic design"),
  },
  {
    slug: "start-a-small-business",
    title: "Starting a Small Business",
    summary: "Turn an idea into a simple, tested business plan with costs, pricing and customers.",
    audience: "For young people, farmers and anyone planning a small business.",
    category: "Entrepreneurship",
    level: "BEGINNER",
    format: "HYBRID",
    icon: "bulb",
    outcomes: "Describe your customer. Cost and price a product. Keep simple records. Write a one-page plan.",
    guideSlug: "small-business-workbook",
    activity: {
      title: "One-page business plan",
      prompt: "Write a one-page plan for a small business idea using the workbook. Share it as a document or photo.",
    },
    modules: outline(["Finding an idea", "Knowing your customer", "Costs and pricing", "Record keeping", "Your one-page plan"], "starting a small business"),
  },
  {
    slug: "digital-literacy-for-teachers",
    title: "Digital Literacy for Teachers",
    summary: "Use phones and computers confidently to plan lessons, find resources and support learners.",
    audience: "For teachers and teacher-training students.",
    category: "Education",
    level: "BEGINNER",
    format: "OFFLINE_GUIDE",
    icon: "book",
    outcomes: "Find and judge digital resources. Plan lessons with simple tools. Teach safe internet use.",
    guideSlug: "teachers-guide-digital-literacy",
    activity: {
      title: "Plan a digital-literacy lesson",
      prompt: "Plan one lesson that teaches a digital skill to your learners. Share your lesson plan.",
    },
    modules: outline(["Devices and files", "Finding good resources", "Lesson planning tools", "Teaching online safety", "Low-data teaching"], "digital literacy for teachers"),
  },
];

export const resourceSeeds = [
  {
    slug: "cassava-field-guide",
    title: "Cassava Production Field Guide",
    description: "A printable, step-by-step guide that follows the How to Grow Cassava course, with checklists for each stage.",
    subject: "Agriculture",
    kind: "Field guide",
    audiences: ["Farmers", "Students"],
    format: "PDF" as const,
    source: "JesTech original",
    publishedOn: null,
    licence: "OWNED" as const,
    licenceNote: "© JesTech. Free to download and print for personal and community learning.",
    fileUrl: "/files/cassava-field-guide.pdf",
    reviewedBy: "Subject reviewer (pending)",
  },
  {
    slug: "teachers-guide-digital-literacy",
    title: "Teacher's Guide to Digital Literacy",
    description: "Teaching materials and lesson ideas for introducing digital skills in the classroom.",
    subject: "Education",
    kind: "Teaching materials",
    audiences: ["Teachers"],
    format: "PDF" as const,
    source: "JesTech original",
    publishedOn: null,
    licence: "PERMISSION" as const,
    licenceNote: "Shared with permission for non-commercial educational use.",
    fileUrl: "/files/teachers-guide-digital-literacy.pdf",
    reviewedBy: "Education lead",
  },
  {
    slug: "small-business-workbook",
    title: "Starting a Small Business: Workbook",
    description: "Learning notes and worksheets for costing, pricing and planning a small business.",
    subject: "Entrepreneurship",
    kind: "Learning notes",
    audiences: ["Students", "Farmers"],
    format: "EPUB" as const,
    source: "JesTech original",
    publishedOn: null,
    licence: "OPEN_LICENCE" as const,
    licenceNote: "Creative Commons Attribution 4.0 (CC BY 4.0).",
    fileUrl: "/files/small-business-workbook.epub",
    reviewedBy: "Subject reviewer",
  },
  {
    slug: "intro-cybersecurity-awareness",
    title: "Introduction to Cybersecurity Awareness",
    description: "A short guide to staying safe online: passwords, scams, mobile money and phone security.",
    subject: "Technology",
    kind: "Guide",
    audiences: ["Students", "Teachers"],
    format: "PDF" as const,
    source: "JesTech original",
    publishedOn: null,
    licence: "OWNED" as const,
    licenceNote: "© JesTech. Free to download for personal learning.",
    fileUrl: "/files/intro-cybersecurity-awareness.pdf",
    reviewedBy: "Tech lead",
  },
];

export const expertSeeds = [
  {
    slug: "sample-agriculture-specialist",
    name: "Sample Expert A",
    title: "Agriculture specialist",
    area: "Agriculture",
    tags: ["Crop production", "Training"],
    bio: "Sample profile for development. Real expert profiles appear only after identity, qualifications and consent are verified by an admin.",
  },
  {
    slug: "sample-software-engineer",
    name: "Sample Expert B",
    title: "Software engineer",
    area: "Software and IT",
    tags: ["Web", "Systems"],
    bio: "Sample profile for development. Real expert profiles appear only after identity, qualifications and consent are verified by an admin.",
  },
  {
    slug: "sample-education-consultant",
    name: "Sample Expert C",
    title: "Education consultant",
    area: "Education",
    tags: ["Curriculum", "Digital literacy"],
    bio: "Sample profile for development. Real expert profiles appear only after identity, qualifications and consent are verified by an admin.",
  },
];

export const challengeSeeds = [
  {
    slug: "reduce-cassava-post-harvest-loss",
    title: "Reduce post-harvest loss of fresh cassava",
    context:
      "Fresh cassava roots spoil within a few days of harvest, so farmers often sell at low prices or lose produce before it reaches market.",
    goals: "Low-cost ways to store, transport or process roots faster, that small farming groups can run themselves.",
    community: "Farming communities (sample challenge)",
  },
  {
    slug: "offline-learning-for-schools",
    title: "Learning materials for schools without reliable internet",
    context: "Many schools have phones or a shared computer but weak or expensive internet.",
    goals: "Ways to share and update learning materials offline, cheaply and safely.",
    community: "Schools (sample challenge)",
  },
];

export const innovationSeeds = [
  {
    type: "PROTOTYPE" as const,
    title: "Learner prototype: market price tracker",
    summary: "Sample showcase entry. Projects built by learners and experts appear here after review.",
  },
];
