#!/usr/bin/env bash
# Regenerate the input files in tests/fixtures from the e2e stack. Phase 1 is an init, a validate, and the baseline apply.
# Phase 2 produces the "changes" scenario. Phase 3 produces the "failures" scenario.
# Phase 4 produces the "destroy" scenario.
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
    -e 's/^\{"time":"[^"]*"/{"time":"2026-01-01T00:00:00Z"/' \
    -e 's#\.terragrunt-cache/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+#.terragrunt-cache/x/y#g' \
    -e "s#$REPO#/repo#g" \
    -e 's/[0-9]+ms$/0ms/' \
    -e '/^\{/s/ [0-9]+ms(\\n|")/ 0ms\1/g' \
    "$1" > "$2"
}

normalize_report() {
  jq --indent 2 '[.[] | .Started = "2026-01-01T00:00:00Z" | .Ended = "2026-01-01T00:00:01Z"
    | if .Cause then .Cause |= (gsub("\\.terragrunt-cache/[A-Za-z0-9_-]+/[A-Za-z0-9_-]+"; ".terragrunt-cache/x/y") | gsub("'"$REPO"'"; "/repo")) else . end]' \
    "$1" > "$2"
}

collect_json_into() {
  local name=$1 out=$2
  find "$STACK/.terragrunt-stack" -name "$name" -path '*/.terragrunt-cache/*' | while read -r f; do
    local rel=${f#"$STACK"/}
    local unit=${rel%%/.terragrunt-cache/*}
    mkdir -p "$out/$unit/.terragrunt-cache/x/y"
    sed -E 's/"@timestamp":"[^"]*"/"@timestamp":"2026-01-01T00:00:00Z"/' "$f" > "$out/$unit/.terragrunt-cache/x/y/$name"
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

# run_plan <out> <log> [<terragrunt option>...]
# Only the run that writes plan.log keeps its report file, its tfplan.json files, and its -json-into files.
run_plan() {
  local out=$1 log=$2 tmp
  shift 2
  tmp=$(mktemp -d)
  find "$STACK/.terragrunt-stack" -name plan.json -path '*/.terragrunt-cache/*' -delete
  set +e
  terragrunt run --all "$@" --json-out-dir "$tmp/plans" --report-file "$tmp/report.json" --report-format json \
    -- plan -no-color -compact-warnings -concise -json-into=plan.json > "$tmp/$log" 2>&1
  echo "plan exit code: $?"
  set -e
  mkdir -p "$out"
  normalize_log "$tmp/$log" "$out/$log"
  if [ "$log" = plan.log ]; then
    normalize_report "$tmp/report.json" "$out/report.json"
    collect_plans "$tmp/plans" "$out/plans"
    collect_json_into plan.json "$out/json-into"
  fi
  rm -rf "$tmp"
}

# run_command <command> <out>, where <command> is init or validate.
run_command() {
  local command=$1 out=$2 tmp
  tmp=$(mktemp -d)
  set +e
  terragrunt run --all --report-file "$tmp/report.json" --report-format json \
    -- "$command" -no-color > "$tmp/$command.log" 2>&1
  echo "$command exit code: $?"
  set -e
  mkdir -p "$out"
  normalize_log "$tmp/$command.log" "$out/$command.log"
  normalize_report "$tmp/report.json" "$out/report.json"
  rm -rf "$tmp"
}

# run_apply <command> <out>, where <command> is apply or destroy. An empty <out> keeps no files.
run_apply() {
  local command=$1 out=$2 tmp
  tmp=$(mktemp -d)
  find "$STACK/.terragrunt-stack" -name "$command.json" -path '*/.terragrunt-cache/*' -delete
  set +e
  terragrunt run --all --report-file "$tmp/report.json" --report-format json \
    -- "$command" -no-color -compact-warnings "-json-into=$command.json" > "$tmp/$command.log" 2>&1
  echo "$command exit code: $?"
  set -e
  if [ -n "$out" ]; then
    mkdir -p "$out"
    normalize_log "$tmp/$command.log" "$out/$command.log"
    normalize_report "$tmp/report.json" "$out/report.json"
    collect_json_into "$command.json" "$out/apply-json"
  fi
  rm -rf "$tmp"
}

rm -rf "$E2E/.state" "$STACK/.terragrunt-stack" "$E2E/modules/demo/.out"
for scenario in "$FIXTURES"/{changes,failures}/{plan,apply} "$FIXTURES/destroy/destroy" "$FIXTURES/baseline/init" "$FIXTURES/baseline/validate"; do
  rm -rf "$scenario"/{plan.log,plan.jsonl,apply.log,destroy.log,init.log,validate.log,report.json,plans,json-into,apply-json}
done
cd "$STACK"
terragrunt stack generate > /dev/null 2>&1

export E2E_PHASE=1
run_command init "$FIXTURES/baseline/init"
run_command validate "$FIXTURES/baseline/validate"
run_apply apply ""

export E2E_PHASE=2
run_plan "$FIXTURES/changes/plan" plan.log
run_plan "$FIXTURES/changes/plan" plan.jsonl --log-format=json
run_apply apply "$FIXTURES/changes/apply"

export E2E_PHASE=3
run_plan "$FIXTURES/failures/plan" plan.log
run_plan "$FIXTURES/failures/plan" plan.jsonl --log-format=json
run_apply apply "$FIXTURES/failures/apply"

export E2E_PHASE=4
run_apply destroy "$FIXTURES/destroy/destroy"

rm -rf "$E2E/.state" "$STACK/.terragrunt-stack" "$E2E/modules/demo/.out"
