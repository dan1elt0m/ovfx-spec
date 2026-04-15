---
name: update-ovfx
description: Bump the OVFX standard to a new version (PATCH / MINOR / MAJOR). Use this skill whenever the user asks to change the OVFX spec, schema, or examples, or to add a new test type / setup type. Handles the full procedure — new spec file, new schema file, example updates, validator registry, tests, CHANGELOG, and PR.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# update-ovfx — bump the OVFX standard

This skill implements the procedure documented in the repo's `CLAUDE.md`. Always read that file first for the full rationale — the steps below are a checklist; `CLAUDE.md` is the spec.

## Precondition checks

Before touching any file:

1. Confirm the working directory is the root of the `ovfx-spec` repo (look for `spec/`, `schema/`, `tools/validate-cli/` at the top level). If not, stop and tell the user.
2. Read `CLAUDE.md` top to bottom so the procedure matches the latest governance rules.
3. Read `spec/README.md` to find the current spec version (the top entry in the table).
4. Ask the user (if not already clear from the request):
   - What is the one-line motivation for the change?
   - Is it PATCH, MINOR, or MAJOR? The bump-decision table in `CLAUDE.md` is canonical.
   - Is there an RFC issue already open? For anything beyond editorial, there should be — `CONTRIBUTING.md` explains why.

Do not proceed until both the bump type and the new version number are fixed.

## The procedure

Follow these steps in order. Each step maps 1:1 to a section of `CLAUDE.md`.

### 1. Branch

```bash
git checkout -b rfc/<short-slug>
```

### 2. Copy the current spec to the new version

```bash
cp spec/v<current>.md spec/v<new>.md
```

Edit `spec/v<new>.md`:

- Update the `Specification version:` header
- Update the `Supersedes:` line when superseding a pre-adoption draft (within the same day, before any producer has adopted the previous version) — otherwise leave the previous version alone
- Apply the change
- Update §7 (Conformance) if the schema URL changes
- Add or update §10 (migration notes) when the change is not purely additive

**Never edit previously released spec files.** If the user asks you to fix a typo in an already-released file, record it in `CHANGELOG.md` under an errata heading and fix it in the next PATCH bump.

### 3. Copy the schema

```bash
cp -r schema/v<current> schema/v<new>
```

Edit `schema/v<new>/ovfx.schema.json`:

- Update `$id` to the new version URL
- Update `ovfxVersion.pattern` to match the new `MAJOR.MINOR`
- Apply the field-level changes

Sanity-parse the JSON before moving on:

```bash
node -e "JSON.parse(require('fs').readFileSync('schema/v<new>/ovfx.schema.json'))"
```

### 4. Update every example

Every file under `examples/` must bump to the new version AND validate against the new schema. Leave none behind.

Use `Read` + `Edit` on each example file; don't rewrite them from scratch.

### 5. Update the validator registry

Edit `tools/validate-cli/index.js`:

1. Add the new `MAJOR.MINOR` entry to the `SCHEMAS` registry pointing at the new schema file.
2. Update `DEFAULT_SCHEMA` to reference the new entry.

**Do not remove older schema entries.** The registry is append-only so older documents keep validating against their original schema.

### 6. Add unit tests

Edit `tools/validate-cli/test.js`:

- Add a positive test for any newly-accepted shape.
- Add a negative test for any newly-rejected shape.
- Add a regression test asserting that the previous version's documents still validate against their original schema.

### 7. Update supporting files

One commit should touch all of these. Don't ship a spec bump with stale supporting docs:

- `README.md` — spec-version badge, quick example, spec/schema links
- `spec/README.md` — add the new version row, mark the previous one as superseded if applicable
- `schema/README.md` — add the new schema row
- `CHANGELOG.md` — new section at the top with `Added` / `Changed` / `Removed` / `Fixed` / `Deprecated` buckets
- `docs/DESIGN.md` — only if the change is non-trivial or you rejected alternatives worth recording

### 8. Run the checks locally

```bash
cd tools/validate-cli
npm install
npm test                    # node --test test.js
npm run validate:examples   # every example under examples/
```

Both commands must pass. If either fails, fix the root cause — **never** skip or delete a failing test just to make CI green.

### 9. Commit

Commit message convention:

```
Bump OVFX spec to v<new>: <one-line summary>

<motivation — link to the RFC issue if any>
```

Ask the user to review the diff before pushing. Do not push without explicit user approval for a spec bump — this is a standard, not a feature branch.

### 10. Open the PR

Use `gh pr create --title "Bump OVFX spec to v<new>" --body "..."` with the PR template.

Mention the RFC issue (`Closes #<n>`) for anything beyond editorial.

### 11. Tag after merge

Only after the maintainer merges:

```bash
git tag v<new>
git push --tags
gh release create v<new> --title "OVFX v<new>" --notes-from-tag
```

## Guardrails

- **Never edit a released `spec/vX.Y.Z.md` or `schema/vX.Y.Z/` in place.** If you catch yourself reaching for `Edit` on one of those paths, stop — the correct action is a new version bump.
- **Never drop a schema from the validator registry.** Round-trip compatibility across versions is a hard requirement.
- **Never commit a schema change without corresponding test cases.** CI will pass, but the next breaking change will lose its regression guard.
- **Never promote PATCH to MINOR or MINOR to MAJOR silently.** The bump type determines how consumers react — get it right, and say so in the PR description.

## What this skill does NOT do

This skill bumps the standard. It does not:

- Implement OVFX producers or consumers in downstream apps (that's a separate task).
- Decide whether a change is a good idea. Discussion happens in the RFC issue before this skill is invoked.
- Modify governance documents (`GOVERNANCE.md`, `CONTRIBUTING.md`). Governance changes are a separate RFC and a separate skill.
