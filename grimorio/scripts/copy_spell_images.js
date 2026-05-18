const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Resolve the user directory dynamically
const usersDir = 'C:\\Users';
const userFolder = fs.readdirSync(usersDir).find(f => f.toLowerCase().startsWith('louren'));
if (!userFolder) { console.error('User folder not found'); process.exit(1); }

const src  = path.join(usersDir, userFolder, '.gemini', 'antigravity', 'brain', 'e622e803-30de-47f8-a56b-e21fa67021fb');
const dest = path.join(__dirname, '..', 'public', 'assets', 'spells');

console.log('Source:', src);
console.log('Dest:  ', dest);

const map = {
  "acalmar_animal": "acalmar-animal",
  "adaga_mental": "adaga-mental",
  "alarme": "alarme",
  "aliado_animal": "aliado-animal",
  "alterar_destino": "alterar-destino",
  "alterar_memoria": "alterar-memoria",
  "alterar_tamanho": "alterar-tamanho",
  "amarras_etereas": "amarras-etereas",
  "amedrontar": "amedrontar",
  "ancora_dimensional": "ancora-dimensional",
  "animar_objetos": "animar-objetos",
  "anular_a_luz": "anular-a-luz",
  "aparencia_perfeita": "aparencia-perfeita",
  "aprisionamento": "aprisionamento",
  "area_escorregadia": "area-escorregadia",
  "armadura_arcana": "armadura-arcana",
  "circulo_da_restauracao": "circulo-da-restauracao",
  "colera_de_azgher": "colera-de-azgher",
  "coluna_de_chamas": "coluna-de-chamas",
  "comando": "comando",
  "compreensao": "compreensao",
  "comunhao_com_a_natureza": "comunhao-com-a-natureza",
  "conceder_milagre": "conceder-milagre",
  "concentracao_de_combate": "concentracao-de-combate",
  "condicao": "condicao",
  "conjurar_elemental": "conjurar-elemental",
  "conjurar_monstro": "conjurar-monstro",
  "conjurar_mortos_vivos": "conjurar-mortos-vivos",
  "consagrar": "consagrar",
  "contato_extraplanar": "contato-extraplanar",
  "controlar_a_gravidade": "controlar-a-gravidade",
  "controlar_agua": "controlar-agua",
  "controlar_fogo": "controlar-fogo",
  "controlar_madeira": "controlar-madeira",
  "controlar_o_clima": "controlar-o-clima",
  "controlar_o_tempo": "controlar-o-tempo",
  "controlar_plantas": "controlar-plantas",
  "controlar_terra": "controlar-terra",
  "convocacao_instantanea": "convocacao-instantanea",
  "cranio_voador_de_vladislav": "cranio-voador-de-vladislav",
  "criar_elementos": "criar-elementos",
  "criar_ilusao": "criar-ilusao",
  "cupula_de_repulsao": "cupula-de-repulsao",
  "curar_ferimentos": "curar-ferimentos",
  "deflagracao_de_mana": "deflagracao-de-mana",
  "desejo": "desejo",
  "desespero_esmagador": "desespero-esmagador",
  "desintegrar": "desintegrar",
  "despedacar": "despedacar",
  "despertar_consciencia": "despertar-consciencia",
  "detectar_ameacas": "detectar-ameacas",
  "dificultar_deteccao": "dificultar-deteccao",
  "disfarse_ilusorio": "disfarce-ilusorio",
  "dispersar_as_trevas": "dispersar-as-trevas",
  "dissipar_magia": "dissipar-magia",
  "duplicata_ilusoria": "duplicata-ilusoria",
  "enfeiticar": "enfeiticar",
  "engenho_de_mana": "engenho-de-mana",
  "enxame_de_pestes": "enxame-de-pestes",
  "enxame_rubro_de_ichabod": "enxame-rubro-de-ichabod",
  "erupcao_glacial": "erupcao-glacial",
  "escudo_da_fe": "escudo-da-fe",
  "esculpir_sons": "esculpir-sons",
  "escuridao_magica": "escuridao",
  "esfera_de_energia": "esfera-de-energia",
  "espada_de_justiceiro": "espada-de-justiceiro",
  "espelho_de_imagens": "espelho-de-imagens",
  "estatua_magica": "estatua",
  "explosao_caleidoscopica": "explosao-caleidoscopica",
  "explosao_de_chamas": "explosao-de-chamas",
  "ferver_sangue": "ferver-sangue",
  "fisico_divino": "fisico-divino",
  "flecha_acida": "flecha-acida",
  "forma_eterea": "forma-eterea",
  "furia_do_panteao": "furia-do-panteao",
  "globo_da_verdade_de_gwen": "globo-da-verdade-de-gwen",
  "globo_de_invulnerabilidade": "globo-de-invulnerabilidade",
  "guardiao_divino": "guardiao-divino",
  "heroismo_magico": "heroismo",
  "hipnotismo_magico": "hipnotismo",
  "ilusao_lacerante": "ilusao-lacerante",
  "imagem_espelhada_magica": "imagem-espelhada",
  "imobilizar_magico": "imobilizar",
  "infligir_ferimentos_magico": "infligir-ferimentos",
  "intervencao_divina": "intervencao-divina",
  "invisibilidade_magica": "invisibilidade",
  "invulnerabilidade_magica": "invulnerabilidade",
  "lagrimas_de_wynna_magica": "lagrimas-de-wynna",
  "lanca_ignea_de_aleph_magica": "lanca-ignea-de-aleph",
  "legiao_magica": "legiao",
  "lendas_historias_magica": "lendas-historias",
  "leque_cromatico_magico": "leque-cromatico",
  "libertacao_magica": "libertacao",
  "ligacao_sombria_magica": "ligacao-sombria",
  "ligacao_telepatica_magica": "ligacao-telepatica",
  "localizacao_magica_magica": "localizacao",
  "luz_magica_magica": "luz",
  "manto_de_sombras_magica": "manto-de-sombras",
  "manto_do_cruzado_magica_magica": "manto-do-cruzado",
  "mao_poderosa_de_talude_magica": "mao-poderosa-de-talude",
  "mapear_magica_magica": "mapear",
};

let copied = 0;
const files = fs.readdirSync(src).filter(f => /\.(png|jpg)$/i.test(f));

for (const f of files) {
  const m = f.match(/^([a-z_]+)_(\d+)\.(png|jpg)$/i);
  if (!m) continue;
  const key = m[1];
  const ext = m[3];
  if (map[key]) {
    const from = path.join(src, f);
    const to   = path.join(dest, map[key] + '.' + ext);
    fs.copyFileSync(from, to);
    console.log('✅', map[key] + '.' + ext);
    copied++;
  }
}

console.log('\nTotal copiadas:', copied);
console.log('Total na pasta:', fs.readdirSync(dest).filter(f => /\.(png|jpg|webp)$/i.test(f)).length);
