export const SelfEvolvingFlow = () => (
  <>
    <style>{`
      .comet-home__evolving {
        display: grid;
        width: min(100%, 78rem);
        grid-template-columns: minmax(20rem, 1fr) minmax(26rem, .9fr);
        align-items: center;
        gap: clamp(3rem, 7vw, 7rem);
        margin-inline: auto;
        padding-block: clamp(4rem, 8vw, 7rem);
        padding-inline: max(1.5rem, calc(env(safe-area-inset-left) + 2rem)) max(1.5rem, calc(env(safe-area-inset-right) + 2rem));
        border-top: 1px solid var(--line-soft);
      }
      .comet-home__evolving-copy,
      .comet-home__evolving-visual { min-width: 0; }
      .comet-home__evolving-visual {
        pointer-events: none;
        user-select: none;
      }
      .comet-home__evolving-copy .comet-home__label { margin-bottom: 1.25rem; }
      .comet-home__evolving-copy h2 {
        max-width: 32rem;
        font-size: clamp(1.6rem, 3vw, 2.25rem);
        line-height: 1.3;
        scroll-margin-top: 6rem;
      }
      .comet-home__evolving-lede {
        max-width: 34rem;
        margin-top: 1.75rem !important;
        color: var(--muted);
        font-size: clamp(1rem, 1.25vw, 1.08rem);
        line-height: 1.72;
      }
      .comet-home__evolving-domains {
        margin-top: 1.75rem;
        border-top: 1px solid var(--line);
      }
      .comet-home__evolving-domain {
        display: grid;
        grid-template-columns: 2rem minmax(0, 1fr);
        gap: .9rem;
        padding-block: 1.1rem;
        border-bottom: 1px solid var(--line);
      }
      .comet-home__evolving-index {
        padding-top: .18rem;
        color: var(--blue);
        font-family: var(--mono);
        font-size: .7rem;
        font-weight: 700;
        letter-spacing: .08em;
      }
      .comet-home__evolving-domains h3 {
        font-family: var(--sans);
        font-size: 1rem;
        font-weight: 720;
        letter-spacing: -.015em;
        line-height: 1.35;
      }
      .comet-home__evolving-domains p {
        margin-top: .35rem;
        color: var(--muted);
        font-size: .91rem;
        line-height: 1.62;
      }
      .comet-home__evolving-copy .comet-home__text-link { margin-top: 1.55rem; }

      .comet-home__evolve-editorial {
        --editorial-ivory: #e9e1d4;
        --editorial-coral: #dd7959;
        --editorial-coral-deep: #a95139;
        --editorial-blue: #70a0cf;
        --editorial-blue-deep: #3977a8;
        --editorial-ink: #242321;
        display: grid;
        min-height: 34rem;
        margin: 0;
        place-items: center;
      }
      .comet-home__evolve-editorial-canvas {
        position: relative;
        width: min(100%, 34rem);
        aspect-ratio: 1 / 1.02;
        overflow: hidden;
        background: var(--editorial-ivory);
        color: var(--editorial-ink);
      }
      .comet-home__evolve-editorial svg {
        display: block;
        width: 100%;
        height: 100%;
      }
      .comet-home__abstract-caption {
        fill: var(--editorial-ink);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 13px;
        letter-spacing: .09em;
      }
      .comet-home__abstract-note {
        fill: color-mix(in srgb, var(--editorial-ink) 62%, transparent);
        font-family: var(--mono);
        font-size: 7.5px;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .comet-home__abstract-axis {
        fill: none;
        stroke: color-mix(in srgb, var(--editorial-ink) 64%, transparent);
        stroke-width: 1.25;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
      }
      .comet-home__abstract-axis--soft {
        stroke: color-mix(in srgb, var(--editorial-ink) 28%, transparent);
      }
      .comet-home__abstract-memory-mark,
      .comet-home__abstract-knowledge-band,
      .comet-home__abstract-memory-new,
      .comet-home__abstract-knowledge-new {
        transform-box: fill-box;
        transform-origin: center;
      }
      .comet-home__abstract-memory-mark {
        animation: comet-abstract-memory 9.6s ease-in-out calc(var(--mark-index) * -.52s) infinite;
      }
      .comet-home__abstract-knowledge-band {
        animation: comet-abstract-knowledge 9.6s ease-in-out calc(var(--mark-index) * -.48s) infinite;
      }
      .comet-home__abstract-structure {
        stroke-dasharray: 105;
        animation: comet-abstract-structure 9.6s ease-in-out infinite;
      }
      .comet-home__abstract-selected-memory,
      .comet-home__abstract-selected-knowledge,
      .comet-home__abstract-context,
      .comet-home__abstract-output,
      .comet-home__abstract-memory-new,
      .comet-home__abstract-knowledge-new {
        transform-box: fill-box;
        transform-origin: center;
      }
      .comet-home__abstract-selected-memory { animation: comet-abstract-select-memory 9.6s cubic-bezier(.55, 0, .2, 1) infinite; }
      .comet-home__abstract-selected-knowledge { animation: comet-abstract-select-knowledge 9.6s cubic-bezier(.55, 0, .2, 1) infinite; }
      .comet-home__abstract-context { animation: comet-abstract-context 9.6s ease-in-out infinite; }
      .comet-home__abstract-output { animation: comet-abstract-output 9.6s ease-in-out infinite; }
      .comet-home__abstract-memory-new { animation: comet-abstract-new-memory 9.6s ease-in-out infinite; }
      .comet-home__abstract-knowledge-new { animation: comet-abstract-new-knowledge 9.6s ease-in-out infinite; }

      @keyframes comet-abstract-memory {
        0%, 100% { transform: translateY(0) scaleY(1); }
        24% { transform: translateY(-3px) scaleY(1.045); }
        51% { transform: translateY(2px) scaleY(.975); }
        76% { transform: translateY(-1px) scaleY(1.02); }
      }
      @keyframes comet-abstract-knowledge {
        0%, 100% { transform: translateX(0) scaleX(1); }
        31% { transform: translateX(4px) scaleX(1.02); }
        62% { transform: translateX(-2px) scaleX(.985); }
      }
      @keyframes comet-abstract-structure {
        0%, 8% { stroke-dashoffset: 105; opacity: .2; }
        30%, 88% { stroke-dashoffset: 0; opacity: 1; }
        100% { stroke-dashoffset: -105; opacity: .2; }
      }
      @keyframes comet-abstract-select-memory {
        0%, 18% { opacity: 0; transform: translate(0, 0) scale(1); }
        22% { opacity: 1; }
        46%, 58% { opacity: 1; transform: translate(102px, 72px) scale(.72); }
        68%, 100% { opacity: 0; transform: translate(102px, 72px) scale(.72); }
      }
      @keyframes comet-abstract-select-knowledge {
        0%, 31% { opacity: 0; transform: translate(0, 0) scale(1); }
        35% { opacity: 1; }
        54%, 65% { opacity: 1; transform: translate(-98px, -71px) scale(.7); }
        74%, 100% { opacity: 0; transform: translate(-98px, -71px) scale(.7); }
      }
      @keyframes comet-abstract-context {
        0%, 42% { opacity: .12; transform: scale(.78) rotate(-2deg); }
        56%, 78% { opacity: 1; transform: scale(1) rotate(0); }
        88%, 100% { opacity: .12; transform: scale(.82) rotate(1deg); }
      }
      @keyframes comet-abstract-output {
        0%, 57% { opacity: 0; transform: translate(-12px, 8px); }
        68%, 88% { opacity: 1; transform: translate(0, 0); }
        100% { opacity: 0; transform: translate(12px, -5px); }
      }
      @keyframes comet-abstract-new-memory {
        0%, 72% { opacity: 0; transform: translateY(9px) scaleY(.45); }
        82%, 95% { opacity: 1; transform: translateY(0) scaleY(1); }
        100% { opacity: 0; }
      }
      @keyframes comet-abstract-new-knowledge {
        0%, 78% { opacity: 0; transform: translateX(-9px) scaleX(.4); }
        87%, 96% { opacity: 1; transform: translateX(0) scaleX(1); }
        100% { opacity: 0; }
      }

      @media (max-width: 64rem) {
        .comet-home__evolving { grid-template-columns: minmax(0, 1fr); gap: 2.75rem; }
        .comet-home__evolving-copy { max-width: 48rem; }
        .comet-home__evolving-domains {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
          border-top: 0;
        }
        .comet-home__evolving-domain { border-top: 1px solid var(--line); }
        .comet-home__evolving-visual { width: min(100%, 42rem); margin-inline: auto; }
        .comet-home__evolve-editorial { min-height: 30rem; }
      }
      @media (max-width: 48rem) {
        .comet-home__evolving {
          padding-block: 4rem;
          padding-inline: max(1rem, calc(env(safe-area-inset-left) + 1rem)) max(1rem, calc(env(safe-area-inset-right) + 1rem));
        }
        .comet-home__evolving-domains { grid-template-columns: 1fr; gap: 0; border-top: 1px solid var(--line); }
        .comet-home__evolving-domain { border-top: 0; }
        .comet-home__evolve-editorial { min-height: 0; }
      }
      @media (max-width: 34rem) {
        .comet-home__evolving { gap: 2rem; }
        .comet-home__evolve-editorial-canvas { width: 106%; max-width: none; }
      }
      @media (prefers-reduced-motion: reduce) {
        .comet-home__abstract-memory-mark,
        .comet-home__abstract-knowledge-band,
        .comet-home__abstract-structure,
        .comet-home__abstract-selected-memory,
        .comet-home__abstract-selected-knowledge,
        .comet-home__abstract-context,
        .comet-home__abstract-output,
        .comet-home__abstract-memory-new,
        .comet-home__abstract-knowledge-new { animation: none; }
        .comet-home__abstract-structure { stroke-dashoffset: 0; }
        .comet-home__abstract-selected-memory,
        .comet-home__abstract-selected-knowledge { opacity: 0; }
        .comet-home__abstract-context,
        .comet-home__abstract-output,
        .comet-home__abstract-memory-new,
        .comet-home__abstract-knowledge-new { opacity: 1; transform: none; }
      }
    `}</style>

    <div
      className="comet-home__evolve-editorial"
      aria-label="个人记忆以暖色短条表示，项目知识以冷色层叠结构表示；两者选择性汇合为下一次任务上下文，并在任务完成后各自新增经验"
    >
      <div className="comet-home__evolve-editorial-canvas">
        <svg viewBox="0 0 560 570" role="img" aria-labelledby="self-evolving-editorial-title">
          <title id="self-evolving-editorial-title">个人记忆与项目知识持续沉淀并进入下一次任务的抽象编辑构成</title>

          <text className="comet-home__abstract-caption" x="58" y="62">PERSONAL MEMORY</text>
          <text className="comet-home__abstract-note" x="60" y="80">PREFERENCE · FEEDBACK · EXPERIENCE</text>

          <g aria-hidden="true">
            <path className="comet-home__abstract-memory-mark" style={{ "--mark-index": 0 }} fill="var(--editorial-coral)" d="M77 125c8-9 22-8 27 2l-2 105c-9 7-20 7-28-1l3-106Z" />
            <path className="comet-home__abstract-memory-mark" style={{ "--mark-index": 1 }} fill="var(--editorial-coral-deep)" d="M116 149c7-8 19-7 24 1l1 66c-6 8-17 10-24 3l-1-70Z" />
            <path className="comet-home__abstract-memory-mark" style={{ "--mark-index": 2 }} fill="var(--editorial-coral)" d="M151 109c8-7 20-5 24 4l-3 127c-8 7-18 6-24-2l3-129Z" />
            <path className="comet-home__abstract-memory-mark" style={{ "--mark-index": 3 }} fill="var(--editorial-coral)" d="M187 139c6-8 18-9 24-1l2 85c-6 10-18 11-25 2l-1-86Z" />
            <path className="comet-home__abstract-memory-mark" style={{ "--mark-index": 4 }} fill="var(--editorial-coral-deep)" d="M222 120c7-7 17-6 22 2l-2 99c-6 7-17 8-23 1l3-102Z" />
            <path className="comet-home__abstract-axis comet-home__abstract-axis--soft" d="M67 254c57-8 119-7 183 1" />
            <circle fill="var(--editorial-ink)" cx="89" cy="268" r="2.5" />
            <circle fill="var(--editorial-ink)" cx="128" cy="265" r="1.7" />
            <circle fill="var(--editorial-ink)" cx="195" cy="269" r="2.2" />
          </g>

          <text className="comet-home__abstract-caption" x="309" y="343">PROJECT KNOWLEDGE</text>
          <text className="comet-home__abstract-note" x="311" y="361">CODE · POLICY · REVIEW · VERIFY</text>

          <g aria-hidden="true">
            <path className="comet-home__abstract-knowledge-band" style={{ "--mark-index": 0 }} fill="var(--editorial-blue-deep)" d="M304 386c46-7 101-7 164 0l-3 20c-61-6-114-5-160 2l-1-22Z" />
            <path className="comet-home__abstract-knowledge-band" style={{ "--mark-index": 1 }} fill="var(--editorial-blue)" d="M328 419c43-5 91-3 145 4l-2 24c-52-7-100-8-144-3l1-25Z" />
            <path className="comet-home__abstract-knowledge-band" style={{ "--mark-index": 2 }} fill="var(--editorial-blue-deep)" d="M294 459c49-8 106-6 171 5l-4 18c-63-9-118-11-168-3l1-20Z" />
            <path className="comet-home__abstract-knowledge-band" style={{ "--mark-index": 3 }} fill="var(--editorial-blue)" d="M345 493c31-2 69 1 113 9l-4 17c-41-7-78-11-110-8l1-18Z" />
            <path className="comet-home__abstract-structure comet-home__abstract-axis" d="M322 375v128m0-91h126m-72-31v118m50-109v115" />
            <circle fill="var(--editorial-ink)" cx="322" cy="412" r="3" />
            <circle fill="var(--editorial-ink)" cx="376" cy="446" r="2.2" />
            <circle fill="var(--editorial-ink)" cx="426" cy="479" r="2.6" />
          </g>

          <path className="comet-home__abstract-axis comet-home__abstract-axis--soft" d="M267 85c-6 83-7 169-2 257 3 66 3 117 0 153" />
          <path className="comet-home__abstract-axis comet-home__abstract-axis--soft" d="M277 287c66-4 127-1 182 8" />

          <g className="comet-home__abstract-selected-memory" aria-hidden="true">
            <path fill="var(--editorial-coral-deep)" d="M174 164c6-7 16-7 21 0v58c-5 7-15 8-21 1v-59Z" />
          </g>
          <g className="comet-home__abstract-selected-knowledge" aria-hidden="true">
            <path fill="var(--editorial-blue-deep)" d="M344 435c31-4 63-2 96 3l-2 17c-34-5-65-7-94-3v-17Z" />
          </g>

          <g className="comet-home__abstract-context" aria-hidden="true">
            <path fill="var(--editorial-coral)" d="M269 253c6-5 14-4 18 2l-1 46c-5 6-13 6-18 0l1-48Z" />
            <path fill="var(--editorial-blue-deep)" d="M287 279c28-4 54-3 78 2l-2 15c-25-4-50-5-76-1v-16Z" />
            <path className="comet-home__abstract-axis" d="M253 308c35-6 74-5 115 2M304 241v81" />
            <circle fill="var(--editorial-ink)" cx="304" cy="309" r="3.2" />
          </g>

          <g className="comet-home__abstract-output" aria-hidden="true">
            <path className="comet-home__abstract-axis" d="M378 272c27-5 55-5 84 1" />
            <path fill="var(--editorial-coral)" d="M407 247c4-4 10-3 13 1v26c-4 4-9 4-13 0v-27Z" />
            <path fill="var(--editorial-blue)" d="M422 265c17-2 34-1 50 2l-1 10c-16-3-33-4-49-2v-10Z" />
            <circle fill="var(--editorial-ink)" cx="454" cy="257" r="2.4" />
          </g>

          <g className="comet-home__abstract-memory-new" aria-hidden="true">
            <path fill="var(--editorial-coral-deep)" d="M247 171c5-5 13-4 16 2l-1 57c-4 6-12 6-16 1l1-60Z" />
          </g>
          <g className="comet-home__abstract-knowledge-new" aria-hidden="true">
            <path fill="var(--editorial-blue)" d="M312 525c39-3 82 1 130 10l-3 12c-47-8-90-13-128-9l1-13Z" />
          </g>

          <text className="comet-home__abstract-caption" x="58" y="504">WHAT REMAINS</text>
          <text className="comet-home__abstract-note" x="60" y="523">SELECTED FOR THE NEXT TASK · CALIBRATED AFTER USE</text>
        </svg>
      </div>
    </div>
  </>
);
