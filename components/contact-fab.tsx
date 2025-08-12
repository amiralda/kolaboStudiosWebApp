"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, MessageSquareText } from "lucide-react";

/**
 * Uses env vars but falls back to your real number for local dev.
 * Set these on Vercel:
 *  - NEXT_PUBLIC_PHONE_E164
 *  - NEXT_PUBLIC_WHATSAPP_E164
 */
const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 || "+18565955203";
const WA_E164 = process.env.NEXT_PUBLIC_WHATSAPP_E164 || PHONE_E164;

const telHref = `tel:${PHONE_E164}`;
const smsHref = `sms:${PHONE_E164}`;
const waHref = `https://wa.me/${WA_E164.replace(/\D/g, "")}`;

/**
 * Branded, animated radial FAB
 * - Idle: single “K” button (Kolabo)
 * - Tap/Click: three actions orbit out with springy motion
 * - Glassy look, brand teal accent (#00C6AE)
 */
export default function ContactFAB() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[9999]">
      {/* Container with subtle entrance */}
      <div className={`animate-fabFadeIn`}>
        {/* Satellite actions */}
        <div className="relative w-14 h-14 md:w-16 md:h-16">
          {/* CALL */}
          <a
            href={telHref}
            aria-label="Call Kolabo Studios"
            className={satelliteClass(
              open,
              // angle, distance(px) for mobile/desktop
              210, 72, 96,
              "bg-black text-white"
            )}
          >
            <Phone className="h-[18px] w-[18px] md:h-5 md:w-5" />
          </a>

          {/* TEXT */}
          <a
            href={smsHref}
            aria-label="Text Kolabo Studios"
            className={satelliteClass(
              open,
              270, 78, 108,
              "bg-neutral-800 text-white"
            )}
          >
            <MessageSquareText className="h-[18px] w-[18px] md:h-5 md:w-5" />
          </a>

          {/* WHATSAPP */}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Kolabo Studios"
            className={satelliteClass(
              open,
              330, 72, 96,
              "text-white"
            )}
            style={{ backgroundColor: "#00C6AE" }}
          >
            <MessageCircle className="h-[18px] w-[18px] md:h-5 md:w-5" />
          </a>
        </div>

        {/* Main launcher (K) */}
        <button
          aria-label={open ? "Close quick contact" : "Open quick contact"}
          onClick={() => setOpen(v => !v)}
          className={`
            group mt-2 md:mt-3 grid place-items-center
            w-14 h-14 md:w-16 md:h-16 rounded-full
            shadow-[0_10px_25px_rgba(0,0,0,0.18)]
            border border-white/50 dark:border-white/10
            backdrop-blur-md bg-white/70 dark:bg-zinc-900/60
            transition-transform duration-300 active:scale-95
          `}
          style={{ WebkitBackdropFilter: "blur(10px)" }}
        >
          {/* K monogram */}
          <span
            className={`
              font-sora text-[18px] md:text-[20px] font-semibold tracking-wide
              text-zinc-900 dark:text-white
            `}
          >
            K
          </span>

          {/* Ripple accent on hover */}
          <span
            className={`
              pointer-events-none absolute inset-0 rounded-full
              ring-0 group-hover:ring-4 ring-[#00C6AE]/25 transition-all
            `}
          />
        </button>
      </div>
    </div>
  );
}

/** Build satellite button classes + position/animation */
function satelliteClass(
  open: boolean,
  angleDeg: number,
  distMobile: number,
  distDesktop: number,
  colorClasses: string
) {
  // Convert polar to cartesian for mobile/desktop distances
  const rad = (angleDeg * Math.PI) / 180;
  const xM = Math.cos(rad) * distMobile;
  const yM = Math.sin(rad) * distMobile;
  const xD = Math.cos(rad) * distDesktop;
  const yD = Math.sin(rad) * distDesktop;

  return `
    absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    grid place-items-center
    w-11 h-11 md:w-12 md:h-12 rounded-full
    shadow-[0_10px_25px_rgba(0,0,0,0.15)]
    border border-white/40 dark:border-white/10
    ${colorClasses}
    ${open ? "scale-100 fab-pop" : "scale-0"}
    transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]
    will-change-transform

    ${open
      ? `translate-x-[${xM}px] translate-y-[${yM}px] md:translate-x-[${xD}px] md:translate-y-[${yD}px]`
      : "translate-x-[0px] translate-y-[0px]"
    }
  `;
}
