import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const snapshots = [
  ['baseline', 'BaselineReport', 'comet-baseline-20260705/baseline-benchmark-report.json'],
  [
    'native-classic',
    'NativeClassicReport',
    'comet-native-vs-040-20260716/native-benchmark-report.json',
  ],
  [
    'clarification',
    'ClarificationReport',
    'comet-native-clarification-20260722/native-clarification-report.json',
  ],
  [
    'rc1-beta16',
    'Rc1Beta16Report',
    'comet-native-vs-rc1-beta16-20260828/native-benchmark-report.json',
  ],
  [
    'memory-disabled',
    'MemoryDisabledReport',
    'comet-native-vs-rc1-beta16-20260828/native-memory-disabled-followup-report.json',
  ],
  [
    'rc1-beta16-en',
    'Rc1Beta16ReportEn',
    'comet-native-vs-rc1-beta16-20260828/native-benchmark-report-en.json',
  ],
  [
    'memory-disabled-en',
    'MemoryDisabledReportEn',
    'comet-native-vs-rc1-beta16-20260828/native-memory-disabled-followup-report-en.json',
  ],
];
for (const [name, component, source] of snapshots) {
  const { html } = JSON.parse(readFileSync(new URL(`assets/eval-reports/${source}`, root), 'utf8'));
  if (typeof html !== 'string' || !html.includes('<html'))
    throw new Error(`Missing HTML in ${source}`);
  writeFileSync(
    new URL(`snippets/eval-report-snapshots/${name}.jsx`, root),
    `// Frozen HTML from /assets/eval-reports/${source}.
// Regenerate with: node scripts/sync-eval-report-snapshots.mjs
// prettier-ignore
export const ${component} = ({ title, height = 720 }) => (
  <div className="not-prose overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
    <iframe
      title={title}
      srcDoc={${JSON.stringify(html)}}
      height={height}
      className="block w-full bg-white"
      loading="lazy"
      sandbox="allow-downloads allow-forms allow-popups allow-scripts"
    />
  </div>
);
`,
  );
}
