// 1.  Input: startdatum enddatum [{date: 1999-10-10, price: 200.56}, {}, {}]
// 2.  Output: [{date: startdatum, price: 0}, .... ,{date: enddatum, price: 50}]
// Datum und Stock in String, muss umgewandelt werden
// Überprüfen, ob nur ein Stock angezeigt wird

// Check if range startdatum - enddatum in arr --> console.log asdfdasf

const data =[
    {date: "1959-10-10", price: "200.56"},
    {date: "1999-10-11", price: "202.56"},
    {date: "1999-10-12", price: "198.56"},
    {date: "1999-10-13", price: "206.56"},
    {date: "1999-10-14", price: "208.56"},
    {date: "1999-10-15", price: "211.56"},
]

const calc_percentage = (startdatum, enddatum, Arr) => {
    const percentage_Arr = []
    let datum1 = false
    let index1 = 0
    let datum2 = false
    let index2 = 0
    let sliced_Array =[]
    let percent = 0
    let new_date = ""
    let new_startdatum = new Date(startdatum).toISOString().slice(0,10)
    let new_enddatum = new Date(enddatum).toISOString().slice(0,10)

    for (i = 0; i < Arr.length; i++) {
        if (Arr[i].date === new_startdatum){

            datum1 = true
            index1 = i

        }
        if (Arr[i].date === new_enddatum){
            datum2 = true
            index2 = i

        }
    }

    if (datum1 === true && datum2 === true){

        sliced_Array = Arr.slice(index1, index2 + 1)


    }
    else {
        return console.log("Fehler")

}
    for (i = 0; i < sliced_Array.length; i++) {
        if(sliced_Array[i].date){
            let date = sliced_Array[i].date
            new_Date = new Date(date).toISOString().slice(0,10)


    }
        if (sliced_Array[i].price){

            percent = (sliced_Array[i].price - sliced_Array[0].price) / sliced_Array[0].price * 100

        }
        const obj = {datum: new_Date, price: percent}
        percentage_Arr.push(obj)
    }

return percentage_Arr



}

let x = calc_percentage("202020-10-11", "1999-10-14", data )
console.log(x)

