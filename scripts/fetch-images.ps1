# Downloads every image the site uses from the Webflow CDN into assets\img.
# Run once from the repo folder in PowerShell:
#   powershell -ExecutionPolicy Bypass -File scripts\fetch-images.ps1
# Safe to re-run: files that already exist are skipped. Add -Force to re-download.
param([switch]$Force)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content (Join-Path $root "scripts\image-manifest.json") -Raw | ConvertFrom-Json
$ok = 0; $skipped = 0; $failed = @()
foreach ($entry in $manifest.PSObject.Properties) {
  $dest = Join-Path $root ($entry.Value.path -replace '/', '\')
  if ((Test-Path $dest) -and -not $Force) { $skipped++; continue }
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  $saved = $false
  foreach ($url in $entry.Value.urls) {
    try { Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing; $saved = $true; break } catch { }
  }
  if ($saved) { $ok++; Write-Host "saved $($entry.Value.path)" } else { $failed += $entry.Name; Write-Warning "FAILED $($entry.Name)" }
}
Write-Host ""
Write-Host "Done. $ok downloaded, $skipped already there, $($failed.Count) failed."
