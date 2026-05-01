#!/usr/bin/env sh
set -e

# Sync authoring templates (skills/**) into canonical agent-visible folder (.agents/skills/**)

SRC="skills"
DST=".agents/skills"

mkdir -p "$DST"

# Best effort: prefer rsync if available
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$SRC"/ "$DST"/
  echo "Synced with rsync: $SRC -> $DST"
else
  # Fallback: wipe + copy
  rm -rf "$DST"
  mkdir -p "$DST"
  cp -R "$SRC"/. "$DST"/
  echo "Synced with cp: $SRC -> $DST"
fi
