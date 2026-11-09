# CNCB — Agent edit video "Chuyện nhà Chà Bông"

Bộ công cụ để **Claude** (app Claude trên máy tính) ghép nhiều clip ngắn thành 1 video TikTok 9:16: mở đầu tên kênh,
chữ mốc giờ theo cảnh, sticker, nhạc cắt theo nhịp, hiệu ứng âm thanh, end card. Người dùng duyệt từng bước.

- Cách dùng hằng ngày: xem **HUONG_DAN_SU_DUNG.md**
- Quy trình + tham số cho agent: **AGENT.md**
- Lối tắt `/editvideocncb`: nhờ Claude "tạo skill từ tools/skill/SKILL.md"

## Cài đặt lần đầu
Cách nhanh (Windows, không cần git): đặt `CaiDat_CNCB.bat` vào nơi muốn cài rồi nhấn đúp (tạo thư mục `ChuyệnNhàChàBông` cạnh file; nằm sẵn trong thư mục đó thì cập nhật tại chỗ) (mã nguồn dễ đọc: `tools/caidat_cncb.ps1`). Hoặc làm tay:
1. Tải repo về máy, đặt thư mục tên **ChuyệnNhàChàBông** (giữ nguyên tên có dấu), ví dụ `E:\ChuyệnNhàChàBông`.
2. Mỗi video cần: clip vào `Video/clip/`, video mẫu vào `Video/template/`, nhạc vào `Video/mp3/`.
   Chưa có mẫu/nhạc thì nhấn đúp `Video/Tai_TikTok.bat` (Windows, cần Python) để tải bài mới nhất của một kênh TikTok.
   Nội dung các thư mục này không có trong repo (riêng tư / có bản quyền).
3. Mở chat trong app Claude trên máy tính, cho Claude quyền thư mục đó, rồi nhờ Claude chạy:
   `bash tools/install.sh` (tải ffmpeg 8.1, ffmpeg-skill, cài Remotion; chạy lại nếu bị ngắt), sau đó `source tools/setup.sh`.

## Cấu trúc
| Đường dẫn | Nội dung |
|---|---|
| `Video/` | `clip/` (clip mới), `template/` (video mẫu), `mp3/` (nhạc), `tai_tiktok.py` (tải mẫu + nhạc từ TikTok) |
| `batches/` | mỗi video 1 thư mục: clips, kế hoạch, plan.json, ảnh xem trước, output |
| `assets/` | fonts (OFL), sfx (tự tổng hợp), end.mp4, music/ (tự thêm) |
| `tools/render_batch.py` | dựng video theo plan.json (Remotion + ffmpeg) |
| `tools/audio_tools.py` | dò nhịp nhạc (numpy), tạo/ghép hiệu ứng âm thanh |
| `tools/remotion/src/` | lớp chữ, sticker, hiệu ứng (React/Remotion) |
| `style.json` | font, cỡ, màu, vị trí chữ, âm lượng nhạc/SFX |

## Bản quyền thành phần
Fonts: SIL Open Font License (Google Fonts). Remotion: miễn phí cho cá nhân/công ty ≤3 người.
ffmpeg-skill: MIT. ffmpeg (BtbN build): GPL. Tiếng hiệu ứng trong assets/sfx: tự tổng hợp bằng code.
