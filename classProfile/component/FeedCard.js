import moment from 'moment';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

import colors from '../../../../config/colors';
import ClassProfileButton from './ClassProfileButton';

function FeedCard({item}) {
  const timeFromNow = moment(item.created_datetime).fromNow();

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.imageContainer}>
          <FastImage
            source={{uri: item.user_image}}
            style={{height: 60, width: 60, borderRadius: 30}}
          />
        </View>
        <View style={{flex: 1, marginLeft: 20}}>
          <View style={styles.topTextIconContainer}>
            <Text style={styles.nameText}>
              {item.user_name + ' ' + item.user_lastname}
            </Text>
            <ClassProfileButton
              source={require('../../../../assets/ic_More.png')}
              backgroundColor={'transparent'}
              padding={0}
              iconImageSize={40}
              iconColor={colors.gray}
              onPress={() => handleRef()}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: colors.gray}}>testing for add</Text>
            <View style={styles.dot} />
            <Text style={{color: colors.gray, fontSize: 16}}>
              {timeFromNow}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{item.feed_content}</Text>
      <View style={styles.line} />
      <View style={{alignItems: 'flex-start'}}>
        <ClassProfileButton
          backgroundColor="transparent"
          source={require('../../../../assets/ic_messages.png')}
          iconImageSize={30}
          padding={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderColor: colors.backgroundColor,
    borderWidth: 2,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
  },
  imageContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: colors.lightBlue,
    overflow: 'hidden',
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 3,
    backgroundColor: colors.primaryColor,
    marginLeft: 30,
    marginRight: 5,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.gray,
    opacity: 0.5,
    marginVertical: 20,
  },
  nameText: {
    fontFamily: 'Bariol-Bold',
    fontSize: 20,
    color: colors.textColorPrimary,
  },
  description: {
    fontSize: 20,
    fontFamily: 'Bariol-Regular',
    color: colors.textColorPrimary,
    marginTop: 20,
  },
  topTextIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
export default FeedCard;
