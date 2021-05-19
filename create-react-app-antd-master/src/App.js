import React, {useState} from 'react';
import { Row, Col } from 'antd';
import './App.less';
import Chart from "./components/Chart";
import Header from "./components/Header";
import calcPercentage from "./utils/calcPercentage";
import getFullDatesArray from "./utils/getFullDatesArray";

const App = () => {

    // Declaring States
    const [startDate, setStartDate] = useState("2020-01-01");
    const [endDate, setEndDate] = useState("2020-12-31");
    const [them, setTheme] = useState();
    const [lineType, setLineType] = useState();
    const [stockXValues, setStockXValues] = useState();
    const [stockYValues, setStockYValues] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState();
    const [rawData, setRawData] = useState({});
    const [percentageData, setPercentageData] = useState({});


    // Fetching Stock Data from Alpha Vantage API
    async function fetchStockData (StockSymbol) {

        // Updating Error and Loading States
        setIsLoading(true);
        setError(null);

        // Declaring API Key & Stock Symbol
        const API_KEY = 'HGJWFG4N8AQ66ICD';
        //let StockSymbol = 'TSLA';

        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=full&apikey=${API_KEY}`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            // If no Error --> Data gets logged!
            const data = await response.json();
            console.log(data)

            let fetchedData = []

            // loop over json data and extract relevant values (date and closeprice)
            for (let key in data['Time Series (Daily)']) {

                let object = {
                    date: key,
                    close: data['Time Series (Daily)'][key]['4. close'],
                    stockSymbol: StockSymbol
                }
                fetchedData.push(object)

            }
            // Reverse Array to get correct order of dates
            let fetchedDataOrdered = [...fetchedData].reverse();
            // Replace missing date and price values for days like sat and sun
            let fetchedDataOrderedFullDatesArray = getFullDatesArray([...fetchedDataOrdered]);
            setData(fetchedDataOrderedFullDatesArray);

            // Create object and map stocksymbol to array
            let stockObjectRaw = {}
            stockObjectRaw[StockSymbol] = fetchedDataOrderedFullDatesArray;

            // update raw data
            setRawData( (prevState) => { return {...prevState, ...stockObjectRaw}});

            // update percentage data
            let fetchedDataOrderedFullDatesArrayPercentage = calcPercentage(startDate, endDate, fetchedDataOrderedFullDatesArray);

            // Create object and map stocksymbol to array
            let stockObjectPercent = {}
            stockObjectPercent[StockSymbol] = fetchedDataOrderedFullDatesArrayPercentage

            setPercentageData( (prevState) => { return {...prevState, ...stockObjectPercent}});

        } catch (error) {
              setError(error.message);
            }

        setIsLoading(false);
    };


    // Handler Functions when changing Start or EndDate in Datepicker etc.
    const onDateChange = (range) => {
        if (range){
            let startDate = range[0].format().slice(0, 10);
            let endDate = range[1].format().slice(0, 10);
            console.log(startDate, endDate)
            console.log(data)
            // Calc percentage of all stocks in raw data
            let percentageData = {};
            for (let key in rawData) {
                 percentageData[key] = calcPercentage(startDate, endDate, rawData[key])
            }
            console.log(percentageData)

            //let new_data = calcPercentage(startDate, endDate, data);
            //console.log(new_data)
            //setData(new_data);
        }
    };

    // Handle Remove Tag --> change Raw Data + percentage Data
    const onTagRemove = (removedTag) => {
        console.log(removedTag)

        // Update Raw Data
        let newRawData = {...rawData}
        delete newRawData[String(removedTag)];
        console.log(newRawData)
        setRawData(prevState => {return {...newRawData}})

        // Update Percentage Data
        let newPercentageData = {...percentageData}
        delete newPercentageData[String(removedTag)];
        console.log(newPercentageData)
        setPercentageData(prevState => {return {...newPercentageData}})

    };

    //console.log(stockXValues)
    //console.log(stockYValues)
    console.log(rawData)
    console.log(percentageData)


    return (
    <>
        <Row className="header" align="middle" justify="center">
            <Header
            dateChangeHandler = {onDateChange}
            fetchstockdata = {fetchStockData}
            onTagRemove = {onTagRemove}
            />
        </Row>

        <Row className="chart">
            <Chart
            startdate = {startDate}
            enddate = {endDate}
            data = {data}
            rawData = {rawData}
            percentageData = {percentageData}
            />
        </Row>
    </>
    );

};

export default App;
// idea --> dropdown to change stocks