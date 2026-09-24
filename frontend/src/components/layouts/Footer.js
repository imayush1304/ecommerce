import React from "react";
import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "/", icon: "f" },
  { label: "Twitter", href: "/", icon: "𝕏" },
  { label: "Instagram", href: "/", icon: "◎" },
  { label: "YouTube", href: "/", icon: "▶" },
  { label: "LinkedIn", href: "/", icon: "in" },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Brand column */}
        <div className="footer-brand-col">
          <Link to="/" className="logo-link" style={{ marginBottom: '1rem' }}>
            <span className="logo-text">VIP<span style={{ color: 'var(--accent)' }}>Store</span></span>
          </Link>
          <p className="footer-tagline">
            Your one-stop destination for premium products, fast delivery, and an unmatched shopping experience.
          </p>
          <div className="footer-socials">
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} className="social-icon" target="_blank" rel="noreferrer">
                {s.icon}
              </a>
            ))}
          </div>
          <div className="footer-newsletter">
            <input type="email" placeholder="Your email address" className="newsletter-input" id="newsletter-email" />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>

        {/* Links columns */}
        <div className="footer-links-col">
          <h5 className="footer-col-title">Company</h5>
          <ul className="footer-links">
            <li><Link to="/about">About VIPStore</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
            <li><a href="/">Careers</a></li>
            <li><a href="/">Press Releases</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h5 className="footer-col-title">Sell With Us</h5>
          <ul className="footer-links">
            <li><a href="/">Sell on VIPStore</a></li>
            <li><a href="/">Seller Portal</a></li>
            <li><a href="/">Global Selling</a></li>
            <li><a href="/">Become a Partner</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h5 className="footer-col-title">Support</h5>
          <ul className="footer-links">
            <li><a href="/">Your Account</a></li>
            <li><a href="/">Returns Centre</a></li>
            <li><a href="/">Help & FAQs</a></li>
            <li><a href="/">100% Purchase Protection</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} VIPStore-Ecom. All Rights Reserved.</p>
        <div className="payment-icons">
          <span>💳</span>
          <span>🏦</span>
          <span>📲</span>
          <span>🔒</span>
        </div>
      </div>
    </footer>
  );
}
