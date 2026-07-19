# Scan all .jsx and .js files in core-lab-react/src/pages for imports
Write-Host "=== Import Check ==="

Get-ChildItem -Recurse -Include *.jsx,*.js "C:\DEV\CROWN_CREATIVES\test\core-lab-react\src\pages" | ForEach-Object {
    $file = $_.FullName
    $lines = Get-Content $file | Select-String -Pattern 'import .* from "..\/components\/|import .* from "..\/styles\/'
    foreach ($line in $lines) {
        Write-Host "$file : $($line.Line)"
    }
}

Write-Host "=== End of Import Check ==="
