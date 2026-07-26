export const DecryptedTextController = () => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("[data-decrypt-text]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups = [];

    elements.forEach((element) => {
      const text = element.getAttribute("data-decrypt-text") || "";
      const resolved = element.querySelector("[data-decrypt-resolved]");
      const encrypted = element.querySelector("[data-decrypt-encrypted]");

      if (
        text.length === 0 ||
        resolved == null ||
        encrypted == null ||
        reducedMotion.matches
      ) {
        return;
      }

      const characters = Array.from(text);
      const maxIterations = 10;
      let iteration = 0;
      let interval = null;

      const randomCharacter = () =>
        characters[Math.floor(Math.random() * characters.length)];

      const render = () => {
        iteration += 1;
        const revealedCount = Math.min(
          text.length,
          Math.floor((iteration / maxIterations) * (text.length + 1))
        );

        resolved.textContent = text.slice(0, revealedCount);
        encrypted.textContent = Array.from(text.slice(revealedCount))
          .map(() => randomCharacter())
          .join("");

        if (iteration < maxIterations) return;

        resolved.textContent = text;
        encrypted.textContent = "";
        element.setAttribute("data-decrypt-state", "complete");
        if (interval != null) window.clearInterval(interval);
      };

      const start = window.setTimeout(() => {
        resolved.textContent = "";
        encrypted.textContent = Array.from(text)
          .map(() => randomCharacter())
          .join("");
        element.setAttribute("data-decrypt-state", "playing");
        interval = window.setInterval(render, 52);
      }, 360);

      cleanups.push(() => {
        window.clearTimeout(start);
        if (interval != null) window.clearInterval(interval);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
};
