export const BlogLandscape = ({ lang = "zh" }) => {
  const translations = {
    zh: {
      scenes: ["观星", "书廊", "石桥", "远航", "麦光", "海岚", "轨道"],
      caption: "在代码之外，留一点想象。",
      shuffle: "随机切换风景",
      pause: "暂停自动切换风景",
      resume: "继续自动切换风景",
      pauseTitle: "暂停播放",
      resumeTitle: "继续播放",
    },
    en: {
      scenes: [
        "Observatory",
        "Library",
        "Bridge",
        "Harbor",
        "Wheatfields",
        "Coast",
        "Viaduct",
      ],
      caption: "A little room for imagination.",
      shuffle: "Shuffle landscapes",
      pause: "Pause landscape slideshow",
      resume: "Resume landscape slideshow",
      pauseTitle: "Pause slideshow",
      resumeTitle: "Resume slideshow",
    },
  };
  const t = translations[lang] || translations.zh;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [loading, setLoading] = useState(false);
  const controlsRef = useRef(null);
  const activeRef = useRef(0);
  const requestRef = useRef(0);
  const loadingRef = useRef(false);
  const mountedRef = useRef(false);
  const timersRef = useRef(new Set());
  const scenes = [
    {
      src: "/assets/blog-landscapes/observatory-oil-v2.webp",
      name: t.scenes[0],
    },
    { src: "/assets/blog-landscapes/library-oil-v2.webp", name: t.scenes[1] },
    { src: "/assets/blog-landscapes/bridge-oil-v2.webp", name: t.scenes[2] },
    { src: "/assets/blog-landscapes/harbor-oil-v2.webp", name: t.scenes[3] },
    { src: "/assets/blog-landscapes/wheat-oil-v2.webp", name: t.scenes[4] },
    { src: "/assets/blog-landscapes/coast-oil-v2.webp", name: t.scenes[5] },
    { src: "/assets/blog-landscapes/viaduct-oil-v2.webp", name: t.scenes[6] },
  ];
  const shuffle = async () => {
    if (loadingRef.current) return;
    const frame = controlsRef.current
      ?.closest(".comet-blog__landscape")
      ?.querySelector(".comet-blog__art");
    const poster = frame?.querySelector(".comet-blog__poster");
    if (!poster) return;
    const index =
      (activeRef.current +
        1 +
        Math.floor(Math.random() * (scenes.length - 1))) %
      scenes.length;
    const request = ++requestRef.current;
    loadingRef.current = true;
    setLoading(true);
    try {
      const next = index === 0 ? poster : new Image();
      if (next !== poster) {
        next.alt = "";
        next.width = 1672;
        next.height = 941;
        next.decoding = "async";
        next.fetchPriority = "low";
        next.dataset.blogFrame = "";
        next.src = scenes[index].src;
      }
      // Keep the current frame and caption until the replacement is ready to paint.
      await next.decode();
      if (
        !mountedRef.current ||
        request !== requestRef.current ||
        !frame.isConnected
      )
        return;
      for (const image of frame.querySelectorAll(
        "[data-blog-frame]:not(.is-active)",
      ))
        image.remove();
      const previous = [...frame.querySelectorAll("img.is-active")];
      if (!frame.contains(next)) frame.append(next);
      // Establish the incoming frame's initial opacity before starting the crossfade.
      void next.offsetWidth;
      next.classList.add("is-active");
      for (const image of previous)
        if (image !== next) image.classList.remove("is-active");
      activeRef.current = index;
      setActive(index);
      const timer = window.setTimeout(() => {
        for (const image of previous) {
          if (image !== poster && !image.classList.contains("is-active"))
            image.remove();
        }
        timersRef.current.delete(timer);
      }, 1800);
      timersRef.current.add(timer);
    } catch {
      // Failed downloads leave the last successfully displayed scene in place.
    } finally {
      if (request === requestRef.current) {
        loadingRef.current = false;
        if (mountedRef.current) setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    const frame = controlsRef.current
      ?.closest(".comet-blog__landscape")
      ?.querySelector(".comet-blog__art");
    return () => {
      mountedRef.current = false;
      requestRef.current++;
      loadingRef.current = false;
      for (const timer of timersRef.current) window.clearTimeout(timer);
      timersRef.current.clear();
      for (const image of frame?.querySelectorAll("[data-blog-frame]") || [])
        image.remove();
      frame?.querySelector(".comet-blog__poster")?.classList.add("is-active");
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) shuffle();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  return (
    <div className="comet-blog__art-caption" ref={controlsRef}>
      <span>{t.caption}</span>
      <div className="comet-blog__art-controls">
        <span
          className="comet-blog__scene-name"
          aria-live={paused || reducedMotion ? "polite" : "off"}
        >
          {scenes[active].name}
          <span className="comet-blog__scene-number">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(scenes.length).padStart(2, "0")}
          </span>
        </span>
        <button
          type="button"
          onClick={shuffle}
          disabled={loading}
          aria-label={t.shuffle}
          title={t.shuffle}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 7h3c4 0 6 10 10 10h3M17 14l3 3-3 3M4 17h3c1.4 0 2.6-1.2 3.7-3M13.3 10C14.4 8.2 15.6 7 17 7h3M17 4l3 3-3 3" />
          </svg>
        </button>
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? t.resume : t.pause}
            aria-pressed={paused}
            title={paused ? t.resumeTitle : t.pauseTitle}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {paused ? (
                <path d="m9 5 10 7-10 7V5Z" />
              ) : (
                <path d="M9 5v14M15 5v14" />
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
