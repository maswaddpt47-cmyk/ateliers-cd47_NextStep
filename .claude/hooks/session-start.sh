#!/bin/bash
set -euo pipefail

# Lancer les tests unitaires au démarrage de session
# Aucune dépendance à installer — node --test est natif Node.js

cd "$CLAUDE_PROJECT_DIR"

echo "🧪 Vérification de l'état des tests..."

FAIL=0

node --test utils.test.js       2>&1 | tail -4 || FAIL=1
node --test logic.test.js       2>&1 | tail -4 || FAIL=1
node --test contract.test.js    2>&1 | tail -4 || FAIL=1
node --test integration.test.js 2>&1 | tail -4 || FAIL=1

if [ $FAIL -eq 1 ]; then
  echo "⛔ Des tests échouent — vérifier avant de modifier le code."
else
  echo "✅ Tous les tests passent."
fi
