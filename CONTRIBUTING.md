# Contributing to OVFX

Thanks for taking the time to contribute to the Open Visual Field eXchange standard. OVFX exists because no open standard for visual-field perimetry data did, and we'd like to keep it useful, small, and well-specified. Contributions of all sizes are welcome.

## Ground rules

1. **Be specific.** Vague suggestions ("the format should be more flexible") are hard to act on. Concrete proposals with example documents and a use case carry the discussion forward.
2. **Prefer additive changes.** Backward-incompatible changes require a MAJOR version bump and have a much higher bar. If your idea can be expressed as an OPTIONAL field or an extension, prefer that.
3. **Show, don't tell.** Pair every proposed schema change with at least one example document and a sentence about which producer or consumer needs the change.
4. **Be kind.** This is a small project; assume good intent and ask before assuming malice.

## What you can contribute

| Type                 | How                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Bug report           | Open an issue with the *Bug* template. Include the document that triggered the issue.       |
| Editorial fix        | Open a PR. Spelling, grammar, broken links, clearer wording — these are always welcome.    |
| Schema change (RFC)  | Open an issue with the *RFC* template before sending a PR. See the RFC process below.        |
| New example document | Open a PR adding it under `examples/` plus an entry in `examples/README.md`.                |
| Validator / tool     | Open a PR under `tools/`. Code is licensed Apache-2.0; spec content remains CC-BY-4.0.      |

## RFC process for schema changes

Any change that adds, removes, renames, or re-types a schema field follows a lightweight RFC process:

1. **Open an issue** using the *RFC* template. Describe the use case, the proposed change, and at least one example document showing the new shape. State whether it is MAJOR / MINOR / PATCH and why.
2. **Discussion period of at least 7 days.** Maintainers and other contributors leave comments. This is the time to iterate on the design.
3. **Decision.** A maintainer either accepts, requests changes, or rejects with a brief explanation. Rejected RFCs are closed but remain searchable.
4. **PR.** An accepted RFC results in a PR that updates the spec document, the schema, the changelog, and at least one example demonstrating the new field.
5. **Merge.** PRs are merged by a maintainer once the validator CI passes and at least one other reviewer has approved.

Trivial editorial changes (typos, link fixes, wording cleanups) skip the RFC step — open a PR directly.

## Versioning rules

- **MAJOR** — backward-incompatible change to the schema (removing or renaming a field, narrowing a type, removing a test type).
- **MINOR** — backward-compatible additions (new optional fields, new test types, new stimulus key conventions).
- **PATCH** — clarifications and editorial corrections that do not change the schema.

Each spec version lives at a stable URL under `spec/<version>.md` and `schema/<version>/`. **Existing spec files are immutable** — editorial errata are documented in `CHANGELOG.md` and applied to a new patch version, never by editing an existing file in place.

## Local development

```bash
git clone https://github.com/dan1elt0m/ovfx-spec
cd ovfx-spec/tools/validate-cli
npm install
node index.js ../../examples/*.ovfx.json
```

The validator CLI is the same one CI runs on every PR. If your example or schema change passes locally, it will pass in CI.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.

## License

By contributing to OVFX, you agree that:

- Contributions to the **specification** (everything under `spec/`, `schema/`, `docs/`) are licensed under [CC-BY-4.0](LICENSE).
- Contributions to **code** (everything under `tools/`, `examples/`) are licensed under [Apache-2.0](LICENSE-CODE).
