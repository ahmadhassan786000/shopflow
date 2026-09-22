import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import {
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer
      className="text-light mt-5"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #172554 50%, #020617 100%)",
      }}
    >
      <Container>
        <div className="py-5">
          <Row className="gy-5">
            {/* Brand */}
            <Col xs={12} lg={4}>
              <div className="pe-lg-5">
                <Link
                  href="/"
                  className="text-decoration-none d-inline-block mb-3"
                >
                  <span
                    className="fw-bold fs-3"
                    style={{
                      color: "#22c55e",
                    }}
                  >
                    ShopFlow
                  </span>
                </Link>

                <p
                  className="mb-4 lh-lg"
                  style={{
                    color: "#9ca3af",
                  }}
                >
                  Quality products, fast shipping,
                  and a secure shopping experience â€”
                  everything you need in one place.
                </p>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/923250794101"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact ShopFlow on WhatsApp"
                  className="d-inline-flex align-items-center gap-3 text-decoration-none rounded-3 px-3 py-2"
                  style={{
                    backgroundColor:
                      "rgba(34, 197, 94, 0.10)",
                    border:
                      "1px solid rgba(34, 197, 94, 0.25)",
                    color: "#22c55e",
                  }}
                >
                  <MessageCircle size={21} />

                  <span>
                    <span
                      className="d-block small"
                      style={{
                        color: "#9ca3af",
                      }}
                    >
                      Need help?
                    </span>

                    <span className="fw-semibold">
                      Chat on WhatsApp
                    </span>
                  </span>

                  <ArrowUpRight size={17} />
                </a>
              </div>
            </Col>

            {/* Shop */}
            <Col xs={6} sm={4} lg={2}>
              <h6 className="fw-semibold mb-4">
                Shop
              </h6>

              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <Link
                    href="/products"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    All Products
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Account */}
            <Col xs={6} sm={4} lg={2}>
              <h6 className="fw-semibold mb-4">
                Account
              </h6>

              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <Link
                    href="/account"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    My Account
                  </Link>
                </li>

                <li className="mb-3">
                  <Link
                    href="/orders"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    Order History
                  </Link>
                </li>

                <li>
                  <Link
                    href="/wishlist"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    Wishlist
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Support */}
            <Col xs={6} sm={4} lg={2}>
              <h6 className="fw-semibold mb-4">
                Support
              </h6>

              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <Link
                    href="/about"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    About Us
                  </Link>
                </li>

                <li className="mb-3">
                  <Link
                    href="/contact"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    Contact Us
                  </Link>
                </li>

                <li className="mb-3">
                  <Link
                    href="/shipping"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    Shipping Info
                  </Link>
                </li>

                <li>
                  <Link
                    href="/returns"
                    className="text-decoration-none small"
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    Returns
                  </Link>
                </li>
              </ul>
            </Col>
          </Row>
        </div>

        {/* Bottom */}
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 py-4"
          style={{
            borderTop:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            className="small mb-0"
            style={{
              color: "#6b7280",
            }}
          >
            Â© {new Date().getFullYear()} ShopFlow.
            All rights reserved.
          </p>

          <div className="d-flex align-items-center gap-2">
            <span
              className="rounded-circle"
              style={{
                width: 7,
                height: 7,
                backgroundColor: "#22c55e",
              }}
            />

            <span
              className="small"
              style={{
                color: "#6b7280",
              }}
            >
              Secure shopping experience
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

