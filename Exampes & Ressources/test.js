const data = [
    {date: "1999-01-01", close: 200},
    {date: "1999-01-02", close: 201},
    {date: "1999-01-03", close: 210},
    {date: "1999-01-04", close: 210},
    {date: "1999-01-05", close: 500},
    {date: "1999-01-06", close: 100},
    {date: "1999-01-07", close: 367}
];


//var startDate = new Date("2017-10-01"); //YYYY-MM-DD
//var endDate = new Date("2017-10-07"); //YYYY-MM-DD

const getFullDatesArray = (arr) => {

    // Create a Date Array with one Date for each day in the range of startDate - endDate
    const startDate = new Date(arr[0].date);
    const endDate = new Date(arr[arr.length -1].date);
    let newDateArr = [];
    let dt = new Date(startDate);
    while (dt <= endDate) {
        newDateArr.push(new Date(dt).toISOString().slice(0,10));
        dt.setDate(dt.getDate() + 1);
    }

    // calculate new closePrices for each day in the date Array
    let newClosePriceArr = [];
    newDateArr.forEach((date, index, array) => {
        // check if newDate is already in array --> if yes, just append the to already existing closeprice to the newClosePrice Array
        if (arr.some(el => el.date === date)){
            let closePriceIndex = arr.findIndex(element => element.date === date);
            newClosePriceArr.push(arr[closePriceIndex].close);
        }else {
            //let closePriceIndex = arr.findIndex(element => element.date === date)
            newClosePriceArr.push(newClosePriceArr[index - 1]);
        }
    })

    // combine Date Array and closePrice Array to one Array with Objects
    let resultArray = [];
    newDateArr.forEach((date, index) => {

        let object = {
            date: date,
            close: newClosePriceArr[index]
        };

        resultArray.push(object);
    })

    return resultArray;
}

console.log(getFullDatesArray(data));