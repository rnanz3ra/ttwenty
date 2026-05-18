$src  = "C:\Users\Lourenço's Home\.gemini\antigravity\brain\e622e803-30de-47f8-a56b-e21fa67021fb"
$dest = "c:\PROJETOS\tormenta20APP\grimorio\public\assets\spells"

$map = @{
  "comunhao_com_a_natureza"     = "comunhao-com-a-natureza"
  "conceder_milagre"            = "conceder-milagre"
  "concentracao_de_combate"     = "concentracao-de-combate"
  "condicao"                    = "condicao"
  "contato_extraplanar"         = "contato-extraplanar"
  "controlar_madeira"           = "controlar-madeira"
  "convocacao_instantanea"      = "convocacao-instantanea"
  "cranio_voador_de_vladislav"  = "cranio-voador-de-vladislav"
  "criar_elementos"             = "criar-elementos"
  "criar_ilusao"                = "criar-ilusao"
  "cupula_de_repulsao"          = "cupula-de-repulsao"
  "deflagracao_de_mana"         = "deflagracao-de-mana"
  "desejo"                      = "desejo"
  "desespero_esmagador"         = "desespero-esmagador"
  "desintegrar"                 = "desintegrar"
  "despedacar"                  = "despedacar"
  "despertar_consciencia"       = "despertar-consciencia"
}

$copied = 0
Get-ChildItem $src -Include "*.png","*.jpg" -File | ForEach-Object {
  $base = $_.BaseName -replace '_\d{13}$', ''
  if ($map.ContainsKey($base)) {
    $out = Join-Path $dest ($map[$base] + $_.Extension)
    Copy-Item $_.FullName $out -Force
    Write-Host "OK: $($map[$base])$($_.Extension)"
    $copied++
  }
}
Write-Host ""
Write-Host "Total copiadas: $copied"
