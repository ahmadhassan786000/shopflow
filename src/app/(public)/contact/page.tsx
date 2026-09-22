import type { Metadata } from "next";
import { Container } from "react-bootstrap";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the ShopFlow support team.",
};

export default function ContactPage() {
  return (
    <main className="shop-info-page">
      <section className="shop-info-hero">
        <Container>
          <Breadcrumbs items={[{ label: "Contact Us" }]} />

          <div className="shop-info-hero-content">
            <span className="shop-info-hero-badge">WE&apos;RE HERE TO HELP</span>
            <h1>Contact Us</h1>
            <p>
              Questions about an order, a product, or anything else? Reach out
              and our team will get back to you quickly.
            </p>
          </div>
        </Container>
      </section>

      <Container className="shop-contact-layout">
        <div className="shop-contact-info-grid">
          <a
            href="https://wa.me/923250794101"
            target="_blank"
            rel="noopener noreferrer"
            className="shop-contact-info-card"
          >
            <div className="shop-contact-info-icon whatsapp">
              <MessageCircle size={22} />
            </div>
            <h3>WhatsApp</h3>
            <p>Fastest way to reach us — chat with our support team directly.</p>
            <span>+92 325 0794101</span>
          </a>

          <a href="mailto:support@shopflow.pk" className="shop-contact-info-card">
            <div className="shop-contact-info-icon email">
              <Mail size={22} />
            </div>
            <h3>Email</h3>
            <p>Send us the details and we&apos;ll reply within 24 hours.</p>
            <span>support@shopflow.pk</span>
          </a>

          <div className="shop-contact-info-card shop-contact-info-static">
            <div className="shop-contact-info-icon hours">
              <Clock size={22} />
            </div>
            <h3>Support Hours</h3>
            <p>Our team is available every day to help with your queries.</p>
            <span>Mon – Sun · 9:00 AM – 10:00 PM PKT</span>
          </div>

          <div className="shop-contact-info-card shop-contact-info-static">
            <div className="shop-contact-info-icon location">
              <MapPin size={22} />
            </div>
            <h3>Coverage</h3>
            <p>We ship electronics and everyday essentials nationwide.</p>
            <span>Serving customers across Pakistan</span>
          </div>
        </div>

        <ContactForm />
      </Container>
    </main>
  );
}
