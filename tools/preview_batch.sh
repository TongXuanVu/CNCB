#!/usr/bin/env bash
# Chỉ ĐỌC clip để lên kế hoạch: ghi độ dài vào preview/clips.tsv và 1 ảnh 4 khung hình mỗi clip vào preview/.
# Dùng: bash tools/preview_batch.sh batches/<mẻ>
set -euo pipefail
cd "$(dirname "$0")/.."
B="$1"; mkdir -p "$B/preview"
: > "$B/preview/clips.tsv"
for f in "$B"/clips/*; do
  [ -f "$f" ] || continue
  name=$(basename "$f"); ext="${name##*.}"; ext="${ext,,}"
  case "$ext" in
    jpg|jpeg|png|webp) echo -e "$name\tanh\t-" >> "$B/preview/clips.tsv"; continue;;
  esac
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  echo -e "$name\tvideo\t$d" >> "$B/preview/clips.tsv"
  out="$B/preview/${name%.*}.jpg"
  [ -s "$out" ] && continue
  ffmpeg -v error -y -i "$f" -vf "fps=4/$(printf '%.3f' "$d"),scale=160:-1,tile=4x1" -frames:v 1 "$out" || true
done
cat "$B/preview/clips.tsv"
