import React, {useState} from 'react';
import {Col, Row} from "antd";
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import EditableTagGroup from "./Tags";
import { Button } from 'antd';
import { Tooltip } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faBars, faCalendarWeek, faTag, faAdjust, faCalendarDay, faSun, faMoon, faInfoCircle, faInfo} from '@fortawesome/free-solid-svg-icons'
import { Select } from 'antd';

const { Option } = Select;



const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const customFormat = value => `custom format: ${value.format(dateFormat)}`





const Sidebar = (props) => {

    // Set States for Sidebar Components
    const [theme, setTheme] = useState("Light");

    const themeToggler = (newTheme) => {
        console.log(newTheme.currentTarget.getAttribute("data-value"))
        setTheme(newTheme.currentTarget.getAttribute("data-value"));
    };

    function handleSelectChange(value) {
      console.log(`selected ${value}`);
      props.onDefaultDateChange(value);
    }

    const disableDates = (currentDate) => {
        console.log(props.maxDate, props.minDate);
        if (!(props.maxDate == null) && !(props.minDate == null)){
            let start = moment(props.minDate.toISOString().slice(0, 10), "YYYY-MM-DD");
            let end = moment (props.maxDate.toISOString().slice(0, 10), "YYYY-MM-DD");
            console.log(currentDate);
            console.log(start, end);
            console.log(start <= currentDate && end >= currentDate)
            return start > currentDate || end < currentDate;

        }

    }


    return(
        <>
            <div className="sidebar-dateselector-section">
                <p className="sidebar-section-headline"><FontAwesomeIcon icon={faCalendarWeek} className="sidebar-section-headline-icon"/>Default Date Range</p>
                <Select defaultValue="Last 30 Days" style={{ width: "100%" }} onChange={handleSelectChange}>
                    <Option value="Last Week">Last Week</Option>
                    <Option value="Last 30 Days">Last 30 Days</Option>
                    <Option value="Last 3 Month">Last 3 Month</Option>
                    <Option value="Last Year">Last Year</Option>
                    <Option value="Max">Max</Option>
                </Select>
            </div>
            <div className="sidebar-datepicker-section">
                <p className="sidebar-section-headline"><FontAwesomeIcon icon={faCalendarDay} className="sidebar-section-headline-icon"/>Date Range Picker</p>
                <RangePicker
                value={(!(props.startDate.length === 0) && !(props.endDate.length === 0)) ? [moment(props.startDate, "YYYY-MM-DD"), moment(props.endDate, "YYYY-MM-DD")] : [null, null] }
                format={dateFormat}
                onChange={props.dateChangeHandler}
                disabledDate = {disableDates}
                />
            </div>
            <div className="sidebar-taggroup-section">
                <p className="sidebar-section-headline"><FontAwesomeIcon icon={faTag} className="sidebar-section-headline-icon"/>
                Stock Ticker Symbol
                <Tooltip title="Choose a stock by typing in it's Ticker Symbol. For example use MSFT for the company Microsoft." color="#DFE6ED" overlayInnerStyle={{color: "#57697A"}}>
                    <span><FontAwesomeIcon icon={faInfoCircle} className="sidebar-section-headline-icon-info"/></span>
                </Tooltip>
                </p>
                <EditableTagGroup
                setLegend = {props.setLegend}
                legend = {props.legend}
                colors = {props.colors}
                deleteTSFromLegend = {props.deleteTSFromLegend}
                updateLegend = {props.updateLegend}
                fetchstockdata = {props.fetchstockdata}
                onTagRemove = {props.onTagRemove}
                />
            </div>
            <div className="sidebar-theme-section">
                <p className="sidebar-section-headline"><FontAwesomeIcon icon={faAdjust} className="sidebar-section-headline-icon"/>Choose Theme Settings</p>
                <div className="theme-button-grid">
                    <div className="theme-button-container">
                        <Button onClick={themeToggler} data-value="Light" type = {(theme === "Light" ? "primary" : "")}><FontAwesomeIcon icon={faSun} className="sidebar-section-theme-icon"/>Light</Button>
                        <Button onClick={themeToggler} data-value="Dark" type = {(theme === "Dark" ? "primary" : "")}><FontAwesomeIcon icon={faMoon} className="sidebar-section-theme-icon"/>Dark</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
