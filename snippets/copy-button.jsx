export const CopyButton = ({ value, label = '复制' }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <button
      type="button"
      className={`comet-home__copy-button${copied ? ' is-copied' : ''}`}
      aria-label={copied ? '已复制' : label}
      title={copied ? '已复制' : label}
      onClick={copy}
    >
      {copied ? (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m4.5 10.5 3.25 3.25L15.5 6" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <rect x="6.5" y="6.5" width="9" height="9" rx="1.5" />
          <path d="M13.5 6.5V5A1.5 1.5 0 0 0 12 3.5H5A1.5 1.5 0 0 0 3.5 5v7A1.5 1.5 0 0 0 5 13.5h1.5" />
        </svg>
      )}
    </button>
  );
};
