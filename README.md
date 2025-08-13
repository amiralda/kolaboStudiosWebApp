\# Kolabo Studios — Photography Website



A modern, responsive photography website for \*\*Kolabo Studios\*\*, built with \*\*Next.js 14 (App Router)\*\*, \*\*TypeScript\*\*, \*\*Tailwind CSS\*\*, and \*\*shadcn/ui\*\*.  

Live: https://kolabostudios.com



---



\## 🌟 Overview



The site showcases wedding, engagement, maternity and mini sessions with a clean, image-first design. It includes SEO-friendly metadata, galleries, an updated FAQ, and a branded floating \*\*“K” quick-contact\*\* dialog that lets visitors call, text, or WhatsApp with one tap.



\### Goals

\- Convert visitors into inquiries/bookings

\- Present curated galleries with simple categories

\- Answer common questions clearly (FAQ)

\- Make contacting Kolabo Studios effortless



---



\## 🚀 Key Features



\### 1) Contact “K” Dialog (new)

\- Floating \*\*K\*\* button (bottom-right, safely inset from edges)

\- Glassmorphism dialog with:

&nbsp; - \*\*Call Now\*\*, \*\*Text Message\*\*, \*\*WhatsApp Chat\*\*

&nbsp; - Subtle gradients and teal brand accents

&nbsp; - Centered title + status badge (\*Online now\* during business hours)

&nbsp; - Copy phone number shortcut

\- Context-aware pre-filled text/WhatsApp message (includes the page link)

\- Keyboard shortcut: press \*\*C\*\* to open

\- Mounted \*\*once globally\*\* in `app/layout.tsx`



\### 2) Pages

\- \*\*Home\*\*: Hero, CTAs, content sections

\- \*\*Galleries\*\*: Simple category navigation (Weddings, Engagement, Maternity, Minis, Holiday Minis)

\- \*\*About\*\*

\- \*\*Blog\*\* (structure in place)

\- \*\*FAQ\*\*: rewritten to emphasize budget-friendly packages, quick turnaround (24–48h when requirements are met), and image counts that depend on the chosen package

\- \*\*Contact/Booking\*\*



\### 3) Design System

\- \*\*Typography\*\*: Sora (headings), Inter (body)

\- \*\*Colors\*\*:  

&nbsp; - Primary text: near-black  

&nbsp; - Background: white  

&nbsp; - \*\*Accent (brand teal)\*\*: `#00C6AE`

\- Tailwind utility styles + custom keyframes for motion



\### 4) SEO \& Social

\- Centralized \*\*metadata\*\* and \*\*Open Graph\*\* config in `app/layout.tsx`

\- Social sharing image in `/public/wedding-dance-sunset.png`



---



\## 🛠 Tech Stack



\- \*\*Next.js 14 (App Router)\*\*

\- \*\*TypeScript\*\*

\- \*\*Tailwind CSS\*\*

\- \*\*shadcn/ui\*\*

\- \*\*Lucide icons\*\*

\- Optional/Scaffolded APIs under `app/api/\*`



---



\## 📁 Project Structure (relevant parts)



app/

layout.tsx # Root layout (mounts Navigation, Footer, ContactFAB)

globals.css # Global styles (Tailwind + animations)

page.tsx # Home

about/page.tsx

blog/page.tsx

faq/page.tsx

galleries/page.tsx

components/

navigation.tsx

footer.tsx

contact-fab.tsx # “K” dialog implementation

ui/ # shadcn/ui primitives

public/

wedding-dance-sunset.png # OG image (and general imagery)



> Note: Only one `<ContactFAB />` is rendered; duplicates were removed (important for avoiding double dialogs).



---



\## 🔐 Environment Variables



Set these in Vercel → \*Project\* → \*Settings\* → \*Environment Variables\*:



| Key                       | Example Value            | Notes                         |

|---------------------------|--------------------------|-------------------------------|

| `NEXT\_PUBLIC\_SITE\_URL`    | `https://kolabostudios.com` | Used for absolute metadata URLs |

| `NEXT\_PUBLIC\_PHONE\_E164`  | `+18565955203`           | Main phone (E.164 format)     |

| `NEXT\_PUBLIC\_WHATSAPP\_E164` | `+18565955203`         | WhatsApp phone (optional; defaults to the main phone) |



> These are \*\*public\*\* by design (prefixed with `NEXT\_PUBLIC\_`).



---



\## 🧩 Content Notes



\- \*\*FAQ\*\* content lives in `app/faq/page.tsx`.

\- \*\*Global styles \& animations\*\* (including the K dialog glass/animations) live in `app/globals.css`.

\- Phone numbers for the Contact dialog are read from env vars.



---



\## ⚙️ Development



\### Prerequisites

\- Node.js 18+

\- npm \*\*or\*\* pnpm (project deploys with pnpm on Vercel, but npm works locally)



\### Install \& Run

```bash

\# install

npm install

\# dev

npm run dev

\# open http://localhost:3000





