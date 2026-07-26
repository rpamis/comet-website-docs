export const CopyController = () => {
  useEffect(() => {
    const buttons = Array.from(
      document.querySelectorAll("[data-copy-value]")
    );
    const timers = new Map();

    const copy = async (event) => {
      const button = event.currentTarget;
      const value = button.getAttribute("data-copy-value");
      const label = button.getAttribute("data-copy-label") || "复制";

      if (value == null || navigator.clipboard == null) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        return;
      }

      const existingTimer = timers.get(button);
      if (existingTimer != null) window.clearTimeout(existingTimer);

      button.classList.add("is-copied");
      button.setAttribute("aria-label", "已复制");
      button.setAttribute("title", "已复制");

      const timer = window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", label);
        button.setAttribute("title", label);
        timers.delete(button);
      }, 1800);

      timers.set(button, timer);
    };

    buttons.forEach((button) => button.addEventListener("click", copy));

    return () => {
      buttons.forEach((button) => button.removeEventListener("click", copy));
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
};
