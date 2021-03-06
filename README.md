# covid-dashboard-data
## Installation
1. Clone project onto your server or local computer
2. Navigate into the directory that has been been created
3. Run `npm install`
4. Create a .env file with the following information:  
  
   DB_HOST=localhost  
   DB_USER=your_username  
   DB_PASS=your_password  
   DATABASE=coronavirus  
  
This project contains three scripts that imports and updates data from ***The COVID Tracking Project***. The scripts bring in JSON data and integrates that data into a MySQL or MariaDB database. 

## The Scripts and how to use them
- **us-covid-total.js**
- **states-covid-daily.js**
- **coronavirus.sql**

### Usage ###
*Note: For these scripts to work, you must have either MySQL or MariaDB installed on your computer/server*

1. Import the coronavirus.sql script into MySQL or MariaDB. This will create the database with three tables:
- **covid_19_history**  - contains data for each state for each day going back to 2020-01-13 (loaded by script)
- **us_covid_totals**   - contains totals for entire US, and US territories, as a whole going back to 2020-03-04 (loaded by script)
- **states**            - A reference table containing the abbreviation and full name of each state (preloaded)

2. Open a terminal window and navigate to the directory where the scripts have been installed. To do an initial load of the database, you must use the **'full'** option at the command line: 
- `node states-covid-daily.js full`
- `node us-covid-total.js full`

3. Daily updates can be done by **NOT** using the **full** option. Running the scripts with no options will only bring in the last update available from The COVID Tracking Project API. This will dramatically reduce your bandwidth and increase your update speed. If you are updating your data using crontab, it is recommended that you run your updates after 8:00 PM Eastern Time. 

## Available data

### Table: covid19_history_by_state
Daily information for each state, Washington DC, and Puerto Rico
| Field | Data Tyoe |
| :---        |    :---   |
| id      | int(11) - auto_increment |
| state   | char(2) |
| date | varchar(10)|
| month_year | char(8)|
| totalTestResults | int(11) |
| positive | int(11) |
| positiveIncrease | int(11) |
| hospitalizedCurrently | int(11) |
| hospitalizedIncrease  | int(11) |
| hospitalizedCumulative | int(11) |
| inIcuCurrently | int(11) |
| inIcuCumulative | int(11) |
| onVentilatorCurrently | int(11) |
| onVentilatorCumulative | int(11) |
| death | int(11) |
| deathIncrease | int(11) |


### Table: us_covid_totals
Daily information for the United States as a whole. Includes Washington DC, and ALL U.S. territories.
| Field | Data Tyoe |
| :---        |    :---   |
| id | int(11) - auto_increment | 
| date | varchar(10)| 
| month_year | char(8)| 
| totalTestResults | int(11)| 
| positive | int(11)| 
| positiveIncrease | int(11)| 
| hospitalizedCurrently | int(11)| 
| hospitalizedIncrease | int(11)| 
| hospitalizedCumulative | int(11)| 
| inIcuCurrently | int(11)| 
| inIcuCumulative | int(11)| 
| onVentilatorCurrently | int(11)| 
| onVentilatorCumulative | int(11)| 
| death | int(11)| 
| deathIncrease | int(11)| 


### Table: states
This is a reference table for the scripts
| Field | Data Tyoe |
| :---        |    :---   |
| id | int(11) - auto_increment | 
| state_id | char(2) | 
| state_name | varchar(60) |

## Modifications
If you wish to add data fields to this project, you can find all available API data at [The COVID Tracking Project API](https://covidtracking.com/data/api)
