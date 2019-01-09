import React from 'react';
import styled from 'styled-components';
import dateFns from 'date-fns';
import PropTypes from 'prop-types';
import formatWithLocale from '../../helper/formatWithLocale';
import defaultTheme from '../../defaultTheme';
import {
  Col,
  Row,
} from './CalendarContainer';

const Number = styled.div`
  position: absolute;
  font-size: 82.5%;
  line-height: 1;
  top: .75em;
  right: .75em;
  font-weight: 700;
`;

Number.defaultProps = {
  theme: defaultTheme,
};

const Bg = styled.div`
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.mainColor};
  opacity: 0;
  font-size: 4em;
  position: absolute;
  top: -.2em;
  right: -.05em;
  transition: .25s ease-out;
  letter-spacing: -.07em;
`;

Bg.defaultProps = {
  theme: defaultTheme,
};

const DateRow = styled(Row)`
  .selected {
    border-left: 5px solid transparent;
    border-image: linear-gradient(45deg, #1a8fff 0%,#53cbf1 40%);
    border-image-slice: 1;
  }
  .selected ${Bg}{
    opacity: 0.5;
    color: black;
    transition: .5s ease-in;
  }
  .disabled{
    color:lightgray;
  }
`;

DateRow.defaultProps = {
  theme: defaultTheme,
};

const DateCol = styled(Col)`
  display: flex;
  flex-direction: column;

  .selected {
    border-left: 5px solid transparent;
    border-image: linear-gradient(45deg, #1a8fff 0%,#53cbf1 40%);
    border-image-slice: 1;
  }
  .selected ${Bg}{
    opacity: 0.5;
    color: black;
    transition: .5s ease-in;
  }
  .disabled{
    color:lightgray;
  }
`;

DateCol.defaultProps = {
  theme: defaultTheme,
};

const ItemContainer = styled(Col)`
  width: 100%;
  position: relative;
  height: 3em;
  min-height: 30px;
  border-right: 1px solid ${({ theme }) => theme.borderColor};
  overflow: hidden
  cursor: pointer;
  background: ${({ theme }) => theme.neutralColor};
  transition: 0.25s ease-out;
  
  &:hover{
    background: ${({ theme }) => theme.bgColor};
    transition: 0.5s ease-out;
  }
`;

ItemContainer.defaultProps = {
  theme: defaultTheme,
};

const Item = (props) => {
  const {
    value,
    className,
    onDateClick,
    showConfirmButton,
    formattedDate,
  } = props;

  const onDateClickHandler = () => {
    onDateClick(dateFns.parse(value), showConfirmButton);
  };

  return (
    <ItemContainer
      className={className}
      key={value}
      onClick={className !== 'disabled'
        ? onDateClickHandler
        : () => {}
      }
    >
      <Number>{formattedDate}</Number>
      <Bg>{formattedDate}</Bg>
    </ItemContainer>
  );
};

Item.propTypes = {
  value: PropTypes.instanceOf(Date).isRequired,
  className: PropTypes.string.isRequired,
  onDateClick: PropTypes.func.isRequired,
  showConfirmButton: PropTypes.bool.isRequired,
  formattedDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

const DateCell = ({
  selectedDate,
  view,
  itemPerRow,
  itemPerCol,
  onItemClick,
  showConfirmButton,
  dateFormat,
}) => {
  let className;
  let cloneDate;
  let formattedDate;

  switch (view) {
    case 'day': {
      const monthStart = dateFns.startOfMonth(selectedDate);
      const monthEnd = dateFns.endOfMonth(monthStart);
      const startDate = dateFns.startOfWeek(monthStart);
      const endDate = dateFns.endOfWeek(monthEnd);
      let row = [];
      const rows = [];

      cloneDate = startDate;
      let i;

      while (cloneDate <= endDate) {
        for (i = 0; i < itemPerRow; i += 1) {
          formattedDate = formatWithLocale(cloneDate, dateFormat);

          if (!dateFns.isSameMonth(cloneDate, monthStart)) {
            className = 'disabled';
          } else if (dateFns.isSameDay(cloneDate, selectedDate)) {
            className = 'selected';
          } else {
            className = '';
          }

          row.push(
            <Item
              className={className}
              key={cloneDate}
              value={cloneDate}
              formattedDate={formattedDate}
              onDateClick={onItemClick}
              showConfirmButton={showConfirmButton}
            />,
          );

          cloneDate = dateFns.addDays(cloneDate, 1);
        }
        rows.push(
          <DateRow key={cloneDate}>
            {row}
          </DateRow>,
        );
        row = [];
      }

      return (
        <Row>
          {rows}
        </Row>
      );
    }
    case 'week': {
      const startOfYear = dateFns.startOfYear(selectedDate);
      const endOfYear = dateFns.endOfYear(selectedDate);
      const startOfLastWeek = dateFns.startOfWeek(endOfYear);

      const cols = [];
      let col = [];
      let i;

      if (dateFns.getISOWeek(startOfYear) > 1) {
        cloneDate = dateFns.addWeeks(startOfYear, 1);
      } else {
        cloneDate = startOfYear;
      }

      while (cloneDate <= startOfLastWeek) {
        for (i = 0; i < itemPerCol && cloneDate <= startOfLastWeek; i += 1) {
          formattedDate = dateFns.getISOWeek(cloneDate);

          if (dateFns.isSameWeek(cloneDate, selectedDate)) {
            className = 'selected';
          } else {
            className = '';
          }

          col.push(
            <Item
              className={className}
              key={cloneDate}
              value={cloneDate}
              formattedDate={formattedDate}
              showConfirmButton={showConfirmButton}
              onDateClick={onItemClick}
            />,
          );

          cloneDate = dateFns.addWeeks(cloneDate, 1);
        }
        cols.push(
          <DateCol key={cloneDate}>
            {col}
          </DateCol>,
        );
        col = [];
      }

      return (
        <Row>
          {cols}
        </Row>
      );
    }
    case 'month': {
      const startOfYear = dateFns.startOfYear(selectedDate);
      const endOfYear = dateFns.endOfYear(selectedDate);
      const cols = [];

      let col = [];

      cloneDate = startOfYear;

      while (cloneDate < endOfYear) {
        for (let i = 0; i < itemPerCol && cloneDate < endOfYear; i += 1) {
          formattedDate = formatWithLocale(cloneDate, 'MM');

          if (dateFns.isSameMonth(cloneDate, selectedDate)) {
            className = 'selected';
          } else {
            className = '';
          }

          col.push(
            <Item
              className={className}
              key={cloneDate}
              value={cloneDate}
              formattedDate={formattedDate}
              showConfirmButton={showConfirmButton}
              onDateClick={onItemClick}
            />,
          );
          cloneDate = dateFns.addMonths(cloneDate, 1);
        }

        cols.push(
          <DateCol key={cloneDate}>
            {col}
          </DateCol>,
        );
        col = [];
      }
      return (
        <Row>
          {cols}
        </Row>
      );
    }
    default: {
      return undefined;
    }
  }
};
export default DateCell;