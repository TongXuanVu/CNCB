# Hướng dẫn sử dụng — Agent edit video "Chuyện nhà Chà Bông"

Agent này dùng Claude để ghép nhiều clip vừa quay thành 1 video TikTok dọc (9:16): mở đầu có tên kênh, chữ mốc giờ theo
từng cảnh, sticker, nhạc nền cắt theo nhịp, hiệu ứng âm thanh và end card. Bạn duyệt từng bước trước khi video được dựng.

---

## 1. Cần chuẩn bị (làm 1 lần)

1. **Ứng dụng Claude trên máy tính** (Windows hoặc Mac), đăng nhập tài khoản Claude có gói trả phí.
   Tải tại claude.ai/download.
2. **Cài bộ công cụ:** nhấn đúp file **`CaiDat_CNCB.bat`** (được gửi kèm, hoặc tải ở
   https://github.com/TongXuanVu/CNCB). Cửa sổ hỏi ổ đĩa muốn cài (Enter = ổ E), tự tải bản mới nhất và tạo thư mục
   `ChuyệnNhàChàBông`. Windows có thể hiện "Windows protected your PC": bấm **More info -> Run anyway**.
   Sau đó mở chat trong app Claude, nhắn: *"Kết nối thư mục E:\ChuyệnNhàChàBông, chạy `bash tools/install.sh` tới khi
   xong rồi `source tools/setup.sh`"* (cài ffmpeg + Remotion, ~10–15 phút, chỉ 1 lần).
   **Cập nhật bản mới:** nhấn đúp lại `CaiDat_CNCB.bat` (trong thư mục `ChuyệnNhàChàBông` cũng có). Chỉ công cụ được thay;
   clip, mẫu, nhạc, video đã làm và `style.json` được giữ nguyên.
3. **Trong Claude, chọn model Opus hoặc Sonnet.** Không dùng Haiku: dễ ghép sai cảnh, bỏ sót bước.
4. **Tạo lối tắt `/editvideocncb`** (không bắt buộc, cho tiện):
   mở chat mới trong app Claude, gửi câu: *"Tạo skill tên editvideocncb từ nội dung file
   E:\ChuyệnNhàChàBông\tools\skill\SKILL.md"* rồi bấm lưu trên thẻ hiện ra.
   Nếu không tạo skill, mỗi lần dùng chỉ cần dán **Prompt khởi động** ở mục 5.

---

## 2. Mỗi lần làm 1 video

**Bước 0 — Chuẩn bị 3 thứ trong thư mục `Video\`**
- `Video\clip\`: TẤT CẢ clip (và ảnh) của video sắp làm. Mỗi lần chỉ bỏ clip của 1 video. Đặt tên 01, 02, 03… nếu
  muốn chắc thứ tự.
- `Video\template\`: video mẫu để Claude bắt chước nhịp cắt, kiểu chữ, cách đặt sticker.
- `Video\mp3\`: nhạc nền (mp3/m4a/wav). Điểm cắt cảnh sẽ canh theo nhịp bài này.

**Chưa có video mẫu / nhạc?** Nhấn đúp file **`Video\Tai_TikTok.bat`**:
1. Cửa sổ đen hiện ra, hỏi link kênh TikTok (vd `https://www.tiktok.com/@ten.kenh`) -> dán vào, Enter.
2. Nhập số bài muốn tải, Enter. Chờ tải xong, thư mục `template` tự mở ra.
   Video vào `Video\template\`, nhạc tách ra vào `Video\mp3\`, tên file theo ngày đăng.
3. Máy chưa có Python: file sẽ báo và mở trang python.org. Tải bản mới nhất, khi cài **tick ô "Add python.exe to PATH"**,
   cài xong nhấn đúp lại `Tai_TikTok.bat`.
Lần đầu chạy script sẽ tự cài thư viện tải video. Chỉ dùng video/nhạc tải về để THAM KHẢO hoặc theo đúng quyền sử dụng;
nhạc có bản quyền có thể bị TikTok tắt tiếng khi đăng.

Có nhiều template/mp3 trong thư mục thì báo Claude dùng file nào (vd "template 2026-11-07, nhạc 2026-11-07").

**Bước 1 — Mở chat mới trong app Claude TRÊN MÁY TÍNH, gửi nội dung**
Gõ `/editvideocncb` (hoặc dán Prompt khởi động) kèm nội dung video theo mẫu:

```
Tên kênh: Chuyện nhà Chà Bông
Dòng phụ: Cuối tuần dẫn con
đi chơi chỉ 200k

Chữ theo cảnh (theo thứ tự):
- 6:00 thức dậy
- 6:10 làm bánh waffle cho bé ăn sáng
- 7:30 cả nhà ra quán cafe
- Byee

Ghi chú (nếu có): cảnh bé ăn thêm "Yummy!", nhạc vui
```

Lần đầu app sẽ hỏi quyền truy cập thư mục và máy tính: bấm **Cho phép**.

**Bước 2 — Duyệt kế hoạch**
Claude xem từng clip rồi gửi bảng kế hoạch: thứ tự cảnh, đoạn cắt, chữ, sticker, hiệu ứng.
Trả lời **"Duyệt"** hoặc sửa, ví dụ: *"cảnh 5 bỏ, cảnh 8 thêm trái tim, dòng 6:10 ngắn lại"*.

**Bước 3 — Duyệt ảnh xem trước chữ**
Claude gửi ảnh chữ và sticker đặt trên từng cảnh. Kiểm tra chữ có che mặt không, có sai chính tả không.
Duyệt hoặc yêu cầu sửa.

**Bước 4 — Chọn nhạc**
Mặc định dùng nhạc có sẵn trong `assets\music\`. Muốn bài khác: chép file mp3 vào `assets\music\` và báo tên file.
Điểm cắt cảnh sẽ tự canh theo nhịp bài nhạc.

**Bước 5 — Gõ "ok dựng"**
Claude chỉ dựng video khi bạn gõ đúng **"ok dựng"**. Video ~60 giây mất khoảng 10–15 phút.
Video xong nằm ở `ChuyệnNhàChàBông\batches\<ngày>_<số>\output\` (file `..._9x16.mp4`).

**Bước 6 — Đăng TikTok**
Chép file video sang điện thoại, đăng như bình thường. Ảnh bìa (cover) bạn tự chọn và gõ chữ trong TikTok lúc đăng.

---

## 3. Sửa video đã làm

Nhắn trong cùng đoạn chat (hoặc chat mới kèm tên mẻ), ví dụ:
*"Sửa video mẻ 2026-11-10_01: cảnh ở giây 15 cắt sớm hơn, đổi chữ 'Byee' thành 'Hẹn gặp lại', nhạc nhỏ lại"*.
Claude dựng lại phần thay đổi, nhanh hơn lần đầu.

Muốn áp dụng cho MỌI video sau (cỡ chữ, màu, âm lượng…): nói rõ *"áp dụng cho các video sau"*.

---

## 4. Lưu ý quan trọng

- **Sticker và kiểu chữ:** Claude dùng thư viện có sẵn trước; nếu không có loại hợp cảnh, Claude ghi "(tạo mới: ...)" trong
  kế hoạch — bạn duyệt kế hoạch là đồng ý. Đồ tạo mới được lưu vào thư viện tự tạo để các video sau dùng lại
  (xem ảnh `tools\remotion\catalog_tutao.png`). Muốn Claude tạo theo ý mình, cứ mô tả: *"thêm sticker con mèo ôm bình sữa"*.

- **Luôn mở chat trong app Claude trên chính máy tính có thư mục** (không dùng web hay điện thoại), vì Claude cần
  truy cập file trên máy. Máy phải bật và mở app Claude trong lúc dựng.
- **Đừng mở 2 đoạn chat cùng làm 1 lúc**: chúng sẽ ghi đè lên nhau.
- **Claude không xóa file**: những thứ bỏ đi được chuyển vào `_to_delete\`, bạn tự xóa khi muốn.
- Thư mục `batches\` chứa mọi video đã làm (cả clip gốc). Dọn bớt mẻ cũ nếu ổ đầy.
- Claude báo lỗi thì đọc lời giải thích, trả lời **"ok sửa"** nếu đồng ý cách sửa Claude đề xuất.
- Hiệu ứng âm thanh và nhạc chèn sẵn: nhạc có bản quyền có thể bị TikTok tắt tiếng; khi đó chọn nhạc trong TikTok.

---

## 5. Prompt khởi động (dùng khi không có lối tắt /editvideocncb)

Dán đoạn sau vào chat mới, rồi dán nội dung video ở cuối:

```
Bạn là agent edit video cho kênh "Chuyện nhà Chà Bông". Công cụ và quy trình nằm trên máy tôi, thư mục ChuyệnNhàChàBông
(ví dụ E:\ChuyệnNhàChàBông).

KHỞI ĐỘNG:
1. Kết nối máy tính và xin quyền thư mục ChuyệnNhàChàBông.
2. Mọi lệnh bash bắt đầu bằng:
   cd "$(for d in "$HOME"/mnt/*ChuyệnNhàChàBông; do [ -f "$d/AGENT.md" ] && echo "$d" && break; done)" && source tools/setup.sh && ...
3. Đọc toàn bộ AGENT.md trong thư mục đó và làm đúng theo nó.
4. Liệt kê Video/ và batches/, báo tôi ngắn gọn tình trạng.

QUY TẮC: quy trình 4 bước, mỗi bước dừng chờ tôi duyệt; KHÔNG dựng video khi tôi chưa nói "ok dựng"; không xóa file;
lỗi thì dừng và báo nguyên văn; trả lời tiếng Việt, ngắn gọn.

NỘI DUNG VIDEO:
(dán nội dung ở đây)
```

---

## 6. Gặp sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Claude nói không truy cập được máy tính | Mở đúng app Claude trên máy tính (không phải web), nhắn lại |
| Claude nói `Video\` trống | Kiểm tra đã chép clip vào `ChuyệnNhàChàBông\Video\` chưa |
| Dựng lâu, Claude chạy nhiều lượt | Bình thường: mỗi lượt tối đa ~3 phút, tiến độ được lưu, cứ để Claude chạy tiếp |
| Báo "hết dung lượng" (no space left) | Nhắn Claude: "dọn file tạm của máy ảo" |
| Chữ che mặt, sai chính tả | Sửa ở bước duyệt ảnh xem trước (bước 3) |
