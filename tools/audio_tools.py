#!/usr/bin/env python3
"""Âm thanh cho render_batch.py: dò nhịp nhạc, tạo tiếng hiệu ứng (SFX), dựng track SFX theo thời gian.
Chỉ dùng numpy + ffmpeg (máy ảo không đủ chỗ cài librosa).
  python3 tools/audio_tools.py beats assets/music/x.mp3     -> in tempo + nhịp (lưu cache x.mp3.beats.json)
  python3 tools/audio_tools.py sfx                          -> tạo lại assets/sfx/*.wav
"""
import json, os, subprocess, sys, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VBIN = os.path.join(ROOT, "tools", "vendor", "bin")
FF = os.path.join(VBIN, "ffmpeg") if os.path.isfile(os.path.join(VBIN, "ffmpeg")) else "ffmpeg"
SR = 44100
SFX_DIR = os.path.join(ROOT, "assets", "sfx")

# ---------------------------------------------------------------- dò nhịp
def _decode(path, sr):
    raw = subprocess.run([FF, "-v", "error", "-i", path, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)

def beat_grid(path):
    """{"tempo": bpm, "beats": [giây...], "start": nhịp mạnh đầu tiên}. Lưu cache cạnh file nhạc."""
    cache = path + ".beats3.json"
    if os.path.isfile(cache) and os.path.getmtime(cache) >= os.path.getmtime(path):
        return json.load(open(cache, encoding="utf-8"))
    sr, hop, n = 11025, 256, 1024
    y = _decode(path, sr)
    frames = 1 + (len(y) - n) // hop
    idx = np.arange(n)[None, :] + hop * np.arange(frames)[:, None]
    spec = np.abs(np.fft.rfft(y[idx] * np.hanning(n), axis=1))
    logs = np.log1p(100 * spec)
    flux = np.maximum(0, np.diff(logs, axis=0)).sum(axis=1)
    flux = np.concatenate([[0], flux])
    flux -= np.convolve(flux, np.ones(16) / 16, mode="same")          # bỏ xu hướng chậm
    flux = np.maximum(flux, 0)
    fps = sr / hop
    # tempo: tự tương quan, ưu tiên quanh 100 BPM
    ac = np.correlate(flux, flux, mode="full")[len(flux) - 1:]
    lags = np.arange(len(ac))
    bpm = 60 * fps / np.maximum(lags, 1)
    ok = (bpm >= 60) & (bpm <= 180)
    w = np.exp(-0.5 * (np.log2(np.maximum(bpm, 1) / 100) / 0.9) ** 2)
    lag = int(lags[ok][np.argmax((ac * w)[ok])])
    # tinh chỉnh chu kỳ (lag lẻ) bằng nội suy parabol
    a, b, c = ac[lag - 1], ac[lag], ac[lag + 1]
    period = (lag + 0.5 * (a - c) / (a - 2 * b + c + 1e-9)) / fps
    # bám nhịp động (Ellis 2007): mỗi nhịp chọn điểm onset mạnh, phạt khi khoảng cách lệch chu kỳ
    P = period * fps
    env = flux / (flux.std() + 1e-9)
    score = env.copy(); back = -np.ones(len(env), dtype=int)
    lo, hi = int(round(P / 2)), int(round(2 * P))
    offs = np.arange(lo, hi + 1)
    pen = -100.0 * np.log(offs / P) ** 2
    for t in range(hi, len(env)):
        cand = score[t - offs] + pen
        j = int(np.argmax(cand))
        score[t] = env[t] + cand[j]; back[t] = t - offs[j]
    tail = len(env) - int(2 * P)
    t = tail + int(np.argmax(score[tail:]))
    path = []
    while t >= 0:
        path.append(t); t = back[t]
    # +n/sr: chênh lệch onset tính ở CUỐI cửa sổ phân tích (đã đối chiếu librosa: lệch trung vị 0,000s)
    beats = np.array(path[::-1], dtype=float) / fps + n / sr
    # nối thêm nhịp ở đoạn đầu (trước khi DP bắt đầu) theo chu kỳ
    while beats[0] - period > 0:
        beats = np.concatenate([[beats[0] - period], beats])
    # nhịp mạnh đầu tiên: nơi âm lượng (cửa sổ 2 nhịp) đạt 60% trung vị bài
    rms = np.sqrt(np.convolve(y ** 2, np.ones(sr // 2) / (sr // 2), mode="same"))
    loud = np.median(rms[rms > 0]) * 0.6
    start = next((float(t) for t in beats if rms[min(int(t * sr), len(rms) - 1)] >= loud), float(beats[0]))
    out = {"tempo": round(60 / period, 2), "period": round(period, 4), "start": round(start, 3),
           "beats": [round(float(t), 3) for t in beats]}
    with open(cache, "w", encoding="utf-8") as f:
        json.dump(out, f)
    return out

def snap_durations(durs, maxlen, trans, td, grid, min_len=0.45):
    """Dời điểm cắt về nhịp gần nhất. durs: độ dài dự kiến; maxlen: độ dài tối đa còn trong clip (None = ảnh);
    trans: chuyển cảnh VÀO cảnh k ("cut" hoặc xfade); grid: các nhịp tính theo thời gian video (0 = đầu video).
    Trả về độ dài mới. Với xfade, đặt TÂM chuyển cảnh lên nhịp."""
    grid = np.asarray(grid)
    out, T = [], 0.0
    for k, d in enumerate(durs):
        nxt = trans[k + 1] if k + 1 < len(durs) else "cut"
        dd = 0.0 if nxt == "cut" else min(td, d / 2)
        E = T + d
        target = E - dd / 2
        cand = grid[(grid - dd / 2 - T >= min_len)]
        if len(cand):
            order = cand[np.argsort(np.abs(cand - target))]
            for g in order[:6]:
                newd = g + dd / 2 - T
                if maxlen[k] is None or newd <= maxlen[k] + 1e-3:
                    d = newd
                    break
        out.append(round(float(d), 3))
        T = T + d - dd
    return out

# ---------------------------------------------------------------- tiếng hiệu ứng (tự tổng hợp, không bản quyền)
def _env(n, a=0.002, r=0.08):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)

def _synth(name):
    rng = np.random.default_rng(7)
    if name == "type":          # tiếng gõ phím: tách ngắn + thân gỗ
        n = int(0.05 * SR); t = np.arange(n) / SR
        x = rng.normal(0, 1, n) * np.exp(-t / 0.004) * 0.6 + np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.012) * 0.5
    elif name == "ting":        # chuông nhỏ khi dòng phụ / sticker lấp lánh
        n = int(0.9 * SR); t = np.arange(n) / SR
        x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / dcy) for f, a, dcy in
                ((1568, 0.6, 0.35), (2349, 0.3, 0.25), (3136, 0.18, 0.15), (4699, 0.08, 0.08)))
        x *= np.minimum(1, t / 0.002)
    elif name == "pop":         # bong bóng nổ khi mốc giờ hiện
        n = int(0.14 * SR); t = np.arange(n) / SR
        f = 380 + 900 * np.exp(-t / 0.02)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * _env(n, 0.001, 0.035)
    elif name == "tick":        # đổi dòng chữ
        n = int(0.06 * SR); t = np.arange(n) / SR
        x = np.sin(2 * np.pi * 2600 * t) * np.exp(-t / 0.008) * 0.8 + rng.normal(0, 1, n) * np.exp(-t / 0.002) * 0.2
    elif name == "boing":       # sticker nảy ra
        n = int(0.32 * SR); t = np.arange(n) / SR
        f = 260 + 220 * np.exp(-t / 0.05) + 40 * np.sin(2 * np.pi * 18 * t) * np.exp(-t / 0.12)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * _env(n, 0.002, 0.11)
    elif name == "whoosh":      # chuyển cảnh
        n = int(0.45 * SR); t = np.arange(n) / SR
        noise = rng.normal(0, 1, n)
        k = np.exp(-np.arange(64) / 6.0); noise = np.convolve(noise, k / k.sum(), mode="same")
        x = noise * np.sin(np.pi * t / t[-1]) ** 2 * 1.2
    else:
        raise ValueError(name)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    return x.astype(np.float32)

SFX_NAMES = ("type", "ting", "pop", "tick", "boing", "whoosh")

def _write_wav(path, x):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

def _read_wav(path):
    # đọc mọi định dạng qua ffmpeg (Vũ có thể thay bằng file mp3/wav của mình)
    return _decode(path, SR)

def ensure_sfx():
    os.makedirs(SFX_DIR, exist_ok=True)
    for nm in SFX_NAMES:
        if not any(os.path.isfile(os.path.join(SFX_DIR, nm + e)) for e in (".wav", ".mp3")):
            _write_wav(os.path.join(SFX_DIR, nm + ".wav"), _synth(nm))

def sfx_file(nm):
    for e in (".mp3", ".wav"):          # file mp3 của Vũ được ưu tiên hơn file tự tạo
        p = os.path.join(SFX_DIR, nm + e)
        if os.path.isfile(p):
            return p
    raise FileNotFoundError(nm)

def render_sfx_track(events, total, out, gap=0.12):
    """events: [(giây, tên, âm lượng)] -> file wav mono. Bỏ tiếng trùng sát nhau (< gap giây) để khỏi rối."""
    ensure_sfx()
    cache = {}
    buf = np.zeros(int((total + 1.5) * SR), dtype=np.float32)
    last = -9.0
    for t, nm, vol in sorted(events):
        if t - last < gap and nm != "type":
            continue
        last = t if nm != "type" else last
        if nm not in cache:
            cache[nm] = _read_wav(sfx_file(nm))
        x = cache[nm] * vol
        i = int(max(0, t) * SR)
        j = min(len(buf), i + len(x))
        buf[i:j] += x[: j - i]
    _write_wav(out, np.tanh(buf * 1.1) / np.tanh(1.1))

if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "beats":
        g = beat_grid(sys.argv[2])
        print("tempo", g["tempo"], "BPM | chu kỳ", g["period"], "s | nhịp mạnh đầu", g["start"], "s | 12 nhịp đầu:", g["beats"][:12])
    elif len(sys.argv) >= 2 and sys.argv[1] == "sfx":
        for nm in SFX_NAMES:
            _write_wav(os.path.join(SFX_DIR, nm + ".wav"), _synth(nm)) if os.makedirs(SFX_DIR, exist_ok=True) is None else None
        print("đã tạo:", ", ".join(os.listdir(SFX_DIR)))
    else:
        print(__doc__)
