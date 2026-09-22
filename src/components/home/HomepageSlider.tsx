"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

export interface HomepageSlide {
  id: string;
  title: string;
  description: string | null;
  image: string;
  buttonText: string | null;
  buttonUrl: string | null;
}

interface HomepageSliderProps {
  slides: HomepageSlide[];
}

const AUTO_ADVANCE_MS = 5000;

export function HomepageSlider({
  slides,
}: HomepageSliderProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        (currentIndex + 1) % slides.length,
      );
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  if (!activeSlide) {
    return null;
  }

  return (
    <section
      className="position-relative bg-dark text-white overflow-hidden"
      style={{ height: "clamp(260px, 36vw, 520px)" }}
      aria-roledescription="carousel"
      aria-label="Homepage promotions"
    >
      <Image
        key={activeSlide.id}
        src={activeSlide.image}
        alt={activeSlide.title}
        fill
        priority={activeIndex === 0}
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" />

      <div className="container position-relative h-100 d-flex align-items-center justify-content-center text-center">
        <div style={{ maxWidth: 680 }}>
          <h1 className="display-5 fw-bold mb-3">
            {activeSlide.title}
          </h1>

          {activeSlide.description && (
            <p className="lead mb-4">
              {activeSlide.description}
            </p>
          )}

          {activeSlide.buttonText &&
            activeSlide.buttonUrl && (
              <Link
                href={activeSlide.buttonUrl}
                className="btn btn-light btn-lg"
              >
                {activeSlide.buttonText}
              </Link>
            )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 pb-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`rounded-circle border border-white ${
                index === activeIndex
                  ? "bg-white"
                  : "bg-transparent"
              }`}
              style={{ width: 10, height: 10 }}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              aria-current={
                index === activeIndex
                  ? "true"
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
