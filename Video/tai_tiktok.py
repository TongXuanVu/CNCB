# Tải N bài mới nhất từ một kênh TikTok, đặt tên theo ngày đăng (YYYY-MM-DD).
# Chạy: python tai_tiktok.py            -> hỏi link kênh + số bài
#       python tai_tiktok.py <link> <số> -> không hỏi
# - Bài VIDEO: video -> Video/template/<ngày>.mp4, nhạc tách ra -> Video/mp3/<ngày>.mp3
# - Bài ẢNH LƯỚT (không có hình): chỉ có nhạc -> Video/mp3/<ngày>.<đuôi>
# Trùng ngày -> thêm _1, _2...; không có ngày -> đặt theo thứ tự 1, 2, 3...
# Trùng tên file đã có -> thêm _2, _3... (không ghi đè).
import os, sys, glob, shutil, subprocess
from collections import Counter

def need(mod, pkg):
    try:
        return __import__(mod)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-U", pkg])
        return __import__(mod)

MAC_DINH_URL = "https://www.tiktok.com/@.iembun.daily"
MAC_DINH_SO = 20
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_V = os.path.join(HERE, "template")
OUT_A = os.path.join(HERE, "mp3")
TMP = os.path.join(HERE, "_tmp")
VID = {".mp4", ".mov", ".m4v", ".webm", ".mkv"}

def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    return need("imageio_ffmpeg", "imageio-ffmpeg").get_ffmpeg_exe()

def has_video(ff, path):
    # ffmpeg -i in thông tin luồng ra stderr; có "Video:" (không phải ảnh bìa) là có hình
    r = subprocess.run([ff, "-hide_banner", "-i", path], capture_output=True, text=True, errors="ignore")
    return any("Video:" in l and "attached pic" not in l for l in r.stderr.splitlines())

def free_name(folder, name, ext):
    dst, k = os.path.join(folder, name + ext), 2
    while os.path.exists(dst):
        dst = os.path.join(folder, f"{name}_{k}{ext}")
        k += 1
    return dst

def place(ff, src, name):
    """Đặt 1 file tải về vào đúng thư mục. Trả về danh sách file đã tạo."""
    ext = os.path.splitext(src)[1].lower()
    made = []
    if ext in VID and has_video(ff, src):
        dst = free_name(OUT_V, name, ext)
        os.replace(src, dst); made.append(dst)
        mp3 = free_name(OUT_A, name, ".mp3")
        r = subprocess.run([ff, "-v", "error", "-y", "-i", dst, "-vn", "-c:a", "libmp3lame", "-q:a", "2", mp3],
                           capture_output=True, text=True, errors="ignore")
        if r.returncode == 0 and os.path.exists(mp3):
            made.append(mp3)
        else:
            print(f"   (không tách được nhạc từ {os.path.basename(dst)}: {r.stderr.strip()[:200]})")
    else:
        # bài ảnh lướt / file chỉ có tiếng (kể cả .mp4 không có hình)
        aext = ".m4a" if ext in VID else ext
        dst = free_name(OUT_A, name, aext)
        os.replace(src, dst); made.append(dst)
    return made

def run(yt_dlp, ff, url, n, browser=None):
    opts = {
        "outtmpl": os.path.join(TMP, "%(id)s.%(ext)s"),
        "playlistend": n,
        "format": "bv*+ba/b",
        "merge_output_format": "mp4",
        "ffmpeg_location": ff,
        "sleep_interval": 2, "max_sleep_interval": 5,
        "ignoreerrors": True,
    }
    if browser:
        opts["cookiesfrombrowser"] = (browser,)
    with yt_dlp.YoutubeDL(opts) as y:
        info = y.extract_info(url, download=True)
    return [e for e in ((info or {}).get("entries") or []) if e]

def date_of(e):
    d = e.get("upload_date")
    return f"{d[:4]}-{d[4:6]}-{d[6:]}" if d else None

def chuan_link(s):
    s = s.strip().strip('"').strip()
    if not s:
        return None
    if s.startswith("@"):
        return "https://www.tiktok.com/" + s
    if "tiktok.com/@" in s:
        if not s.startswith("http"):
            s = "https://" + s.lstrip("/")
        return s.split("?")[0].rstrip("/")
    return None

def hoi():
    a = sys.argv[1:]
    url = chuan_link(a[0]) if a else None
    while not url:
        s = input(f"Link kênh TikTok (vd https://www.tiktok.com/@ten_kenh hoặc @ten_kenh)\n"
                  f"[Enter = {MAC_DINH_URL}]: ")
        url = chuan_link(s) if s.strip() else MAC_DINH_URL
        if not url:
            print("  Link không đúng, cần có dạng tiktok.com/@ten_kenh hoặc @ten_kenh.")
    n = a[1] if len(a) > 1 else None
    while True:
        if n is None:
            n = input(f"Số bài mới nhất cần tải [Enter = {MAC_DINH_SO}]: ").strip() or str(MAC_DINH_SO)
        if n.isdigit() and int(n) > 0:
            return url, int(n)
        print("  Cần một số nguyên lớn hơn 0.")
        n = None

def main():
    url, n = hoi()
    print(f"\nTải {n} bài mới nhất từ {url}")
    for d in (OUT_V, OUT_A, TMP):
        os.makedirs(d, exist_ok=True)
    yt_dlp = need("yt_dlp", "yt-dlp")
    ff = ffmpeg_exe()
    entries = []
    for b in [None, "firefox", "edge", "chrome"]:
        print(f"\n=== Thử tải {'không cookies' if not b else 'với cookies ' + b} ===")
        try:
            entries = run(yt_dlp, ff, url, n, b)
        except Exception as ex:
            print("Lỗi:", ex)
            continue
        if entries:
            break
    if not entries:
        print("\nKhông lấy được bài nào. Hãy đăng nhập TikTok trên Firefox rồi chạy lại.")
        sys.exit(1)

    dates = [date_of(e) for e in entries]
    count, seen = Counter(d for d in dates if d), Counter()
    nv = na = 0
    for i, (e, d) in enumerate(zip(entries, dates), 1):
        files = glob.glob(os.path.join(TMP, glob.escape(e["id"]) + ".*"))
        if not files:
            continue
        if d:
            if count[d] > 1:
                seen[d] += 1
                name = f"{d}_{seen[d]}"
            else:
                name = d
        else:
            name = str(i)
        for f in place(ff, files[0], name):
            if os.path.dirname(f) == OUT_V:
                nv += 1
            else:
                na += 1
            print("->", os.path.relpath(f, HERE))
    try:
        os.rmdir(TMP)
    except OSError:
        pass

if __name__ == "__main__":
    main()
