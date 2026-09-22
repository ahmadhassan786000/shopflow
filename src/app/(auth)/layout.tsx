import Link from "next/link";
import { Container } from "react-bootstrap";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Container className="py-4">
        <Link href="/" className="fw-bold text-primary text-decoration-none fs-4">ShopFlow</Link>
      </Container>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center pb-5">
        <div style={{ width: "100%", maxWidth: 420 }} className="px-3">
          {children}
        </div>
      </div>
    </div>
  );
}
