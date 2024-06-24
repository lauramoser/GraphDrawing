import { africaSportOrder, africaCountryOrder } from './orders/africaOrder.js';
import { europaSportOrder, europaCountryOrder } from './orders/europaOrder.js';
import { asienSportOrder, asienCountryOrder } from './orders/asienOrder.js';
import { americaSportOrder, americaCountryOrder } from './orders/americaOrder.js';
import { oceaniaSportOrder, oceaniaCountryOrder } from './orders/oceaniaOrder.js';

document.addEventListener('DOMContentLoaded', function () {
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

            // Todo: remove
            if (continent === "Europe") {
                console.log('Länder in Europa:', countries.map(country => country.id));
            }
            if (continent === "Oceania") {
                console.log('Länder in Ozeaninen:', countries.map(country => country.id));
                console.log('Sportarten in Oceanien', sportNodes.map(sport => sport.id))
            }
            if (continent === "America") {
                console.log('Länder in Amerika:', countries.map(country => country.id));
                console.log('Sportarten in Amerika', sportNodes.map(sport => sport.id))
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
            let orderedCountries;
            if (continent === "Europe") {
                filteredSportNodes = sportNodes
                    .filter(sportNode => !sportsToRemoveEuropeAsia.has(sportNode.id) && europaSportOrder.includes(sportNode.id))
                    .sort((a, b) => europaSportOrder.indexOf(a.id) - europaSportOrder.indexOf(b.id));
                orderedCountries = europaCountryOrder
                    .map(countryId => countries.find(country => country.id === countryId))
                    .filter(Boolean);
            } else if (continent === "Asia") {
                filteredSportNodes = sportNodes
                    .filter(sportNode => !sportsToRemoveEuropeAsia.has(sportNode.id) && asienSportOrder.includes(sportNode.id))
                    .sort((a, b) => asienSportOrder.indexOf(a.id) - asienSportOrder.indexOf(b.id));
                orderedCountries = asienCountryOrder
                    .map(countryId => countries.find(country => country.id === countryId))
                    .filter(Boolean);
            } else if (continent === "Oceania") {
                filteredSportNodes = sportNodes
                    .filter(sportNode => !sportsToRemoveOceaniaAmerica.has(sportNode.id) && oceaniaSportOrder.includes(sportNode.id))
                    .sort((a, b) => oceaniaSportOrder.indexOf(a.id) - oceaniaSportOrder.indexOf(b.id));
                orderedCountries = oceaniaCountryOrder
                    .map(countryId => countries.find(country => country.id === countryId))
                    .filter(Boolean);
            } else if (continent === "America") {
                filteredSportNodes = sportNodes
                    .filter(sportNode => !sportsToRemoveOceaniaAmerica.has(sportNode.id) && americaSportOrder.includes(sportNode.id))
                    .sort((a, b) => americaSportOrder.indexOf(a.id) - americaSportOrder.indexOf(b.id));
                orderedCountries = americaCountryOrder
                    .map(countryId => countries.find(country => country.id === countryId))
                    .filter(Boolean);
            } else if (continent === "Africa") {
                filteredSportNodes = africaSportOrder.map(sportId => sportNodes.find(node => node.id === sportId)).filter(Boolean);
                orderedCountries = africaCountryOrder
                    .map(countryId => countries.find(country => country.id === countryId))
                    .filter(Boolean);
            }


            let allNodes = [...orderedCountries, ...filteredSportNodes];

            const angleScale = d3.scaleLinear()
                .domain([0, allNodes.length])
                .range([0, 2 * Math.PI]);

            const ringPosition = ringPositions[index]; // Position des jeweiligen Rings

            let rotationOffset = 0;
            const isEurope = continent === "Europe";
            const isOceania = continent === "Oceania";
            const isAmerica = continent === "America";
            const isAfrica = continent === "Africa";
            const isAsia = continent === "Asia";
            rotationOffset = isEurope ? 260 * (Math.PI / 180) : rotationOffset;
            rotationOffset = isOceania ? 205 * (Math.PI / 180) : rotationOffset;
            rotationOffset = isAmerica ? -5 * (Math.PI / 180) : rotationOffset;
            rotationOffset = isAfrica ? 85 * (Math.PI / 180) : rotationOffset;
            rotationOffset = isAsia ? 85 * (Math.PI / 180) : rotationOffset;

            // Edge bundling for continents with a specific order
            // Auskommentiert, allerdings noch drin gelassen damit einfach ohne edge-bundling genutzt werden kann. Um einzelne Kanten besser nachverfolgen zu können.
          //  if (continent === "Africa" || continent === "Europe" || continent === "Asia" || continent === 'Oceania' || continent === 'America') {
                const cluster = d3.cluster()
                    .size([2 * Math.PI, radius]); // gleiche Größe wie die anderen Ringe

                const line = d3.lineRadial()
                    .curve(d3.curveBundle.beta(0.85))
                    .radius(d => d.y)
                    .angle(d => d.x);

                const root = d3.hierarchy(buildHierarchy(orderedCountries.map(d => d.id), filteredSportNodes.map(d => d.id), sportToCountryLinks))
                    .sum(d => d.size);

                cluster(root);

                const links = root.leaves().flatMap(leaf => leaf.data.target.map(target => {
                    const targetLeaf = root.leaves().find(d => d.data.name === target);
                    return { source: leaf, target: targetLeaf, sex: leaf.data.sex };
                }));

                const continentGroup = svg.append('g')
                    .attr('transform', `translate(${ringPosition.x},${ringPosition.y}) rotate(${rotationOffset * 180 / Math.PI})`);

                continentGroup.append('g')
                    .selectAll('path')
                    .data(links)
                    .enter().append('path')
                    .attr('d', d => line(d.source.path(d.target)))
                    .style('fill', 'none')
                    .style('stroke', d => d.sex === 'Male' ? 'blue' : 'red')
                    .style('stroke-width', 1.5);

                continentGroup.append('g')
                    .selectAll('circle')
                    .data(root.leaves())
                    .enter().append('circle')
                    .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90})translate(${d.y},0)`)
                    .attr('r', 5)
                    .attr('fill', d => d.data.noc ? continentColors[continent] : '#DA70D6');
                    // Auskommentiert, allerdings noch drin gelassen damit einfach ohne edge-bundling genutzt werden kann. Um einzelne Kanten besser nachverfolgen zu können.
           /* } else {
                const group = svg.append('g')
                    .attr('transform', `translate(${ringPosition.x},${ringPosition.y})`);

                group.append('g')
                    .selectAll('line')
                    .data(sportToCountryLinks)
                    .enter().append('line')
                    .attr('x1', d => radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffset))
                    .attr('y1', d => radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.source)) + rotationOffset))
                    .attr('x2', d => radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffset))
                    .attr('y2', d => radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.target)) + rotationOffset))
                    .attr('stroke', d => d.sex === 'Male' ? 'blue' : 'red')
                    .attr('stroke-width', 1);

                group.append('g')
                    .selectAll('circle')
                    .data(allNodes)
                    .enter().append('circle')
                    .attr('cx', d => radius * Math.cos(angleScale(allNodes.indexOf(d)) + rotationOffset))
                    .attr('cy', d => radius * Math.sin(angleScale(allNodes.indexOf(d)) + rotationOffset))
                    .attr('r', 5)
                    .attr('fill', d => d.noc ? continentColors[continent] : '#DA70D6');
                if (continent === 'America') {
                    svg.append('g')
                        .selectAll('text')
                        .data(allNodes)
                        .enter().append('text')
                        .style('text-anchor', d => {
                            const angle = angleScale(allNodes.indexOf(d));
                            return (angle > Math.PI / 2 && angle < 3 * Math.PI / 2) ? 'end' : 'start';
                        })
                        .style('font-size', '12px')
                        .attr('x', d => ringPosition.x + (radius + 20) * Math.cos(angleScale(allNodes.indexOf(d))))
                        .attr('y', d => ringPosition.y + (radius + 20) * Math.sin(angleScale(allNodes.indexOf(d))))
                        .attr('transform', d => {
                            const angle = angleScale(allNodes.indexOf(d)) * 180 / Math.PI;
                            const rotateAngle = (angle > 90 && angle < 270) ? angle + 180 : angle;
                            return `rotate(${rotateAngle},${ringPosition.x + (radius + 20) * Math.cos(angleScale(allNodes.indexOf(d)))},${ringPosition.y + (radius + 20) * Math.sin(angleScale(allNodes.indexOf(d)))})`;
                        })
                        .attr('alignment-baseline', 'middle')
                        .text(d => d.name);
                }
            }*/
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
