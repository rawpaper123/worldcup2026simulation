"use client";

import { useEffect, useState } from "react";
import {
  prototypeAgents,
  prototypeDateChips,
  prototypeLogs,
  prototypeScheduleSections,
  prototypeSimulationCards,
  type PrototypeText,
} from "@/lib/worldcup2026/worldcupPrototypeData";
import { WORLD_CUP_LANGUAGE_STORAGE_KEY } from "@/lib/worldcup2026/worldcupCopy";
import type { WorldCupLanguage } from "@/lib/worldcup2026/types";

function detectInitialLanguage(): WorldCupLanguage {
  if (typeof window === "undefined") return "zh";

  try {
    const saved = window.localStorage.getItem(WORLD_CUP_LANGUAGE_STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    return "zh";
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const hasChineseLanguage = languages.some((language) => language?.toLowerCase().startsWith("zh"));
  const looksChinaLocal =
    timeZone === "Asia/Shanghai" || timeZone === "Asia/Chongqing" || timeZone === "Asia/Urumqi";

  return hasChineseLanguage || looksChinaLocal ? "zh" : "en";
}

function Text({ value }: { value: PrototypeText }) {
  return (
    <>
      <span className="zh">{value.zh}</span>
      <span className="en">{value.en}</span>
    </>
  );
}

function WinText({ zh, en }: { zh: string; en: string }) {
  const zhIndex = zh.indexOf("胜");
  const enIndex = en.indexOf("Win");

  return (
    <>
      <span className="zh">
        {zhIndex >= 0 ? (
          <>
            {zh.slice(0, zhIndex)}
            <span className="win-char">胜</span>
            {zh.slice(zhIndex + 1)}
          </>
        ) : (
          zh
        )}
      </span>
      <span className="en">
        {enIndex >= 0 ? (
          <>
            {en.slice(0, enIndex)}
            <span className="win-char">Win</span>
            {en.slice(enIndex + 3)}
          </>
        ) : (
          en
        )}
      </span>
    </>
  );
}

function LanguageButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={`pill ${active ? "active" : ""}`} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero-main">
        <div className="eyebrow">
          <span className="dot" />
          <span className="zh">2026 世界杯 · 公开演化实验</span>
          <span className="en">World Cup 2026 · Public Evolution Experiment</span>
        </div>

        <h1>
          <span className="zh">用 104 场世界杯，公开演化一个有限世界模型</span>
          <span className="en">104 Matches to Evolve a Bounded World Model</span>
        </h1>

        <p className="hero-subtitle zh">
          通过自研 Bounded World Model、多 Agent 代理系统、千次模拟关系世界模型和可控 Agent，每场比赛都会在开赛前完成胜负方向推演，并在结果出现后更新模型战绩。
        </p>
        <p className="hero-subtitle en">
          A self-developed Bounded World Model combines multi-agent reasoning, thousand-run relationship simulations,
          and controllable agents to predict match outcomes, verify results, and evolve across the tournament.
        </p>

        <div className="cta-row">
          <a className="button primary" href="#schedule">
            <span className="zh">查看赛程演化表</span>
            <span className="en">View Schedule Board</span> →
          </a>
          <a className="button" href="#model">
            <span className="zh">了解模型如何演化</span>
            <span className="en">Explore the Model</span>
          </a>
        </div>
      </div>

      <div className="hero-side">
        <div className="record-card">
          <div>
            <div className="record-title">
              <span className="zh">当前模型战绩</span>
              <span className="en">Live Model Record</span>
            </div>
            <div className="accuracy-wrap">
              <div className="accuracy-label">
                <span className="zh">正确率</span>
                <span className="en">Accuracy</span>
              </div>
              <div className="accuracy">66.7%</div>
            </div>
            <div className="streak-panel">
              <div className="streak-main">
                <span className="zh">连续预测正确</span>
                <span className="en">Current correct streak</span> <strong>4</strong>{" "}
                <span className="zh">场</span>
                <span className="en">matches</span>
              </div>
              <div className="streak-sub">
                <span className="zh">最高连续正确 7 场</span>
                <span className="en">Best streak: 7 matches</span>
              </div>
            </div>
          </div>

          <div className="record-grid">
            <div className="mini-stat">
              <div className="value">24</div>
              <div className="label zh">已预测</div>
              <div className="label en">Predicted</div>
            </div>
            <div className="mini-stat">
              <div className="value">16</div>
              <div className="label zh">预测正确</div>
              <div className="label en">Correct</div>
            </div>
            <div className="mini-stat">
              <div className="value">104</div>
              <div className="label zh">总场次</div>
              <div className="label en">Matches</div>
            </div>
          </div>
        </div>

        <div className="spotlight">
          <div className="record-title">
            <span className="zh">下一场推演</span>
            <span className="en">Next Simulation</span>
          </div>
          <div className="match-line">
            <div>
              <div className="game-time zh">A组 · 6月12日 09:00 北京时间</div>
              <div className="game-time en">Group A · Jun 11 · 9:00 PM ET</div>
              <div className="teams">
                <span className="zh">
                  墨西哥 <span className="vs">vs</span> 南非
                </span>
                <span className="en">
                  Mexico <span className="vs">vs</span> South Africa
                </span>
              </div>
            </div>
            <span className="status">
              <span className="zh">赛前预测</span>
              <span className="en">PRE-MATCH</span>
            </span>
          </div>
          <div className="prediction-box">
            <div>
              <div className="prediction-label zh">模型预测</div>
              <div className="prediction-label en">Model Prediction</div>
              <div className="prediction-value">
                <WinText zh="墨西哥胜 · 中等可信度" en="Mexico Win · Medium" />
              </div>
            </div>
            <div className="probability">56%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleSection({ stageView, setStageView }: { stageView: "group" | "knockout"; setStageView: (view: "group" | "knockout") => void }) {
  return (
    <section id="schedule">
      <div className="section-head">
        <div>
          <div className="section-kicker">
            <span className="zh">世界杯赛程</span>
            <span className="en">World Cup Coverage</span>
          </div>
          <h2>
            <span className="zh">赛程演化表</span>
            <span className="en">Schedule Evolution Board</span>
          </h2>
        </div>
        <p className="section-desc zh">从小组赛到淘汰赛，实时记录每场比赛的预测、结果与模型战绩。</p>
        <p className="section-desc en">
          From group stage to knockout stage, every match tracks predictions, results, and the live model record.
        </p>
      </div>

      <div className="schedule-shell">
        <div className="stage-switch" role="tablist" aria-label="Tournament stage">
          <button
            className={`stage-tab ${stageView === "group" ? "active" : ""}`}
            type="button"
            onClick={() => setStageView("group")}
          >
            <span className="zh">小组赛</span>
            <span className="en">Group Stage</span>
          </button>
          <button
            className={`stage-tab ${stageView === "knockout" ? "active" : ""}`}
            type="button"
            onClick={() => setStageView("knockout")}
          >
            <span className="zh">淘汰赛</span>
            <span className="en">Knockout Stage</span>
          </button>
        </div>

        <div id="group-stage-view" className={`stage-view ${stageView === "group" ? "active" : ""}`}>
          <div className="stage-summary">
            <div>
              <strong className="zh">小组赛 72 场 · 北京时间视图</strong>
              <strong className="en">72 group-stage matches · ET view</strong>
              <span className="zh">官方赛事日期 6月11日–6月27日；中文页面按北京时间显示，日期轨道覆盖 6月12日–6月28日。</span>
              <span className="en">Official match dates: Jun 11–Jun 27; English view renders the date rail in Eastern Time.</span>
            </div>
            <div className="stage-summary-note zh">横向滚动查看完整小组赛日期</div>
            <div className="stage-summary-note en">Scroll for the full group-stage timeline</div>
          </div>

          <div className="date-strip full-stage">
            {prototypeDateChips.map((chip, index) => (
              <div className={`date-chip ${index === 0 ? "active" : ""}`} key={`${chip.date.en}-${chip.date.zh}`}>
                <div className="weekday">
                  <Text value={chip.weekday} />
                </div>
                <div className="date">
                  <Text value={chip.date} />
                </div>
              </div>
            ))}
          </div>

          <div className="group-stage-grid">
            <div className="schedule-list">
              <div className="list-mode-note zh">
                当前显示北京时间所选日期的比赛；完整 72 场由真实赛程数据按语言时区切换渲染。
              </div>
              <div className="list-mode-note en">
                Showing selected-date matches in ET; all fixtures render from typed mock schedule data by locale timezone.
              </div>

              {prototypeScheduleSections.map((section) => (
                <div className="date-section" key={section.title.en}>
                  <div className="date-section-head">
                    <div className="date-section-title">
                      <Text value={section.title} />
                    </div>
                    <div className="date-section-sub">
                      <Text value={section.sub} />
                    </div>
                  </div>
                  {section.matches.map((match) => (
                    <div className="schedule-match" key={`${match.homeCode}-${match.awayCode}`}>
                      <div className="time-block">
                        <Text value={match.time} />
                        <div className="stage">
                          <Text value={match.group} />
                        </div>
                      </div>
                      <div className="versus">
                        <div className="team-row">
                          <span className="flag">{match.homeCode}</span>
                          <Text value={match.home} />
                        </div>
                        <div className="team-row">
                          <span className="flag">{match.awayCode}</span>
                          <Text value={match.away} />
                        </div>
                      </div>
                      <div className="prediction-pill">
                        <div className="small zh">模型预测</div>
                        <div className="small en">Model Prediction</div>
                        <div className="big">
                          <WinText zh={match.prediction.zh} en={match.prediction.en} />
                        </div>
                      </div>
                      <div className={`result-badge ${match.state}`}>
                        <Text value={match.stateLabel} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <aside className="group-table-panel">
              <div className="group-table-head">
                <span className="zh">A组积分</span>
                <span className="en">Group A Standings</span>
                <span className="zh">示例</span>
                <span className="en">Mock</span>
              </div>
              {[
                ["1", "墨西哥", "Mexico", "3", "+1", "W"],
                ["2", "加拿大", "Canada", "0", "0", "—"],
                ["3", "韩国", "Korea", "0", "0", "—"],
                ["4", "南非", "South Africa", "0", "-1", "L"],
              ].map(([rank, zhTeam, enTeam, points, diff, form]) => (
                <div className="standings-row" key={rank}>
                  <div className="rank">{rank}</div>
                  <div className="team">
                    <span className="zh">{zhTeam}</span>
                    <span className="en">{enTeam}</span>
                  </div>
                  <div className="num">{points}</div>
                  <div className="num">{diff}</div>
                  <div className="num">{form}</div>
                </div>
              ))}

              <div className="board-summary">
                <div className="summary-cell">
                  <strong>24</strong>
                  <span className="zh">已预测</span>
                  <span className="en">Predicted</span>
                </div>
                <div className="summary-cell">
                  <strong>16</strong>
                  <span className="zh">命中</span>
                  <span className="en">Correct</span>
                </div>
                <div className="summary-cell">
                  <strong>66.7%</strong>
                  <span className="zh">正确率</span>
                  <span className="en">Accuracy</span>
                </div>
              </div>

              <div className="legend-row">
                <span className="legend-item">
                  <span className="legend-dot correct" />
                  <span className="zh">命中</span>
                  <span className="en">Correct</span>
                </span>
                <span className="legend-item">
                  <span className="legend-dot missed" />
                  <span className="zh">失误</span>
                  <span className="en">Missed</span>
                </span>
                <span className="legend-item">
                  <span className="legend-dot" />
                  <span className="zh">未开赛</span>
                  <span className="en">Pending</span>
                </span>
              </div>
            </aside>
          </div>
        </div>

        <div id="knockout-stage-view" className={`stage-view ${stageView === "knockout" ? "active" : ""}`}>
          <div className="knockout-view">
            <div className="knockout-grid">
              <div className="knockout-round">
                <div className="knockout-round-title">
                  <span className="zh">32强</span>
                  <span className="en">Round of 32</span>
                </div>
                <div className="knockout-match correct">
                  <div className="knockout-meta">
                    <span className="zh">第73场</span>
                    <span className="en">Match 73</span>
                    <span className="zh">7月1日 北京时间</span>
                    <span className="en">Jun 30 ET</span>
                  </div>
                  <div className="knockout-team">
                    <span className="zh">A组第一</span>
                    <span className="en">Winner Group A</span>
                    <span>2</span>
                  </div>
                  <div className="knockout-team">
                    <span className="zh">B组第二</span>
                    <span className="en">Runner-up Group B</span>
                    <span>1</span>
                  </div>
                  <div className="knockout-prediction zh">模型预测：A组第一<span className="win-char">胜</span> · 命中 ✓</div>
                  <div className="knockout-prediction en">Model: Winner Group A <span className="win-char">Win</span> · Correct ✓</div>
                </div>
                <div className="knockout-match">
                  <div className="knockout-meta">
                    <span className="zh">第74场</span>
                    <span className="en">Match 74</span>
                    <span>TBD</span>
                  </div>
                  <div className="knockout-team tbd">
                    <span className="zh">C组第一</span>
                    <span className="en">Winner Group C</span>
                    <span>?</span>
                  </div>
                  <div className="knockout-team tbd">
                    <span className="zh">D组第二</span>
                    <span className="en">Runner-up Group D</span>
                    <span>?</span>
                  </div>
                </div>
              </div>

              {[
                ["16强", "Round of 16", "第89场胜者", "Match 89 winner"],
                ["四分之一决赛", "Quarterfinal", "第97场胜者", "Match 97 winner"],
                ["半决赛", "Semifinal", "第101场胜者", "Match 101 winner"],
                ["决赛", "Final", "TBD", "TBD"],
              ].map(([zhRound, enRound, zhSlot, enSlot], index) => (
                <div className="knockout-round" key={enRound}>
                  <div className="knockout-round-title">
                    <span className="zh">{zhRound}</span>
                    <span className="en">{enRound}</span>
                  </div>
                  <div className="knockout-match">
                    <div className="knockout-meta">
                      <span className="zh">第{89 + index * 4}场</span>
                      <span className="en">Match {89 + index * 4}</span>
                      <span>TBD</span>
                    </div>
                    <div className="knockout-team tbd">
                      <span className="zh">{zhSlot}</span>
                      <span className="en">{enSlot}</span>
                      <span>?</span>
                    </div>
                    <div className="knockout-team tbd">
                      <span>TBD</span>
                      <span>?</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaperBankrollSection() {
  const ledgerRows = [
    ["日期", "Date", "比赛", "Match", "模型预测", "Prediction", "模拟投入", "Stake", "纸面收益", "Paper profit"],
    ["6月12日", "Jun 11", "墨西哥 vs 南非", "Mexico vs South Africa", "墨西哥胜", "Mexico Win", "$10", "$10", "+$8", "+$8"],
    ["6月13日", "Jun 12", "韩国 vs 捷克", "Korea vs Czechia", "韩国胜", "Korea Win", "$12", "$12", "-$12", "-$12"],
    ["6月13日", "Jun 12", "加拿大 vs 波黑", "Canada vs Bosnia", "加拿大胜", "Canada Win", "$10", "$10", "+$16", "+$16"],
  ];

  return (
    <section id="paper-bankroll">
      <div className="section-head">
        <div>
          <div className="section-kicker">
            <span className="zh">模拟实盘</span>
            <span className="en">Paper Bankroll</span>
          </div>
          <h2>
            <span className="zh">模拟实盘展示</span>
            <span className="en">Paper Bankroll</span>
          </h2>
        </div>
        <p className="section-desc zh">只展示模型公开实验中的模拟收益、模拟投入、当前模拟回收和纸面收益率。</p>
        <p className="section-desc en">Only paper profit, paper stake, paper return, and paper ROI are shown.</p>
      </div>

      <div className="bankroll-shell">
        <div className="bankroll-card">
          <div>
            <div className="bankroll-label">
              <span className="zh">实时纸面收益</span>
              <span className="en">Live paper profit</span>
            </div>
            <div className="bankroll-value positive">+$128</div>
            <div className="bankroll-sub zh">所有结果均来自模拟账本，不代表真实资金结果。</div>
            <div className="bankroll-sub en">All results come from the paper ledger and do not represent real-money outcomes.</div>
          </div>
          <div className="bankroll-grid">
            <div className="bankroll-mini">
              <strong>$312</strong>
              <span className="zh">累计模拟投入</span>
              <span className="en">Paper stake</span>
            </div>
            <div className="bankroll-mini">
              <strong>$440</strong>
              <span className="zh">当前模拟回收</span>
              <span className="en">Paper return</span>
            </div>
            <div className="bankroll-mini">
              <strong>+41.0%</strong>
              <span className="zh">纸面收益率</span>
              <span className="en">Paper ROI</span>
            </div>
          </div>
        </div>

        <div className="ledger-table">
          {ledgerRows.map((row, index) => (
            <div className="ledger-row" key={`${row[0]}-${row[2]}-${index}`}>
              <div>
                <span className="zh">{row[0]}</span>
                <span className="en">{row[1]}</span>
              </div>
              <div className="ledger-match">
                <span className="zh">{row[2]}</span>
                <span className="en">{row[3]}</span>
              </div>
              <div>
                {index === 0 ? (
                  <>
                    <span className="zh">{row[4]}</span>
                    <span className="en">{row[5]}</span>
                  </>
                ) : (
                  <WinText zh={row[4]} en={row[5]} />
                )}
              </div>
              <div>
                <span className="zh">{row[6]}</span>
                <span className="en">{row[7]}</span>
              </div>
              <div className={index > 0 && row[8].startsWith("-") ? "ledger-loss" : "ledger-profit"}>
                <span className="zh">{row[8]}</span>
                <span className="en">{row[9]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimulatedWorldSection() {
  return (
    <section id="simulated">
      <div className="section-head">
        <div>
          <div className="section-kicker">
            <span className="zh">千场模拟</span>
            <span className="en">Simulation Runs</span>
          </div>
          <h2>
            <span className="zh">模拟世界里的 1000 场比赛</span>
            <span className="en">1,000 Matches in the Simulated World</span>
          </h2>
        </div>
      </div>

      <div className="sim-grid">
        {prototypeSimulationCards.map((card) => (
          <article className="sim-card" key={card.teams.en}>
            <div className="card-meta">
              <Text value={card.meta} />
            </div>
            <div className="card-teams">
              <Text value={card.teams} />
            </div>
            <div className="card-statement">
              <Text value={card.statement} />
            </div>

            <div className="simulation-block">
              <h4>
                <span className="zh">1000 场模拟结果</span>
                <span className="en">1,000 simulation results</span>
              </h4>
              <div className="simulation-bars">
                {card.rows.map((row) => (
                  <div className="bar-row" key={row.label.en}>
                    <Text value={row.label} />
                    <div className="bar">
                      <span style={{ width: `${row.value}%` }} />
                    </div>
                    <strong>{row.value}%</strong>
                  </div>
                ))}
              </div>
              <div className="progress-note">
                <Text value={card.status} />
              </div>
            </div>

            <div className="card-footer">
              {card.tags.map((tag) => (
                <span className="tag" key={`${card.teams.en}-${tag.en}`}>
                  <WinText zh={tag.zh} en={tag.en} />
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AgentSection() {
  return (
    <section id="model">
      <div className="section-head">
        <div>
          <div className="section-kicker">
            <span className="zh">AI 代理编排</span>
            <span className="en">Agent Orchestration</span>
          </div>
          <h2>
            <span className="zh">30 个 AI 代理，先争论，再预测</span>
            <span className="en">30 AI Agents Debate Before They Predict</span>
          </h2>
        </div>
        <p className="section-desc zh">5 个主 Agent 分析战术、节奏、风险、数据和控制信号；25 个副 Agent 负责反驳、校验和可信度修正。</p>
        <p className="section-desc en">
          Five lead agents analyze tactics, momentum, risk, data, and control signals; 25 sub-agents critique, validate,
          and calibrate confidence.
        </p>
      </div>

      <div className="agents">
        {prototypeAgents.map((agent) => (
          <div className="agent-card" key={agent.name}>
            <div>
              <div className="agent-name">{agent.name}</div>
              <div className="agent-desc">
                <Text value={agent.desc} />
              </div>
            </div>
            <div>
              <div className="subagent-label zh">5 个副 Agent 正在校验</div>
              <div className="subagent-label en">5 sub-agents validating</div>
              <div className="subagent-strip">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span className="subagent-dot" key={index} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EvolutionLogSection() {
  const logLoop = [...prototypeLogs, ...prototypeLogs];

  return (
    <section>
      <div className="section-head">
        <div>
          <div className="section-kicker">
            <span className="zh">演化日志</span>
            <span className="en">Evolution Log</span>
          </div>
          <h2>
            <span className="zh">模型更新日志</span>
            <span className="en">Model Evolution Log</span>
          </h2>
        </div>
        <p className="section-desc zh">每一次命中与失误，都会改变模型下一次的判断。</p>
        <p className="section-desc en">Every hit and every miss changes how the model sees the next match.</p>
      </div>

      <div className="log-ticker">
        <div className="log-track">
          {logLoop.map((log, index) => (
            <div className="log-card" key={`${log.time}-${index}`}>
              <div className="log-time">
                {log.time.split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
              <div className="log-text">
                <Text value={log.text} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModelEvolutionSection() {
  return (
    <section>
      <div className="section-head">
        <div>
          <div className="section-kicker">
            <span className="zh">模型说明</span>
            <span className="en">About the Model</span>
          </div>
          <h2>
            <span className="zh">模型如何演化</span>
            <span className="en">How the Model Evolves</span>
          </h2>
        </div>
        <p className="section-desc zh">一个有限世界模型，不是一次预测，而是一套持续推演、验证和修正的过程。</p>
        <p className="section-desc en">
          A bounded world model is not a single prediction, but a continuous process of simulation, verification, and
          revision.
        </p>
      </div>

      <div className="model-evolution">
        <div className="model-copy">
          <p className="hero-subtitle zh">
            不同代理在同一个有限世界里不断影响彼此，直到形成最终判断。比赛开始之前，模型已经在内部完成多轮推演与相互校正。
          </p>
          <p className="hero-subtitle en">
            Different agents influence one another inside the same bounded world until a final judgment emerges. Before
            kickoff, the model has already gone through multiple rounds of simulation and calibration.
          </p>
          <a className="button primary" href="#model">
            <span className="zh">查看完整模型</span>
            <span className="en">Explore the Model</span> →
          </a>
        </div>

        <div className="orbital-system" aria-label="Bounded world model orbital animation">
          <div className="pulse-line" />
          <div className="core">
            <span className="zh">
              有限世界模型
              <br />
              Bounded World Model
            </span>
            <span className="en">
              Bounded
              <br />
              World Model
            </span>
          </div>

          <div className="orbit-layer orbit-main">
            {[
              ["0deg", "战术", "Tactical"],
              ["72deg", "节奏", "Momentum"],
              ["144deg", "风险", "Risk"],
              ["216deg", "数据", "Data"],
              ["288deg", "控制", "Control"],
            ].map(([angle, zh, en]) => (
              <div className="main-node" style={{ "--a": angle } as React.CSSProperties} key={angle}>
                <span className="zh">{zh}</span>
                <span className="en">{en}</span>
              </div>
            ))}
          </div>

          <div className="orbit-layer orbit-micro">
            {Array.from({ length: 25 }).map((_, index) => (
              <span className="micro-dot" style={{ "--a": `${index * 14}deg` } as React.CSSProperties} key={index} />
            ))}
          </div>

          <div className="signal-label label-one">
            <span className="zh">反事实检查</span>
            <span className="en">Counterfactual check</span>
          </div>
          <div className="signal-label label-two">
            <span className="zh">可信度校正</span>
            <span className="en">Confidence calibration</span>
          </div>
          <div className="signal-label label-three">
            <span className="zh">风险扰动</span>
            <span className="en">Risk perturbation</span>
          </div>
          <div className="signal-label label-four">
            <span className="zh">路径分歧</span>
            <span className="en">Path divergence</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SharingCardsSection() {
  return (
    <section>
      <div className="section-head">
        <div>
          <div className="section-kicker">
            <span className="zh">社媒卡片</span>
            <span className="en">Social Cards</span>
          </div>
          <h2>
            <span className="zh">可保存的传播卡片</span>
            <span className="en">Saveable Sharing Cards</span>
          </h2>
        </div>
        <p className="section-desc zh">每日生成可下载卡片：当前连中、最高连中、下一场演化方向。</p>
        <p className="section-desc en">Daily export cards for current streak, best streak, and the next match direction.</p>
      </div>

      <div className="share-strip">
        <div className="share-card vertical" id="share-card-record">
          <div>
            <div className="share-brand-block">
              <div className="nira-wordmark">Nira.social</div>
              <div className="share-url">nira.social/worldcup2026</div>
            </div>
            <div style={{ height: 34 }} />
            <div className="share-title zh">连续预测正确</div>
            <div className="share-title en">Current correct streak</div>
          </div>

          <div>
            <div className="share-metric">
              4<span style={{ fontSize: ".32em", letterSpacing: "-.04em" }}> 场</span>
            </div>
            <div className="share-probability zh">当前正确率 66.7% · 最高连续正确 7 场</div>
            <div className="share-probability en">Current accuracy 66.7% · Best streak 7</div>

            <div className="share-mini-grid">
              <div className="share-mini">
                <strong>24</strong>
                <span className="zh">已预测</span>
                <span className="en">Predicted</span>
              </div>
              <div className="share-mini">
                <strong>16</strong>
                <span className="zh">命中</span>
                <span className="en">Correct</span>
              </div>
              <div className="share-mini">
                <strong>+$128</strong>
                <span className="zh">模拟收益</span>
                <span className="en">Paper profit</span>
              </div>
            </div>
          </div>

          <div className="share-card-footer">
            <span className="zh">2026 世界杯公开演化实验</span>
            <span className="en">World Cup 2026 public evolution experiment</span>
          </div>
        </div>

        <div className="share-card wide" id="share-card-next">
          <div>
            <div className="share-card-footer">
              <div className="share-brand-block">
                <div className="nira-wordmark">Nira.social</div>
                <div className="share-url">nira.social/worldcup2026</div>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#555" }}>NEXT SIMULATION</div>
            </div>
            <div style={{ height: 30 }} />
            <div className="share-title">
              <span className="zh">墨西哥 vs 南非</span>
              <span className="en">Mexico vs South Africa</span>
            </div>
          </div>

          <div>
            <div className="share-result">
              <WinText zh="墨西哥胜" en="Mexico Win" />
            </div>
            <div className="share-probability zh">演化方向 56% · 中等可信度 · 已完成 1000 场模拟</div>
            <div className="share-probability en">Direction 56% · Medium confidence · 1,000 simulations completed</div>

            <div className="share-mini-grid">
              <div className="share-mini">
                <strong>56%</strong>
                <span className="zh">胜向比例</span>
                <span className="en">Win direction</span>
              </div>
              <div className="share-mini">
                <strong>1000</strong>
                <span className="zh">模拟场次</span>
                <span className="en">Simulations</span>
              </div>
              <div className="share-mini">
                <strong>4</strong>
                <span className="zh">连续命中</span>
                <span className="en">Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="share-actions">
        <button className="share-action primary" type="button">
          <span className="zh">下载卡片 PNG</span>
          <span className="en">Download PNG</span>
        </button>
        <button className="share-action" type="button">
          <span className="zh">保存长图</span>
          <span className="en">Save long image</span>
        </button>
        <button className="share-action" type="button">
          <span className="zh">复制实验链接</span>
          <span className="en">Copy experiment link</span>
        </button>
        <button className="share-action" type="button">
          <span className="zh">生成今日小红书图</span>
          <span className="en">Generate Xiaohongshu card</span>
        </button>
      </div>
    </section>
  );
}

export default function WorldCup2026Page() {
  const [language, setLanguage] = useState<WorldCupLanguage>("zh");
  const [stageView, setStageView] = useState<"group" | "knockout">("group");

  useEffect(() => {
    setLanguage(detectInitialLanguage());
  }, []);

  useEffect(() => {
    document.body.classList.add("worldcup-body");
    return () => document.body.classList.remove("worldcup-body");
  }, []);

  const updateLanguage = (nextLanguage: WorldCupLanguage) => {
    setLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";

    try {
      window.localStorage.setItem(WORLD_CUP_LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      return;
    }
  };

  return (
    <main className={`worldcup-prototype language-${language}`}>
      <div className="page">
        <nav className="nav">
          <div className="brand">
            <div className="nira-logo-card">Nira</div>
            <div className="powered-badge">Powered by nira.social</div>
          </div>
          <div className="nav-links">
            <a href="#schedule">
              <span className="zh">赛程</span>
              <span className="en">Schedule</span>
            </a>
            <a href="#simulated">
              <span className="zh">模拟</span>
              <span className="en">Simulation</span>
            </a>
            <a href="#model">
              <span className="zh">模型</span>
              <span className="en">Model</span>
            </a>
            <LanguageButton active={language === "zh"} onClick={() => updateLanguage("zh")}>
              中文
            </LanguageButton>
            <LanguageButton active={language === "en"} onClick={() => updateLanguage("en")}>
              EN
            </LanguageButton>
          </div>
        </nav>

        <Hero />
        <ScheduleSection stageView={stageView} setStageView={setStageView} />
        <PaperBankrollSection />
        <SimulatedWorldSection />
        <AgentSection />
        <EvolutionLogSection />
        <ModelEvolutionSection />
        <SharingCardsSection />

        <footer className="footer">
          <div>Powered by Nira.social</div>
          <div>
            <span className="zh">nira.social/worldcup2026 · 北京时间视图</span>
            <span className="en">nira.social/worldcup2026 · ET view</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
