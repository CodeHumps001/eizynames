import { nameData } from "../data/nameData";

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function genName(country, gender) {
  const d = nameData[country];
  const fn = pick(gender === "male" ? d.male : d.female);
  const ln = pick(d.last);
  return {
    firstName: fn,
    lastName: ln,
    full: `${fn} ${ln}`,
    country,
    id: Math.random().toString(36).slice(2),
  };
}
export function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  } catch (e) {
    fallbackCopy(text);
  }
}
export function fallbackCopy(text) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
  document.body.appendChild(el);
  el.focus();
  el.select();
  try {
    document.execCommand("copy");
  } catch (e) {}
  document.body.removeChild(el);
}
