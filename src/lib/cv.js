import cv from '@/../data/cv.json';
import hud from '@/../data/profile/hud.json';
import siteMetadata from '@/../data/siteMetadata';

export const getCv = () => cv;
export const getHud = () => hud;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// "2019-07" -> "Jul 2019", "2013" -> "2013", null/undefined -> "Present".
// Anything else (e.g. a "TODO:YYYY-MM" placeholder) is returned verbatim so it stays visible.
export function formatDate(value, { present = 'Present' } = {}) {
  if (value === null || value === undefined || value === '') return present;
  const m = /^(\d{4})(?:-(\d{2}))?/.exec(value);
  if (!m) return value;
  return m[2] ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : m[1];
}

export const formatRange = (start, end) =>
  `${formatDate(start)} – ${formatDate(end)}`;

export const isCurrent = (item) => item.endDate === null || item.endDate === undefined;
export const isInternship = (work) => work.type === 'internship';
export const isTodo = (value) => typeof value === 'string' && value.startsWith('TODO');

// Static export lives under basePath; public assets need the prefix in plain <a href>.
export const withBasePath = (path) =>
  `${siteMetadata.basePath}${path.startsWith('/') ? path : `/${path}`}`;

// Most recent certificate with a real date (skips TODO placeholders).
export const latestCertificate = (certificates) =>
  certificates.find((c) => /^\d{4}/.test(c.date || ''));
