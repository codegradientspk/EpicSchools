import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';

import ClassProfileButton from '../../classProfile/component/ClassProfileButton';
import colors from '../../../../config/colors';
import Language from '../../../../config/Language';
import FastImage from 'react-native-fast-image';
function TripEventCard({item, onPress}) {
  // 3 is for class
  const eventType = item.event_type;
  const sTime = item.start_time?.split(':');
  const eTime = item.end_time?.split(':');
  sTime?.pop();
  eTime?.pop();
  const startAmPm = sTime?.[0] < 12 && sTime?.[1] <= 59 ? 'AM' : 'PM';
  const endAmPm = eTime?.[0] < 12 && eTime?.[1] <= 59 ? 'AM' : 'PM';
  const startTime = sTime?.join(':');
  const endTime = eTime?.join(':');
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.cardContainer,
          {backgroundColor: eventType === 3 ? '#FFE4C6' : colors.lightPurple},
        ]}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.titleText,
                  {color: eventType === 3 ? '#FF9C2D' : colors.purple},
                ]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {color: eventType === 3 ? '#FF9C2D' : colors.purple},
                ]}>
                {item.content}
              </Text>
            </View>
            <ClassProfileButton
              iconImageSize={20}
              source={require('../../../../assets/ic_about.png')}
              padding={7}
              iconColor={eventType === 3 ? '#FF9C2D' : colors.purple}
              backgroundColor={eventType === 3 ? '#FFE4C6' : '#e2def9'}
            />
          </View>
          <View style={styles.textContainer}>
            <ClassProfileButton
              iconImageSize={15}
              source={require('../../../../assets/ic_clock.png')}
              padding={7}
              iconColor={eventType === 3 ? '#FF9C2D' : colors.purple}
              backgroundColor={eventType === 3 ? '#FFE4C6' : colors.lightPurple}
            />
            <Text
              style={{color: eventType === 3 ? '#FF9C2D' : colors.dimPurple}}>
              {`${startTime} ${startAmPm} - ${endTime} ${endAmPm}`}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <ClassProfileButton
              iconImageSize={15}
              source={require('../../../../assets/ic_group.png')}
              padding={7}
              iconColor={eventType === 3 ? '#FF9C2D' : colors.purple}
              backgroundColor={eventType === 3 ? '#FFE4C6' : colors.lightPurple}
            />
            <Text
              style={{color: eventType === 3 ? '#FF9C2D' : colors.dimPurple}}>
              {item.teacher}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <ClassProfileButton
              iconImageSize={15}
              source={require('../../../../assets/ic_location.png')}
              padding={7}
              iconColor={eventType === 3 ? '#FF9C2D' : colors.purple}
              backgroundColor={eventType === 3 ? '#FFE4C6' : colors.lightPurple}
            />
            <Text
              style={{color: eventType === 3 ? '#FF9C2D' : colors.dimPurple}}>
              {item.location}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.pupils &&
              item.pupils.map((item, index) => {
                if (index < 5) {
                  return (
                    <View style={styles.arrayImageContainer} key={index}>
                      <FastImage
                        key={index}
                        source={{uri: item}}
                        style={styles.arrayImageStyle}
                      />
                    </View>
                  );
                }
              })}
            {item.pupils > 5 && (
              <View
                style={[
                  styles.arrayImageStyle,
                  {
                    marginStart: -15,
                    backgroundColor: colors.gray,
                    marginRight: -20,
                  },
                ]}>
                <Text
                  style={styles.plusText}
                  numberOfLines={1}
                  adjustsFontSizeToFit>{`+${item.pupils.length - 4} `}</Text>
              </View>
            )}
            <View style={{flex: 1}} />
            <View
              style={[
                styles.tripTextContainer,
                {backgroundColor: eventType === 3 ? '#FFD8AD' : '#e2def9'},
              ]}>
              <Text
                style={{
                  color: eventType === 3 ? '#FF8F14' : colors.purple,
                  textTransform: 'uppercase',
                }}>
                {eventType === 3 ? Language.class : Language.trip}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.lightPurple,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
  },
  titleText: {
    fontFamily: 'Bariol-Bold',
    fontSize: 22,
  },
  subtitleText: {
    fontFamily: 'Bariol-Bold',
    color: colors.dimPurple,
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tripTextContainer: {
    backgroundColor: '#e2def9',
    padding: 6,
    borderRadius: 13,
    width: 70,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  arrayImageContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'transparent',
    marginEnd: -20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  arrayImageStyle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  plusText: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
    color: colors.white,
  },
});
export default TripEventCard;
