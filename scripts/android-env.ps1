param(
  [switch]$PrintSummary
)

$ErrorActionPreference = 'Stop'

function Add-ToPath {
  param([string]$Value)

  if (-not $Value -or -not (Test-Path $Value)) {
    return
  }

  $currentPathEntries = $env:Path -split ';' | Where-Object { $_ }
  if ($currentPathEntries -contains $Value) {
    return
  }

  $env:Path = "$Value;$env:Path"
}

$sdkCandidates = @(
  $env:ANDROID_HOME,
  $env:ANDROID_SDK_ROOT,
  (Join-Path $env:LOCALAPPDATA 'Android\Sdk')
) | Where-Object { $_ } | Select-Object -Unique

$sdkRoot = $sdkCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $sdkRoot) {
  throw 'Android SDK nao encontrado. Instale o Android Studio e confira C:\Users\gabriel.kramer\AppData\Local\Android\Sdk.'
}

$javaCandidates = @(
  $env:JAVA_HOME,
  (Join-Path ${env:ProgramFiles} 'Android\Android Studio\jbr')
) | Where-Object { $_ } | Select-Object -Unique

$javaHome = $javaCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $javaHome) {
  throw 'JAVA_HOME nao encontrado. Instale o Android Studio com o JetBrains Runtime.'
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:JAVA_HOME = $javaHome

Add-ToPath (Join-Path $sdkRoot 'platform-tools')
Add-ToPath (Join-Path $sdkRoot 'emulator')
Add-ToPath (Join-Path $javaHome 'bin')

if ($PrintSummary) {
  $adbPath = Join-Path $sdkRoot 'platform-tools\adb.exe'
  $emulatorPath = Join-Path $sdkRoot 'emulator\emulator.exe'
  $avds = & $emulatorPath -list-avds

  Write-Output "ANDROID_HOME=$env:ANDROID_HOME"
  Write-Output "ANDROID_SDK_ROOT=$env:ANDROID_SDK_ROOT"
  Write-Output "JAVA_HOME=$env:JAVA_HOME"
  Write-Output "ADB=$adbPath"
  Write-Output "EMULATOR=$emulatorPath"
  Write-Output "AVDS=$($avds -join ', ')"
}
