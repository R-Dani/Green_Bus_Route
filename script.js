const mapa = document.getElementById("mapa");

async function cargarCalles() {
    const respuesta = await fetch(
        "assets/js/calles-tecate.geojson"
    );

    const datos = await respuesta.json();

    const calles = datos.features;

    // Límites geográficos del mapa
    const limites = {
        minLat: 32.54,
        maxLat: 32.59,
        minLng: -116.68,
        maxLng: -116.59
    };

    function convertirCoordenadas(lng, lat) {
        const x =
            ((lng - limites.minLng) /
                (limites.maxLng - limites.minLng)) * 1000;

        const y =
            ((limites.maxLat - lat) /
                (limites.maxLat - limites.minLat)) * 700;

        return [x, y];
    }

    calles.forEach(calle => {
        const geometria = calle.geometry;

        if (geometria.type !== "LineString") return;

        const puntos = geometria.coordinates.map(
            ([lng, lat]) => {
                const [x, y] = convertirCoordenadas(lng, lat);
                return `${x},${y}`;
            }
        );

        const linea = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polyline"
        );

        linea.setAttribute("points", puntos.join(" "));
        linea.setAttribute("class", "calle");

        mapa.appendChild(linea);
    });
}

cargarCalles().catch(error => {
    console.error("Error cargando el mapa:", error);
});