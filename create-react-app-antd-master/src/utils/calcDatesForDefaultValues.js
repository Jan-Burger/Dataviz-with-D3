

const calcDatesForDefaultValues = (rawData) => {

    let maxDates = [];
    let minDates = [];

    for (const [key, value] of Object.entries(rawData)) {
        //console.log(`${key}: ${value}`);
        let maxDate = rawData[key][rawData[key].length - 1]["date"];
        maxDates.push(new Date (maxDate));

        let minDate = rawData[key][0]["date"];
        minDates.push(new Date (minDate));
    }

    // convert timestamps back to date-string for further usage in states etc.
    let absMinDate = new Date (Math.max(...minDates));
    let absMaxDate = new Date (Math.min(...maxDates));


    return [absMinDate, absMaxDate];
};

export default calcDatesForDefaultValues;