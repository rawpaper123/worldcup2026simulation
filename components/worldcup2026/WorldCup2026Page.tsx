"use client";

import { useEffect, useMemo, useState } from "react";
import { WORLD_CUP_2026_NEXT_MATCH_ID } from "@/lib/worldcup2026/fixtures";
import { worldCup2026AgentProfiles } from "@/lib/worldcup2026/agentDebates";
import { getWorldCup2026WorldState } from "@/lib/worldcup2026/simulationEngine";
import {
  buildGroupStageDateRail,
  formatFixtureRailParts,
  formatFixtureDateTitle,
  formatFixtureTime,
  formatTimestampForLocale,
  getFixturesForDisplayDate,
  getWorldCupTimeProfile,
} from "@/lib/worldcup2026/timezone";
import { WORLD_CUP_LANGUAGE_STORAGE_KEY } from "@/lib/worldcup2026/worldcupCopy";
import type {
  LocalizedText,
  TeamSlot,
  WorldCupLanguage,
  WorldCupMatch,
  WorldCupMatchStage,
} from "@/lib/worldcup2026/types";
import type {
  BoundedWorldState,
  MatchPrediction,
  PaperBankrollEntry,
  PredictionDirection,
  SimulationBatch,
} from "@/lib/worldcup2026/worldModelTypes";

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

function Text({ value }: { value: LocalizedText }) {
  return (
    <>
      <span className="zh">{value.zh}</span>
      <span className="en">{value.en}</span>
    </>
  );
}

function slotName(slot: TeamSlot, language: WorldCupLanguage) {
  if (slot.type === "team") return language === "zh" ? slot.nameZh ?? "" : slot.nameEn ?? "";
  return language === "zh" ? slot.placeholderZh ?? "TBD" : slot.placeholderEn ?? "TBD";
}

function slotCode(slot: TeamSlot) {
  return slot.code ?? "TBD";
}

function matchName(fixture: WorldCupMatch, language: WorldCupLanguage) {
  return `${slotName(fixture.teamA, language)} vs ${slotName(fixture.teamB, language)}`;
}

function directionSlot(fixture: WorldCupMatch, direction: PredictionDirection) {
  if (direction === "teamA_win") return fixture.teamA;
  if (direction === "teamB_win") return fixture.teamB;
  return undefined;
}

function directionLabel(
  fixture: WorldCupMatch,
  direction: PredictionDirection,
  language: WorldCupLanguage,
) {
  if (direction === "draw") return language === "zh" ? "平局" : "Draw";
  const team = directionSlot(fixture, direction);
  const name = team ? slotName(team, language) : "TBD";
  return language === "zh" ? `${name}胜` : `${name} Win`;
}

function confidenceLabel(confidence: string, language: WorldCupLanguage) {
  const zh = { low: "低可信度", medium: "中等可信度", high: "高可信度" };
  const en = { low: "Low", medium: "Medium", high: "High" };
  return language === "zh"
    ? zh[confidence as keyof typeof zh] ?? confidence
    : en[confidence as keyof typeof en] ?? confidence;
}

function directionPct(batch: SimulationBatch | undefined, direction: PredictionDirection) {
  if (!batch) return 0;
  if (direction === "teamA_win") return batch.aggregate.teamAWinPct;
  if (direction === "teamB_win") return batch.aggregate.teamBWinPct;
  return batch.aggregate.drawPct;
}

function stageLabel(stage: WorldCupMatchStage, language: WorldCupLanguage) {
  const labels: Record<WorldCupMatchStage, LocalizedText> = {
    group: { zh: "小组赛", en: "Group Stage" },
    round_of_32: { zh: "32强", en: "Round of 32" },
    round_of_16: { zh: "16强", en: "Round of 16" },
    quarter_final: { zh: "四分之一决赛", en: "Quarterfinal" },
    semi_final: { zh: "半决赛", en: "Semifinal" },
    third_place: { zh: "季军赛", en: "Third Place" },
    final: { zh: "决赛", en: "Final" },
  };

  return labels[stage][language];
}

function formatCurrency(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
}

function formatStake(value: number) {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
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

function DateChip({
  active,
  bucketKey,
  language,
  sampleUtc,
  onClick,
}: {
  active: boolean;
  bucketKey: string;
  language: WorldCupLanguage;
  sampleUtc: string;
  onClick: () => void;
}) {
  const railDate = formatFixtureRailParts(sampleUtc, language);

  return (
    <button
      aria-selected={active}
      className={`date-chip ${active ? "active" : ""}`}
      key={bucketKey}
      onClick={onClick}
      role="tab"
      type="button"
    >
      <div className="weekday">{railDate.weekday}</div>
      <div className="date">{railDate.date}</div>
    </button>
  );
}

function Hero({ worldState }: { worldState: BoundedWorldState }) {
  const record = worldState.modelRecord;
  const nextFixture =
    worldState.fixtures.find((fixture) => fixture.id === WORLD_CUP_2026_NEXT_MATCH_ID) ??
    worldState.fixtures[0];
  const nextPrediction =
    worldState.predictions.find((prediction) => prediction.matchId === nextFixture.id) ??
    worldState.predictions[0];
  const nextBatch = worldState.simulationBatches.find(
    (batch) => batch.matchId === nextFixture.id,
  );
  const probability = nextPrediction ? directionPct(nextBatch, nextPrediction.direction) : 0;
  const zhDirection = nextPrediction
    ? `${directionLabel(nextFixture, nextPrediction.direction, "zh")} · ${confidenceLabel(nextPrediction.confidenceLabel, "zh")}`
    : "TBD";
  const enDirection = nextPrediction
    ? `${directionLabel(nextFixture, nextPrediction.direction, "en")} · ${confidenceLabel(nextPrediction.confidenceLabel, "en")}`
    : "TBD";

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
              <div className="accuracy">{record.accuracy.toFixed(1)}%</div>
            </div>
            <div className="streak-panel">
              <div className="streak-main">
                <span className="zh">连续预测正确</span>
                <span className="en">Current correct streak</span> <strong>{record.currentCorrectStreak}</strong>{" "}
                <span className="zh">场</span>
                <span className="en">matches</span>
              </div>
              <div className="streak-sub">
                <span className="zh">最高连续正确 {record.bestCorrectStreak} 场</span>
                <span className="en">Best streak: {record.bestCorrectStreak} matches</span>
              </div>
            </div>
          </div>

          <div className="record-grid">
            <div className="mini-stat">
              <div className="value">{record.predictedCount}</div>
              <div className="label zh">已预测</div>
              <div className="label en">Predicted</div>
            </div>
            <div className="mini-stat">
              <div className="value">{record.correctCount}</div>
              <div className="label zh">预测正确</div>
              <div className="label en">Correct</div>
            </div>
            <div className="mini-stat">
              <div className="value">{record.totalMatches}</div>
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
              <div className="game-time zh">
                {nextFixture.group ? `${nextFixture.group}组 · ` : ""}
                {formatTimestampForLocale(nextFixture.kickoffUtc, "zh")}
              </div>
              <div className="game-time en">
                {nextFixture.group ? `Group ${nextFixture.group} · ` : ""}
                {formatTimestampForLocale(nextFixture.kickoffUtc, "en")}
              </div>
              <div className="teams">
                <span className="zh">
                  {slotName(nextFixture.teamA, "zh")} <span className="vs">vs</span>{" "}
                  {slotName(nextFixture.teamB, "zh")}
                </span>
                <span className="en">
                  {slotName(nextFixture.teamA, "en")} <span className="vs">vs</span>{" "}
                  {slotName(nextFixture.teamB, "en")}
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
                <WinText zh={zhDirection} en={enDirection} />
              </div>
            </div>
            <div className="probability">{probability}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleSection({
  language,
  worldState,
  stageView,
  setStageView,
}: {
  language: WorldCupLanguage;
  worldState: BoundedWorldState;
  stageView: "group" | "knockout";
  setStageView: (view: "group" | "knockout") => void;
}) {
  const [selectedGroupDateKey, setSelectedGroupDateKey] = useState("");
  const groupFixtures = useMemo(
    () => worldState.fixtures.filter((fixture) => fixture.stage === "group"),
    [worldState.fixtures],
  );
  const knockoutFixtures = useMemo(
    () => worldState.fixtures.filter((fixture) => fixture.stage !== "group"),
    [worldState.fixtures],
  );
  const dateRail = useMemo(
    () => buildGroupStageDateRail(groupFixtures, language),
    [groupFixtures, language],
  );
  const selectedDateBucket = dateRail.find((bucket) => bucket.key === selectedGroupDateKey);
  const selectedFixtures = selectedGroupDateKey
    ? getFixturesForDisplayDate(groupFixtures, selectedGroupDateKey, language)
    : [];
  const predictionByMatch = useMemo(
    () => new Map(worldState.predictions.map((prediction) => [prediction.matchId, prediction])),
    [worldState.predictions],
  );
  const batchByMatch = useMemo(
    () => new Map(worldState.simulationBatches.map((batch) => [batch.matchId, batch])),
    [worldState.simulationBatches],
  );
  const groupATeams = groupFixtures
    .filter((fixture) => fixture.group === "A")
    .flatMap((fixture) => [fixture.teamA, fixture.teamB])
    .filter((slot, index, slots) => slots.findIndex((item) => slotCode(item) === slotCode(slot)) === index)
    .slice(0, 4);
  const knockoutStageOrder: WorldCupMatchStage[] = [
    "round_of_32",
    "round_of_16",
    "quarter_final",
    "semi_final",
    "third_place",
    "final",
  ];
  const knockoutRounds: Array<{ stage: WorldCupMatchStage; matches: WorldCupMatch[] }> = knockoutStageOrder.map((stage) => ({
    stage,
    matches: knockoutFixtures.filter((fixture) => fixture.stage === stage),
  }));

  useEffect(() => {
    if (!dateRail.length) return;
    const hasActiveDate = dateRail.some((bucket) => bucket.key === selectedGroupDateKey);
    if (!hasActiveDate) setSelectedGroupDateKey(dateRail[0].key);
  }, [dateRail, selectedGroupDateKey]);

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

          <div className="date-strip full-stage" role="tablist" aria-label="Group stage dates">
            {dateRail.map((bucket) => (
              <DateChip
                active={selectedGroupDateKey === bucket.key}
                bucketKey={bucket.key}
                key={bucket.key}
                language={language}
                sampleUtc={bucket.sampleUtc}
                onClick={() => setSelectedGroupDateKey(bucket.key)}
              />
            ))}
          </div>

          <div className="group-stage-grid">
            <div className="schedule-list">
              <div className="list-mode-note zh">
                当前显示北京时间所选日期的比赛；完整 72 场由真实赛程数据按语言时区切换渲染。
              </div>
              <div className="list-mode-note en">
                Showing selected-date matches in ET; all 72 fixtures render from real schedule data by locale timezone.
              </div>

              {selectedDateBucket ? (
                <div className="date-section" key={selectedDateBucket.key}>
                  <div className="date-section-head">
                    <div className="date-section-title">
                      {formatFixtureDateTitle(selectedDateBucket.sampleUtc, language)}
                    </div>
                    <div className="date-section-sub">
                      {selectedFixtures.length} {language === "zh" ? "场比赛" : selectedFixtures.length === 1 ? "match" : "matches"}
                    </div>
                  </div>
                  {selectedFixtures.map((match) => {
                    const prediction = predictionByMatch.get(match.id);
                    const batch = batchByMatch.get(match.id);
                    const predictedDirection = prediction?.direction ?? batch?.currentDirection;
                    const predictedPct = predictedDirection ? directionPct(batch, predictedDirection) : 0;

                    return (
                    <div className="schedule-match" key={match.id}>
                      <div className="time-block">
                        {formatFixtureTime(match.kickoffUtc, language)}
                        <div className="stage">
                          {language === "zh" ? `${match.group}组` : `Group ${match.group}`}
                        </div>
                      </div>
                      <div className="versus">
                        <div className="team-row">
                          <span className="flag">{slotCode(match.teamA)}</span>
                          {slotName(match.teamA, language)}
                        </div>
                        <div className="team-row">
                          <span className="flag">{slotCode(match.teamB)}</span>
                          {slotName(match.teamB, language)}
                        </div>
                      </div>
                      <div className="prediction-pill">
                        <div className="small zh">模型预测</div>
                        <div className="small en">Model Prediction</div>
                        <div className="big">
                          {predictedDirection ? (
                            <WinText
                              zh={`${directionLabel(match, predictedDirection, "zh")} · ${predictedPct}%`}
                              en={`${directionLabel(match, predictedDirection, "en")} · ${predictedPct}%`}
                            />
                          ) : (
                            <Text value={{ zh: "待生成", en: "Pending" }} />
                          )}
                        </div>
                      </div>
                      <div className={`result-badge ${prediction?.settledCorrect ? "correct" : "pending"}`}>
                        {prediction?.settledCorrect ? (
                          <Text value={{ zh: "命中 ✓", en: "Correct ✓" }} />
                        ) : (
                          <Text value={{ zh: "未开赛", en: "Pending" }} />
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="date-section date-section-empty" key={selectedGroupDateKey || "empty"}>
                  <div className="date-section-head">
                    <div className="date-section-title">
                      TBD
                    </div>
                    <div className="date-section-sub">
                      <Text value={{ zh: "TBD", en: "Fixture slate pending" }} />
                    </div>
                  </div>
                  <div className="schedule-match schedule-match-empty">
                    <div className="time-block">
                      <span className="zh">--:--</span>
                      <span className="en">--:--</span>
                      <div className="stage">
                        <Text value={{ zh: "TBD", en: "Group Stage" }} />
                      </div>
                    </div>
                    <div className="versus">
                      <div className="team-row">
                        <span className="flag">TBD</span>
                        <Text value={{ zh: "TBD", en: "To be determined" }} />
                      </div>
                    </div>
                    <div className="prediction-pill">
                      <div className="small zh">模型预测</div>
                      <div className="small en">Model Prediction</div>
                      <div className="big">
                        <Text value={{ zh: "Pending", en: "Pending" }} />
                      </div>
                    </div>
                    <div className="result-badge tbd">
                      <span className="zh">TBD</span>
                      <span className="en">TBD</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="group-table-panel">
              <div className="group-table-head">
                <span className="zh">A组球队</span>
                <span className="en">Group A Teams</span>
                <span className="zh">赛程数据</span>
                <span className="en">Fixture data</span>
              </div>
              {groupATeams.map((team, index) => (
                <div className="standings-row" key={slotCode(team)}>
                  <div className="rank">{index + 1}</div>
                  <div className="team">
                    <span className="zh">{slotName(team, "zh")}</span>
                    <span className="en">{slotName(team, "en")}</span>
                  </div>
                  <div className="num">{slotCode(team)}</div>
                  <div className="num">3</div>
                  <div className="num">—</div>
                </div>
              ))}

              <div className="board-summary">
                <div className="summary-cell">
                  <strong>{worldState.modelRecord.predictedCount}</strong>
                  <span className="zh">已预测</span>
                  <span className="en">Predicted</span>
                </div>
                <div className="summary-cell">
                  <strong>{worldState.modelRecord.correctCount}</strong>
                  <span className="zh">命中</span>
                  <span className="en">Correct</span>
                </div>
                <div className="summary-cell">
                  <strong>{worldState.modelRecord.accuracy.toFixed(1)}%</strong>
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
              {knockoutRounds.map((round) => (
                <div className="knockout-round" key={round.stage}>
                  <div className="knockout-round-title">
                    {stageLabel(round.stage, language)}
                  </div>
                  {round.matches.map((match) => (
                    <div className="knockout-match" key={match.id}>
                      <div className="knockout-meta">
                        <span className="zh">第{match.matchNumber}场</span>
                        <span className="en">Match {match.matchNumber}</span>
                        <span>{formatFixtureDateTitle(match.kickoffUtc, language)}</span>
                      </div>
                      <div className="knockout-team tbd">
                        <span>{slotName(match.teamA, language)}</span>
                        <span>?</span>
                      </div>
                      <div className="knockout-team tbd">
                        <span>{slotName(match.teamB, language)}</span>
                        <span>?</span>
                      </div>
                      <div className="knockout-prediction">
                        {match.city} · {match.country}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaperBankrollSection({ worldState }: { worldState: BoundedWorldState }) {
  const fixtureById = new Map(worldState.fixtures.map((fixture) => [fixture.id, fixture]));
  const predictionById = new Map(worldState.predictions.map((prediction) => [prediction.predictionId, prediction]));
  const bankroll = worldState.paperBankroll;

  function ledgerCells(entry: PaperBankrollEntry) {
    const fixture = fixtureById.get(entry.matchId);
    const prediction = predictionById.get(entry.predictionId);
    const timestamp = entry.settledAt ?? fixture?.kickoffUtc ?? worldState.generatedAt;
    const direction = fixture && prediction ? prediction.direction : "draw";

    return {
      dateZh: formatTimestampForLocale(timestamp, "zh"),
      dateEn: formatTimestampForLocale(timestamp, "en"),
      matchZh: fixture ? matchName(fixture, "zh") : entry.matchId,
      matchEn: fixture ? matchName(fixture, "en") : entry.matchId,
      predictionZh: fixture ? directionLabel(fixture, direction, "zh") : "TBD",
      predictionEn: fixture ? directionLabel(fixture, direction, "en") : "TBD",
      stake: formatStake(entry.stake),
      profit: entry.result === "pending" ? "Pending" : formatCurrency(entry.profit),
    };
  }

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
            <div className={`bankroll-value ${bankroll.cumulativeProfit >= 0 ? "positive" : ""}`}>
              {formatCurrency(bankroll.cumulativeProfit)}
            </div>
            <div className="bankroll-sub zh">所有结果均来自模拟账本，不代表真实资金结果。</div>
            <div className="bankroll-sub en">All results come from the paper ledger and do not represent real-money outcomes.</div>
          </div>
          <div className="bankroll-grid">
            <div className="bankroll-mini">
              <strong>{formatStake(bankroll.cumulativeStake)}</strong>
              <span className="zh">累计模拟投入</span>
              <span className="en">Paper stake</span>
            </div>
            <div className="bankroll-mini">
              <strong>{formatStake(bankroll.cumulativeReturn)}</strong>
              <span className="zh">当前模拟回收</span>
              <span className="en">Paper return</span>
            </div>
            <div className="bankroll-mini">
              <strong>{`${bankroll.roi >= 0 ? "+" : ""}${(bankroll.roi * 100).toFixed(1)}%`}</strong>
              <span className="zh">纸面收益率</span>
              <span className="en">Paper ROI</span>
            </div>
          </div>
        </div>

        <div className="ledger-table">
          <div className="ledger-row">
            <div>
              <span className="zh">日期</span>
              <span className="en">Date</span>
            </div>
            <div className="ledger-match">
              <span className="zh">比赛</span>
              <span className="en">Match</span>
            </div>
            <div>
              <span className="zh">模型预测</span>
              <span className="en">Prediction</span>
            </div>
            <div>
              <span className="zh">模拟投入</span>
              <span className="en">Stake</span>
            </div>
            <div>
              <span className="zh">纸面收益</span>
              <span className="en">Paper profit</span>
            </div>
          </div>
          {bankroll.entries.map((entry) => {
            const row = ledgerCells(entry);

            return (
            <div className="ledger-row" key={`${entry.matchId}-${entry.predictionId}`}>
              <div>
                <span className="zh">{row.dateZh}</span>
                <span className="en">{row.dateEn}</span>
              </div>
              <div className="ledger-match">
                <span className="zh">{row.matchZh}</span>
                <span className="en">{row.matchEn}</span>
              </div>
              <div>
                <WinText zh={row.predictionZh} en={row.predictionEn} />
              </div>
              <div>
                {row.stake}
              </div>
              <div className={entry.profit < 0 ? "ledger-loss" : "ledger-profit"}>
                {row.profit}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SimulatedWorldSection({ worldState }: { worldState: BoundedWorldState }) {
  const fixtureById = new Map(worldState.fixtures.map((fixture) => [fixture.id, fixture]));

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
        {worldState.simulationBatches.map((batch) => {
          const fixture = fixtureById.get(batch.matchId);
          if (!fixture) return null;
          const statusText: LocalizedText =
            batch.status === "completed"
              ? {
                  zh: `模拟状态：已完成 · 最近更新：${formatTimestampForLocale(batch.lastUpdatedAt, "zh")}`,
                  en: `Status: completed · Last updated: ${formatTimestampForLocale(batch.lastUpdatedAt, "en")}`,
                }
              : {
                  zh: `已完成 ${batch.completedRuns} / ${batch.targetRuns} 场 · 最近更新：${formatTimestampForLocale(batch.lastUpdatedAt, "zh")}`,
                  en: `Completed ${batch.completedRuns} / ${batch.targetRuns} runs · Last updated: ${formatTimestampForLocale(batch.lastUpdatedAt, "en")}`,
                };
          const statement: LocalizedText =
            batch.status === "completed"
              ? { zh: "已在模拟世界里跑完 1000 场。", en: "Completed 1,000 simulated matches." }
              : { zh: "阶段性模拟结果仍在校准。", en: "Interim simulation result still calibrating." };
          const directionZh = directionLabel(fixture, batch.currentDirection, "zh");
          const directionEn = directionLabel(fixture, batch.currentDirection, "en");
          const directionValue = directionPct(batch, batch.currentDirection);

          return (
          <article className="sim-card" key={batch.batchId}>
            <div className="card-meta">
              <span className="zh">
                {fixture.group ? `${fixture.group}组 · ` : ""}
                {formatTimestampForLocale(fixture.kickoffUtc, "zh")}
              </span>
              <span className="en">
                {fixture.group ? `Group ${fixture.group} · ` : ""}
                {formatTimestampForLocale(fixture.kickoffUtc, "en")}
              </span>
            </div>
            <div className="card-teams">
              <span className="zh">{matchName(fixture, "zh")}</span>
              <span className="en">{matchName(fixture, "en")}</span>
            </div>
            <div className="card-statement">
              <Text value={statement} />
            </div>

            <div className="simulation-block">
              <h4>
                <span className="zh">1000 场模拟结果</span>
                <span className="en">1,000 simulation results</span>
              </h4>
              <div className="simulation-bars">
                {[
                  { label: { zh: slotName(fixture.teamA, "zh"), en: slotName(fixture.teamA, "en") }, value: batch.aggregate.teamAWinPct },
                  { label: { zh: "平局", en: "Draw" }, value: batch.aggregate.drawPct },
                  { label: { zh: slotName(fixture.teamB, "zh"), en: slotName(fixture.teamB, "en") }, value: batch.aggregate.teamBWinPct },
                ].map((row) => (
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
                <Text value={statusText} />
              </div>
            </div>

            <div className="card-footer">
              <span className="tag">
                <WinText zh={directionZh} en={directionEn} />
              </span>
              <span className="tag">{directionValue}%</span>
              <span className="tag">
                <span className="zh">{confidenceLabel(batch.confidenceLabel, "zh")}</span>
                <span className="en">{confidenceLabel(batch.confidenceLabel, "en")}</span>
              </span>
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

function AgentSection({ worldState }: { worldState: BoundedWorldState }) {
  const activeDebate = worldState.agentDebates[0];

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
        {worldCup2026AgentProfiles.map((agent) => (
          <div className="agent-card" key={agent.name}>
            <div>
              <div className="agent-name">{agent.name}</div>
              <div className="agent-desc">
                <Text value={agent.role} />
              </div>
            </div>
            <div>
              <div className="subagent-label zh">5 个副 Agent 正在校验</div>
              <div className="subagent-label en">5 sub-agents validating</div>
              <div className="subagent-strip">
                {Array.from({ length: agent.subAgentCount }).map((_, index) => (
                  <span className="subagent-dot" key={index} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {activeDebate ? (
        <p className="section-desc zh" style={{ marginTop: 18 }}>
          {activeDebate.summaryZh}
        </p>
      ) : null}
      {activeDebate ? (
        <p className="section-desc en" style={{ marginTop: 18 }}>
          {activeDebate.summaryEn}
        </p>
      ) : null}
    </section>
  );
}

function EvolutionLogSection({ worldState }: { worldState: BoundedWorldState }) {
  const logLoop = [...worldState.evolutionLogs, ...worldState.evolutionLogs];

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
            <div className="log-card" key={`${log.id}-${index}`}>
              <div className="log-time">
                <span className="zh">{formatTimestampForLocale(log.timestamp, "zh")}</span>
                <span className="en">{formatTimestampForLocale(log.timestamp, "en")}</span>
              </div>
              <div className="log-text">
                <span className="zh">{log.textZh}</span>
                <span className="en">{log.textEn}</span>
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

function SharingCardsSection({ worldState }: { worldState: BoundedWorldState }) {
  const record = worldState.modelRecord;
  const nextFixture =
    worldState.fixtures.find((fixture) => fixture.id === WORLD_CUP_2026_NEXT_MATCH_ID) ??
    worldState.fixtures[0];
  const nextPrediction =
    worldState.predictions.find((prediction) => prediction.matchId === nextFixture.id) ??
    worldState.predictions[0];
  const nextBatch = worldState.simulationBatches.find((batch) => batch.matchId === nextFixture.id);
  const nextDirection = nextPrediction?.direction ?? nextBatch?.currentDirection ?? "teamA_win";
  const nextDirectionPct = directionPct(nextBatch, nextDirection);

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
              {record.currentCorrectStreak}<span style={{ fontSize: ".32em", letterSpacing: "-.04em" }}> 场</span>
            </div>
            <div className="share-probability zh">
              当前正确率 {record.accuracy.toFixed(1)}% · 最高连续正确 {record.bestCorrectStreak} 场
            </div>
            <div className="share-probability en">
              Current accuracy {record.accuracy.toFixed(1)}% · Best streak {record.bestCorrectStreak}
            </div>

            <div className="share-mini-grid">
              <div className="share-mini">
                <strong>{record.predictedCount}</strong>
                <span className="zh">已预测</span>
                <span className="en">Predicted</span>
              </div>
              <div className="share-mini">
                <strong>{record.correctCount}</strong>
                <span className="zh">命中</span>
                <span className="en">Correct</span>
              </div>
              <div className="share-mini">
                <strong>{formatCurrency(worldState.paperBankroll.cumulativeProfit)}</strong>
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
              <span className="zh">{matchName(nextFixture, "zh")}</span>
              <span className="en">{matchName(nextFixture, "en")}</span>
            </div>
          </div>

          <div>
            <div className="share-result">
              <WinText
                zh={directionLabel(nextFixture, nextDirection, "zh")}
                en={directionLabel(nextFixture, nextDirection, "en")}
              />
            </div>
            <div className="share-probability zh">
              演化方向 {nextDirectionPct}% · {confidenceLabel(nextPrediction?.confidenceLabel ?? "medium", "zh")} · 已完成 {nextBatch?.completedRuns ?? 0} 场模拟
            </div>
            <div className="share-probability en">
              Direction {nextDirectionPct}% · {confidenceLabel(nextPrediction?.confidenceLabel ?? "medium", "en")} · {nextBatch?.completedRuns ?? 0} simulations completed
            </div>

            <div className="share-mini-grid">
              <div className="share-mini">
                <strong>{nextDirectionPct}%</strong>
                <span className="zh">胜向比例</span>
                <span className="en">Win direction</span>
              </div>
              <div className="share-mini">
                <strong>{nextBatch?.targetRuns ?? 1000}</strong>
                <span className="zh">模拟场次</span>
                <span className="en">Simulations</span>
              </div>
              <div className="share-mini">
                <strong>{record.currentCorrectStreak}</strong>
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
  const worldState = useMemo(() => getWorldCup2026WorldState(), []);

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

        <Hero worldState={worldState} />
        <ScheduleSection
          language={language}
          stageView={stageView}
          setStageView={setStageView}
          worldState={worldState}
        />
        <PaperBankrollSection worldState={worldState} />
        <SimulatedWorldSection worldState={worldState} />
        <AgentSection worldState={worldState} />
        <EvolutionLogSection worldState={worldState} />
        <ModelEvolutionSection />
        <SharingCardsSection worldState={worldState} />

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
