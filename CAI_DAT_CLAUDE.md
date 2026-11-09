# Cài đặt lần đầu — hướng dẫn cho Claude

Người dùng nhờ bạn (Claude) đọc file này để cài bộ công cụ edit video "Chuyện nhà Chà Bông" trên máy của họ.
Làm lần lượt các bước dưới đây, trả lời người dùng bằng tiếng Việt, ngắn gọn. CHỈ cài đặt: không dựng video,
không sửa file nào ngoài những gì các bước yêu cầu.

## Bước 1 — Kết nối thư mục
- Cần máy tính của người dùng được nối với phiên này (công cụ làm việc với máy tính / thư mục). Nếu chưa có: báo người
  dùng mở đoạn chat này trong app Claude trên máy tính rồi nhắn lại.
- Xin quyền truy cập thư mục chứa file này (thư mục tên `ChuyệnNhàChàBông`, vd `E:\ChuyệnNhàChàBông`).
  Người dùng đã ghi đường dẫn trong tin nhắn thì dùng đúng đường dẫn đó.

## Bước 2 — Vào thư mục
Mỗi lệnh bash là một shell mới, luôn bắt đầu bằng:
```
cd "$(for d in "$HOME"/mnt/*ChuyệnNhàChàBông; do [ -f "$d/AGENT.md" ] && echo "$d" && break; done)"
```
(tên thư mục trong máy ảo có thể kèm tiền tố ổ như `E:--ChuyệnNhàChàBông`, nên không gõ cứng đường dẫn).
Không tìm thấy -> kiểm tra thư mục đã đúng tên `ChuyệnNhàChàBông` và có file `AGENT.md` chưa, báo người dùng.

## Bước 3 — Cài công cụ
```
cd "<như trên>" && timeout 170 bash tools/install.sh
```
- Script tải ffmpeg 8.1, ffmpeg-skill và cài Remotion. Mỗi lệnh chỉ chạy được ~170 giây: nếu bị ngắt (hết giờ)
  thì CHẠY LẠI đúng lệnh đó — bước đã xong sẽ tự bỏ qua — cho tới khi in dòng `Xong. Kiểm tra: source tools/setup.sh`.
- Lỗi khác (mạng, thiếu chỗ...) -> dừng, báo người dùng nguyên văn lỗi và nguyên nhân dễ hiểu.
- Ổ của máy ảo rất nhỏ: không cài thêm thư viện, không tải gì ngoài script này.

## Bước 4 — Khởi động lần đầu
```
cd "<như trên>" && source tools/setup.sh
```
- Lần đầu sẽ giải nén Remotion vào `_remotion_cache/` (chậm, có thể cần chạy lại vài lần nếu bị ngắt).
- Xong khi in dòng dạng `ffmpeg: n8.1... | remotion: 4.0.541`.
- Kiểm tra thêm:
  `cd "<như trên>" && source tools/setup.sh >/dev/null && python3 tools/vendor/ffmpeg-skill/scripts/_contract.py doctor | head -4`
  -> phải có `missing required: none`.

## Bước 5 — Tạo lối tắt /editvideocncb
- Đọc file `tools/skill/SKILL.md` trong thư mục.
- Nếu bạn có công cụ đề xuất/lưu skill: tạo skill tên `editvideocncb` với đúng nội dung file đó (mô tả lấy ở dòng
  `description:`), để người dùng bấm lưu.
- Nếu không có công cụ đó: báo người dùng rằng mỗi lần làm video chỉ cần nhắn
  *"Đọc file <thư mục>\AGENT.md và làm theo"* kèm nội dung video (thay cho /editvideocncb).

## Bước 6 — Báo kết quả
Tóm tắt ngắn cho người dùng:
- Đã cài xong chưa (ffmpeg, Remotion, ffmpeg-skill).
- Lối tắt /editvideocncb đã tạo chưa.
- Việc tiếp theo: đọc `HUONG_DAN_SU_DUNG.md` mục 2 — bỏ clip vào `Video\clip\`, video mẫu vào `Video\template\`,
  nhạc vào `Video\mp3\` (chưa có mẫu/nhạc thì nhấn đúp `Video\Tai_TikTok.bat`), rồi gõ /editvideocncb kèm nội dung.

Máy bị cài lại, đổi máy, hoặc Claude báo thiếu ffmpeg/Remotion: nhờ Claude đọc lại file này.
