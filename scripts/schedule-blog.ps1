param([switch]$Install, [switch]$Uninstall, [switch]$Test, [switch]$Status)

$TaskName = "ModernLedger-DailyBlog"
$ScriptPath = "$PSScriptRoot\generate-daily-blog.mjs"
$WorkingDirectory = Split-Path $PSScriptRoot -Parent

function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$Timestamp] $Message"
}

if ($Install) {
    Write-Log "Installing daily blog generation task..."
    
    # Remove existing task if it exists
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    
    # Create the scheduled task
    $action = New-ScheduledTaskAction -Execute "node.exe" -Argument "`"$ScriptPath`" generate" -WorkingDirectory $WorkingDirectory
    $trigger = New-ScheduledTaskTrigger -Daily -At "08:00"
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive
    
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Generates daily AI-powered blog posts for Modern Ledger website"
    
    Write-Log "Task installed successfully "
    Write-Log "Blog posts will be generated daily at 8:00 AM"
    exit 0
}

if ($Uninstall) {
    Write-Log "Uninstalling daily blog generation task..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Log "Task uninstalled successfully"
    exit 0
}

if ($Test) {
    Write-Log "Testing blog generation..."
    Push-Location $WorkingDirectory
    & node $ScriptPath generate
    Pop-Location
    Write-Log "Test completed"
    exit 0
}

if ($Status) {
    Write-Log "Checking task status..."
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($task) {
        Write-Log "Task Status: $($task.State)"
        Write-Log "Next Run Time: $($task.NextRunTime)"
    } else {
        Write-Log "Task is not installed"
    }
    exit 0
}

Write-Host "Modern Ledger AI Blog Scheduler"
Write-Host ""
Write-Host "Usage:"
Write-Host "  .\schedule-blog.ps1 -Install     # Install daily task"
Write-Host "  .\schedule-blog.ps1 -Uninstall   # Remove daily task"
Write-Host "  .\schedule-blog.ps1 -Test        # Test blog generation"
Write-Host "  .\schedule-blog.ps1 -Status      # Check task status"
