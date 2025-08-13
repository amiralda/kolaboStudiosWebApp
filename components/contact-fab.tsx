// components/contact-fab.tsx
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
import { Phone, MessageCircle, MessageSquareText, X } from "lucide-react";

const PHONE = process.env.NEXT_PUBLIC_PHONE_E164 || "+18565955203";
const WA_DIGITS = (process.env.NEXT_PUBLIC_WHATSAPP_E164 || PHONE).replace(/\D/g, "");

const telHref = `tel:${PHONE}`;
const smsHref = `sms:${PHONE}`;
const waHref  = `https://wa.me/${WA_DIGITS}`;

export default function ContactFAB() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Fixed K launcher */}
      <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[9999]">
        <button
          aria-label="Open contact options"
          onClick={() => setOpen(true)}
          className="grid place-items-center w-14 h-14 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/70 dark:border-zinc-700 shadow-lg hover:shadow-xl transition"
          style={{ WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)" }}
        >
          <span className="text-lg font-semibold text-zinc-900 dark:text-white">K</span>
        </button>
      </div>

      {/* Centered dialog with simple, reliable layout */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] border bg-white dark:bg-zinc-900 rounded-2xl p-0">
          <DialogHeader className="px-5 pt-5 pb-2">
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="absolute right-4 top-4 grid place-items-center size-8 rounded-full hover:bg-zinc-100/70 dark:hover:bg-zinc-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>

            <DialogTitle className="text-center text-xl">
              Contact Kolabo Studios
            </DialogTitle>
            <DialogDescription className="text-center">
              Choose how you’d like to reach us.
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 pb-5 pt-1 grid gap-3">
            {/* Call */}
            <a href={telHref} aria-label="Call Kolabo Studios">
              <Button
                className="w-full h-12 text-base justify-center gap-2"
                variant="default"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </Button>
            </a>

            {/* Text */}
            <a href={smsHref} aria-label="Text Kolabo Studios">
              <Button
                className="w-full h-12 text-base justify-center gap-2"
                variant="secondary"
              >
                <MessageSquareText className="h-5 w-5" />
                Text Message
              </Button>
            </a>

            {/* WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Kolabo Studios"
            >
              <Button
                className="w-full h-12 text-base justify-center gap-2 bg-[#00C6AE] hover:bg-[#00b6a1] text-white"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Chat
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
