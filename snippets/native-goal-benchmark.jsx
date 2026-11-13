export const NativeGoalBenchmark = ({ language = 'zh' }) => {
  const t = (zh, en) => (language === 'en' ? en : zh);
  useEffect(() => {
    const section = document.getElementById('comet-native-benchmark-title')?.closest('section');
    if (!section) return;
    let visible = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const branches = section.querySelectorAll('.comet-home__benchmark-wood path');
    branches.forEach((path, index) => {
      path.setAttribute('pathLength', '1');
      path.style.setProperty('--branch-reveal-delay', `${(index % 8) * 0.09}s`);
    });
    section.dataset.benchmarkEnhanced = 'true';
    const update = () => {
      if (visible && !document.hidden) section.dataset.benchmarkEntered = 'true';
      section.dataset.benchmarkAnimate = String(visible && !document.hidden && !reduced.matches);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.12;
        update();
      },
      { threshold: 0.12 },
    );
    const move = (event) => {
      if (reduced.matches || event.pointerType !== 'mouse') return;
      const rect = section.getBoundingClientRect();
      section.style.setProperty(
        '--benchmark-wind',
        (((event.clientX - rect.left) / rect.width) * 2 - 1) * 1.2 + 'deg',
      );
    };
    const leave = () => {
      section.style.removeProperty('--benchmark-wind');
    };
    section.addEventListener('pointermove', move);
    section.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', update);
    observer.observe(section);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      reduced.removeEventListener('change', update);
      leave();
      document.removeEventListener('visibilitychange', update);
      delete section.dataset.benchmarkAnimate;
      delete section.dataset.benchmarkEnhanced;
      delete section.dataset.benchmarkEntered;
    };
  }, []);
  const Leaf = ({ x, y, angle, length, index, revealDelay }) => (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${length / 90})`}>
      <g
        className="comet-home__benchmark-leaf-reveal"
        style={{ '--leaf-reveal-delay': `${revealDelay}s` }}
      >
        <g
          className="comet-home__benchmark-leaf"
          style={{
            '--leaf-delay': `${-(index % 6) * 1.8}s`,
            '--leaf-duration': `${11 + (index % 5)}s`,
          }}
        >
          <path
            d="M0 0C-17-22-23-58 0-90C17-65 24-31 0 0Z"
            strokeWidth="1.05"
            fill="#f5f1e7"
            fillOpacity=".018"
          />
          <path
            d="M0-3C-2-28-3-57 0-85M-1-24L-13-38M-2-41L-15-55M-1-59L-10-70M-1-31L11-46M-2-50L10-63M-1-69L5-76"
            strokeWidth=".58"
            opacity=".65"
          />
        </g>
      </g>
    </g>
  );

  const groups = [
    {
      id: 'workbuddy-code',
      name: 'WorkBuddy-Bench',
      version: 'Code v1.0',
      rows: [
        {
          mode: 'native',
          average: '0.778',
          difficultyAverages: ['0.333', '1.000', '1.000'],
          scores: ['66.7', '0.0', '100.0', '100.0', '66.7', '66.7'],
        },
        {
          mode: 'goal',
          average: '0.750',
          difficultyAverages: ['0.250', '1.000', '1.000'],
          scores: ['66.7', '0.0', '100.0', '100.0', '66.7', '66.7'],
        },
      ],
    },
    {
      id: 'skillsbench',
      name: 'SkillsBench',
      version: 'v1.1',
      rows: [
        {
          mode: 'native',
          average: '0.667',
          difficultyAverages: ['0.667', '0.333', '1.000'],
          scores: ['66.7', '66.7', '33.3', '100.0', '100.0', '33.3'],
        },
        {
          mode: 'goal',
          average: '0.444',
          difficultyAverages: ['0.333', '0.333', '0.667'],
          scores: ['44.4', '33.3', '33.3', '66.7', '100.0', '0.0'],
        },
      ],
    },
  ];
  const averageAt = (row, column) =>
    column === 0 ? row.average : row.difficultyAverages[column - 1];
  const Trophy = ({ label }) => (
    <svg
      className="comet-home__benchmark-trophy"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      role="img"
      aria-label={label}
    >
      <path
        fill="currentColor"
        d="M7 3h10v3h4v3a5 5 0 0 1-5 5h-.54A5 5 0 0 1 13 15.9V19h4v2H7v-2h4v-3.1A5 5 0 0 1 8.54 14H8a5 5 0 0 1-5-5V6h4V3Zm0 5H5v1a3 3 0 0 0 2.3 2.92A5 5 0 0 1 7 10V8Zm10 0v2c0 .68-.14 1.33-.39 1.92A3 3 0 0 0 19 9V8h-2Z"
      />
    </svg>
  );

  return (
    <section className="comet-home__benchmark" aria-labelledby="comet-native-benchmark-title">
      <div className="comet-home__benchmark-art" aria-hidden="true">
        <div className="comet-home__benchmark-plant comet-home__benchmark-plant--tree">
          <svg viewBox="0 0 520 920" fill="none" preserveAspectRatio="xMidYMax meet">
            <g
              className="comet-home__benchmark-canopy"
              stroke="#f5f1e7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g className="comet-home__benchmark-wood" strokeWidth="1.25">
                <path d="M188 935C219 788 192 655 231 536C266 429 281 323 307 220C320 168 327 128 335 110" />
                <path d="M203 934C231 782 206 655 240 540C272 432 289 324 312 222" opacity=".45" />
                <path d="M224 623C190 586 131 563 48 565M231 619C191 576 128 552 65 555" />
                <path d="M245 489C208 452 162 414 94 400M247 484C205 442 157 405 112 402" />
                <path d="M277 353C244 313 213 259 197 178M281 346C246 301 221 252 210 216" />
                <path d="M267 397C316 371 369 362 425 325M271 389C322 365 365 356 401 338" />
                <path d="M245 535C302 513 353 462 380 412M251 526C304 504 345 459 365 436" />
                <path d="M318 190C352 171 386 138 409 75" />
                <path
                  d="M207 816C193 848 171 884 150 906M202 866C221 890 244 910 265 922"
                  opacity=".5"
                />
              </g>
              {[
                [48, 565, -65, 85],
                [101, 563, 22, 72],
                [164, 588, -20, 65],
                [94, 400, -52, 87],
                [151, 425, 18, 69],
                [206, 456, -24, 73],
                [197, 178, -9, 92],
                [211, 245, -59, 78],
                [245, 304, 22, 75],
                [335, 110, 8, 87],
                [315, 196, -36, 73],
                [409, 75, 31, 83],
                [381, 132, -42, 71],
                [425, 325, 53, 89],
                [369, 360, -8, 80],
                [316, 373, -39, 64],
                [380, 412, 27, 86],
                [341, 473, -53, 75],
                [287, 514, 21, 71],
              ].map(([x, y, angle, length], index) => (
                <Leaf
                  key={index}
                  x={x}
                  y={y}
                  angle={angle}
                  length={length}
                  index={index}
                  revealDelay={0.4 + ((920 - y) / 920) * 1.2}
                />
              ))}
            </g>
          </svg>
        </div>
        <div className="comet-home__benchmark-plant comet-home__benchmark-plant--bough">
          <svg viewBox="0 0 520 920" fill="none" preserveAspectRatio="xMidYMin meet">
            <g
              className="comet-home__benchmark-canopy"
              stroke="#f5f1e7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g className="comet-home__benchmark-wood" strokeWidth="1.2">
                <path d="M530 -12C461 48 430 121 457 214C484 305 444 357 373 411C324 449 299 522 285 620" />
                <path
                  d="M542 -10C469 55 440 124 465 212C492 307 450 362 378 417C332 451 309 515 299 568"
                  opacity=".45"
                />
                <path d="M444 135C392 126 342 111 297 53M448 129C397 120 353 104 321 80" />
                <path d="M460 229C403 225 348 214 300 171M462 222C408 219 359 208 324 188" />
                <path d="M434 344C473 367 488 411 486 475" />
                <path d="M371 412C313 405 269 379 218 335M377 405C318 397 277 374 239 351" />
                <path d="M305 545C357 548 402 532 436 494" />
                <path d="M293 592C269 576 250 556 247 532" opacity=".55" />
              </g>
              {[
                [297, 53, -28, 87],
                [341, 107, -68, 77],
                [397, 128, 9, 79],
                [300, 171, -43, 93],
                [354, 214, -83, 75],
                [408, 226, 18, 69],
                [486, 475, 159, 82],
                [479, 410, 82, 80],
                [451, 366, 5, 78],
                [218, 335, -44, 92],
                [272, 382, -87, 76],
                [324, 405, 13, 71],
                [436, 494, 59, 82],
                [384, 534, 110, 72],
                [335, 545, 15, 67],
                [285, 620, -165, 75],
                [247, 532, -30, 72],
              ].map(([x, y, angle, length], index) => (
                <Leaf
                  key={index}
                  x={x}
                  y={y}
                  angle={angle}
                  length={length}
                  index={index + 3}
                  revealDelay={0.6 + (y / 920) * 1.2}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
      <div className="comet-home__benchmark-content">
        <div className="comet-home__benchmark-heading">
          <p className="comet-home__label" translate="no">
            Comet Native vs. Goal
          </p>
          <h2 id="comet-native-benchmark-title">
            {t('高难度场景，Native 满分率', 'Hard tasks, Native scores')} <span>100%</span>
          </h2>
          <p className="comet-home__benchmark-lede">
            {language === 'en' ? (
              <>
                Comet Native and native Goal are compared across easy, medium, and hard scenarios.
                Native achieves a <strong>100%</strong> perfect-score rate on the selected hard
                scenarios; its SkillsBench all-three-success rate is <strong>33.3%</strong>.
              </>
            ) : (
              <>
                Comet Native 与原生 Goal 在低、中、高难度场景中分层对照。所选高难度场景的 Native
                原题满分率均为 <strong>100%</strong>；SkillsBench 三次全部满分比例为
                <strong>33.3%</strong>。
              </>
            )}
          </p>
        </div>

        <div className="comet-home__benchmark-board">
          <div className="comet-home__benchmark-caption" id="comet-native-benchmark-caption">
            <span>WorkBuddy-Bench / SkillsBench</span>
            <span>DeepSeek-V4.1-Flash-1017 · Claude Code</span>
          </div>
          <div
            className="comet-home__benchmark-scroll"
            role="region"
            aria-labelledby="comet-native-benchmark-caption"
            tabIndex={0}
          >
            <table className="comet-home__benchmark-table">
              <caption className="sr-only">
                {t(
                  '相同模型下，Comet Native 与原生 Goal 在 WorkBuddy-Bench 和 SkillsBench 各难度的满分率、平均原始得分、pass@3、pass^3。',
                  'Perfect-score rates, mean original scores, pass@3 and pass^3 for Comet Native and native Goal across WorkBuddy-Bench and SkillsBench difficulties using the same model.',
                )}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="comet-home__benchmark-dataset-heading">
                    {t('数据集', 'Dataset')}
                  </th>
                  <th scope="col" className="comet-home__benchmark-workflow">
                    {t('执行方式', 'Mode')}
                  </th>
                  <th scope="col" className="comet-home__benchmark-primary">
                    {t('总体满分率', 'Overall perfect-score rate')}
                    <span className="comet-home__benchmark-metric-hint">
                      {t('全部难度合计', 'All difficulties')}
                    </span>
                  </th>
                  <th scope="col">{t('低难度', 'Easy')}</th>
                  <th scope="col">{t('中难度', 'Medium')}</th>
                  <th scope="col">{t('高难度', 'Hard')}</th>
                  <th scope="col">
                    pass@3
                    <span className="comet-home__benchmark-metric-hint">
                      {t('至少一次满分', 'At least one perfect score')}
                    </span>
                  </th>
                  <th scope="col">
                    pass^3
                    <span className="comet-home__benchmark-metric-hint">
                      {t('三次全部满分', 'All three perfect')}
                    </span>
                  </th>
                </tr>
              </thead>
              {groups.map((group) => (
                <tbody key={group.id} data-dataset={group.id}>
                  {group.rows.map((row, index) => (
                    <tr
                      key={row.mode}
                      data-treatment={row.mode}
                      className={row.mode === 'native' ? 'comet-home__benchmark-native' : ''}
                    >
                      {index === 0 && (
                        <th
                          scope="rowgroup"
                          rowSpan={2}
                          className="comet-home__benchmark-dataset-cell"
                        >
                          {group.name}
                          <span>{group.version}</span>
                        </th>
                      )}
                      <th scope="row" className="comet-home__benchmark-workflow">
                        <span className="comet-home__benchmark-name">
                          <img
                            src={
                              row.mode === 'native'
                                ? '/logo/favicon.png'
                                : '/img/platforms/coding/claude-code.svg'
                            }
                            width="18"
                            height="18"
                            alt=""
                            loading="lazy"
                          />
                          {row.mode === 'native' ? 'Comet Native' : 'Goal'}
                        </span>
                        <span className="comet-home__benchmark-mode">{group.name}</span>
                      </th>
                      {row.scores.map((score, column) => (
                        <td
                          key={column}
                          className={`${column === 0 ? 'comet-home__benchmark-primary' : ''} ${score === '0.0' ? 'comet-home__benchmark-neutral' : ''} ${Number(score) > Number(group.rows[1 - index].scores[column]) ? 'comet-home__benchmark-best' : ''}`}
                        >
                          <strong>
                            {score}
                            <span>%</span>
                          </strong>
                          {Number(score) > Number(group.rows[1 - index].scores[column]) && (
                            <Trophy
                              label={t('本数据集该指标领先', 'Leading metric in this dataset')}
                            />
                          )}
                          {column <= 3 && (
                            <span
                              className={`comet-home__benchmark-average ${Number(averageAt(row, column)) > Number(averageAt(group.rows[1 - index], column)) ? 'comet-home__benchmark-average-best' : ''}`}
                            >
                              <span className="comet-home__benchmark-average-label">
                                {t('均分', 'Mean')}
                              </span>
                              <span className="comet-home__benchmark-average-value">
                                {averageAt(row, column)}
                              </span>
                              {group.id === 'workbuddy-code' &&
                                Number(averageAt(row, column)) >
                                  Number(averageAt(group.rows[1 - index], column)) && (
                                  <Trophy
                                    label={t(
                                      '本数据集该项均分领先',
                                      'Leading mean score in this dataset',
                                    )}
                                  />
                                )}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>

        <p className="comet-home__benchmark-notes">
          {t(
            '均分范围 0–1；pass@3 表示至少一次满分，pass^3 表示三次均满分。奖杯标记同数据集领先指标。总体满分率表示全部难度展示结果中，原题得分达到 1.0 的运行占比。',
            'Mean scores range from 0 to 1. pass@3 means at least one perfect score; pass^3 means all three are perfect. Trophies mark leading metrics within each dataset. The overall perfect-score rate is the share of displayed runs scoring 1.0 across all difficulties.',
          )}
        </p>
        <div className="comet-home__benchmark-footer">
          <p className="comet-home__benchmark-meta">Native 0.5.3 · DeepSeek-V4.1-Flash-1017</p>
          <a
            className="comet-home__benchmark-report-link"
            href={`/${language === 'en' ? 'en' : 'zh'}/eval/comet-native-053-vs-goal-experiment`}
          >
            {t('查看完整实验报告', 'Read the full experiment')}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
