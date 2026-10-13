#!/bin/bash
# Attend la fin des workflows GitHub Actions d'un commit poussé et dit s'ils
# ont réussi (13/10/2026). But : ne jamais annoncer « c'est en ligne » sur un
# déploiement qui a échoué (règle 2 de CLAUDE.md, oubliée le 13/10 : deux
# déploiements NextStep rouges passés inaperçus).
#
# Deux usages :
#   scripts/attendre-deploiement.sh [branche]   (défaut : main) — dans le dépôt
#   scripts/attendre-deploiement.sh --hook      — hook PostToolUse (Bash) de
#     .claude/settings.json : après un `git push`, vérifie les deux jumeaux
#     (ce dépôt et ATELIERS_NEWGEN / ateliers-cd47_NextStep à côté) dont
#     origin/main ou origin/sandbox vient d'être mis à jour par un push.
#
# Code de sortie (mode direct) : 0 tout vert, 1 un workflow en échec,
# 2 délai dépassé. En mode --hook, le résultat est renvoyé à Claude en JSON.

ICI="$(cd "$(dirname "$0")/.." && pwd)"
PARENT="$(dirname "$ICI")"
DELAI=${ATTENTE_DEPLOIEMENT_MAX:-480}   # secondes
PAS=20

api() {  # GET sur l'API GitHub, avec le jeton de session s'il existe
  if [ -n "${GITHUB_TOKEN:-}" ]; then
    curl -fsS -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" "https://api.github.com/$1"
  else
    curl -fsS -H "Accept: application/vnd.github+json" "https://api.github.com/$1"
  fi
}

# attendre <dossier du dépôt> <branche> : une ligne de résumé par workflow.
attendre() {
  local dir="$1" br="$2" slug sha debut etat
  slug=$(git -C "$dir" remote get-url origin | sed -E 's#.*github\.com[/:]##; s#\.git$##')
  sha=$(git -C "$dir" rev-parse "origin/$br")
  debut=$(date +%s)
  sleep 5
  while :; do
    etat=$(api "repos/$slug/actions/runs?head_sha=$sha&per_page=50" 2>/dev/null | python3 -c '
import sys, json
try: runs = json.load(sys.stdin)["workflow_runs"]
except Exception: print("ATTENTE"); sys.exit()
if not runs: print("ATTENTE"); sys.exit()
# Dernière tentative de chaque workflow seulement.
der = {}
for r in runs:
    if r["name"] not in der or r["run_attempt"] > der[r["name"]]["run_attempt"]: der[r["name"]] = r
if any(r["status"] != "completed" for r in der.values()): print("ATTENTE"); sys.exit()
ko = [r for r in der.values() if r["conclusion"] not in ("success", "skipped", "neutral")]
print("KO" if ko else "OK")
for r in sorted(der.values(), key=lambda r: r["name"]):
    print("  " + ("✅" if r not in ko else "❌") + " " + r["name"] + " : " + str(r["conclusion"]) + ("" if r not in ko else " — " + r["html_url"]))
')
    case "$etat" in
      OK*) echo "✅ $(basename "$dir") $br ${sha:0:7} : déploiement réussi"; echo "${etat#OK}" | sed '/^$/d'; return 0;;
      KO*) echo "❌ $(basename "$dir") $br ${sha:0:7} : ÉCHEC — ne pas annoncer « en ligne »"; echo "${etat#KO}" | sed '/^$/d'; return 1;;
    esac
    if [ $(( $(date +%s) - debut )) -ge "$DELAI" ]; then
      echo "⏳ $(basename "$dir") $br ${sha:0:7} : pas fini après ${DELAI}s — revérifier avant d'annoncer"; return 2
    fi
    sleep "$PAS"
  done
}

if [ "${1:-}" != "--hook" ]; then
  git -C "$ICI" fetch -q origin "${1:-main}" 2>/dev/null
  attendre "$ICI" "${1:-main}"; exit $?
fi

# ── Mode hook ────────────────────────────────────────────────────────────
cmd=$(python3 -c 'import sys,json; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null)
printf '%s' "$cmd" | grep -q 'git push' || exit 0
maintenant=$(date +%s); rapport=""; pire=0
for dir in "$PARENT/ateliers-cd47_NextStep" "$PARENT/ATELIERS_NEWGEN"; do
  [ -d "$dir/.git" ] || continue
  for br in main sandbox; do
    # Le push met à jour origin/<br> : son reflog date l'envoi.
    t=$(git -C "$dir" reflog show --date=unix "origin/$br" -1 2>/dev/null | sed -nE 's/.*@\{([0-9]+)\}: update by push.*/\1/p')
    [ -n "$t" ] && [ $((maintenant - t)) -le "${ATTENTE_FENETRE:-300}" ] || continue
    sortie=$(attendre "$dir" "$br"); code=$?
    rapport="$rapport$sortie"$'\n'; [ $code -gt $pire ] && pire=$code
  done
done
[ -n "$rapport" ] || exit 0
RAPPORT="$rapport" PIRE="$pire" python3 -c '
import os, json
r = os.environ["RAPPORT"].strip(); ko = os.environ["PIRE"] != "0"
print(json.dumps({
  "systemMessage": r.splitlines()[0] if not ko else "❌ Déploiement : échec ou pas fini — voir le détail",
  "hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext":
    "Résultat des workflows GitHub Actions après ce push (scripts/attendre-deploiement.sh) :\n" + r +
    ("\nNe pas annoncer « en ligne » : corriger ou signaler l’échec à l’utilisateur." if ko else "")}}))'
