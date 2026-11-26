#!/usr/bin/env bash
# Checks the static site before it is published. Needs only bash, grep and sed.
#   1. Every local file an HTML page points at exists.
#   2. Every in-page link (#name) on a page has a matching id on that page.
#   3. No page uses a root-absolute path (/assets/...), which would break when
#      the site is served from a sub-folder such as user.github.io/repo/.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)/site"
fail=0

for page in "$root"/*.html; do
  name="$(basename "$page")"

  # href="..." and src="..." values, one per line.
  refs="$(grep -oE '(href|src)="[^"]*"' "$page" | sed -E 's/^(href|src)="//; s/"$//' || true)"

  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    case "$ref" in
      http://*|https://*|mailto:*|tel:*) continue ;;
      '#'*)
        id="${ref#\#}"
        if ! grep -q "id=\"$id\"" "$page"; then
          echo "FAIL $name: link $ref has no matching id"
          fail=1
        fi
        ;;
      /*)
        echo "FAIL $name: root-absolute path $ref (use a relative path)"
        fail=1
        ;;
      ./) ;;
      *)
        target="${ref%%#*}"
        target="${target%%\?*}"
        if [ ! -e "$root/$target" ]; then
          echo "FAIL $name: missing file $ref"
          fail=1
        fi
        ;;
    esac
  done <<< "$refs"
done

for required in index.html 404.html .nojekyll robots.txt; do
  if [ ! -e "$root/$required" ]; then
    echo "FAIL missing site/$required"
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "Site check failed."
  exit 1
fi
echo "Site check passed."
