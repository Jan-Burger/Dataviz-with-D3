import React from 'react';
import { Row, Col } from 'antd';
import './App.less';

import { DatePicker, Space } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const customFormat = value => `custom format: ${value.format(dateFormat)}`;

const App = () => (
  <>
     <Row className="header" align="middle" justify="center">
      <Col span={5}>
          <RangePicker
          defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
          format={dateFormat}
          />
      </Col>
    </Row>
      <Row className="chart">
      <Col span={24}>col</Col>
    </Row>
  </>
);

export default App;