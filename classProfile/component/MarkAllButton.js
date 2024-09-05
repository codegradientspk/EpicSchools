import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import colors from '../../../../config/colors';
import ClassProfileButton from './ClassProfileButton';

function MarkAllButton({
  buttonColor,
  title,
  iconColor = colors.backgroundColor,
  titleColor = colors.textColorPrimary,
  onPress,
  source = require('../../../../assets/ic_done.png'),
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, {backgroundColor: buttonColor}]}>
        <ClassProfileButton
          iconColor={iconColor}
          iconImageSize={20}
          padding={0}
          backgroundColor={buttonColor}
          source={source}
          onPress={onPress}
        />
        <Text
          style={{
            fontFamily: 'Bariol-Bold',
            color: titleColor,
            marginVertical: 10,
            marginRight: 10,
          }}>
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGreen,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 40,
  },
});
export default MarkAllButton;
