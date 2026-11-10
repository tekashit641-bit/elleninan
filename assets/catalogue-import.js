/* Catalogue importé (source : catalogue AmperKamin, avec l'accord de son concepteur).
   - Prix = prix de vente réel de la source, SANS prix barré (les « −19 % » de la source ne reposent sur aucun ancien prix réel).
   - Photos : visuels créés par le concepteur (amper-*.jpg) ou photos génériques du site ; aucune photo reprise d'un site tiers.
   - Noms et descriptions générés dans les 5 langues (fr, de, en, es, nl) à partir des caractéristiques.
   IMPORTANT : chaque id ci-dessous doit exister avec le MÊME prix dans api/create-checkout-session.js. */
(function () {
  "use strict";
  var LG = ["fr", "de", "en", "es", "nl"];
  function fill(tpl, v) { var r = {}; LG.forEach(function (l) { r[l] = String(tpl[l]).replace(/\{(\w+)\}/g, function (_, k) { var x = v[k]; return x == null ? "" : (typeof x === "object" ? x[l] : x); }); }); return r; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function join(parts) { var r = {}; LG.forEach(function (l) { r[l] = cap(parts.filter(Boolean).map(function (p) { return typeof p === "object" ? p[l] : p; }).join(" · ")) + "."; }); return r; }
  function same(s) { var r = {}; LG.forEach(function (l) { r[l] = s; }); return r; }

  /* ---------- Libellés ---------- */
  var F = {
    fsc: { fr: "bois certifié FSC", de: "FSC-zertifiziertes Holz", en: "FSC-certified wood", es: "madera certificada FSC", nl: "FSC-gecertificeerd hout" },
    co2: { fr: "neutre en CO₂", de: "CO₂-neutral", en: "carbon neutral", es: "neutro en CO₂", nl: "CO₂-neutraal" },
    long: { fr: "longue durée de combustion", de: "lange Brenndauer", en: "long burn time", es: "combustión prolongada", nl: "lange brandduur" },
    quick: { fr: "s'allume rapidement", de: "schnell anzündbar", en: "lights quickly", es: "se enciende rápidamente", nl: "snel aan te steken" },
    hot: { fr: "pouvoir calorifique élevé", de: "hoher Heizwert", en: "high calorific value", es: "alto poder calorífico", nl: "hoge verbrandingswaarde" },
    lowash: { fr: "peu de cendres", de: "geringer Ascheanteil", en: "low ash", es: "pocas cenizas", nl: "weinig as" },
    soft: { fr: "résineux", de: "Nadelholz", en: "softwood", es: "madera de conífera", nl: "naaldhout" },
    debark: { fr: "résineux écorcés", de: "entrindetes Nadelholz", en: "debarked softwood", es: "conífera descortezada", nl: "ontschorst naaldhout" },
    paper: { fr: "sac 100 % papier recyclable, sans plastique", de: "Sack zu 100 % aus recycelbarem Papier, ohne Plastik", en: "100% recyclable paper bag, no plastic", es: "saco 100 % de papel reciclable, sin plástico", nl: "zak van 100% recyclebaar papier, zonder plastic" },
    dried: { fr: "séché techniquement, prêt à l'emploi", de: "technisch getrocknet, sofort gebrauchsfertig", en: "technically dried, ready to use", es: "secado técnicamente, listo para usar", nl: "technisch gedroogd, direct klaar voor gebruik" },
    fork: { fr: "déchargement par chariot élévateur à la charge du client", de: "Entladen per Gabelstapler durch den Kunden", en: "unloading by forklift is the customer's responsibility", es: "descarga con carretilla elevadora a cargo del cliente", nl: "lossen met heftruck door de klant" },
    fines: { fr: "très peu de fines", de: "sehr geringer Feinanteil", en: "very low fines", es: "muy pocos finos", nl: "zeer weinig fijne deeltjes" },
    hard: { fr: "hêtre ou chêne pur (bois dur)", de: "reines Buchen- oder Eichenholz", en: "pure beech or oak (hardwood)", es: "haya o roble puro (frondosa)", nl: "zuiver beuken- of eikenhout" },
    glow: { fr: "braise plus longue", de: "längere Glutdauer", en: "longer-lasting embers", es: "brasa más duradera", nl: "langer gloeiende sintels" },
    abr: { fr: "très faible abrasion", de: "minimaler Abrieb", en: "minimal abrasion", es: "abrasión mínima", nl: "minimale slijtage" },
    d6: same("Ø 6 mm"),
    kiln: { fr: "séché au four", de: "kammergetrocknet", en: "kiln-dried", es: "secado en horno", nl: "kamergedroogd" },
    split: { fr: "fendu", de: "gespalten", en: "split", es: "partido", nl: "gekloven" },
    ready: { fr: "prêt à brûler", de: "brennfertig", en: "ready to burn", es: "listo para quemar", nl: "klaar om te stoken" },
    round: { fr: "rondins non fendus", de: "ungespaltenes Rundholz", en: "unsplit round logs", es: "troncos redondos sin partir", nl: "ongekloofde ronde blokken" },
    compact: { fr: "stockage compact", de: "platzsparend zu lagern", en: "compact storage", es: "almacenamiento compacto", nl: "compacte opslag" }
  };
  var H = { fr: "humidité {v} %", de: "Feuchte {v} %", en: "moisture {v}%", es: "humedad {v} %", nl: "vochtgehalte {v}%" };
  var PCI = { fr: "PCI {v} kWh/kg", de: "Heizwert {v} kWh/kg", en: "calorific value {v} kWh/kg", es: "poder calorífico {v} kWh/kg", nl: "verbrandingswaarde {v} kWh/kg" };
  var ASH = { fr: "cendres {v} %", de: "Asche {v} %", en: "ash {v}%", es: "cenizas {v} %", nl: "as {v}%" };
  var CERT = { fr: "certifié {v}", de: "{v}-zertifiziert", en: "{v} certified", es: "certificado {v}", nl: "{v}-gecertificeerd" };
  var SK = { fr: "{s} sacs de 15 kg ({kg} kg)", de: "{s} Säcke à 15 kg ({kg} kg)", en: "{s} × 15 kg bags ({kg} kg)", es: "{s} sacos de 15 kg ({kg} kg)", nl: "{s} zakken van 15 kg ({kg} kg)" };
  var SK3 = { fr: "3 palettes de {s} sacs de 15 kg ({kg} kg au total)", de: "3 Paletten à {s} Säcke à 15 kg (insgesamt {kg} kg)", en: "3 pallets of {s} × 15 kg bags ({kg} kg in total)", es: "3 palés de {s} sacos de 15 kg ({kg} kg en total)", nl: "3 pallets van {s} zakken van 15 kg ({kg} kg in totaal)" };

  /* ---------- Granulés ---------- */
  var T_PAL = { fr: "Palette de granulés {b}", de: "Palette Holzpellets {b}", en: "Pallet of {b} wood pellets", es: "Palé de pellets {b}", nl: "Pallet {b} houtpellets" };
  var T_PAL3 = { fr: "3 palettes de granulés {b}", de: "3 Paletten Holzpellets {b}", en: "3 pallets of {b} wood pellets", es: "3 palés de pellets {b}", nl: "3 pallets {b} houtpellets" };
  var T_SAC = { fr: "Sac de granulés {b} 15 kg", de: "{b} Holzpellets, 15-kg-Sack", en: "{b} wood pellets, 15 kg bag", es: "Saco de pellets {b} 15 kg", nl: "{b} houtpellets, zak van 15 kg" };
  var T_SAC2 = { fr: "Lot de 2 sacs de granulés {b} (2 × 15 kg)", de: "{b} Holzpellets, 2 Säcke à 15 kg", en: "{b} wood pellets, 2 × 15 kg bags", es: "Lote de 2 sacos de pellets {b} (2 × 15 kg)", nl: "{b} houtpellets, 2 zakken van 15 kg" };
  var OAK = { fr: "bois dur (chêne/hêtre)", de: "Hartholz (Eiche/Buche)", en: "hardwood (oak/beech)", es: "frondosa (roble/haya)", nl: "hardhout (eik/beuk)" };
  // [n°, titre, marque, sacs, kg, prix, unité, image, [caractéristiques]]
  var PEL = [
    [1, T_PAL, "Crépito", 72, 1080, 290, "palette", "amper-crepito-palette", [[H, "8"], [PCI, "≥ 4,7"], [CERT, "DIN Plus / NF"]]],
    [2, T_PAL, "Holz Harry", 65, 975, 330, "palette", "amper-holz-harry-palette", [[H, "6,7"], [PCI, "≥ 4,94"], [CERT, "ENplus A1"]]],
    [3, T_PAL, "Piveteau HP+", 72, 1080, 370, "palette", "amper-piveteau-hp-palette", [[H, "8"], [PCI, "≥ 5,0"], [CERT, "DIN Plus / PEFC / NF"]]],
    [4, T_PAL, "TotalEnergies", 66, 990, 395, "palette", "amper-totalenergies-palette", [[H, "≤ 8"], [PCI, "≥ 4,8"], [CERT, "ENplus A1 / DIN Plus"]]],
    [5, T_PAL, "VERBA", 70, 1050, 280, "palette", "amper-verba-palette", [[H, "10"], [PCI, "≥ 4,6"], [CERT, "ENplus A1"]]],
    [6, T_PAL3, "Holz Harry", 65, 2925, 1225, "lot", "amper-holz-harry-palette", [[H, "6,7"], [PCI, "≥ 4,94"], [CERT, "ENplus A1"]]],
    [7, T_PAL3, "Piveteau HP+", 72, 3240, 990, "lot", "amper-piveteau-hp-palette", [[H, "8"], [PCI, "≥ 5,0"], [CERT, "DIN Plus / PEFC / NF"]]],
    [8, T_PAL3, "TotalEnergies", 66, 2970, 1275, "lot", "amper-totalenergies-3-palettes", [[H, "≤ 8"], [PCI, "≥ 4,8"], [CERT, "ENplus A1 / DIN Plus"]]],
    [9, T_PAL3, "VERBA", 70, 3150, 890, "lot", "amper-verba-palette", [[H, "10"], [PCI, "≥ 4,6"], [CERT, "ENplus A1"]]],
    [10, T_PAL3, "Woodstock", 70, 3150, 1005, "lot", "amper-woodstock-3-palettes", [[CERT, "ENplus A1"], F.d6, F.fork]],
    [11, T_PAL, "DRAGON", 65, 975, 299, "palette", "p_gv", [[CERT, "ENplus A1"], F.d6, F.fsc, F.fines]],
    [12, T_PAL, "EPH", 65, 975, 229, "palette", "amper-eph-papiersack", [[CERT, "ENplus A1"], F.paper]],
    [13, T_PAL, "FIREFLIES", 65, 975, 189, "palette", "amper-fireflies", [[CERT, "ENplus A1"], [PCI, "≈ 5,3"], [ASH, "< 0,6"], [H, "< 10"]]],
    [14, T_PAL, "GERMAN FLAMES", 66, 990, 499, "palette", "p_gv", [[CERT, "ENplus A1"], [PCI, "> 5"], [ASH, "< 0,5"], [H, "7–9"]]],
    [15, T_PAL, "Giant Flames", 65, 975, 424.31, "palette", "p_gv", [F.soft, F.d6]],
    [16, T_PAL, "HEIZFUXX Blue", 65, 975, 259, "palette", "p_gv", [[CERT, "ENplus A1"], F.fsc, F.co2, F.hot, F.long]],
    [17, T_PAL, "HEIZFUXX Grey", 65, 975, 199, "palette", "p_gv", [[CERT, "ENplus"], F.co2, F.long]],
    [18, T_PAL, "HEIZFUXX Red", 65, 975, 279, "palette", "p_gv", [[CERT, "ENplus A1"], F.fsc, F.co2, F.quick, F.lowash]],
    [19, T_PAL, "HIT", 66, 990, 285, "palette", "amper-hit", [[CERT, "ENplus A1"], F.soft, F.dried]],
    [20, T_PAL, OAK, 65, 975, 499, "palette", "p_gv", [F.hard, F.glow, [PCI, "> 5,2"]]],
    [21, T_PAL, "HOYER", 66, 990, 390, "palette", "amper-hoyer", [[CERT, "ENplus A1"], [PCI, "> 5"], [ASH, "0,3–0,45"], [H, "6–8"]]],
    [23, T_PAL, "PELLINI", 66, 990, 285, "palette", "amper-pellini", [[CERT, "ENplus A1"], [PCI, "> 4,9"], [H, "6–8"], F.debark]],
    [24, T_PAL, "REKORD Premium A1", 66, 990, 365, "palette", "rk-granules-palette-a1", [[CERT, "ENplus A1"], F.soft]],
    [27, T_PAL, "REKORD Premium 6 mm", 66, 990, 239, "palette", "rk-granules-palette-6mm", [[CERT, "ENplus A1"], F.soft, [H, "< 10"]]],
    [28, T_PAL, "REZULT Premium", 70, 1050, 499, "palette", "p_gv", [[CERT, "ENplus A1"], F.abr, F.lowash, F.hot]],
    [29, T_PAL, "Saxonia", 66, 990, 349, "palette", "amper-saxonia", [[CERT, "ENplus A1"], F.soft, F.dried]],
    [30, T_PAL, "THÜRINGER HD", 65, 975, 299, "palette", "p_gv", [[CERT, "ENplus A1"], [PCI, "≈ 5,3"], [H, "< 7"]]]
  ];
  var OUT = [], I18 = { de: {}, en: {}, es: {}, nl: {} }, IMG = {};
  function img(k) { if (/^amper-|^rk-|^buches-vrac$|^allumage-filet-orange$/.test(k)) { IMG["x_" + k] = "assets/produits/" + k + ".jpg"; return "x_" + k; } return k; }
  function add(n, cat, name, desc, p, u, im, e) {
    function esc(s) { return s.replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    LG.slice(1).forEach(function (l) { [name, desc].forEach(function (t) { I18[l][t.fr] = t[l]; I18[l][esc(t.fr)] = esc(t[l]); }); });
    OUT.push({ id: "x" + (n < 10 ? "0" : "") + n, c: cat, n: name.fr, d: desc.fr, p: p, u: u, i: im ? img(im) : "", e: e || "🪵" });
  }
  function spec(s) { return Array.isArray(s) ? fill(s[0], { v: s[1] }) : s; }
  PEL.forEach(function (r) {
    var name = fill(r[1], { b: r[2] });
    var pack = fill(r[1] === T_PAL3 ? SK3 : SK, { s: r[3], kg: r[4] });
    add(r[0], "Granulés", name, join([pack].concat(r[8].map(spec))), r[5], r[6], r[7]);
  });
  add(25, "Granulés", fill(T_SAC, { b: "REKORD A1" }), join([[CERT, "ENplus A1"], F.soft, F.d6].map(spec)), 12.36, "sac", "rk-granules-sac-15kg");
  add(26, "Granulés", fill(T_SAC2, { b: "REKORD A1" }), join([[CERT, "ENplus A1"], F.soft, F.d6].map(spec)), 18.19, "lot", "rk-granules-2-sacs");

  /* ---------- Bois de chauffage ---------- */
  var SP = {
    birke: { fr: "bouleau", de: "Birken", en: "Birch", es: "abedul", nl: "Berken" },
    buche: { fr: "hêtre", de: "Buchen", en: "Beech", es: "haya", nl: "Beuken" },
    eiche: { fr: "chêne", de: "Eichen", en: "Oak", es: "roble", nl: "Eiken" },
    esche: { fr: "frêne", de: "Eschen", en: "Ash", es: "fresno", nl: "Essen" },
    hain: { fr: "charme", de: "Hainbuchen", en: "Hornbeam", es: "carpe", nl: "Haagbeuken" },
    erle: { fr: "aulne", de: "Erlen", en: "Alder", es: "aliso", nl: "Elzen" },
    mix: { fr: "feuillus durs en mélange", de: "Hartholz-Mix", en: "Mixed hardwood", es: "frondosas mixtas", nl: "Gemengd hardhout" },
    be: { fr: "bouleau et frêne en mélange", de: "Birke-Esche-Mix", en: "Birch and ash mix", es: "abedul y fresno mixtos", nl: "Berken-essen mix" }
  };
  var PK = {
    pal: { fr: "palette", de: "Palette", en: "pallet", es: "palé", nl: "pallet" },
    halb: { fr: "demi-palette", de: "halbe Palette", en: "half pallet", es: "medio palé", nl: "halve pallet" },
    pal2: { fr: "2 palettes", de: "2 Paletten", en: "2 pallets", es: "2 palés", nl: "2 pallets" },
    sacks: { fr: "{k} sacs", de: "{k} Säcke", en: "{k} bags", es: "{k} sacos", nl: "{k} zakken" },
    nets: { fr: "{k} filets", de: "{k} Netze", en: "{k} nets", es: "{k} mallas", nl: "{k} netten" }
  };
  function ST(n) { return { fr: n + " stère" + (n > 1 ? "s" : ""), de: n + " Raummeter", en: n + " stère" + (n > 1 ? "s" : ""), es: n + " estéreo" + (n > 1 ? "s" : ""), nl: n + " stère" }; }
  var T_FW = { fr: "{br}Bois de chauffage {sp} {len} cm – {pk}{x}", de: "{br}{sp} Brennholz {len} cm – {pk}{x}", en: "{br}{sp} firewood {len} cm – {pk}{x}", es: "{br}Leña de {sp} {len} cm – {pk}{x}", nl: "{br}{sp} brandhout {len} cm – {pk}{x}" };
  var D_FW = { fr: "{sp} {len} cm", de: "{sp} Brennholz {len} cm", en: "{sp} firewood {len} cm", es: "{sp} {len} cm", nl: "{sp} brandhout {len} cm" };
  // [n°, essence, longueur, conditionnement, k, précision, marque, prix, options]
  var FW = [
    [32, "birke", 25, "pal", 0, ST(1), "", 202.46], [34, "birke", 25, "pal", 0, ST(2), "", 287.79],
    [44, "birke", 25, "pal", 0, "800 kg", "", 432.84], [40, "birke", 25, "halb", 0, "", "", 279.25],
    [33, "birke", 28, "sacks", 36, "500 kg", "", 287.79], [35, "birke", 28, "sacks", 36, { fr: "de 40 L", de: "à 40 L", en: "of 40 L", es: "de 40 L", nl: "van 40 L" }, "", 202.46, { round: 1 }],
    [62, "birke", 25, "nets", 88, "", "Giant Flames", 432.84],
    [36, "buche", 25, "pal", 0, "2 m³", "", 407.99], [41, "buche", 25, "pal", 0, "", "", 441.38],
    [37, "buche", 33, "pal", 0, "900 kg", "", 363.27], [39, "buche", 25, "pal2", 0, "", "", 739.17],
    [66, "buche", 25, "pal2", 0, "", "Holzat", 650.85], [56, "buche", 25, "halb", 0, "", "", 313.38],
    [53, "buche", 28, "sacks", 36, "540 kg", "", 202.46],
    [42, "eiche", 33, "pal", 0, "850 kg", "", 437.11], [43, "eiche", 25, "pal", 0, "850 kg", "", 449.90],
    [45, "eiche", 25, "halb", 0, "", "", 287.79], [54, "eiche", 25, "pal", 0, "2 m³", "", 385.91],
    [65, "eiche", 25, "pal", 0, ST(2), "", 330.45], [59, "eiche", 25, "nets", 88, "", "Giant Flames", 475.51],
    [46, "esche", 25, "halb", 0, "", "", 279.25], [47, "esche", "30–33", "nets", 88, "", "", 415.77],
    [48, "esche", 25, "pal", 0, "800 kg", "", 373.11], [61, "esche", 25, "nets", 88, "", "Giant Flames", 484.04],
    [49, "hain", 25, "halb", 0, "", "", 287.79], [63, "hain", 33, "pal", 0, "900 kg", "", 449.90, { pci: "4,1" }],
    [64, "hain", 25, "pal", 0, "900 kg", "", 449.90],
    [57, "erle", 25, "pal", 0, "800 kg", "", 407.23], [58, "erle", 25, "halb", 0, "350 kg", "", 262.20],
    [60, "erle", 25, "nets", 88, "", "Giant Flames", 398.72],
    [50, "mix", 25, "pal", 0, "2 m³", "", 341.74], [51, "mix", 25, "pal2", 0, "", "", 736.76],
    [55, "be", 25, "pal", 0, "", "", 296.32]
  ];
  FW.forEach(function (r) {
    var o = r[8] || {}, pk = fill(PK[r[3]], { k: r[4] }), x = r[5], br = r[6] ? r[6] + " – " : "";
    var xs = {}; LG.forEach(function (l) { xs[l] = x ? " " + (typeof x === "object" ? x[l] : x) : ""; });
    var name = fill(T_FW, { br: br, sp: SP[r[1]], len: r[2], pk: pk, x: xs });
    var head = fill(D_FW, { sp: SP[r[1]], len: r[2] });
    var parts = [head, F.kiln, o.round ? F.round : F.split, F.ready];
    if (o.pci) parts.push(spec([PCI, o.pci]));
    var unit = r[3] === "halb" ? "demi-palette" : r[3] === "pal2" ? "lot" : "palette";
    var im = (r[3] === "sacks" || r[3] === "nets") ? "buches-vrac" : "p_b33";
    add(r[0], "Bûches", name, join(parts), r[7], unit, im);
  });
  add(38, "Bûches",
    { fr: "Chutes de hêtre – 1 m³ plein (750 kg)", de: "Buchen-Abschnitte – 1 Festmeter (750 kg)", en: "Beech offcuts – 1 solid m³ (750 kg)", es: "Recortes de haya – 1 m³ sólido (750 kg)", nl: "Beukenresthout – 1 vaste m³ (750 kg)" },
    join([F.kiln, F.ready]), 349.94, "lot", "buches-vrac");
  add(52, "Bûches",
    { fr: "Pack bois de chauffage (3 × 12,5 dm³)", de: "Brennholz-Paket (3 × 12,5 dm³)", en: "Firewood pack (3 × 12.5 dm³)", es: "Pack de leña (3 × 12,5 dm³)", nl: "Brandhoutpakket (3 × 12,5 dm³)" },
    join([F.kiln, F.ready]), 20.37, "pack", "buches-vrac");

  /* ---------- Allumage ---------- */
  add(31, "Allumage",
    { fr: "Petit bois d'allumage résineux – palette (env. 450 dm³)", de: "Anzündholz Weichholz – Palette (ca. 450 dm³)", en: "Softwood kindling – pallet (approx. 450 dm³)", es: "Astillas de encendido de conífera – palé (aprox. 450 dm³)", nl: "Aanmaakhout naaldhout – pallet (ca. 450 dm³)" },
    join([{ fr: "bois sec", de: "trocken", en: "dry wood", es: "madera seca", nl: "droog hout" }, { fr: "450 litres", de: "450 Liter", en: "450 litres", es: "450 litros", nl: "450 liter" }]), 567.98, "palette", "allumage-filet-orange");
  add(67, "Allumage",
    { fr: "Petit bois d'allumage REKORD – lot de 4 sacs de 20 L", de: "REKORD Anzündholz – 4er-Set à 20 Liter", en: "REKORD kindling – set of 4 × 20 L bags", es: "Astillas de encendido REKORD – lote de 4 sacos de 20 L", nl: "REKORD aanmaakhout – set van 4 zakken van 20 L" },
    join([F.soft, { fr: "sec", de: "trocken", en: "dry", es: "seco", nl: "droog" }]), 18.19, "lot", "rk-allumage-4x20l");
  add(68, "Allumage",
    { fr: "Petit bois d'allumage REKORD – lot de 5 sacs de 5 L", de: "REKORD Anzündholz – Vorteilspack 5 Säcke à 5 Liter", en: "REKORD kindling – value pack of 5 × 5 L bags", es: "Astillas de encendido REKORD – lote de 5 sacos de 5 L", nl: "REKORD aanmaakhout – voordeelpak 5 zakken van 5 L" },
    join([F.soft, { fr: "sec", de: "trocken", en: "dry", es: "seco", nl: "droog" }]), 21.83, "lot", "rk-allumage-5x5l");

  /* ---------- Briquettes ---------- */
  var LIG = { fr: "briquettes de lignite REKORD", de: "REKORD Braunkohlebriketts", en: "REKORD lignite briquettes", es: "briquetas de lignito REKORD", nl: "REKORD bruinkoolbriketten" };
  var T_LIGN = { fr: "{k} palettes de {lig} (40 × 25 kg)", de: "{k} Paletten {lig} (40 × 25 kg)", en: "{k} pallets of {lig} (40 × 25 kg)", es: "{k} palés de {lig} (40 × 25 kg)", nl: "{k} pallets {lig} (40 × 25 kg)" };
  var D_LIGN = { fr: "{t} t au total ({b} bottes de 25 kg)", de: "Insgesamt {t} t ({b} Bündel à 25 kg)", en: "{t} t in total ({b} bundles of 25 kg)", es: "{t} t en total ({b} haces de 25 kg)", nl: "In totaal {t} t ({b} bundels van 25 kg)" };
  [[82, 5, 1091.27], [77, 10, 2548], [78, 15, 4357.08], [79, 20, 5813.08], [80, 25, 7261.80], [81, 30, 8714.16]].forEach(function (r) {
    add(r[0], "Briquettes", fill(T_LIGN, { k: r[1], lig: LIG }), join([fill(D_LIGN, { t: r[1], b: r[1] * 40 }), F.hot, F.glow, F.compact]), r[2], "lot", "rk-lignite-palette");
  });
  add(85, "Briquettes",
    { fr: "Palette de briquettes de lignite REKORD (40 × 25 kg)", de: "REKORD Braunkohlebriketts, Palette (40 × 25 kg)", en: "Pallet of REKORD lignite briquettes (40 × 25 kg)", es: "Palé de briquetas de lignito REKORD (40 × 25 kg)", nl: "Pallet REKORD bruinkoolbriketten (40 × 25 kg)" },
    join([{ fr: "1 000 kg", de: "1.000 kg", en: "1,000 kg", es: "1.000 kg", nl: "1.000 kg" }, F.hot, F.glow]), 290.94, "palette", "rk-lignite-palette");
  add(88, "Briquettes",
    { fr: "Palette de briquettes de lignite REKORD 900 kg (90 × 10 kg)", de: "REKORD Braunkohlebriketts 900 kg Palette (90 × 10 kg)", en: "REKORD lignite briquettes 900 kg pallet (90 × 10 kg)", es: "Palé de briquetas de lignito REKORD 900 kg (90 × 10 kg)", nl: "Pallet REKORD bruinkoolbriketten 900 kg (90 × 10 kg)" },
    join([F.hot, F.glow]), 412.05, "palette", "rk-lignite-palette-900kg");
  add(89, "Briquettes",
    { fr: "Briquettes de lignite REKORD 900 kg sous film, sur europalette", de: "REKORD Braunkohlebriketts 900 kg Folienpack auf Euro-Palette", en: "REKORD lignite briquettes 900 kg, film-wrapped on a Euro pallet", es: "Briquetas de lignito REKORD 900 kg en film, sobre europalé", nl: "REKORD bruinkoolbriketten 900 kg in folie op europallet" },
    join([F.hot, F.glow]), 514.80, "palette", "rk-lignite-palette-film");
  add(90, "Briquettes",
    { fr: "Demi-palette de briquettes de lignite REKORD 450 kg (45 × 10 kg)", de: "REKORD Kaminbriketts, Halbpalette 450 kg (45 × 10 kg)", en: "Half pallet of REKORD lignite briquettes 450 kg (45 × 10 kg)", es: "Medio palé de briquetas de lignito REKORD 450 kg (45 × 10 kg)", nl: "Halve pallet REKORD bruinkoolbriketten 450 kg (45 × 10 kg)" },
    join([F.hot, F.glow]), 275.91, "demi-palette", "rk-lignite-demi-palette");
  add(87, "Briquettes",
    { fr: "Briquettes de lignite REKORD – botte de 25 kg (44 briquettes) avec allume-feu", de: "REKORD Braunkohlebriketts – 25-kg-Bündel (44 Steine) inkl. Kaminanzünder", en: "REKORD lignite briquettes – 25 kg bundle (44 pieces) with firelighters", es: "Briquetas de lignito REKORD – haz de 25 kg (44 piezas) con pastillas de encendido", nl: "REKORD bruinkoolbriketten – bundel van 25 kg (44 stuks) met aanmaakblokjes" },
    join([F.hot, F.glow]), 17.10, "pack", "rk-lignite-botte-25kg");
  add(86, "Briquettes",
    { fr: "Pack REKORD Basic XL : briquettes et petit bois (24 kg)", de: "REKORD Basic XL Kombipaket Briketts & Anzündholz (24 kg)", en: "REKORD Basic XL combo: briquettes and kindling (24 kg)", es: "Pack REKORD Basic XL: briquetas y astillas (24 kg)", nl: "REKORD Basic XL combipakket: briketten en aanmaakhout (24 kg)" },
    join([{ fr: "tout pour démarrer et entretenir le feu", de: "alles zum Anzünden und Heizen", en: "everything to light and keep the fire going", es: "todo para encender y mantener el fuego", nl: "alles om het vuur aan te steken en te onderhouden" }]), 18.48, "pack", "rk-lignite-basic-xl");
  add(83, "Briquettes",
    { fr: "Palette de briquettes Pini Kay 960 kg (96 sacs de 10 kg)", de: "Pini Kay Holzbriketts, Palette 960 kg (96 Säcke à 10 kg)", en: "Pallet of Pini Kay briquettes 960 kg (96 × 10 kg bags)", es: "Palé de briquetas Pini Kay 960 kg (96 sacos de 10 kg)", nl: "Pallet Pini Kay briketten 960 kg (96 zakken van 10 kg)" },
    join([{ fr: "forme octogonale percée au centre", de: "achteckig mit Mittelloch", en: "octagonal with a centre hole", es: "forma octogonal con agujero central", nl: "achthoekig met middengat" }, F.hot, F.long]), 458.45, "palette", "p_pk");
  add(84, "Briquettes",
    { fr: "Palette de briquettes de résineux (96 × 10 kg)", de: "Nadelholzbriketts, Palette (96 × 10 kg)", en: "Pallet of softwood briquettes (96 × 10 kg)", es: "Palé de briquetas de conífera (96 × 10 kg)", nl: "Pallet naaldhoutbriketten (96 × 10 kg)" },
    join([{ fr: "960 kg", de: "960 kg", en: "960 kg", es: "960 kg", nl: "960 kg" }, F.quick]), 296.30, "palette", "rk-briquettes-resineux");
  add(91, "Briquettes",
    { fr: "Palette de briquettes de bois RUF 960 kg (96 × 10 kg)", de: "RUF Holzbriketts, Palette 960 kg (96 × 10 kg)", en: "Pallet of RUF wood briquettes 960 kg (96 × 10 kg)", es: "Palé de briquetas de madera RUF 960 kg (96 × 10 kg)", nl: "Pallet RUF houtbriketten 960 kg (96 × 10 kg)" },
    join([F.hot, F.lowash, F.compact]), 484.04, "palette", "p_ruf");
  add(92, "Briquettes",
    { fr: "Palette de briquettes rondes de hêtre 960 kg (96 × 10 kg)", de: "Runde Buchenholzbriketts, Palette 960 kg (96 × 10 kg)", en: "Pallet of round beech briquettes 960 kg (96 × 10 kg)", es: "Palé de briquetas redondas de haya 960 kg (96 × 10 kg)", nl: "Pallet ronde beukenhoutbriketten 960 kg (96 × 10 kg)" },
    join([F.hot, F.long]), 475.51, "palette", "p_cl");

  window.EXTRA_P = OUT;
  window.EXTRA_IM = IMG;
  window.EXTRA_I18N = I18;
})();
