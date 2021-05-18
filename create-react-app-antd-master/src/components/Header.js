import React from "react";
import {Col, Row} from "antd";
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import EditableTagGroup from "./Tags";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
const customFormat = value => `custom format: ${value.format(dateFormat)}`;


const Header = (props) => {



    return(
        <>
        <Col span={5}>
            <RangePicker
            defaultValue={[moment('2021/01/01', dateFormat), moment('2021/01/10', dateFormat)]}
            format={dateFormat}
            onChange={props.dateChangeHandler}
            />
        </Col>
        <button onClick={props.fetchstockdata}>Fetch Data!</button>
            <EditableTagGroup
            fetchstockdata = {props.fetchstockdata}
            onTagRemove = {props.onTagRemove}
            />
        </>
    );
};

export default Header;