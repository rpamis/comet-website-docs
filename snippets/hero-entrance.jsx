export const HeroEntranceController = () => {
  useEffect(() => {
    const element = document.querySelector(".comet-home__hero-entrance");
    if (element == null) return;

    const showImmediately = () => {
      element.classList.add("is-hero-visible");
      element.style.opacity = "1";
      element.style.transform = "none";
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      showImmediately();
      return;
    }

    if (element.getAttribute("data-hero-entrance-started") === "true") return;

    element.setAttribute("data-hero-entrance-started", "true");
    element.style.removeProperty("opacity");
    element.style.removeProperty("transform");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        element.classList.add("is-hero-visible");
      });
    });
  }, []);

  return null;
};
