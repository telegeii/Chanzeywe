import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router preserves scroll position across client-side navigation by
// default, so clicking a link can land the visitor mid-page instead of at
// the top. This resets scroll on every route change.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
