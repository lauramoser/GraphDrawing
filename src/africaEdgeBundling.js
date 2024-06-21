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

    const africaSportOrder = [
        "hockey",
        "swimming",
        "canoe_sprint",
        "surfing",
        "shooting",
        "cycling_track",
        "cycling_road",
        "triathlon",
        "rowing",
        "art_competitions",
        "tennis",
        "rugby_sevens",
        "boxing",
        "canoe_slalom",
        "football",
        "wrestling",
        "judo",
        "modern_pentathlon",
        "diving",
        "fencing",
        "taekwondo",
        "karate",
        "weightlifting",
        "marathon_swimming",
        "athletics"
    ];

    const africaCountryOrder = [
        "ERI",
        "TAN",
        "CIV",
        "BOT",
        "ETH",
        "NIG",
        "NAM",
        "MRI",
        "KEN",
        "TUN",
        "BUR",
        "SEN",
        "EGY",
        "ALG",
        "NGR",
        "DJI",
        "TOG",
        "GHA",
        "RSA",
        "MAR",
        "CMR",
        "ZIM",
        "MOZ",
        "BDI",
        "ZAM",
        "TTO",
        "UGA",
        "GAB"
    ];

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
                filteredSportNodes = africaSportOrder.map(sportId => sportNodes.find(node => node.id === sportId)).filter(Boolean);
            }

            // Combine countries and sports for Africa
            let allNodes;
            if (continent === "Africa") {
                const africaCountries = africaCountryOrder.map(countryId => countryNodes.find(node => node.noc === countryId)).filter(Boolean);
                allNodes = [...africaCountries, ...filteredSportNodes];
            } else {
                allNodes = [...countries, ...filteredSportNodes];
            }

            const angleScale = d3.scaleLinear()
                .domain([0, allNodes.length])
                .range([0, 2 * Math.PI]);

            const ringPosition = ringPositions[index]; // Position des jeweiligen Rings

            let rotationOffset = 0;
            const isEurope = continent === "Europe";
            const isOceania = continent === "Oceania";
            const isAmerica = continent === "America";
            const isAfrica = continent === "Africa";
            rotationOffset = isEurope ? 175 * (Math.PI / 180) : rotationOffset; // degrees in radians
            rotationOffset = isOceania ? 120 * (Math.PI / 180) : rotationOffset; // degrees in radians
            rotationOffset = isAmerica ? -120 * (Math.PI / 180) : rotationOffset; // degrees in radians
            rotationOffset = isAfrica ? 85 * (Math.PI / 180) : rotationOffset; // degrees in radians
    

            if (continent === "Africa") {
                // Hier beginnt das Edge Bundling für Afrika
                const cluster = d3.cluster()
                    .size([2 * Math.PI, radius]); // gleiche Größe wie die anderen Ringe

                const line = d3.lineRadial()
                    .curve(d3.curveBundle.beta(0.85))
                    .radius(d => d.y)
                    .angle(d => d.x);

                const root = d3.hierarchy(buildHierarchy(africaCountryOrder, africaSportOrder, sportToCountryLinks))
                    .sum(d => d.size);

                cluster(root);

                const links = root.leaves().flatMap(leaf => leaf.data.target.map(target => {
                    const targetLeaf = root.leaves().find(d => d.data.name === target);
                    return { source: leaf, target: targetLeaf, sex: leaf.data.sex };
                }));

                const africaGroup = svg.append('g')
                    .attr('transform', `translate(${ringPosition.x},${ringPosition.y}) rotate(${rotationOffset * 180 / Math.PI})`);

                africaGroup.append('g')
                    .selectAll('path')
                    .data(links)
                    .enter().append('path')
                    .attr('d', d => line(d.source.path(d.target)))
                    .style('fill', 'none')
                    .style('stroke', d => d.sex === 'Male' ? 'blue' : 'red')
                    .style('stroke-width', 1.5);

                africaGroup.append('g')
                    .selectAll('circle')
                    .data(root.leaves())
                    .enter().append('circle')
                    .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90})translate(${d.y},0)`)
                    .attr('r', 5)
                    .attr('fill', d => d.data.noc ? continentColors["Africa"] : '#DA70D6');
            } else {
                svg.append('g')
                    .selectAll('line')
                    .data(sportToCountryLinks)
                    .enter().append('line')
                    .attr('x1', d => ringPosition.x + radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffset))
                    .attr('y1', d => ringPosition.y + radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffset))
                    .attr('x2', d => ringPosition.x + radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffset))
                    .attr('y2', d => ringPosition.y + radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffset))
                    .attr('stroke', d => d.sex === 'Male' ? 'blue' : 'red')
                    .attr('stroke-width', 1);

                svg.append('g')
                    .selectAll('circle')
                    .data(allNodes)
                    .enter().append('circle')
                    .attr('cx', d => ringPosition.x + radius * Math.cos(angleScale(allNodes.indexOf(d)) + rotationOffset))
                    .attr('cy', d => ringPosition.y + radius * Math.sin(angleScale(allNodes.indexOf(d)) + rotationOffset))
                    .attr('r', 5)
                    .attr('fill', d => d.noc ? continentColors[continent] : '#DA70D6');
            }
        });

        function buildHierarchy(countries, sports, links) {
            const countryNodes = countries.map(country => ({ name: country, noc: true, target: [], sex: null }));
            const sportNodes = sports.map(sport => ({ name: sport, noc: false, target: [], sex: null }));
            links.forEach(link => {
                const sourceNode = sportNodes.find(node => node.name === link.source);
                const targetNode = countryNodes.find(node => node.name === link.target);
                if (sourceNode && targetNode) {
                    sourceNode.target.push(targetNode.name);
                    sourceNode.sex = link.sex; // Hier sicherstellen, dass das Geschlecht gesetzt wird
                }
            });
            return { children: [...countryNodes, ...sportNodes] };
        }
    }).catch(error => {
        console.error('Fehler beim Laden der Daten:', error);
    });
});
