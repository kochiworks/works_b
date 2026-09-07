import { useState } from 'react'
import { BuildSummary } from './components/BuildSummary'
import { CandidateBoard } from './components/CandidateBoard'
import { MembershipGrid } from './components/MembershipGrid'
import { OperationPicker } from './components/OperationPicker'
import { OperationSummary } from './components/OperationSummary'
import { PresetScenarios } from './components/PresetScenarios'
import { RelationSummary } from './components/RelationSummary'
import { RelationVenn } from './components/RelationVenn'
import { SituationSelector } from './components/SituationSelector'
import { StageSelector } from './components/StageSelector'
import { useSetBuilder } from './hooks/useSetBuilder'
import { useSetLab } from './hooks/useSetLab'
import { findOperation } from './lib/operations'
import { classifyRelation } from './lib/relations'
import { STAGE_HINTS } from './lib/types'
import type { Stage } from './lib/types'
import type { PresetConfig } from './presets'
import './SetOperationsPage.css'

export function SetOperationsPage() {
  const [stage, setStage] = useState<Stage>('build')
  const [operationId, setOperationId] = useState('union')
  const builder = useSetBuilder()
  const lab = useSetLab()

  const operation = findOperation(operationId)
  const a = lab.elementsOf('A')
  const b = lab.elementsOf('B')
  const verdict = classifyRelation(a, b)

  const applyPreset = (config: PresetConfig) => {
    setStage(config.stage)
    if (config.situationId) builder.chooseSituation(config.situationId)
    if (config.membership) lab.applySpec(config.membership)
    if (config.operationId) setOperationId(config.operationId)
  }

  return (
    <div className="set-operations-page">
      <header className="page-intro">
        <h1>🧩 집합의 연산 탐구기</h1>
        <p className="subtitle">
          상황을 집합으로 나타내 보고, 두 집합의 포함 관계를 살핀 뒤, 합집합 · 교집합 · 차집합 · 여집합이 벤
          다이어그램의 어느 부분인지 직접 색칠해 확인해보세요.
        </p>
      </header>

      <PresetScenarios onApply={(preset) => applyPreset(preset.config)} />

      <StageSelector stage={stage} onChange={setStage} />
      <p className="hint stage-hint">{STAGE_HINTS[stage]}</p>

      {stage === 'build' && (
        <div className="explorer-layout">
          <div className="settings-column">
            <SituationSelector situationId={builder.situationId} onChange={builder.chooseSituation} />

            <section className="panel">
              <div className="panel-header">
                <h2>원소 고르기</h2>
                <button type="button" className="link-btn" onClick={builder.clear} disabled={builder.selected.length === 0}>
                  지우기
                </button>
              </div>
              <p className="hint situation-prompt">{builder.situation.prompt}</p>
              <CandidateBoard
                candidates={builder.situation.candidates}
                selected={builder.selected}
                verdict={builder.checked ? builder.feedback : null}
                onToggle={builder.toggle}
              />
              <div className="button-row">
                <button type="button" className="primary-btn" onClick={builder.check}>
                  확인하기
                </button>
                <button type="button" className="link-btn" onClick={builder.revealAnswer}>
                  정답 보기
                </button>
              </div>
            </section>
          </div>

          <div className="result-column">
            <BuildSummary
              situation={builder.situation}
              selected={builder.selected}
              checked={builder.checked}
              feedback={builder.feedback}
            />
          </div>
        </div>
      )}

      {stage === 'relation' && (
        <div className="explorer-layout">
          <div className="settings-column">
            <MembershipGrid
              universe={lab.universe}
              universeSize={lab.universeSize}
              membership={lab.membership}
              setCount={2}
              onToggle={lab.toggle}
              onSizeChange={lab.setUniverseSize}
              onClear={lab.clearSets}
            />
          </div>

          <div className="result-column">
            <section className="panel">
              <RelationVenn verdict={verdict} universe={lab.universe} membership={lab.membership} />
              <p className="hint">
                포함 관계에 따라 그림의 배치가 달라집니다. 한쪽이 다른 쪽을 모두 담고 있으면 원이 안쪽으로
                들어가고, 공통 원소가 없으면 두 원이 떨어집니다.
              </p>
            </section>
            <RelationSummary a={a} b={b} verdict={verdict} />
          </div>
        </div>
      )}

      {stage === 'operation' && (
        <div className="explorer-layout">
          <div className="settings-column">
            <OperationPicker operationId={operationId} onChange={setOperationId} />
            <MembershipGrid
              universe={lab.universe}
              universeSize={lab.universeSize}
              membership={lab.membership}
              setCount={operation.setCount}
              onToggle={lab.toggle}
              onSizeChange={lab.setUniverseSize}
              onClear={lab.clearSets}
            />
          </div>

          <div className="result-column">
            <OperationSummary operation={operation} universe={lab.universe} membership={lab.membership} />
          </div>
        </div>
      )}
    </div>
  )
}
