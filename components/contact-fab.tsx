"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, MessageSquareText, X, Clipboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 || "+18565955203";
const WA_E164 = process.env.NEXT_PUBLIC_WHATSAPP_E164 || PHONE_E164;

const PREF_KEY = "kolabo-preferred-channel";

function vibrate(ms = 12) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch {}
}

function track(event: string, data?: Record<string, any>) {
  try { (window as any).plausible?.(event, { props: data }); } catch {}
}

export default function ContactFAB() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pref, setPref] = React.useState<string | null>(null);
  const page = typeof window !== "undefined" ? window.location.pathname : "/";
  const hasPhone = !!(PHONE_E164 && PHONE_E164.trim());

  // prefilled deep links
  const prefill = encodeURIComponent(`Hi Kolabo Studios — I'm on ${page} and want to book a session.`);
  const telHref = `tel:${PHONE_E164}`;
  const smsHref = `sms:${PHONE_E164}?&body=${prefill}`;
  const waHref  = `https://wa.me/${WA_E164.replace(/\D/g, "")}?text=${prefill}`;

  React.useEffect(() => {
    setMounted(true);
    try { setPref(localStorage.getItem(PREF_KEY)); } catch {}
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") { setOpen(true); vibrate(10); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating K button */}
      <div
        className="fixed bottom-4 md:bottom-6 z-[9999]"
        style={{ right: "max(env(safe-area-inset-right), 4.25rem)" }}
      >
        <button
          aria-label={open ? "Close contact options" : "Open contact options"}
          onClick={() => { setOpen(true); vibrate(12); track("contact_open", { from: page }); }}
          className={`
            group grid place-items-center
            w-16 h-16 rounded-full
            backdrop-blur-md bg-white/65 dark:bg-zinc-900/55
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
          <span
            className="pointer-events-none absolute inset-0 rounded-full animate-fabHalo"
            style={{ boxShadow: "0 0 0 0 rgba(0,198,174,0.35)" }}
          />
          <span className="pointer-events-none absolute inset-0 rounded-full group-hover:ring-4 ring-[#00C6AE]/30 transition-all" />
        </button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] border-0 bg-transparent p-0 dialog-animate-in">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
            {/* Gradient border */}
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
            {/* Glass panel */}
            <div className="relative rounded-2xl bg-white/40 dark:bg-zinc-900/50 backdrop-blur-2xl">
              <DialogHeader className="p-5 pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <DialogTitle className="text-[1.15rem] font-sora text-zinc-900 dark:text-white">
                      Contact Kolabo Studios
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      <DialogDescription className="text-sm text-zinc-700/80 dark:text-zinc-300/90">
                        Choose how you’d like to reach us.
                      </DialogDescription>
                      <HoursBadge />
                    </div>
                  </div>
                  <DialogClose asChild>
                    <button
                      aria-label="Close"
                      className="grid place-items-center size-9 rounded-full bg-white/55 dark:bg-zinc-800/60 border border-white/40 dark:border-white/10 hover:bg-white/75 dark:hover:bg-zinc-800/80 transition-colors"
                    >
                      <X className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                    </button>
                  </DialogClose>
                </div>
              </DialogHeader>

              {/* Actions */}
              <div className="px-5 pt-3 pb-4 grid gap-3">
                <GlassOutlineLink
                  href={hasPhone ? telHref : undefined}
                  label="Call"
                  highlight={pref === "call"}
                  onClick={() => { remember("call"); vibrate(10); track("contact_call", { from: page }); }}
                  disabled={!hasPhone}
                >
                  <Phone className="h-5 w-5 opacity-90" />
                </GlassOutlineLink>

                <GlassOutlineLink
                  href={hasPhone ? smsHref : undefined}
                  label="Text"
                  highlight={pref === "text"}
                  onClick={() => { remember("text"); vibrate(10); track("contact_text", { from: page }); }}
                  disabled={!hasPhone}
                >
                  <MessageSquareText className="h-5 w-5 opacity-90" />
                </GlassOutlineLink>

                <GlassOutlineLink
                  href={waHref}
                  label="WhatsApp"
                  external
                  accent
                  highlight={pref === "whatsapp"}
                  onClick={() => { remember("whatsapp"); vibrate(10); track("contact_whatsapp", { from: page }); }}
                >
                  <MessageCircle className="h-5 w-5 opacity-90" />
                </GlassOutlineLink>

                <CopyNumberRow />
              </div>

              <DialogFooter className="px-5 pb-5">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-zinc-900 dark:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/60"
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  function remember(channel: string) {
    try { localStorage.setItem(PREF_KEY, channel); setPref(channel); } catch {}
  }
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

function CopyNumberRow() {
  const { toast } = useToast();
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(PHONE_E164);
        toast({ title: "Number copied", description: PHONE_E164 });
      }}
      className="h-10 rounded-lg bg-white/45 dark:bg-zinc-800/50 backdrop-blur border border-white/30 dark:border-white/10 text-sm hover:bg-white/65 dark:hover:bg-zinc-800/70 transition-colors"
    >
      <Clipboard className="inline h-4 w-4 mr-2" />
      Copy phone number
    </button>
  );
}

function GlassOutlineLink({
  href,
  label,
  children,
  external = false,
  accent = false,
  highlight = false,
  onClick,
  disabled = false,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
  accent?: boolean;
  highlight?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const common = `
    rounded-xl
    bg-white/35 dark:bg-zinc-900/45
    backdrop-blur-xl
    border border-white/30 dark:border-white/10
    h-12 px-4
    flex items-center justify-center gap-2.5
    text-[0.94rem]
    text-zinc-900 dark:text-zinc-100
    transition-all duration-200
    shadow-[0_6px_22px_rgba(0,0,0,0.14)]
    ${accent ? "hover:bg-[#00C6AE]/85 hover:text-white" : "hover:bg-white/50 dark:hover:bg-zinc-900/60"}
    ${highlight ? "ring-2 ring-[#00C6AE]/60" : ""}
    ${disabled ? "opacity-50 pointer-events-none" : "group-hover:translate-y-[-1px]"}
  `;

  const inner = (
    <div className={common} onClick={onClick}>
      {children}
      <span className="font-medium">{label}</span>
    </div>
  );

  if (!href) return <div className="relative rounded-xl" style={frameStyle}>{inner}</div>;

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className="block group"
    >
      <div className="relative rounded-xl" style={frameStyle}>
        {inner}
      </div>
    </a>
  );
}

const frameStyle: React.CSSProperties = {
  padding: 1.25,
  background:
    "linear-gradient(135deg, rgba(0,198,174,0.6), rgba(255,255,255,0.45))",
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude" as any,
};
