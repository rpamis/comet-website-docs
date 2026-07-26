export const SetupDemoController = () => {
  useEffect(() => {
    const demos = Array.from(document.querySelectorAll("[data-setup-demo]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const versionTargets = Array.from(
      document.querySelectorAll("[data-docs-version]")
    );
    const versionPattern = /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
    let versionObserver = null;

    const syncDocsVersion = () => {
      const version = Array.from(
        document.querySelectorAll('button[aria-haspopup="menu"] > span')
      )
        .map((element) => element.textContent?.trim() || "")
        .find((value) => versionPattern.test(value));

      if (version == null) return false;

      const displayVersion = version.startsWith("v") ? version : `v${version}`;
      versionTargets.forEach((target) => {
        target.textContent = displayVersion;
      });
      return true;
    };

    if (
      versionTargets.length > 0 &&
      syncDocsVersion() === false &&
      window.MutationObserver != null
    ) {
      versionObserver = new MutationObserver(() => {
        if (syncDocsVersion()) versionObserver?.disconnect();
      });
      versionObserver.observe(document.body, { childList: true, subtree: true });
    }

    const cleanups = demos.map((demo) => {
      const viewport = demo.querySelector("[data-setup-viewport]");
      const status = demo.querySelector("[data-setup-status]");
      const lines = Array.from(demo.querySelectorAll("[data-setup-line]"));
      const stages = Array.from(demo.querySelectorAll("[data-setup-stage-card]"));
      const timers = new Set();
      let observer = null;

      const clearTimers = () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        timers.clear();
      };

      const setStage = (stageName) => {
        if (status != null) {
          status.textContent =
            stageName === "ready"
              ? "/comet ready"
              : stageName === "init"
                ? "comet init"
                : "npm install";
        }

        stages.forEach((stage) => {
          const isActive =
            stage.getAttribute("data-setup-stage-card") === stageName;
          stage.classList.toggle("is-active", isActive);
          stage.setAttribute("aria-current", isActive ? "step" : "false");
        });
      };

      const scrollToLatest = () => {
        if (viewport == null) return;

        window.requestAnimationFrame(() => {
          viewport.scrollTop = viewport.scrollHeight;
        });
      };

      const showAll = () => {
        lines.forEach((line) => line.classList.add("is-visible"));
        setStage("ready");
        scrollToLatest();
      };

      const reset = () => {
        clearTimers();
        lines.forEach((line) => line.classList.remove("is-visible"));
        if (viewport != null) viewport.scrollTop = 0;
        setStage("install");
      };

      const run = () => {
        reset();
        let elapsed = 280;

        lines.forEach((line) => {
          const pause = Number(line.getAttribute("data-setup-pause") || "520");
          elapsed += pause;

          const timer = window.setTimeout(() => {
            const stageName = line.getAttribute("data-setup-stage");
            line.classList.add("is-visible");
            if (stageName != null) setStage(stageName);
            scrollToLatest();
            timers.delete(timer);
          }, elapsed);

          timers.add(timer);
        });

      };

      demo.setAttribute("data-setup-enhanced", "true");

      if (
        reducedMotion.matches ||
        window.IntersectionObserver == null ||
        lines.length === 0
      ) {
        showAll();
        return () => clearTimers();
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting === false) return;

          run();
          observer.disconnect();
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
      );

      observer.observe(demo);

      return () => {
        clearTimers();
        if (observer != null) observer.disconnect();
      };
    });

    return () => {
      versionObserver?.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
};
