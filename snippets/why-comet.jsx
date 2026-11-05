export const WhyComet = ({ language = "zh" }) => {
  const root = useRef(null);
  const title = language === "en" ? "Give ideas a little time" : "给想法一点时间";
  const message = language === "en"
    ? "Make a little time for the ideas that excite you. A small project you keep putting off, or a sudden spark of curiosity, is worth a try. You do not need to plan everything at once. Let's take the next small step together."
    : "留一点时间，给那些让你心动的想法。一个迟迟没开始的小项目，一次突如其来的好奇，都值得认真试试。不用一次想得很远，我们一起，从眼前的一小步开始。";
  const segments = language === "en" ? message.match(/\S+\s*/g) : Array.from(message);
  const [revealed, setRevealed] = useState(segments.length);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let elapsed = 0;
    let previous = 0;
    let visible = false;
    let current = segments.length;
    const paint = () => {
      const progress = motion.matches ? 1 : Math.min(1, (elapsed % 14000) / 11000);
      const next = Math.min(segments.length, Math.floor(progress * segments.length) + 1);
      section.style.setProperty("--why-progress", String(progress));
      if (next !== current) {
        current = next;
        setRevealed(next);
      }
    };
    const update = (now) => {
      if (previous) elapsed += now - previous;
      previous = now;
      paint();
      frame = window.requestAnimationFrame(update);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      previous = 0;
      section.setAttribute("data-why-enhanced", motion.matches ? "false" : "true");
      section.setAttribute("data-why-playing", String(visible && !document.hidden && !motion.matches));
      paint();
      if (visible && !document.hidden && !motion.matches) frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.15 });
    observer.observe(section);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [message]);

  return (
    <section ref={root} className="comet-home__why" aria-labelledby="comet-why-title">
      <div className="comet-home__why-trail" aria-hidden="true" />
      <div className="comet-home__why-loop" aria-hidden="true">
        <span className="comet-home__why-bird"><span className="comet-home__why-bird-shape" /></span>
        <span className="comet-home__why-bird comet-home__why-bird--second"><span className="comet-home__why-bird-shape" /></span>
        <span className="comet-home__why-together" />
      </div>
      <div className="comet-home__why-inner">
        <h2 id="comet-why-title" className="comet-home__why-accessible">{title}</h2>
        <p className="comet-home__why-story">
          <span className="comet-home__why-accessible">{message}</span>
          <span aria-hidden="true">
            <span className="comet-home__why-read">{segments.slice(0, revealed).join("")}</span>
            <span className="comet-home__why-reader" />
            <span className="comet-home__why-unread">{segments.slice(revealed).join("")}</span>
          </span>
        </p>
      </div>
    </section>
  );
};
