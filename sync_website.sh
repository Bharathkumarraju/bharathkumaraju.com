#!/usr/bin/env bash
# Sync the static site to S3 (apex + www buckets).
# Excludes the worker/ folder, scripts, git, and docs — only static assets go to S3.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"

aws s3 sync "$HERE/" s3://bharathkumaraju.com \
  --exclude "*.sh" --exclude ".DS_Store" --exclude "*.md" \
  --exclude ".git/*" --exclude "LICENSE" --exclude "worker/*" \
  --profile bharaths

aws s3 sync "$HERE/" s3://www.bharathkumaraju.com \
  --exclude "*.sh" --exclude ".DS_Store" --exclude "*.md" \
  --exclude ".git/*" --exclude "LICENSE" --exclude "worker/*" \
  --profile bharaths
