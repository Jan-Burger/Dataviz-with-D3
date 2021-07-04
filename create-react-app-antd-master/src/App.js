import React, {useState} from 'react';
import { Row, Col } from 'antd';
import './App.less';
import Chart from "./components/Chart";
import Sidebar from "./components/Sidebar";
import calcPercentage from "./utils/calcPercentage";
import getFullDatesArray from "./utils/getFullDatesArray";
import calcDatesForDefaultValues from "./utils/calcDatesForDefaultValues";
import { Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faBars, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { LineOutlined, StockOutlined, LineChartOutlined } from '@ant-design/icons';

// https://stackoverflow.com/questions/60091618/react-daterangepicker-mobile-friendly
const App = () => {

    // Declaring States
    const [startDate, setStartDate, startDateRef] = useState("");
    const [endDate, setEndDate] = useState("");
    const [theme, setTheme] = useState("Light");
    const [lineType, setLineType] = useState();
    //const [stockXValues, setStockXValues] = useState();
    //const [stockYValues, setStockYValues] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState();
    const [rawData, setRawData] = useState({});
    const [percentageData, setPercentageData] = useState({});
    // Mobile Side nav toggler
    const [menuIsActive, setMenuIsActive] = useState(false);
    // Legend state with current stocks selected
    const [legend, setLegend] = useState({});
    const [colors, setColors] = useState([ "#DFE6ED", "#bac4ce", "#57697A", "#7EC433"]);
    // Min Max Daterange state
    const [minDate, setMinDate] = useState();
    const [maxDate, setMaxDate] = useState();
    // Dropdown value for default date range
    const [defaultDateRangeDropdownValue, setDefaultDateRangeDropdownValue] = useState("Last 3 Month");


    // Menu Toggle Handler
    const menuToggler = () => {
        // set MenuIsActive to the opposite state from previous --> this toggles the menu on and off
        setMenuIsActive((prevState) => {return !menuIsActive})
    }

    // Update Legend with new stock ticker symbols if new stocks are selected in the sidebar
    const updateLegend = (newTickerSymbol, tags) => {
        // Check if length of new Ticker symbol is at least 1
        if (newTickerSymbol.length > 0 && !tags.includes(newTickerSymbol)) {

            // Set nextColor to an empty string
            let nextColor = ""

            // Loop over all predefined colors in color-state
            colors.some((color) => {
                //console.log(color)
                //console.log(legend)
                //console.log(Object.values(legend))

                // If a color from the colors-array does not exist in the legend object --> nextColor will be set to the value of the current color in the array
                if (!(Object.values(legend).includes(color))) {
                    console.log("Condition True")
                    nextColor = color
                    return false
                }
            })
            // Update the sate of the legend key = new ticker symbol, value = value of nextColor
            setLegend((prevState => {
                return {...prevState, [newTickerSymbol]: nextColor}
            }));
        }
    };

    // Delete Ticker symbol from legend if the tag was removed in the sidebar
    const deleTSFromLegend = (removedTag) => {
        //console.log(removedTag);
        // Get the current values from the legend
        let newLegend = {...legend};
        // Delete the value in the legend object that was selected in the sidebar
        delete newLegend[removedTag];
        // Update the legend values
        setLegend((prevState) => { return newLegend});
    };


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
            console.log(fetchedDataOrdered);
            // Replace missing date and price values for days like sat and sun
            let fetchedDataOrderedFullDatesArray = getFullDatesArray([...fetchedDataOrdered]);
            setData(fetchedDataOrderedFullDatesArray);

            // Create object and map stocksymbol to array
            let stockObjectRaw = {};
            stockObjectRaw[StockSymbol] = fetchedDataOrderedFullDatesArray;

            // update raw data
            setRawData( (prevState) => { return {...prevState, ...stockObjectRaw}});

            let dates = calcDatesForDefaultValues({...rawData, ...stockObjectRaw});
            let newminDate = dates[0];
            let newmaxDate = dates[1];
            console.log(newminDate, newmaxDate);
            console.log("this is a loooooooooooooooooooooooooooooooooooooooooooong test");
            setMaxDate(newmaxDate);
            setMinDate(newminDate);

            // update percentage data
            let fetchedDataOrderedFullDatesArrayPercentage = calcPercentage(startDate, endDate, fetchedDataOrderedFullDatesArray);

            // Check if it is the first stock being selected and set start and end date accordingly
            if (Object.keys({...rawData, ...stockObjectRaw}).length === 1){
                let newStartDate = new Date();
                newStartDate = new Date (newStartDate.setDate(newmaxDate.getDate() - 90)).toISOString().slice(0, 10);
                let newEndDate = newmaxDate.toISOString().slice(0, 10);
                setStartDate(newStartDate);
                setEndDate(newEndDate);

                // update percentage data
                fetchedDataOrderedFullDatesArrayPercentage = calcPercentage(newStartDate, newEndDate, fetchedDataOrderedFullDatesArray);
            }



            // Create object and map stocksymbol to array
            let stockObjectPercent = {}
            stockObjectPercent[StockSymbol] = fetchedDataOrderedFullDatesArrayPercentage

            setPercentageData( (prevState) => { return {...prevState, ...stockObjectPercent}});
            // calculate the min max values and set them as a state




        } catch (error) {
              setError(error.message);
            }

        setIsLoading(false);
    };

    //TODO: Synchronize default date range with date range picker --> start date default date etc.

    // Handler Functions when changing Start or EndDate in Datepicker etc.
    const onDateChange = (range) => {
        if (range){
            let startDate = range[0].format().slice(0, 10);
            let endDate = range[1].format().slice(0, 10);
            console.log(startDate, endDate)
            console.log(data)

            // Calc percentage of all stocks in raw data
            let newPercentageData = {};
            for (let key in rawData) {
                 newPercentageData[key] = calcPercentage(startDate, endDate, rawData[key])
            }
            console.log(percentageData)
            console.log(rawData)

            // Update the states percentage data, start date and end date
            setPercentageData((prevSate) => {return newPercentageData});
            if (!(Object.keys(rawData).length === 0 && rawData.constructor === Object)){
                setStartDate(startDate);
                setEndDate(endDate);
            }

            // Update Default Date Range to show Custom Range has been selected
            setDefaultDateRangeDropdownValue("Custom Range Selected");

            //let new_data = calcPercentage(startDate, endDate, data);
            //console.log(new_data)
            //setData(new_data);
        }
    };

    const onDefaultDateChange = (selectedValue) => {

        // Check if data exists --> check whether rawData length is not 0
        if (!(Object.keys(rawData).length === 0 && rawData.constructor === Object)) {
            let dates = calcDatesForDefaultValues(rawData);
            let minDate = dates[0];
            let maxDate = dates[1];
            console.log(minDate, maxDate);

            // Check which value was selected by the user --> Do correct calculations for start date and end date
            if (selectedValue === "Last Week") {
                // Calculate new stat date and end date based on the use input of the default date range
                console.log(startDate, typeof endDate);
                let newStartDate = new Date();
                newStartDate = new Date (newStartDate.setDate(maxDate.getDate() - 7)).toISOString().slice(0, 10);
                let newEndDate = maxDate.toISOString().slice(0, 10);
                console.log(newStartDate, newEndDate);

                // Calculate new values for percentage data
                let newPercentageData = {};
                for (let key in rawData) {
                     newPercentageData[key] = calcPercentage(newStartDate, newEndDate, rawData[key])
                }

                // Update states: start date, end date, percentage data, dropdown value
                setPercentageData((prevSate) => {return newPercentageData});
                setStartDate(newStartDate);
                setEndDate(newEndDate);
                setDefaultDateRangeDropdownValue("Last Week");
            }
            if (selectedValue === "Last 30 Days") {
                // Calculate new stat date and end date based on the use input of the default date range
                let newStartDate = new Date();
                newStartDate = new Date (newStartDate.setDate(maxDate.getDate() - 30)).toISOString().slice(0, 10);
                let newEndDate = maxDate.toISOString().slice(0, 10);

                // Calculate new values for percentage data
                let newPercentageData = {};
                for (let key in rawData) {
                     newPercentageData[key] = calcPercentage(newStartDate, newEndDate, rawData[key])
                }

                // Update states: start date, end date, percentage data, dropdown value
                setPercentageData((prevSate) => {return newPercentageData});
                setStartDate(newStartDate);
                setEndDate(newEndDate);
                setDefaultDateRangeDropdownValue("Last 30 Days");
            }
            if (selectedValue === "Last 3 Month") {
                // Calculate new stat date and end date based on the use input of the default date range
                let newStartDate = new Date();
                newStartDate = new Date (newStartDate.setDate(maxDate.getDate() - 90)).toISOString().slice(0, 10);
                let newEndDate = maxDate.toISOString().slice(0, 10);

                // Calculate new values for percentage data
                let newPercentageData = {};
                for (let key in rawData) {
                     newPercentageData[key] = calcPercentage(newStartDate, newEndDate, rawData[key])
                }

                // Update states: start date, end date, percentage data, dropdown value
                setPercentageData((prevSate) => {return newPercentageData});
                setStartDate(newStartDate);
                setEndDate(newEndDate);
                setDefaultDateRangeDropdownValue("Last 3 Month");
            }
            if (selectedValue === "Last Year") {
                // Calculate new stat date and end date based on the use input of the default date range
                let newStartDate = new Date();
                newStartDate = new Date (newStartDate.setDate(maxDate.getDate() - 365)).toISOString().slice(0, 10);
                let newEndDate = maxDate.toISOString().slice(0, 10);

                // Calculate new values for percentage data
                let newPercentageData = {};
                for (let key in rawData) {
                     newPercentageData[key] = calcPercentage(newStartDate, newEndDate, rawData[key])
                }

                // Update states: start date, end date, percentage data, dropdown value
                setPercentageData((prevSate) => {return newPercentageData});
                setStartDate(newStartDate);
                setEndDate(newEndDate);
                setDefaultDateRangeDropdownValue("Last Year");
            }
            if (selectedValue === "Max") {
                // Calculate new stat date and end date based on the use input of the default date range
                let newStartDate = minDate.toISOString().slice(0, 10);
                let newEndDate = maxDate.toISOString().slice(0, 10);
                console.log(newStartDate, newEndDate);

                // Calculate new values for percentage data
                let newPercentageData = {};
                for (let key in rawData) {
                    newPercentageData[key] = calcPercentage(newStartDate, newEndDate, rawData[key])
                }
                console.log(newPercentageData);
                // Update states: start date, end date, percentage data, dropdown value
                setPercentageData((prevSate) => {return newPercentageData});
                setStartDate(newStartDate);
                setEndDate(newEndDate);
                setDefaultDateRangeDropdownValue("Max");

            }
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

        // Set new min, max values for daterange
        let dates = calcDatesForDefaultValues(newRawData);
        let newminDate = dates[0];
        let newmaxDate = dates[1];
        console.log(newminDate, newmaxDate);
        console.log("this is a loooooooooooooooooooooooooooooooooooooooooooong test");
        if (!(Object.keys(newRawData).length === 0 && newRawData.constructor === Object)){
            setMaxDate(newmaxDate);
            setMinDate(newminDate);
        }else {
            setMaxDate();
            setMinDate();
            setStartDate("");
            setEndDate("");
            setDefaultDateRangeDropdownValue("Last 3 Month");
        }


        // Update Percentage Data
        let newPercentageData = {...percentageData}
        delete newPercentageData[String(removedTag)];
        console.log(newPercentageData)
        setPercentageData(prevState => {return {...newPercentageData}})

    };

    //console.log(stockXValues)
    //console.log(stockYValues)
    console.log(rawData);
    console.log(percentageData);
    console.log("Legend data:", legend);




    return (
    <div className="container">
        <div className={`overlay ${menuIsActive ? "overlay-active" : ""}`}onClick={menuToggler} ></div>

        <div className={`nav-sidebar ${menuIsActive ? "nav-active" : "nav-active-remove"}`}>
            <div className="nav-sidebar-logo-area">

            </div>
            <div className="nav-sidebar-navigation-area">
                <Sidebar
                defaultDateRangeDropdownValue = {defaultDateRangeDropdownValue}
                minDate = {minDate}
                maxDate = {maxDate}
                startDate = {startDate}
                endDate = {endDate}
                onDefaultDateChange = {onDefaultDateChange}
                legend = {legend}
                colors = {colors}
                deleteTSFromLegend = {deleTSFromLegend}
                updateLegend = {updateLegend}
                dateChangeHandler = {onDateChange}
                fetchstockdata = {fetchStockData}
                onTagRemove = {onTagRemove}
                />
            </div>
        </div>

        <div className="nav-top">
            <div onClick={menuToggler} className="nav-top-menu-icon-area">
                <FontAwesomeIcon icon={faBars} className="menu-icon" />
            </div>
            <div className="legend">
                {Object.keys(legend).map((key) => <span style={{color: legend[key]}}><StockOutlined className="nav-top-legend-icon"/>{key}</span>)}
            </div>
        </div>

        <div className="content">
            <Chart
            legend = {legend}
            startdate = {startDate}
            enddate = {endDate}
            data = {data}
            rawData = {rawData}
            percentageData = {percentageData}
            />
        </div>

        <div className="footer">

        </div>
    </div>
    );
};

export default App;
// idea --> dropdown to change stocks




