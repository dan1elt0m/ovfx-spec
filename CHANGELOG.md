# Changelog

All notable changes to OVFX are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html) at the spec level.

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
