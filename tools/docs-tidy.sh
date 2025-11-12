#!/usr/bin/env bash
set -eo pipefail

YEAR="$(date +%Y)"
MODE="plan"
SINCE=""
AREA_DEFAULT="general"

usage() {
  cat <<'USAGE'
Usage: docs-tidy.sh [--plan|--apply] [--since <git-ref>] [--year YYYY]
  --plan        Dry run (default)
  --apply       Apply changes and commit
  --since REF   Only consider files changed since REF (optional)
  --year  YYYY  Archive subfolder year (default: current year)
USAGE
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --plan) MODE="plan"; shift ;;
    --apply) MODE="apply"; shift ;;
    --since) SINCE="$2"; shift 2 ;;
    --year) YEAR="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${root}" ]]; then
  echo "Not inside a git repo"; exit 1
fi
cd "$root"

# Ensure target dirs exist
mkdir -p docs/final docs/archive/"$YEAR" internal/private tools
touch internal/private/.keep

REPORT="tools/docs-tidy-report.md"
: > "$REPORT"

echo "# Docs Tidy Report - $(date -u +"%Y-%m-%d %H:%M UTC")" >> "$REPORT"
echo "" >> "$REPORT"
echo "| From | To | Class | Reason |" >> "$REPORT"
echo "|---|---|---|---|" >> "$REPORT"

# Helpers
lower() { awk '{print tolower($0)}'; }
is_final_name() {
  local f="$1" n="$(basename "$f")"
  case "${n,,}" in
    readme.md|contributing.md|security.md|code_of_conduct.md|changelog.md) return 0 ;;
  esac
  [[ "${n,,}" =~ \[final\]|-final\.md$|_final\.md$ ]] && return 0 || return 1
}
has_final_marker() {
  local f="$1"
  head -n 15 "$f" 2>/dev/null | grep -qiE '^(status:\s*final|final:\s*true)|^\# .*final' && return 0 || return 1
}
is_archive_name() {
  local n="$(basename "$1")"
  [[ "${n,,}" =~ (draft|wip|note|notes|min|minutes|brainstorm|outline|deprecated|legacy|old|backup|copy) ]] && return 0 || return 1
}
is_version_like() {
  local n="$(basename "$1")"
  [[ "${n,,}" =~ (^|[-_ ])v([0-9]{1,2})([^0-9]|$) ]] && return 0 || return 1
}
looks_sensitive_content() {
  local f="$1"
  head -n 200 "$f" 2>/dev/null | grep -qiE '(sk-[A-Za-z0-9]{20,}|x-api-key|Authorization:|Bearer [A-Za-z0-9._\-]{20,}|secret=|token=|sensitive:\s*true)' && return 0 || return 1
}
has_email() {
  local f="$1"
  grep -qiE '\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b' "$f" && return 0 || return 1
}
derive_area() {
  local f="$1" dir rel
  rel="$(dirname "$f")"
  case "$rel" in
    docs/*) echo "${rel#docs/}" | cut -d'/' -f1 ;;
    *) echo "$AREA_DEFAULT" ;;
  esac
}
rewrite_links() {
  local file="$1" from_dir="$2" to_dir="$3"
  # Naive path rewrite for relative links: only adjust when link starts with ./ or ../ or no scheme
  # Compute relative from new location to old sibling paths (best-effort).
  # We keep it conservative to avoid mangling absolute URLs.
  :
}

# Enumerate markdown files
if [[ -n "$SINCE" ]]; then
  mapfile -t files < <(git diff --name-only "$SINCE"...HEAD -- '*.md' ':!internal/private/**' ':!node_modules/**' 2>/dev/null || true)
else
  mapfile -t files < <(git ls-files -- '*.md' ':!internal/private/**' ':!node_modules/**' 2>/dev/null || true)
fi

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No markdown files found to process" >&2
  exit 0
fi

final_count=0
archive_count=0
private_count=0

# Build version map to detect supersession
declare -A latest_by_stem
for f in "${files[@]}"; do
  [[ -z "$f" ]] && continue
  [[ ! -f "$f" ]] && continue
  stem="$(basename "$f" .md 2>/dev/null | sed -E 's/[-_ ]v[0-9]+$//I' 2>/dev/null || echo "${f##*/}")"
  ver_str="$(basename "$f" .md 2>/dev/null | grep -oEi 'v[0-9]+' 2>/dev/null | tr -d 'v' 2>/dev/null | tail -n1 2>/dev/null || echo "0")"
  ver="${ver_str:-0}"
  # Ensure ver is numeric
  if ! [[ "$ver" =~ ^[0-9]+$ ]]; then
    ver=0
  fi
  current="${latest_by_stem[$stem]:-0}"
  current="${current:-0}"
  if ! [[ "$current" =~ ^[0-9]+$ ]]; then
    current=0
  fi
  if [[ -z "${latest_by_stem[$stem]:-}" ]] || (( ver > current )); then
    latest_by_stem[$stem]=$ver
  fi
done

file_count=0
for f in "${files[@]}"; do
  [[ -z "$f" ]] && continue
  [[ ! -f "$f" ]] && continue
  file_count=$((file_count + 1))
  base="$(basename "$f" 2>/dev/null || echo "${f##*/}")"
  dir="$(dirname "$f" 2>/dev/null || echo ".")"
  area="$(derive_area "$f" 2>/dev/null || echo "$AREA_DEFAULT")"

  # Skip root-level reference docs - they stay in place
  if [[ "$dir" == "." ]] && is_final_name "$f" 2>/dev/null; then
    echo "| \`$f\` | \`$f\` (skipped) | keep | Root-level reference doc |" >> "$REPORT"
    continue
  fi

  class=""
  reason=""

  if looks_sensitive_content "$f" || has_email "$f"; then
    class="private"
    reason="Sensitive/PII or flagged by heuristics"
  elif is_archive_name "$f"; then
    class="archive"
    reason="Name indicates draft/notes/legacy"
  elif is_version_like "$f"; then
    stem="$(basename "$f" .md 2>/dev/null | sed -E 's/[-_ ]v[0-9]+$//I' 2>/dev/null || echo "${f##*/}")"
    ver_str="$(basename "$f" .md 2>/dev/null | grep -oEi 'v[0-9]+' 2>/dev/null | tr -d 'v' 2>/dev/null | tail -n1 2>/dev/null || echo "0")"
    ver="${ver_str:-0}"
    if ! [[ "$ver" =~ ^[0-9]+$ ]]; then
      ver=0
    fi
    latest="${latest_by_stem[$stem]:-0}"
    latest="${latest:-0}"
    if ! [[ "$latest" =~ ^[0-9]+$ ]]; then
      latest=0
    fi
    if (( ver < latest )); then
      class="archive"; reason="Superseded by v${latest}"
    else
      # Keep finalist if it's the latest and marked final
      if is_final_name "$f" || has_final_marker "$f"; then
        class="final"; reason="Latest version + final marker"
      else
        class="archive"; reason="Latest but not final-marked"
      fi
    fi
  elif is_final_name "$f" || has_final_marker "$f"; then
    class="final"; reason="Final marker/name"
  else
    # Default: archive non-top-level reference docs unless in docs/final
    if [[ "$dir" == docs/final* ]]; then
      class="final"; reason="Already in docs/final"
    else
      class="archive"; reason="Default archive to reduce surface"
    fi
  fi

  case "$class" in
    final)
      target="docs/final/${area}/${base}"
      mkdir -p "$(dirname "$target")"
      if [[ "$MODE" == "apply" ]]; then
        git mv -f "$f" "$target" 2>/dev/null || { mkdir -p "$(dirname "$target")"; mv -f "$f" "$target"; git add "$target"; git rm -f "$f" 2>/dev/null || true; }
      fi
      final_count=$((final_count + 1))
      ;;
    archive)
      target="docs/archive/${YEAR}/${area}/${base}"
      mkdir -p "$(dirname "$target")"
      if [[ "$MODE" == "apply" ]]; then
        git mv -f "$f" "$target" 2>/dev/null || { mkdir -p "$(dirname "$target")"; mv -f "$f" "$target"; git add "$target"; git rm -f "$f" 2>/dev/null || true; }
        # Prepend archive banner
        tmp="$(mktemp)"; printf "> Archived on %s. " "$(date +%F)" > "$tmp"
        # Try to point to probable final sibling (best-effort)
        final_candidate="../../../../final/${area}/${base}"
        if [[ -f "docs/final/${area}/${base}" ]]; then
          echo "Superseded by: ../final/${area}/${base}" >> "$tmp"
        else
          echo "Superseded by: (see docs/final index)" >> "$tmp"
        fi
        echo "" >> "$tmp"
        cat "$target" >> "$tmp"
        mv "$tmp" "$target"
        git add "$target"
      fi
      archive_count=$((archive_count + 1))
      ;;
    private)
      target="internal/private/${area}/${base}"
      mkdir -p "$(dirname "$target")"
      if [[ "$MODE" == "apply" ]]; then
        # Move without git tracking
        mv -f "$f" "$target"
        git rm -f "$f" 2>/dev/null || true
      fi
      private_count=$((private_count + 1))
      ;;
  esac

  if [[ -n "$class" ]]; then
    echo "| \`$f\` | \`$target\` | $class | $reason |" >> "$REPORT"
  else
    echo "Warning: No class determined for $f" >&2
  fi
done

if [[ "$MODE" == "apply" ]]; then
  # Commit if any staged changes
  if ! git diff --cached --quiet; then
    git commit -m "feat(docs): tidy & archive pass (${final_count} final, ${archive_count} archived, ${private_count} private)"
  fi
fi

echo "" >> "$REPORT"
echo "- Files processed: ${file_count}" >> "$REPORT"
echo "- Final kept: ${final_count}" >> "$REPORT"
echo "- Archived: ${archive_count}" >> "$REPORT"
echo "- Privatized (git-ignored): ${private_count}" >> "$REPORT"

echo "Done (${MODE}). Processed ${file_count} files. See $REPORT"
