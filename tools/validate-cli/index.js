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
const SCHEMA_PATH = resolve(__dirname, '..', '..', 'schema', 'v0.1.0', 'ovfx.schema.json')

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: ovfx-validate <file.ovfx.json> [more files...]')
    process.exit(2)
  }

  const schema = JSON.parse(await readFile(SCHEMA_PATH, 'utf8'))
  const ajv = new Ajv2020({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)

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

    const ok = validate(doc)
    if (!ok) {
      failed++
      console.error(`✗ ${file}`)
      for (const err of validate.errors ?? []) {
        const where = err.instancePath || '/'
        console.error(`    ${where}  ${err.message}`)
      }
      continue
    }

    // Cross-field check: every points[].stimulusKey MUST appear in stimuli[].key
    const stimulusKeys = new Set((doc.stimuli || []).map((s) => s.key))
    const orphans = (doc.points || []).filter((p) => !stimulusKeys.has(p.stimulusKey))
    if (orphans.length > 0) {
      failed++
      console.error(`✗ ${file}`)
      console.error(`    points reference unknown stimulusKey(s): ${[...new Set(orphans.map((p) => p.stimulusKey))].join(', ')}`)
      continue
    }

    console.log(`✓ ${file}`)
  }

  if (failed > 0) {
    console.error(`\n${failed} file(s) failed validation.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
