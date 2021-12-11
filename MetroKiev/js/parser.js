var linea1 = "Akademmistechko 50.464704 30.355083\n" +
            "Zhytomyrska 50.456172 30.365873\n" +
            "Sviatoshyn 50.457687 30.388395\n" +
            "Kyvky 50.458596 30.404205\n" +
            "Beresteiska 50.459093 30.419688\n" +
            "Shuliavska 50.455075 30.44537\n" +
            "Polytechnyc/Instytut 50.451232 30.464345\n" +
            "Vokzalna 50.44164 30.488251\n" +
            "Universytet 50.444247 30.505893\n" +
            "Tetralna 50.445547 30.51893\n" + //cabrones
            "Khreshchatyk 50.44734640334848 30.522749375335515\n" +
            "Arsenaina 50.44306341371777 30.547154019207436\n" +
            "Dnipro 50.44194 30.559356\n" +
            "Hidropark 50.4475940 30.576902\n" +
            "Livoberezhna 50.451845 30.598171\n" +
            "Darnytsia 50.455865 30.613027\n" +
            "Chernihivska 50.460022 30.630173\n" +
            "Lisova 50.464905 30.645218";

var linea2 = "Heroiv/Dnipra 50.522488 30.498412\n" +
            "Minska 50.512098 30.498155\n" +
            "Obolon 50.501488 30.497769\n" +
            "Petrivka 50.485947 30.497662\n" +
            "Tarasa/Shevchenka 50.474148 30.503712\n" +
            "Kontraktova/Ploshcha 50.466072 30.515158\n" +
            "Poshtova/Ploshcha 50.459392 30.524535\n" +
            "Maidan/Nezalezhnosti 50.448191 30.525695\n" +
            "Ploshcha/Lva/Tolstoho 50.438482998237426 30.515851582549676\n" +
            "Olimpiiska 50.432511628184564 30.517650546973798\n" +
            "Palats/Ukraina 50.42162027919816 30.52114290959319\n" +
            "Lybidska 50.41384978399847 30.528648548986773\n" +
            "Demiivska 50.40492264439368 30.517061292685778\n" +
            "Holosiivska 50.3974860879049 30.508315073153465\n" +
            "Vasylkivska 50.39692233718269 30.495524153373452\n" +
            "Vystavkovyi/Tsentr 50.38273592883535 30.478451877924\n" +
            "Ipodrom 50.38082067302092 30.47400216083667\n" +
            "Teremky 50.36627085790317 30.453329685578797";

var linea3 = "Syrets 50.47593891744615 30.429317100822832\n" +
            "Dorohozhychi 50.47626665333966 30.448543174808236\n" +
            "Lukianivska 50.46126775818921 30.483392213628107\n" +
            "Zoloti/vorota 50.44580216999208 30.515149568134667\n" +
            "Palats/sportu 50.440500080315076 30.519612764000662\n" +
            "Klovska 50.43694680138121 30.531457398924726\n" +
            "Pecherska 50.42770702764381 30.539611314372852\n" +
            "Druzhby/narodiv 50.417098200099964 30.546992753651384\n" +
            "Vydubychi 50.401782300426945 30.5603823410351\n" +
            "Slavutych 50.3944436665084 30.60458514553222\n" +
            "Osokorky 50.3952644136622 30.615914796447765\n" +
            "Pozniaky 50.398054847728716 30.634797547893978\n" +
            "Kharkivska 50.40073569839541 30.651877854891502\n" +
            "Vyrlytsia 50.40308815669223 30.666984056076412\n" +
            "Boryspilska 50.40341639737666 30.684751008573674\n" +
            "Chervonyo/khutir 50.40976193772909 30.69616649022862";

let estaciones = [];

var origenDropdown = document.getElementById("origenDropdown");
var destinoDropdown = document.getElementById("destinoDropdown");

var optionsHtml = []

optionsHtml.push("<optgroup label=\"Línea 1\">");

for (const line of linea1.split("\n")) {
    let parts = line.split(" ");
    let nombreEst = parts[0].replace(new RegExp('/','g'), " ");
    var estacion = {
        linea:1,
        nombre: nombreEst,
        latitud: parseFloat(parts[1]),
        longitud: parseFloat(parts[2]),
        transbordos: [false, []]
    };
    estaciones.push(estacion);
    optionsHtml.push("<option value=\"" + nombreEst + "\">" + nombreEst + "</option>");
}

optionsHtml.push("</optgroup>")

optionsHtml.push("<optgroup label=\"Línea 2\">");

for (const line of linea2.split("\n")) {
    let parts = line.split(" ");
    let nombreEst = parts[0].replace(new RegExp('/','g'), " ");
    var estacion = {
        linea:2,
        nombre: nombreEst,
        latitud: parseFloat(parts[1]),
        longitud: parseFloat(parts[2]),
        transbordos: [false, []]
    };
    estaciones.push(estacion);
    optionsHtml.push("<option value=\"" + nombreEst + "\">" + nombreEst + "</option>");
}

optionsHtml.push("</optgroup>")

optionsHtml.push("<optgroup label=\"Línea 3\">");

for (const line of linea3.split("\n")) {
    let parts = line.split(" ");
    let nombreEst = parts[0].replace(new RegExp('/','g'), " ");
    var estacion = {
        linea:3,
        nombre: nombreEst,
        latitud: parseFloat(parts[1]),
        longitud: parseFloat(parts[2]),
        transbordos: [false, []]
    };
    estaciones.push(estacion);
    optionsHtml.push("<option value=\"" + nombreEst + "\">" + nombreEst + "</option>");
}

optionsHtml.push("</optgroup>")

origenDropdown.insertAdjacentHTML("beforeend", optionsHtml.join(""));
destinoDropdown.insertAdjacentHTML("beforeend", optionsHtml.join(""));

estaciones.find(e => e.nombre == "Zoloti vorota").transbordos = [true, [estaciones.find(e => e.nombre == "Tetralna"), 3]];
estaciones.find(e => e.nombre == "Tetralna").transbordos = [true, [estaciones.find(e => e.nombre == "Zoloti vorota"), 3]];

estaciones.find(e => e.nombre == "Maidan Nezalezhnosti").transbordos = [true, [estaciones.find(e => e.nombre == "Khreshchatyk"), 5]];
estaciones.find(e => e.nombre == "Khreshchatyk").transbordos = [true, [estaciones.find(e => e.nombre == "Maidan Nezalezhnosti"), 5]];

estaciones.find(e => e.nombre == "Palats sportu").transbordos = [true, [estaciones.find(e => e.nombre == "Ploshcha Lva Tolstoho"), 4]];
estaciones.find(e => e.nombre == "Ploshcha Lva Tolstoho").transbordos = [true, [estaciones.find(e => e.nombre == "Palats sportu"), 4]];
