# Security

OVFX is a data format specification. The specification itself is not "secure" or "insecure" — those properties belong to the implementations that produce and consume OVFX documents.

## Reporting an issue in this repository

If you find an issue in the **reference tooling** under `tools/` (for example the validator CLI) that has security implications, please open a private security advisory on GitHub:

<https://github.com/dan1elt0m/ovfx-spec/security/advisories/new>

Please do not open a public issue for security problems. We will acknowledge receipt within 7 days and aim to publish a fix within 30 days.

## Reporting an issue in the specification itself

If you believe the spec mandates or encourages an unsafe practice (for example, requiring a field that would leak private data), open a regular issue using the *RFC* template. Spec changes follow the [RFC process in CONTRIBUTING.md](CONTRIBUTING.md#rfc-process-for-schema-changes).

## What OVFX does and does not protect

- OVFX documents are plain JSON. They are **not encrypted** by the format.
- OVFX **does not require any PHI**. Producers SHOULD omit the optional `subject` object when no consenting use case requires it.
- OVFX **does not authenticate documents**. If you need to verify a document's origin, sign it externally (e.g. JWS) and distribute the signature alongside the document.
