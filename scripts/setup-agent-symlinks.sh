#!/usr/bin/env sh
set -e

# Creates symlinks (or copies if symlinks fail) so all agent entrypoints share the same rules.

link_or_copy () {
  src="$1"
  dst="$2"

  dst_dir="$(dirname "$dst")"
  mkdir -p "$dst_dir"

  # Remove existing file/link
  if [ -e "$dst" ] || [ -L "$dst" ]; then
    rm -f "$dst"
  fi

  # Try symlink; if it fails (Windows, permissions), fallback to copy
  if ln -s "$src" "$dst" 2>/dev/null; then
    echo "linked: $dst -> $src"
  else
    cp "$src" "$dst"
    echo "copied: $dst <- $src (symlink unavailable)"
  fi
}

# Claude entrypoint
link_or_copy "AGENTS.md" "CLAUDE.md"

# GitHub Copilot instructions
link_or_copy "AGENTS.md" ".github/copilot-instructions.md"

# Cursor rules (mdc path; .cursorrules is deprecated)
link_or_copy "AGENTS.md" ".cursor/rules/main.mdc"
