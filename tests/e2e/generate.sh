#!/usr/bin/env bash
# Regenerate tests/fixtures from the e2e stack. Phase 1 is the baseline apply,
# phase 2 produces the "changes" scenario, and phase 3 the "failures" scenario.
set -euo pipefail

cd "$(dirname "$0")"
E2E=$(pwd)
REPO=$(cd ../.. && pwd)
FIXTURES=$REPO/tests/fixtures
STACK=$E2E/stack

export TG_PROVIDER_CACHE=1 TG_NON_INTERACTIVE=1 TG_NO_COLOR=1

normalize_log() {
  sed -E \
    -e 's/^[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3} /00:00:00.000 /' \
    -e 's#\.terragrunt-cache/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+#.terragrunt-cache/x/y#g' \
    -e "s#$REPO#/repo#g" \
    -e 's/[0-9]+ms$/0ms/' \
    "$1" > "$2"
}

normalize_report() {
  jq --indent 2 '[.[] | .Started = "2026-01-01T00:00:00Z" | .Ended = "2026-01-01T00:00:01Z"
    | if .Cause then .Cause |= (gsub("\\.terragrunt-cache/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+"; ".terragrunt-cache/x/y") | gsub("'"$REPO"'"; "/repo")) else . end]' \
    "$1" > "$2"
}

collect_apply_json() {
  local out=$1
  find "$STACK/.terragrunt-stack" -name apply.json -path '*/.terragrunt-cache/*' | while read -r f; do
    local rel=${f#"$STACK"/}
    local unit=${rel%%/.terragrunt-cache/*}
    mkdir -p "$out/$unit/.terragrunt-cache/x/y"
    sed -E 's/"@timestamp":"[^"]*"/"@timestamp":"2026-01-01T00:00:00Z"/' "$f" > "$out/$unit/.terragrunt-cache/x/y/apply.json"
  done
}

collect_plans() {
  local src=$1 out=$2
  find "$src" -name tfplan.json | while read -r f; do
    local rel=${f#"$src"/}
    mkdir -p "$out/$(dirname "$rel")"
    jq --indent 2 '.timestamp = "2026-01-01T00:00:00Z"' "$f" > "$out/$rel"
  done
}

run_plan() {
  local out=$1 tmp
  tmp=$(mktemp -d)
  set +e
  terragrunt run --all --json-out-dir "$tmp/plans" --report-file "$tmp/report.json" --report-format json \
    -- plan -no-color -compact-warnings -concise > "$tmp/plan.log" 2>&1
  echo "plan exit code: $?"
  set -e
  mkdir -p "$out"
  normalize_log "$tmp/plan.log" "$out/plan.log"
  normalize_report "$tmp/report.json" "$out/report.json"
  collect_plans "$tmp/plans" "$out/plans"
  rm -rf "$tmp"
}

run_apply() {
  local out=$1 tmp
  tmp=$(mktemp -d)
  find "$STACK/.terragrunt-stack" -name apply.json -path '*/.terragrunt-cache/*' -delete
  set +e
  terragrunt run --all --report-file "$tmp/report.json" --report-format json \
    -- apply -no-color -compact-warnings -json-into=apply.json > "$tmp/apply.log" 2>&1
  echo "apply exit code: $?"
  set -e
  if [ -n "$out" ]; then
    mkdir -p "$out"
    normalize_log "$tmp/apply.log" "$out/apply.log"
    normalize_report "$tmp/report.json" "$out/report.json"
    collect_apply_json "$out/apply-json"
  fi
  rm -rf "$tmp"
}

rm -rf "$E2E/.state" "$STACK/.terragrunt-stack" "$E2E/modules/demo/.out" "$FIXTURES/changes" "$FIXTURES/failures"
cd "$STACK"
terragrunt stack generate > /dev/null 2>&1

export E2E_PHASE=1
run_apply ""

export E2E_PHASE=2
run_plan "$FIXTURES/changes/plan"
run_apply "$FIXTURES/changes/apply"

export E2E_PHASE=3
run_plan "$FIXTURES/failures/plan"
run_apply "$FIXTURES/failures/apply"

rm -rf "$E2E/.state" "$STACK/.terragrunt-stack" "$E2E/modules/demo/.out"
