import { DRAFT_NOTE, type CourseContent } from "./types";

export const cybersecurity: CourseContent = {
  slug: "cybersecurity-awareness",
  title: "Cybersecurity Awareness",
  reviewNote: "Draft lesson · to be reviewed by a JesTech subject reviewer",
  finale: "Course complete: now secure your own phone and accounts",
  lessons: [
    {
      title: "Why security matters",
      summary: "What criminals want, and the simple habits that stop most attacks.",
      minutes: 8,
      body: `Your phone holds your money, messages, photos, contacts and accounts. That makes it valuable to criminals.

### What attackers want
- **Your money:** mobile money, bank accounts, airtime
- **Your accounts:** WhatsApp, Facebook and email, to trick your friends and family
- **Your information:** to pretend to be you

### How most attacks happen
Most attacks do not need clever hacking. They rely on people:
- Sharing a PIN or code with someone pretending to help
- Clicking a fake link
- Using the same weak password everywhere
- Losing an unlocked phone

### Good news
A few simple habits stop most attacks. In this course you will learn them: strong passwords, spotting scams, protecting mobile money and securing your phone.

${DRAFT_NOTE}`,
      checklist: ["List three valuable things on your phone", "Name two common ways attacks happen", "Commit to finishing the security checklist"],
      video: {
        intro: "Welcome to Cybersecurity Awareness. Your phone holds your money, messages and accounts.",
        scenes: [
          {
            art: "security-why",
            heading: "What attackers want",
            points: [
              ["Your money", "Criminals want your money: mobile money, bank accounts and airtime."],
              ["Your accounts", "They want your accounts, like WhatsApp, to trick your friends and family."],
              ["They trick people", "Most attacks don't need clever hacking. They trick people into sharing codes or clicking links."],
              ["Simple habits stop most attacks", "The good news: a few simple habits stop most attacks."],
            ],
          },
        ],
      },
    },
    {
      title: "Passwords and 2-step verification",
      summary: "Create strong passwords and add a second lock to your accounts.",
      minutes: 10,
      body: `### Make passwords long
Length matters more than strange symbols. A **passphrase** of four or more random words is strong and easy to remember, for example: \`river-mango-blue-taxi\`.

### One account, one password
If you reuse a password and one website is hacked, criminals try it on your email, WhatsApp and other accounts. Use a different password for every important account.

### Use a password manager
A password manager app remembers strong passwords for you, so you only need to remember one main passphrase. Many phones have one built in.

### Turn on 2-step verification
**2-step verification** asks for a second thing, such as a code sent to your phone or shown in an app, when someone logs in on a new device.
- On WhatsApp: Settings, Account, Two-step verification, set a PIN.
- On email and Facebook: look for "2-step verification" or "two-factor authentication" in security settings.

### Never share codes
No real company, agent or friend needs your login code or PIN. Anyone who asks for it is trying to steal your account.

${DRAFT_NOTE}`,
      checklist: ["Change your main email password to a long passphrase", "Use different passwords for important accounts", "Turn on 2-step verification on WhatsApp", "Never share a login code"],
      video: {
        intro: "Strong passwords and a second lock keep criminals out of your accounts.",
        scenes: [
          {
            art: "password",
            heading: "Strong passwords",
            points: [
              ["Long passphrases", "Use a long passphrase of four or more random words. Length matters most."],
              ["Different for each account", "Use a different password for every important account."],
              ["A password manager helps", "A password manager can remember them for you."],
            ],
          },
          {
            art: "two-step",
            heading: "2-step verification",
            points: [
              ["Add a second lock", "Turn on two-step verification, so a new login also needs a code."],
              ["Never share codes", "And never share a login code or PIN. Anyone who asks is trying to steal your account."],
            ],
          },
        ],
      },
    },
    {
      title: "Scams and phishing",
      summary: "Recognise fake messages, calls and links before they cost you.",
      minutes: 10,
      body: `**Phishing** is when criminals pretend to be someone you trust, such as a bank, a mobile money provider, an employer or a relative, to trick you into giving information or money.

### Warning signs
- **Urgency or fear:** "Your account will be blocked in 1 hour!"
- **Too good to be true:** "You won a prize, pay a small fee to collect it."
- **Asks for a PIN, password or code**
- **Strange sender:** an unknown number, or an email address that is slightly wrong
- **Links you did not expect,** especially short or misspelled links
- **Spelling mistakes** and unusual greetings

### What to do
- **Stop.** Do not click, reply or call back the number in the message.
- **Check** using a contact you already trust: the official phone number, the official app, or by visiting the office.
- **Report** it to the company being copied, and warn family and friends.
- **Block and delete** the message.

### If you clicked or shared something
Change your password immediately, turn on 2-step verification, and contact your provider. Acting fast limits the damage.

${DRAFT_NOTE}`,
      checklist: ["Name three warning signs of phishing", "Check a suspicious message using an official contact", "Know what to do if you clicked a bad link"],
      video: {
        intro: "Phishing is when criminals pretend to be someone you trust, to trick you.",
        scenes: [
          {
            art: "phishing",
            heading: "Warning signs",
            points: [
              ["Urgency or fear", "Watch for urgency or fear: your account will be blocked in one hour!"],
              ["Too good to be true", "Watch for prizes that need a small fee to collect."],
              ["Asks for a PIN or code", "Any message asking for a PIN, password or code is a scam."],
              ["Unexpected links", "And be careful with links you did not expect."],
            ],
          },
          {
            art: "stop-check",
            heading: "Stop, check, report",
            points: [
              ["Stop: don't click or reply", "Stop. Don't click, reply or call the number in the message."],
              ["Check with an official contact", "Check using an official number or app you already trust, then report it."],
            ],
          },
        ],
      },
    },
    {
      title: "Mobile money safety",
      summary: "Protect your mobile money from the most common scams.",
      minutes: 10,
      body: `Mobile money services such as Orange Money and MTN Mobile Money are fast and useful, and criminals target them every day.

### Your PIN is yours alone
- Never tell anyone your mobile money PIN: not an agent, not a caller from "customer care", not a friend.
- Cover the keypad when you type it.
- Change your PIN if you think someone saw it, and avoid easy PINs like 1234 or your birth year.

### Common scams
- **"Wrong transfer":** someone says they sent money to you by mistake and asks you to send it back. Check your real balance and transaction message first. Often no money arrived.
- **Fake customer care:** a caller says your account has a problem and asks for your PIN or a code.
- **Fake promotions:** "You won! Dial this code or send a fee to claim."

### Check every transaction
- Read the official confirmation message from your provider, not a message from an ordinary number.
- Check the name of the person before you confirm a transfer.

### If something goes wrong
Contact your provider's official customer care immediately, using the number printed on their official materials. Fast reporting gives the best chance of stopping the money.

${DRAFT_NOTE}`,
      checklist: ["Never share your mobile money PIN", "Check your real balance before any refund", "Confirm the receiver's name before sending", "Save your provider's official customer care number"],
      video: {
        intro: "Mobile money is fast and useful, and criminals target it every day. Here's how to stay safe.",
        scenes: [
          {
            art: "momo",
            heading: "Protect your mobile money",
            points: [
              ["Your PIN is yours alone", "Never tell anyone your PIN: not an agent, not customer care, not a friend."],
              ["Check before you refund", "If someone says they sent money by mistake, check your real balance first."],
              ["Read official messages only", "Trust only the official confirmation message from your provider."],
              ["Report fast", "If something goes wrong, call your provider's official customer care straight away."],
            ],
          },
        ],
      },
    },
    {
      title: "Securing your phone",
      summary: "Lock, update and back up your phone in a few minutes.",
      minutes: 10,
      body: `### Lock your screen
Use a PIN of at least six digits, a pattern that is not obvious, or your fingerprint. A locked phone protects everything on it if it is lost or stolen.

### Keep it updated
Install system and app updates. Updates fix security holes that criminals use.

### Install apps only from the official store
Use the Google Play Store or Apple App Store. Apps from links or shared files can contain malware. Check the reviews and the permissions an app asks for.

### Lock your SIM
Set a **SIM PIN** so a thief cannot put your SIM in another phone and receive your codes.

### Back up and find your phone
- Turn on backups for your photos and contacts.
- Turn on **Find My Device** (Android) or **Find My** (iPhone), so you can locate or erase a lost phone.

### Careful on public Wi-Fi
Avoid logging into banking or mobile money apps on free public Wi-Fi.

### Your activity
Complete this checklist on your own phone, then describe three changes you made (do not share passwords or private details).

${DRAFT_NOTE}`,
      checklist: ["Set a screen lock", "Install pending updates", "Set a SIM PIN", "Turn on backup and Find My Device"],
      video: {
        intro: "In a few minutes, you can make your phone much safer.",
        scenes: [
          {
            art: "phone-secure",
            heading: "Secure your phone",
            points: [
              ["Lock your screen", "Lock your screen with a six-digit PIN, or your fingerprint."],
              ["Install updates", "Install updates. They fix security holes that criminals use."],
              ["Official app store only", "Install apps only from the official app store."],
              ["SIM PIN and backups", "Set a SIM PIN, turn on backups, and turn on find my device."],
            ],
          },
        ],
      },
    },
  ],
};
