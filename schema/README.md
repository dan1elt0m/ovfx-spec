# OVFX JSON Schemas

Each spec version has a corresponding JSON Schema (Draft 2020-12). Schemas are versioned in lockstep with the spec.

| Version  | Schema                                                 |
| -------- | ------------------------------------------------------ |
| 0.2.0    | [`v0.2.0/ovfx.schema.json`](v0.2.0/ovfx.schema.json)   |
| 0.1.0    | [`v0.1.0/ovfx.schema.json`](v0.1.0/ovfx.schema.json)   |

The reference validator auto-selects the schema matching each document's `ovfxVersion` field, so both versions are accepted side by side.

Validate a document with any Draft 2020-12 compliant validator. The reference CLI under `tools/validate-cli/` uses `ajv`.
