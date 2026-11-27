import Image from "next/image";
import { RegistrationForm } from "@/components/RegistrationForm";
import { GTG } from "@/lib/gtg-config";

const heroImage =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3ECCa3WCGt9X7Z7sOvBpw2rTrQ1/hf_20261127_153730_07d9f3ce-7f31-4eee-af44-87abfd68a431.png";

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Empower with Hafsat">
          <Image
            src="/brand/empower-with-hafsat.jpg"
            alt="Empower with Hafsat"
            width={76}
            height={76}
            priority
            className="brand-logo"
          />
          <span className="brand-wording">
            <span className="brand-name">Empower with Hafsat</span>
            <span className="brand-caption">From girlhood to greatness</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#story">The gathering</a>
          <a href="#details">Event details</a>
          <a className="nav-register" href="#register">Reserve your place <span aria-hidden="true">↗</span></a>
        </nav>
        <a className="mobile-register" href="#register">Register <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <section className="editorial-hero">
          <div className="editorial-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> {GTG.edition} <span className="eyebrow-dot">/</span> Kaduna, Nigeria</p>
            <h1>From Girlhood<br /><em>to Greatness.</em></h1>
            <p className="hero-theme">{GTG.theme}</p>
            <p className="hero-description">
              A gathering for women ready to recognise how far they have come
              and make room for the woman they are becoming.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#register">Reserve your place <span aria-hidden="true">↗</span></a>
              <a className="quiet-link" href="#story">Discover the gathering <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-facts" aria-label="Event information">
              <div><span>DATE</span><strong>29 November 2026</strong></div>
              <div><span>TIME</span><strong>1:00 PM</strong></div>
              <div><span>VENUE</span><strong>Yakubu Hub, U/Rimi</strong></div>
            </div>
          </div>

          <figure className="hero-image-wrap">
            {/* The commissioned campaign image is generated for this event; the organiser's logo remains a separate, original asset. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-image" src={heroImage} alt="Three confident Nigerian women standing together in a warm, light-filled space." fetchPriority="high" />
            <figcaption className="hero-image-note">
              <span>THE SECOND EDITION</span>
              <span>29.11.26</span>
            </figcaption>
            <div className="hero-image-stamp" aria-hidden="true">Her next<br />chapter.</div>
          </figure>
          <span className="hero-side-note" aria-hidden="true">A gathering for women aged 20 and above</span>
        </section>

        <section className="intro-band" id="story">
          <p className="eyebrow">A note on the gathering</p>
          <div>
            <h2>Greatness is not a finish line.<br /><em>It is something you learn to accept.</em></h2>
            <p>
              From Girlhood to Greatness returns for its second edition with a
              simple invitation: move beyond only imagining the woman you could
              become, and begin believing in her. Come as you are. Leave with
              space to keep growing.
            </p>
          </div>
        </section>

        <section className="details-section" id="details">
          <div className="section-heading">
            <div><p className="eyebrow">Make the time</p><h2>Be in the room.</h2></div>
            <p className="details-intro">One afternoon to pause, connect and make space for what comes next.</p>
          </div>
          <div className="details-grid">
            <article><span className="detail-number">01</span><span className="detail-label">WHEN</span><h3>{GTG.date}</h3><p>We begin at {GTG.time}.</p></article>
            <article><span className="detail-number">02</span><span className="detail-label">WHERE</span><h3>{GTG.venue}</h3><p>Yakubu Hub, Surami Road, U/Rimi, Kaduna.</p></article>
            <article><span className="detail-number">03</span><span className="detail-label">WHO</span><h3>{GTG.audience}.</h3><p>Registration is required to attend.</p></article>
          </div>
        </section>

        <section className="registration-section" id="register">
          <div className="registration-aside">
            <p className="eyebrow">Your next chapter</p>
            <h2>There is room<br />for <em>you.</em></h2>
            <p>Reserve your place for the second edition of From Girlhood to Greatness.</p>
            <div className="registration-meta"><span>{GTG.date}</span><span>{GTG.time}</span><span>Yakubu Hub, Kaduna</span></div>
            <Image src="/brand/empower-with-hafsat.jpg" alt="Empower with Hafsat" width={92} height={92} className="registration-brand" />
          </div>
          <div className="registration-card"><RegistrationForm /></div>
        </section>

        <section className="partners-section">
          <p className="eyebrow">Brought together by</p>
          <div className="partner-lockups">
            <div className="organiser-lockup">
              <Image src="/brand/empower-with-hafsat.jpg" alt="Empower with Hafsat" width={88} height={88} />
              <span className="partner-role">ORGANISER</span>
              <strong>{GTG.organiser}</strong>
            </div>
            <span className="partner-divider" aria-hidden="true" />
            <div><span className="partner-role">IN PARTNERSHIP WITH</span><strong>{GTG.partner}</strong></div>
          </div>
          <p className="systems-credit">Registration and documentation partner <strong>{GTG.systemsPartner}</strong></p>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#top">
          <Image src="/brand/empower-with-hafsat.jpg" alt="" width={42} height={42} />
          <span>From Girlhood <em>to Greatness</em></span>
        </a>
        <p>Second Edition · Kaduna, Nigeria · 2026</p>
        <a href="/staff">Staff access</a>
      </footer>
    </>
  );
}
