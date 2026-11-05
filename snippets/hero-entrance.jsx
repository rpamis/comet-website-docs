export const HeroEntranceController = () => {
  useEffect(() => {
    const element = document.querySelector(".comet-home__hero-entrance");
    const loader = document.querySelector(".comet-home__loader");
    const hideLoader = () => loader?.classList.add("is-hidden");
    if (element == null) { hideLoader(); return; }

    let cancelled = false;
    let revealed = false;
    let firstFrame;
    let secondFrame;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animate = !motion.matches && !element.hasAttribute("data-hero-entrance-started");
    element.setAttribute("data-hero-entrance-started", "true");
    const reveal = (withMotion) => {
      if (cancelled || revealed) return;
      revealed = true;
      window.clearTimeout(fallback);
      if (!withMotion) {
        element.classList.add("is-hero-visible");
        element.style.opacity = "1";
        element.style.transform = "none";
        hideLoader();
        return;
      }
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if (cancelled) return;
          element.classList.add("is-hero-visible");
          hideLoader();
        });
      });
    };
    // Keep a missing image from trapping the whole page behind its loader.
    const fallback = window.setTimeout(() => reveal(false), 2500);
    const image = element.querySelector(".comet-home__title-inline-img--animated");
    // Text and the first pose enter together, including on a cold connection.
    if (image?.decode) image.decode().then(() => reveal(animate), () => reveal(animate));
    else reveal(animate);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
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
    const duration = Number(animation.dataset.animationDuration) || 3600;
    let playbackUrl;
    let frame;
    let finishTimer;
    let safetyTimer;
    let cancelled = false;
    let finished = false;
    let sourceAssigned = false;

    const complete = () => {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(frame);
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
      Number.parseFloat(window.getComputedStyle(hero).opacity) >= 1;

    const waitForEntrance = () => {
      if (cancelled || finished || sourceAssigned) return;
      if (!entranceReady()) {
        frame = window.requestAnimationFrame(waitForEntrance);
        return;
      }
      sourceAssigned = true;
      // Use a fresh timeline as soon as the short entrance finishes.
      animation.removeAttribute("srcset");
      animation.removeAttribute("sizes");
      animation.src = playbackUrl;
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
