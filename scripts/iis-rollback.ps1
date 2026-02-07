# Rollback IIS site to previous deployment. Run on the Windows server.
# Usage: .\iis-rollback.ps1 -SitePath "C:\inetpub\wwwroot\GresstWebApp"

param(
    [Parameter(Mandatory = $true)]
    [string]$SitePath
)

$SitePath = $SitePath.TrimEnd('\')
$BackupPath = "${SitePath}_previous"
$FailedPath = "${SitePath}_failed"

if (-not (Test-Path $BackupPath)) {
    Write-Error "No backup found at $BackupPath. Cannot rollback."
    exit 1
}

if (Test-Path $SitePath) {
    if (Test-Path $FailedPath) {
        Remove-Item -Recurse -Force $FailedPath
    }
    Rename-Item -Path $SitePath -NewName $FailedPath
}

Rename-Item -Path $BackupPath -NewName $SitePath
Write-Host "Rollback complete. Current site restored from previous deployment."
