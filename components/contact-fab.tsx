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
import { Phone, MessageCircle, MessageSquareText, X } from "lucide-react";

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
            backdrop-blur-md bg-white/70 dark:bg-zinc-900/60
            border border-white/50 dark:border-white/10
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            sm:max-w-[420px]
            border-0 bg-transparent p-0
            dialog-animate-in
          "
        >
          <div
            className="
              relative rounded-2xl overflow-hidden
              shadow-[0_25px_60px_rgba(0,0,0,0.3)]
            "
          >
            <div
              className="
                pointer-events-none absolute inset-0 rounded-2xl
              "
              style={{
                padding: 2,
                background:
                  "linear-gradient(135deg, rgba(0,198,174,0.5), rgba(255,255,255,0.4))",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude" as any,
              }}
            />
            <div className="relative rounded-2xl bg-white/60 dark:bg-zinc-900/70 backdrop-blur-lg p-5">
              <DialogHeader className="pb-2 flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-sora text-zinc-900 dark:text-white">
                    Contact Kolabo
                  </DialogTitle>
                  <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-300">
                    Choose how you'd like to reach us
                  </DialogDescription>
                </div>
                <DialogClose asChild>
                  <button className="grid place-items-center w-9 h-9 rounded-full bg-white/60 dark:bg-zinc-800/70 border border-white/40 dark:border-white/20 hover:bg-white/80 dark:hover:bg-zinc-800/90 transition-colors">
                    <X className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                  </button>
                </DialogClose>
              </DialogHeader>

              <div className="mt-3 space-y-3">
                {/* Call */}
                <a href={telHref} aria-label="Call Kolabo Studios">
                  <Button
                    className="
                      w-full h-12 flex items-center justify-center gap-2
                      bg-gradient-to-r from-[#00C6AE] via-teal-400 to-[#00C6AE]
                      text-white hover:brightness-95
                    "
                  >
                    <Phone className="h-5 w-5" />
                    <span>Call</span>
                  </Button>
                </a>

                {/* Text */}
                <a href={smsHref} aria-label="Text Kolabo Studios">
                  <Button className="w-full h-12 flex items-center justify-center gap-2 bg-zinc-800/80 text-white hover:brightness-90">
                    <MessageSquareText className="h-5 w-5" />
                    <span>Text</span>
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
                    className="
                      w-full h-12 flex items-center justify-center gap-2
                      bg-[linear-gradient(135deg,#00C6AE,rgba(0,198,174,0.85))]
                      text-white hover:brightness-95
                    "
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </Button>
                </a>
              </div>

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="ghost" className="w-full">
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
}
