import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../../config/colors';

function ClassProfileButton({
  source,
  title,
  backgroundColor = colors.primaryColor,
  borderRadius = 100,
  iconImageSize = 20,
  iconColor = colors.textColorPrimary,
  padding = 10,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{alignItems: 'center'}}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: backgroundColor,
              borderRadius: borderRadius,
              padding: padding,
            },
          ]}>
          <Image
            resizeMode="contain"
            style={{
              height: iconImageSize,
              width: iconImageSize,
              tintColor: iconColor,
            }}
            source={source}
          />
        </View>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  image: {
    height: 25,
    width: 25,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Bariol-Bold',
    color: colors.primaryColor,
    marginTop: 8,
  },
});
export default ClassProfileButton;
