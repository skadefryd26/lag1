#!/usr/bin/env bash
# Oppretter repo + prosjektboard for ett eller flere lag.
#
#   ./scripts/setup-lag.sh 1 2 3        # lager lag1, lag2, lag3
#   ./scripts/setup-lag.sh $(seq 1 8)   # lager lag1 .. lag8
#
# Scriptet er idempotent: kjør det på nytt uten å ødelegge noe.

set -euo pipefail

ORG="skadefryd26"
TEMPLATE="skadefryd2026-base"

# Swimlanes. Endre her hvis dere vil ha andre kolonner — rekkefølgen er den
# rekkefølgen de får på boardet.
SWIMLANES=(
  "Idé|GRAY|Nevnt, ikke avklart ennå"
  "Klar|BLUE|Spørsmålene er stilt, oppgaven er definert"
  "Under arbeid|YELLOW|Det finnes en branch"
  "Review|ORANGE|Venter på teamet, PR er åpen"
  "Ferdig|GREEN|Merget til main"
)

# Logg går til stderr. stdout er reservert for returverdier, slik at
# $(ensure_repo ...) fanger id-en og ikke logglinjene.
info() { printf '  %s\n' "$*" >&2; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*" >&2; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*" >&2; }

preflight() {
  command -v gh >/dev/null || { echo "gh er ikke installert."; exit 1; }
  command -v jq >/dev/null || { echo "jq er ikke installert."; exit 1; }

  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    warn "GITHUB_TOKEN er satt og overstyrer innlogget bruker."
    warn "Kjør 'unset GITHUB_TOKEN' først hvis scopes mangler."
  fi

  if ! gh project list --owner "$ORG" --limit 1 >/dev/null 2>&1; then
    echo "Mangler project-scope. Kjør dette først:"
    echo "    gh auth refresh -s project"
    exit 1
  fi
}

ensure_template() {
  if [[ "$(gh repo view "$ORG/$TEMPLATE" --json isTemplate --jq .isTemplate)" != "true" ]]; then
    gh repo edit "$ORG/$TEMPLATE" --template >/dev/null
    ok "$TEMPLATE er nå markert som template-repo"
  fi
}

ensure_repo() {
  local name="$1"
  if gh repo view "$ORG/$name" >/dev/null 2>&1; then
    info "repo $name finnes allerede"
  else
    gh repo create "$ORG/$name" --template "$ORG/$TEMPLATE" --private >/dev/null
    ok "opprettet repo $name"
  fi
  gh repo view "$ORG/$name" --json id --jq .id
}

ensure_project() {
  local name="$1" num
  num=$(gh project list --owner "$ORG" --format json \
        | jq -r --arg t "$name" '.projects[] | select(.title == $t) | .number' | head -1)

  if [[ -z "$num" ]]; then
    num=$(gh project create --owner "$ORG" --title "$name" --format json | jq -r .number)
    ok "opprettet prosjekt $name (#$num)"
  else
    info "prosjekt $name finnes allerede (#$num)"
  fi
  echo "$num"
}

set_swimlanes() {
  local num="$1" field_id options_json

  field_id=$(gh project field-list "$num" --owner "$ORG" --format json \
             | jq -r '.fields[] | select(.name == "Status") | .id')

  if [[ -z "$field_id" ]]; then
    warn "fant ikke Status-feltet på #$num — hopper over swimlanes"
    return
  fi

  options_json=$(printf '%s\n' "${SWIMLANES[@]}" | jq -R -s '
    split("\n") | map(select(length > 0)) | map(split("|")) |
    map({name: .[0], color: .[1], description: .[2]})')

  # -f sender alt som streng. singleSelectOptions er en liste av objekter,
  # så variablene må bygges som ekte JSON og sendes med --input.
  jq -n --arg q '
    mutation($fieldId: ID!, $options: [ProjectV2SingleSelectFieldOptionInput!]!) {
      updateProjectV2Field(input: {fieldId: $fieldId, singleSelectOptions: $options}) {
        projectV2Field { ... on ProjectV2SingleSelectField { options { name } } }
      }
    }' --arg fieldId "$field_id" --argjson options "$options_json" \
    '{query: $q, variables: {fieldId: $fieldId, options: $options}}' \
    | gh api graphql --input - >/dev/null

  ok "satte swimlanes på #$num"
}

link_project() {
  local num="$1" repo_id="$2" project_id
  project_id=$(gh project view "$num" --owner "$ORG" --format json | jq -r .id)

  gh api graphql -f query='
    mutation($projectId: ID!, $repositoryId: ID!) {
      linkProjectV2ToRepository(input: {projectId: $projectId, repositoryId: $repositoryId}) {
        repository { name }
      }
    }' -f projectId="$project_id" -f repositoryId="$repo_id" >/dev/null \
    && ok "koblet prosjekt #$num til repoet" \
    || info "prosjekt #$num var allerede koblet"
}

main() {
  [[ $# -gt 0 ]] || { echo "Bruk: $0 <lagnummer...>   f.eks. $0 1 2 3"; exit 1; }

  preflight
  ensure_template

  for n in "$@"; do
    local name="lag$n"
    printf '\n\033[1m%s\033[0m\n' "$name"
    repo_id=$(ensure_repo "$name")
    num=$(ensure_project "$name")
    set_swimlanes "$num"
    link_project "$num" "$repo_id"
  done

  printf '\nFerdig. Boardene ligger på https://github.com/orgs/%s/projects\n' "$ORG"
}

main "$@"
