document.addEventListener('DOMContentLoaded', function() {
    const width = 960, height = 500, radius = Math.min(width, height) / 2 - 50;

    const svg = d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    d3.json('olympics.json').then(data => {
        const countryNodes = data.nodes.filter(d => d.noc);
        const sportNodes = data.nodes.filter(d => !d.noc);
        const allNodes = [...countryNodes, ...sportNodes];
        const medalCount = {};

        // Initialisieren des medalCount-Objekts für jedes Land und jede Sportart
        allNodes.forEach(node => {
            if (node.noc) {
                medalCount[node.id] = {};
                sportNodes.forEach(sport => {
                    medalCount[node.id][sport.id] = 0;
                });
            }
        });

        // Erfassung der Medaillen für jede spezifische Sportart
        data.links.forEach(link => {
            const country = link.target;
            const sport = link.source;
            const medals = link.attr.length;
    
            if (medalCount[country] && medalCount[country][sport] !== undefined) {
                medalCount[country][sport] += medals;
            }
        });

        const mostMedalsLinks = countryNodes.map(country => {
            const sports = Object.keys(medalCount[country.id]);
            const mostMedalsSport = sports.reduce((a, b) => medalCount[country.id][a] > medalCount[country.id][b] ? a : b);
            return { source: mostMedalsSport, target: country.id };
        });    

        const angleScale = d3.scaleOrdinal()
            .domain(allNodes.map(d => d.id))
            .range([...Array(allNodes.length).keys()].map(d => d * (2 * Math.PI / allNodes.length)));

        // Verbindungen zwischen Ländern und ihren spezifischen Sportarten
        svg.append('g')
            .selectAll('line')
            .data(mostMedalsLinks)
            .enter().append('line')
            .attr('x1', d => radius * Math.cos(angleScale(d.source)))
            .attr('y1', d => radius * Math.sin(angleScale(d.source)))
            .attr('x2', d => radius * Math.cos(angleScale(d.target)))
            .attr('y2', d => radius * Math.sin(angleScale(d.target)))
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        // Zeichnen der Knoten
        svg.append('g')
            .selectAll('circle')
            .data(allNodes)
            .enter().append('circle')
            .attr('cx', d => radius * Math.cos(angleScale(d.id)))
            .attr('cy', d => radius * Math.sin(angleScale(d.id)))
            .attr('r', 5)
            .attr('fill', 'red');

        // Beschriftungen der Knoten
        svg.append('g')
            .selectAll('text')
            .data(allNodes)
            .enter().append('text')
            .style('text-anchor', d => (angleScale(d.id) >= Math.PI / 2 && angleScale(d.id) <= 3 * Math.PI / 2) ? 'end' : 'start')
            .style('font-size', '8px') 
            .attr('alignment-baseline', 'middle')
            .attr('transform', d => {
                const x = (radius + 10) * Math.cos(angleScale(d.id));
                const y = (radius + 10) * Math.sin(angleScale(d.id));
                const angle = (angleScale(d.id) >= Math.PI / 2 && angleScale(d.id) <= 3 * Math.PI / 2) ? angleScale(d.id) * 180 / Math.PI + 180 : angleScale(d.id) * 180 / Math.PI;
                return `translate(${x},${y}) rotate(${angle})`;
            })
            .text(d => d.name);
    });
});
