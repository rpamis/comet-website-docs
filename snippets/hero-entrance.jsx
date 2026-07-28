export const HeroEntranceController = () => {
  useEffect(() => {
    const element = document.querySelector(".comet-home__hero-entrance");
    const loader = document.querySelector(".comet-home__loader");

    // Always dismiss the page loader, even if the hero element is missing —
    // so a failed mount never leaves the loading overlay stuck on screen.
    const hideLoader = () => {
      if (loader == null) return;
      loader.classList.add("is-hidden");
    };

    // Safety net: never let the loader stay visible beyond 2.5s.
    const fallback = window.setTimeout(hideLoader, 2500);

    if (element == null) {
      hideLoader();
      return () => window.clearTimeout(fallback);
    }

    const showImmediately = () => {
      element.classList.add("is-hero-visible");
      element.style.opacity = "1";
      element.style.transform = "none";
      hideLoader();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      showImmediately();
      return () => window.clearTimeout(fallback);
    }

    if (element.getAttribute("data-hero-entrance-started") === "true") {
      hideLoader();
      return () => window.clearTimeout(fallback);
    }

    element.setAttribute("data-hero-entrance-started", "true");
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        element.classList.add("is-hero-visible");
        hideLoader();
      });
    });

    return () => window.clearTimeout(fallback);
  }, []);

  return null;
};
