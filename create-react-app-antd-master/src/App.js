import React, {useState} from 'react';
import { Row, Col } from 'antd';
import './App.less';
import Chart from "./components/Chart";
import Header from "./components/Header";

const App = () => {

    // Declaring States
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [them, setTheme] = useState();
    const [lineType, setLineType] = useState();
    const [stockXValues, setStockXValues] = useState();
    const [stockYValues, setStockYValues] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetching Stock Data from Alpha Vantage API
    async function fetchStockData () {

        // Updating Error and Loading States
        setIsLoading(true);
        setError(null);

        // Declaring API Key & Stock Symbol
        const API_KEY = 'HGJWFG4N8AQ66ICD';
        let StockSymbol = 'FB';

        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=compact&apikey=${API_KEY}`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            // If no Error --> Data gets logged!
            const data = await response.json();
            let stocktXValuesFetched = [];
            let stockYValuesFetched = [];

            // loop over json data and extract relevant values (date and closeprice)
            for (let key in data['Time Series (Daily)']) {
                    stocktXValuesFetched.push(key);
                    stockYValuesFetched.push(data['Time Series (Daily)'][key]['4. close']);
            }

            // Update the State of x and y values (copy Array with spread operator)
            setStockXValues([...stocktXValuesFetched])
            setStockYValues([...stockYValuesFetched])

        } catch (error) {
              setError(error.message);
            }

        setIsLoading(false);
    };


    // Handler Functions when changing Start or EndDate in Datepicker etc.
    const onDateChange = (range) => {
        console.log(range[0].format());
        console.log(range[1].format());
    };

    console.log(stockXValues)
    //console.log(stockYValues)


    return (
    <>
        <Row className="header" align="middle" justify="center">
            <Header
            dateChangeHandler = {onDateChange}
            fetchstockdata = {fetchStockData}
            />
        </Row>

        <Row className="chart">
            <Chart
            startdate = {startDate}
            enddate = {endDate}
            xvalues = {stockXValues}
            yvalues = {stockYValues}
            />
        </Row>
    </>
    );

};

export default App;
// idea --> dropdown to change stocks