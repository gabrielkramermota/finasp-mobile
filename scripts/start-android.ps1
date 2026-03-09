param(
  [switch]$StartEmulator,
  [switch]$SkipExpo
)

$ErrorActionPreference = 'Stop'

. "$PSScriptRoot\android-env.ps1"

$adbPath = Join-Path $env:ANDROID_HOME 'platform-tools\adb.exe'
$emulatorPath = Join-Path $env:ANDROID_HOME 'emulator\emulator.exe'

function Get-AdbDeviceLines {
  $raw = & $adbPath devices

  return $raw |
    Select-String '^(emulator-\d+|[A-Za-z0-9._:-]+)\s+(device|offline|unauthorized)$'
}

function Get-ConnectedDevices {
  return Get-AdbDeviceLines |
    Select-String '\s+device$' |
    ForEach-Object {
      ($_ -split '\s+')[0]
    }
}

function Get-OfflineDevices {
  return Get-AdbDeviceLines |
    Select-String '\s+offline$' |
    ForEach-Object {
      ($_ -split '\s+')[0]
    }
}

function Get-ConnectedEmulator {
  return Get-ConnectedDevices | Where-Object { $_ -like 'emulator-*' } | Select-Object -First 1
}

function Get-RunningEmulatorProcess {
  return Get-Process emulator -ErrorAction SilentlyContinue | Select-Object -First 1
}

function Restart-AdbServer {
  & $adbPath kill-server | Out-Null
  & $adbPath start-server | Out-Null
}

function Start-PreferredEmulator {
  $avds = & $emulatorPath -list-avds

  if (-not $avds) {
    throw 'Nenhum AVD configurado. Crie um emulador no Android Studio Device Manager.'
  }

  $selectedAvd = $avds | Select-Object -First 1
  Start-Process -FilePath $emulatorPath -ArgumentList @('-avd', $selectedAvd) | Out-Null

  Write-Output "Iniciando emulador: $selectedAvd"
}

if ($StartEmulator -or -not (Get-ConnectedDevices)) {
  $runningEmulator = Get-RunningEmulatorProcess

  if (-not $runningEmulator -and -not (Get-ConnectedEmulator)) {
    Start-PreferredEmulator
  } elseif ($runningEmulator) {
    Write-Output 'Emulador ja esta em execucao. Aguardando o adb sincronizar.'
  }

  $bootReady = $false
  for ($attempt = 0; $attempt -lt 36; $attempt++) {
    Start-Sleep -Seconds 5

    if ((Get-OfflineDevices)) {
      Restart-AdbServer
      Start-Sleep -Seconds 2
    }

    $emulatorSerial = Get-ConnectedEmulator

    if (-not $emulatorSerial) {
      continue
    }

    & $adbPath -s $emulatorSerial wait-for-device | Out-Null
    $bootStatus = (& $adbPath -s $emulatorSerial shell getprop sys.boot_completed 2>$null).Trim()
    if ($bootStatus -eq '1') {
      $bootReady = $true
      break
    }
  }

  if (-not $bootReady -and -not (Get-ConnectedDevices)) {
    throw 'O emulador nao ficou pronto a tempo. Abra o Android Studio e valide o AVD manualmente.'
  }
}

if (-not $SkipExpo) {
  npx expo start --android
}
