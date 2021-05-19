
const calcPercentage = (start, end, arr) => {

    console.log(start, end, arr)
    // check if startdate and enddate are in range of the data
    const found_start = arr.some(el => el.date === start);
    const found_end = arr.some(el => el.date === end);
    console.log(found_start, found_end);

    if (!found_start || !found_end){
        return console.log("dates not in range --> give user feedback --> UI manipulation")
    }

    let startIndex = arr.findIndex(element => element.date === start);
    let endIndex = arr.findIndex(element => element.date === end);
    console.log(startIndex, endIndex);

    let sliced_arr = arr.slice(startIndex, endIndex + 1);
    console.log(sliced_arr)

    let new_arr = [];

    sliced_arr.forEach((element, index, array) => {

        let date = element.date
        console.log(parseFloat(element.close))

        let closePrice = (parseFloat(element.close) - parseFloat(array[0].close)) / parseFloat(array[0].close) * 100

        let object = {
            date: date,
            close: closePrice,
            stockSymbol: arr[0].stockSymbol
        }

        new_arr.push(object)
    })

    return new_arr;
};

export default calcPercentage;

