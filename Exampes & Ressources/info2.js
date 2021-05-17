
const data = [
    {date: "1999-01-01", price: 200},
    {date: "1999-01-02", price: 201},
    {date: "1999-01-03", price: 210},
    {date: "1999-01-04", price: 210},
    {date: "1999-01-05", price: 500},
    {date: "1999-01-06", price: 100},
    {date: "1999-01-07", price: 367}
];


const calcPercentage = (start, end, arr) => {

    // check if startdate and enddate are in range of the data
    const found_start = arr.some(el => el.date === start);
    const found_end = arr.some(el => el.date === end);

    if (!found_start || !found_end){
        return console.log("dates not in range --> give user feedback")
    }

    let startIndex = arr.findIndex(element => element.date === start);
    let endIndex = arr.findIndex(element => element.date === end);

    let sliced_arr = arr.slice(startIndex, endIndex + 1);

    let new_arr = [];

    sliced_arr.forEach((element, index, array) => {

        let date = element.date
        let price = null

        if (index === 0){
            price = 0
        } else {
            price = (element.price - array[0].price) / array[0].price * 100
        }

        let object = {
            date: date,
            price: price
        }
        new_arr.push(object)
    })

    return new_arr;
};

console.log(calcPercentage("1999-01-03", "1999-01-07", data))

