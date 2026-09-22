import type { Metadata } from "next";
import { Container } from "react-bootstrap";
import {
  Truck,
  Clock,
  MapPin,
  ShieldCheck,
  PackageCheck,
  Banknote,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Shipping Info",
  description: "Delivery timelines, charges, and coverage for ShopFlow orders.",
};

const zones = [
  { zone: "Major Cities", cities: "Karachi, Lahore, Islamabad, Rawalpindi", time: "1 – 2 business days", fee: "Rs 150" },
  { zone: "Other Cities", cities: "Faisalabad, Multan, Peshawar, Quetta & more", time: "2 – 4 business days", fee: "Rs 250" },
  { zone: "Remote Areas", cities: "Smaller towns and rural areas", time: "4 – 7 business days", fee: "Rs 350" },
];

const steps = [
  { icon: <PackageCheck size={20} />, title: "Order Confirmed", description: "You'll get a confirmation as soon as your order is placed." },
  { icon: <Truck size={20} />, title: "Order Packed & Shipped", description: "Our team carefully packs and hands your order to our courier partner." },
  { icon: <MapPin size={20} />, title: "Out for Delivery", description: "Track your order's progress from your Orders page." },
  { icon: <ShieldCheck size={20} />, title: "Delivered", description: "Inspect your order on arrival — we're here if anything's wrong." },
];

export default function ShippingPage() {
  return (
    <main className="shop-info-page">
      <section className="shop-info-hero">
        <Container>
          <Breadcrumbs items={[{ label: "Shipping Info" }]} />

          <div className="shop-info-hero-content">
            <span className="shop-info-hero-badge">DELIVERY DETAILS</span>
            <h1>Shipping Info</h1>
            <p>
              Everything you need to know about how, when, and where we
              deliver your ShopFlow orders.
            </p>
          </div>
        </Container>
      </section>

      <Container className="shop-info-content">
        {/* Delivery zones table */}
        <section className="shop-info-section">
          <h2>Delivery Zones & Timelines</h2>
          <p>Shipping charges and delivery windows depend on your location.</p>

          <div className="shop-shipping-table-wrap">
            <table className="shop-shipping-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Coverage</th>
                  <th>Estimated Delivery</th>
                  <th>Shipping Fee</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.zone}>
                    <td>{z.zone}</td>
                    <td>{z.cities}</td>
                    <td>{z.time}</td>
                    <td>{z.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="shop-shipping-note">
            <Banknote size={16} />
            <span>Free shipping on orders over Rs 5,000 — automatically applied at checkout.</span>
          </div>
        </section>

        {/* Order journey */}
        <section className="shop-info-section">
          <h2>Your Order&apos;s Journey</h2>
          <p>From confirmation to your doorstep, here&apos;s what to expect.</p>

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

        {/* FAQs */}
        <section className="shop-info-section">
          <h2>Shipping FAQs</h2>

          <div className="shop-info-faq-grid">
            <div className="shop-info-faq-card">
              <Clock size={18} />
              <h3>Can I track my order?</h3>
              <p>Yes — visit the Orders section of your account for live status updates on every order.</p>
            </div>

            <div className="shop-info-faq-card">
              <Truck size={18} />
              <h3>Do you offer Cash on Delivery?</h3>
              <p>Yes, Cash on Delivery is available nationwide for all ShopFlow orders.</p>
            </div>

            <div className="shop-info-faq-card">
              <MapPin size={18} />
              <h3>Do you deliver everywhere in Pakistan?</h3>
              <p>We deliver to most cities and towns across Pakistan through our courier partners.</p>
            </div>

            <div className="shop-info-faq-card">
              <ShieldCheck size={18} />
              <h3>What if my order arrives damaged?</h3>
              <p>Contact our support team within 48 hours and we&apos;ll arrange a replacement or refund.</p>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
