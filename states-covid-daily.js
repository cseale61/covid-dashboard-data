require('dotenv').config();
const mysql  = require('mysql');
const http   = require('axios');
const util   = require('util');  // automatically loaded

// Get load type from command line
let type = process.argv[2];

// Default load type will be daily, so test for undefined.
if (typeof type === "undefined") {
    type = 'daily';
} 

// Assign the load type to a constant (loadType) for use throughout the script
const loadType = type;

// Setup database connection
const dbconn = mysqlConnect(mysql);
const query  = util.promisify(dbconn.query).bind(dbconn);

loadData();

async function loadData() {

    console.log('Processing, please stand by...');

    let lastUpdate  = null;
    let msg         = null;
    let stateData   = [];
    let state       = null;
    let states      = await getStates();
    
    if (loadType == 'full') {
        msg = await clearTable();
        console.log(msg);
    } else {
        lastUpdate = await checkLastUpdate();
    }

    console.log('Retrieving data by state. This can take awhile...');

    for(let i = 0; i < states.length; i++) {
        
        state = states[i].state_id.toLowerCase();

        if (loadType === 'full') {

            await processStateData(state);

        } else {

            stateData[i] = await getStateData(state);
            if(formatDate(stateData[i].date) === lastUpdate) {

                console.log('Data is current, no update necessary');
                process.exit();

            }

        }
    }

    if(loadType === 'daily') {
        await updateCovidData(stateData);
    }

    if(loadType === 'full') {
        msg = 'COVID-19 history table has been cleared and reloaded';
    } else {
        msg = 'COVID-19 history table has been updated';
    }

    console.log(msg);
    process.exit();

};

async function getStates() {

    let sql  = "SELECT state_id FROM states ORDER BY state_id";
    let rows; 

    try {

        rows = await query(sql);
        return rows;

    } catch(err) {
        exitWithError(err);
    }
}

async function getStateData(state) {

    let url = `https://api.covidtracking.com/v1/states/${state}/current.json`;
    
    try {

        let result = await http.get(url);
        return result.data;

    } catch(err) {
        exitWithError(err);
    }
}

async function processStateData(state) {

    let url = `https://api.covidtracking.com/v1/states/${state}/daily.json`;

    try {
        
        let response = await http.get(url);
        await updateCovidData(response.data);
    
    } catch(err) {
        exitWithError(err);
    }

}

async function updateCovidData(cdata) {

    let data = [];
    let date = null;
    let month = null;
    let dateInfo = null;

    for(let i = 0; i < cdata.length; i++) {

        dateInfo = await formatDate(cdata[i].date);
        date = dateInfo.date;
        month = dateInfo.month;

        data[i] = [
            cdata[i].state,
            date,
            month,
            cdata[i].totalTestResults,
            cdata[i].positive,
            cdata[i].positiveIncrease,
            cdata[i].hospitalizedCurrently,
            cdata[i].hospitalizedIncrease,
            cdata[i].hospitalizedCumulative,
            cdata[i].inIcuCurrently,
            cdata[i].inIcuCumulative,
            cdata[i].onVentilatorCurrently,
            cdata[i].onVentilatorCumulative,
            cdata[i].death,
            cdata[i].deathIncrease,
        ];

    }

    let sql = "INSERT INTO covid19_history_by_state ( \
                    state, \
                    date, \
                    month_year, \
                    totalTestResults, \
                    positive, \
                    positiveIncrease, \
                    hospitalizedCurrently, \
                    hospitalizedIncrease, \
                    hospitalizedCumulative, \
                    inIcuCurrently, \
                    inIcuCumulative, \
                    onVentilatorCurrently, \
                    onVentilatorCumulative, \
                    death, \
                    deathIncrease \
               ) VALUES ?";

    try {

        let rows = await query(sql, [data]);
        return 1;
    
    } catch(err) {
        exitWithError(err);
    }

}

async function clearTable() {

    let sql = 'DELETE FROM covid19_history_by_state';
    try {

        let rows = await query(sql);
        return 'Table has been cleared.';
    
    } catch(err) {
        exitWithError(err);
    }

}

async function checkLastUpdate() {

    let sql = 'SELECT date FROM covid19_history_by_state ORDER BY date DESC LIMIT 1';
    try {

        let lastUpdate = await query(sql);
        return lastUpdate[0].date;
    
    } catch(err) {
        exitWithError(err);
    }

}

function formatDate(date) {

    date = String(date);
    let dateStr = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8); 

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let month = months[parseInt(date.substring(4, 6)) -1];

    let monthYear = month + ' ' + date.substring(0, 4);

    return {
        date: dateStr,
        month: monthYear
    };
}

function exitWithError(err) {
    console.log(err);
    process.exit();
}

function mysqlConnect(mysql) {
    // Create connection
    const db = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DATABASE  
    });

    // Connect
    db.connect((err) => {
        if (err) {
            console.log(err);
            process.exit();
        }
        //console.log(`MySql Connected ${process.env.DATABASE}`);
    });

    return db;
}