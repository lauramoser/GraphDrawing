document.addEventListener('DOMContentLoaded', function() {
    const width = 1400, height = 1000;
    const radius = Math.min(width, height) / 6;

    const svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const ringPositions = [
        { x: -radius * 2.5, y: -radius * 1.5},    // Europa
        { x: -radius * 1.25, y: 0},  // Asien
        { x: 0, y: -radius * 1.5 },    // Afrika
        { x: radius * 1.25, y: 0 },  // Australien
        { x: radius * 2.5, y: -radius * 1.5 }     // Amerika
    ];

    const continentColors = {
        "Europe": "#0000FF",   // Blau
        "Asia": "#FFD700",     // Gelb
        "Africa": "#000000",   // Schwarz
        "Oceania": "#00FF00",  // Grün
        "America": "#FF0000"   // Rot
    };

    Promise.all([
        d3.json('olympics.json'),
        d3.json('olympics_continents.json')
    ]).then(([olympicsData, continentsData]) => {
        console.log('Daten geladen:', olympicsData, continentsData);

        let continentsMap = {};
        continentsData.nodes.forEach(node => {
            continentsMap[node.id] = node.continent;
        });

        console.log('Kontinent Zuordnung:', continentsMap);

        let countryNodes = olympicsData.nodes.filter(d => d.noc);

        let continentGroups = {};
        countryNodes.forEach(country => {
            let continent = continentsMap[country.noc];
            if (!continent) {
                console.log(`Kontinent für ${country.noc} nicht gefunden.`);
                return; // Skip if no continent found
            }
            if (!continentGroups[continent]) {
                continentGroups[continent] = [];
            }
            continentGroups[continent].push(country);
        });

        console.log('Kontinentgruppen:', continentGroups);

        const continentsOrder = ["Europe", "Asia", "Africa", "Oceania", "America"];
        continentsOrder.forEach((continent, index) => {
            let countries = continentGroups[continent];
            if (!countries) {
                console.log(`Keine Länder gefunden für Kontinent: ${continent}`);
                return;
            }
            let pos = ringPositions[index];
            let angleStep = 2 * Math.PI / countries.length;

            let g = svg.append('g');

            g.selectAll('circle')
                .data(countries)
                .enter().append('circle')
                .attr('cx', (d, i) => pos.x + radius * Math.cos(i * angleStep))
                .attr('cy', (d, i) => pos.y + radius * Math.sin(i * angleStep))
                .attr('r', 5)
                .attr('fill', continentColors[continent]);

            // Linien zwischen den Ländern zur Bildung des Rings
            g.selectAll('line')
                .data(countries)
                .enter().append('line')
                .attr('x1', (d, i) => pos.x + radius * Math.cos(i * angleStep))
                .attr('y1', (d, i) => pos.y + radius * Math.sin(i * angleStep))
                .attr('x2', (d, i) => pos.x + radius * Math.cos((i + 1) % countries.length * angleStep))
                .attr('y2', (d, i) => pos.y + radius * Math.sin((i + 1) % countries.length * angleStep))
                .attr('stroke', continentColors[continent])
                .attr('stroke-width', 1);
        });
    }).catch(error => {
        console.error('Fehler beim Laden der Daten:', error);
    });
});
