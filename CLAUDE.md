# CLAUDE.md — updating the OVFX standard

This file tells Claude (and any other agent or human collaborator) exactly how to update the OVFX standard. Follow these steps in order for every change. The repo also ships a skill at `.claude/skills/update-ovfx/SKILL.md` that wraps the same procedure — invoke it with `/update-ovfx` in Claude Code.

## Repository layout (what lives where)

```
spec/v<version>.md                    Normative spec document (immutable once released)
schema/v<version>/ovfx.schema.json    Machine-readable JSON Schema (Draft 2020-12)
examples/*.ovfx.json                  Conformant sample documents — every test type
tools/validate-cli/                   Reference Ajv validator + unit tests
docs/DESIGN.md                        Non-normative design rationale
CHANGELOG.md                          Keep-a-Changelog format, one section per version
CONTRIBUTING.md                       RFC process and review rules
GOVERNANCE.md                         Roles, decisions, maintainer lifecycle
```

**Immutability:** a published spec file under `spec/vX.Y.Z.md` and its matching `schema/vX.Y.Z/` must not be edited after release. Editorial errata and all real changes ship as a new version.

## Deciding the version bump

| Change                                                         | Bump     |
| -------------------------------------------------------------- | -------- |
| Typo / wording / link fix in a non-spec file                   | none     |
| Typo / wording fix in a spec file (never edit the spec in place) | PATCH    |
| Add a new **optional** field, new test type, new setup type    | MINOR    |
| Remove a field, rename a field, narrow a type, widen an enum that consumers must now accept | MAJOR |

While the spec is in the `0.x.x` public-draft series, MAJOR bumps are permitted (they mean "breaking change"); once the spec reaches `1.0.0`, any MAJOR bump also requires the 14-day RFC process in `CONTRIBUTING.md`.

## The update procedure

### 1. Open an RFC issue (for anything beyond editorial)

Use the *RFC* issue template. Describe the use case, the proposed change, and at least one example document showing the new shape. State the bump type and why. Wait for the discussion period documented in `CONTRIBUTING.md`.

### 2. Branch

```bash
git checkout -b rfc/<short-slug>
```

### 3. Create the new spec file

1. `cp spec/v<current>.md spec/v<new>.md`
2. Edit `spec/v<new>.md`:
   - Update the `Specification version:` header
   - Update the `Supersedes:` line (when superseding a pre-adoption draft) or leave the previous version untouched
   - Apply the change
   - Update §7 (Conformance) if the schema URL moves
   - Update §10 (or add §10) with migration notes when the change is not purely additive

**Do not edit previous spec files.** If you spot a typo in an already-released spec, record it in `CHANGELOG.md` under an errata sub-heading and fix it in the next patch version.

### 4. Create the new schema file

1. `cp -r schema/v<current> schema/v<new>`
2. Edit `schema/v<new>/ovfx.schema.json`:
   - Update `$id` to the new version URL
   - Update `ovfxVersion.pattern` to match the new `MAJOR.MINOR`
   - Apply the field-level changes
3. Validate the schema parses:

```bash
cd tools/validate-cli
node -e "JSON.parse(require('fs').readFileSync('../../schema/v<new>/ovfx.schema.json'))"
```

### 5. Update every example under `examples/`

Every file under `examples/` **must** bump to the new version and must validate against the new schema. Never leave examples behind — consumers copy from there.

### 6. Update the reference validator

Edit `tools/validate-cli/index.js`:

1. Add the new schema path to the `SCHEMAS` registry keyed by `MAJOR.MINOR`.
2. Update `DEFAULT_SCHEMA` to the new version so unversioned documents default to current.

The validator keeps older schemas in the registry so that documents from older producers still validate against the exact schema they were written for.

### 7. Add / update unit tests

In `tools/validate-cli/test.js`:

1. Add a test case for every new positive and negative rule introduced by the change.
2. If a 0.x.y document should still validate under its original schema, add an explicit regression test (we already have one for 0.1.0 — follow the same pattern).

### 8. Update the supporting files

Update all of these in one commit so no file is left behind:

- `README.md` — version badge, quick example, spec/schema links
- `spec/README.md` — add the new version, mark the previous one as superseded if applicable
- `schema/README.md` — add the new schema row
- `CHANGELOG.md` — add a new section at the top; each entry either under "Added", "Changed", "Removed", "Fixed", or "Deprecated"
- `docs/DESIGN.md` — if the change was non-trivial, record the alternatives considered

### 9. Run every check locally

```bash
cd tools/validate-cli
npm install
npm test                     # runs the unit tests
npm run validate:examples    # runs the CLI over every example file
```

If either command fails, fix the issue before sending the PR. CI runs the same two commands.

### 10. Commit and open the PR

Commit message convention: a short imperative first line naming the change, then a body explaining the motivation.

```
Bump OVFX spec to v<new>: <one-line summary>

<why this change is being made — link to the RFC issue if any>
```

Use the PR template (`.github/PULL_REQUEST_TEMPLATE.md`) and check every relevant box. For schema-affecting changes, the PR must link the accepted RFC issue.

### 11. Merge and tag

After review:

1. Merge the PR (squash commits if the branch has review fixups).
2. Tag the release: `git tag v<new> && git push --tags`.
3. Create a GitHub release pointing at the new `spec/v<new>.md` file.

## Editorial-only changes

Typos, broken links, CI tweaks, tooling fixes, README polish — open a PR directly without an RFC issue. These changes **must not** touch any published spec file or any file under `schema/`.
