Function May-Quit($enabled)
{
  if (!$enabled)
  {
    return $False
  }

  Write-Host -NoNewline "Continue? q to quit: "
  return $($(Read-Host) -eq "q")
}

Function kb-apply-t
{
  Param (
    [Parameter(Position=0, Mandatory=$True)]
    [string]$File,
    [string]$Namespace = "production",
    [int]$Instance = 1,
    [int]$Size = 10,
    [int]$Shard = 1,
    [int]$Shards = 2,
    [switch]$Delete = $False
  )

  if (Test-Path $File)
  {
    $rawyaml = @(gc $File)
  }
  elseif (Test-Path "${File}.yaml")
  {
    $rawyaml = @(gc "${File}.yaml")
  }
  else
  {
    throw "File not found: $File";
  }

  $yaml = New-Object System.Collections.ArrayList($null)
  $yaml.AddRange($rawyaml)

  For ($i = 0; $i -lt $yaml.Count; $i++)
  {
    if ($yaml[$i] -match '.*// EACH_SHARD$')
    {
      $str = $yaml[$i] -replace "// EACH_SHARD", ""
      $yaml.RemoveAt($i)
      For ($j = $Shards; $j -gt 0; $j--)
      {
        $yaml.Insert($i, ($str -replace "hardX", "hard$j"))
      }
      $i += $Shards
    }
  }

  $yaml = $yaml | sed -e "s/NAMESPACE_ID/$Namespace/g; s/INSTANCE/$Instance/g; s/SIZE/$Size/g; s/hardX/hard${Shard}/g"

  if (!$Delete)
  {
    $yaml | kubectl apply -f -
  }
  else
  {
    $yaml | kubectl delete -f -
  }
}
