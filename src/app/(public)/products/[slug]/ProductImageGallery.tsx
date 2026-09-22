"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, CheckCircle2, PackageCheck } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  hasSale: boolean;
  discount: number;
}

export function ProductImageGallery({
  images,
  productName,
  hasSale,
  discount,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="shop-gallery-area">
        <div className="shop-main-image">
          <div className="shop-no-image">
            <PackageCheck size={42} />
            <span>No image available</span>
          </div>
        </div>

        <div className="shop-image-note">
          <CheckCircle2 size={15} />
          <span>
            Product images are shown for illustration purposes
          </span>
        </div>
      </div>
    );
  }

  const visibleImages = images.slice(0, 5);
  const selectedImage = visibleImages[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((current) =>
      current === 0 ? visibleImages.length - 1 : current - 1,
    );
  };

  const handleNext = () => {
    setSelectedIndex((current) =>
      current === visibleImages.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div className="shop-gallery-area">
      <div className="shop-main-image">
        <Image
          key={selectedImage.id}
          src={selectedImage.url}
          alt={selectedImage.altText ?? productName}
          fill
          priority={selectedIndex === 0}
          sizes="(max-width: 991px) 100vw, 50vw"
          style={{
            objectFit: "contain",
          }}
        />

        {hasSale && (
          <span className="shop-detail-sale-badge">
            {discount}% OFF
          </span>
        )}

        {visibleImages.length > 1 && (
          <>
            <button
              type="button"
              className="shop-gallery-arrow shop-gallery-arrow-left"
              onClick={handlePrevious}
              aria-label="Previous product image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="shop-gallery-arrow shop-gallery-arrow-right"
              onClick={handleNext}
              aria-label="Next product image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      <div className="shop-thumbnail-row">
        {visibleImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`shop-thumbnail ${
              index === selectedIndex ? "active" : ""
            }`}
            onClick={() => setSelectedIndex(index)}
            aria-label={`View product image ${index + 1}`}
            aria-current={
              index === selectedIndex ? "true" : undefined
            }
          >
            <Image
              src={image.url}
              alt={image.altText ?? productName}
              fill
              sizes="80px"
              style={{
                objectFit: "cover",
              }}
            />
          </button>
        ))}
      </div>

      <div className="shop-image-note">
        <CheckCircle2 size={15} />
        <span>
          Product images are shown for illustration purposes
        </span>
      </div>
    </div>
  );
}