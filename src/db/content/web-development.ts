import { DRAFT_NOTE, type CourseContent } from "./types";

export const webDevelopment: CourseContent = {
  slug: "web-development-fundamentals",
  title: "Web Development Fundamentals",
  reviewNote: "Draft lesson · to be reviewed by a JesTech subject reviewer",
  finale: "Course complete: now publish your own website",
  lessons: [
    {
      title: "How the web works",
      summary: "What happens between typing an address and seeing a page.",
      minutes: 8,
      body: `When you open a website on your phone, a few things happen in less than a second.

### The journey of a web page
- You type an address (a **URL**), such as \`https://example.com\`.
- Your **browser** (Chrome, Firefox, Opera Mini…) asks the internet where that address lives.
- A computer called a **server** sends back files.
- Your browser reads the files and draws the page.

### Three languages build every page
- **HTML** gives the content and structure: headings, text, images, links.
- **CSS** controls the look: colours, fonts, spacing, layout.
- **JavaScript** adds behaviour: buttons that respond, menus that open.

### Phones first
Most people in Liberia use the web on a phone, often on slow or expensive data. Good web developers keep pages small and easy to use on a small screen.

### What you need to start
A phone or computer, a free code editor (for example Visual Studio Code on a computer, or a code editor app on a phone), and a browser.

${DRAFT_NOTE}`,
      checklist: ["Explain what a browser and a server do", "Name the job of HTML, CSS and JavaScript", "Install a code editor"],
      video: {
        intro: "Welcome to Web Development Fundamentals. First: what happens when you open a website?",
        scenes: [
          {
            art: "web-how",
            heading: "The journey of a page",
            points: [
              ["You type an address", "You type an address, called a URL, into your browser."],
              ["A server sends files", "A computer called a server sends back the files for that page."],
              ["The browser draws the page", "Your browser reads the files, and draws the page on your screen."],
            ],
          },
          {
            art: "web-three",
            heading: "Three languages",
            points: [
              ["HTML: content", "HTML gives the content and structure: headings, text and images."],
              ["CSS: the look", "CSS controls the look: colours, fonts and layout."],
              ["JavaScript: behaviour", "And JavaScript adds behaviour, like buttons that respond."],
            ],
          },
        ],
      },
    },
    {
      title: "HTML structure",
      summary: "Write your first web page with headings, text, links and images.",
      minutes: 12,
      body: `HTML uses **tags** in angle brackets to mark up content. Most tags come in pairs: an opening tag and a closing tag with a slash.

### Your first page
Create a file called \`index.html\` and type:

\`\`\`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Mary's Tailoring</title>
  </head>
  <body>
    <h1>Mary's Tailoring</h1>
    <p>School uniforms and dresses in Paynesville.</p>
    <a href="tel:+231000000000">Call us</a>
  </body>
</html>
\`\`\`

Open the file in your browser to see it.

### Common tags
- \`<h1>\` to \`<h6>\`: headings, from most to least important
- \`<p>\`: a paragraph
- \`<a href="…">\`: a link
- \`<img src="photo.jpg" alt="…">\`: an image. The **alt** text describes it for people who cannot see it
- \`<ul>\` and \`<li>\`: a bulleted list

### Good habits
Use one \`<h1>\` per page, keep headings in order, and always write alt text.

${DRAFT_NOTE}`,
      checklist: ["Create index.html with a heading and paragraph", "Add a link and an image with alt text", "Open the page in your browser"],
      video: {
        intro: "HTML uses tags to mark up content. Let's write your first page.",
        scenes: [
          {
            art: "html",
            heading: "Tags in pairs",
            points: [
              ["Opening and closing tags", "Most tags come in pairs: an opening tag, and a closing tag with a slash."],
              ["Headings and paragraphs", "Use h1 for the main heading, and p for paragraphs."],
              ["Links and images", "Use a for links, and img for images."],
              ["Always write alt text", "Always add alt text, describing each image for people who cannot see it."],
            ],
          },
        ],
      },
    },
    {
      title: "CSS basics",
      summary: "Add colour, fonts and spacing with CSS.",
      minutes: 12,
      body: `CSS describes how HTML should look. A CSS **rule** has a **selector** (what to style) and **declarations** (how to style it).

\`\`\`
h1 {
  color: #FF6D00;
  font-size: 32px;
}
p {
  line-height: 1.6;
}
\`\`\`

### Connect your stylesheet
Save your CSS in \`style.css\` and link it inside \`<head>\`:

\`\`\`
<link rel="stylesheet" href="style.css">
\`\`\`

### The box model
Every element is a box:
- **content**: the text or image
- **padding**: space inside the box
- **border**: the edge
- **margin**: space outside the box

### Classes
Give elements a class to style them separately: \`<p class="price">\` and in CSS \`.price { font-weight: bold; }\`.

${DRAFT_NOTE}`,
      checklist: ["Create style.css and link it", "Change a heading colour and font size", "Use padding and margin on a box", "Style an element with a class"],
      video: {
        intro: "CSS describes how your HTML should look.",
        scenes: [
          {
            art: "css",
            heading: "CSS rules",
            points: [
              ["Selector: what to style", "A CSS rule starts with a selector: what to style, like h1."],
              ["Declarations: how", "Then declarations: how to style it, like colour and font size."],
              ["Link style.css", "Save it in style dot css, and link it inside the head."],
            ],
          },
          {
            art: "box-model",
            heading: "The box model",
            points: [
              ["Every element is a box", "Every element is a box with content, padding, a border and a margin."],
              ["Padding inside, margin outside", "Padding is space inside the box. Margin is space outside it."],
            ],
          },
        ],
      },
    },
    {
      title: "Layouts with flexbox",
      summary: "Place items side by side and space them neatly with flexbox.",
      minutes: 12,
      body: `**Flexbox** is the easiest way to place items in a row or a column.

\`\`\`
.cards {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
\`\`\`

### What each line does
- \`display: flex\` turns the container into a flex layout. Its children sit in a row.
- \`gap\` adds space between the items.
- \`justify-content\` spreads items along the row: \`flex-start\`, \`center\` or \`space-between\`.
- \`align-items\` lines items up across the row: \`center\` lines them up in the middle.
- \`flex-wrap: wrap\` lets items move to the next line when there is no room, which is important on phones.

### Columns
Add \`flex-direction: column\` to stack items vertically.

${DRAFT_NOTE}`,
      checklist: ["Make a row of three cards with display: flex", "Add a gap between them", "Centre them with justify-content", "Let them wrap on small screens"],
      video: {
        intro: "Flexbox is the easiest way to place items in a row or a column.",
        scenes: [
          {
            art: "flex",
            heading: "Flexbox",
            points: [
              ["display: flex", "Set display flex on a container, and its children sit in a row."],
              ["gap adds space", "Gap adds even space between the items."],
              ["justify-content spreads them", "Justify content spreads items along the row, for example space between."],
              ["flex-wrap for phones", "And flex wrap lets items move to the next line on small screens."],
            ],
          },
        ],
      },
    },
    {
      title: "Responsive layouts",
      summary: "Make one page that works on phones, tablets and computers.",
      minutes: 12,
      body: `A **responsive** page changes its layout to fit the screen.

### Step 1: the viewport tag
Without this line in \`<head>\`, phones show a tiny zoomed-out page:

\`\`\`
<meta name="viewport" content="width=device-width, initial-scale=1">
\`\`\`

### Step 2: design mobile-first
Write your CSS for phones first: one column, big readable text, large buttons. Then add rules for bigger screens.

### Step 3: media queries
\`\`\`
.cards { display: flex; flex-direction: column; gap: 16px; }

@media (min-width: 700px) {
  .cards { flex-direction: row; }
}
\`\`\`

### Flexible images
\`img { max-width: 100%; height: auto; }\` stops images spilling off small screens.

### Test it
Open your page on a real phone, and use your browser's device mode on a computer.

${DRAFT_NOTE}`,
      checklist: ["Add the viewport meta tag", "Write phone styles first", "Add one media query for wider screens", "Test on a real phone"],
      video: {
        intro: "A responsive page changes its layout to fit any screen.",
        scenes: [
          {
            art: "responsive",
            heading: "Responsive design",
            points: [
              ["Add the viewport tag", "First, add the viewport meta tag, or phones show a tiny zoomed-out page."],
              ["Design for phones first", "Design for phones first: one column, big text, large buttons."],
              ["Media queries for bigger screens", "Then use media queries to change the layout on bigger screens."],
              ["Test on a real phone", "And always test on a real phone."],
            ],
          },
        ],
      },
    },
    {
      title: "Forms and accessibility",
      summary: "Build forms people can use, including people with disabilities.",
      minutes: 12,
      body: `Forms let visitors send you information. Accessible forms work for everyone, including people using screen readers or only a keyboard.

\`\`\`
<form action="https://formspree.io/f/your-id" method="post">
  <label for="name">Your name</label>
  <input id="name" name="name" required>

  <label for="phone">Phone number</label>
  <input id="phone" name="phone" type="tel">

  <button type="submit">Send</button>
</form>
\`\`\`

### Rules that help everyone
- Every input needs a \`<label>\` linked with \`for\` and \`id\`.
- Use the right input **type** (\`tel\`, \`email\`, \`number\`) so phones show the right keyboard.
- Make buttons big enough to tap: at least 44 pixels high.
- Use strong colour contrast between text and background.
- Make sure everything works with the keyboard alone (Tab and Enter).

A form on a static site needs a service to receive the messages, such as a free form service.

${DRAFT_NOTE}`,
      checklist: ["Build a form with labelled inputs", "Use tel or email input types", "Check you can use it with the keyboard only"],
      video: {
        intro: "Forms let visitors send you information. Let's make them work for everyone.",
        scenes: [
          {
            art: "form",
            heading: "Accessible forms",
            points: [
              ["A label for every input", "Give every input a label, linked with for and id."],
              ["The right input type", "Use the right type, like tel or email, so phones show the right keyboard."],
              ["Big buttons, strong contrast", "Make buttons big enough to tap, and keep strong colour contrast."],
              ["Works with a keyboard", "And make sure the form works with a keyboard alone."],
            ],
          },
        ],
      },
    },
    {
      title: "A little JavaScript",
      summary: "Make a button respond with a few lines of JavaScript.",
      minutes: 12,
      body: `JavaScript makes pages interactive. Start small: make a button show a message.

\`\`\`
<button id="hours-btn">Show opening hours</button>
<p id="hours" hidden>Monday to Saturday, 8am to 6pm</p>

<script>
  const button = document.querySelector("#hours-btn");
  const hours = document.querySelector("#hours");
  button.addEventListener("click", () => {
    hours.hidden = !hours.hidden;
  });
</script>
\`\`\`

### What is happening
- \`document.querySelector\` finds an element on the page.
- \`addEventListener("click", …)\` runs code when the button is tapped.
- \`hours.hidden = !hours.hidden\` shows or hides the paragraph.

### Find mistakes
Open your browser's **developer console** to see error messages. Most mistakes are small: a missing bracket or a misspelled name.

### Keep it light
Only add JavaScript when it helps. Every script adds data that phone users must download.

${DRAFT_NOTE}`,
      checklist: ["Add a button with an id", "Use querySelector and addEventListener", "Show or hide something on click", "Open the console to find errors"],
      video: {
        intro: "JavaScript makes pages interactive. Let's make a button respond.",
        scenes: [
          {
            art: "js",
            heading: "Your first script",
            points: [
              ["Find the element", "Use document dot query selector to find an element on the page."],
              ["Listen for a click", "Use add event listener to run code when the button is tapped."],
              ["Change the page", "Then change the page, for example show or hide a paragraph."],
              ["Check the console", "If something breaks, open the developer console to see the error."],
            ],
          },
        ],
      },
    },
    {
      title: "Publishing your site",
      summary: "Put your website online for free and share the link.",
      minutes: 10,
      body: `A website on your own device is only visible to you. **Publishing** puts it on a server so anyone can open it.

### Before you publish
- Name your home page \`index.html\`.
- Use lowercase file names without spaces, like \`about-us.html\` and \`shop-photo.jpg\`.
- Compress your images so pages load fast on mobile data.
- Check every link and image works.

### Free hosting options
Static sites (HTML, CSS and JavaScript) can be hosted for free on services such as **GitHub Pages**, **Netlify** or **Cloudflare Pages**. You upload your files, or connect a GitHub repository, and get a public link.

### After you publish
- Open the link on a phone and on a computer.
- Share it with a friend and ask what was confusing.
- Update your files, and publish again.

### Your project
Build a small website for yourself, a local business or a community group, publish it, and submit the live link and your code repository from your dashboard.

${DRAFT_NOTE}`,
      checklist: ["Name the home page index.html", "Compress your images", "Publish on a free host", "Submit your live link"],
      video: {
        intro: "Finally, let's put your website online, for free.",
        scenes: [
          {
            art: "publish",
            heading: "Go live",
            points: [
              ["Name it index.html", "Name your home page index dot html, and use simple lowercase file names."],
              ["Compress your images", "Compress your images, so pages load fast on mobile data."],
              ["Upload to a free host", "Upload your files to a free host, like GitHub Pages or Netlify."],
              ["Test and share the link", "Test the link on a phone, then share it, and ask for feedback."],
            ],
          },
        ],
      },
    },
  ],
};
