#!/usr/bin/env node
// OVFX reference validator CLI.
// Usage: node index.js path/to/file.ovfx.json [more files...]
// Exits non-zero if any file fails validation.
//
// Licensed under the Apache License, Version 2.0.

import { readFile } from 'node:fs/promises'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Registry of every published spec version and its schema path. The CLI picks
// the schema matching a document's `ovfxVersion` field. New versions are added
// here when they are released.
const SCHEMAS = {
  '0.3': resolve(__dirname, '..', '..', 'schema', 'v0.3.0', 'ovfx.schema.json'),
  '0.2': resolve(__dirname, '..', '..', 'schema', 'v0.2.0', 'ovfx.schema.json'),
  '0.1': resolve(__dirname, '..', '..', 'schema', 'v0.1.0', 'ovfx.schema.json'),
}
const DEFAULT_SCHEMA = SCHEMAS['0.3']

export async function loadSchemaFor(ovfxVersion) {
  if (typeof ovfxVersion !== 'string') return DEFAULT_SCHEMA
  const m = ovfxVersion.match(/^(\d+\.\d+)\./)
  if (!m) return DEFAULT_SCHEMA
  return SCHEMAS[m[1]] ?? DEFAULT_SCHEMA
}

export async function validateDocument(doc) {
  const schemaPath = await loadSchemaFor(doc?.ovfxVersion)
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'))
  const ajv = new Ajv2020({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)

  const ok = validate(doc)
  const errors = []
  if (!ok) {
    for (const err of validate.errors ?? []) {
      errors.push({ path: err.instancePath || '/', message: err.message ?? 'invalid' })
    }
  }

  // Cross-field check: every points[].stimulusKey MUST appear in stimuli[].key.
  const stimulusKeys = new Set((doc?.stimuli || []).map((s) => s?.key))
  const orphanKeys = new Set(
    (doc?.points || [])
      .filter((p) => !stimulusKeys.has(p?.stimulusKey))
      .map((p) => p?.stimulusKey),
  )
  if (orphanKeys.size > 0) {
    errors.push({
      path: '/points',
      message: `references unknown stimulusKey(s): ${[...orphanKeys].join(', ')}`,
    })
  }

  return { valid: errors.length === 0, errors, schemaPath }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: ovfx-validate <file.ovfx.json> [more files...]')
    process.exit(2)
  }

  let failed = 0

  for (const file of args) {
    const path = resolve(file)
    let doc
    try {
      doc = JSON.parse(await readFile(path, 'utf8'))
    } catch (err) {
      console.error(`✗ ${file} — could not parse JSON: ${err.message}`)
      failed++
      continue
    }

    const { valid, errors } = await validateDocument(doc)
    if (!valid) {
      failed++
      console.error(`✗ ${file}`)
      for (const err of errors) {
        console.error(`    ${err.path}  ${err.message}`)
      }
      continue
    }
    console.log(`✓ ${file}`)
  }

  if (failed > 0) {
    console.error(`\n${failed} file(s) failed validation.`)
    process.exit(1)
  }
}

// Only run the CLI when this file is executed directly, not when it's imported
// by the test runner.
const isMain = fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? '')
if (isMain) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
