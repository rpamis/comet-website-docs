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

  useEffect(() => {
    const hero = document.querySelector(".comet-home__hero-entrance");
    const slot = hero?.querySelector(".comet-home__title-illustration");
    const picture = slot?.querySelector(".comet-home__title-animation");
    const animation = picture?.querySelector("img");
    const poster = slot?.querySelector(".comet-home__title-inline-img--poster");
    if (animation == null || poster == null) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let timer;
    let cancelled = false;
    let started = false;
    let loaded = animation.complete && animation.naturalWidth > 0;

    const complete = () => {
      window.clearTimeout(timer);
      observer.disconnect();
      slot.classList.remove("is-playing");
      slot.classList.add("is-complete");
      picture.hidden = true;
    };

    const showPoster = async () => {
      // The PNG is the GIF's exact final frame, using the same placement.
      // Decode first, then swap both layers in one paint without a fade dip.
      try { await poster.decode(); } catch { return; }
      if (cancelled || slot.classList.contains("is-complete")) return;
      complete();
    };

    const start = () => {
      if (started || cancelled || slot.classList.contains("is-complete") || !loaded || !hero.classList.contains("is-hero-visible")) return;
      started = true;
      observer.disconnect();
      window.clearTimeout(timer);
      // The GIF is the initial image, never inserted after a static poster.
      // It has one 2,860 ms pass and cannot loop if a timer is delayed.
      timer = window.setTimeout(showPoster, 2860);
    };

    const observer = new MutationObserver(start);
    if (motion.matches || slot.classList.contains("is-complete")) {
      complete();
      return;
    }
    observer.observe(hero, { attributes: true, attributeFilter: ["class"] });
    const handleLoad = () => { loaded = true; start(); };
    animation.addEventListener("load", handleLoad);
    animation.addEventListener("error", complete);
    const handleMotionChange = () => {
      if (motion.matches) complete();
    };
    motion.addEventListener("change", handleMotionChange);
    timer = window.setTimeout(complete, 8000);
    if (animation.complete && animation.naturalWidth === 0) complete();
    else start();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
      animation.removeEventListener("load", handleLoad);
      animation.removeEventListener("error", complete);
      motion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return null;
};
