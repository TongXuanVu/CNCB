#!/usr/bin/env python3
"""Dựng video cho 1 mẻ theo batches/<mẻ>/plan.json (chữ + hiệu ứng bằng Remotion, ghép bằng ffmpeg).
  timeout 170 python3 tools/render_batch.py batches/<mẻ> --preview   chỉ làm ảnh xem trước chữ (preview/chu_*.jpg)
  timeout 170 python3 tools/render_batch.py batches/<mẻ>             dựng video; chạy lại tới khi in DONE
Bước nào xong rồi được bỏ qua, nên bị ngắt giữa chừng thì cứ chạy lại."""
import hashlib, json, os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audio_tools  # dò nhịp, tiếng hiệu ứng

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
IMG = {".jpg", ".jpeg", ".png", ".webp"}
VBIN = os.path.join(ROOT, "tools", "vendor", "bin")
FF = os.path.join(VBIN, "ffmpeg") if os.path.isfile(os.path.join(VBIN, "ffmpeg")) else "ffmpeg"
FP = os.path.join(VBIN, "ffprobe") if os.path.isfile(os.path.join(VBIN, "ffprobe")) else "ffprobe"
REMOTION = os.environ.get("REMOTION_DIR", os.path.expanduser("~/remotion"))
ENC = ["-c:v", "libx264", "-preset", "ultrafast", "-crf", "20",
       "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-ac", "2"]
SRC = os.path.join(ROOT, "tools", "remotion", "src")
CODE_VER = hashlib.md5(b"".join(open(os.path.join(SRC, f), "rb").read() for f in sorted(os.listdir(SRC)))).hexdigest()[:8]
EFFECTS = {"hearts": "Hearts", "sparkles": "Sparkles", "lightleak": "LightLeak",
           "frame": "FrameFx", "prism": "Prism", "confetti": "Confetti", "stars": "FloatStars"}
XFADE = {"zoomin", "fadewhite", "fade", "hblur", "smoothleft", "smoothright", "smoothup", "radial", "dissolve", "slideleft"}

def sh(cmd):
    print("+", os.path.basename(cmd[0]), " ".join(map(str, cmd[1:7])), "...", flush=True)
    subprocess.run(cmd, check=True)

def probe_dur(p):
    r = subprocess.run([FP, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())

def has_audio(p):
    r = subprocess.run([FP, "-v", "error", "-select_streams", "a", "-show_entries", "stream=index",
                        "-of", "csv=p=0", p], capture_output=True, text=True)
    return bool(r.stdout.strip())

def need(p):
    if not os.path.isfile(p):
        sys.exit(f"THIẾU FILE: {p}")

def h(obj):
    return hashlib.md5(json.dumps(obj, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:10]

def build(out, make):
    if os.path.isfile(out) and os.path.getsize(out) > 0:
        return
    tmp = out + ".part"
    sh(make(tmp))
    os.replace(tmp, out)

def clean_remotion_tmp():
    """Dọn bundle tạm Remotion còn sót (lượt trước bị timeout giết giữa chừng nên không kịp dọn) -> tránh đầy ổ máy ảo."""
    import glob
    tmp = os.environ.get("TMPDIR") or os.path.expanduser("~/tmp")
    stale = glob.glob(os.path.join(tmp, "remotion-webpack-bundle-*")) + glob.glob(os.path.join(tmp, "react-motion-*"))
    for d in stale:
        shutil.rmtree(d, ignore_errors=True)
    if stale:
        print(f"+ dọn {len(stale)} thư mục tạm Remotion còn sót", flush=True)

def run_remotion(jobs, work):
    clean_remotion_tmp()
    jobs = [j for j in jobs if not os.path.isfile(j["out"])]
    if not jobs:
        return
    jf = os.path.join(work, f"jobs_{h(jobs)}.json")
    with open(jf, "w", encoding="utf-8") as f:
        json.dump(jobs, f, ensure_ascii=False)
    env = dict(os.environ, CHABONG_ASSETS=os.path.join(ROOT, "assets"))
    print(f"+ remotion {len(jobs)} việc ...", flush=True)
    try:
        subprocess.run(["node", os.path.join(REMOTION, "render.mjs"), jf], check=True, env=env)
    finally:
        # Remotion để lại bundle tạm trong máy ảo (ổ rất nhỏ) -> dọn sau mỗi lượt
        import glob
        tmp = os.environ.get("TMPDIR") or os.path.expanduser("~/tmp")
        for d in glob.glob(os.path.join(tmp, "remotion-webpack-bundle-*")) + glob.glob(os.path.join(tmp, "react-motion-*")):
            shutil.rmtree(d, ignore_errors=True)

PRESETS_FILE = os.path.join(ROOT, "tools", "presets.json")

def expand_stickers(items):
    """{"preset": "an_ngon", "x", "y", "scale", "delay", "text"} -> danh sách sticker (xem tools/presets.json)."""
    out, presets = [], None
    for it in items:
        if "preset" not in it:
            out.append(it); continue
        if presets is None:
            presets = json.load(open(PRESETS_FILE, encoding="utf-8"))
            tu = os.path.join(ROOT, "tools", "presets_tutao.json")   # combo tự tạo của người dùng
            if os.path.isfile(tu):
                presets.update(json.load(open(tu, encoding="utf-8")))
        pr = presets.get(it["preset"])
        if not pr:
            sys.exit(f"Combo không có: {it['preset']} (có: {', '.join(k for k in presets if not k.startswith('_'))})")
        k = float(it.get("scale", 1)); x0, y0 = float(it.get("x", 0.5)), float(it.get("y", 0.8))
        base = float(it.get("delay", 0)); text_done = False
        for p in pr["items"]:
            q = {kk: v for kk, v in p.items() if kk not in ("dx", "dy")}
            q["x"] = round(x0 + p.get("dx", 0) * k, 4); q["y"] = round(y0 + p.get("dy", 0) * k, 4)
            if "size" in q: q["size"] = round(q["size"] * k)
            q["delay"] = round(base + p.get("delay", 0), 3)
            if it.get("until") is not None: q["until"] = it["until"]
            if it.get("text") and not text_done and q.get("type") in ("text", "bubble", "burst", "pricetag", "cash", "bubble_line", "bubble_think"):
                q["text"] = it["text"]; text_done = True
            out.append(q)
    return out

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    batch = os.path.relpath(sys.argv[1])
    preview = "--preview" in sys.argv
    plan = json.load(open(os.path.join(batch, "plan.json"), encoding="utf-8"))
    style = json.load(open("style.json", encoding="utf-8"))
    W, H, FPS = style["width"], style["height"], style["fps"]
    theme = style.get("theme", {})
    work = os.path.abspath(os.path.join(batch, "work")); os.makedirs(work, exist_ok=True)
    outdir = os.path.join(batch, "output"); os.makedirs(outdir, exist_ok=True)
    prevdir = os.path.join(batch, "preview"); os.makedirs(prevdir, exist_ok=True)
    base = (f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:black,"
            f"setsar=1,fps={FPS},format=yuv420p")
    name = plan.get("name") or os.path.basename(batch)
    intro = plan.get("intro")

    # ---- 1. Độ dài từng đoạn + các lớp chữ/hiệu ứng cần dựng bằng Remotion
    segs, jobs = [], []
    nseg = len(plan["segments"])
    td = float(style.get("transition_seconds", 0.35))
    music = plan.get("music")
    pre = []                           # (src, is_img, start, dur, độ dài tối đa còn trong clip)
    for s in plan["segments"]:
        src = os.path.join(batch, s["clip"]); need(src)
        is_img = os.path.splitext(src)[1].lower() in IMG
        start = 0.0 if is_img else float(s.get("start", 0))
        if is_img:
            pre.append((src, True, start, float(s.get("duration", 3)), None))
        else:
            full = probe_dur(src)
            pre.append((src, False, start, float(s.get("end", full)) - start, full - start))
    DURS = [p_[3] for p_ in pre]
    mstart, grid = 0.0, None
    if music:
        need(music)
        bg = audio_tools.beat_grid(music)
        mstart = float(plan.get("music_start", bg["start"]))
        if plan.get("beat_sync", True):
            grid = [b - mstart for b in bg["beats"] if b >= mstart - 1e-3]
            trans = [s.get("transition", "cut") for s in plan["segments"]]
            DURS = audio_tools.snap_durations(DURS, [p_[4] for p_ in pre], trans, td, grid)
            print(f"canh theo nhịp {bg['tempo']} BPM (nhạc bắt đầu {mstart:.2f}s): tổng {sum(DURS):.2f}s", flush=True)
    seg_lab = [None] * nseg            # labels: [{"from": 3, "to": 8, "time": "10:30", "text": "...", "pos": "top"}] (số cảnh tính từ 1)
    for b in plan.get("labels", []):
        for k in range(int(b["from"]) - 1, min(int(b["to"]), nseg)):
            seg_lab[k] = b
    TEXTISH = ("TitleCard", "Caption", "Label", "Stickers")
    for i, s in enumerate(plan["segments"]):
        src, is_img, start, _, _ = pre[i]
        dur = DURS[i]
        layers = []   # (comp, props, khung hình để xem trước)
        intro_sec = 0.0
        if i == 0 and intro and intro.get("title"):
            intro_sec = min(float(intro.get("seconds", 4)), dur)
            layers.append(("TitleCard", {"title": intro["title"], "subtitle": intro.get("subtitle", ""),
                           "lines": intro.get("lines", []), "seconds": intro_sec, "theme": theme},
                           int(intro_sec * FPS * 0.8)))
        if s.get("caption"):
            delay = intro_sec + float(s.get("caption_delay", 0))
            layers.append(("Caption", {"text": s["caption"], "seconds": dur, "delay": delay, "theme": theme},
                           int(delay * FPS) + 12))
        b = seg_lab[i]
        if b:
            prev = seg_lab[i - 1] if i > 0 else None
            nxt = seg_lab[i + 1] if i + 1 < nseg else None
            same_time = lambda o: o is not None and bool(b.get("time")) and o.get("time") == b.get("time")
            layers.append(("Label", {"time": b.get("time", ""), "text": b.get("text", ""), "under": b.get("under", ""),
                           "pos": s.get("label_pos", b.get("pos", "top")), "seconds": dur, "delay": intro_sec,
                           "timeIn": not same_time(prev), "timeOut": not same_time(nxt),
                           "textIn": prev is not b, "textOut": nxt is not b, "theme": theme,
                           **{k: b[k] for k in ("anim", "style") if b.get(k)}},
                           int(intro_sec * FPS) + 36))   # chụp xem trước khi chữ đã hiện đủ
        if s.get("stickers"):
            items = expand_stickers(s["stickers"])
            last = max(float(x.get("delay", 0)) for x in items)
            layers.append(("Stickers", {"items": items, "seconds": dur, "theme": theme},
                           min(int(dur * FPS) - 1, int((intro_sec + last) * FPS) + 24)))
        # ảnh xem trước: các lớp chữ/hình (trừ mở đầu) chụp chung 1 khung hình
        rest = [k for k, l in enumerate(layers) if l[0] in TEXTISH and l[0] != "TitleCard"]
        if rest:
            cf = max(layers[k][2] for k in rest)
            for k in rest:
                layers[k] = (layers[k][0], layers[k][1], cf)
        for fx in s.get("effects", []):
            if fx not in EFFECTS:
                sys.exit(f"Hiệu ứng không có: {fx} (có: {', '.join(EFFECTS)})")
            layers.append((EFFECTS[fx], {"seconds": dur, "seed": i, "theme": theme}, int(dur * FPS * 0.5)))
        movs = []
        for comp, props, still_frame in layers:
            key = h([comp, props, CODE_VER])
            mov = os.path.join(work, f"{comp}_{key}.mov")
            png = os.path.join(work, f"{comp}_{key}_f{still_frame}.png")
            if preview and comp in TEXTISH:
                jobs.append({"comp": comp, "props": props, "out": png, "still": True, "frame": still_frame})
            elif not preview:
                jobs.append({"comp": comp, "props": props, "out": mov, "still": False})
            movs.append((comp, mov, png, still_frame))
        tr = s.get("transition", "cut")
        if tr != "cut" and tr not in XFADE:
            sys.exit(f"Chuyển cảnh không có: {tr} (có: cut, {', '.join(sorted(XFADE))})")
        segs.append(dict(i=i, s=s, src=src, is_img=is_img, start=start, dur=dur, movs=movs, transition=tr,
                         intro_sec=intro_sec, layers=layers))

    run_remotion(jobs, work)

    # ---- 2a. Xem trước: mỗi lớp chữ 1 ảnh, chụp đúng lúc lớp đó đang hiện
    if preview:
        for g in segs:
            intro_l = [m for m in g["movs"] if m[0] == "TitleCard"]
            rest_l = [m for m in g["movs"] if m[0] in TEXTISH and m[0] != "TitleCard"]
            groups = [x for x in (intro_l, rest_l) if x]
            for k, grp in enumerate(groups):
                fr_no = grp[0][3]
                t = g["start"] + min(g["dur"] - 0.05, fr_no / FPS)
                fr = os.path.join(work, f"frame_{g['i']:02d}_{h([g['src'], t])}.jpg")
                inp = ["-i", g["src"]] if g["is_img"] else ["-ss", str(t), "-i", g["src"]]
                build(fr, lambda tmp: [FF, "-v", "error", "-y"] + inp + ["-frames:v", "1", "-vf", base, "-f", "image2", tmp])
                args, fc, last = ["-i", fr], "", "0:v"
                for n, m in enumerate(sorted(grp, key=lambda m: m[0] != "Stickers"), 1):
                    args += ["-i", m[2]]
                    fc += f"[{last}][{n}:v]overlay=0:0[o{n}];"
                    last = f"o{n}"
                suffix = "" if len(groups) == 1 else "ab"[k]
                sh([FF, "-v", "error", "-y"] + args + ["-filter_complex", fc.rstrip(";"), "-map", f"[{last}]",
                    "-frames:v", "1", "-q:v", "3", os.path.join(prevdir, f"chu_{g['i'] + 1:02d}{suffix}.jpg")])
        print("PREVIEW DONE ->", prevdir)
        return

    # ---- 2b. Dựng từng đoạn: chuẩn hóa + phủ các lớp
    parts = []   # (file, độ dài, chuyển cảnh vào đoạn này)
    for g in segs:
        s = g["s"]
        vol = 0 if s.get("mute") else float(s.get("volume", 1.0))
        key = h([s, g["dur"], [m[1] for m in g["movs"]], W, H, FPS])
        out = os.path.join(work, f"seg_{g['i']:02d}_{key}.mp4")

        def make(tmp, g=g, vol=vol):
            if g["is_img"]:
                inp = ["-loop", "1", "-t", str(g["dur"]), "-i", g["src"],
                       "-f", "lavfi", "-t", str(g["dur"]), "-i", "anullsrc=r=44100:cl=stereo"]
                amap = "1:a"
            else:
                inp = ["-ss", str(g["start"]), "-t", str(g["dur"]), "-i", g["src"]]
                if has_audio(g["src"]):
                    amap = "0:a:0"
                else:
                    inp += ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
                    amap = "1:a"
            fc, last = f"[0:v]{base}[b0]", "b0"
            # hiệu ứng nằm dưới, chữ nằm trên cùng
            rank = {"Hearts": 0, "Sparkles": 0, "LightLeak": 0, "Stickers": 1}
            order = sorted(g["movs"], key=lambda m: rank.get(m[0], 2))
            for n, (_, mov, _, _) in enumerate(order, 1):
                k = inp.count("-i")
                inp += ["-i", mov]
                fc += f";[{last}][{k}:v]overlay=0:0:eof_action=pass[b{n}]"
                last = f"b{n}"
            fc += f";[{last}]format=yuv420p[v]"
            return ([FF, "-v", "error", "-y"] + inp + ["-filter_complex", fc, "-map", "[v]", "-map", amap,
                    "-af", f"volume={vol}", "-t", str(g["dur"])] + ENC + ["-f", "mp4", tmp])
        build(out, make)
        parts.append((out, g["dur"], g["transition"]))

    outro = style.get("outro_file")
    if plan.get("use_outro", True) and outro and os.path.isfile(outro):
        o = os.path.join(work, f"outro_{h([outro, os.path.getmtime(outro), W, H, FPS])}.mp4")
        def make_outro(tmp):
            a = has_audio(outro)
            inp = ["-i", outro] if a else ["-i", outro, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
            return ([FF, "-v", "error", "-y"] + inp + ["-map", "0:v:0", "-map", "0:a:0" if a else "1:a",
                    "-vf", base, "-shortest"] + ENC + ["-f", "mp4", tmp])
        build(o, make_outro)
        parts.append((o, probe_dur(o), plan.get("outro_transition", "cut")))

    # ---- 3. Nối các đoạn (cắt thẳng hoặc chuyển cảnh xfade)
    jkey = h([[[p[0], p[2]] for p in parts], td, "v2"])
    joined = os.path.join(work, f"joined_{jkey}.mp4")
    if all(p[2] == "cut" for p in parts[1:]):
        lst = os.path.join(work, "list.txt")
        with open(lst, "w", encoding="utf-8") as f:
            for p in parts:
                f.write(f"file '{os.path.basename(p[0])}'\n")
        build(joined, lambda tmp: [FF, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                                   "-c", "copy", "-f", "mp4", tmp])
    else:
        def make_join(tmp):
            inp, fc = [], []
            for k, p in enumerate(parts):
                inp += ["-i", p[0]]
                # ép mọi đoạn về cùng đơn vị thời gian, nếu không xfade từ chối nối sau concat
                fc.append(f"[{k}:v]settb=AVTB,setpts=PTS-STARTPTS[n{k}v]")
                fc.append(f"[{k}:a]asetpts=PTS-STARTPTS[n{k}a]")
            v, a, cur = "n0v", "n0a", parts[0][1]
            for k in range(1, len(parts)):
                tr, d = parts[k][2], min(td, parts[k][1] / 2, cur / 2)
                if tr == "cut":
                    fc.append(f"[{v}][{a}][n{k}v][n{k}a]concat=n=2:v=1:a=1[v{k}][a{k}]")
                    cur += parts[k][1]
                else:
                    fc.append(f"[{v}][n{k}v]xfade=transition={tr}:duration={d:.3f}:offset={cur - d:.3f}[v{k}]")
                    fc.append(f"[{a}][n{k}a]acrossfade=d={d:.3f}[a{k}]")
                    cur += parts[k][1] - d
                v, a = f"v{k}", f"a{k}"
            # đầu ra chuẩn TikTok/iPhone: 30fps đều, yuv420p, đỉnh âm <= -1 dBTP
            fc.append(f"[{v}]fps={FPS},format=yuv420p[vout]")
            fc.append(f"[{a}]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[aout]")
            return ([FF, "-v", "error", "-y"] + inp + ["-filter_complex", ";".join(fc), "-map", "[vout]",
                    "-map", "[aout]"] + ENC + ["-movflags", "+faststart", "-f", "mp4", tmp])
        build(joined, make_join)

    # ---- 4. Thời điểm từng cảnh trong video cuối (giống cách nối ở bước 3)
    starts, cur = [0.0], parts[0][1]
    for k in range(1, len(parts)):
        tr = parts[k][2]
        if tr == "cut":
            starts.append(cur); cur += parts[k][1]
        else:
            d = min(td, parts[k][1] / 2, cur / 2)
            starts.append(cur - d); cur += parts[k][1] - d
    total = cur

    # ---- 5. Tiếng hiệu ứng (SFX): gõ phím ở tên kênh, ting dòng phụ, pop mốc giờ mới, tick đổi chữ, boing sticker
    events = []
    if plan.get("sfx", True):
        sv = float(plan.get("sfx_volume", style.get("sfx_volume", 1.0)))
        TEXTY = ("text", "bubble", "burst", "pricetag", "cash", "bubble_line", "bubble_think")
        for g in segs:
            T, s_ = starts[g["i"]], g["s"]
            if s_.get("sfx") is False:
                continue
            for comp, props, _ in g["layers"]:
                if comp == "TitleCard":
                    chars = list(props["title"]); n = max(1, len(chars))
                    ts = float(theme.get("typeSeconds", 1.0))
                    for k, ch in enumerate(chars):
                        if ch.strip():
                            events.append((T + k / n * ts, "type", 0.25 * sv))
                    if props.get("subtitle"):
                        events.append((T + ts * 0.8, "ting", 0.5 * sv))
                elif comp == "Label":
                    t0 = T + float(props.get("delay", 0))
                    if props.get("timeIn"):
                        events.append((t0, "pop", 0.55 * sv))
                    elif props.get("textIn"):
                        events.append((t0, "tick", 0.45 * sv))
                elif comp == "Caption":
                    events.append((T + float(props.get("delay", 0)), "tick", 0.45 * sv))
                elif comp == "Stickers":
                    for it in props["items"]:
                        nm = "pop" if it.get("type") in TEXTY else "boing"
                        events.append((T + float(it.get("delay", 0)), nm, 0.4 * sv))
                elif comp in ("Sparkles", "FloatStars"):
                    events.append((T + 0.15, "ting", 0.3 * sv))
            if g["i"] > 0 and g["transition"] != "cut":
                events.append((T, "whoosh", 0.35 * sv))
            for x in s_.get("sfx_extra", []):          # [{"t": 1.2, "sound": "ting", "vol": 0.5}]
                events.append((T + float(x.get("t", 0)), x["sound"], float(x.get("vol", 0.5)) * sv))

    # ---- 6. Trộn âm thanh: tiếng gốc (hạ nhỏ khi có nhạc) + nhạc (bắt đầu đúng nhịp, mờ dần cuối) + SFX
    final = joined
    if music or events:
        sfx_wav = None
        if events:
            sfx_wav = os.path.join(work, f"sfx_{h([events, total])}.wav")
            if not os.path.isfile(sfx_wav):
                audio_tools.render_sfx_track(events, total, sfx_wav)
        mv = float(plan.get("music_volume", style.get("music_volume", 0.5)))
        ov = float(plan.get("orig_volume", 0.4 if music else 1.0))
        final = os.path.join(work, f"mix_{h([joined, music, mstart, mv, ov, sfx_wav])}.mp4")
        def make_mix(tmp):
            inp, fc, mixin = ["-i", joined], [f"[0:a]volume={ov}[o]"], "[o]"
            n = 1
            if music:
                inp += ["-ss", f"{mstart:.3f}", "-i", music]
                fc.append(f"[{n}:a]atrim=0:{total + 0.1:.3f},volume={mv},afade=t=in:d=0.05,"
                          f"afade=t=out:st={max(0, total - 1.5):.3f}:d=1.5[m]")
                mixin += "[m]"; n += 1
            if sfx_wav:
                inp += ["-i", sfx_wav]
                fc.append(f"[{n}:a]aresample=44100,pan=stereo|c0=c0|c1=c0[s]")
                mixin += "[s]"; n += 1
            fc.append(f"{mixin}amix=inputs={n}:duration=first:dropout_transition=0:normalize=0,"
                      f"loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[a]")
            return ([FF, "-v", "error", "-y"] + inp + ["-filter_complex", ";".join(fc), "-map", "0:v", "-map", "[a]",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-f", "mp4", tmp])
        build(final, make_mix)
        print(f"âm thanh: nhạc={'có' if music else 'không'}, {len(events)} tiếng hiệu ứng", flush=True)

    out916 = os.path.join(outdir, f"{name}_9x16.mp4")
    shutil.copyfile(final, out916)
    print("Xuất:", out916)
    if plan.get("export_16x9", style.get("export_16x9")):
        w169 = os.path.join(work, f"wide_{h(final)}.mp4")
        build(w169, lambda tmp: [FF, "-v", "error", "-y", "-i", final, "-filter_complex",
              "[0:v]split[a][b];[a]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
              "boxblur=30:5[bg];[b]scale=-2:1080[fg];[bg][fg]overlay=(W-w)/2:0,format=yuv420p[v]",
              "-map", "[v]", "-map", "0:a", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "22",
              "-c:a", "copy", "-movflags", "+faststart", "-f", "mp4", tmp])
        shutil.copyfile(w169, os.path.join(outdir, f"{name}_16x9.mp4"))
    print("DONE")

if __name__ == "__main__":
    main()
