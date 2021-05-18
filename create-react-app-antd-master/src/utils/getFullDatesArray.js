
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
    newDateArr.forEach((date, index) => {

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
            close: newClosePriceArr[index],
            stockSymbol: arr[0].stockSymbol
        };

        resultArray.push(object);
    })

    return resultArray;
}

export default getFullDatesArray;