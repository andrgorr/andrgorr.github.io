const findPath = function() {
    var origen = estaciones.find(e => e.nombre == document.getElementById("origenDropdown").value);
    var destino = estaciones.find(e => e.nombre == document.getElementById("destinoDropdown").value);

    var results = aStar(origen, destino);


    var minutos = Math.floor(results[0]) + " minutos"
    var ruta = parsedPathOut(results[1]);

    document.getElementById("minutes").innerHTML = minutos;
    document.getElementById("path").innerHTML = ruta;
    document.getElementById("routeResultContainer").style.display = 'contents';
}

var random = function() {
    $("#origenDropdown").val(estaciones[Math.floor(Math.random() * estaciones.length)].nombre);
    $("#destinoDropdown").val(estaciones[Math.floor(Math.random() * estaciones.length)].nombre);
    $("#origenDropdown").trigger("change");
    $("#destinoDropdown").trigger("change");
    findPath();
}

var parsedPathOut = function(visited) {

    var parsedPath = [];

    var finalPath = [];

    var currentLine = estaciones.find(e => e.nombre == visited[0]).linea;
    parsedPath.push(getLineImgHTML(currentLine));

    for (var index = 0; index < visited.length; index++) {
        if (index == visited.length-1) {
            // Ultimo elemento
            finalPath.push(visited[index]);
        } else {
            if (index != 0 && timeToEstation(finalPath[finalPath.length-1], visited[index]) == 0) {
                while (timeToEstation(finalPath[finalPath.length-1], visited[index]) == 0) {
                    finalPath.pop();
                }
            }

            
            
            finalPath.push(visited[index]);
            
        }
    }

    for (var i = 0; i < finalPath.length; i++) {
        var sLine = estaciones.find(e => e.nombre == finalPath[i]).linea;
        if (sLine != currentLine) {
            parsedPath.push(getLineImgHTML(sLine));
            currentLine = sLine;
        }

        parsedPath.push((i == 0 || i == finalPath.length-1 ? "<b>"+finalPath[i]+"</b>" : finalPath[i]) + (i == finalPath.length-1 ? "" : " &raquo; "));
    }

    return parsedPath.join("");
}

const getLineImgHTML = function(line) {
    return ("<img style=\"width:15px;height:auto;margin-right:5px;display:inline-block;\" src=\"img/l"+line + ".png\"> ");
}

const timeToEstation = function(e1,e2) {
    if (e1 == e2) return 0;

    var est1 = estaciones.find(e => e.nombre == e1);
    var est2 = estaciones.find(e => e.nombre == e2);

    console.log("time btw " + e1 + " and " + e2 + " ("+Math.abs(estaciones.indexOf(est1)-estaciones.indexOf(est2))+" stations apart)");

    if (est1.linea == est2.linea && Math.abs(estaciones.indexOf(est1)-estaciones.indexOf(est2)) == 1) {
        //console.log("ok");
        return aerialDistance(est1.latitud,est1.longitud,est2.latitud,est2.longitud)/(0.6*1000); //Minutos
    } else {
        var tr1 = est1.transbordos;
        var tr2 = est2.transbordos;

        if (tr1[0] == true && tr2[0] == true && tr1[1][0].nombre == est2.nombre) {
            return tr1[1][1];
        }    
    }

    return 0;    
}

const aerialDistance = function(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radio de la tierra

    let latDistance = toRadians(lat2 - lat1);
    let lonDistance = toRadians(lon2 - lon1);
    let a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
            + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
            * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; //metros
}


const aStar = function (start, goal) {

    //Distancias de la estacion inicial al resto
    var distances = [];
    //Se empieza con distancia infinita
    for (var est of estaciones) distances[est.nombre] = Number.MAX_VALUE;
    //Salvo a si misma (cero)
    distances[start.nombre] = 0;

    //Prioridad de las estaciones calculada con la distancia aerea al destino
    var priorities = [];
    //Se empieza con prioridad infinita
    for (var est of estaciones) priorities[est.nombre] = Number.MAX_VALUE;
    //Empezamos por la estacion de inicio
    priorities[start.nombre] = aerialDistance(start.latitud,start.longitud,goal.latitud,goal.longitud);

    //console.log(priorities);

    //Visitado
    var visited = [];

    while (true) {
        var lowestPriority = Number.MAX_VALUE;
        var lowestPriorityIndex = -1;
        for (const est of estaciones) {
            let i = est.nombre;
            if (priorities[i] < lowestPriority && !visited.includes(i)) {
                lowestPriority = priorities[i];
                lowestPriorityIndex = i;
            }
        }

        if (lowestPriorityIndex === -1) {
            return [-1,null];
        } else if (lowestPriorityIndex === goal.nombre) {
            // Exito
            visited.push(lowestPriorityIndex);
            return [distances[lowestPriorityIndex], visited];
        }

        console.log("Visitando estacion " + lowestPriorityIndex + " con prioridad " + lowestPriority);

        // estaciones adyacentes
        for (var est of estaciones) {
            let i = est.nombre;
            //console.log("intentando ir a " + i)
            //console.log("timeToEstation from " + lowestPriorityIndex + " to " + i + ": " + timeToEstation(lowestPriorityIndex, i))
            if (timeToEstation(lowestPriorityIndex, i) !== 0 && !visited.includes(i)) {
                console.log("can go to " + i)
                if (distances[lowestPriorityIndex] + timeToEstation(lowestPriorityIndex, i) < distances[i]) {
                    distances[i] = distances[lowestPriorityIndex] + timeToEstation(lowestPriorityIndex, i);
                    priorities[i] = distances[i] + aerialDistance(est.latitud,est.longitud,goal.latitud,goal.longitud);
                    //console.log("Actualizando distancia desde " + i + " a " + distances[i] + " y prioridad a " + priorities[i]);
                }
            }
        }

        visited.push(lowestPriorityIndex);
        console.log("Visited nodes: " + visited);
        console.log("Currently lowest distances: " + distances);

    }
};

const toRadians = function (degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}