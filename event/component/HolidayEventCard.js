import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ClassProfileButton from '../../classProfile/component/ClassProfileButton';
import colors from '../../../../config/colors';
import Language from '../../../../config/Language';

function HolidayEventCard({item}) {
  const sTime = item.start_time.split(':');
  const eTime = item.end_time.split(':');
  sTime.pop();
  eTime.pop();
  const startAmPm = sTime[0] < 12 && sTime[1] <= 59 ? 'AM' : 'PM';
  const endAmPm = eTime[0] < 12 && eTime[1] <= 59 ? 'AM' : 'PM';
  const startTime = sTime.join(':');
  const endTime = eTime.join(':');

  return (
    <View style={styles.cardContainer}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
        <Text style={styles.subtitleText}>{item.content}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
          }}>
          <ClassProfileButton
            iconImageSize={15}
            source={require('../../../../assets/ic_clock.png')}
            padding={7}
            iconColor={colors.greenIcon}
            backgroundColor={'#fef7db'}
          />
          <Text style={{color: '#5fab8f', flex: 1}}>
            {`${startTime} ${startAmPm} - ${endTime} ${endAmPm}`}
          </Text>
        </View>
      </View>
      <View style={styles.holidayTextContainer}>
        <Text style={{color: '#579699', textTransform: 'uppercase'}}>
          {Language.holiday}
        </Text>
      </View>
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
  cardContainer: {
    backgroundColor: '#fef7db',
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
  },
  titleText: {
    color: '#579699',
    fontFamily: 'Bariol-Bold',
    fontSize: 22,
  },
  subtitleText: {
    fontFamily: 'Bariol-Bold',
    color: '#5fab8f',
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  holidayTextContainer: {
    backgroundColor: '#f2eed5',
    justifyContent: 'flex-end',
    padding: 6,
    borderRadius: 13,
    width: 80,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});
export default HolidayEventCard;
