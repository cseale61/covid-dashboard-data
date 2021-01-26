require('dotenv').config();
const mysql  = require('mysql');
const http   = require('axios');
const util   = require('util');

// Get load type from command line
let type = process.argv[2];

// Default load type will be daily, so test for undefined.
if (typeof type === "undefined") {
    type = 'daily';
} 

const loadType  = type;
const db        = mysqlConnect(mysql);
const query     = util.promisify(db.query).bind(db);

loadData();

async function loadData() {

    let data = [];
    let clearData = null;

    if (loadType === 'full') {

        clearData = await clearTable();
        url = `https://api.covidtracking.com/v1/us/daily.json`;

    } else {

        url = `https://api.covidtracking.com/v1/us/current.json`;

    }

    data = await http.get(url);

    if (loadType === 'daily') {

        let lastUpdate = await checkLastUpdate();

        if(formatDate(data.data[0].date) === lastUpdate) {
            console.log('Data is current, no update necessary');
            process.exit();
        }

    }

    let results = await loadTotals(data.data);

    console.log(results);
    process.exit();

};

async function loadTotals(cdata) {

    let data = [];
    let date = null;
    let month = null;
    let dateInfo = null;

    for(let i = 0; i < cdata.length; i++) {

        dateInfo = await formatDate(cdata[i].date);
        date = dateInfo.date;
        month = dateInfo.month;
        
        data[i] = [
            date,
            month,
            cdata[i].totalTestResults,
            cdata[i].negative,
            cdata[i].positive,
            cdata[i].positiveIncrease,
            cdata[i].hospitalizedCurrently,
            cdata[i].inIcuCurrently,
            cdata[i].death,
            cdata[i].deathIncrease
        ];
    }

    let sql = "INSERT INTO us_covid_totals ( \
                    date, \
                    month_year, \
                    total_tests, \
                    negative_results, \
                    positive_results, \
                    positive_increase, \
                    hospitalized, \
                    icu, \
                    deaths, \
                    death_increase \
               ) VALUES ?";

    try {

        let rows = await query(sql, [data]);
        return 'Upate complete!';
    
    } catch(err) {
        exitWithError(err);
    }

}

async function clearTable() {

    let sql = 'DELETE FROM us_covid_totals';
    try {

        await query(sql);
        return 'Table has been cleared.';
    
    } catch(err) {
        exitWithError(err);
    }

}

async function checkLastUpdate() {

    let sql = 'SELECT date FROM us_covid_totals ORDER BY date DESC LIMIT 1';
    try {

        let lastUpdate = await query(sql);
        return lastUpdate[0].date;
    
    } catch(err) {
    
        return '0000-00-00';
    
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
            throw err;
        }
    });

    return db;
}