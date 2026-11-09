# Ban de doc cua lenh ma hoa trong CaiDat_CNCB.bat (noi dung y het).

$ErrorActionPreference = 'Stop'
$name = 'Chuy' + [char]0x1EC7 + 'nNh' + [char]0xE0 + 'Ch' + [char]0xE0 + 'B' + [char]0xF4 + 'ng'
Write-Host '==============================================='
Write-Host '  CAI DAT / CAP NHAT bo cong cu CNCB'
Write-Host '  (agent edit video Chuyen nha Cha Bong)'
Write-Host '==============================================='
Write-Host ''
$drv = Read-Host 'Cai vao o dia nao? (vd E, D, C - Enter = E)'
if (-not $drv) { $drv = 'E' }
$drv = $drv.Trim().TrimEnd(':', '\').ToUpper()
if (-not (Test-Path ($drv + ':\'))) { Write-Host ('[!] Khong tim thay o ' + $drv + ':'); exit 1 }
$dst = Join-Path ($drv + ':\') $name
$update = Test-Path (Join-Path $dst 'AGENT.md')
$tmp = Join-Path $env:TEMP 'cncb_tai_ve'
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
New-Item -ItemType Directory -Path $tmp | Out-Null
Write-Host ''
Write-Host 'Dang tai ban moi nhat tu GitHub...'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
try {
  Invoke-WebRequest 'https://github.com/TongXuanVu/CNCB/archive/refs/heads/main.zip' -OutFile (Join-Path $tmp 'cncb.zip') -UseBasicParsing
} catch {
  Write-Host '[!] Khong tai duoc. Kiem tra mang Internet (hoac repo chua de cong khai).'
  exit 1
}
Write-Host 'Dang giai nen...'
Expand-Archive -Path (Join-Path $tmp 'cncb.zip') -DestinationPath $tmp -Force
$src = Join-Path $tmp 'CNCB-main'
New-Item -ItemType Directory -Path $dst -Force | Out-Null
# Chep cong cu. Clip/mau/nhac/video da lam KHONG bi dung toi (trong ban tai ve cac thu muc do trong).
# Khi cap nhat: giu nguyen style.json (cai dat rieng cua khach).
$xf = @()
if ($update) { $xf = @('/XF', (Join-Path $dst 'style.json')) }
& robocopy $src $dst /E /NFL /NDL /NJH /NJS /NP @xf | Out-Null
if ($LASTEXITCODE -ge 8) { Write-Host ('[!] Loi khi chep file (robocopy ' + $LASTEXITCODE + ').'); exit 1 }
Remove-Item $tmp -Recurse -Force
Write-Host ''
if ($update) { Write-Host ('DA CAP NHAT xong: ' + $dst) } else { Write-Host ('DA CAI xong: ' + $dst) }
Write-Host ''
Write-Host 'Buoc tiep theo: mo app Claude tren may tinh, mo chat moi va nhan:'
Write-Host ('  "Ket noi thu muc ' + $dst + ', chay bash tools/install.sh toi khi xong roi source tools/setup.sh"')
Write-Host '(chi can lam 1 lan; lan cap nhat sau khong can)'
Start-Process explorer.exe $dst
$hd = Join-Path $dst 'HUONG_DAN_SU_DUNG.md'
if (Test-Path $hd) { Start-Process notepad.exe $hd }
