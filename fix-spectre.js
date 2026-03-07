/**
 * Patch node-pty binding.gyp to remove Spectre mitigation flags.
 * These require VS Enterprise or specific optional components that most users don't have.
 * Run automatically via postinstall before electron-builder compiles native modules.
 */
const fs = require('fs')
const path = require('path')

const bindingPath = path.join(__dirname, 'node_modules', 'node-pty', 'binding.gyp')

if (!fs.existsSync(bindingPath)) {
  console.log('[kagora] node-pty not yet installed, skipping Spectre patch')
  process.exit(0)
}

let content = fs.readFileSync(bindingPath, 'utf-8')
const original = content

// Remove /Qspectre and /guard:cf flags that require special VS components
content = content.replace(/["']\/Qspectre["']/g, '""')
content = content.replace(/["']\/guard:cf["']/g, '""')

if (content !== original) {
  fs.writeFileSync(bindingPath, content, 'utf-8')
  console.log('[kagora] Patched node-pty binding.gyp: removed Spectre mitigation flags')
} else {
  console.log('[kagora] node-pty binding.gyp: no Spectre flags found (already patched or not present)')
}
