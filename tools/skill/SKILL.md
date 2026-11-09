---
name: editvideocncb
description: Edit video cho kênh Chuyện nhà Chà Bông (CNCB) từ clip trong thư mục ChuyệnNhàChàBông\Video theo quy trình 4 bước có duyệt. Dùng khi người dùng gõ /editvideocncb hoặc nhờ edit/làm video Chà Bông.
---

# EditvideoCNCB — Chuyện nhà Chà Bông

Toàn bộ công cụ và quy trình nằm trên máy của người dùng, trong thư mục tên `ChuyệnNhàChàBông` (ví dụ `E:\ChuyệnNhàChàBông`).
Skill này chỉ là lối vào; nguồn sự thật là `AGENT.md` trong thư mục đó.

## Khởi động (làm theo thứ tự)
1. Cần máy tính của người dùng được nối với phiên này (công cụ `mcp__remote-devices__*`). Nếu chưa có: báo người dùng mở
   đoạn chat trong app Claude trên máy tính rồi nhắn lại.
2. Kiểm tra thư mục đã kết nối chưa (`get_device_info` -> `connectedFolders`). Chưa có thì hỏi người dùng đường dẫn thư mục
   ChuyệnNhàChàBông trên máy (hoặc tìm trong `homeDirectories`/ổ đĩa) và gọi `device_request_folder_access`.
3. Tên thư mục trong máy ảo có thể là `$HOME/mnt/ChuyệnNhàChàBông` hoặc có tiền tố ổ như `$HOME/mnt/E:--ChuyệnNhàChàBông`
   — không gõ cứng. Mọi lệnh bash bắt đầu bằng:
   `cd "$(for d in "$HOME"/mnt/*ChuyệnNhàChàBông; do [ -f "$d/AGENT.md" ] && echo "$d" && break; done)" && source tools/setup.sh && ...`
   (setup.sh khôi phục ffmpeg 8.1 + Remotion; phải chạy trong cùng lệnh vì mỗi lệnh là một shell mới.)
4. Đọc toàn bộ `AGENT.md` (và `BAN_GIAO.md` nếu cần chi tiết kỹ thuật) rồi làm đúng theo đó.
   Trong các file đó, "Vũ" = người đang dùng agent.
5. Liệt kê `Video/` và `batches/` để biết có clip mới hoặc mẻ đang dở không, rồi báo ngắn gọn tình trạng.

## Quy tắc cứng
- KHÔNG dựng video thật khi người dùng chưa nói rõ "ok dựng" cho đúng mẻ đó. Chỉ chạy `--preview` sau khi họ duyệt nội dung.
- Không xóa file (thư mục chặn xóa); cái gì bỏ đi thì chuyển vào `_to_delete/` và báo người dùng.
- Không sửa `assets/`, `style.json`, `tools/` khi người dùng chưa đồng ý.
- Lỗi thì dừng và báo nguyên văn + đề xuất cách sửa, chờ "ok sửa".
- Không làm ảnh bìa (người dùng làm trong TikTok).
- Mỗi lệnh `device_bash` tối đa ~170 giây: luôn bọc `timeout 170`, chạy lại cho tới khi script in DONE.
- Không dùng `pkill -f` với chuỗi có trong chính lệnh đang chạy.
- Ổ máy ảo rất nhỏ: không cài thư viện lớn, file tạm để ở $HOME rồi dọn.

## Quy trình 4 bước (chi tiết trong AGENT.md)
1. Nhận nội dung -> `tools/new_batch.sh` tạo mẻ từ `Video/`, `tools/preview_batch.sh` xem clip -> viết `ke-hoach.md` -> gửi duyệt, DỪNG.
2. Duyệt -> viết `plan.json` -> `render_batch.py --preview` -> gửi ảnh `preview/chu_*.jpg` (ghép thành 1 ảnh lưới) để duyệt.
3. Chốt nhạc (mặc định assets/music, cắt theo nhịp, có hiệu ứng âm thanh).
4. "ok dựng" -> `render_batch.py` tới DONE -> kiểm tra `check.py --platform tiktok` + xem vài khung hình -> báo tên file, độ dài.

Trả lời bằng tiếng Việt, ngắn gọn, tự nhiên.
