#!/bin/bash
# check-chantiers.sh — signale un CHANTIERS.md qui a besoin d'un ménage.
# Lancé par .claude/hooks/session-start.sh : la sortie est lue par Claude au
# démarrage de chaque session. Règle : MD-LIB/collaboration.md, 8ter — les
# tâches terminées se retirent au fil de l'eau, leur récit va dans git log.
# N'échoue jamais : c'est un rappel, pas un blocage.

F="${1:-CHANTIERS.md}"
[ -f "$F" ] || exit 0

MAX_LIGNES=300   # au-delà, le fichier n'est plus relu en entier
MAX_JOURS=7      # en-tête « État au JJ/MM/AAAA » plus vieux que ça

raisons=()

lignes=$(wc -l < "$F")
[ "$lignes" -gt "$MAX_LIGNES" ] && raisons+=("$lignes lignes (plafond $MAX_LIGNES)")

etat=$(grep -m1 -oE 'État au \*\*[0-9]{2}/[0-9]{2}/[0-9]{4}' "$F" | grep -oE '[0-9]{2}/[0-9]{2}/[0-9]{4}')
if [ -z "$etat" ]; then
  raisons+=("pas de date « État au **JJ/MM/AAAA** » en tête")
else
  iso="${etat:6:4}-${etat:3:2}-${etat:0:2}"
  age=$(( ( $(date +%s) - $(date -d "$iso" +%s 2>/dev/null || date +%s) ) / 86400 ))
  [ "$age" -gt "$MAX_JOURS" ] && raisons+=("en-tête daté du $etat, il y a $age jours")
fi

faites=$(grep -cE '^#+ .*✅|~~' "$F")
[ "$faites" -gt 0 ] && raisons+=("$faites ligne(s) de tâches terminées (titre ✅ ou texte barré ~~)")

if [ "${#raisons[@]}" -gt 0 ]; then
  echo "🧹 $F à nettoyer :"
  for r in "${raisons[@]}"; do echo "   - $r"; done
  echo "   → Le proposer à l'utilisateur en début de session : retirer le terminé,"
  echo "     remonter l'invariant dans « Points à ne pas défaire », dater l'en-tête."
fi
exit 0
