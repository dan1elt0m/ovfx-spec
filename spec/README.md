# OVFX specifications

Each spec version is a stable, immutable document. Future versions are added as new files; existing files are never edited except for editorial errata (and those are recorded in `CHANGELOG.md`).

| Version  | Status                                | Document                  |
| -------- | ------------------------------------- | ------------------------- |
| 0.3.0    | Public draft — current                | [`v0.3.0.md`](v0.3.0.md)  |
| 0.2.0    | Superseded                            | [`v0.2.0.md`](v0.2.0.md)  |
| 0.1.0    | Superseded (pre-adoption amendment)   | [`v0.1.0.md`](v0.1.0.md)  |

Changes at a glance:

- **0.2.0** restructured `calibration` to separate device-agnostic fields from the screen-specific setup, so bowl perimeters and VR headsets can emit OVFX too. See `spec/v0.2.0.md` §10 for the migration from 0.1.0.
- **0.3.0** moves `maxEccentricityDeg` into each `setup.<type>` sub-object (it's a hardware property, not a user measurement) and adds optional clinical-interop fields — `points[].sensitivityDb`, a top-level `reliability` object, and `test.pattern` / `test.strategy` / `test.durationSeconds`. See `spec/v0.3.0.md` §10 for the migration from 0.2.0.

A consumer **MUST** reject documents whose `ovfxVersion` is from a higher MAJOR version than it supports. See §8 of any spec version for the full versioning rules.
