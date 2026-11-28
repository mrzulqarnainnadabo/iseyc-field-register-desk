import Image from "next/image";
import { RegistrationForm } from "@/components/RegistrationForm";
import { GTG } from "@/lib/gtg-config";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
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
        <section className="editorial-hero" id="main-content">
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

          <figure className="hero-image-wrap hero-artwork" aria-label="Typographic event artwork for the second edition">
            <div className="artwork-topline"><span>FROM GIRLHOOD TO GREATNESS</span><span>02</span></div>
            <div className="artwork-core">
              <span className="artwork-kicker">THE SECOND EDITION</span>
              <span className="artwork-number" aria-hidden="true">02</span>
              <p className="artwork-statement">Accepting my<br /><em>greatness.</em></p>
              <span className="artwork-rule" />
              <p className="artwork-theme">From becoming her to believing in her.</p>
            </div>
            <figcaption className="artwork-bottomline">
              <span>KADUNA, NIGERIA</span>
              <span>29 NOVEMBER 2026 · 1 PM</span>
            </figcaption>
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
          <a className="venue-directions" href="https://www.google.com/maps/search/?api=1&query=Yakubu%20Hub%2C%20Surami%20Road%2C%20U%2FRimi%2C%20Kaduna%2C%20Nigeria" target="_blank" rel="noreferrer">Get directions to Yakubu Hub <span aria-hidden="true">↗</span></a>
        </section>

        <section className="gathering-values" aria-labelledby="gathering-values-title">
          <div className="gathering-values-heading">
            <p className="eyebrow">More than a moment</p>
            <h2 id="gathering-values-title">A space to meet<br /><em>the woman within.</em></h2>
            <p>An afternoon shaped around the heart of this edition: accepting your greatness, and believing in the person you are becoming.</p>
          </div>
          <div className="gathering-values-list">
            <article><span>01</span><div><h3>Pause and reflect</h3><p>Make room to recognise your journey, your growth and the strength it has taken to arrive here.</p></div></article>
            <article><span>02</span><div><h3>Connect with others</h3><p>Share the room with women who are also making space for possibility, confidence and connection.</p></div></article>
            <article><span>03</span><div><h3>Keep becoming</h3><p>Leave with the invitation to carry belief in yourself beyond this one afternoon.</p></div></article>
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

        <section className="event-answers" aria-labelledby="event-answers-title">
          <div className="event-answers-heading">
            <p className="eyebrow">Before you join us</p>
            <h2 id="event-answers-title">A few useful<br /><em>details.</em></h2>
          </div>
          <div className="event-answers-list">
            <details><summary>Who is the gathering for?</summary><p>Women aged 20 and above. Please confirm this when completing your registration.</p></details>
            <details><summary>When should I arrive?</summary><p>The gathering begins at 1:00 PM on Sunday, 29 November 2026. Please plan your journey so you can arrive in good time.</p></details>
            <details><summary>Where will it take place?</summary><p>{GTG.venue}. <a href="https://www.google.com/maps/search/?api=1&query=Yakubu%20Hub%2C%20Surami%20Road%2C%20U%2FRimi%2C%20Kaduna%2C%20Nigeria" target="_blank" rel="noreferrer">Open directions in Google Maps ↗</a></p></details>
            <details><summary>Do I need to register?</summary><p>Yes. Please complete the registration form on this page. Keep the reference shown after a successful submission for event-day check-in.</p></details>
          </div>
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
          <span className="footer-brand-copy"><strong>Empower with Hafsat</strong><small>From girlhood to greatness</small></span>
        </a>
        <p>Second Edition · Kaduna, Nigeria · 2026</p>
        <a href="/staff">Staff access</a>
      </footer>
    </>
  );
}
