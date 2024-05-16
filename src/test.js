// sortieren nach Sportart und Land
document.addEventListener('DOMContentLoaded', function() {
    d3.json('olympics.json').then(function(graph) {
        const nodes = graph.nodes;
        const links = graph.links.map(d => ({source: d.source, target: d.target, type: d.attr[0].medal}));

        const svg = d3.select("#network").append("svg")
            .attr("width", 2000)
            .attr("height", 1600);

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(150))  // Erhöhte Distanz zwischen den Knoten
            .force("charge", d3.forceManyBody().strength(-500))  // Stärkere Abstoßung
            .force("center", d3.forceCenter(2000 / 2, 1600 / 2));  // Korrekte Zentrierung

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", d => Math.sqrt(2))
            .style("stroke", d => d.type === "Gold" ? "#ffd700" : d.type === "Silver" ? "#c0c0c0" : "#cd7f32");

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", d => "#1f77b4");

        const text = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("x", 8)
            .attr("y", ".31em")
            .text(d => d.name);

        node.append("title")
            .text(d => d.id);

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link") 
            .links(links);

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x = Math.max(15, Math.min(2000 - 15, d.x)))  // Begrenzt x innerhalb des SVGs
                .attr("cy", d => d.y = Math.max(15, Math.min(1600 - 15, d.y))); // Begrenzt y innerhalb des SVGs

            text
                .attr("x", d => d.x + 10)
                .attr("y", d => d.y);
        }
    }).catch(function(error) {
        console.error('Error loading the data:', error);
    });
});
