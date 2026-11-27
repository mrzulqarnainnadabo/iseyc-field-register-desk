import Image from "next/image";
import Link from "next/link";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata = { title: "Anonymous event feedback", robots: { index: false, follow: false } };

export default function FeedbackPage() {
  return (
    <main className="feedback-page">
      <header className="feedback-header">
        <Link className="brand-lockup" href="/" aria-label="Empower with Hafsat — event home">
          <Image src="/brand/empower-with-hafsat.jpg" alt="Empower with Hafsat" width={58} height={58} priority className="brand-logo" />
          <span className="brand-wording">
            <span className="brand-name">Empower with Hafsat</span>
            <span className="brand-caption">From Girlhood to Greatness · Second Edition</span>
          </span>
        </Link>
        <Link className="quiet-link" href="/">Event home <span aria-hidden="true">↗</span></Link>
      </header>
      <section className="feedback-content">
        <p className="eyebrow">From Girlhood to Greatness · Second Edition</p>
        <h1>Your voice helps the next gathering grow.</h1>
        <p>Share your experience anonymously. This form does not ask for your name or contact details.</p>
        <FeedbackForm />
      </section>
      <footer className="feedback-footer">
        <Image src="/brand/empower-with-hafsat.jpg" alt="" width={36} height={36} />
        <span>Empower with Hafsat · From Girlhood to Greatness</span>
      </footer>
    </main>
  );
}
