// Unit tests for the OVFX validator.
// Run with: node --test test.js
//
// Uses Node's built-in test runner (>= 18) — no external test framework.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { validateDocument, loadSchemaFor } from './index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EXAMPLES_DIR = resolve(__dirname, '..', '..', 'examples')

/** Structural minimum of a valid v0.3.0 document, used as a base for tests. */
function baseDoc() {
  return {
    ovfxVersion: '0.3.0',
    id: 'test-0001',
    createdAt: '2026-04-15T10:00:00Z',
    test: { type: 'kinetic', eye: 'right' },
    calibration: {
      setup: {
        type: 'screen',
        screen: {
          viewingDistanceCm: 50,
          pixelsPerDegree: 12,
          screenWidthPx: 1920,
          screenHeightPx: 1080,
          fixationOffsetPx: -200,
          maxEccentricityDeg: 70,
        },
      },
    },
    stimuli: [{ key: 'V4e', sizeDeg: 1.73, intensity: 1.0 }],
    points: [
      { stimulusKey: 'V4e', meridianDeg: 0, eccentricityDeg: 60, detected: true },
    ],
  }
}

test('a minimal well-formed document validates', async () => {
  const { valid, errors } = await validateDocument(baseDoc())
  assert.equal(valid, true, `expected valid, got errors: ${JSON.stringify(errors)}`)
})

test('each example file in examples/ validates', async () => {
  const files = ['kinetic-goldmann.ovfx.json', 'ring-test.ovfx.json', 'static-perimetry.ovfx.json']
  for (const f of files) {
    const doc = JSON.parse(await readFile(join(EXAMPLES_DIR, f), 'utf8'))
    const { valid, errors } = await validateDocument(doc)
    assert.equal(valid, true, `${f} failed: ${JSON.stringify(errors)}`)
  }
})

test('missing required top-level field fails', async () => {
  const doc = baseDoc()
  delete doc.points
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, false)
  assert.ok(errors.some((e) => /points/.test(e.message) || /points/.test(e.path)))
})

test('missing required nested field fails (setup.screen.viewingDistanceCm)', async () => {
  const doc = baseDoc()
  delete doc.calibration.setup.screen.viewingDistanceCm
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, false)
  assert.ok(errors.some((e) => /viewingDistanceCm/.test(e.message)))
})

test('setup.type "screen" without setup.screen fails', async () => {
  const doc = baseDoc()
  delete doc.calibration.setup.screen
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, false, `expected validation to fail, got errors: ${JSON.stringify(errors)}`)
})

test('setup.type "screen" with a bowl sub-object fails (mixed setup)', async () => {
  const doc = baseDoc()
  doc.calibration.setup.bowl = { bowlRadiusCm: 33 }
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('a bowl setup without any screen/vr/other is accepted', async () => {
  const doc = baseDoc()
  doc.calibration.setup = {
    type: 'bowl',
    bowl: { maxEccentricityDeg: 90, bowlRadiusCm: 33, backgroundLuminanceCdM2: 31.5 },
  }
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, true, JSON.stringify(errors))
})

test('bowl setup without maxEccentricityDeg is rejected', async () => {
  const doc = baseDoc()
  doc.calibration.setup = { type: 'bowl', bowl: { bowlRadiusCm: 33 } }
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('v0.3.0 adds optional test.pattern / strategy / durationSeconds', async () => {
  const doc = baseDoc()
  doc.test.pattern = '24-2'
  doc.test.strategy = 'SITA-standard'
  doc.test.durationSeconds = 360
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, true, JSON.stringify(errors))
})

test('points may carry sensitivityDb for static threshold perimetry', async () => {
  const doc = baseDoc()
  doc.points[0].sensitivityDb = 28
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, true, JSON.stringify(errors))
})

test('reliability top-level object is accepted with all fields in [0,1]', async () => {
  const doc = baseDoc()
  doc.reliability = {
    falsePositiveRate: 0.02,
    falseNegativeRate: 0.05,
    fixationLossRate: 0.08,
    fixationMethod: 'blind-spot',
  }
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, true, JSON.stringify(errors))
})

test('reliability.falsePositiveRate > 1 is rejected', async () => {
  const doc = baseDoc()
  doc.reliability = { falsePositiveRate: 1.5 }
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('a 0.2.0 document with top-level maxEccentricityDeg still validates under the 0.2.0 schema', async () => {
  const doc = {
    ovfxVersion: '0.2.0',
    id: 'legacy-002',
    createdAt: '2026-04-15T09:00:00Z',
    test: { type: 'kinetic', eye: 'right' },
    calibration: {
      maxEccentricityDeg: 70,
      setup: {
        type: 'screen',
        screen: {
          viewingDistanceCm: 50,
          pixelsPerDegree: 12,
          screenWidthPx: 1920,
          screenHeightPx: 1080,
          fixationOffsetPx: -200,
        },
      },
    },
    stimuli: [{ key: 'V4e', sizeDeg: 1.73, intensity: 1.0 }],
    points: [{ stimulusKey: 'V4e', meridianDeg: 0, eccentricityDeg: 60, detected: true }],
  }
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, true, JSON.stringify(errors))
})

test('unknown top-level field is rejected (additionalProperties: false)', async () => {
  const doc = baseDoc()
  doc.bogusField = 42
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('underscore-prefixed point field is allowed', async () => {
  const doc = baseDoc()
  doc.points[0]._note = 'producer annotation'
  const { valid } = await validateDocument(doc)
  assert.equal(valid, true)
})

test('meridianDeg out of [0, 360) is rejected', async () => {
  const doc = baseDoc()
  doc.points[0].meridianDeg = 360
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('eccentricityDeg cannot be negative', async () => {
  const doc = baseDoc()
  doc.points[0].eccentricityDeg = -1
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('points referencing unknown stimulusKey fails the cross-field check', async () => {
  const doc = baseDoc()
  doc.points.push({ stimulusKey: 'III4e', meridianDeg: 0, eccentricityDeg: 50, detected: true })
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, false)
  assert.ok(errors.some((e) => /unknown stimulusKey/.test(e.message)))
})

test('stimuli array cannot be empty', async () => {
  const doc = baseDoc()
  doc.stimuli = []
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('ovfxVersion format is enforced per major.minor schema', async () => {
  const doc = baseDoc()
  doc.ovfxVersion = '1.0.0' // unsupported major
  // loadSchemaFor falls back to the default (0.2.x) schema, which then
  // rejects the version string via its pattern.
  const { valid } = await validateDocument(doc)
  assert.equal(valid, false)
})

test('loadSchemaFor selects the right schema for each major.minor', async () => {
  const s3 = await loadSchemaFor('0.3.0')
  assert.ok(s3.endsWith('v0.3.0/ovfx.schema.json'))
  const s2 = await loadSchemaFor('0.2.0')
  assert.ok(s2.endsWith('v0.2.0/ovfx.schema.json'))
  const s1 = await loadSchemaFor('0.1.0')
  assert.ok(s1.endsWith('v0.1.0/ovfx.schema.json'))
  const fallback = await loadSchemaFor('9.9.9')
  assert.ok(fallback.endsWith('v0.3.0/ovfx.schema.json'), 'unknown major should fall back to default')
})

test('a 0.1.0 document with its old-style calibration still validates under the 0.1.0 schema', async () => {
  const doc = {
    ovfxVersion: '0.1.0',
    id: 'legacy-001',
    createdAt: '2026-04-14T09:00:00Z',
    test: { type: 'kinetic', eye: 'right' },
    calibration: {
      viewingDistanceCm: 50,
      pixelsPerDegree: 12,
      screenWidthPx: 1920,
      screenHeightPx: 1080,
      fixationOffsetPx: -200,
      maxEccentricityDeg: 70,
    },
    stimuli: [{ key: 'V4e', sizeDeg: 1.73, intensity: 1.0 }],
    points: [{ stimulusKey: 'V4e', meridianDeg: 0, eccentricityDeg: 60, detected: true }],
  }
  const { valid, errors } = await validateDocument(doc)
  assert.equal(valid, true, JSON.stringify(errors))
})
