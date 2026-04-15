# ovfx-validate-cli

Reference command-line validator for OVFX documents. Uses [Ajv](https://ajv.js.org/) (Draft 2020-12) and the canonical schema from `schema/v0.1.0/`.

## Install

```bash
cd tools/validate-cli
npm install
```

## Usage

```bash
node index.js path/to/file.ovfx.json [more files...]
```

Or, after `npm link`:

```bash
ovfx-validate path/to/file.ovfx.json
```

Exits non-zero if any file fails validation. Errors include the JSON pointer to the offending field.

## What it checks

- Structural conformance against `schema/v0.1.0/ovfx.schema.json`.
- Every `points[].stimulusKey` resolves to a `stimuli[].key`.

It does **not** check semantic correctness (whether the recorded points make physiological sense). That is intentionally out of scope — the spec defines the format, not the science.

## License

Apache License 2.0.
