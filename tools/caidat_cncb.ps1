# Ban de doc cua lenh ma hoa trong CaiDat_CNCB.bat (noi dung y het).

$ErrorActionPreference = 'Stop'
$name = 'Chuy' + [char]0x1EC7 + 'nNh' + [char]0xE0 + 'Ch' + [char]0xE0 + 'B' + [char]0xF4 + 'ng'
Write-Host '==============================================='
Write-Host '  CAI DAT / CAP NHAT bo cong cu CNCB'
Write-Host '  (agent edit video Chuyen nha Cha Bong)'
Write-Host '==============================================='
Write-Host ''

# Cai ngay tai thu muc chua file .bat (bien CNCB_DIR do file .bat truyen vao):
# - thu muc do da la bo cong cu (co AGENT.md)  -> cap nhat tai cho
# - con lai                                      -> tao thu muc con ChuyenNhaChaBong ngay canh file .bat
$base = $env:CNCB_DIR
if (-not $base) { $base = (Get-Location).Path }
$base = $base.TrimEnd('\')
if (Test-Path (Join-Path $base 'AGENT.md')) { $dst = $base } else { $dst = Join-Path $base $name }
Write-Host ('Thu muc cai dat: ' + $dst)
if ((Split-Path $dst -Leaf) -ne $name) {
  Write-Host '[!] Luu y: ten thu muc nen dat dung la ChuyenNhaChaBong (co dau) de Claude tim thay.'
}
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

# Khi cap nhat: giu nguyen file cua nguoi dung (xem $giu ben duoi).

$xf = @()
if ($update) {
  # File cua nguoi dung: khong ghi de khi cap nhat (cai dat rieng + thu vien tu tao)
  $giu = @('style.json', 'tools\remotion\src\Custom.tsx', 'tools\remotion\catalog_tutao.png', 'tools\presets_tutao.json', 'tools\thu_vien_tutao.md')
  $co = $giu | ForEach-Object { Join-Path $dst $_ } | Where-Object { Test-Path $_ }
  if ($co) { $xf = @('/XF') + @($co) }
}
& robocopy $src $dst /E /NFL /NDL /NJH /NJS /NP @xf | Out-Null
if ($LASTEXITCODE -ge 8) { Write-Host ('[!] Loi khi chep file (robocopy ' + $LASTEXITCODE + ').'); exit 1 }
Remove-Item $tmp -Recurse -Force
Write-Host ''
if ($update) { Write-Host ('DA CAP NHAT xong: ' + $dst) } else { Write-Host ('DA CAI xong: ' + $dst) }
Write-Host ''
Write-Host 'Buoc tiep theo: mo app Claude tren may tinh, mo chat moi va nhan:'
Write-Host ('  "Doc file ' + (Join-Path $dst 'CAI_DAT_CLAUDE.md') + ' va lam theo"')
Write-Host '(chi can lam 1 lan; lan cap nhat sau khong can)'
Start-Process explorer.exe $dst
$hd = Join-Path $dst 'HUONG_DAN_SU_DUNG.md'
if (Test-Path $hd) { Start-Process notepad.exe $hd }
