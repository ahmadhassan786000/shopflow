"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Container,
  Navbar,
  Offcanvas,
  Form,
  Badge,
  Button,
} from "react-bootstrap";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Package,
  Menu,
  X,
  ChevronRight,
  Store,
} from "lucide-react";

interface StorefrontNavbarProps {
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
}

export function StorefrontNavbar({
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
}: StorefrontNavbarProps) {
  const pathname = usePathname();
  const [showMobileNav, setShowMobileNav] = useState(false);

  const accountHref = isLoggedIn ? "/account" : "/login";

  function closeMobileNav() {
    setShowMobileNav(false);
  }

  const isActive = (href: string) => pathname === href;

  return (
    <Navbar
      expand="lg"
      className="shop-main-navbar sticky-top"
    >
      <Container className="shop-navbar-container">
        {/* BRAND */}
        <Navbar.Brand
          as={Link}
          href="/"
          className="shop-navbar-brand"
        >
          <span className="shop-brand-icon">
            <Store size={19} />
          </span>

          <span>ShopFlow</span>
        </Navbar.Brand>

        {/* DESKTOP SEARCH */}
        <div className="shop-desktop-search">
          <Form
            action="/products"
            method="get"
            role="search"
            className="shop-navbar-search"
          >
            <Search size={19} />

            <Form.Control
              type="search"
              name="search"
              placeholder="Search products, categories..."
              aria-label="Search products"
            />

            <button type="submit" aria-label="Search">
              Search
            </button>
          </Form>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="shop-desktop-actions">
          <Link
            href={accountHref}
            className={`shop-nav-action ${
              isActive("/account") ? "active" : ""
            }`}
          >
            <span className="shop-nav-action-icon">
              <User size={19} />
            </span>

            <span className="shop-nav-action-text">
              <small>{isLoggedIn ? "" : ""}</small>
              <strong>{isLoggedIn ? "Account" : "Login"}</strong>
            </span>
          </Link>

          {isLoggedIn && (
            <Link
              href="/orders"
              className={`shop-nav-action ${
                isActive("/orders") ? "active" : ""
              }`}
            >
              <span className="shop-nav-action-icon">
                <Package size={19} />
              </span>

              <span className="shop-nav-action-text">
                <small></small>
                <strong>Orders</strong>
              </span>
            </Link>
          )}

          <Link
            href="/wishlist"
            className={`shop-nav-icon-action ${
              isActive("/wishlist") ? "active" : ""
            }`}
            aria-label="Wishlist"
          >
            <Heart size={21} />

            {wishlistCount > 0 && (
              <Badge className="shop-nav-badge">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </Badge>
            )}
          </Link>

          <Link
            href="/cart"
            className={`shop-nav-cart ${
              isActive("/cart") ? "active" : ""
            }`}
          >
            <span className="shop-cart-icon">
              <ShoppingCart size={21} />

              {cartCount > 0 && (
                <Badge className="shop-nav-badge">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </span>

            <span className="shop-cart-label">Cart</span>
          </Link>
        </div>

        {/* MOBILE TOP ACTIONS */}
        <div className="shop-mobile-actions">
          <Navbar.Toggle
            aria-label="Open menu"
            className="shop-mobile-menu-button"
            onClick={() => setShowMobileNav(true)}
          >
            <Menu size={23} />
          </Navbar.Toggle>
        </div>

        {/* MOBILE OFFCANVAS */}
        <Offcanvas
          show={showMobileNav}
          onHide={closeMobileNav}
          placement="end"
          className="shop-mobile-offcanvas"
        >
          <Offcanvas.Header className="shop-offcanvas-header">
            <Offcanvas.Title className="shop-offcanvas-title">
              <span className="shop-brand-icon">
                <Store size={18} />
              </span>

              <span>ShopFlow</span>
            </Offcanvas.Title>

            <button
              type="button"
              className="shop-offcanvas-close"
              onClick={closeMobileNav}
              aria-label="Close menu"
            >
              <X size={21} />
            </button>
          </Offcanvas.Header>

          <Offcanvas.Body className="shop-offcanvas-body">
            {/* MOBILE SEARCH */}
            <Form
              action="/products"
              method="get"
              role="search"
              className="shop-mobile-search"
            >
              <Search size={18} />

              <Form.Control
                type="search"
                name="search"
                placeholder="Search products..."
                aria-label="Search products"
              />

              <button type="submit" aria-label="Search">
                <ChevronRight size={18} />
              </button>
            </Form>

            {/* ACCOUNT CARD */}
            <Link
              href={accountHref}
              onClick={closeMobileNav}
              className="shop-mobile-account-card"
            >
              <div className="shop-mobile-account-icon">
                <User size={21} />
              </div>

              <div>
                <small>{isLoggedIn ? "Welcome back" : "Welcome to ShopFlow"}</small>
                <strong>{isLoggedIn ? "Account" : "Login to your account"}</strong>
              </div>

              <ChevronRight size={18} />
            </Link>

            {/* MENU LABEL */}
            <div className="shop-mobile-menu-label">
              Shopping
            </div>

            {/* CART */}
            <Link
              href="/cart"
              onClick={closeMobileNav}
              className={`shop-mobile-menu-item ${
                isActive("/cart") ? "active" : ""
              }`}
            >
              <span className="shop-mobile-menu-icon cart">
                <ShoppingCart size={20} />
              </span>

              <span className="shop-mobile-menu-content">
                <strong>Shopping Cart</strong>
                <small>
                  {cartCount > 0
                    ? `${cartCount} ${
                        cartCount === 1 ? "item" : "items"
                      }`
                    : "Your cart is empty"}
                </small>
              </span>

              {cartCount > 0 && (
                <Badge className="shop-mobile-menu-badge">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}

              <ChevronRight size={17} className="shop-mobile-arrow" />
            </Link>

            {/* WISHLIST */}
            <Link
              href="/wishlist"
              onClick={closeMobileNav}
              className={`shop-mobile-menu-item ${
                isActive("/wishlist") ? "active" : ""
              }`}
            >
              <span className="shop-mobile-menu-icon wishlist">
                <Heart size={20} />
              </span>

              <span className="shop-mobile-menu-content">
                <strong>Wishlist</strong>
                <small>
                  {wishlistCount > 0
                    ? `${wishlistCount} ${
                        wishlistCount === 1 ? "item" : "items"
                      } saved`
                    : "No saved items"}
                </small>
              </span>

              {wishlistCount > 0 && (
                <Badge className="shop-mobile-menu-badge">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </Badge>
              )}

              <ChevronRight size={17} className="shop-mobile-arrow" />
            </Link>

            {/* ORDERS */}
            {isLoggedIn && (
              <Link
                href="/orders"
                onClick={closeMobileNav}
                className={`shop-mobile-menu-item ${
                  isActive("/orders") ? "active" : ""
                }`}
              >
                <span className="shop-mobile-menu-icon orders">
                  <Package size={20} />
                </span>

                <span className="shop-mobile-menu-content">
                  <strong>Orders</strong>
                  <small>Track your purchases</small>
                </span>

                <ChevronRight
                  size={17}
                  className="shop-mobile-arrow"
                />
              </Link>
            )}

            {/* ACCOUNT */}
            {isLoggedIn && (
              <Link
                href="/account"
                onClick={closeMobileNav}
                className={`shop-mobile-menu-item ${
                  isActive("/account") ? "active" : ""
                }`}
              >
                <span className="shop-mobile-menu-icon account">
                  <User size={20} />
                </span>

                <span className="shop-mobile-menu-content">
                  <strong>Account Settings</strong>
                  <small>Manage your profile</small>
                </span>

                <ChevronRight
                  size={17}
                  className="shop-mobile-arrow"
                />
              </Link>
            )}

            {/* SHOP LINK */}
            <div className="shop-mobile-menu-label shop-mobile-menu-label-spaced">
              Explore
            </div>

            <Link
              href="/products"
              onClick={closeMobileNav}
              className={`shop-mobile-menu-item ${
                isActive("/products") ? "active" : ""
              }`}
            >
              <span className="shop-mobile-menu-icon shop">
                <Store size={20} />
              </span>

              <span className="shop-mobile-menu-content">
                <strong>Shop All Products</strong>
                <small>Explore our collection</small>
              </span>

              <ChevronRight
                size={17}
                className="shop-mobile-arrow"
              />
            </Link>

            {/* MOBILE FOOTER */}
            <div className="shop-mobile-footer">
              <div className="shop-mobile-footer-line" />

              <p>
                Shop with confidence
              </p>

              <span>
                Secure shopping • Fast delivery • Easy returns
              </span>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

