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
        
        # Initialize the dictionaries if they don't exist
        if year not in athlete_counts:
            athlete_counts[year] = {}
            counted_athletes[year] = set()

        if sex not in athlete_counts[year]:
            athlete_counts[year][sex] = 0

        # Check if the athlete has already been counted for this year
        if name not in counted_athletes[year]:
            athlete_counts[year][sex] += 1
            counted_athletes[year].add(name)

# Sort the years
sorted_years = sorted(athlete_counts.keys())

# Write the counts to a text file
with open('athlete_counts_ys.txt', 'w') as f:
    for year in sorted_years:
        f.write(f"Year: {year}\n")
        year_data = athlete_counts[year]
        for sex, count in year_data.items():
            f.write(f"  Sex: {sex}, Count: {count}\n")
