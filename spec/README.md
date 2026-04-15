# OVFX specifications

Each spec version is a stable, immutable document. Future versions are added as new files; existing files are never edited except for editorial errata (and those are recorded in `CHANGELOG.md`).

| Version  | Status                                | Document                  |
| -------- | ------------------------------------- | ------------------------- |
| 0.2.0    | Public draft — current                | [`v0.2.0.md`](v0.2.0.md)  |
| 0.1.0    | Superseded (pre-adoption amendment)   | [`v0.1.0.md`](v0.1.0.md)  |

0.1.0 was published on 2026-04-15 and replaced by 0.2.0 on the same day, before any known producer had adopted it. The only breaking change was restructuring `calibration` to separate device-agnostic fields from the screen-specific setup — see `spec/v0.2.0.md` §10 for the migration.

A consumer **MUST** reject documents whose `ovfxVersion` is from a higher MAJOR version than it supports. See §8 of any spec version for the full versioning rules.
