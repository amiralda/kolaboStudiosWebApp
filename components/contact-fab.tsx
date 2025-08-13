"use client";

import * as React from "react";
import { Phone, MessageCircle, MessageSquareText } from "lucide-react";
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

const PHONE_E164 = process.env.NEXT_PUBLIC_PHONE_E164 || "+18565955203";
const WA_E164 = process.env.NEXT_PUBLIC_WHATSAPP_E164 || PHONE_E164;

const telHref = `tel:${PHONE_E164}`;
const smsHref = `sms:${PHONE_E164}`;
const waHref = `https://wa.me/${WA_E164.replace(/\D/g, "")}`;

export default function ContactFAB() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
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
          onClick={() => setOpen(true)}
          className={`
            group grid place-items-center
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
          {/* subtle teal halo pulse */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full ring-0 animate-fabHalo"
            style={{ boxShadow: "0 0 0 0 rgba(0,198,174,0.35)" }}
          />
          <span className="pointer-events-none absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-[#00C6AE]/25 transition-all" />
        </button>
      </div>

      {/* Dialog popup with options */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            sm:max-w-[420px]
            border border-white/40 dark:border-white/10
            bg-white/90 dark:bg-zinc-900/80
            backdrop-blur-md
          "
        >
          <DialogHeader>
            <DialogTitle className="font-sora text-xl">
              Contact Kolabo
            </DialogTitle>
            <DialogDescription className="text-sm">
              Pick how you want to reach us. We’ll get back to you fast.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 grid gap-3">
            {/* Call */}
            <a href={telHref} aria-label="Call Kolabo Studios">
              <Button
                variant="default"
                className="w-full h-12 gap-2 text-white bg-black hover:bg-black/90"
              >
                <Phone className="h-5 w-5" />
                <span>Call {PHONE_E164}</span>
              </Button>
            </a>

            {/* Text */}
            <a href={smsHref} aria-label="Text Kolabo Studios">
              <Button
                variant="secondary"
                className="w-full h-12 gap-2 bg-neutral-800 text-white hover:bg-neutral-700"
              >
                <MessageSquareText className="h-5 w-5" />
                <span>Text us</span>
              </Button>
            </a>

            {/* WhatsApp */}
            <a
              href={waHref}
              aria-label="WhatsApp Kolabo Studios"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="default"
                className="w-full h-12 gap-2 text-white"
                style={{ backgroundColor: "#00C6AE" }}
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </Button>
            </a>
          </div>

          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button variant="ghost" className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
