import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "react-bootstrap";
import {
  Banknote,
  Boxes,
  ChevronRight,
  CircleCheck,
  CreditCard,
  Headphones,
  MapPinned,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About ShopFlow",
  description:
    "Learn how ShopFlow makes electronics shopping clearer, more reliable, and more convenient across Pakistan.",
};

const categories = [
  "Mobile Phones",
  "Laptops",
  "Tablets",
  "Smart Watches",
  "Wireless Earbuds",
  "Speakers",
  "Power Banks",
  "Cables",
];

const assurances = [
  {
    icon: PackageCheck,
    title: "Open-parcel check",
    text: "Where available, inspect your order at delivery so you can receive it with greater confidence.",
  },
  {
    icon: Headphones,
    title: "Helpful support",
    text: "Questions before or after an order? Our support team is here to help you move forward.",
  },
  {
    icon: Boxes,
    title: "Careful packing",
    text: "We focus on practical, protective packing to help your electronics arrive ready for you.",
  },
  {
    icon: RotateCcw,
    title: "Straightforward returns",
    text: "If something is not right, our return process is designed to be clear and easy to follow.",
  },
];

const values = [
  ["Inspired", "We stay curious about the technology that can make everyday life easier."],
  ["Authentic", "We communicate plainly, so you can make decisions with the information you need."],
  ["Tenacious", "We keep improving the small details that make ordering feel dependable."],
  ["Together", "We listen to shoppers, partners, and our team to build a better experience."],
];

export default function AboutPage() {
  return (
    <>
      <section className="border-bottom bg-white py-3">
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">About ShopFlow</li>
            </ol>
          </nav>
        </Container>
      </section>

      <section className="position-relative overflow-hidden text-white" style={{ minHeight: "430px", background: "#102b59" }}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Woman_using_smartphone.jpg/1280px-Woman_using_smartphone.jpg"
          alt="Shopper using a smartphone"
          fill
          priority
          sizes="100vw"
          className="object-fit-cover"
          style={{ opacity: 0.72 }}
        />
        <div className="position-absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(9, 28, 63, .95) 0%, rgba(16, 43, 89, .78) 48%, rgba(16, 43, 89, .25) 100%)" }} />
        <Container className="position-relative py-5 d-flex align-items-center" style={{ minHeight: "430px" }}>
          <div className="col-12 col-lg-7 py-4">
            <p className="text-uppercase fw-bold small mb-3" style={{ color: "#ffb34d", letterSpacing: ".13em" }}>Pakistan-first shopping, made practical</p>
            <h1 className="display-4 fw-bold lh-sm mb-3">The easier way to choose your next essential.</h1>
            <p className="lead mb-4" style={{ maxWidth: "42rem" }}>ShopFlow brings phones, tech, and everyday electronics into one clear place—so comparing, ordering, and receiving what you need feels refreshingly simple.</p>
            <Link href="/products" className="btn btn-primary btn-lg px-4">Explore products <ChevronRight size={18} className="ms-1" /></Link>
          </div>
        </Container>
      </section>

      <section className="py-5 bg-white">
        <Container>
          <div className="row align-items-end mb-4">
            <div className="col-lg-7"><p className="text-uppercase fw-bold small text-primary mb-2" style={{ letterSpacing: ".12em" }}>Shop with purpose</p><h2 className="display-6 fw-bold mb-0">Everything you need, in one place.</h2></div>
            <div className="col-lg-5"><p className="text-secondary mb-0">From your daily driver to the accessories that keep it moving, start with the categories people return to most.</p></div>
          </div>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {categories.map((category, index) => (
              <div className="col" key={category}>
                <Link href="/products" className="d-flex h-100 align-items-center gap-3 border border-light-subtle bg-light p-3 text-decoration-none text-dark shadow-sm" style={{ borderLeft: `4px solid ${index % 2 === 0 ? "#2f6fed" : "#ffb34d"}` }}>
                  <Smartphone size={21} className="text-primary flex-shrink-0" aria-hidden="true" />
                  <span className="fw-semibold small">{category}</span>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-5" style={{ background: "#f5f8fd" }}>
        <Container>
          <div className="text-center mx-auto mb-4" style={{ maxWidth: "42rem" }}><p className="text-uppercase fw-bold small text-primary mb-2" style={{ letterSpacing: ".12em" }}>Shop with confidence</p><h2 className="display-6 fw-bold">Reliability in the details.</h2><p className="text-secondary mb-0">A more considered online shopping experience from checkout to doorstep.</p></div>
          <div className="row g-3">
            {assurances.map(({ icon: Icon, title, text }) => (
              <div className="col-md-6 col-xl-3" key={title}>
                <article className="h-100 bg-white border p-4 shadow-sm">
                  <span className="d-inline-flex align-items-center justify-content-center text-primary bg-primary-subtle mb-4" style={{ width: "44px", height: "44px", borderRadius: "12px" }}><Icon size={22} /></span>
                  <h3 className="h5 fw-bold">{title}</h3><p className="text-secondary small mb-0">{text}</p>
                </article>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-5 text-white" style={{ background: "#12366c" }}>
        <Container><div className="row align-items-center g-4"><div className="col-md-2"><MapPinned size={48} style={{ color: "#ffb34d" }} /></div><div className="col-md-7"><p className="text-uppercase fw-bold small mb-2" style={{ color: "#ffb34d", letterSpacing: ".12em" }}>Across Pakistan</p><h2 className="h2 fw-bold mb-2">Your next order is closer than it feels.</h2><p className="mb-0 opacity-75">We work to make electronics shopping accessible beyond the big-city storefront—wherever your everyday needs take you.</p></div><div className="col-md-3 text-md-end"><span className="d-inline-flex align-items-center gap-2 fw-semibold"><ShieldCheck size={20} /> Clear order updates</span></div></div></Container>
      </section>

      <section className="py-5 bg-white">
        <Container><div className="row g-5 align-items-center"><div className="col-lg-5"><p className="text-uppercase fw-bold small text-primary mb-2" style={{ letterSpacing: ".12em" }}>Pay your way</p><h2 className="display-6 fw-bold">More ways to complete your order.</h2><p className="text-secondary mb-0">Choose the payment method that works best for you. Options can vary by your order, location, and payment provider.</p></div><div className="col-lg-7"><div className="row g-3">{[[CreditCard, "Credit & debit cards"], [Banknote, "Bank transfer"], [CircleCheck, "Cash on delivery"], [Smartphone, "Installments"]].map(([Icon, label]) => { const PaymentIcon = Icon as typeof CreditCard; return <div className="col-sm-6" key={label as string}><div className="border h-100 p-3 d-flex align-items-center gap-3"><PaymentIcon size={24} className="text-primary" /><span className="fw-semibold">{label as string}</span></div></div>; })}</div></div></div></Container>
      </section>

      <section className="py-5" style={{ background: "#f5f8fd" }}>
        <Container><div className="row align-items-end mb-4"><div className="col-lg-7"><p className="text-uppercase fw-bold small text-primary mb-2" style={{ letterSpacing: ".12em" }}>Our compass</p><h2 className="display-6 fw-bold mb-0">What guides ShopFlow.</h2></div></div><div className="row g-4">{values.map(([title, text], index) => <div className="col-sm-6 col-lg-3" key={title}><article className="border-top border-4 h-100 pt-3" style={{ borderColor: index % 2 ? "#ffb34d" : "#2f6fed" }}><span className="text-primary fw-bold">0{index + 1}</span><h3 className="h4 fw-bold mt-2">{title}</h3><p className="text-secondary mb-0">{text}</p></article></div>)}</div></Container>
      </section>

      <section className="py-5 bg-white text-center"><Container><h2 className="h1 fw-bold">Ready when you are.</h2><p className="text-secondary mx-auto mb-4" style={{ maxWidth: "34rem" }}>Find the tech that fits your day, with a shopping experience built around clarity.</p><Link href="/products" className="btn btn-primary btn-lg px-4">Browse all products</Link></Container></section>
    </>
  );
}
