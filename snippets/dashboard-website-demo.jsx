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

    // 预览 bundle 约 5.9MB（gzip 后 1.7MB），与首屏渲染同时请求会抢占带宽。
    // 等浏览器空闲（至多 1.2s）再拉取，首屏文字与 CTA 先行渲染。
    const startLoading = (load) => {
      if (typeof window === 'undefined') {
        load();
        return;
      }
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(load, { timeout: 1200 });
      } else {
        window.setTimeout(load, 300);
      }
    };

    // Mintlify 部署会丢弃 .js/.css 静态文件（.json/.png 正常），因此资产以 JSON 包装下发，
    // 浏览器端还原成 Blob URL 后再注入。资产解析结果缓存在 globalThis 上，SPA 内页切换时避免重复拉取。
    const loadDashboardAssets = () => {
      const cache = globalThis.__cometDashboardWebsiteDemoAssets;
      if (cache) return cache;

      const fetchPayload = (url) =>
        fetch(url)
          .then((response) => {
            if (!response.ok) throw new Error(`Dashboard 预览静态资源加载失败（${response.status}）。`);
            return response.json();
          });

      globalThis.__cometDashboardWebsiteDemoAssets = Promise.all([
        fetchPayload('/assets/dashboard-website-demo/dashboard-website-demo.js.json?v=rc1-website-11'),
        fetchPayload('/assets/dashboard-website-demo/dashboard-website-demo.css.json?v=rc1-website-11'),
      ])
        .then(([jsPayload, cssPayload]) => ({
          scriptUrl: URL.createObjectURL(
            new Blob([jsPayload.js], { type: 'text/javascript' }),
          ),
          stylesheetUrl: URL.createObjectURL(new Blob([cssPayload.css], { type: 'text/css' })),
        }))
        .catch((error) => {
          delete globalThis.__cometDashboardWebsiteDemoAssets;
          throw error;
        });

      return globalThis.__cometDashboardWebsiteDemoAssets;
    };

    const loadDashboardBundle = ({ scriptUrl }) => {
      if (globalThis.CometDashboardWebsiteDemo) {
        return Promise.resolve(globalThis.CometDashboardWebsiteDemo);
      }

      return new Promise((resolve, reject) => {
        let script = document.querySelector('script[data-comet-dashboard-website-demo]');
        const handleLoad = () => {
          if (globalThis.CometDashboardWebsiteDemo) resolve(globalThis.CometDashboardWebsiteDemo);
          else reject(new Error('Dashboard 预览加载完成，但没有找到挂载入口。'));
        };
        const handleError = () => reject(new Error('Dashboard 预览脚本执行失败。'));

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

    startLoading(() => {
      loadDashboardAssets()
        .then((assets) => loadDashboardBundle(assets).then((dashboard) => ({ dashboard, assets })))
        .then(({ dashboard, assets }) => {
          if (cancelled) return;
          unmountDashboard = dashboard.mount(mountPoint, { stylesheetUrl: assets.stylesheetUrl });
        })
        .catch((error) => {
          if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error));
        });
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
