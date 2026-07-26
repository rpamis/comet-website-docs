export const CapabilityDitherController = () => {
  useEffect(() => {
    const ditherMatrix = [
      0, 48, 12, 60, 3, 51, 15, 63,
      32, 16, 44, 28, 35, 19, 47, 31,
      8, 56, 4, 52, 11, 59, 7, 55,
      40, 24, 36, 20, 43, 27, 39, 23,
      2, 50, 14, 62, 1, 49, 13, 61,
      34, 18, 46, 30, 33, 17, 45, 29,
      10, 58, 6, 54, 9, 57, 5, 53,
      42, 26, 38, 22, 41, 25, 37, 21,
    ];
    const parseHexColor = (value) => {
      const normalized = value.replace("#", "");
      return [
        Number.parseInt(normalized.slice(0, 2), 16),
        Number.parseInt(normalized.slice(2, 4), 16),
        Number.parseInt(normalized.slice(4, 6), 16),
      ];
    };
    const shadeChannel = (channel, amount) => {
      if (amount < 0) return Math.round(channel * (1 + amount));
      return Math.round(channel + (255 - channel) * amount);
    };

    const root = document.querySelector(".comet-home");
    if (root == null) return;

    const definitions = [
      [".comet-home__capability-visual--skill", "#dd7959"],
      [".comet-home__capability-visual--eval", "#e9e1d4"],
      [".comet-home__capability-visual--any", "#70a0cf"],
    ];
    const createdCanvases = [];
    const canvases = definitions
      .map(([selector, color]) => {
        const container = root.querySelector(selector);
        if (container == null) return null;

        const existing = container.querySelector(
          ".comet-home__capability-dither"
        );
        if (existing != null) return existing;

        const canvas = document.createElement("canvas");
        canvas.className = "comet-home__capability-dither";
        canvas.dataset.ditherColor = color;
        canvas.setAttribute("aria-hidden", "true");
        container.prepend(canvas);
        createdCanvases.push(canvas);
        return canvas;
      })
      .filter(Boolean);

    if (canvases.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shadeLevels = [-0.1, -0.025, 0.045, 0.13];

    const surfaces = canvases.map((canvas, index) => {
      const context = canvas.getContext("2d", { alpha: false });
      const baseColor = parseHexColor(canvas.dataset.ditherColor || "#808080");
      let width = 0;
      let height = 0;
      let image = null;

      const resize = () => {
        const bounds = canvas.getBoundingClientRect();
        const nextWidth = Math.max(48, Math.ceil(bounds.width / 3));
        const nextHeight = Math.max(48, Math.ceil(bounds.height / 3));

        if (nextWidth === width && nextHeight === height) return;

        width = nextWidth;
        height = nextHeight;
        canvas.width = width;
        canvas.height = height;
        image = context.createImageData(width, height);
      };

      const draw = (time) => {
        resize();
        if (image == null) return;

        const pixels = image.data;
        const phase = index * 1.75;
        const elapsed = time * 0.00016;
        const aspect = width / height;

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const normalizedX = (x / width - 0.5) * aspect;
            const normalizedY = y / height - 0.5;
            const primary = Math.sin(
              normalizedX * 5.2 + normalizedY * 2.1 + elapsed + phase
            );
            const secondary = Math.sin(
              normalizedY * 7.1 - normalizedX * 1.7 - elapsed * 0.72 + phase
            );
            const detail = Math.cos(
              (normalizedX + normalizedY) * 9.4 + elapsed * 0.43 - phase
            );
            const field = 0.5 + primary * 0.13 + secondary * 0.1 + detail * 0.055;
            const threshold =
              (ditherMatrix[(y % 8) * 8 + (x % 8)] - 31.5) / 64;
            const level = Math.max(
              0,
              Math.min(3, Math.floor((field + threshold * 0.32) * 4))
            );
            const shade = shadeLevels[level];
            const offset = (y * width + x) * 4;

            pixels[offset] = shadeChannel(baseColor[0], shade);
            pixels[offset + 1] = shadeChannel(baseColor[1], shade);
            pixels[offset + 2] = shadeChannel(baseColor[2], shade);
            pixels[offset + 3] = 255;
          }
        }

        context.putImageData(image, 0, 0);
      };

      return { canvas, draw, resize };
    });

    let frame = null;
    let isVisible = true;
    let lastFrame = 0;

    const stop = () => {
      if (frame == null) return;
      window.cancelAnimationFrame(frame);
      frame = null;
    };

    const render = (time) => {
      frame = null;
      if (
        reducedMotion.matches ||
        isVisible === false ||
        document.visibilityState === "hidden"
      ) {
        return;
      }

      if (time - lastFrame >= 42) {
        surfaces.forEach((surface) => surface.draw(time));
        lastFrame = time;
      }

      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (
        frame != null ||
        reducedMotion.matches ||
        isVisible === false ||
        document.visibilityState === "hidden"
      ) {
        return;
      }
      frame = window.requestAnimationFrame(render);
    };

    const resizeObserver =
      window.ResizeObserver == null
        ? null
        : new ResizeObserver(() => {
            surfaces.forEach((surface) => surface.resize());
            surfaces.forEach((surface, index) =>
              surface.draw(reducedMotion.matches ? 0 : performance.now() + index)
            );
          });

    surfaces.forEach((surface) => {
      surface.resize();
      surface.draw(0);
      resizeObserver?.observe(surface.canvas);
    });

    const section = root.querySelector(".comet-home__capabilities");
    const visibilityObserver =
      section == null || window.IntersectionObserver == null
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
              if (isVisible) start();
              else stop();
            },
            { rootMargin: "160px 0px", threshold: 0 }
          );

    visibilityObserver?.observe(section);

    const handleMotionPreference = () => {
      stop();
      surfaces.forEach((surface) => surface.draw(0));
      start();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") stop();
      else start();
    };

    reducedMotion.addEventListener("change", handleMotionPreference);
    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionPreference);
      document.removeEventListener("visibilitychange", handleVisibility);
      createdCanvases.forEach((canvas) => canvas.remove());
    };
  }, []);

  return null;
};
