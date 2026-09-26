# Clean dark: refs from bracket-named files
$files = @(
    "src\app\services\[code]\page.tsx",
    "src\app\services\orders\[id]\page.tsx"
)

foreach ($f in $files) {
    $content = Get-Content -LiteralPath $f
    $cleaned = $content -replace ' dark:[a-zA-Z0-9_\-/\[\]\.]+', ''
    Set-Content -LiteralPath $f -Value $cleaned
    Write-Host "Cleaned: $f"
}
Write-Host "Done!"
