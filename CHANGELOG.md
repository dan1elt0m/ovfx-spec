# Changelog

All notable changes to OVFX are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html) at the spec level.

## [0.4.0] — 2026-04-17

Purely additive minor bump. Every 0.3.0 document is a valid 0.4.0 document after bumping `ovfxVersion`. Motivated by cross-device comparability: `sensitivityDb` and response-time measurements are only portable when the producing screen's luminance and the stimulus presentation timing are recorded. Inspired by the parameter set used by Specvis-Desktop and similar screen-based perimetry tools.

### Added

- `test.stimulusDurationMs` (optional) — how long each stimulus was presented, in milliseconds.
- `test.interStimulusIntervalMs` (optional) — fixed minimum interval between successive stimuli, in milliseconds.
- `test.interStimulusIntervalJitterMs` (optional) — additional random interval added on top of the fixed part.
- `stimuli[].luminanceCdM2` (optional) — absolute luminance of a stimulus, in candelas per square metre. Enables cross-device comparison independent of the producing screen's full-brightness ceiling.
- `calibration.setup.screen.maxLuminanceCdM2` (optional) — absolute luminance of a full-brightness stimulus on the producing screen. Defines the 0 dB reference for `points[].sensitivityDb`.
- `calibration.setup.screen.backgroundLuminanceCdM2` (optional) — background luminance of the screen during the test. Matches the existing `calibration.setup.bowl.backgroundLuminanceCdM2`.
- Validator registry now includes the 0.4.0 schema; documents default to 0.4.0 when unversioned.
- Unit tests covering every new positive and negative rule, plus a regression test asserting that 0.3.0 documents still validate under the 0.3.0 schema.

### Migration from 0.3.0

Mechanical rewrite: bump `ovfxVersion` from `"0.3.0"` to `"0.4.0"`. Every new field is optional; existing 0.3.0 producers can ignore them.

## [0.3.0] — 2026-04-15

Moves `maxEccentricityDeg` into each `setup.<type>` sub-object (it's a property of the testing hardware, not a device-agnostic measurement) and adds optional fields for clinical interoperability with DICOM Supplement 80, the visualFields R package, and clinical HFA / Octopus exports. Point data is unchanged.

### Changed

- **Breaking:** `calibration.maxEccentricityDeg` moved into each setup sub-object. `calibration.setup.screen.maxEccentricityDeg`, `calibration.setup.bowl.maxEccentricityDeg`, and `calibration.setup.vr.maxEccentricityDeg` are now **required** for their respective setup types. The field is no longer accepted at the top of `calibration`.

### Added

- `test.pattern` (optional) — clinical grid name like `"24-2"`, `"30-2"`, `"10-2"`, `"Goldmann"`, `"Esterman"`.
- `test.strategy` (optional) — testing strategy like `"threshold"`, `"SITA-standard"`, `"SITA-fast"`, `"screening"`, `"kinetic"`, `"ring-sector"`.
- `test.durationSeconds` (optional) — total wall-clock duration of the test.
- `points[].sensitivityDb` (optional) — threshold sensitivity in decibels, for static threshold perimetry. Unlocks faithful representation of Humphrey / Octopus threshold data.
- `reliability` top-level object (optional) with `falsePositiveRate`, `falseNegativeRate`, `fixationLossRate`, and `fixationMethod` — the classical HFA reliability triad plus a free-form fixation-monitoring method string.
- Validator registry now includes the 0.3.0 schema; documents default to 0.3.0 when unversioned.
- Additional unit tests covering every new field.

### Migration from 0.2.0

Mechanical rewrite: move `calibration.maxEccentricityDeg` into `calibration.setup.screen.maxEccentricityDeg` (for screen tests) and bump `ovfxVersion` from `"0.2.0"` to `"0.3.0"`. No point data changes. All new 0.3.0 fields are optional; existing 0.2.0 producers can ignore them.

## Errata — 2026-04-15

- **Repository moved to the `openperimetry` GitHub organization.** All schema `$id` URLs (`schema/v0.1.0`, `schema/v0.2.0`, `schema/v0.3.0`) were patched in place from `https://raw.githubusercontent.com/dan1elt0m/ovfx-spec/main/schema/...` to `https://raw.githubusercontent.com/openperimetry/ovfx-spec/main/schema/...`. The `$id` is a stable identifier and is not semantically part of the schema; no consumer behaviour changes. GitHub will redirect the old URL indefinitely, but new producers should emit documents that reference the new URL. Applied in-place to all pre-adoption drafts with no version bump.
- **Schema `$id` URL corrected.** Both `schema/v0.1.0/ovfx.schema.json` and `schema/v0.2.0/ovfx.schema.json` originally used `https://ovfx.org/...` as their `$id`, but that domain is not owned by this project. Both files were patched to point at the GitHub raw URL instead (`https://raw.githubusercontent.com/dan1elt0m/ovfx-spec/main/schema/...`, subsequently updated to the `openperimetry` org — see above). The `$id` is a stable identifier and is not semantically part of the schema; no consumer behaviour changes. Applied in-place to both pre-adoption drafts with no version bump.

## [0.2.0] — 2026-04-15

Restructures `calibration` to remove the screen-specific bias of 0.1.0. The core data model (points in polar degrees of visual angle) is unchanged, so converting a 0.1.0 document to 0.2.0 is a mechanical rewrite of the `calibration` object with no point data changes. See `spec/v0.2.0.md` §10 for the migration.

### Changed

- `calibration` now requires only `maxEccentricityDeg` and a new discriminated `setup` sub-object. `reactionTimeMs` remains at the top of `calibration` as an optional user measurement.
- Screen-specific fields (`viewingDistanceCm`, `pixelsPerDegree`, `screenWidthPx`, `screenHeightPx`, `fixationOffsetPx`, `brightnessFloor`) moved into `calibration.setup.screen`. They are only required when `calibration.setup.type === "screen"`.
- `calibration.setup.type` is a discriminator with values `"screen"`, `"bowl"`, `"vr"`, `"other"`. Matching sub-objects are defined for each (bowl and VR are lightly specified in this version; more fields may be added in later minor bumps).

### Added

- Reference validator CLI now selects the schema matching a document's `ovfxVersion`, so 0.1.0 and 0.2.0 documents are both accepted side by side during the pre-adoption phase.
- Unit tests for the validator under `tools/validate-cli/test.js`.
- `CLAUDE.md` with the step-by-step procedure for updating the standard.
- Repository skill at `.claude/skills/update-ovfx/SKILL.md`.

### Note on 0.1.0

0.1.0 was published on 2026-04-15 and superseded by 0.2.0 on the same day, before any known producer had adopted it. 0.1.0 is kept in the repository for traceability; its schema file remains valid and the validator CLI continues to accept 0.1.0 documents.

## [0.1.0] — 2026-04-15

Initial public draft.

### Added

- Top-level fields: `ovfxVersion`, `id`, `createdAt`, `subject`, `test`, `calibration`, `stimuli`, `points`, `isopters`, `software`, `extensions`.
- Three test types: `kinetic`, `static`, `ring`.
- Polar coordinate system anchored at the fixation point.
- JSON Schema (Draft 2020-12) at `schema/v0.1.0/ovfx.schema.json`.
- Three reference example documents under `examples/`.
- Reference validator CLI under `tools/validate-cli/`.
- Conformance, versioning, and security/privacy sections.

### Notes

- `0.1.x` is a public-draft series. Backward-incompatible changes are still possible before the `1.0.0` release.
