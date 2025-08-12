"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, MessageSquareText } from "lucide-react";

const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 || "+18565955203";
const WA_E164 = process.env.NEXT_PUBLIC_WHATSAPP_E164 || PHONE_E164;

const telHref = `tel:${PHONE_E164}`;
const smsHref = `sms:${PHONE_E164}`;
const waHref = `https://wa.me/${WA_E164.replace(/\D/g, "")}`;

export default function ContactFAB() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[9999]">
      <div className="animate-fabFadeIn relative">
        {/* Radial actions */}
        <div className="relative w-16 h-16 select-none">
          <Action
            href={telHref}
            label="Call"
            icon={<Phone className="h-5 w-5" />}
            angle={210}
            distMobile={86}
            distDesktop={112}
            open={open}
            className="bg-black text-white"
          />
          <Action
            href={smsHref}
            label="Text"
            icon={<MessageSquareText className="h-5 w-5" />}
            angle={270}
            distMobile={88}      // pulled slightly inward
            distDesktop={118}    // pulled slightly inward
            open={open}
            className="bg-neutral-800 text-white"
          />
          <Action
            href={waHref}
            label="WhatsApp"
            icon={<MessageCircle className="h-5 w-5" />}
            angle={330}
            distMobile={78}      // pulled slightly inward
            distDesktop={104}    // pulled slightly inward
            open={open}
            className="text-white"
            style={{ backgroundColor: "#00C6AE" }}
            external
          />
        </div>

        {/* Main “K” launcher — branded */}
        <button
          aria-label={open ? "Close quick contact" : "Open quick contact"}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className={`
            group mt-2 md:mt-3 relative grid place-items-center
            w-[68px] h-[68px] md:w-[72px] md:h-[72px] rounded-full
            transition-transform duration-300 active:scale-95
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00C6AE]/60
          `}
          style={{ touchAction: "manipulation" }}
        >
          {/* Gradient ring */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full p-[2px] bg-[conic-gradient(from_180deg_at_50%_50%,_#00C6AE_0%,_#34d399_40%,_#00C6AE_80%,_#34d399_100%)]"
          >
            <span className="block w-full h-full rounded-full bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-[0_14px_30px_rgba(0,0,0,0.18)]" />
          </span>

          {/* Shimmer sweep */}
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute -inset-1 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-fabShimmer" />
          </span>

          {/* Teal halo (only when closed) */}
          {!open && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full animate-fabHalo"
              style={{ boxShadow: "0 0 0 0 rgba(0,198,174,0.28)" }}
            />
          )}

          {/* K monogram */}
          <span
            className={`
              relative z-[1] text-[21px] font-semibold tracking-wide
              text-zinc-900 dark:text-white
              transition-transform duration-300
              group-hover:translate-y-[-1px] group-hover:[transform:perspective(400px)_rotateX(6deg)]
            `}
            style={{ fontFamily: "var(--font-sora), sans-serif" }}
          >
            K
          </span>

          {/* Tiny helper tooltip when closed (desktop only) */}
          {!open && (
            <span
              className="
                hidden md:block absolute right-full mr-2 top-1/2 -translate-y-1/2
                text-xs font-medium whitespace-nowrap
                rounded-full px-2.5 py-1
                bg-white/90 dark:bg-zinc-900/85
                text-zinc-900 dark:text-white
                border border-white/50 dark:border-white/10
                shadow-sm animate-labelSlide
              "
              style={{ transform: "translate(-6px, -50%)" }}
            >
              Contact Kolabo
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

type ActionProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  angle: number;        // degrees
  distMobile: number;   // px
  distDesktop: number;  // px
  open: boolean;
  className?: string;
  style?: React.CSSProperties;
  external?: boolean;
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return isDesktop;
}

function Action({
  href,
  label,
  icon,
  angle,
  distMobile,
  distDesktop,
  open,
  className = "",
  style,
  external,
}: ActionProps) {
  const isDesktop = useIsDesktop();

  // Polar -> Cartesian
  const rad = (angle * Math.PI) / 180;
  const dist = isDesktop ? distDesktop : distMobile;
  const x = Math.cos(rad) * dist;
  const y = Math.sin(rad) * dist;

  // Inline transform (works consistently)
  const translate = open ? `translate(${x}px, ${y}px)` : `translate(0px, 0px)`;
  const scale = open ? `scale(1)` : `scale(0)`;
  const transform = `${translate} ${scale}`;

  // Auto-flip label to keep it inside viewport
  const SHIFT = 28;
  const labelShift = x > 0 ? -SHIFT : SHIFT;

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className={`
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        grid place-items-center
        w-12 h-12 md:w-[52px] md:h-[52px] rounded-full
        border border-white/40 dark:border-white/10
        shadow-[0_12px_28px_rgba(0,0,0,0.15)]
        transition-transform duration-500 ease-[cubic-bezier(.22,.92,.22,1)]
        will-change-transform ${className}
      `}
      style={{ ...style, transform, touchAction: "manipulation" }}
    >
      {icon}

      {/* label chip (inside link, fully clickable) */}
      <span
        className={`
          absolute left-1/2 top-1/2 translate-y-[-50%]
          whitespace-nowrap rounded-full px-2.5 py-1
          text-[11px] md:text-xs font-medium
          bg-white/90 dark:bg-zinc-900/80 text-zinc-900 dark:text-white
          border border-white/60 dark:border-white/10
          shadow-sm
          transition-all duration-300
          ${open ? "opacity-100 animate-labelSlide" : "opacity-0"}
        `}
        style={{ transform: `translate(${labelShift}px, -50%)` }}
      >
        {label}
      </span>
    </a>
  );
}
