import { StaffDesk } from "@/components/StaffDesk";
import "./staff.css";

export const metadata = { title: "Staff access", robots: { index: false, follow: false } };

export default function StaffPage() {
  return (
    <main className="staff-page">
      <header className="site-header staff-header">
        <a className="wordmark" href="/" aria-label="From Girlhood to Greatness home"><span className="wordmark-name">Empower <em>with</em> Hafsat</span><span className="wordmark-caption">From Girlhood to Greatness · Second Edition</span></a>
        <a className="quiet-link" href="/">Return to event site</a>
      </header>
      <section className="staff-container"><StaffDesk /></section>
      <footer className="site-footer"><a className="footer-wordmark" href="/">From Girlhood <em>to Greatness</em></a><p>Restricted event operations</p></footer>
    </main>
  );
}
