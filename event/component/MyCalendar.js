import React from 'react';
import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';
import {Calendar} from 'react-native-calendars';
import ClassProfileButton from '../../classProfile/component/ClassProfileButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {appNavigatorIDS} from '../../../../config/Enum';
import {localStorageEnum} from '../../../../config/Enum';
import colors from '../../../../config/colors';
import moment from 'moment';
function MyCalendar({
  error,
  onDayPress,
  onMonthChange,
  markedDates,
  createIconVisible,
  multidot = true,
}) {
  const navigation = useNavigation();
  const diff = Dimensions.get('window').width / 5;

  const renderCustomArrows = direction => {
    return (
      <>
        {direction === 'left' ? (
          <View style={{marginStart: diff}}>
            <Image
              style={styles.calendarArrows}
              source={require('../../../../assets/ic_previous.png')}
            />
          </View>
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{marginEnd: diff}}>
              <Image
                style={styles.calendarArrows}
                source={require('../../../../assets/ic_forward.png')}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  const renderCustomHeader = date => {
    const formatted = moment(new Date(date)).format('MMM YYYY');
    return <Text style={styles.headerText}>{formatted}</Text>;
  };

  return (
    <View style={[styles.calendarContainer]}>
      <View
        style={[
          styles.nestedCalendarContainer,
          {borderColor: error ? colors.red : colors.backgroundColor},
        ]}>
        <Calendar
          onDayPress={onDayPress}
          markingType={multidot && 'multi-dot'}
          markedDates={markedDates}
          theme={styles.theme}
          onMonthChange={onMonthChange}
          renderArrow={direction => renderCustomArrows(direction)}
          renderHeader={date => renderCustomHeader(date)}
        />
        {createIconVisible && (
          <View style={{position: 'absolute', right: 10, top: 10}}>
            <ClassProfileButton
              onPress={() => {
                AsyncStorage.setItem(localStorageEnum.SELECTEDCLASSES, '');
                navigation.navigate(appNavigatorIDS.CREATEEVENTSCREEN);
              }}
              padding={0}
              iconImageSize={35}
              source={require('../../../../assets/ic_add_new.png')}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    marginHorizontal: 15,
  },
  nestedCalendarContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
  },
  theme: {
    calendarBackground: colors.cream,
    textSectionTitleColor: colors.backgroundColor,
    dayTextColor: colors.backgroundColor,
    todayTextColor: colors.primaryColor,
    textDisabledColor: colors.gray,
    selectedDayBackgroundColor: colors.backgroundColor,
    selectedDayTextColor: colors.primaryColor,
    todayDayBackgroundColor: 'red',
  },
  calendarArrows: {
    height: 14,
    width: 14,
    tintColor: colors.textColorPrimary,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'Bariol-Bold',
    color: colors.backgroundColor,
  },
});
export default MyCalendar;
