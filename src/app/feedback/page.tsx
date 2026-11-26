import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata = { title: "Anonymous event feedback" };

export default function FeedbackPage() {
  return (
    <main className="feedback-page">
      <a className="quiet-link" href="/">← Return to event site</a>
      <p className="eyebrow" style={{ marginTop: 42 }}>From Girlhood to Greatness · Second Edition</p>
      <h1>Your voice helps the next gathering grow.</h1>
      <p>Share your experience anonymously. This form does not ask for your name or contact details.</p>
      <FeedbackForm />
    </main>
  );
}
