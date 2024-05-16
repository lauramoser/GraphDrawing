document.addEventListener('DOMContentLoaded', function() {
    d3.json('olympics.json').then(function(graph) {
        // Aggregieren der Daten
        const medalData = [];
        graph.links.forEach(link => {
            link.attr.forEach(attr => {
                const sportIndex = medalData.findIndex(item => item.sport === attr.sport);
                if (sportIndex === -1) {
                    medalData.push({
                        sport: attr.sport,
                        Male: 0,
                        Female: 0,
                        countries: {}
                    });
                }
                const index = medalData.findIndex(item => item.sport === attr.sport);
                if (attr.athlete.sex === 'Male') {
                    medalData[index].Male += 1;
                } else {
                    medalData[index].Female += 1;
                }
                if (medalData[index].countries[attr.country]) {
                    medalData[index].countries[attr.country] += 1;
                } else {
                    medalData[index].countries[attr.country] = 1;
                }
            });
        });

        // Finden des Landes mit den meisten Medaillen pro Sportart
        medalData.forEach(item => {
            const countries = Object.keys(item.countries);
            const maxCountry = countries.reduce((a, b) => item.countries[a] > item.countries[b] ? a : b);
            item.mostMedalsCountry = maxCountry;
        });

        // Hier könnte der Code für die D3-Visualisierung eingefügt werden
        renderChart(medalData);
    });

    function renderChart(data) {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 },
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        const svg = d3.select('#chart').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(data.map(d => d.sport));

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.Male + d.Female)]);

        svg.selectAll(".bar.male")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar male")
            .attr("x", d => x(d.sport))
            .attr("width", x.bandwidth() / 2)
            .attr("y", d => y(d.Male))
            .attr("height", d => height - y(d.Male))
            .attr("fill", "blue");

        svg.selectAll(".bar.female")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar female")
            .attr("x", d => x(d.sport) + x.bandwidth() / 2)
            .attr("width", x.bandwidth() / 2)
            .attr("y", d => y(d.Female))
            .attr("height", d => height - y(d.Female))
            .attr("fill", "pink");

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)"); // Rotiert die Beschriftung

        svg.append("g")
            .call(d3.axisLeft(y));
    }
});
