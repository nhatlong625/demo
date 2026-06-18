$ErrorActionPreference = "Stop"

$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) {
    Copy-Item -Path (Join-Path $PSScriptRoot ".env.example") -Destination $envPath
    Write-Host "Created backend-java\.env. Please update DB_PASSWORD if needed."
}

Get-Content $envPath | ForEach-Object {
    $line = $_.Trim()
    if ($line.Length -eq 0 -or $line.StartsWith("#")) {
        return
    }

    $separatorIndex = $line.IndexOf("=")
    if ($separatorIndex -lt 1) {
        return
    }

    $name = $line.Substring(0, $separatorIndex).Trim()
    $value = $line.Substring($separatorIndex + 1).Trim().Trim('"').Trim("'")
    [Environment]::SetEnvironmentVariable($name, $value, "Process")
}

$env:DB_URL = "jdbc:sqlserver://$($env:DB_HOST):$($env:DB_PORT);databaseName=$($env:DB_NAME);encrypt=true;trustServerCertificate=true"

Write-Host "Starting Spring Boot on port $($env:SERVER_PORT) with database $($env:DB_NAME)..."
mvn spring-boot:run
