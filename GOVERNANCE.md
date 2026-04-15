# OVFX Governance

OVFX is a small open standard. Its governance reflects that — lightweight, transparent, and biased toward shipping useful versions rather than process for its own sake.

## Roles

### Maintainers

Maintainers have write access to the repository and the final say on merges and releases. They are responsible for:

- Reviewing and merging pull requests
- Cutting releases (tagging spec versions)
- Stewarding the RFC process described in [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Enforcing the [Code of Conduct](CODE_OF_CONDUCT.md)

The current maintainer is listed in the repository's GitHub `CODEOWNERS` file (or, in absence of that file, the repository owner).

### Contributors

Anyone who opens an issue or a pull request is a contributor. Contributors don't need to ask for permission to file an issue or a PR — see `CONTRIBUTING.md` for the workflow.

## Decision-making

Decisions are made in the open, on GitHub issues and pull requests.

- **Editorial changes** (typos, wording, broken links): a maintainer merges directly after review.
- **MINOR additions** (new optional fields, new test types): require an RFC issue with at least 7 days of public discussion, and approval from a maintainer.
- **MAJOR changes** (backward-incompatible schema changes): require an RFC issue with at least 14 days of public discussion, approval from a maintainer, and a clear migration story documented in the changelog.
- **Process changes** (this document, governance rules): require an RFC issue with at least 14 days of public discussion.

If a decision is contested, the maintainer makes the final call and explains the reasoning in the issue or PR.

## Adding maintainers

A new maintainer is added when:

1. They have made sustained, high-quality contributions to OVFX over time.
2. An existing maintainer proposes them in a public issue.
3. There are no objections from other maintainers within 7 days.

There is no fixed cap on the number of maintainers.

## Removing maintainers

A maintainer is removed when:

1. They voluntarily step down.
2. They have been inactive for more than 12 months and do not respond to a check-in.
3. A code-of-conduct violation warrants removal, decided by the remaining maintainers.

## Trademark and naming

"OVFX" and "Open Visual Field eXchange" are not trademarked. Anyone is free to use the name to describe their implementation as long as they do not imply endorsement by the project. Forks are welcome; forks should pick a different name to avoid confusion.

## Stability and breaking changes

The current state of OVFX is **public draft (0.1.x)**. Until the spec reaches 1.0.0, backward-incompatible changes may be made between minor versions, with reasonable notice on the changelog and migration guidance for known consumers.

After 1.0.0, the versioning rules in `CONTRIBUTING.md` are firm: backward-incompatible changes require a MAJOR bump.
