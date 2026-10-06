#!/usr/bin/env bash
# Cheap guard against committing real credentials. Not a replacement for a proper secret scanner.
set -euo pipefail
pattern='(rzp_(live|test)_[A-Za-z0-9]{8,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35})'
if grep -rEn \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
  --exclude=check-no-secrets.sh --exclude=package-lock.json \
  "$pattern" . ; then
  echo "Possible secret found. Remove it and rotate the credential."
  exit 1
fi
echo "No obvious secrets found."
