import React, {useState} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import colors from '../../../../config/colors';
import ClassProfileButton from './ClassProfileButton';
import Language from '../../../../config/Language';

function ClassProfileTopComponent({focusIndex, handleIconPress, item}) {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.line} />
        <Image
          source={require('../../../../assets/ic_gurdwara.png')}
          style={styles.image}
        />
        <View style={styles.line} />
      </View>
      <Text
        numberOfLines={1}
        style={[styles.titleText, {marginHorizontal: 20}]}>
        {item.class_fullname}
      </Text>
      <Text style={styles.subTitleText}>
        {Language.classRoomNumber + ' ' + item.class_room_number}
      </Text>

      <View style={styles.iconContainer}>
        <ClassProfileButton
          onPress={() => handleIconPress(0)}
          backgroundColor={focusIndex === 0 ? colors.red : colors.primaryColor}
          source={require('../../../../assets/ic_hand.png')}
          title={Language.attendance}
        />
        <ClassProfileButton
          onPress={() => handleIconPress(1)}
          backgroundColor={focusIndex === 1 ? colors.red : colors.primaryColor}
          source={require('../../../../assets/ic_notices.png')}
          title={Language.feed}
          iconImageSize={28}
          padding={6}
        />
        <ClassProfileButton
          onPress={() => handleIconPress(2)}
          backgroundColor={focusIndex === 2 ? colors.red : colors.primaryColor}
          source={require('../../../../assets/ic_file.png')}
          title={Language.files}
        />
        <ClassProfileButton
          onPress={() => handleIconPress(3)}
          backgroundColor={focusIndex === 3 ? colors.red : colors.primaryColor}
          source={require('../../../../assets/ic_edit.png')}
          title={Language.edit}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    marginHorizontal: 15,
    paddingVertical: 24,
    shadowColor: colors.gray,
    shadowOpacity: 0.7,
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 86,
    height: 86,
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
  },

  line: {
    flex: 1,
    backgroundColor: colors.camel,
    height: 5,
  },
  titleText: {
    fontSize: 20,
    color: colors.camel,
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: 'Bariol-Bold',
  },
  subTitleText: {
    fontSize: 12,
    color: colors.camel,
    alignSelf: 'center',
    marginTop: 2,
    fontFamily: 'Bariol-Bold',
  },
});

export default ClassProfileTopComponent;
