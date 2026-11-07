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
import { Phone, MessageCircle, MessageSquareText, X, Globe } from "lucide-react";

// Business number (E.164). Env vars override when set; the published business
// number is the fallback so the buttons never render with an empty number.
const FALLBACK_PHONE_E164 = "+18565955203";
const PHONE = process.env.NEXT_PUBLIC_PHONE_E164 || FALLBACK_PHONE_E164;
const WA_DIGITS = (process.env.NEXT_PUBLIC_WHATSAPP_E164 ?? PHONE).replace(/\D/g, "");

type Lang = "en" | "fr" | "es" | "ht";

const LABELS: Record<Lang, { title: string; intro: string; call: string; text: string; wa: string }> = {
  en: {
    title: "Contact Kolabo Studios",
    intro:
      "Hi Kolabo Studios 👋\nI want to book a session. Please fill this in before sending:\n• Service: Wedding / Engagement / Maternity / Portrait / Family\n• Date:\n• Location:\n• Budget:\n— Sent from kolabostudios.com",
    call: "Call",
    text: "Text",
    wa: "WhatsApp",
  },
  fr: {
    title: "Contacter Kolabo Studios",
    intro:
      "Bonjour Kolabo Studios 👋\nJe souhaite réserver une séance. Veuillez remplir ceci avant d’envoyer :\n• Service : Mariage / Fiançailles / Maternité / Portrait / Famille\n• Date :\n• Lieu :\n• Budget :\n— Envoyé depuis kolabostudios.com",
    call: "Appeler",
    text: "SMS",
    wa: "WhatsApp",
  },
  es: {
    title: "Contactar a Kolabo Studios",
    intro:
      "Hola Kolabo Studios 👋\nQuisiera reservar una sesión. Por favor complete esto antes de enviar:\n• Servicio: Boda / Compromiso / Maternidad / Retrato / Familia\n• Fecha:\n• Ubicación:\n• Presupuesto:\n— Enviado desde kolabostudios.com",
    call: "Llamar",
    text: "Texto",
    wa: "WhatsApp",
  },
  ht: {
    title: "Kontakte Kolabo Studios",
    intro:
      "Bonjou Kolabo Studios 👋\nMwen ta renmen pran randevou. Tanpri ranpli sa a anvan ou voye l:\n• Sèvis: Maryaj / Fiyanse / Matènite / Pòtre / Fanmi\n• Dat:\n• Kote:\n• Bidjè:\n— Voye depi kolabostudios.com",
    call: "Rele",
    text: "Tèks",
    wa: "WhatsApp",
  },
};

export default function ContactFAB() {
  const [open, setOpen] = React.useState(false);
  const [lang, setLang] = React.useState<Lang>("en");

  // Prefill encoders
  const encoded = encodeURIComponent(LABELS[lang].intro);
  const telHref = `tel:${PHONE}`;
  const smsHref = `sms:${PHONE}?&body=${encoded}`;
  const waHref = `https://wa.me/${WA_DIGITS}?text=${encoded}`;

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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent hideCloseButton className="sm:max-w-[420px] rounded-2xl border bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-center pt-10">{LABELS[lang].title}</DialogTitle>

            {/* one and only Close button */}
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="absolute right-4 top-4 grid place-items-center size-8 rounded-full hover:bg-zinc-100/70 dark:hover:bg-zinc-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>

            {/* Language toggle */}
            <div className="absolute left-4 top-4">
              <label className="inline-flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Globe className="h-4 w-4" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Lang)}
                  className="rounded-md bg-white/80 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="ht">Kreyòl</option>
                </select>
              </label>
            </div>
          </DialogHeader>

          {/* Three round buttons with labels */}
          <div className="py-2">
            <div className="flex items-center justify-center gap-7">
              <ActionCircle
                href={telHref}
                label={LABELS[lang].call}
                icon={<Phone className="h-6 w-6 text-white" />}
                bgClass="bg-blue-500"
              />
              <ActionCircle
                href={smsHref}
                label={LABELS[lang].text}
                icon={<MessageSquareText className="h-6 w-6 text-white" />}
                bgClass="bg-neutral-800"
              />
              <ActionCircle
                href={waHref}
                label={LABELS[lang].wa}
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
      <span className={`grid place-items-center w-16 h-16 rounded-full ${bgClass} shadow-md hover:shadow-lg transition`}>
        {icon}
      </span>
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</span>
    </a>
  );
}
