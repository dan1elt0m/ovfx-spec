# OVFX specifications

Each spec version is a stable, immutable document. Future versions are added as new files; existing files are never edited except for editorial errata (and those are recorded in `CHANGELOG.md`).

| Version  | Status         | Document                  |
| -------- | -------------- | ------------------------- |
| 0.1.0    | Public draft   | [`v0.1.0.md`](v0.1.0.md)  |

A consumer **MUST** reject documents whose `ovfxVersion` is from a higher MAJOR version than it supports. See §8 of any spec version for the full versioning rules.
