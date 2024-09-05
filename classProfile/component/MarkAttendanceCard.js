import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import colors from '../../../../config/colors';
import Language from '../../../../config/Language';
import ClassProfileButton from './ClassProfileButton';

function MarkAttendanceCard({onPress}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.nestedContainer}>
          <View style={styles.leftView} />
          <View style={{marginVertical: 18}}>
            <Text style={styles.text}>{Language.mark}</Text>
            <Text style={styles.text}>{Language.attendance}</Text>
          </View>
          <View style={{flex: 1}} />
          <ClassProfileButton
            source={require('../../../../assets/ic_check.png')}
            backgroundColor="transparent"
            iconImageSize={32}
            padding={28}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    shadowColor: colors.gray,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  nestedContainer: {
    backgroundColor: colors.dimGrean,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  leftView: {
    height: '100%',
    width: 12,
    backgroundColor: colors.notificationGreenColor,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
    color: colors.backgroundColor,
    marginLeft: 16,
  },
});
export default MarkAttendanceCard;
