import React from 'react';
import moment, { Moment } from 'moment';
import { Badge, Calendar, Typography } from 'antd';

const { Text } = Typography;

interface EventData {
  type: 'success' | 'warning' | 'error';
  content: string;
}

const getListData = (value: Moment): EventData[] => {
  let listData: EventData[] = [];
  // Add your custom logic for event data based on the date here
  // Example: Fetch data from an API, etc.
  return listData;
};

const getMonthData = (value: Moment): number | null => {
  // Add your custom logic for month data here
  // Example: Fetch data from an API, etc.
  return null;
};

const AllCalendar: React.FC = () => {
  const monthCellRender = (value: Moment): React.ReactNode => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>
          <Text strong>{num}</Text>
        </section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Moment): React.ReactNode => {
    const listData = getListData(value);

    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: Calendar['dateCellRender'] = (current) => {
    const listData = getListData(current);
    const isToday = current.isSame(moment(), 'day');

    return (
      <div className={`date-cell ${isToday ? 'today' : ''}`}>
        <span className="date-number">{current.date()}</span>
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return <Calendar monthCellRender={monthCellRender} dateCellRender={cellRender} />;
};

export default AllCalendar;
