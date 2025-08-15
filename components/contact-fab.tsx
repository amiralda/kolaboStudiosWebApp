// components/contact-fab.tsx
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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
      {/* K launcher */}
      <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[9999]">
        <button
          aria-label="Open contact options"
          onClick={() => setOpen(true)}
          className="grid place-items-center w-14 h-14 rounded-full bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition"
          style={{ WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)" }}
        >
          <span className="text-lg font-semibold">K</span>
        </button>
      </div>

      {/* Dialog with 3 circular actions */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* hideCloseButton prevents shadcn’s default “X” so we only show our own */}
        <DialogContent
          hideCloseButton
          className="sm:max-w-[420px] rounded-2xl border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-center">Contact Kolabo Studios</DialogTitle>

            {/* Single custom close button */}
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="absolute right-4 top-4 grid place-items-center size-8 rounded-full hover:bg-zinc-100/70 dark:hover:bg-zinc-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
          </DialogHeader>

          {/* Three round buttons with labels */}
          <div className="py-2">
            <div className="flex items-center justify-center gap-7">
              {/* Call (blue) */}
              <ActionCircle
                href={telHref}
                label="Call"
                icon={<Phone className="h-6 w-6 text-white" />}
                bgClass="bg-blue-500"
              />

              {/* Text (dark) */}
              <ActionCircle
                href={smsHref}
                label="Text"
                icon={<MessageSquareText className="h-6 w-6 text-white" />}
                bgClass="bg-neutral-800"
              />

              {/* WhatsApp (Kolabo teal) */}
              <ActionCircle
                href={waHref}
                label="WhatsApp"
                icon={<MessageCircle className="h-6 w-6 text-white" />}
                bgClass="bg-[#00C6AE]"
                external
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Single ActionCircle definition */
function ActionCircle({
  href,
  label,
  icon,
  bgClass,
  external = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  bgClass: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex flex-col items-center gap-2"
      aria-label={label}
    >
      <span
        className={`grid place-items-center w-16 h-16 rounded-full ${bgClass} shadow-md hover:shadow-lg transition`}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {label}
      </span>
    </a>
  );
}
