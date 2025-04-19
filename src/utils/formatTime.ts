import { useEffect, useState } from 'react';

export function useTimeSince(date: Date): string {
  const [timeSince, setTimeSince] = useState(() => formatTimeSince(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(formatTimeSince(date));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [date]);

  return timeSince;
}

export function formatTimeSince(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 5) return 'akkurat nå';
  if (seconds < 60) return `${seconds} sekunder siden`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 2) return 'ett minutt siden';
  if (minutes < 60) return `${minutes} minutter siden`;

  const hours = Math.floor(minutes / 60);
  if (hours < 2) return 'en time siden';
  if (hours < 24) return `${hours} timer siden`;

  const days = Math.floor(hours / 24);
  if (days < 2) return 'i går';
  if (days < 30) return `${days} dager siden`;

  const months = Math.floor(days / 30);
  if (months < 2) return 'forrige måned';
  if (months < 12) return `${months} måneder siden`;

  const years = Math.floor(months / 12);
  if (years < 2) return 'i fjor';
  return `${years} år siden`;
}
