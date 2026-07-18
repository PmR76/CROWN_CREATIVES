Get-ChildItem -Recurse -Include *.jsx,*.js src\pages | 
Select-String -Pattern 'import .* from "..\/components\/|import .* from "..\/styles\/' | 
ForEach-Object { $_.Line }
