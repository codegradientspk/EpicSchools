import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../../../config/colors';
import Language from '../../../../config/Language';
import ClassProfileButton from './ClassProfileButton';

function AssignButton({
  userImage,
  onPress,
  backgroundColor = colors.cream,
  iconColor = colors.camel,
  sideBarColor = colors.camel,
  bottomText = Language.pupil,
  source = require('../../../../assets/ic_face.png'),
  iconImageSize = 25,
  style,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, style]}>
        <View
          style={[styles.nestedContainer, {backgroundColor: backgroundColor}]}>
          <View style={[styles.leftView, {backgroundColor: sideBarColor}]} />
          <View style={{marginHorizontal: 15}}>
            <ClassProfileButton
              backgroundColor={iconColor}
              source={source}
              borderRadius={10}
              iconImageSize={iconImageSize}
              padding={15}
            />
          </View>
          <View style={{marginVertical: 18}}>
            <Text style={styles.text}>{Language.assign}</Text>
            <Text style={styles.text}>{bottomText}</Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 15,
            }}>
            <View style={{flex: 1}} />
            {userImage && (
              <View
                style={{
                  height: 34,
                  width: 34,
                  borderRadius: 17,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FastImage
                  source={{
                    uri: userImage,
                  }}
                  style={styles.image}
                />
              </View>
            )}
            <ClassProfileButton
              source={require('../../../../assets/ic_add_new.png')}
              backgroundColor="transparent"
              iconImageSize={36}
              padding={0}
              onPress={onPress}
            />
          </View>
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
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  leftView: {
    height: '100%',
    width: 12,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
    color: colors.backgroundColor,
  },
  image: {
    height: 34,
    width: 34,
    borderRadius: 17,
    borderColor: colors.white,
    borderWidth: 2,
  },
});
export default AssignButton;
