export const DashboardWebsiteDemo = () => {
  const DESIGN_WIDTH = 1444;
  const DESIGN_HEIGHT = 901;
  const MOBILE_BREAKPOINT = 768;
  const MOBILE_MIN_SCALE = 0.44;
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const [viewport, setViewport] = useState({ scale: 1, isScrollable: false });
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const updateScale = () => {
      const fitScale = Math.min(stage.clientWidth / DESIGN_WIDTH, 1);
      const nextScale =
        stage.clientWidth <= MOBILE_BREAKPOINT ? Math.max(fitScale, MOBILE_MIN_SCALE) : fitScale;
      const nextScrollable = nextScale - fitScale > 0.001;
      setViewport((current) =>
        Math.abs(current.scale - nextScale) < 0.001 && current.isScrollable === nextScrollable
          ? current
          : { scale: nextScale, isScrollable: nextScrollable },
      );
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mountPoint = mountRef.current;
    if (!mountPoint) return undefined;

    let cancelled = false;
    let unmountDashboard;
    const scriptUrl = '/assets/dashboard-website-demo/dashboard-website-demo.js?v=rc1-website-9';
    const stylesheetUrl =
      '/assets/dashboard-website-demo/dashboard-website-demo.css?v=rc1-website-9';

    const loadDashboardBundle = () => {
      if (globalThis.CometDashboardWebsiteDemo) {
        return Promise.resolve(globalThis.CometDashboardWebsiteDemo);
      }

      return new Promise((resolve, reject) => {
        let script = document.querySelector('script[data-comet-dashboard-website-demo]');
        const handleLoad = () => {
          if (globalThis.CometDashboardWebsiteDemo) resolve(globalThis.CometDashboardWebsiteDemo);
          else reject(new Error('Dashboard 预览加载完成，但没有找到挂载入口。'));
        };
        const handleError = () => reject(new Error('Dashboard 预览静态资源加载失败。'));

        if (!script) {
          script = document.createElement('script');
          script.src = scriptUrl;
          script.async = true;
          script.dataset.cometDashboardWebsiteDemo = 'true';
          document.head.append(script);
        }

        script.addEventListener('load', handleLoad, { once: true });
        script.addEventListener('error', handleError, { once: true });
      });
    };

    loadDashboardBundle()
      .then((dashboard) => {
        if (cancelled) return;
        unmountDashboard = dashboard.mount(mountPoint, { stylesheetUrl });
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error));
      });

    return () => {
      cancelled = true;
      unmountDashboard?.();
    };
  }, []);

  const { scale, isScrollable } = viewport;
  const scaledWidth = DESIGN_WIDTH * scale;
  const scaledHeight = DESIGN_HEIGHT * scale;
  const handleViewportKeyDown = (event) => {
    if (!isScrollable || event.target !== event.currentTarget) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 160 : -160;
  };

  return (
    <div
      ref={stageRef}
      className={`comet-dashboard-website-stage${isScrollable ? ' is-mobile-viewport' : ''}`}
      style={{ height: `${scaledHeight}px` }}
      tabIndex={isScrollable ? 0 : undefined}
      aria-label={isScrollable ? '可横向浏览 Comet Dashboard' : undefined}
      onKeyDown={handleViewportKeyDown}
    >
      <div
        className="comet-dashboard-website-scroll-content"
        style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}
      >
        <div className="comet-dashboard-website-canvas" style={{ transform: `scale(${scale})` }}>
          <div ref={mountRef} className="comet-dashboard-website-mount" />
        </div>
      </div>
      {loadError ? <p className="comet-dashboard-website-error">{loadError}</p> : null}
    </div>
  );
};
