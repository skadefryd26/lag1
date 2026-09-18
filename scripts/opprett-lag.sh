#!/usr/bin/env bash
# Setter opp ett lag, så deltakerne ikke trenger å gjøre noe av dette selv.
#
#   ./scripts/opprett-lag.sh 3 githubnavn1 githubnavn2 githubnavn3
#
# Oppretter skadefryd26/lag3 fra malen (offentlig), lager og kobler boardet,
# inviterer deltakerne med skrivetilgang, og skriver ut teksten laget skal
# lime inn i AI-hjelperen sin. Trygt å kjøre på nytt, for eksempel for å
# legge til en deltaker som kom sent.
#
# Krever gh innlogget med project-tilgang (gh auth refresh -s project) og node.

set -euo pipefail

ORG="skadefryd26"
TEMPLATE="skadefryd2026-base"
HERE="$(cd "$(dirname "$0")" && pwd)"

ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
info() { printf '  %s\n' "$*"; }

[[ $# -ge 1 ]] || { echo "Bruk: $0 <lagnummer> [githubnavn ...]"; exit 1; }
n="$1"; shift
repo="lag$n"

command -v gh >/dev/null   || { echo "gh er ikke installert."; exit 1; }
command -v node >/dev/null || { echo "node er ikke installert."; exit 1; }
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  echo "GITHUB_TOKEN er satt og overstyrer gh-innloggingen din. Kjør 'unset GITHUB_TOKEN' først."
  exit 1
fi

printf '\n\033[1m%s\033[0m\n' "$repo"

if [[ "$(gh repo view "$ORG/$TEMPLATE" --json isTemplate --jq .isTemplate)" != "true" ]]; then
  gh repo edit "$ORG/$TEMPLATE" --template >/dev/null
  ok "$TEMPLATE er markert som mal"
fi

if gh repo view "$ORG/$repo" >/dev/null 2>&1; then
  info "repoet finnes allerede"
else
  gh repo create "$ORG/$repo" --template "$ORG/$TEMPLATE" --public >/dev/null
  ok "opprettet https://github.com/$ORG/$repo"
fi

GH_REPO="$ORG/$repo" node "$HERE/../.github/skills/skadefryd-tasks/board.mjs" ensure | sed 's/^/  ✓ /'
ok "boardet er klart"

gh label create idé --repo "$ORG/$repo" --color BFD4F2 --description "Nevnt, ikke avklart ennå" --force >/dev/null
ok "etiketten idé finnes"

for user in "$@"; do
  gh api -X PUT "repos/$ORG/$repo/collaborators/$user" -f permission=push >/dev/null
  ok "invitert $user"
done

cat <<EOF

Teksten lag $n limer inn i AI-hjelperen sin — lik for alle på laget:
────────────────────────────────────────────────────────────────────────
Hei! Jeg er med på Skadefryd, lag $n: https://github.com/$ORG/$repo

1. Hent prosjektet ned til mappa skadefryd/$repo i hjemmemappa mi, hvis det ikke ligger der allerede. Mangler maskinen det som trengs for å hente det, står det hvordan du ordner det i .github/skills/skadefryd-machine-setup/SKILL.md i prosjektet på GitHub.
2. Les AGENTS.md i prosjektmappa og følg den.

Gjør alt for meg. Jeg skal ikke skrive noe i terminalen.
────────────────────────────────────────────────────────────────────────
EOF
