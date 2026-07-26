export const RevealController = () => {
  useEffect(() => {
    const root = document.querySelector(".comet-home");
    if (root == null) return;

    const elements = Array.from(root.querySelectorAll('[data-reveal="true"]'));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches || window.IntersectionObserver == null) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
        element.setAttribute("data-reveal-state", "visible");
      });
      return;
    }

    const observers = elements.map((element) => {
      const delay = element.getAttribute("data-reveal-delay") || "0";
      const distance = element.getAttribute("data-reveal-distance") || "36";
      const threshold = Number(element.getAttribute("data-reveal-threshold") || "0.14");
      const rootMargin =
        element.getAttribute("data-reveal-root-margin") || "0px 0px -10% 0px";

      element.style.setProperty("--comet-reveal-delay", `${delay}ms`);
      element.style.setProperty("--comet-reveal-distance", `${distance}px`);
      element.setAttribute("data-reveal-state", "hidden");

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting === false) return;

          element.classList.add("is-visible");
          element.setAttribute("data-reveal-state", "visible");
          observer.disconnect();
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return null;
};
