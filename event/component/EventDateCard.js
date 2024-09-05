import moment from 'moment';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {getDateDisplayText} from '../Utility/methods';

import colors from '../../../../config/colors';

function EventDateCard({date}) {
  const dateObj = new Date(date);
  const inputDate = moment(dateObj);
  const formattedDate = inputDate.format('MMMM D - dddd');
  const displayText = getDateDisplayText(date);

  return (
    <View style={styles.EventDateContainer}>
      <Text style={styles.dateTitleText}>{displayText}</Text>
      <Text style={styles.dateText}>{formattedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  EventDateContainer: {
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.backgroundColor,
    borderRadius: 10,
    padding: 10,
  },
  dateTitleText: {
    color: colors.textColorPrimary,
    fontFamily: 'Bariol-Bold',
  },
  dateText: {
    fontFamily: 'Bariol-Bold',
    fontSize: 22,
    color: colors.backgroundColor,
    marginTop: 2,
  },
});
export default EventDateCard;
