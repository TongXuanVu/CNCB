#!/usr/bin/env python3
"""Dựng NHIỀU video của 1 mẻ (mẻ có v1/, v2/... mỗi cái 1 plan.json riêng). Chỉ dựng những v người dùng đã duyệt.
  timeout 175 python3 tools/render_many.py batches/<mẻ> v1 v3          dựng v1 và v3; chạy lại tới khi in ALL DONE
  timeout 175 python3 tools/render_many.py batches/<mẻ> v2 --preview   chỉ làm ảnh xem trước chữ cho v2
Mỗi lần chạy dùng tối đa ~165 giây rồi dừng (render_batch.py lưu tiến độ, chạy lại là làm tiếp).
Video xong được chép ra batches/<mẻ>/output/v1_<tên>_9x16.mp4 ...; v nào đã xong (và plan.json không đổi) thì bỏ qua."""
import os, signal, subprocess, sys, time, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
BUDGET = float(os.environ.get("RENDER_BUDGET", 165))
t0 = time.time()

def run(cmd, limit):
    """Chạy cmd tối đa limit giây, in log ra; trả (xong?, các dòng log). Hết giờ thì giết cả nhóm tiến trình."""
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, start_new_session=True)
    lines = []
    try:
        out, _ = p.communicate(timeout=limit)
    except subprocess.TimeoutExpired:
        os.killpg(p.pid, signal.SIGKILL); out, _ = p.communicate()
        lines = out.splitlines(); print("\n".join(lines[-6:])); return None, lines
    lines = out.splitlines(); print("\n".join(lines[-8:]))
    return p.returncode == 0, lines

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    preview = "--preview" in sys.argv
    if len(args) < 2:
        sys.exit(__doc__)
    batch, vs = args[0].rstrip("/"), args[1:]
    for v in vs:
        if not os.path.isfile(os.path.join(batch, v, "plan.json")):
            sys.exit(f"LỖI: thiếu {batch}/{v}/plan.json")
    outdir = os.path.join(batch, "output"); os.makedirs(outdir, exist_ok=True)
    for v in vs:
        vd = os.path.join(batch, v)
        mark = os.path.join(vd, "output", ".done")
        if not preview and os.path.isfile(mark) and os.path.getmtime(mark) > os.path.getmtime(os.path.join(vd, "plan.json")):
            print(f"== {v}: đã xong trước đó, bỏ qua"); continue
        left = BUDGET - (time.time() - t0)
        if left < 25:
            print(f"CHƯA XONG (hết lượt ở {v}) — chạy lại lệnh này"); sys.exit(2)
        print(f"== {v}: {'xem trước chữ' if preview else 'dựng'} (còn {left:.0f}s)", flush=True)
        ok, lines = run([sys.executable, "tools/render_batch.py", vd] + (["--preview"] if preview else []), left)
        if ok is None:
            print(f"CHƯA XONG ({v} đang dựng dở) — chạy lại lệnh này"); sys.exit(2)
        if not ok:
            print(f"LỖI ở {v} (xem log trên). Dừng."); sys.exit(1)
        if preview:
            continue
        if not any(l.strip() == "DONE" for l in lines):
            print(f"CHƯA XONG ({v}) — chạy lại lệnh này"); sys.exit(2)
        for l in lines:
            if l.startswith("Xuất:"):
                src = l.split(":", 1)[1].strip()
                dst = os.path.join(outdir, f"{v}_{os.path.basename(src)}")
                shutil.copyfile(src, dst); print(f"-> {dst}")
        open(mark, "w").write(time.strftime("%F %T"))
    print("ALL DONE" if not preview else "PREVIEW ALL DONE")

if __name__ == "__main__":
    main()
