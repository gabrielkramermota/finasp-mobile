param(
  [string]$BrandHex = '#2DD4BF'
)

Add-Type -AssemblyName System.Drawing

function New-BrushFromHex {
  param([string]$Hex)

  $normalized = $Hex.TrimStart('#')
  if ($normalized.Length -ne 6) {
    throw "Expected a 6-digit hex color, received '$Hex'."
  }

  $r = [Convert]::ToInt32($normalized.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($normalized.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($normalized.Substring(4, 2), 16)

  return [System.Drawing.Color]::FromArgb(255, $r, $g, $b)
}

function New-Canvas {
  param(
    [int]$Width,
    [int]$Height
  )

  $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  return @{
    Bitmap = $bitmap
    Graphics = $graphics
  }
}

function Save-Png {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path
  )

  $directory = Split-Path -Parent $Path
  if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory | Out-Null
  }

  $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

function Draw-RoundedSquare {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.RectangleF]$Rect,
    [float]$Radius,
    [System.Drawing.Color]$Fill
  )

  $diameter = $Radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath

  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()

  $brush = New-Object System.Drawing.SolidBrush($Fill)
  $Graphics.FillPath($brush, $path)

  $brush.Dispose()
  $path.Dispose()
}

function Draw-BrandGlyph {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$CanvasSize,
    [float]$Scale,
    [bool]$OffsetDown = $true
  )

  $fontSize = [Math]::Round($CanvasSize * $Scale)
  $font = New-Object System.Drawing.Font('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center

  $verticalOffset = 0
  if ($OffsetDown) {
    $verticalOffset = [Math]::Round($CanvasSize * 0.04)
  }

  $rect = [System.Drawing.RectangleF]::new(
    [float]0,
    [float]$verticalOffset,
    [float]$CanvasSize,
    [float]($CanvasSize - $verticalOffset)
  )
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $Graphics.DrawString('f', $font, $brush, $rect, $format)

  $brush.Dispose()
  $format.Dispose()
  $font.Dispose()
}

$root = Split-Path -Parent $PSScriptRoot
$assetsDir = Join-Path $root 'assets'
$brandColor = New-BrushFromHex -Hex $BrandHex

# App icon.
$iconCanvas = New-Canvas -Width 1024 -Height 1024
$iconMargin = 120
$iconRect = [System.Drawing.RectangleF]::new(
  [float]$iconMargin,
  [float]$iconMargin,
  [float](1024 - ($iconMargin * 2)),
  [float](1024 - ($iconMargin * 2))
)
$iconCanvas.Graphics.Clear([System.Drawing.Color]::Transparent)
Draw-RoundedSquare -Graphics $iconCanvas.Graphics -Rect $iconRect -Radius 210 -Fill $brandColor
Draw-BrandGlyph -Graphics $iconCanvas.Graphics -CanvasSize 1024 -Scale 0.60
Save-Png -Bitmap $iconCanvas.Bitmap -Path (Join-Path $assetsDir 'icon.png')
$iconCanvas.Graphics.Dispose()
$iconCanvas.Bitmap.Dispose()

# Android adaptive icon foreground.
$adaptiveCanvas = New-Canvas -Width 1024 -Height 1024
$adaptiveCanvas.Graphics.Clear([System.Drawing.Color]::Transparent)
Draw-BrandGlyph -Graphics $adaptiveCanvas.Graphics -CanvasSize 1024 -Scale 0.54
Save-Png -Bitmap $adaptiveCanvas.Bitmap -Path (Join-Path $assetsDir 'adaptive-icon.png')
$adaptiveCanvas.Graphics.Dispose()
$adaptiveCanvas.Bitmap.Dispose()

# Browser favicon.
$faviconCanvas = New-Canvas -Width 64 -Height 64
$faviconRect = [System.Drawing.RectangleF]::new([float]6, [float]6, [float]52, [float]52)
$faviconCanvas.Graphics.Clear([System.Drawing.Color]::Transparent)
Draw-RoundedSquare -Graphics $faviconCanvas.Graphics -Rect $faviconRect -Radius 14 -Fill $brandColor
Draw-BrandGlyph -Graphics $faviconCanvas.Graphics -CanvasSize 64 -Scale 0.58 -OffsetDown:$false
Save-Png -Bitmap $faviconCanvas.Bitmap -Path (Join-Path $assetsDir 'favicon.png')
$faviconCanvas.Graphics.Dispose()
$faviconCanvas.Bitmap.Dispose()

# In-app marketing mark.
$logoCanvas = New-Canvas -Width 512 -Height 512
$logoRect = [System.Drawing.RectangleF]::new([float]32, [float]32, [float]448, [float]448)
$logoCanvas.Graphics.Clear([System.Drawing.Color]::Transparent)
Draw-RoundedSquare -Graphics $logoCanvas.Graphics -Rect $logoRect -Radius 112 -Fill $brandColor
Draw-BrandGlyph -Graphics $logoCanvas.Graphics -CanvasSize 512 -Scale 0.58
Save-Png -Bitmap $logoCanvas.Bitmap -Path (Join-Path $assetsDir 'logo-mark.png')
$logoCanvas.Graphics.Dispose()
$logoCanvas.Bitmap.Dispose()

# Splash image stays transparent; brand comes from app.json backgroundColor.
$splashCanvas = New-Canvas -Width 1242 -Height 2436
$splashCanvas.Graphics.Clear([System.Drawing.Color]::Transparent)
$glyphArea = [Math]::Round([Math]::Min(1242, 2436) * 0.72)
$fontSize = [Math]::Round($glyphArea * 0.62)
$font = New-Object System.Drawing.Font('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$rect = [System.Drawing.RectangleF]::new([float]0, [float]0, [float]1242, [float]2436)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$splashCanvas.Graphics.DrawString('f', $font, $brush, $rect, $format)
Save-Png -Bitmap $splashCanvas.Bitmap -Path (Join-Path $assetsDir 'splash.png')
$brush.Dispose()
$format.Dispose()
$font.Dispose()
$splashCanvas.Graphics.Dispose()
$splashCanvas.Bitmap.Dispose()

Write-Output "Generated brand assets in $assetsDir"
