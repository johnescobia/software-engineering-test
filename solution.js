const { spawn } = require('child_process');

const sensor = spawn('python', ['seed.py']);
sensor.stdout.on('data', function(data) {
    
    // Store seed.py output as string and remove unnecessary characters
    let strDateTime = String(data).replace(/]|'|\[|\n/g,'');
    strDateTime = strDateTime.replace(/, /g,',');
    
    // Store date and time to array
    const dateTime = strDateTime.split(',');

    // Display dates from seed.py
    const datesDisplay = dateTime.map(s => new Date(s));
    console.log('INPUT\n')
    console.log(datesDisplay, '\n');
    
    // Remove time
    const dates = dateTime.map(s => new Date(s.slice(0,10)));

    // Sort dates in ascending order
    const sortedDates = dates.sort((a, b) => a - b);

    // Remove repeating dates
    const uniqueDates = sortedDates
                        .map(function (date) { return date.getTime() })
                        .filter(function (date, i, array) {
                            return array.indexOf(date) === i;
                        })
                        .map(function (time) { return new Date(time); });

    // Count consecutive days
    let startDate = uniqueDates[0];
    let count = 1;
    let result = [];

    for (let i = 1; i <= uniqueDates.length; i++) {
        const endDate = uniqueDates[i-1];
        const currDate = uniqueDates[i];
        const difference = Math.floor((currDate - endDate) / 86400000);

        if (difference === 1) {
            count++;
        } else {
            count === 1 ? result.push({startDate: startDate, endDate: startDate, length: count}) :
                          result.push({startDate: startDate, endDate: endDate, length: count})
            startDate = currDate;
            count = 1;
        }
    }

    // Sort according to amount of consecutive days
    result = result.sort((a, b) => b.length - a.length);

    // Display header
    console.log('OUTPUT\n')
    console.log('   START         END         LENGTH');

    // Log to debug
    for (let i = 0; i < result.length; i++) {
        const strStart = formatDate(result[i].startDate);
        const strEnd = formatDate(result[i].endDate);

        // Display
        console.log(strStart, '  ', strEnd, '     ', result[i].length);
    }
});

// Return date in yyyy-mm-dd format
function formatDate(date) {
    const formatedDate = date.getFullYear() + '-'
                         + ('0' + (date.getMonth()+1)).slice(-2) + '-'
                         + ('0' + date.getDate()).slice(-2);

    return formatedDate;
}
