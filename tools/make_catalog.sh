#!/usr/bin/env bash
# Dựng lại bảng mẫu (chạy sau khi sửa src/*.tsx, tools/presets.json hoặc style.json):
#   cd <thư mục kênh> && source tools/setup.sh && timeout 170 bash tools/make_catalog.sh
# -> tools/remotion/catalog_stickers.png  (sticker cơ bản)     catalog_chu.png          (kiểu chữ mốc giờ)
#    tools/remotion/catalog_chude.png     (sticker theo chủ đề) catalog_chu_sticker.png  (kiểu chữ sticker)
#    tools/remotion/catalog_combo.png     (combo dựng sẵn trong tools/presets.json)
#    tools/remotion/catalog_netve.png     (nét trắng vẽ tay kiểu "Yummy!" + chữ ký script)
#    tools/remotion/catalog_netve2.png    (nét trắng mở rộng: ăn uống + cảm xúc)
#    tools/remotion/catalog_netve3.png    (nét trắng mở rộng: thú ló + em bé & trang trí)
#    tools/remotion/catalog_combo2.png    (combo nét trắng mở rộng *_netve)
set -euo pipefail
C="$(cd "$(dirname "$0")/.." && pwd)"
TMPC="$HOME/catalog_tmp"; mkdir -p "$TMPC"; rm -f "$TMPC"/*.png
python3 - "$C" "$TMPC" <<'EOF'
import json, sys
c, out = sys.argv[1:3]
theme = json.load(open(f"{c}/style.json", encoding="utf-8")).get("theme", {})
pre = json.load(open(f"{c}/tools/presets.json", encoding="utf-8"))
presets = [{"name": k, "desc": v.get("desc", ""), "items": v["items"]} for k, v in pre.items() if not k.startswith("_")]
pages = [(1, "catalog_stickers"), (2, "catalog_chu"), (3, "catalog_chude"), (4, "catalog_chu_sticker"), (5, "catalog_combo"), (6, "catalog_netve"), (7, "catalog_netve2"), (8, "catalog_netve3"), (9, "catalog_combo2")]
jobs = [{"comp": "Catalog", "props": {"page": p, "seconds": 2, "theme": theme, **({"presets": presets[:33]} if p == 5 else {"presets": presets[33:]} if p == 9 else {})},
         "out": f"{out}/{n}.png", "still": True, "frame": 0} for p, n in pages]
json.dump(jobs, open(f"{out}/jobs.json", "w", encoding="utf-8"), ensure_ascii=False)
EOF
node "$REMOTION_DIR/render.mjs" "$TMPC/jobs.json"
rm -rf "${TMPDIR:-$HOME/tmp}"/remotion-webpack-bundle-* 2>/dev/null || true
cp "$TMPC"/catalog_*.png "$C/tools/remotion/"   # cp ghi đè, không cần quyền xoá
echo DONE
