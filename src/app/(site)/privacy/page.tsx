import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Privacy", description: "How JesTech Nexus handles your information." };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy" intro="Draft summary — to be finalised with JesTech before launch." />
      <div className="container-page prose-lesson max-w-3xl py-10">
        <h3>What we collect</h3>
        <ul>
          <li>Account details: your name, email and a securely hashed password.</li>
          <li>Learning records: enrolments, completed lessons, points, badges, submissions and certificates.</li>
          <li>Messages you send through inquiry and report forms, including the contact details you give.</li>
        </ul>
        <h3>Why</h3>
        <p>To run your account, track your progress, let mentors review your work, issue certificates and reply to your requests. We do not sell your information.</p>
        <h3>Your choices</h3>
        <ul>
          <li>Turn on <strong>private progress mode</strong> to keep your points off the class leaderboard.</li>
          <li>Ask us to correct or delete your account and data through the contact page.</li>
          <li>Many resources are public — you only need an account for progress, saved items and submissions.</li>
        </ul>
        <h3>Expert and partner profiles</h3>
        <p>Profiles are published only with the person&apos;s or organisation&apos;s consent and after admin verification.</p>
        <h3>Ask Grandpa (AI tutor)</h3>
        <p>
          When you ask Grandpa a question, your question, the recent conversation and the text of the lesson you are on
          are sent to our AI provider, Grandpa AI, to write the answer. JesTech does not store your questions or the
          answers; we only count how many questions each learner asks per day, to keep the service fair. Never type
          passwords, PINs or private details into the chat.
        </p>
        <h3>Files saved offline</h3>
        <p>Lessons and files you save offline are stored only on your device and can be removed at any time.</p>
      </div>
    </>
  );
}
