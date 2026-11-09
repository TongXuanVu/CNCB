#!/usr/bin/env bash
# Cài lần đầu sau khi tải repo về (chạy trong máy ảo Linux của Claude, từ thư mục gốc dự án):
#   bash tools/install.sh
# Tải ffmpeg 8.1 (BtbN), ffmpeg-skill (MIT) và cài Remotion -> tools/remotion/node_modules.tgz. Mất ~3–5 phút,
# nếu bị ngắt (giới hạn ~170 giây/lệnh) thì chạy lại, bước đã xong sẽ bỏ qua.
set -euo pipefail
C="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
T="$HOME/cncb_install"; mkdir -p "$T" "$C/tools/vendor/bin"

if [ ! -x "$C/tools/vendor/bin/ffmpeg" ]; then
  echo "[1/3] tải ffmpeg 8.1..."
  U=https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n8.1-latest-linux64-gpl-8.1.tar.xz
  curl -sL -C - -o "$T/ff.tar.xz" "$U"
  tar -xJf "$T/ff.tar.xz" -C "$T" --wildcards '*/bin/ffmpeg' '*/bin/ffprobe'
  cp "$T"/ffmpeg-n8.1*/bin/ffmpeg "$T"/ffmpeg-n8.1*/bin/ffprobe "$C/tools/vendor/bin/"
  chmod +x "$C/tools/vendor/bin/"*; rm -rf "$T/ff.tar.xz" "$T"/ffmpeg-n8.1*
fi
if [ ! -f "$C/tools/vendor/ffmpeg-skill/SKILL.md" ]; then
  echo "[2/3] tải ffmpeg-skill..."
  rm -rf "$T/ffs"; git clone -q --depth 1 https://github.com/kajisho5/ffmpeg-skill.git "$T/ffs"
  rm -rf "$T/ffs/.git"; cp -r "$T/ffs" "$C/tools/vendor/ffmpeg-skill"; rm -rf "$T/ffs"
fi
if [ ! -f "$C/tools/remotion/node_modules.tgz" ]; then
  echo "[3/3] cài Remotion..."
  mkdir -p "$T/rm"; cp "$C/tools/remotion/package.json" "$C/tools/remotion/package-lock.json" "$T/rm/"
  (cd "$T/rm" && npm ci --no-audit --no-fund)
  # nén thẳng sang ổ của người dùng để khỏi chiếm ổ máy ảo (rất nhỏ)
  tar -czf - -C "$T/rm" node_modules > "$C/tools/remotion/node_modules.tgz"
  rm -rf "$T/rm"
fi
rm -rf "$T"
echo "Xong. Kiểm tra: source tools/setup.sh"
