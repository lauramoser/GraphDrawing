import json

# Load the JSON data
with open('olympics_continents.json') as f:
    data = json.load(f)

# Initialize a dictionary to store the counts
athlete_counts = {}
# Initialize a dictionary to track counted athletes
counted_athletes = {}

# Iterate through the links
for link in data['links']:
    for attr in link['attr']:
        year = attr['year']
        sex = attr['athlete']['sex']
        name = attr['athlete']['name']
        target_id = link['target']
        
        # Find the continent for the target node
        continent = "no_one"
        for node in data['nodes']:
            if node['id'] == target_id and 'continent' in node:
                continent = node['continent']
                break
        
        # Skip if continent is not found
        if continent == "no_one":
            continue
        
        # Initialize the dictionaries if they don't exist
        if year not in athlete_counts:
            athlete_counts[year] = {}
            counted_athletes[year] = set()

        if sex not in athlete_counts[year]:
            athlete_counts[year][sex] = {}

        if continent not in athlete_counts[year][sex]:
            athlete_counts[year][sex][continent] = 0

        # Check if the athlete has already been counted for this year
        if name not in counted_athletes[year]:
            athlete_counts[year][sex][continent] += 1
            counted_athletes[year].add(name)

# Sort the years
sorted_years = sorted(athlete_counts.keys())

# Write the counts to a text file
with open('athlete_counts_ysc.txt', 'w') as f:
    for year in sorted_years:
        f.write(f"Year: {year}\n")
        year_data = athlete_counts[year]
        for sex, sex_data in year_data.items():
            f.write(f"  Sex: {sex}\n")
            for continent, count in sex_data.items():
                f.write(f"    Continent: {continent}, Count: {count}\n")
