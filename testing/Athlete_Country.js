document.addEventListener('DOMContentLoaded', function() {
    // JSON-Daten einlesen
    fetch('olympics.json')
        .then(response => response.json())
        .then(data => {
            // Zuordnung der Länder-Abkürzung zu ihren Namen erstellen
            const countryMap = {};
            data.nodes.forEach(node => {
                if (node.noc && node.name) {
                    countryMap[node.noc] = node.name;
                }
            });

            // Tabelle erstellen
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // Tabellenkopf erstellen
            const headRow = document.createElement('tr');
            const headCellAthlete = document.createElement('th');
            headCellAthlete.textContent = 'Athlete';
            const headCellCountry = document.createElement('th');
            headCellCountry.textContent = 'Country';

            headRow.appendChild(headCellAthlete);
            headRow.appendChild(headCellCountry);
            thead.appendChild(headRow);
            table.appendChild(thead);

            // Daten durchgehen und Tabellenzeilen erstellen
            const athleteCountryMap = new Map(); // Map für die Zuordnung von Athleten zu Ländern
            data.links.forEach(link => {
                if (link.attr && link.attr.length > 0) {
                    link.attr.forEach(attr => {
                        // Prüfen, ob der Athlet bereits für dieses Land verzeichnet ist
                        if (!athleteCountryMap.has(attr.athlete.name)) {
                            // Athlet für dieses Land noch nicht verzeichnet, Zeile zur Tabelle hinzufügen
                            const row = document.createElement('tr');
                            const cellAthlete = document.createElement('td');
                            const cellCountry = document.createElement('td');

                            cellAthlete.textContent = attr.athlete.name;
                            cellCountry.textContent = countryMap[link.target] || link.target;

                            row.appendChild(cellAthlete);
                            row.appendChild(cellCountry);
                            tbody.appendChild(row);

                            // Athlet zum Map hinzufügen
                            athleteCountryMap.set(attr.athlete.name, link.target);
                        }
                    });
                }
            });

            table.appendChild(tbody);

            // Tabelle dem HTML-Dokument hinzufügen
            document.body.appendChild(table);
        })
        .catch(error => console.error('Error:', error));
});
