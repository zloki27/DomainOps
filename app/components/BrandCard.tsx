"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BrandCardProps {
  slug: string;
  displayName: string;
  logo: string | null;
}

export default function BrandCard({ slug, displayName, logo }: BrandCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/brands/${slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        background: "white",
        borderRadius: 12,
        padding: "1.5rem 1rem",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        border: `1px solid ${hovered ? "#CA8A04" : "#F5F5F4"}`,
        textDecoration: "none",
        cursor: "pointer",
        transition: "box-shadow 200ms ease, border-color 200ms ease, transform 200ms ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        minHeight: 120,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {logo ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 40 }}>
          <Image
            src={logo}
            alt={displayName}
            width={120}
            height={40}
            style={{ objectFit: "contain", maxHeight: 40, maxWidth: 120 }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "var(--color-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {displayName}
        </div>
      )}
      <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-secondary)", textAlign: "center" }}>
        {displayName}
      </span>
    </Link>
  );
}
