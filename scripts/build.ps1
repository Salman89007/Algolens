# AlgoLens Engine Build Script (PowerShell)
# Compiles C++ trace engine to WebAssembly using Emscripten
#
# Usage:
#   .\build.ps1           # Build WASM for web
#   .\build.ps1 -Test     # Build WASM for node testing
#   .\build.ps1 -Native   # Build native exe for testing
#   .\build.ps1 -Clean    # Remove build artifacts

param(
    [switch]$Native,
    [switch]$Test,
    [switch]$Clean
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$EngineDir = "$ProjectRoot\engine"
$OutDir = "$ProjectRoot\algolens\public\wasm"

# Source files
$Sources = @(
    "$EngineDir\main.cpp",
    "$EngineDir\algorithms\bubble_sort.cpp",
    "$EngineDir\algorithms\insertion_sort.cpp",
    "$EngineDir\algorithms\merge_sort.cpp",
    "$EngineDir\algorithms\quick_sort.cpp"
)
$IncludeDir = "$EngineDir\include"

if ($Clean) {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
    if (Test-Path $OutDir) { Remove-Item -Recurse -Force $OutDir }
    if (Test-Path "$EngineDir\engine.exe") { Remove-Item -Force "$EngineDir\engine.exe" }
    Write-Host "Done." -ForegroundColor Green
    exit 0
}

if ($Native) {
    Write-Host "Building native executable for testing..." -ForegroundColor Cyan
    $Compiler = "g++"
    $OutFile = "$EngineDir\engine.exe"
    $Args = @("-std=c++17", "-O2", "-I", $IncludeDir) + $Sources + @("-o", $OutFile)

    Write-Host "  $Compiler $($Args -join ' ')" -ForegroundColor DarkGray
    & $Compiler @Args
    if ($LASTEXITCODE -ne 0) { throw "Native build failed" }

    Write-Host "Built: $OutFile" -ForegroundColor Green
    Write-Host "Test:  .\engine\engine.exe bubble-sort '[5,3,1,4,2]'" -ForegroundColor Yellow
}
else {
    Write-Host "Building WebAssembly..." -ForegroundColor Cyan

    # Emscripten compiler
    $EmCC = "$ProjectRoot\.toolchain\emsdk\upstream\emscripten\em++.exe"

    if (-not (Test-Path $EmCC)) {
        throw "Emscripten not found at $EmCC"
    }

    # Create output dir
    if (-not (Test-Path $OutDir)) {
        New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
    }

    $OutFile = "$OutDir\engine.js"

    # Choose environment based on mode
    if ($Test) {
        $EnvVal = "node"
    } else {
        $EnvVal = "web,node"
    }

    $EmArgs = @(
        "-std=c++17",
        "-O2",
        "-I", $IncludeDir,
        "-s", "EXPORTED_FUNCTIONS=['_run_algorithm','_list_algorithms','_malloc','_free']",
        "-s", "EXPORTED_RUNTIME_METHODS=['ccall','cwrap','UTF8ToString','stringToUTF8','lengthBytesUTF8']",
        "-s", "MODULARIZE=1",
        "-s", "EXPORT_NAME='createAlgoEngine'",
        "-s", "ALLOW_MEMORY_GROWTH=1",
        "-s", "ENVIRONMENT=$EnvVal",
        "-s", "FILESYSTEM=0",
        "--no-entry"
    ) + $Sources + @("-o", $OutFile)

    Write-Host "  $EmCC $($EmArgs -join ' ')" -ForegroundColor DarkGray
    & $EmCC @EmArgs
    if ($LASTEXITCODE -ne 0) { throw "WASM build failed" }

    Write-Host "" -ForegroundColor Green
    Write-Host "WASM build complete!" -ForegroundColor Green
    Write-Host "  Output: $OutDir\engine.js" -ForegroundColor White
    Write-Host "  Output: $OutDir\engine.wasm" -ForegroundColor White
}
