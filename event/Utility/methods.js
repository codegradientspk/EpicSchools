import moment from 'moment';
export function getDateDisplayText(date) {
  const dateObj = new Date(date);
  const currentDate = moment();

  const inputDate = moment(dateObj);

  const diffDays = currentDate.diff(inputDate, 'days');
  const diffWeeks = currentDate.diff(inputDate, 'weeks');
  const diffMonths = currentDate.diff(inputDate, 'months');
  const diffYears = currentDate.diff(inputDate, 'years');

  let displayText = '';

  if (diffDays > 1) {
    if (diffWeeks === 0) {
      if (inputDate.isSame(new Date(), 'week')) {
        displayText = 'Last Week';
      } else {
        displayText = 'In previous weeks';
      }
    } else if (diffWeeks === 1) {
      displayText = 'In previous weeks';
    } else if (diffWeeks > 1) {
      if (diffMonths === 0) {
        if (inputDate.isSame(new Date(), 'year')) {
          if (inputDate.isSame(new Date(), 'month')) {
            displayText = 'In previous weeks';
          } else {
            displayText = 'Last Month';
          }
        } else if (diffYears === 0 || diffYears === 1) {
          displayText = 'Last Year';
        } else {
          displayText = 'In Previous Years';
        }
      } else if (diffMonths === 1) {
        if (inputDate.isSame(new Date(), 'year')) {
          displayText = 'Last Month';
        } else if (diffYears === 0 || diffYears === 1) {
          displayText = 'Last Year';
        } else {
          displayText = 'In Previous Years';
        }
      } else if (diffMonths > 1) {
        if (inputDate.isSame(new Date(), 'year')) {
          displayText = 'In Previous Months';
        } else if (diffYears === 0 || diffYears === 1) {
          displayText = 'Last Year';
        } else {
          displayText = 'In Previous Years';
        }
      }
    }
  } else if (inputDate.isSame(new Date(), 'day')) {
    displayText = 'Today';
  } else if (diffDays === 1) {
    displayText = 'Yesterday';
  } else {
    displayText = 'Upcoming';
  }
  console.log(date, displayText, diffDays, diffMonths, diffWeeks, diffYears);
  return displayText;
}
