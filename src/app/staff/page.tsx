import Image from "next/image";
import Link from "next/link";
import { StaffDesk } from "@/components/StaffDesk";
import "./staff.css";

export const metadata = { title: "Staff access", robots: { index: false, follow: false } };

export default function StaffPage() {
  return (
    <main className="staff-page">
      <header className="site-header staff-header">
        <Link className="brand-lockup" href="/" aria-label="Empower with Hafsat — event home">
          <Image src="/brand/empower-with-hafsat.jpg" alt="Empower with Hafsat" width={60} height={60} priority className="brand-logo" />
          <span className="brand-wording">
            <span className="brand-name">Empower with Hafsat</span>
            <span className="brand-caption">From Girlhood to Greatness · Second Edition</span>
          </span>
        </Link>
        <Link className="quiet-link" href="/">Return to event site <span aria-hidden="true">↗</span></Link>
      </header>
      <section className="staff-container"><StaffDesk /></section>
      <footer className="site-footer">
        <Link className="footer-brand" href="/">
          <Image src="/brand/empower-with-hafsat.jpg" alt="" width={40} height={40} />
          <span>From Girlhood <em>to Greatness</em></span>
        </Link>
        <p>Restricted event operations</p>
      </footer>
    </main>
  );
}
