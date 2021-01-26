# covid-dashboard-data

This project contains three scripts that imports and updates data from ***The COVID Tracking Project***. The scripts bring in JSON data and integrates that data into a MySQL or MariaDB database. 

## The Scripts and how to use them
1. **us-covid-total.js**
2. **states-covid-daily.js**
3. **coronavirus.sql**

### Usage ###
*Note: For these scripts to work, you must have either MySQL or MariaDB installed on your computer/server*

1. Import the coronavirus.sql script into or MariaDB. This will create the database with three tables:
- covid_19_history  - contains data for each state for each day going back to 2020-01-13 (loaded by script)
- us_covid_totals   - contains totals for entire US, and US territories, as a whole going back to 2020-03-04 (loaded by script)
- states            - A reference table containing the abbreviation and full name of each state (preloaded)

2. Open a terminal window and navigate to the directory where the scripts have been installed. To do an initial load of the database, you must use the 'full' option at the command line: 
- `node states-covid-daily full`
- `node us-covid-total.js full`

3. Daily updates can be done by **NOT** using the **full** option. Running the scripts with no options will only bring in the last update available from The COVID Tracking Project API. This will dramatically reduce your bandwidth and increase your update speed. If you are updating your data using crontab, it is recommended that you run your updates after 8:00 PM Eastern Time. 
