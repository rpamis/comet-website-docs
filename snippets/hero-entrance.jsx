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
    const loader = document.querySelector(".comet-home__loader");
    const aborter = new window.AbortController();
    const duration = Number(animation.dataset.animationDuration) || 5000;
    let playbackUrl;
    let frame;
    let delayTimer;
    let finishTimer;
    let safetyTimer;
    let cancelled = false;
    let finished = false;
    let sourceAssigned = false;

    const complete = () => {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(safetyTimer);
      aborter.abort();
      slot.classList.remove("is-playing");
      slot.classList.add("is-complete");
      picture.hidden = true;
      if (playbackUrl) window.URL.revokeObjectURL(playbackUrl);
    };

    const showPoster = async () => {
      // The PNG is the GIF's exact final frame, using the same placement.
      // Decode first, then swap both layers in one paint without a fade dip.
      try { await poster.decode(); } catch { return; }
      if (cancelled || finished) return;
      complete();
    };

    const entranceReady = () =>
      !document.hidden &&
      hero.classList.contains("is-hero-visible") &&
      (loader == null || loader.classList.contains("is-hidden")) &&
      Number.parseFloat(window.getComputedStyle(hero).opacity) >= 0.999;

    const waitForEntrance = () => {
      if (cancelled || finished || sourceAssigned) return;
      if (!entranceReady()) {
        frame = window.requestAnimationFrame(waitForEntrance);
        return;
      }
      // Give the fully visible title a short beat before the character moves.
      delayTimer = window.setTimeout(() => {
        if (cancelled || finished) return;
        if (!entranceReady()) { waitForEntrance(); return; }
        sourceAssigned = true;
        // Mintlify adds responsive PNG candidates in production. Remove those
        // before using a fresh image URL, so cached GIFs also start at frame 1.
        animation.removeAttribute("srcset");
        animation.removeAttribute("sizes");
        animation.src = playbackUrl;
      }, 250);
    };

    if (motion.matches || slot.classList.contains("is-complete")) {
      complete();
      return;
    }
    const handleLoad = () => {
      if (!sourceAssigned || finished || animation.currentSrc !== playbackUrl) return;
      window.clearTimeout(safetyTimer);
      slot.dataset.playbackStarted = String(window.performance.now());
      finishTimer = window.setTimeout(showPoster, duration);
    };
    const handleError = () => { if (sourceAssigned) complete(); };
    animation.addEventListener("load", handleLoad);
    animation.addEventListener("error", handleError);
    const handleMotionChange = () => {
      if (motion.matches) complete();
    };
    motion.addEventListener("change", handleMotionChange);
    safetyTimer = window.setTimeout(complete, 15000);
    // Fetching bytes does not advance GIF frames. The first-frame PNG stays in
    // place until the hero fade finishes, then the fresh blob starts one pass.
    const sourceUrl = new window.URL(animation.dataset.animationSrc, window.location.href);
    sourceUrl.searchParams.set("playback", String(duration));
    window.fetch(sourceUrl.href, { signal: aborter.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Hero animation unavailable");
        return response.blob();
      })
      .then((blob) => {
        if (cancelled || finished) return;
        playbackUrl = window.URL.createObjectURL(blob);
        waitForEntrance();
      })
      .catch(() => { if (!cancelled && !finished) complete(); });

    return () => {
      cancelled = true;
      aborter.abort();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(safetyTimer);
      if (playbackUrl) window.URL.revokeObjectURL(playbackUrl);
      animation.removeEventListener("load", handleLoad);
      animation.removeEventListener("error", handleError);
      motion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return null;
};
