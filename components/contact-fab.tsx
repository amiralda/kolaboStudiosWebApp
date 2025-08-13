"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, MessageSquareText } from "lucide-react";

const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 || "+18565955203";
const WA_E164 = process.env.NEXT_PUBLIC_WHATSAPP_E164 || PHONE_E164;

const telHref = `tel:${PHONE_E164}`;
const smsHref = `sms:${PHONE_E164}`;
const waHref = `https://wa.me/${WA_E164.replace(/\D/g, "")}`;

// breakpoint helper for spacing
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export default function ContactFAB() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className="fixed bottom-4 md:bottom-6 z-[9999]"
      // Nudge a bit left; safe-area aware so nothing clips on iOS
      style={{ right: "max(env(safe-area-inset-right), 2.75rem)" }} // ≈ right-11
    >
      <div className="animate-fabFadeIn relative">
        {/* Vertical actions column (appears above K) */}
        <VerticalActions open={open} />

        {/* Main “K” launcher */}
        <button
          aria-label={open ? "Close quick contact" : "Open quick contact"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`
            group mt-2 md:mt-3 grid place-items-center
            w-16 h-16 rounded-full
            backdrop-blur-md bg-white/75 dark:bg-zinc-900/60
            border border-white/50 dark:border-white/10
            shadow-[0_14px_30px_rgba(0,0,0,0.18)]
            transition-transform duration-300 active:scale-95
            relative overflow-visible
          `}
          style={{ WebkitBackdropFilter: "blur(12px)" }}
        >
          <span className="text-[19px] md:text-[21px] font-semibold tracking-wide text-zinc-900 dark:text-white">
            K
          </span>

          {/* Teal halo pulse */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full ring-0 animate-fabHalo"
            style={{ boxShadow: "0 0 0 0 rgba(0,198,174,0.35)" }}
          />

          {/* Hover ring */}
          <span className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-[#00C6AE]/25 transition-all" />
        </button>
      </div>
    </div>
  );
}

function VerticalActions({ open }: { open: boolean }) {
  const isDesktop = useIsDesktop();

  // Distances (in px) from the center of the K button, vertically upward
  const gap1 = isDesktop ? 72 : 56;   // first button above K
  const gap2 = isDesktop ? 130 : 100; // second
  const gap3 = isDesktop ? 188 : 144; // third

  // Slight right shift for labels (keeps them readable without going off-screen)
  const LABEL_SHIFT = 24;

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-[220px] pointer-events-none">
      {/* The container has pointer-events none; each action re-enables it */}
      <Action
        href={`tel:${PHONE_E164}`}
        label="Call"
        icon={<Phone className="h-4 w-4 md:h-5 md:w-5" />}
        y={-gap1}
        x={0}
        labelShift={LABEL_SHIFT}
        open={open}
        className="bg-black text-white"
      />
      <Action
        href={`sms:${PHONE_E164}`}
        label="Text"
        icon={<MessageSquareText className="h-4 w-4 md:h-5 md:w-5" />}
        y={-gap2}
        x={0}
        labelShift={LABEL_SHIFT}
        open={open}
        className="bg-neutral-800 text-white"
      />
      <Action
        href={`https://wa.me/${WA_E164.replace(/\D/g, "")}`}
        label="WhatsApp"
        icon={<MessageCircle className="h-4 w-4 md:h-5 md:w-5" />}
        y={-gap3}
        x={0}
        labelShift={LABEL_SHIFT}
        open={open}
        className="text-white"
        style={{ backgroundColor: "#00C6AE" }}
        external
      />
    </div>
  );
}

type ActionProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  x: number;           // horizontal offset from K center (px)
  y: number;           // vertical offset from K center (px, negative is up)
  labelShift: number;  // how far to the right the label sits
  open: boolean;
  className?: string;
  style?: React.CSSProperties;
  external?: boolean;
};

function Action({
  href,
  label,
  icon,
  x,
  y,
  labelShift,
  open,
  className = "",
  style,
  external,
}: ActionProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className={`
        pointer-events-auto
        absolute left-1/2 top-1/2
        grid place-items-center
        w-11 h-11 md:w-12 md:h-12 rounded-full
        border border-white/40 dark:border-white/10
        shadow-[0_12px_28px_rgba(0,0,0,0.15)]
        transition-transform duration-500 ease-[cubic-bezier(.22,.92,.22,1)]
        ${open ? "fab-pop" : ""}
        ${className}
      `}
      style={{
        ...style,
        transform: open
          ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
          : `translate(-50%, -50%) scale(0)`,
        willChange: "transform",
      }}
    >
      {icon}

      {/* Transparent label chip to the right (clickable; part of the <a>) */}
      <span
        className={`
          absolute left-1/2 top-1/2 translate-y-1/2
          whitespace-nowrap rounded-full px-2.5 py-1
          text-[11px] md:text-xs font-medium
          bg-white/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white
          border border-white/30 dark:border-white/20
          shadow-sm
          transition-opacity transition-transform duration-300
          ${open ? "opacity-100 animate-labelSlide" : "opacity-0"}
        `}
        style={{ transform: `translate(${labelShift}px, -50%)` }}
      >
        {label}
      </span>
    </a>
  );
}
