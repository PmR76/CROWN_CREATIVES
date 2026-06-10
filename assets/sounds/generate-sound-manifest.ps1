$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem -Path $folder -Filter *.mp3 | Select-Object -ExpandProperty Name

$manifest = @{
    sounds = $files
}

$manifestJson = $manifest | ConvertTo-Json -Depth 3
$outPath = Join-Path $folder "sound-manifest.json"
$manifestJson | Set-Content -Path $outPath -Encoding UTF8

Write-Host "sound-manifest.json updated with $($files.Count) file(s)."
