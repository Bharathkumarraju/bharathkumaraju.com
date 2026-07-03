#!/usr/bin/env bash
# Invalidate the CloudFront cache after a deploy.
set -euo pipefail
aws cloudfront create-invalidation \
  --distribution-id=E1YYMBUH8BLLGN \
  --paths "/*" \
  --profile bharaths
