import { DRAFT_NOTE, type CourseContent } from "./types";

export const teachers: CourseContent = {
  slug: "digital-literacy-for-teachers",
  title: "Digital Literacy for Teachers",
  reviewNote: "Draft lesson · to be reviewed by a JesTech education reviewer",
  finale: "Course complete: now plan a digital-literacy lesson",
  lessons: [
    {
      title: "Devices and files",
      summary: "Organise, name, back up and share files on a phone or computer.",
      minutes: 10,
      body: `Teachers work with many files: lesson plans, worksheets, marks and photos. Organised files save hours.

### Folders
Create one main folder, for example **School 2026**, with folders inside for each class or subject: \`Grade 7 Science\`, \`Grade 8 English\`, \`Marks\`.

### Name files clearly
Use names that say what and when: \`G7-science-plants-worksheet-week3.pdf\`. Avoid names like \`Document1\` or \`New file (2)\`.

### Know your file types
- **PDF:** best for sharing worksheets that should look the same everywhere.
- **DOCX or Google Docs:** for documents you will edit.
- **JPG and PNG:** photos and images.
- **MP4:** videos. These are large files, so share them carefully on mobile data.

### Back up
Phones get lost and break. Keep a second copy of important files: on a computer, a memory card, a flash drive, or a free cloud service such as Google Drive.

### Share sensibly
WhatsApp is quick for small files. For large files, share once with colleagues by flash drive, or a Drive link.

${DRAFT_NOTE}`,
      checklist: ["Create folders for each class", "Rename five files clearly", "Back up your important files", "Share one file as a PDF"],
      video: {
        intro: "Welcome to Digital Literacy for Teachers. Organised files save you hours.",
        scenes: [
          {
            art: "devices",
            heading: "Organise your files",
            points: [
              ["Folders for each class", "Create one main folder, with folders inside for each class or subject."],
              ["Clear file names", "Give files clear names that say what, and when."],
              ["PDF for sharing", "Share worksheets as PDF, so they look the same on every device."],
              ["Always back up", "And keep a second copy of important files. Phones get lost."],
            ],
          },
        ],
      },
    },
    {
      title: "Finding good resources",
      summary: "Search well, judge what you find, and respect copyright.",
      minutes: 10,
      body: `The internet has excellent teaching resources, and a lot of poor or wrong information. Search smart and check everything.

### Search better
- Use specific words: \`photosynthesis worksheet grade 7 pdf\`.
- Add the type you want: worksheet, lesson plan, video, quiz.
- Put exact phrases in quotes: \`"water cycle" diagram\`.

### Judge what you find
Ask four questions:
- **Who** made it? A known school, university or education organisation?
- **When** was it made or updated?
- **Is it accurate?** Does it match your textbook and other good sources?
- **Does it fit** your learners, your syllabus and Liberian examples?

### Open educational resources
Some resources are **openly licensed** (for example Creative Commons), which means you may use, share and often adapt them. Check the licence, and credit the author.

### Start with trusted sources
The JesTech Nexus library lists the source, date and licence of every resource.

${DRAFT_NOTE}`,
      checklist: ["Search with specific words and a file type", "Check who made a resource, and when", "Find one openly licensed resource", "Credit the author"],
      video: {
        intro: "The internet has excellent teaching resources, and a lot of wrong information.",
        scenes: [
          {
            art: "resources",
            heading: "Find and judge",
            points: [
              ["Search with specific words", "Search with specific words, and add the type you want, like worksheet."],
              ["Who made it, and when?", "Ask who made it, and when it was updated."],
              ["Is it accurate, does it fit?", "Check it is accurate, and that it fits your learners and syllabus."],
              ["Check the licence", "Use openly licensed resources, and credit the author."],
            ],
          },
        ],
      },
    },
    {
      title: "Lesson planning tools",
      summary: "Plan faster with templates, simple documents and shared folders.",
      minutes: 10,
      body: `Digital tools make planning faster and let you reuse and share good lessons.

### A simple lesson plan template
- **Objective:** what learners will be able to do by the end.
- **Starter:** a short activity to connect to what they know (5 minutes).
- **Main activity:** teaching and practice.
- **Check:** how you will know they learned it: a question, a quiz or a task.
- **Materials:** what you need, including offline options.

Save it once as a template, then copy it for each lesson.

### Useful free tools
- **Google Docs** or a word processor for plans and worksheets.
- **Google Sheets** for marks and attendance.
- **Google Forms** for quick quizzes that mark themselves, when learners have devices.

### Plan with colleagues
Share a folder with teachers of the same subject, and divide the work: one plans a topic, another makes the worksheet.

### AI can help, carefully
An AI assistant can suggest activities or questions, but always check them for accuracy and fit.

${DRAFT_NOTE}`,
      checklist: ["Create a lesson plan template", "Plan one lesson with it", "Share a planning folder with a colleague"],
      video: {
        intro: "Digital tools help you plan faster, and reuse good lessons.",
        scenes: [
          {
            art: "lesson-plan",
            heading: "Plan with a template",
            points: [
              ["Objective first", "Start with the objective: what learners will be able to do."],
              ["Starter, activity, check", "Then a starter, the main activity, and a way to check learning."],
              ["Save it as a template", "Save it once as a template, and copy it for each lesson."],
              ["Share with colleagues", "Share a folder with colleagues, and divide the work."],
            ],
          },
        ],
      },
    },
    {
      title: "Teaching online safety",
      summary: "Help learners stay safe, kind and smart online.",
      minutes: 10,
      body: `Many learners use phones and social media, often without guidance. Teachers can make a big difference.

### Key messages for learners
- **Keep personal information private:** full name with school, home address, phone number and photos in school uniform.
- **Strangers online may not be who they say they are.** Never agree to meet someone from the internet without a trusted adult.
- **Be kind:** do not share hurtful messages or photos. Cyberbullying causes real harm.
- **Think before you post:** posts can be copied and shared forever.
- **Spot scams:** prizes, "free data" offers and urgent messages asking for codes are tricks.
- **Tell a trusted adult** if something online makes you uncomfortable or scared.

### Teach it actively
Use real examples, role-play what to do, and let learners create their own safety posters.

### Lead by example
Ask permission before posting photos of learners, and keep their personal information private.

${DRAFT_NOTE}`,
      checklist: ["Teach the six key messages", "Run one role-play activity", "Ask permission before posting learners' photos"],
      video: {
        intro: "Many learners use phones without guidance. Teachers can make a big difference.",
        scenes: [
          {
            art: "safety-kids",
            heading: "Key messages",
            points: [
              ["Keep personal information private", "Keep personal information private: address, phone number, and school photos."],
              ["Strangers may not be real", "People online may not be who they say they are."],
              ["Be kind, think before posting", "Be kind, and think before you post. Posts can last forever."],
              ["Tell a trusted adult", "And always tell a trusted adult if something feels wrong."],
            ],
          },
        ],
      },
    },
    {
      title: "Low-data teaching",
      summary: "Teach with digital resources even with weak or expensive internet.",
      minutes: 10,
      body: `Internet in many schools is weak or expensive. You can still use digital resources well.

### Download once, share many times
Download a resource once where internet is better, then share it offline with colleagues and learners by flash drive, memory card or Bluetooth.

### Choose light formats
- Text and PDF are much smaller than video.
- Audio uses far less data than video, and works well for stories and listening practice.
- Compress photos before sharing. A worksheet photo does not need to be 5 MB.

### Use what people already have
- **WhatsApp groups** for short instructions, voice notes and small worksheets.
- **SMS** for reminders when data is not available.
- **Printouts** for learners without phones.

### Save for offline in JesTech Nexus
Use **Save offline** on lessons and library resources. They open later without internet.

### Your project
Plan one lesson that teaches a digital skill to your learners, using low-data methods, and submit your lesson plan.

${DRAFT_NOTE}`,
      checklist: ["Download one resource and share it offline", "Choose text or audio instead of video", "Save a lesson offline in Nexus", "Submit your lesson plan"],
      video: {
        intro: "Internet in many schools is weak or expensive. You can still teach digitally.",
        scenes: [
          {
            art: "low-data",
            heading: "Teach on low data",
            points: [
              ["Download once, share offline", "Download once, then share offline by flash drive, memory card or Bluetooth."],
              ["Choose light formats", "Choose light formats: text, PDF and audio use far less data than video."],
              ["Use WhatsApp, SMS and print", "Use WhatsApp groups, SMS reminders, and printouts for learners without phones."],
              ["Save offline in Nexus", "And use save offline in Nexus, to open lessons without internet."],
            ],
          },
        ],
      },
    },
  ],
};
