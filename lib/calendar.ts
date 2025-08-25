// lib/calendar.ts
import { google } from "googleapis";

type CreateParams = {
  serviceKey: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:mm (24h)
  hours: number;  // service duration
  bufferMinutes: number; // extra buffer after event
  minGapHours: number;   // required gap between this and other events
  location?: string;
  clientEmail?: string;
};

function getAuth() {
  const jwt = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return jwt;
}

function toIso(date: string, time: string) {
  // naive local to ISO — you can refine to use timezone if needed
  return new Date(`${date}T${time}:00`);
}

export async function createCalendarEventIfAvailable(p: CreateParams) {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const calId = process.env.GOOGLE_CALENDAR_ID!;
  const start = toIso(p.date, p.time);
  const end = new Date(start.getTime() + p.hours * 60 * 60 * 1000 + p.bufferMinutes * 60 * 1000);

  // enforce ~4h window on the day → check events +/- 12h window around start
  const windowStart = new Date(start.getTime() - p.minGapHours * 60 * 60 * 1000);
  const windowEnd = new Date(start.getTime() + p.minGapHours * 60 * 60 * 1000);

  // Find events that might collide or be too close
  const list = await calendar.events.list({
    calendarId: calId,
    timeMin: windowStart.toISOString(),
    timeMax: windowEnd.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const conflicts = (list.data.items || []).some((ev) => {
    const evStart = ev.start?.dateTime ? new Date(ev.start.dateTime) : ev.start?.date ? new Date(ev.start.date) : null;
    const evEnd = ev.end?.dateTime ? new Date(ev.end.dateTime) : ev.end?.date ? new Date(ev.end.date) : null;
    if (!evStart || !evEnd) return false;

    // require at least minGapHours before and after
    const minEnd = new Date(evEnd.getTime() + p.minGapHours * 60 * 60 * 1000);
    const maxStart = new Date(evStart.getTime() - p.minGapHours * 60 * 60 * 1000);

    return (start < minEnd && end > maxStart);
  });

  if (conflicts) {
    // if conflict found, do nothing (you could also email yourself)
    return { created: false, reason: "conflict" };
  }

  // Create event
  await calendar.events.insert({
    calendarId: calId,
    requestBody: {
      summary: `Kolabo Booking — ${p.serviceKey}`,
      location: p.location,
      description: `Confirmed with 60% deposit.\nService: ${p.serviceKey}\nClient email: ${p.clientEmail || "N/A"}`,
      start: { dateTime: start.toISOString() },
      end:   { dateTime: end.toISOString() },
      attendees: p.clientEmail ? [{ email: p.clientEmail }] : undefined,
    },
  });

  return { created: true };
}
