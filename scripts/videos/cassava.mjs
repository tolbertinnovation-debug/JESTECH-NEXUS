/**
 * Narration and scenes for the "How to Grow Cassava" lesson videos.
 * Each scene shows an illustration and reveals one point per narrated line.
 * Content mirrors the lesson text in src/db/seed-data.ts and is a draft pending
 * review by agricultural specialists (shown on the end card of every video).
 */
export const course = { slug: "grow-cassava", title: "How to Grow Cassava" };

export const lessons = [
  {
    slug: "choosing-a-good-site",
    module: 1,
    title: "Choosing a good site",
    intro: "Welcome to How to Grow Cassava. In this lesson, you will learn how to choose a good place to plant.",
    scenes: [
      {
        art: "site",
        heading: "What to look for",
        points: [
          ["Loose, well-drained soil", "Cassava grows best in loose soil that drains well. Roots need room to swell."],
          ["No standing water", "Choose land that does not stay flooded after rain. Standing water rots the roots."],
          ["Full sun", "The field should get sun for most of the day."],
          ["Easy to reach", "Pick a place you can reach easily for weeding, harvesting and carrying produce."],
        ],
      },
      {
        art: "avoid",
        heading: "Avoid",
        points: [
          ["Swampy, low-lying land", "Avoid swampy or low-lying land."],
          ["Hard or stony ground", "Avoid very stony or hard, compacted ground."],
          ["Fields with sick cassava", "And avoid fields where diseased cassava grew last season."],
        ],
      },
    ],
    checklist: ["Walk the land after rain", "Squeeze the soil: it should crumble", "Check for sun most of the day"],
  },
  {
    slug: "healthy-stems-make-healthy-plants",
    module: 2,
    title: "Healthy stems make healthy plants",
    intro: "Cassava is planted from stem cuttings, not seeds. Good cuttings are the cheapest way to a good harvest.",
    scenes: [
      {
        art: "stems",
        heading: "Choosing stems",
        points: [
          ["Mature, healthy plants", "Take stems from healthy plants that are about eight to twelve months old."],
          ["No yellow or twisted leaves", "Do not use stems from plants with yellow, twisted or spotted leaves. These are signs of disease."],
          ["Ask about improved varieties", "Ask your extension worker about improved local varieties."],
        ],
      },
      {
        art: "cutting",
        heading: "Cutting",
        points: [
          ["20 to 25 cm long", "Cut pieces about twenty to twenty-five centimetres long, with five to seven buds."],
          ["Use a sharp cutlass", "Use a sharp cutlass, so the ends are clean, not crushed."],
          ["Keep in the shade", "Keep cuttings in the shade, and plant them within a few days."],
        ],
      },
    ],
    checklist: ["Select stems from healthy plants", "Cut 20 to 25 cm pieces", "Plant within a few days"],
  },
  {
    slug: "preparing-the-land",
    module: 3,
    title: "Preparing the land",
    intro: "Good preparation makes planting, weeding and harvesting easier.",
    scenes: [
      {
        art: "mounds",
        heading: "Three steps",
        points: [
          ["Clear the site", "First, clear the site of bush, stumps and large stones."],
          ["Mark planting rows", "Next, mark planting rows, so your plants are evenly spaced."],
          ["Make mounds or ridges", "Then make mounds or ridges. They help water drain, and make the roots easier to harvest."],
          ["Flat land is fine on loose soil", "On loose, well-drained soil, cassava can also be planted on flat land."],
        ],
      },
    ],
    checklist: ["Clear the site", "Mark planting rows", "Prepare mounds or ridges"],
  },
  {
    slug: "planting-your-cuttings",
    module: 4,
    title: "Planting your cuttings",
    intro: "Now it is time to plant. Timing, depth and spacing all matter.",
    scenes: [
      {
        art: "rain",
        heading: "When",
        points: [["Start of the rainy season", "Plant at the start of the rainy season, so cuttings have moisture to grow roots."]],
      },
      {
        art: "planting",
        heading: "How",
        points: [
          ["About 1 metre apart", "Space plants about one metre apart in each direction."],
          ["Buds pointing up", "Push each cutting into the soil with the buds pointing up."],
          ["Bury two-thirds", "Bury about two-thirds of the cutting, upright or at a slant."],
          ["Fill the gaps", "After two to three weeks, replace any cuttings that did not sprout."],
        ],
      },
    ],
    checklist: ["Plant at the start of the rains", "Space about 1 m apart", "Fill gaps after 2 to 3 weeks"],
  },
  {
    slug: "caring-for-young-cassava",
    module: 5,
    title: "Caring for young cassava",
    intro: "Young cassava grows slowly. The first three to four months decide your harvest.",
    scenes: [
      {
        art: "care",
        heading: "The first months",
        points: [
          ["Fill gaps", "Fill any gaps where cuttings failed."],
          ["Keep the field weeded", "Keep the field weeded until the leaves cover the ground."],
          ["Add compost on poor soil", "Where you can, add compost or manure to improve poor soil."],
          ["Check every week", "Walk the field every week, and look for sick plants."],
        ],
      },
    ],
    checklist: ["Fill any gaps", "Weed in the first months", "Inspect plants every week"],
  },
  {
    slug: "spotting-and-managing-problems",
    module: 6,
    title: "Spotting and managing problems",
    intro: "Weeds, pests and diseases can cut your harvest. Spot them early.",
    scenes: [
      {
        art: "weeds",
        heading: "Weeds",
        points: [["Weed early and often", "Weeds take light, water and food from your cassava. Weed early and often while plants are young."]],
      },
      {
        art: "mosaic",
        heading: "Common problems",
        points: [
          ["Mosaic disease", "Cassava mosaic disease makes leaves yellow, spotted and twisted."],
          ["Remove sick plants", "Remove and destroy badly affected plants. Never use their stems for planting."],
          ["Mealybugs and green mites", "Mealybugs and green mites are small insects on leaves and shoot tips, more common in the dry season."],
          ["Ask your extension officer", "If many plants are affected, ask your local agricultural extension officer for advice."],
        ],
      },
    ],
    checklist: ["Weed while plants are young", "Learn the signs of mosaic disease", "Know your extension officer"],
  },
  {
    slug: "when-and-how-to-harvest",
    module: 7,
    title: "When and how to harvest",
    intro: "Harvest at the right time, and handle the roots with care.",
    scenes: [
      {
        art: "harvest",
        heading: "Harvesting",
        points: [
          ["9 to 18 months", "Most varieties are ready nine to eighteen months after planting."],
          ["Dig a test plant", "Dig up one test plant first, to check the size of the roots."],
          ["Loosen the soil first", "Loosen the soil around the plant, then pull gently from the base of the stem."],
          ["Don't cut or bruise roots", "Avoid cutting or bruising the roots. Damaged roots spoil faster."],
        ],
      },
      {
        art: "clock",
        heading: "Roots spoil fast",
        points: [["Use within 2 to 3 days", "Fresh roots spoil within two to three days. Harvest only what you can sell or process quickly."]],
      },
    ],
    checklist: ["Dig a test plant first", "Loosen soil before pulling", "Harvest only what you can use"],
  },
  {
    slug: "handling-and-processing",
    module: 8,
    title: "Handling and processing",
    intro: "Processing keeps cassava longer, and can earn you more.",
    scenes: [
      {
        art: "processing",
        heading: "Keep it fresh, add value",
        points: [
          ["Keep roots in the shade", "Keep harvested roots in the shade, and move them quickly."],
          ["Peel and wash", "Peel the roots, and wash them with clean water."],
          ["Gari, fufu or flour", "Many farmers process cassava into gari, fufu or flour, which last much longer."],
          ["Process properly", "Follow proper processing steps, like grating, fermenting, pressing, and drying or roasting. These also make cassava safe to eat."],
        ],
      },
    ],
    checklist: ["Keep roots shaded", "Process or sell within 2 to 3 days", "Use clean water and tools"],
  },
  {
    slug: "selling-your-produce",
    module: 9,
    title: "Selling your produce",
    intro: "Plan where and how you will sell, before you harvest.",
    scenes: [
      {
        art: "market",
        heading: "Before harvest",
        points: [
          ["Ask buyers what they want", "Ask buyers at nearby markets what they want: fresh roots, gari, fufu or flour."],
          ["Compare prices and transport", "Compare prices, and the cost of transport."],
          ["Sell together", "Think about selling together with other farmers, to reach bigger buyers."],
        ],
      },
      {
        art: "records",
        heading: "Keep simple records",
        points: [["Write down costs and income", "Write down what you spend and what you earn. Records help you plan next season."]],
      },
    ],
    checklist: ["Talk to at least two buyers", "Decide: fresh or processed", "Start a record book"],
  },
];
