export const RawHtmlReportFrame = ({ src, title, height = 720 }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setHtml("");
    setError("");

    fetch(src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load report: ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (!cancelled) {
          setHtml(payload.html || "");
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="not-prose overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
      {html ? (
        <iframe
          srcDoc={html}
          title={title}
          className="block w-full bg-white"
          height={height}
          loading="lazy"
          sandbox="allow-downloads allow-forms allow-popups allow-scripts"
        />
      ) : (
        <div className="flex min-h-48 items-center justify-center px-6 py-12 text-sm text-zinc-600 dark:text-zinc-300">
          {error || "Loading report..."}
        </div>
      )}
    </div>
  );
};
