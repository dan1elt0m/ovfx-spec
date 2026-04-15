# Changelog

All notable changes to OVFX are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html) at the spec level.

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
