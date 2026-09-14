#!/usr/bin/env bash
set -euo pipefail

# PRDuck upload — scans local coding-agent transcripts (Claude Code, Codex,
# opencode, Cursor, Antigravity, Copilot CLI), redacts credentials and your
# home path on this machine, uploads the redacted sessions, and opens your
# scored report.
#
# Downloads a standalone binary for this OS/arch (no Node required), verifies
# its sha512, and caches it at ~/.prduck/bin/prduck-<version>. Unrecognized
# platforms and a binary that fails to run fall through to npx.
#
# The command asks whether to upload sessions from every project or only
# the repo you are standing in. Skip the question by passing the scope
# through bash: curl … | bash -s -- --all, or -s -- --dir <path>.
#
# First run: your browser opens once so you can authorize this machine
# against your PRDuck account (email magic link — no password). After that,
# uploads are silent and land in your dashboard. Credentials live in
# ~/.prduck/credentials.json; revoke anytime from Connected devices.
# Headless/CI runs authenticate via the PRDUCK_TOKEN env var instead.

npx_fallback() {
  command -v node >/dev/null 2>&1 || { echo "prduck: node is required (>= 24)" >&2; exit 1; }
  major="$(node -p 'process.versions.node.split(".")[0]')"
  [ "$major" -ge 24 ] || { echo "prduck: needs Node >= 24, found $(node -v)" >&2; exit 1; }
  exec npx -y prduck@latest upload "$@"
}

prduck_main() {
  export PRDUCK_SITE_URL='https://prduck.tryproduck.com'
  local version='0.1.29'
  local bin="$HOME/.prduck/bin/prduck-$version"
  local os arch plat url sha tmp got want keep
  os="$(uname -s)"
  arch="$(uname -m)"
  if [ "$os" = Darwin ] && [ "$arch" = x86_64 ]; then
    if [ "$(sysctl -n sysctl.proc_translated 2>/dev/null || true)" = 1 ]; then
      arch=arm64
    fi
  fi
  case "${os}-${arch}" in
    Darwin-arm64) plat=darwin-arm64 ;;
    Darwin-x86_64) plat=darwin-x64 ;;
    Linux-x86_64) plat=linux-x64 ;;
    Linux-aarch64|Linux-arm64) plat=linux-arm64 ;;
    MINGW*|MSYS*|CYGWIN*)
      echo "prduck: Windows detected — no standalone binary, using npx." >&2
      echo "prduck: this needs Node >= 24 on your Windows PATH." >&2
      npx_fallback "$@" ;;
    *) plat= ;;
  esac
  if [ -z "$plat" ]; then
    npx_fallback "$@"
  fi
  if [ -x "$bin" ]; then
    exec "$bin" upload "$@"
  fi
  case "$plat" in
    darwin-arm64) url='https://registry.npmjs.org/prduck-darwin-arm64/-/prduck-darwin-arm64-0.1.29.tgz'; sha='ff98c9b5ab3d6cf455860f2fc9b55722059a74d89f664f841624ae2d767488b6352ba6d12a1856dbdb671d00bac5ecbab4a853f4efd1ab6e0d157bb221e920eb' ;;
    darwin-x64) url='https://registry.npmjs.org/prduck-darwin-x64/-/prduck-darwin-x64-0.1.29.tgz'; sha='b21a2353452f273c2302864e62bb0aac8c4c92bed4f930a2b7d55dd7d15fbc149a3c17f205bd01f3deb179da2f94091eaf889e67babfc97bde9336ebc2c64c6f' ;;
    linux-x64) url='https://registry.npmjs.org/prduck-linux-x64/-/prduck-linux-x64-0.1.29.tgz'; sha='22ad7259d25110666c7aa08c725a720dc9c9013043721fb8fd2e37fb46d2aca9118a7411f341097580cc6d4eb02c29f780c9a5373d87391948e2a2bbd8f6a5dd' ;;
    linux-arm64) url='https://registry.npmjs.org/prduck-linux-arm64/-/prduck-linux-arm64-0.1.29.tgz'; sha='73a3b627b4199727f063bc0797fbb0fb2b5713ad0ad7bf65db7fd53807a605b581fd1383012a7b90eb55ddb9337959506342f098e8c3ec867d453e360040586c' ;;
  esac
  mkdir -p "$HOME/.prduck/bin"
  tmp="$(mktemp -d "$HOME/.prduck/tmp.XXXXXX")"
  trap 'rm -rf "$tmp"' EXIT
  curl -fL --retry 3 --retry-connrefused --progress-bar -o "$tmp/pkg.tgz" "$url"
  if command -v sha512sum >/dev/null 2>&1; then
    got="$(sha512sum "$tmp/pkg.tgz" | awk '{print $1}')"
  elif command -v shasum >/dev/null 2>&1; then
    got="$(shasum -a 512 "$tmp/pkg.tgz" | awk '{print $1}')"
  elif command -v openssl >/dev/null 2>&1; then
    got="$(openssl dgst -sha512 "$tmp/pkg.tgz" | awk '{print $NF}')"
  else
    npx_fallback "$@"
  fi
  got="$(printf '%s' "$got" | tr '[:upper:]' '[:lower:]')"
  want="$(printf '%s' "$sha" | tr '[:upper:]' '[:lower:]')"
  if [ "$got" != "$want" ]; then
    echo "prduck: checksum mismatch" >&2
    npx_fallback "$@"
  fi
  tar -xzf "$tmp/pkg.tgz" -C "$tmp" package/prduck
  chmod +x "$tmp/package/prduck"
  mv "$tmp/package/prduck" "$bin"
  touch "$bin"
  rm -rf "$tmp"
  keep=0
  for f in $(ls -1t "$HOME/.prduck/bin"/prduck-* 2>/dev/null || true); do
    keep=$((keep + 1))
    if [ "$keep" -gt 2 ]; then
      rm -f "$f"
    fi
  done
  if ! "$bin" version >/dev/null 2>&1; then
    echo "prduck: binary failed to run; falling back to npx" >&2
    npx_fallback "$@"
  fi
  exec "$bin" upload "$@"
}

prduck_main "$@"
