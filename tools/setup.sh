#!/usr/bin/env bash
# Chạy ĐẦU MỖI PHIÊN: khôi phục Remotion vào máy ảo (giải nén 1 lần) và kiểm tra công cụ.
# Dùng: source tools/setup.sh
C="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Tên thư mục mount có thể chứa ":" (vd "E:--ChuyệnNhàChàBông") làm hỏng PATH -> trỏ qua link không có ":"
mkdir -p "$HOME/.cncb_bin"
for b in ffmpeg ffprobe; do ln -sf "$C/tools/vendor/bin/$b" "$HOME/.cncb_bin/$b"; done
export PATH="$HOME/.cncb_bin:$PATH"
export CHABONG_ASSETS="$C/assets"
export REMOTION_DIR="$C/_remotion_cache"   # dat tren o cua nguoi dung vi o may ao (/sessions) rat nho
if [ ! -d "$REMOTION_DIR/node_modules/remotion" ]; then
  mkdir -p "$REMOTION_DIR"
  cp -r "$C/tools/remotion/src" "$C/tools/remotion/render.mjs" "$C/tools/remotion/package.json" "$REMOTION_DIR/"
  tar -xzf "$C/tools/remotion/node_modules.tgz" -C "$REMOTION_DIR"
fi
cp -r "$C/tools/remotion/src" "$C/tools/remotion/render.mjs" "$REMOTION_DIR/"   # luôn lấy bản code mới nhất
echo "ffmpeg: $(ffmpeg -version | head -1 | cut -d' ' -f3) | remotion: $(node -p "require('$REMOTION_DIR/node_modules/remotion/package.json').version")"
