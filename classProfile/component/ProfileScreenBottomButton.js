import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../../config/colors';

function ProfileScreenBottomButton({
  buttonColor = colors.backgroundColor,
  borderColor = colors.backgroundColor,
  titleColor = colors.primaryColor,
  title = 'Title',
  titleFont = 18,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: buttonColor,
            borderColor: borderColor,
          },
        ]}>
        <Text style={[styles.label, {color: titleColor, fontSize: titleFont}]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
  },
  label: {
    fontFamily: 'Bariol-Bold',
    marginVertical: 8,
    textTransform: 'uppercase',
  },
});
export default ProfileScreenBottomButton;
