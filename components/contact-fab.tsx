"use client";
import { useEffect, useState } from "react";
import { Phone, MessageCircle, MessageSquareText } from "lucide-react";

const phone = process.env.NEXT_PUBLIC_PHONE_E164 || "+10000000000";
const wa = process.env.NEXT_PUBLIC_WHATSAPP_E164 || "+10000000000";

const telHref = `tel:${phone}`;
const smsHref = `sms:${phone}`;
const waHref  = `https://wa.me/${wa.replace(/\D/g, "")}`;

export default function ContactFAB() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed z-50 right-4 bottom-4 flex flex-col gap-2 md:right-6 md:bottom-6">
      {/* Desktop CTA row */}
      <div className="hidden md:flex gap-2">
        <a href={telHref} className="rounded-full px-4 py-2 bg-black text-white text-sm hover:opacity-90">Call</a>
        <a href={smsHref} className="rounded-full px-4 py-2 bg-neutral-800 text-white text-sm hover:opacity-90">Text</a>
        <a href={waHref}  className="rounded-full px-4 py-2 bg-emerald-600 text-white text-sm hover:opacity-90">WhatsApp</a>
      </div>

      {/* Mobile bubbles */}
      <div className="md:hidden grid grid-cols-3 gap-2">
        <a aria-label="Call" href={telHref} className="grid place-items-center h-12 w-12 rounded-full bg-black text-white shadow-lg active:scale-95">
          <Phone className="h-5 w-5" />
        </a>
        <a aria-label="Text" href={smsHref} className="grid place-items-center h-12 w-12 rounded-full bg-neutral-800 text-white shadow-lg active:scale-95">
          <MessageSquareText className="h-5 w-5" />
        </a>
        <a aria-label="WhatsApp" href={waHref} className="grid place-items-center h-12 w-12 rounded-full bg-emerald-600 text-white shadow-lg active:scale-95">
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
