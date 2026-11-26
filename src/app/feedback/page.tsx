import Link from "next/link";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata = { title: "Anonymous event feedback", robots: { index: false, follow: false } };

export default function FeedbackPage() {
  return (
    <main className="feedback-page">
      <Link className="quiet-link" href="/">← Return to event site</Link>
      <p className="eyebrow" style={{ marginTop: 42 }}>From Girlhood to Greatness · Second Edition</p>
      <h1>Your voice helps the next gathering grow.</h1>
      <p>Share your experience anonymously. This form does not ask for your name or contact details.</p>
      <FeedbackForm />
    </main>
  );
}
