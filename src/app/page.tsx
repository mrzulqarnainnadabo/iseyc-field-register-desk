import { RegistrationForm } from "@/components/RegistrationForm";
import { GTG } from "@/lib/gtg-config";

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="From Girlhood to Greatness home"><span className="wordmark-name">Empower <em>with</em> Hafsat</span><span className="wordmark-caption">A gathering for women</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#story">The gathering</a><a href="#details">Event details</a><a className="nav-register" href="#register">Register <span aria-hidden="true">↗</span></a></nav>
        <a className="mobile-register" href="#register">Register <span aria-hidden="true">↗</span></a>
      </header>
      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> {GTG.edition} <span className="eyebrow-dot">·</span> Kaduna, Nigeria</p>
            <h1>From Girlhood<br /><em>to Greatness.</em></h1>
            <p className="hero-theme">{GTG.theme}</p>
            <p className="hero-description">A space to pause, recognise how far you have come, and make room for the woman you are becoming.</p>
            <div className="hero-actions"><a className="button button-primary" href="#register">Register to attend <span aria-hidden="true">↗</span></a><a className="quiet-link" href="#details">Explore the gathering <span aria-hidden="true">↓</span></a></div>
            <p className="audience-note">For women aged 20 and above.</p>
          </div>
          <aside className="hero-card" aria-label="Event date and venue">
            <div className="hero-card-top"><span>THE SECOND EDITION</span><span>29 / 11 / 26</span></div>
            <div className="hero-card-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-disc"><span>Her</span><i>✳</i></div><span className="art-side-note">A moment<br />to become.</span></div>
            <div className="hero-card-bottom"><div><span className="detail-label">DATE</span><strong>Sunday, 29 November 2026</strong></div><div><span className="detail-label">TIME</span><strong>1:00 PM</strong></div><div><span className="detail-label">VENUE</span><strong>Yakubu Hub, Surami Road,<br />U/Rimi, Kaduna, Nigeria.</strong></div></div>
          </aside>
          <div className="hero-index" aria-hidden="true">01 — 03</div>
        </section>
        <section className="intro-band" id="story"><p className="eyebrow">A note on the gathering</p><div><h2>Greatness is not a finish line.<br /><em>It is something you learn to accept.</em></h2><p>From Girlhood to Greatness returns for its second edition with a simple invitation: move beyond only imagining the woman you could become, and begin believing in her. Come as you are. Leave with space to keep growing.</p></div></section>
        <section className="details-section" id="details"><div className="section-heading"><div><p className="eyebrow">Make the time</p><h2>Be in the room.</h2></div></div><div className="details-grid"><article><span className="detail-number">01</span><span className="detail-label">WHEN</span><h3>Sunday<br />29 November 2026</h3><p>We begin at 1:00 PM.</p></article><article><span className="detail-number">02</span><span className="detail-label">WHERE</span><h3>Yakubu Hub</h3><p>Surami Road, U/Rimi,<br />Kaduna, Nigeria.</p></article><article><span className="detail-number">03</span><span className="detail-label">WHO</span><h3>Women aged<br />20 and above.</h3><p>Registration is required to attend.</p></article></div></section>
        <section className="registration-section" id="register"><div className="registration-aside"><p className="eyebrow">Your next chapter</p><h2>There is room<br />for <em>you.</em></h2><p>Reserve your place for the second edition of From Girlhood to Greatness.</p><div className="registration-meta"><span>29 November 2026</span><span>1:00 PM</span><span>Kaduna, Nigeria</span></div></div><div className="registration-card"><RegistrationForm /></div></section>
        <section className="partners-section"><p className="eyebrow">Brought together by</p><div className="partner-lockups"><div><span className="partner-role">ORGANISER</span><strong>Empower with Hafsat</strong></div><span className="partner-divider" /><div><span className="partner-role">IN PARTNERSHIP WITH</span><strong>Baytal Rihaa</strong></div></div><p className="systems-credit">Systems and documentation partner <strong>Initiative for Sustainable Evolution for Youth and Community (ISEYC)</strong></p></section>
      </main>
      <footer className="site-footer"><a className="footer-wordmark" href="#top">From Girlhood <em>to Greatness</em></a><p>Second Edition · Kaduna, Nigeria · 2026</p><a href="/staff">Staff access</a></footer>
    </>
  );
}
