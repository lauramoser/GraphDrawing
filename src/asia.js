document.addEventListener('DOMContentLoaded', function() {
    const width = 1400, height = 1000;
    const radius = Math.min(width, height) / 6;

    const svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const ringPositions = [
        { x: -radius * 2.5, y: 0 },    // Europa
        { x: -radius * 1.25, y: -radius * 1.5 },  // Asien
        { x: 0, y: 0 },    // Afrika
        { x: radius * 1.25, y: -radius * 1.5 },  // Australien
        { x: radius * 2.5, y: 0 }     // Amerika
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
        let sportNodes = [];

        let sportMedalCount = {};
        olympicsData.links.forEach(link => {
            link.attr.forEach(attr => {
                let sportId = attr.sport.toLowerCase().replace(/\s+/g, '_');
                if (!sportNodes.some(s => s.id === sportId)) {
                    sportNodes.push({ name: attr.sport, id: sportId });
                }
                if (!sportMedalCount[sportId]) {
                    sportMedalCount[sportId] = {};
                }
                if (!sportMedalCount[sportId][link.target]) {
                    sportMedalCount[sportId][link.target] = 0;
                }
                sportMedalCount[sportId][link.target] += 1;
            });
        });

        let asiaCountries = countryNodes.filter(country => continentsMap[country.noc] === "Asia");
        const allNodes = [...asiaCountries, ...sportNodes];
        const angleScale = d3.scaleLinear()
            .domain([0, allNodes.length])
            .range([0, 2 * Math.PI]);

        // Kanten von Sportarten zu den Ländern, die in diesen Sportarten die meisten Medaillen gewonnen haben
        let sportToCountryLinks = sportNodes.map(sport => {
            let maxCountryId = null;
            let maxMedals = 0;
            Object.keys(sportMedalCount[sport.id]).forEach(countryId => {
                if (sportMedalCount[sport.id][countryId] > maxMedals && asiaCountries.some(country => country.id === countryId)) {
                    maxMedals = sportMedalCount[sport.id][countryId];
                    maxCountryId = countryId;
                }
            });
            if (!maxCountryId) {
                console.log(`Keine Medaillen für Sportart: ${sport.name}`);
            }
            return maxCountryId ? { source: sport.id, target: maxCountryId } : { source: sport.id, target: 'dummy' };
        });

        // Remove dummy links for sports with no medals in Asia
        sportToCountryLinks = sportToCountryLinks.filter(link => link.target !== 'dummy');

        const asiaRing = ringPositions[1]; // Position des gelben Asien-Rings

        svg.append('g')
            .selectAll('line')
            .data(sportToCountryLinks)
            .enter().append('line')
            .attr('x1', d => asiaRing.x + radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.source))))
            .attr('y1', d => asiaRing.y + radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.source))))
            .attr('x2', d => asiaRing.x + radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.target))))
            .attr('y2', d => asiaRing.y + radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.target))))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        // Knoten Länder und Sportarten im gelben Asien-Ring
        svg.append('g')
            .selectAll('circle')
            .data(allNodes)
            .enter().append('circle')
            .attr('cx', d => asiaRing.x + radius * Math.cos(angleScale(allNodes.indexOf(d))))
            .attr('cy', d => asiaRing.y + radius * Math.sin(angleScale(allNodes.indexOf(d))))
            .attr('r', 5)
            .attr('fill', d => d.noc ? '#FFD700' : '#DA70D6'); // Gelb für Länder, Lila für Sportarten

        // Beschriftungen der Knoten (optional)
        svg.append('g')
            .selectAll('text')
            .data(allNodes)
            .enter().append('text')
            .style('text-anchor', d => {
                const angle = angleScale(allNodes.indexOf(d));
                return (angle > Math.PI / 2 && angle < 3 * Math.PI / 2) ? 'end' : 'start';
            })
            .style('font-size', '12px')
            .attr('x', d => asiaRing.x + (radius + 20) * Math.cos(angleScale(allNodes.indexOf(d))))
            .attr('y', d => asiaRing.y + (radius + 20) * Math.sin(angleScale(allNodes.indexOf(d))))
            .attr('transform', d => {
                const angle = angleScale(allNodes.indexOf(d)) * 180 / Math.PI;
                const rotateAngle = (angle > 90 && angle < 270) ? angle + 180 : angle;
                return `rotate(${rotateAngle},${asiaRing.x + (radius + 20) * Math.cos(angleScale(allNodes.indexOf(d)))},${asiaRing.y + (radius + 20) * Math.sin(angleScale(allNodes.indexOf(d)))})`;
            })
            .attr('alignment-baseline', 'middle')
            .text(d => d.name); // Entfernen Sie diese Zeile, wenn Sie keine Beschriftungen wünschen
    }).catch(error => {
        console.error('Fehler beim Laden der Daten:', error);
    });
});
