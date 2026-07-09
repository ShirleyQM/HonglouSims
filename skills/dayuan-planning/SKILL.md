---
name: dayuan-planning
description: Project-specific planning/configuration skill for 大观园模拟. Use when Codex needs to turn策划 ideas, tables, CSV, spreadsheets, or natural-language notes into game config for personality traits, character specialties, social interactions, interaction categories, identity etiquette, multi-person reactions, need/state bands, visible states, and related PRD updates without requiring the user to remember implementation fields.
---

# Dayuan Planning

Use this skill as the unified策划配置 workflow for 大观园模拟. Prefer this over separate trait/interaction/state skills when the user's idea crosses systems.

## Core rule

Translate策划 language into current runtime-supported fields. Do not invent a field and present it as working unless the current JS interpreter reads it. If the design needs new runtime support, either implement that support or mark it clearly as `needs runtime support`.

Before editing, read only the relevant project context once:

- Personality/traits: `prd/持续更新_01性格.md`, `js/config.js` around `charSpecialtyConfig`, and `js/systems/trait-effects.js`.
- Interactions/social: `prd/持续更新_07社交互动与对话.md`, `prd/持续更新_08身份礼法与场景权限.md` when礼法/身份 is involved, and config blocks in `js/config.js`.
- Needs/states: `js/config.js` for `needDefs` / `stateDefs`, plus `js/systems/state-defs.js` when injected states matter.
- Architecture changes: update `prd/系统架构依赖图.md` when adding or changing cross-system dependencies.

If the user asks only for a design draft, do not edit files unless requested.

## Shared workflow

1. Parse the idea into rows.
   Capture Chinese name, purpose, target system, trigger, effect, UI visibility, AI eligibility, risk, and whether it is runtime-supported.

2. Deduplicate before creating.
   Match by exact id, same Chinese name, same category plus similar purpose, same trigger/effect, or same observer/risk rule. Prefer updating existing rows over creating near-duplicates.

3. Choose stable IDs.
   Use ASCII semantic IDs. For traits use pinyin-like lowercase or snake case. For character specialties use scoped IDs such as `baochai.mediate` when useful. For interaction templates follow existing numeric ranges. For states use lowerCamelCase or existing prefixes such as `needMoodCritical`.

4. Keep ordinary planning fields flat.
   Do not hide normal editable fields inside JSON. Use JSON only for nested runtime conditions/effects that are actually structured.

5. Preserve current runtime boundaries.
   Patch config minimally. Preserve unrelated order and user changes. Update PRDs as current state, not changelog appendices.

6. Report clearly.
   Return created/updated counts, IDs chosen, assignments changed, skipped duplicates, runtime gaps, and files changed.

## Personality and specialties

Use `CONFIG.charSpecialtyConfig.traitMetadata` for reusable traits and `specialtyMetadata` for character-specific hooks.

Common trait fields:

```js
id: {
  label: '中文名',
  oppositeTrait: 'paired_id_or_null',
  category: '性情' | '习惯' | '处世',
  description: '策划描述',
  effectExamples: ['策划可读效果摘要'],
  effects: {}
}
```

Specialty fields:

```js
id: {
  ownerId: 'charId',
  label: '中文名',
  category: '专属性格',
  description: '人物独有行为钩子',
  systems: ['AI权重', '状态'],
  effectExamples: ['某类候选 x1.4'],
  effects: {}
}
```

Supported effect groups:

- `actionWeights`
- `needCoeffs`
- `needThresholds`
- `stateChance`
- `stateDuration`
- `stateRecovery`
- `relation`
- `social`
- `quest`
- `movement`
- `memory`
- `money`
- `competition`
- `furnitureNeeds`

Rules:

- Categories are exactly `性情`, `习惯`, `处世`; normalize old labels to these.
- Keep multipliers moderate: common `0.6-1.6`, strong `1.8-2.2` only for narrow cases.
- If creating opposite traits, link both sides symmetrically.
- Do not assign traits to characters unless requested or clearly implied.
- Sync display labels when the current config maintains `traitLabels`.

## Interactions and social systems

Use this section for:

- `interactionCategories`
- `interactionTemplates`
- `interactionSocialConfig`
- `interactionDepthConfig`
- `identityProtocolConfig`
- `multiInteractConfig`
- LLM dialogue prompt tags and fallback lines

Current primary interaction categories:

- `weijie` / 宽慰
- `xujiu` / 闲谈
- `lundao` / 论艺
- `chuanqing` / 传情
- `tiaoxiao` / 玩笑
- `zhengchi` / 争执

For every interaction template decide:

- `category`: menu group and AI semantic group.
- `type`: `dialogue` or `action`.
- `relMin` / `relMax`: soft relationship range.
- `axisReq` / `unlock_conditions`: hard or soft gates.
- `contact_type`: use existing values such as `none`, `touch`, `embrace`, `kiss`, `massage`.
- `effects`: needs, states, memory, or legacy relation effects.
- `axisEffects`: relationship axes, including directional `submission` when needed.
- `onLowScore`: low willingness result and custom failure lines.
- `risky_details`: etiquette/risk result, witnessed failure lines, repeat failure lines.
- `lines`: non-LLM fallback dialogue.
- `llmPrompt`: style/topic tags.
- AI eligibility: player-only, NPC-pickable, quest-triggered, or observer-triggered.

Failure-depth rules:

- Repeated failure may create visible states such as `awkward`（尴尬）, `heartbroken`（心碎）, `sullenAnger`（愠怒）.
- Prefer `sullenAnger` before hard `angry`.
- Gate `heartbroken` mostly to intimate/传情-like contexts.
- Public or witnessed failure should use stronger heat/text than private failure.
- If escalation forces an interaction, ensure the target template exists and suits the responder.

Multi-person reaction checklist:

- Observer filters: character, trait, role, status, relation.
- Observed filters: character, trait, role, relation.
- Trigger: use supported signals such as `interaction`, `interaction_started`, `status_gained`, `status_tag`, `action_tag`, `idle`, `scene_enter`, `scene_enter_unauthorized`, `need_critical`.
- Reaction: use supported types such as `send_bubble`, `add_status`, `relation_shift`, `boost_action`, `issue_quest`, `force_interaction`, `take_over_task`, `flee_scene`.
- Always set cooldown and priority to prevent spam.
- Always include non-LLM fallback text for player-visible reactions.

Identity etiquette checklist:

- Rank relation examples: `peer`, `master_to_servant`, `servant_to_master`, `senior_servant_to_junior`, `junior_to_senior_servant`, `parent_to_child`, `child_to_parent`, `grandparent_to_child`, `outsider`.
- Behavior must be `allowed`, `conditional`, `risky`, or `forbidden`.
- Prefer `risky` with consequences over `forbidden` when drama is desirable.
- Contact rules are independent from category rules and may override them.

## Needs and states

Use this section for:

- `needDefs`
- `needDefs[].stateBands`
- `stateDefs`
- `trigger_ext`
- `effect_ext`
- States triggered by interactions, furniture, tasks, routine, story, or needs.

State fields:

```js
stateId: {
  name: '中文短名',
  category: 'needBand',
  duration: 60,
  desc: '玩家可读说明',
  polarity: 'negative' | 'positive' | 'mixed' | 'neutral',
  stackable: false,
  conflictGroup: 'optional',
  trigger_ext: '自然语言引起因素',
  effect_ext: '自然语言结果因素'
}
```

Need band defaults:

- Lowest two bands: `<10`, `<20`.
- Highest two bands: `>100`, `>110`.
- Normal range should usually have no visible state.
- Backend should show state names such as `饿殍`, `饥肠`, while saving the runtime state ID.

Natural-language ext rules:

- `trigger_ext` explains causes: need bands, repeated interaction failure, risky witnessed failure, furniture/action use, task result, story node, relation change, scene/time, observer reaction.
- `effect_ext` explains results: need modifiers, AI weights, relation axes, skill blocking, interaction availability, narrative bubbles, task eligibility, scene permissions, health/economy impact.
- Keep machine fields such as `needMods`, `blockedSkills`, `aiMods`, `relationMods`, `ext`, and `trigger` only when gameplay needs them.

## Output formats

For design-only work, output concise tables:

- Traits: ID, label, category, opposite, main effects.
- Specialties: ID, ownerId, label, systems, main effects.
- Interactions: ID/name, category, rel range, risk, effects, low-score behavior.
- States: ID/name, category, trigger_ext, effect_ext, wiring target.
- Runtime gaps: requested behavior without current interpreter support.

For direct edits, report:

- created/updated rows by system
- duplicate merges/skips
- assignment/wiring changes
- PRD updates
- files changed
