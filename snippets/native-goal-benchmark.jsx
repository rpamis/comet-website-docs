export const NativeGoalBenchmark = () => {
  useEffect(() => {
    const section = document.getElementById('comet-native-benchmark-title')?.closest('section');
    if (!section) return;
    let visible = false;
    const update = () => {
      section.dataset.benchmarkAnimate = String(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(section);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      delete section.dataset.benchmarkAnimate;
    };
  }, []);
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
        <svg viewBox="0 0 2560 920" fill="none" preserveAspectRatio="xMidYMid slice">
          <g stroke="#f5f1e7" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M-120 672L135 522Q177 496 223 496H521C775 496 1029 368 1280 368S1850 496 2093 496H2227Q2284 496 2323 459L2679 121"
              opacity=".13"
            />
            <g opacity=".3">
              <path d="M78 312L277 212Q289 206 301 212L482 306Q494 312 482 318L283 418Q271 424 259 418L78 324Q66 318 78 312Z" />
              <path d="M72 354L259 450Q271 456 283 450L488 347M72 388L259 484Q271 490 283 484L488 381" />
              <path d="M72 318V388M271 423V490M488 312V381" opacity=".65" />
              <path d="M149 318L281 251L411 318L279 385Z" opacity=".55" />
              <path
                d="M100 541H438M115 534V548M173 537V545M231 534V548M289 537V545M347 534V548M405 537V545"
                opacity=".45"
              />
              <path d="M2111 460L2280 363Q2298 353 2316 363L2491 464Q2509 474 2491 484L2322 581Q2304 591 2286 581L2111 480Q2093 470 2111 460Z" />
              <path d="M2111 460V648L2286 749Q2304 759 2322 749L2498 648V474M2304 588V755" />
              <path d="M2156 497V622L2297 704M2346 604V704L2454 643V518" opacity=".55" />
              <path
                d="M2102 716L2252 801M2112 711L2105 724M2155 736L2148 749M2198 761L2191 774M2241 786L2234 799"
                opacity=".45"
              />
            </g>
            <path
              className="comet-home__benchmark-trace"
              pathLength="1000"
              d="M78 312L277 212Q289 206 301 212L482 306Q494 312 482 318L283 418Q271 424 259 418L78 324Q66 318 78 312Z"
            />
            <path
              className="comet-home__benchmark-trace comet-home__benchmark-trace--second"
              pathLength="1000"
              d="M2111 460L2280 363Q2298 353 2316 363L2491 464Q2509 474 2491 484L2322 581Q2304 591 2286 581L2111 480Q2093 470 2111 460Z"
            />
          </g>
        </svg>
      </div>
      <div className="comet-home__benchmark-content">
        <div className="comet-home__benchmark-heading">
          <p className="comet-home__label" translate="no">
            Comet Native vs. Goal
          </p>
          <h2 id="comet-native-benchmark-title">
            高难度场景，Native 满分率 <span>100%</span>
          </h2>
          <p className="comet-home__benchmark-lede">
            Comet Native 与原生 Goal 在低、中、高难度场景中分层对照。所选高难度场景的 Native
            原题满分率均为 <strong>100%</strong>；SkillsBench 三次全部满分比例为
            <strong>33.3%</strong>。
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
                相同模型下，Comet Native 与原生 Goal 在 WorkBuddy-Bench 和 SkillsBench
                各难度的满分率、平均原始得分、pass@3、pass^3。
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="comet-home__benchmark-dataset-heading">
                    数据集
                  </th>
                  <th scope="col" className="comet-home__benchmark-workflow">
                    执行方式
                  </th>
                  <th scope="col" className="comet-home__benchmark-primary">
                    总体满分率
                    <span className="comet-home__benchmark-metric-hint">全部难度合计</span>
                  </th>
                  <th scope="col">低难度</th>
                  <th scope="col">中难度</th>
                  <th scope="col">高难度</th>
                  <th scope="col">
                    pass@3
                    <span className="comet-home__benchmark-metric-hint">至少一次满分</span>
                  </th>
                  <th scope="col">
                    pass^3
                    <span className="comet-home__benchmark-metric-hint">三次全部满分</span>
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
                            <Trophy label="本数据集该指标领先" />
                          )}
                          {column <= 3 && (
                            <span
                              className={`comet-home__benchmark-average ${Number(averageAt(row, column)) > Number(averageAt(group.rows[1 - index], column)) ? 'comet-home__benchmark-average-best' : ''}`}
                            >
                              <span className="comet-home__benchmark-average-label">均分</span>
                              <span className="comet-home__benchmark-average-value">
                                {averageAt(row, column)}
                              </span>
                              {group.id === 'workbuddy-code' &&
                                Number(averageAt(row, column)) >
                                  Number(averageAt(group.rows[1 - index], column)) && (
                                  <Trophy label="本数据集该项均分领先" />
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
          均分范围 0–1；pass@3 表示至少一次满分，pass^3
          表示三次均满分。奖杯标记同数据集领先指标。总体满分率表示全部难度展示结果中，原题得分达到
          1.0 的运行占比。
        </p>
        <div className="comet-home__benchmark-footer">
          <p>Native 0.5.3 · DeepSeek-V4.1-Flash-1017</p>
          <a
            className="comet-home__benchmark-report-link"
            href="/zh/eval/comet-native-053-vs-goal-experiment"
          >
            查看完整实验报告<span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
