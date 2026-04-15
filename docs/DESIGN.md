# OVFX design notes

This document records the rationale behind the v0.1.0 schema. It is **non-normative** — the spec itself is the source of truth — but it explains why the choices are what they are, so future RFCs don't have to relitigate them from scratch.

## Why JSON

JSON is the lowest-friction format for a small, modern, web-first community. Every language has a parser; every developer can read it; every text editor can diff it. Binary formats (FlatBuffers, MessagePack, Protobuf) would shave bytes but lose the "open it in a text editor" property that matters most for an at-home self-test format.

## Why one document per result

Earlier sketches considered a multi-result document with a top-level `results: [...]` array. This was rejected because:

- Sharing a single result is the most common operation. Wrapping it in an array adds boilerplate every time.
- Multi-result archives can still be expressed as a directory of OVFX files, or as a JSON-Lines stream of OVFX documents — both round-trip cleanly.
- A binocular session is the only natural multi-document case, and the `binocularGroup` field handles it without forcing every consumer to deal with arrays.

## Why polar coordinates from fixation, not pixels from screen origin

Pixel coordinates would be useless to any consumer that didn't render on the exact same screen the test was recorded on. Storing the data in degrees of visual angle relative to fixation makes the document portable: any consumer with `pixelsPerDegree` and the fixation offset can render it at the right physical scale on any screen.

The choice of polar (`meridianDeg`, `eccentricityDeg`) over cartesian (`xDeg`, `yDeg`) follows clinical perimetry convention. Goldmann meridians are explicitly polar, and the "isopter at 60° on the temporal meridian" reading is the natural one for clinicians.

## Why `pixelsPerDegree` is canonical

Two reasonable choices existed for the calibration:

1. Store `viewingDistanceCm` and let consumers derive `pixelsPerDegree`.
2. Store `pixelsPerDegree` directly.

OVFX stores both, with `pixelsPerDegree` declared canonical. The reason: at the time the test was performed, the producing app already computed `pixelsPerDegree` from the user's calibration step (card width, viewing distance, monitor scaling). Asking every consumer to re-derive the same value invites floating-point drift and bugs around CSS pixels vs device pixels. Storing the producer's authoritative number keeps consumers in lockstep.

`viewingDistanceCm` is kept as informative metadata so that a consumer can display "you tested at 50 cm" without knowing about the tan(1°) conversion.

## Why the `subject` object is so thin

The smallest possible footprint that still allows useful aggregate research (birth year, sex) without crossing into PHI territory. We deliberately omit name, exact birth date, address, and any clinical identifier. A producer wanting richer subject context should hold that data in its own database and reference an OVFX document by `id`, never inline.

## Why `extensions` is namespaced

Reverse-DNS namespacing prevents two implementers from accidentally choosing the same extension name. It also makes it trivial to grep an archive for "everything written by app X" — every producer's data lives under its own top-level key inside `extensions`.

## Why `_`-prefixed point fields

Per-point extension fields are common (a producer wants to record one extra thing per stimulus presentation, like a head-tracker reading). Forcing them into a nested `extensions` object on every point would bloat the file. The underscore-prefix convention is borrowed from JSON-LD's "free-form key" precedent and is unambiguous: any consumer that doesn't know what `_headPosition` means MUST preserve it on round-trip and SHOULD ignore it.

## What was rejected for v0.1.0

- **Inline trial-by-trial event log** with timestamps. Nice for research, but bloats the typical document by an order of magnitude. Likely a v0.2.0 optional addition under `extensions` first, then promoted if it sees use.
- **Embedded plot images.** Out of scope; visualisation is a consumer concern.
- **DICOM compatibility layer.** Worth doing eventually as a separate `tools/ovfx-to-dicom/` converter. Not v0.1.0.
- **A `units` field** to allow centimetres or inches. Rejected: a single canonical unit per field is simpler and prevents an entire class of conversion bugs.

## Open questions for v0.2.0

- Should `points[].timestamp` be a standard optional field, so consumers can reconstruct the test's temporal sequence without relying on array order?
- Should `stimuli` allow non-standard keys, or restrict to a registered set?
- Is `binocularGroup` enough to represent an arbitrary "session" of multiple related tests, or does that warrant its own concept?

These questions are deliberately left for a future RFC cycle.
