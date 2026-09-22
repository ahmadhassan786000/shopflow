import type { Metadata } from "next";
import { Container } from "react-bootstrap";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  MessageSquareText,
  PackageSearch,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Our return policy and how to request a return or refund.",
};

const steps = [
  { icon: <MessageSquareText size={20} />, title: "Contact Us", description: "Reach out via WhatsApp or the Contact page within 7 days of delivery." },
  { icon: <PackageSearch size={20} />, title: "Share Details", description: "Tell us your order number and the reason for the return, with photos if relevant." },
  { icon: <RotateCcw size={20} />, title: "Return Pickup", description: "We'll arrange a pickup or share drop-off instructions for the item." },
  { icon: <Wallet size={20} />, title: "Refund or Replacement", description: "Once inspected, we process your refund or send a replacement." },
];

const eligible = [
  "Item arrived damaged, defective, or faulty",
  "Wrong product or variant was delivered",
  "Item is unused, unwashed, and in original packaging",
  "Return requested within 7 days of delivery",
];

const notEligible = [
  "Item shows signs of use or damage caused after delivery",
  "Original packaging, tags, or accessories are missing",
  "Return requested after the 7-day window",
  "Products marked as \"Final Sale\" or clearance items",
];

export default function ReturnsPage() {
  return (
    <main className="shop-info-page">
      <section className="shop-info-hero">
        <Container>
          <Breadcrumbs items={[{ label: "Returns" }]} />

          <div className="shop-info-hero-content">
            <span className="shop-info-hero-badge">HASSLE-FREE RETURNS</span>
            <h1>Returns & Refunds</h1>
            <p>
              Not quite right? Here&apos;s how our 7-day return policy works,
              step by step.
            </p>
          </div>
        </Container>
      </section>

      <Container className="shop-info-content">
        {/* Eligibility */}
        <section className="shop-info-section">
          <h2>Return Eligibility</h2>
          <p>Quick check before you start a return request.</p>

          <div className="shop-returns-eligibility-grid">
            <div className="shop-returns-eligibility-card eligible">
              <div className="shop-returns-eligibility-header">
                <CheckCircle2 size={20} />
                <h3>Eligible for Return</h3>
              </div>

              <ul>
                {eligible.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="shop-returns-eligibility-card not-eligible">
              <div className="shop-returns-eligibility-header">
                <XCircle size={20} />
                <h3>Not Eligible</h3>
              </div>

              <ul>
                {notEligible.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="shop-info-section">
          <h2>How to Return an Item</h2>
          <p>Four simple steps to get your refund or replacement moving.</p>

          <div className="shop-shipping-steps">
            {steps.map((step, i) => (
              <div key={step.title} className="shop-shipping-step">
                <div className="shop-shipping-step-icon">{step.icon}</div>
                <div className="shop-shipping-step-line">{`0${i + 1}`}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Refund note + CTA */}
        <section className="shop-returns-cta">
          <div className="shop-returns-cta-icon">
            <Wallet size={24} />
          </div>

          <div className="shop-returns-cta-content">
            <h3>Refunds are processed within 5–7 business days</h3>
            <p>
              Once we receive and inspect your returned item, refunds are
              issued to your original payment method, or as store credit for
              Cash on Delivery orders.
            </p>
          </div>

          <Link href="/contact" className="shop-returns-cta-button">
            Start a Return Request
          </Link>
        </section>
      </Container>
    </main>
  );
}
