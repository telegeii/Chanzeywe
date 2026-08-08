import { useEffect } from "react";

const SITE_NAME = "Chanzeywe Vocational Training College";

function upsertMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  return tag;
}

/**
 * Per-page <title> + meta description (+ Open Graph) for this SPA, without
 * pulling in react-helmet. Call once per public page with a real,
 * keyword-relevant title/description; pass noIndex for admin routes.
 */
export default function useSeo({ title, description, noIndex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
    }
    upsertMeta("property", "og:title", fullTitle);
    // Left in place (not cleaned up on unmount) — the next page's call
    // overwrites these tags, so there's no flash of missing meta between
    // route changes in this SPA.
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
  }, [title, description, noIndex]);
}
