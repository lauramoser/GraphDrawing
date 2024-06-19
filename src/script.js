document.addEventListener('DOMContentLoaded', function() {
    const width = 1400, height = 1000;
    const radius = Math.min(width, height) / 6;

    const svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const ringPositions = [
        { x: -radius * 2.5, y: -radius * 1.5 }, // Europa
        { x: -radius * 1.25, y: 0 },            // Asien
        { x: 0, y: -radius * 1.5 },             // Afrika
        { x: radius * 1.25, y: 0 },             // Australien
        { x: radius * 2.5, y: -radius * 1.5 }   // Amerika
    ];

    const continentColors = {
        "Europe": "#0000FF",   // Blau
        "Asia": "#FFD700",     // Gelb
        "Africa": "#000000",   // Schwarz
        "Oceania": "#00FF00",  // Grün
        "America": "#FF0000"   // Rot
    };

    d3.json('olympics_continents.json').then(data => {
        console.log('Daten geladen:', data);

        let continentsMap = {};
        data.nodes.forEach(node => {
            continentsMap[node.id] = node.continent;
        });

        console.log('Kontinent Zuordnung:', continentsMap);

        let countryNodes = data.nodes.filter(d => d.noc);
        let sportNodes = data.nodes.filter(d => !d.noc);

        let medalPoints = {
            'Gold': 3,
            'Silver': 2,
            'Bronze': 1
        };

        let sportMedals = {};
        let teams = {};

        data.links.forEach(link => {
            link.attr.forEach(attr => {
                let sportId = attr.sport.toLowerCase().replace(/\s+/g, '_');
                let countryId = link.target;
                let medal = attr.medal;
                let sex = attr.athlete.sex;
                let year = attr.year;
                let city = attr.city;
                let event = attr.event;

                if (!sportNodes.some(s => s.id === sportId)) {
                    sportNodes.push({ name: attr.sport, id: sportId });
                }

                if (!sportMedals[sportId]) {
                    sportMedals[sportId] = { Male: {}, Female: {} };
                }
                
                if (!sportMedals[sportId][sex][countryId]) {
                    sportMedals[sportId][sex][countryId] = 0;
                }

                if (!teams[sportId]) {
                    teams[sportId] = {};
                }
                if (!teams[sportId][event]) {
                    teams[sportId][event] = {};
                }
                if (!teams[sportId][event][year]) {
                    teams[sportId][event][year] = {};
                }
                if (!teams[sportId][event][year][city]) {
                    teams[sportId][event][year][city] = {};
                }
                if (!teams[sportId][event][year][city][medal] && event.includes("Team")) {
                    teams[sportId][event][year][city][medal] = true;
                    sportMedals[sportId][sex][countryId] += medalPoints[medal];
                } else if (!event.includes("Team")) {
                    sportMedals[sportId][sex][countryId] += medalPoints[medal];
                }
            });
        });

        // Filter sports that have no connections in Europe and Asia
        let sportsToRemoveEuropeAsia = new Set();
        sportNodes.forEach(sportNode => {
            let hasConnectionInEurope = false;
            let hasConnectionInAsia = false;
            ['Male', 'Female'].forEach(sex => {
                if (sportMedals[sportNode.id] && sportMedals[sportNode.id][sex]) {
                    for (let countryId in sportMedals[sportNode.id][sex]) {
                        if (continentsMap[countryId] === 'Europe') {
                            hasConnectionInEurope = true;
                        }
                        if (continentsMap[countryId] === 'Asia') {
                            hasConnectionInAsia = true;
                        }
                    }
                }
            });
            if (!hasConnectionInEurope && !hasConnectionInAsia) {
                sportsToRemoveEuropeAsia.add(sportNode.id);
            }
        });

        console.log('Sports to remove from Europe and Asia:', Array.from(sportsToRemoveEuropeAsia));

        // Filter sports that have no connections in Oceania and America
        let sportsToRemoveOceaniaAmerica = new Set();
        sportNodes.forEach(sportNode => {
            let hasConnectionInOceania = false;
            let hasConnectionInAmerica = false;
            ['Male', 'Female'].forEach(sex => {
                if (sportMedals[sportNode.id] && sportMedals[sportNode.id][sex]) {
                    for (let countryId in sportMedals[sportNode.id][sex]) {
                        if (continentsMap[countryId] === 'Oceania') {
                            hasConnectionInOceania = true;
                        }
                        if (continentsMap[countryId] === 'America') {
                            hasConnectionInAmerica = true;
                        }
                    }
                }
            });
            if (!hasConnectionInOceania && !hasConnectionInAmerica) {
                sportsToRemoveOceaniaAmerica.add(sportNode.id);
            }
        });

        console.log('Sports to remove from Oceania and America:', Array.from(sportsToRemoveOceaniaAmerica));
        

        const continentsOrder = ["Europe", "Asia", "Africa", "Oceania", "America"];
        continentsOrder.forEach((continent, index) => {
            let countries = countryNodes.filter(country => continentsMap[country.noc] === continent);
            if (!countries.length) {
                console.log(`Keine Länder gefunden für Kontinent: ${continent}`);
                return;
            }

            let sportToCountryLinks = [];
            Object.keys(sportMedals).forEach(sportId => {
                ['Male', 'Female'].forEach(sex => {
                    let maxCountryId = null;
                    let maxPoints = 0;
                    Object.keys(sportMedals[sportId][sex]).forEach(countryId => {
                        if (sportMedals[sportId][sex][countryId] > maxPoints && countries.some(country => country.id === countryId)) {
                            maxPoints = sportMedals[sportId][sex][countryId];
                            maxCountryId = countryId;
                        }
                    });
                    if (maxCountryId) {
                        sportToCountryLinks.push({ source: sportId, target: maxCountryId, sex: sex });
                    }
                });
            });

            // Filter the sport nodes for the current continent
            let filteredSportNodes;
            if (continent === "Europe" || continent === "Asia") {
                filteredSportNodes = sportNodes.filter(sportNode => !sportsToRemoveEuropeAsia.has(sportNode.id));
            } else if (continent === "Oceania" || continent === "America") {
                filteredSportNodes = sportNodes.filter(sportNode => !sportsToRemoveOceaniaAmerica.has(sportNode.id));
            } else if (continent === "Africa") {
                filteredSportNodes = sportNodes.filter(sportNode => sportToCountryLinks.some(link => link.source === sportNode.id));
            }

            const allNodes = [...countries, ...filteredSportNodes];
            const angleScale = d3.scaleLinear()
                .domain([0, allNodes.length])
                .range([0, 2 * Math.PI]);

            const ringPosition = ringPositions[index]; // Position des jeweiligen Rings

            const isEurope = continent === "Europe";
            const rotationOffset = isEurope ? -45 * (Math.PI / 180) : 0; // degrees in radians
            const isOceania = continent === "Oceania";
            const rotationOffsetOceania = isOceania ? 40 * (Math.PI / 180) : 0; // degrees in radians

            svg.append('g')
                .selectAll('line')
                .data(sportToCountryLinks)
                .enter().append('line')
                .attr('x1', d => ringPosition.x + radius * Math.cos(isEurope ? -angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffset : isOceania ? angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffsetOceania : angleScale(allNodes.findIndex(node => node.id === d.source))))
                .attr('y1', d => ringPosition.y + radius * Math.sin(isEurope ? -angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffset : isOceania ? angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffsetOceania : angleScale(allNodes.findIndex(node => node.id === d.source))))
                .attr('x2', d => ringPosition.x + radius * Math.cos(isEurope ? -angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffset : isOceania ? angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffsetOceania : angleScale(allNodes.findIndex(node => node.id === d.target))))
                .attr('y2', d => ringPosition.y + radius * Math.sin(isEurope ? -angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffset : isOceania ? angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffsetOceania : angleScale(allNodes.findIndex(node => node.id === d.target))))
                .attr('stroke', d => d.sex === 'Male' ? 'blue' : 'red')
                .attr('stroke-width', 1);

            // Knoten Länder und Sportarten im jeweiligen Ring
            svg.append('g')
                .selectAll('circle')
                .data(allNodes)
                .enter().append('circle')
                .attr('cx', d => ringPosition.x + radius * Math.cos(isEurope ? -angleScale(allNodes.indexOf(d)) + rotationOffset : isOceania ? angleScale(allNodes.indexOf(d)) + rotationOffsetOceania : angleScale(allNodes.indexOf(d))))
                .attr('cy', d => ringPosition.y + radius * Math.sin(isEurope ? -angleScale(allNodes.indexOf(d)) + rotationOffset : isOceania ? angleScale(allNodes.indexOf(d)) + rotationOffsetOceania : angleScale(allNodes.indexOf(d))))
                .attr('r', 5)
                .attr('fill', d => d.noc ? continentColors[continent] : '#DA70D6'); // Farbe für Länder, Lila für Sportarten

        });
    }).catch(error => {
        console.error('Fehler beim Laden der Daten:', error);
    });
});
