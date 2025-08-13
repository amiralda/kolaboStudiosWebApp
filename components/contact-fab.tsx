"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MessageCircle,
  MessageSquareText,
  X,
  Clipboard,
} from "lucide-react";

/** --- Phone handling & helpers --- */
const RAW_PHONE = process.env.NEXT_PUBLIC_PHONE_E164 || "+18565955203";
const RAW_WA = process.env.NEXT_PUBLIC_WHATSAPP_E164 || RAW_PHONE;

// Keep + for tel/sms (E.164), strip to digits for WhatsApp deep links.
const WA_DIGITS = RAW_WA.replace(/\D/g, "");

// Remember preferred channel (purely UX)
const PREF_KEY = "kolabo-preferred-channel";

function vibrate(ms = 12) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch {}
}
function track(event: string, data?: Record<string, any>) {
  try {
    (window as any).plausible?.(event, { props: data });
  } catch {}
}

export default function ContactFAB() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pref, setPref] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
    try {
      setPref(localStorage.getItem(PREF_KEY));
    } catch {}
  }, []);

  // Build context-aware prefill when client is mounted
  const { telHref, smsHref, waHref } = React.useMemo(() => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://kolabostudios.com";
    const path =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const fullUrl = `${origin}${path}`;
    const pageHint = path === "/" ? "the homepage" : `the page: ${path}`;

    const body =
      `Hi Kolabo Studios 👋\n\n` +
      `I'm interested in booking a session.\n` +
      `I'm currently viewing ${pageHint} (${fullUrl}).\n\n` +
      `Service: [Wedding / Engagement / Maternity / Retouch]\n` +
      `Preferred date: [MM/DD]\n` +
      `Budget: [Flexible]\n` +
      `Notes: [Tell us anything important]\n\n` +
      `— Sent from kolabostudios.com`;

    const encoded = encodeURIComponent(body);

    return {
      telHref: `tel:${RAW_PHONE}`, // don't add a body for tel:
      smsHref: `sms:${RAW_PHONE}?&body=${encoded}`,
      waHref: `https://wa.me/${WA_DIGITS}?text=${encoded}`,
    };
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") {
        setOpen(true);
        vibrate(10);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating K button — nudged inward so sheet never spills off-screen */}
      <div
        className="fixed bottom-4 md:bottom-6 z-[9999]"
        style={{ right: "max(env(safe-area-inset-right), 4.25rem)" }}
      >
        <button
          aria-label={open ? "Close contact options" : "Open contact options"}
          onClick={() => {
            setOpen(true);
            vibrate(12);
            track("contact_open");
          }}
          className={`
            group grid place-items-center
            w-16 h-16 rounded-full
            backdrop-blur-md bg-white/60 dark:bg-zinc-900/55
            border border-white/40 dark:border-white/10
            shadow-[0_14px_30px_rgba(0,0,0,0.18)]
            transition-transform duration-300 active:scale-95
            relative overflow-visible
          `}
          style={{ WebkitBackdropFilter: "blur(12px)" }}
        >
          <span className="text-[21px] font-semibold tracking-wide text-zinc-900 dark:text-white">
            K
          </span>
          {/* soft teal halo */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full animate-fabHalo"
            style={{ boxShadow: "0 0 0 0 rgba(0,198,174,0.35)" }}
          />
          <span className="pointer-events-none absolute inset-0 rounded-full group-hover:ring-4 ring-[#00C6AE]/30 transition-all" />
        </button>
      </div>

      {/* Glass dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] border-0 bg-transparent p-0 dialog-animate-in">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            {/* Gradient frame */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                padding: 2,
                background:
                  "linear-gradient(135deg, rgba(0,198,174,0.55), rgba(255,255,255,0.35))",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude" as any,
              }}
            />
            {/* Glass panel (more transparent + stronger blur) */}
            <div className="relative rounded-2xl bg-white/30 dark:bg-zinc-900/45 backdrop-blur-3xl">
              <DialogHeader className="px-5 pt-5">
                {/* Copy icon + Close in header */}
                <DialogClose asChild>
                  <button
                    aria-label="Close"
                    className="absolute right-4 top-4 grid place-items-center size-9 rounded-full bg-white/55 dark:bg-zinc-800/60 border border-white/40 dark:border-white/10 hover:bg-white/75 dark:hover:bg-zinc-800/80 transition-colors"
                  >
                    <X className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                  </button>
                </DialogClose>

                <button
                  aria-label="Copy phone number"
                  onClick={() => {
                    navigator.clipboard.writeText(RAW_PHONE);
                    vibrate(8);
                    track("contact_copy_number");
                  }}
                  className="absolute right-16 top-4 grid place-items-center size-9 rounded-full bg-white/55 dark:bg-zinc-800/60 border border-white/40 dark:border-white/10 hover:bg-white/75 dark:hover:bg-zinc-800/80 transition-colors"
                  title={`Copy ${RAW_PHONE}`}
                >
                  <Clipboard className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                </button>

                {/* Centered title & subtitle */}
                <DialogTitle className="text-center text-[1.15rem] font-sora text-zinc-900 dark:text-white">
                  Contact Kolabo Studios
                </DialogTitle>
                <DialogDescription className="text-center text-sm text-zinc-700/85 dark:text-zinc-300/90">
                  Select your preferred way to connect with us. We’re online and ready to assist you.
                </DialogDescription>
                <div className="flex justify-center pt-2 pb-1">
                  <HoursBadge />
                </div>
              </DialogHeader>

              {/* Actions */}
              <div className="px-5 pb-5 grid gap-3">
                <GlassAction
                  href={telHref}
                  label="Call Now"
                  icon={<Phone className="h-5 w-5 opacity-90" />}
                  highlight={pref === "call"}
                  onClick={() => {
                    remember("call", setPref);
                    vibrate(10);
                    track("contact_call");
                  }}
                />

                <GlassAction
                  href={smsHref}
                  label="Text Message"
                  icon={<MessageSquareText className="h-5 w-5 opacity-90" />}
                  highlight={pref === "text"}
                  onClick={() => {
                    remember("text", setPref);
                    vibrate(10);
                    track("contact_text");
                  }}
                />

                <GlassAction
                  href={waHref}
                  label="WhatsApp Chat"
                  icon={<MessageCircle className="h-5 w-5 opacity-90" />}
                  external
                  accent
                  highlight={pref === "whatsapp"}
                  onClick={() => {
                    remember("whatsapp", setPref);
                    vibrate(10);
                    track("contact_whatsapp");
                  }}
                />
              </div>

              <div className="px-5 pb-5">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-zinc-900 dark:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/60"
                  >
                    Close
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function remember(channel: string, setPref: (v: string) => void) {
  try {
    localStorage.setItem(PREF_KEY, channel);
    setPref(channel);
  } catch {}
}

function HoursBadge() {
  const [label, setLabel] = React.useState("Typically replies within 1–2h");
  React.useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    setLabel(h >= 9 && h < 19 ? "Online now" : "We’ll reply first thing");
  }, []);
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-[#00C6AE]/15 text-[#006d61] border border-[#00C6AE]/20">
      {label}
    </span>
  );
}

/** Minimal, fancy glass-outline button with icon + text */
function GlassAction({
  href,
  label,
  icon,
  external = false,
  accent = false,
  highlight = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  accent?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className="block group"
      onClick={onClick}
    >
      {/* Gradient frame */}
      <div
        className="relative rounded-xl"
        style={{
          padding: 1.25,
          background:
            "linear-gradient(135deg, rgba(0,198,174,0.6), rgba(255,255,255,0.45))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude" as any,
        }}
      >
        <div
          className={`
            rounded-xl
            bg-white/30 dark:bg-zinc-900/45
            backdrop-blur-2xl
            border border-white/25 dark:border-white/10
            h-12 px-4
            flex items-center justify-center gap-2.5
            text-[0.94rem]
            text-zinc-900 dark:text-zinc-100
            transition-all duration-200
            shadow-[0_6px_22px_rgba(0,0,0,0.14)]
            ${
              accent
                ? "group-hover:bg-[#00C6AE]/85 group-hover:text-white"
                : "hover:bg-white/45 dark:hover:bg-zinc-900/55"
            }
            ${highlight ? "ring-2 ring-[#00C6AE]/60" : "group-hover:translate-y-[-1px]"}
          `}
        >
          {icon}
          <span className="font-medium">{label}</span>
        </div>
      </div>
    </a>
  );
}
