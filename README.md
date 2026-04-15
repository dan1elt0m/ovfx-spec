# OVFX — Open Visual Field eXchange

[![Spec version](https://img.shields.io/badge/spec-v0.2.0--draft-blue)](spec/v0.2.0.md)
[![License: CC BY 4.0](https://img.shields.io/badge/spec%20license-CC%20BY%204.0-lightgrey)](LICENSE)
[![Code license](https://img.shields.io/badge/code%20license-Apache%202.0-blue)](LICENSE-CODE)

**OVFX** is an open, JSON-based interchange format for **visual field perimetry** test results — kinetic (Goldmann), static, and ring/arc tests alike. It exists so that visual-field measurements can move between self-test apps, research tools, clinical software, and longitudinal personal archives without being locked into a single vendor's binary file.

The format is intentionally small, human-readable, and forward-compatible. A typical OVFX file is a single `.ovfx.json` document.

## Why OVFX

There is no widely adopted open exchange format for visual-field perimetry. The closest options are heavy and incomplete:

- **DICOM Ophthalmic Visual Field Static Perimetry Measurements** (Supplement 80) is a true international standard but only covers static automated perimetry, has no open tooling worth speaking of, and is impractical for at-home self-test apps.
- **Vendor formats** (Humphrey HFA, Octopus, Oculus) are proprietary and almost always binary.
- **HL7 FHIR `Observation`** is flexible but defines no perimetry-specific schema, so every implementer rolls their own incompatible extension.

OVFX fills the gap with one small, well-specified JSON schema that covers every common test type, including kinetic perimetry — the modality most under-served by existing standards.

## Quick example

```json
{
  "ovfxVersion": "0.2.0",
  "id": "1f5b2e2c-2cd5-4d29-9c6a-83a51c4f8aaa",
  "createdAt": "2026-04-15T10:00:00Z",
  "test": { "type": "kinetic", "eye": "right" },
  "calibration": {
    "maxEccentricityDeg": 70,
    "reactionTimeMs": 250,
    "setup": {
      "type": "screen",
      "screen": {
        "viewingDistanceCm": 50,
        "pixelsPerDegree": 12.0,
        "screenWidthPx": 1920,
        "screenHeightPx": 1080,
        "fixationOffsetPx": -200,
        "brightnessFloor": 0.04
      }
    }
  },
  "stimuli": [
    { "key": "V4e",   "sizeDeg": 1.73, "intensity": 1.00 },
    { "key": "III4e", "sizeDeg": 0.43, "intensity": 1.00 }
  ],
  "points": [
    { "stimulusKey": "V4e", "meridianDeg": 0,  "eccentricityDeg": 78.4, "detected": true,  "responseTimeMs": 312 },
    { "stimulusKey": "V4e", "meridianDeg": 30, "eccentricityDeg": 75.1, "detected": true,  "responseTimeMs": 298 },
    { "stimulusKey": "V4e", "meridianDeg": 60, "eccentricityDeg": 72.8, "detected": false }
  ]
}
```

A producer targeting a clinical bowl perimeter or a VR headset replaces `setup.screen` with `setup.bowl` or `setup.vr` and keeps the rest of the document identical. The device-specific fields never leak into the point data.

Full examples for each test type are in [`examples/`](examples/).

## Repository layout

```
spec/         The specification document (versioned, RFC 2119 normative language)
schema/       JSON Schema (Draft 2020-12) for each spec version
examples/     Conformant example files for every test type
tools/        Reference implementations (validators, converters)
docs/         Design rationale and supporting material
```

## Versioning

OVFX uses semantic versioning at the spec level. A **MAJOR** bump means a backward-incompatible change to the schema. **MINOR** bumps add new optional fields or test types. **PATCH** bumps are clarifications and corrections that don't change the schema. Implementations should reject documents whose `ovfxVersion` is from a newer **MAJOR** than they support.

The current spec version is **0.2.0 (draft)**. The format is not yet considered stable; feedback on the draft is welcome.

## Status

OVFX is currently a **public draft**. The schema may change before 1.0.0 based on review feedback. See [`CHANGELOG.md`](CHANGELOG.md) for the history.

## Get involved

- Read the [specification](spec/v0.2.0.md)
- Browse the [JSON Schema](schema/v0.2.0/ovfx.schema.json)
- Try the [validator CLI](tools/validate-cli/)
- Open an [RFC issue](.github/ISSUE_TEMPLATE/) to propose a change
- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before sending a PR

## License

- The **specification** (everything under `spec/`, `schema/`, `docs/`, plus `README.md` and `CHANGELOG.md`) is released under [Creative Commons Attribution 4.0 International](LICENSE).
- All **code** (everything under `tools/` and `examples/`) is released under the [Apache License 2.0](LICENSE-CODE).
