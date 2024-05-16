document.addEventListener('DOMContentLoaded', function() {
    const width = 1400, height = 1000; // Erhöhte Höhe, um Textabschnitte oben und unten zu vermeiden
    const radius = Math.min(width, height) / 2 - 100; // Etwas mehr Abstand zum Rand

    const svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    d3.json('olympics.json').then(data => {
        let countryNodes = data.nodes.filter(d => d.noc);
        let sportNodes = []; 

        let medalCount = {};
        data.links.forEach(link => {
            link.attr.forEach(attr => {
                let sportId = attr.sport.toLowerCase().replace(/\s+/g, '_');
                if (!sportNodes.some(s => s.id === sportId)) {
                    sportNodes.push({ name: attr.sport, id: sportId });
                }
                if (!medalCount[link.target]) {
                    medalCount[link.target] = {};
                }
                if (!medalCount[link.target][sportId]) {
                    medalCount[link.target][sportId] = 0;
                }
                medalCount[link.target][sportId] += 1;
            });
        });

        const allNodes = [...countryNodes, ...sportNodes];
        const angleScale = d3.scaleLinear()
            .domain([0, allNodes.length])
            .range([0, 2 * Math.PI]);

        // Kanten
        let mostMedalsLinks = countryNodes.map(country => {
            let maxSportId = null;
            let maxMedals = 0;
            Object.keys(medalCount[country.id]).forEach(sportId => {
                if (medalCount[country.id][sportId] > maxMedals) {
                    maxMedals = medalCount[country.id][sportId];
                    maxSportId = sportId;
                }
            });
            return maxSportId ? { source: maxSportId, target: country.id } : undefined;
        }).filter(link => link !== undefined); // Falls nichts drin steht

        svg.append('g')
            .selectAll('line')
            .data(mostMedalsLinks)
            .enter().append('line')
            .attr('x1', d => radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.source))))
            .attr('y1', d => radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.source))))
            .attr('x2', d => radius * Math.cos(angleScale(allNodes.findIndex(node => node.id === d.target))))
            .attr('y2', d => radius * Math.sin(angleScale(allNodes.findIndex(node => node.id === d.target))))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        // Knoten Länder und Sportarten
        svg.append('g')
            .selectAll('circle')
            .data(allNodes)
            .enter().append('circle')
            .attr('cx', d => radius * Math.cos(angleScale(allNodes.indexOf(d))))
            .attr('cy', d => radius * Math.sin(angleScale(allNodes.indexOf(d))))
            .attr('r', 5)
            .attr('fill', d => d.noc ? '#104710 ' : '#701a3d');

        // Beschriftungen der Knoten
        svg.append('g')
            .selectAll('text')
            .data(allNodes)
            .enter().append('text')
            .style('text-anchor', d => {
                const angle = angleScale(allNodes.indexOf(d));
                return (angle > Math.PI / 2 && angle < 3 * Math.PI / 2) ? 'end' : 'start';
            })
            .style('font-size', '12px')
            .attr('x', d => (radius + 20) * Math.cos(angleScale(allNodes.indexOf(d))))
            .attr('y', d => (radius + 20) * Math.sin(angleScale(allNodes.indexOf(d))))
            .attr('transform', d => {
                const angle = angleScale(allNodes.indexOf(d)) * 180 / Math.PI;
                const rotateAngle = (angle > 90 && angle < 270) ? angle + 180 : angle;
                return `rotate(${rotateAngle},${(radius + 20) * Math.cos(angleScale(allNodes.indexOf(d)))},${(radius + 20) * Math.sin(angleScale(allNodes.indexOf(d)))})`;
            })
            .attr('alignment-baseline', 'middle')
            .text(d => d.name);
    });
});
