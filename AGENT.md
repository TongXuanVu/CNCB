# Agent edit video — Chuyện nhà Chà Bông

> Trong file này "Vũ" = người đang dùng agent (Vũ hoặc khách nhận bàn giao). Quy tắc áp dụng như nhau.

## QUY TẮC CỨNG
1. KHÔNG dựng video thật (render_batch.py không có --preview) khi Vũ chưa nói rõ "ok dựng" cho đúng mẻ đó.
2. Không xóa file nào. Chỉ đụng vào Video/ và đúng thư mục mẻ đang làm.
3. Không sửa assets/ và style.json trừ khi Vũ yêu cầu.
4. Lỗi thì dừng, báo nguyên văn lỗi, không tự thử cách khác lên video.
5. Phong cách lấy theo template.* của từng mẻ (Vũ bỏ vào Video/template; mẫu cũ assets/template.mp4 = video "Hành trình
   vỗ béo" kênh Thị Bún nè, 71 giây, dùng bài assets/music/Download.mp3). Đặc điểm: cảnh ngắn 1–3 nhịp (~0,7–2 giây), nhạc xuyên suốt, chữ nhỏ trắng
   kèm emoji ở giữa/dưới, tiêu đề series ở trên, sticker meme ở cảnh cảm xúc. Trước khi lên kế hoạch, trích vài khung hình
   của batches/<mẻ>/template.* để đối chiếu. Ảnh bìa Vũ tự làm trong TikTok lúc đăng, agent không làm.

## Vị trí thư mục
- Trên máy Vũ: E:\ChuyệnNhàChàBông (từ 09/11; trước đó D:). Trong máy ảo, mỗi lệnh bắt đầu bằng:
  cd "$(for d in "$HOME"/mnt/*ChuyệnNhàChàBông; do [ -f "$d/AGENT.md" ] && echo "$d" && break; done)" && source tools/setup.sh && ...
  (tên mount có thể kèm tiền tố ổ như "E:--", nên không gõ cứng đường dẫn).

## Thư mục
- Video/clip/    Vũ bỏ clip mới vào đây
- Video/template/  kho video mẫu (nhiều file). Mỗi mẻ chỉ CHUYỂN template được chọn; file âm thanh/.py trong đây bị bỏ qua
- Video/mp3/     kho nhạc — mẻ chỉ CHÉP mp3 được chọn, bản gốc giữ lại. Nhiều cặp template+mp3 = nhiều video, xem "Mẻ nhiều video"
- assets/        template.mp4 (mẫu), end.mp4 (end card), fonts/, nhạc nếu có
- batches/<ngày>_NN/   clips/1.mp4, 2.mp4... (đánh số theo tên file gốc), template.<đuôi>, mp3.<đuôi>, ten_goc.txt
                       (tên mới = tên gốc), mota.txt, preview/, ke-hoach.md, plan.json, work/ (tạm), output/
- tools/         setup.sh, new_batch.sh, preview_batch.sh, render_batch.py, remotion/, vendor/
- style.json     font, cỡ, màu, vị trí chữ ("theme"), độ dài chuyển cảnh

## Công cụ (đầu mỗi phiên: `source tools/setup.sh`)
- tools/vendor/bin/ffmpeg, ffprobe 8.1 (máy ảo chỉ có 4.4, không dùng bản đó)
- tools/vendor/ffmpeg-skill/: ĐỌC SKILL.md trước khi dùng. Dùng cho kiểm tra (check.py --platform tiktok),
  cân âm lượng (loudness.py), chỉnh màu (look.py), tìm cảnh (scenes.py).
- tools/remotion/: Remotion 4.0.541 dựng các lớp chữ/hiệu ứng nền trong suốt (src/*.tsx):
  TitleCard (tên kênh + dòng phụ), Label (mốc giờ), Caption (chữ kiểu cũ), Stickers (~33 loại), Effects/Effects2
  (hearts, stars, sparkles, confetti, lightleak, prism, frame), Catalog (bảng mẫu).
- Mỗi lệnh tối đa ~170 giây; script lưu tiến độ, cứ chạy lại tới khi in DONE. Remotion khoảng 0,15 giây/khung hình
  cho mỗi lớp, video 55 giây có chữ mọi cảnh mất vài lượt chạy.

## Quy trình mỗi mẻ (4 bước, mỗi bước chờ Vũ duyệt)
### Bước 1 — Vũ nhắn "làm mẻ mới" + nội dung/mô tả
1. Lưu mô tả vào file tạm, chạy `bash tools/new_batch.sh [-t <template>]... [-m <mp3>]... < file` -> đường dẫn mẻ.
   (sửa 09/11) Clip: CHUYỂN HẾT Video/clip/* -> clips/1,2,3... (theo tên file). Template: chỉ CHUYỂN file được chọn
   bằng -t -> template.*, các template khác để nguyên. Mp3: chỉ CHÉP file chọn bằng -m -> mp3.* (gốc giữ trong Video/mp3).
   Không ghi -t/-m: thư mục chỉ có 1 file thì tự lấy; nhiều file thì script dừng (mã 5) và in danh sách
   -> đưa danh sách cho Vũ, Vũ chọn template + mp3 nào. KHÔNG tự chọn.
   - Video/clip trống (mã 1): báo Vũ.
   - Video/template hoặc Video/mp3 trống (mã 3): báo Vũ, KHÔNG tự lấy file trong assets/.
     Gợi ý Vũ: tự bỏ video mẫu vào Video/template và nhạc vào Video/mp3; chưa có thì NHẤN ĐÚP Video/Tai_TikTok.bat TRÊN WINDOWS
     (cửa sổ hỏi link kênh TikTok + số bài; thiếu Python thì tự mở trang tải). Agent KHÔNG tự chạy
     tai_tiktok.py trong máy ảo (mạng máy ảo không vào được TikTok).
   - Tên file chọn không có (mã 5): báo Vũ.
   - Chọn nhiều template/mp3: tạo mẻ NHIỀU VIDEO (v1, v2...) ghép theo thứ tự đã chọn, xem mục "Mẻ nhiều video".
   - Số template và mp3 lệch nhau mà không bên nào là 1 (mã 4): đưa 2 danh sách cho Vũ, chờ Vũ sửa.
   Trong kế hoạch gọi clip theo số (1, 2, 3...) để Vũ đối chiếu; tên gốc xem ten_goc.txt.
2. `bash tools/preview_batch.sh batches/<mẻ>` (chỉ đọc clip). Xem ảnh preview/ để biết clip nào là cảnh gì.
3. Viết ke-hoach.md: bảng thứ tự | clip | đoạn cắt (2–4 giây/cảnh) | chữ theo cảnh | hiệu ứng | chuyển cảnh,
   cùng tên kênh + dòng phụ mở đầu. Chữ lấy từ nội dung Vũ viết; chỗ nào agent tự đề xuất thì ghi rõ "(đề xuất)".
   Trước khi chọn chữ/sticker: đọc tools/thu_vien_chu.md + xem các ảnh catalog_*.png (mục "Bộ chữ & sticker").
4. Gửi Vũ duyệt. DỪNG.
### Bước 2 — Vũ duyệt / sửa nội dung
1. Viết plan.json theo bản đã duyệt.
2. `timeout 170 python3 tools/render_batch.py batches/<mẻ> --preview` -> gửi Vũ ảnh preview/chu_*.jpg để xem chữ.
### Bước 3 — Nhạc + hiệu ứng âm thanh (khách yêu cầu 08/11: video PHẢI có nhạc, cắt theo nhịp, có SFX)
- Nhạc của mẻ là batches/<mẻ>/mp3.* (Vũ bỏ vào Video/mp3). assets/music/Download.mp3 (92,8 BPM) chỉ là bài cũ.
- plan.json: "music": "batches/<mẻ>/mp3.mp3" (đường dẫn tính từ thư mục gốc), "beat_sync": true (mặc định) -> script tự dò nhịp
  (tools/audio_tools.py, cache <bài>.beats3.json) và dời MỖI điểm cắt về nhịp gần nhất (chuyển cảnh xfade: tâm rơi đúng nhịp).
  "music_start": giây bắt đầu trong bài (mặc định = nhịp mạnh đầu tiên). Xem nhịp: python3 tools/audio_tools.py beats <bài>
- Khi có nhạc nên lên kế hoạch cảnh ngắn ~2–3 nhịp (1,3–2 giây với bài 92 BPM); đoạn cắt trong ke-hoach chỉ là dự kiến,
  script canh lại, có thể lệch ±0,3 giây.
- Tiếng gốc tự hạ còn "orig_volume" 0.4 khi có nhạc; "music_volume" mặc định 0.5 (style.json). Cảnh cần nghe tiếng
  (bé nói, cười) thì đặt "volume" cảnh đó cao hơn, vd 2.0.
- SFX tự động ("sfx": true mặc định): gõ phím từng chữ tên kênh, "ting" khi dòng phụ nảy, "pop" mốc giờ mới, "tick" đổi dòng
  chữ / caption, "boing" sticker hình, "pop" sticker chữ, "ting" sparkles/stars, "whoosh" chuyển cảnh xfade.
  Tắt 1 cảnh: segment "sfx": false. Thêm tay: "sfx_extra": [{"t": 1.2, "sound": "ting", "vol": 0.5}]
  (sound: type | ting | pop | tick | boing | whoosh). Âm lượng chung: "sfx_volume".
- Tiếng SFX nằm ở assets/sfx/*.wav (tự tổng hợp, không bản quyền). Vũ muốn thay thì bỏ file cùng tên đuôi .mp3 vào đó
  (mp3 được ưu tiên). Tạo lại bộ tự tổng hợp: python3 tools/audio_tools.py sfx
- Không có nhạc thì "music": null (chỉ khi Vũ yêu cầu).
### Bước 4 — Vũ nói "ok dựng"
1. Chạy lặp `timeout 170 python3 tools/render_batch.py batches/<mẻ>` tới khi in DONE.
2. Kiểm tra: `python3 tools/vendor/ffmpeg-skill/scripts/check.py --platform tiktok <file>` + trích vài khung hình xem.
3. Báo Vũ: tên file, độ dài.

## Kiểu mặc định (theo video "Sáng cuối tuần" của Vũ, 07/11/2026)
- Mốc giờ dùng "labels": giờ TO + dòng hoạt động bên dưới (38px, đánh máy từng chữ); một mốc giờ kéo dài qua nhiều cảnh
  liền nhau, chỉ dòng hoạt động đổi. Đặt "pos" trên/giữa/dưới sao cho KHÔNG che mặt (xem ảnh preview của clip để chọn).
- Câu dài thì tách thành 2–3 dòng ngắn qua các cảnh liền nhau, giữ nguyên giờ.
- Chuyển cảnh mặc định là cắt thẳng; chỉ thêm transition khi Vũ muốn.
- "caption" (chữ kem kiểu cũ) vẫn dùng được khi Vũ yêu cầu.

## Bộ chữ & sticker (XEM ẢNH MẪU + THƯ VIỆN CHỮ TRƯỚC KHI LÊN KẾ HOẠCH)
- Ảnh mẫu trong tools/remotion/: catalog_stickers.png (sticker cơ bản), catalog_chude.png (sticker theo chủ đề),
  catalog_combo.png (combo dựng sẵn), catalog_chu.png (kiểu chữ mốc giờ), catalog_chu_sticker.png (kiểu chữ sticker),
  catalog_netve.png (nét trắng mảnh vẽ tay kiểu "Yummy!" + chữ ký script),
  catalog_netve2.png + catalog_netve3.png + catalog_combo2.png (56 nét trắng + 11 combo mở rộng 08/11 — KHÁCH THÍCH KIỂU NÉT TRẮNG, ưu tiên dùng).
- tools/thu_vien_chu.md: câu chữ mẫu + combo + sticker + kiểu chữ hợp cho từng chủ đề (ăn uống, đi chơi, lễ tết...).
- Sửa src/*.tsx, tools/presets.json hoặc style.json xong thì chạy `timeout 170 bash tools/make_catalog.sh` để cập nhật ảnh mẫu.

### Chữ mốc giờ (labels)
- "anim": type (đánh máy, mặc định) | wave (từng chữ nảy lên) | pop | slide | fade
- "style": shadow (mặc định, chữ trắng bóng mờ) | outline (chữ tròn viền nâu, nổi) | pill (nền tối bo tròn) | tag (nền vàng chữ nâu)
  | sticker (nền trắng chữ hồng) | comic (chữ vàng viền đen) | neon (chữ phát sáng hồng, nháy khi hiện)
- Bọc từ khoá trong *...* để tô màu nhấn: "Nước ngon *rẻ* cho cả nhà", "Đi chơi chỉ *200k*". Mỗi câu tối đa 1 từ khoá.
- Mặc định toàn kênh nằm trong style.json -> theme: labelAnim, labelStyle, labelSize, accent.
- Gợi ý: cảnh mở màn mỗi mốc giờ dùng type; cảnh vui/nhộn dùng wave; thông tin giá/tiền dùng tag hoặc *từ khoá*.

### Sticker (segments[].stickers)
| Nhóm | type | Dùng khi |
|---|---|---|
| Nét trắng vẽ tay | shock, heart, cat, sleep, sparkle | giật mình, thương, dễ thương, ngủ, lấp lánh |
| Chỉ/khoanh | arrow (rotate để đổi hướng, flip), circle (w,h), underline (w), frame (w,h) | chỉ vào món ăn/đồ vật, khoanh giá, khung quanh bé |
| Dấu | exclaim (!!), question (?), sweat (giọt mồ hôi), angry (💢) | bất ngờ, thắc mắc, bối rối, giận dỗi |
| Hình màu | heart_fill, hearts, star, stars, flower, sun, cloud, music | dễ thương, khen, sân vườn, buổi sáng, nhảy/hát |
| Mặt cảm xúc | yum, laugh, love, cry, wow, shy | ăn ngon, cười, mê, khóc, ngạc nhiên, ngại |
| Chữ | text (style hand/script/outline/tag/marker/neon/comic/sticker/gradient/retro), bubble, burst (nổ chữ, vd "200k") | phản ứng, lời bé/ba mẹ, nhấn giá |
| Ăn uống | bowl, drink, coffee, cake, icecream, utensils, steam (khói) | nấu, ăn, uống |
| Đi chơi | car, plane, pin, camera, balloon, tree | di chuyển, check-in |
| Thời tiết | rain, rainbow, moon, snow, umbrella | nắng mưa, tối |
| Em bé & nhà | bottle, duck, bear, crown, bow, house | bé, ở nhà |
| Lễ tết | gift, popper, lantern, star_lantern, xmas_tree, firework | sinh nhật, Tết, Trung thu, Noel |
| Tiền & khen | coin, cash (text = mệnh giá), pricetag (text), like, check, fire | giá rẻ, sale, khen |
| Nét trắng mảnh (rung kiểu vẽ tay) | splash (vệt + giọt bắn: giật mình), burst_lines (tia nhấn), cat_peek / dog_peek / bunny_peek / bear_peek (thú ló ra ôm), swirl (chóng mặt), motion_lines, lightbulb, anger_mark, sweat_drop, notes_line, stars_line, crown_line, blush_lines, hearts_line, wave_hand, flower_line, sun_line, exclaim_line, question_line, puff, tears_line | phong cách "Yummy!" nhẹ nhàng, tinh tế |
| Nét trắng ăn uống (mới) | steam_line, bowl_line, chopsticks_line, cup_line, drool_line, cake_line, icecream_line, fork_spoon_line, rice_ball_line, drumstick_line, banhmi_line, watermelon_line, egg_line, cookie_line | nấu, ăn, uống, vỗ béo |
| Nét trắng cảm xúc (mới) | dizzy_stars, worry_lines, gloom_lines, shine_lines, zzz_line, dots_line, kiss_line, broken_heart_line, sparkle_eyes, heart_beat, shock_lines, peace_hand, thumbs_line, point_hand | choáng, buồn, khen, ngủ, mê, chỉ |
| Nét trắng thú (mới) | pig_peek, duck_peek, chick_peek, panda_peek, cat_paw, paw_prints, fish_line | thú ló ra, thú cưng |
| Nét trắng em bé & trang trí (mới) | bottle_line, footprint_line, balloon_line, ribbon_line, bubble_line, bubble_think (2 cái này nhận "text"), cloud_line, moon_line, rainbow_line, leaf_line, heart_line, sparkle4_line, arrow_curve_line, circle_scribble, underline_wave, pacifier_line, house_line, umbrella_line, gift_line, camera_line, paper_plane_line | bé, ở nhà, đi chơi, khoanh/chỉ |
| Mặt cảm xúc 2 | cool, think, angry_face, sleepy, kiss | ngầu, nghĩ, giận, buồn ngủ, hôn |
| Con vật | dog, kitty, bunny, chick | cún, mèo, thỏ, gà con |
| Nhảy hát | mic, ball, medal | hát, chơi bóng, thành tích |

- Tham số: x, y (0..1, TÂM hình), size (px; mặt/hình nên 120–160, chữ 44–64), delay, until, rotate, color, color2, flip,
  w/h (circle/frame/underline, tỉ lệ khung), text, style (cho text), anim.
- "anim": pop (mặc định) | bounce | float | wiggle | spin | pulse | drop | slide | fade | draw (nét tự vẽ; mặc định của
  arrow/circle/underline) | blink (mặc định của frame) | type (chữ đánh máy, cho text).
- Quy tắc: 1–3 sticker/cảnh, không phủ mặt, không đặt trùng vùng chữ mốc giờ; khoảng 1/2 số cảnh có sticker là vừa.
  Phối 1 sticker chính (mặt cảm xúc/hình màu) + 1 sticker phụ (chữ phản ứng hoặc nét trắng). delay lệch nhau 0,2–0,4s.
- COMBO dựng sẵn (tools/presets.json, ưu tiên dùng cho nhanh và đồng bộ): {"preset": "an_ngon", "x": 0.5, "y": 0.82,
  "scale": 1, "delay": 0.3, "text": "chữ thay thế"} -> tự bung ra 2–4 sticker đặt quanh (x, y). Có: an_ngon, ngon_xiu, doi_bung,
  uong_nuoc, cafe_sang, gia_re, sale, dang_yeu, be_cuoi, be_khoc, bat_ngo, suy_nghi, buon_ngu, di_choi, check_in, troi_dep,
  troi_mua, sinh_nhat, tet, trung_thu, noel, gioi_qua, quay_len, be_ngu, tam_biet, follow; bộ nét trắng: yummy_netve,
  giat_minh, chong_mat, ngai_ngung, y_tuong, byee_netve, be_khoc_netve, an_ngon_netve, vo_beo_netve,
  tra_sua_netve, di_choi_netve, check_in_netve, be_ngu_netve, yeu_qua_netve, em_be_netve, that_vong_netve, khen_netve, hoi_ba_netve. Combo rộng ~0,45 khung: đặt x
  khoảng 0.3–0.7; thu nhỏ bằng "scale": 0.8 nếu chật. Thêm combo mới: viết vào presets.json rồi chạy make_catalog.sh.
- PHONG CÁCH NÉT TRẮNG (giống video tham khảo của Vũ): rải 3–4 nét trắng QUANH bé thay vì gom 1 chỗ — splash cạnh đầu,
  burst_lines góc trên, thú *_peek cạnh tay/món ăn, chữ script "Yummy!" góc dưới (anim type). Không trộn với sticker màu
  trong cùng cảnh. text style "script" có nét gạch đuôi tự vẽ; size 56–70.
- Ví dụ: ăn ngon -> yum (bounce) + text "Yummy!" outline (type); giá rẻ -> burst "200k" (drop) hoặc text tag;
  bé dễ thương -> hearts hoặc love; chỉ vào món -> arrow; buổi sáng -> sun; sân vườn -> flower/stars; tạm biệt -> bubble "Byee!".

### Hiệu ứng toàn cảnh (segments[].effects, dùng ít, 0–1 mỗi cảnh)
hearts (tim bay lên) | stars (sao bay lên) | sparkles (lấp lánh) | confetti (giấy màu rơi) | lightleak (vệt sáng ấm) |
prism (vệt cầu vồng) | frame (khung trắng nháy quanh màn hình, như video mẫu).

## Mẫu plan.json
{
  "name": "sang-cuoi-tuan",
  "intro": {"title": "Chuyện nhà\nChà Bông", "subtitle": "Sáng cuối tuần\ntại nhà", "seconds": 3.5},
  "labels": [
    {"from": 2, "to": 3, "time": "7:30", "text": "Ăn sáng", "under": "🍴", "pos": "bottom"},
    {"from": 4, "to": 6, "time": "10:30", "text": "Đi chơi chỉ *200k*", "pos": "top", "style": "tag", "anim": "pop"},
    {"from": 7, "to": 9, "time": "10:30", "text": "Lạ miệng bé khoái lắm", "pos": "top", "anim": "wave"}
  ],
  "segments": [
    {"clip": "clips/a.mp4", "start": 0, "end": 3.5},
    {"clip": "clips/b.mp4", "start": 1, "end": 4, "stickers": [{"type": "text", "text": "* ngon quá", "x": 0.75, "y": 0.12, "delay": 1}]},
    {"clip": "clips/c.mp4", "start": 0, "end": 3, "label_pos": "middle", "effects": ["frame"]},
    {"clip": "clips/d.mp4", "start": 0, "end": 3, "stickers": [
      {"type": "yum", "x": 0.22, "y": 0.8, "size": 140, "anim": "bounce", "delay": 0.3},
      {"type": "text", "text": "Yummy!", "style": "outline", "x": 0.7, "y": 0.85, "size": 60, "rotate": -8, "anim": "type", "delay": 0.6},
      {"type": "arrow", "x": 0.7, "y": 0.62, "rotate": 160, "delay": 0.2}]}
  ],
  "music": null,
  "use_outro": true
}
- labels: "from"/"to" là số thứ tự cảnh (đếm từ 1) trong "segments". Hai khối liền nhau cùng "time" thì giờ đứng yên,
  chỉ dòng chữ đổi. "under": emoji nhỏ dưới dòng chữ. "pos": top | middle | bottom (hoặc số px từ trên xuống).
  "anim"/"style" như mục Bộ chữ.
- segment "label_pos": đổi vị trí mốc giờ riêng cho cảnh đó (tránh mặt).
- caption (kiểu cũ), caption_delay, effects, "mute", "volume" vẫn dùng được.
- transition (vào cảnh này): cut (mặc định) | zoomin | fadewhite | fade | hblur | dissolve | smoothleft | smoothup | radial | slideleft.
- intro phủ lên cảnh đầu trong "seconds" giây; mốc giờ/caption cảnh đầu tự hiện sau intro.
- Thư mục _agent_dev/test/ có plan.json thử mọi hiệu ứng mới (dựng thử: render_batch.py _agent_dev/test).

## Ghi chú đã chốt (08/11/2026)
- Góp ý của khách cho video "cuoi-tuan-200k": THIẾU NHẠC -> phải có nhạc, chuyển cảnh theo nhịp nhạc; chữ đã kịp đọc;
  mở đầu cần hiệu ứng âm thanh, chữ xuất hiện cũng có hiệu ứng âm thanh; hiệu ứng hình ổn.
- Âm lượng SFX Vũ đã duyệt: style.json "sfx_volume": 0.5 (tiếng gõ phím tên kênh 0.25 x 0.5). Không tự tăng.
- Kiểu chữ: GIỮ kiểu hiện tại (giờ to + dòng hoạt động, sticker nét trắng). CHƯA đổi chữ theo template.mp4;
  template.mp4 chỉ dùng để tham khảo nhịp cắt, nhạc, cách đặt sticker.
- Nhạc: dùng mp3.* của mẻ, "beat_sync": true. (Từ 08/11 tối: mỗi mẻ có template + mp3 riêng.)

## Mẻ nhiều video (Vũ bỏ nhiều template + mp3, chốt 08/11)
- Ghép cặp theo THỨ TỰ chọn -t/-m (không chọn thì theo tên file, kiểu IMG_2 trước IMG_10): template thứ 1 + mp3 thứ 1 -> v1, ...
  Một bên chỉ có 1 file thì dùng chung cho mọi v. Lệch số khác -> new_batch.sh báo (mã 4), hỏi Vũ.
- Cấu trúc: batches/<mẻ>/clips/ (CHUNG) + v1/, v2/... mỗi v có template.*, mp3.*, ke-hoach.md, plan.json, preview/, output/.
- Preview clip chạy 1 lần cho cả mẻ: `bash tools/preview_batch.sh batches/<mẻ>`.
- MỖI VIDEO NỘI DUNG RIÊNG: chữ, sticker, thứ tự/đoạn cắt viết riêng theo phong cách template của v đó (trích khung hình
  template của từng v để đối chiếu) và nhịp bài mp3 của v đó. Không chép nguyên kế hoạch v này sang v khác.
- plan.json của v: clip ghi "../clips/1.mp4"; "music": "batches/<mẻ>/vN/mp3.mp3"; đặt "name" riêng cho từng v.
- Gửi Vũ bảng kế hoạch của tất cả v (mỗi v 1 mục). VŨ CHỌN NHỮNG V CẦN DỰNG — chỉ dựng đúng các v Vũ nói "ok dựng".
- Xem trước chữ: `timeout 175 python3 tools/render_many.py batches/<mẻ> v1 v3 --preview`
- Dựng: `timeout 175 python3 tools/render_many.py batches/<mẻ> v1 v3` — chạy lại tới khi in ALL DONE
  (in "CHƯA XONG" là hết lượt 165 giây, chạy lại để làm tiếp; v đã xong mà plan.json không đổi thì tự bỏ qua).
  Kết quả gom về batches/<mẻ>/output/vN_<tên>_9x16.mp4. Kiểm tra từng file bằng check.py như Bước 4.
- Mẻ chỉ 1 template + 1 mp3 thì vẫn như cũ (không có v, dùng render_batch.py).

## Làm lại một mẻ cũ (vd sửa theo góp ý)
- KHÔNG chạy new_batch.sh (Video/ có thể trống). Tạo thư mục mẻ mới: batches/<ngày>_NN-<tên>/, CHÉP (cp, không mv)
  clips/ + mota.txt + plan.json từ mẻ cũ sang, giữ nguyên mẻ cũ để so sánh.
- Sửa plan.json theo góp ý: thêm "music", "beat_sync": true; rút cảnh dài còn ~2–3 nhịp; giữ chữ/sticker đã duyệt.
- Viết ke-hoach.md mới, ghi rõ chỗ khác bản cũ, gửi Vũ duyệt rồi mới --preview / dựng như quy trình 4 bước.
- Mẻ "cuoi-tuan-200k" bản đã gửi khách: batches/2026-11-07_01-old/ (có gop-y.txt). Các mẻ khác trong batches/ là bản
  thử của đoạn chat khác: hỏi Vũ trước khi dùng.
