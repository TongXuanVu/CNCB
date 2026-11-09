#!/usr/bin/env bash
# Tạo mẻ mới từ Video/clip, Video/template, Video/mp3 (mô tả đọc từ stdin -> mota.txt).
# Dùng: bash tools/new_batch.sh [-t template]... [-m mp3]... < mota_tam.txt
#   -> in đường dẫn mẻ mới (+ danh sách video v1, v2... nếu nhiều)
# Clip: CHUYỂN HẾT Video/clip/* vào clips/, đổi tên 1, 2, 3... theo thứ tự tên file gốc.
# Template: chỉ lấy file video (mp4/mov/m4v/webm/mkv/avi). CHỈ CHUYỂN template được chọn (-t), còn lại để nguyên.
# Mp3: chỉ lấy file âm thanh (mp3/m4a/wav/aac/ogg/flac). CHỈ CHÉP (bản gốc giữ trong Video/mp3).
# Không -t/-m: thư mục chỉ có 1 file thì tự lấy file đó; nhiều file thì dừng, in danh sách để chọn (mã 5).
# Ghép template + mp3 theo THỨ TỰ đã chọn (hoặc thứ tự tên file):
#   1 template + 1 mp3  -> 1 video:  <mẻ>/template.<đuôi>, <mẻ>/mp3.<đuôi>, plan.json ở <mẻ>/
#   N template + N mp3  -> N video:  <mẻ>/v1/, v2/... mỗi thư mục có template.*, mp3.*, plan.json, output/ riêng
#   1 template + N mp3 (hoặc N + 1) -> N video, file duy nhất được dùng cho mọi v
# ten_goc.txt ghi tên mới = tên gốc.
# Mã thoát: 1 = Video/clip trống | 2 = sai cú pháp | 3 = thiếu template hoặc mp3 | 4 = số template và mp3 lệch nhau
#           5 = cần chọn template/mp3 (-t/-m) hoặc file đã chọn không có
set -euo pipefail
cd "$(dirname "$0")/.."
shopt -s nullglob
mkdir -p Video/clip Video/template Video/mp3
VID='mp4|mov|m4v|webm|mkv|avi'; AUD='mp3|m4a|wav|aac|ogg|flac'
list() { # $1=thư mục  $2=đuôi cho phép (regex, rỗng = mọi file)
  for f in "$1"/*; do
    [ -f "$f" ] || continue; local b; b=$(basename "$f"); [ "$b" = ".keep" ] && continue
    if [ -n "$2" ]; then local lb="${b,,}"; [[ "$lb" =~ \.($2)$ ]] || continue; fi
    printf '%s\n' "$b"
  done | sort -V; }
selT=(); selM=()
while getopts "t:m:" o; do
  case $o in t) selT+=("$OPTARG");; m) selM+=("$OPTARG");;
    *) echo "Dùng: bash tools/new_batch.sh [-t template]... [-m mp3]... < mota" >&2; exit 2;; esac
done
mapfile -t CL < <(list Video/clip "")
[ ${#CL[@]} -eq 0 ] && { echo "LỖI: Video/clip đang trống, không tạo mẻ." >&2; exit 1; }
mapfile -t allT < <(list Video/template "$VID")
mapfile -t allM < <(list Video/mp3 "$AUD")
miss=0; need=0
choose() { # $1=thư mục $2=loại $3=tên mảng kết quả $4=tên mảng đã chọn $5=tên mảng tất cả
  local -n out=$3 sel=$4 all=$5
  if [ ${#sel[@]} -gt 0 ]; then
    for x in "${sel[@]}"; do [ -f "$1/$x" ] || { echo "LỖI: không có $1/$x" >&2; need=1; }; done
    out=("${sel[@]}")
  elif [ ${#all[@]} -eq 1 ]; then out=("${all[0]}")
  elif [ ${#all[@]} -eq 0 ]; then out=(); echo "THIẾU: $1 không có file $2." >&2; miss=1
  else out=(); need=1
    echo "CẦN CHỌN $2: $1 có ${#all[@]} file, chạy lại với $([ "$2" = template ] && echo -t || echo -m) <tên>:" >&2
    printf '  %s\n' "${all[@]}" >&2
  fi; }
TP=(); MU=()
choose Video/template template TP selT allT
choose Video/mp3 mp3 MU selM allM
[ $need -eq 1 ] && { echo "Chưa tạo mẻ." >&2; exit 5; }
[ $miss -eq 1 ] && { echo "Chưa tạo mẻ." >&2; exit 3; }
nT=${#TP[@]}; nM=${#MU[@]}
if [ $nT -ne $nM ] && [ $nT -ne 1 ] && [ $nM -ne 1 ]; then
  echo "LỆCH SỐ: $nT template nhưng $nM mp3 (cần bằng nhau, hoặc 1 bên chỉ có 1 file)." >&2
  echo "Template:" >&2; printf '  %s\n' "${TP[@]}" >&2
  echo "Mp3:" >&2; printf '  %s\n' "${MU[@]}" >&2
  echo "Chưa tạo mẻ." >&2; exit 4
fi
N=$(( nT > nM ? nT : nM ))

ext() { local e="${1##*.}"; [ "$e" = "$1" ] && echo "" || echo ".${e,,}"; }
D=$(date +%F); n=1
while [ -e "batches/${D}_$(printf %02d $n)" ]; do n=$((n+1)); done
B="batches/${D}_$(printf %02d $n)"
mkdir -p "$B/clips" "$B/output" "$B/preview"
: > "$B/ten_goc.txt"
i=0
for f in "${CL[@]}"; do
  i=$((i+1)); new="$i$(ext "$f")"
  mv -- "Video/clip/$f" "$B/clips/$new"; echo "clips/$new = $f" >> "$B/ten_goc.txt"
done

put() { # $1=thư mục nguồn $2=tên file $3=tên mới (không đuôi) $4=thư mục đích $5=chép(1)/chuyển(0)
  local new="$3$(ext "$2")"
  if [ "$5" = 1 ]; then cp -- "$1/$2" "$4/$new"; else mv -- "$1/$2" "$4/$new"; fi
  local rel="${4#"$B"}"; rel="${rel#/}"
  echo "${rel:+$rel/}$new = $2" >> "$B/ten_goc.txt"
}
if [ $N -eq 1 ]; then
  put Video/template "${TP[0]}" template "$B" 0
  put Video/mp3 "${MU[0]}" mp3 "$B" 1
else
  for k in $(seq 1 $N); do
    V="$B/v$k"; mkdir -p "$V/output" "$V/preview"
    last=$([ $k -eq $N ] && echo 0 || echo 1)
    if [ $nT -eq 1 ]; then put Video/template "${TP[0]}" template "$V" $last; else put Video/template "${TP[$((k-1))]}" template "$V" 0; fi
    if [ $nM -eq 1 ]; then put Video/mp3 "${MU[0]}" mp3 "$V" 1; else put Video/mp3 "${MU[$((k-1))]}" mp3 "$V" 1; fi
  done
fi
cat > "$B/mota.txt"
echo "$B"
[ $N -gt 1 ] && { echo "$N video:"; grep -E '^v[0-9]+/' "$B/ten_goc.txt" | sed 's/^/  /'; }
exit 0
