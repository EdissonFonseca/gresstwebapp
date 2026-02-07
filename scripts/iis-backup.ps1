# Backup current IIS site folder. Run on the Windows server (e.g. via SSH or locally).
# Usage: .\iis-backup.ps1 -SitePath "C:\inetpub\wwwroot\GresstWebApp"

param(
    [Parameter(Mandatory = $true)]
    [string]$SitePath
)

$SitePath = $SitePath.TrimEnd('\')
$BackupPath = "${SitePath}_previous"

if (-not (Test-Path $SitePath)) {
    Write-Host "Site path does not exist: $SitePath"
    exit 0
}

if (Test-Path $BackupPath) {
    Remove-Item -Recurse -Force $BackupPath
}
Rename-Item -Path $SitePath -NewName "${SitePath}_previous"
New-Item -ItemType Directory -Path $SitePath -Force | Out-Null
Write-Host "Backup created: $BackupPath"
