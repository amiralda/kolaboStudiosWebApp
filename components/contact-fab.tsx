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
      {/* subtle entrance */}
      <div className="animate-fabFadeIn relative">
        {/* Radial actions */}
        <div className="relative w-16 h-16 select-none">
          <Action
            href={telHref}
            label="Call"
            icon={<Phone className="h-4 w-4 md:h-5 md:w-5" />}
            angle={210}
            distMobile={86}
            distDesktop={112}
            open={open}
            className="bg-black text-white"
          />
          <Action
            href={smsHref}
            label="Text"
            icon={<MessageSquareText className="h-4 w-4 md:h-5 md:w-5" />}
            angle={270}
            distMobile={94}
            distDesktop={128}
            open={open}
            className="bg-neutral-800 text-white"
          />
          <Action
            href={waHref}
            label="WhatsApp"
            icon={<MessageCircle className="h-4 w-4 md:h-5 md:w-5" />}
            angle={330}
            distMobile={86}
            distDesktop={112}
            open={open}
            className="text-white"
            style={{ backgroundColor: "#00C6AE" }}
            external
          />
        </div>

        {/* Main “K” launcher */}
        <button
          aria-label={open ? "Close quick contact" : "Open quick contact"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`
            group mt-2 md:mt-3 grid place-items-center
            w-16 h-16 md:w-18 md:h-18 rounded-full
            backdrop-blur-md bg-white/75 dark:bg-zinc-900/60
            border border-white/50 dark:border-white/10
            shadow-[0_14px_30px_rgba(0,0,0,0.18)]
            transition-transform duration-300 active:scale-95
            relative overflow-visible
          `}
          style={{ WebkitBackdropFilter: "blur(12px)" }}
        >
          {/* K monogram */}
          <span className="text-[19px] md:text-[21px] font-semibold tracking-wide text-zinc-900 dark:text-white">
            K
          </span>

          {/* Teal halo pulse to hint interactivity */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full ring-0 animate-fabHalo"
            style={{ boxShadow: "0 0 0 0 rgba(0,198,174,0.35)" }}
          />

          {/* Hover ring (desktop) */}
          <span className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-[#00C6AE]/25 transition-all" />
        </button>
      </div>
    </div>
  );
}

type ActionProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  angle: number;
  distMobile: number;
  distDesktop: number;
  open: boolean;
  className?: string;
  style?: React.CSSProperties;
  external?: boolean;
};

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
  // position from angle + distance
  const rad = (angle * Math.PI) / 180;
  const xm = Math.cos(rad) * distMobile;
  const ym = Math.sin(rad) * distMobile;
  const xd = Math.cos(rad) * distDesktop;
  const yd = Math.sin(rad) * distDesktop;

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className={`
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        grid place-items-center
        w-11 h-11 md:w-12 md:h-12 rounded-full
        border border-white/40 dark:border-white/10
        shadow-[0_12px_28px_rgba(0,0,0,0.15)]
        transition-transform duration-500 ease-[cubic-bezier(.22,.92,.22,1)]
        ${open ? "scale-100 fab-pop" : "scale-0"}
        ${className}
        will-change-transform
        ${open
          ? `translate-x-[${xm}px] translate-y-[${ym}px] md:translate-x-[${xd}px] md:translate-y-[${yd}px]`
          : "translate-x-[0px] translate-y-[0px]"}
      `}
      style={style}
    >
      {icon}
      {/* label chip */}
      <span
        className={`
          absolute left-1/2 top-1/2 translate-y-1/2 ml-2
          md:ml-3 whitespace-nowrap
          rounded-full px-2.5 py-1
          text-[11px] md:text-xs font-medium
          bg-white/90 dark:bg-zinc-900/80 text-zinc-900 dark:text-white
          border border-white/60 dark:border-white/10
          shadow-sm
          transition-all duration-300
          ${open ? "opacity-100 translate-x-0 animate-labelSlide" : "opacity-0 translate-x-2"}
        `}
        style={{ transform: "translate(20px, -50%)" }}
      >
        {label}
      </span>
    </a>
  );
}
