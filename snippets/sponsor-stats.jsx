export const SponsorStats = () => {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-sponsor-count]'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const frames = new Map();
    const started = new Set();
    const finalText = new Map(nodes.map(node => [node, node.textContent]));
    let observer;

    const finish = () => {
      observer?.disconnect();
      frames.forEach(frame => window.cancelAnimationFrame(frame));
      frames.clear();
      nodes.forEach(node => { node.textContent = finalText.get(node); });
    };

    const start = node => {
      if (started.has(node)) return;
      started.add(node);
      observer?.unobserve(node);
      const target = Number(node.dataset.sponsorCount);
      const decimals = Number(node.dataset.countDecimals || 0);
      const suffix = node.dataset.countSuffix || '';
      let startTime;
      node.textContent = `${(0).toFixed(decimals)}${suffix}`;
      const tick = time => {
        if (startTime === undefined) startTime = time;
        const progress = Math.min((time - startTime) / 1600, 1);
        const value = target * (1 - Math.pow(1 - progress, 3));
        node.textContent = progress === 1
          ? finalText.get(node)
          : `${value.toFixed(decimals)}${suffix}`;
        if (progress < 1) frames.set(node, window.requestAnimationFrame(tick));
        else frames.delete(node);
      };
      frames.set(node, window.requestAnimationFrame(tick));
    };

    if (motion.matches || !window.IntersectionObserver) return;
    observer = new window.IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) start(entry.target); });
    }, { threshold: 0.6 });
    nodes.forEach(node => observer.observe(node));
    const onMotionChange = () => { if (motion.matches) finish(); };
    motion.addEventListener('change', onMotionChange);
    return () => {
      finish();
      motion.removeEventListener('change', onMotionChange);
    };
  }, []);
  return null;
};
