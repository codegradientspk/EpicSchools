import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../../../config/colors';
import Language from '../../../../config/Language';
import ClassProfileButton from './ClassProfileButton';

function AssignPupilButton({images, onPress}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.nestedContainer, {backgroundColor: colors.cream}]}>
          <View style={[styles.leftView, {backgroundColor: colors.camel}]} />
          <View style={{marginHorizontal: 15}}>
            <ClassProfileButton
              backgroundColor={colors.camel}
              source={require('../../../../assets/ic_face.png')}
              borderRadius={10}
              iconImageSize={25}
              padding={15}
            />
          </View>
          <View style={{marginVertical: 18}}>
            <Text style={styles.text}>{Language.assign}</Text>
            <Text style={styles.text}>{Language.pupil}</Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginRight: 15,
              justifyContent: 'flex-end',
            }}>
            {images &&
              images.map((item, index) => {
                if (index < 5) {
                  return (
                    <View style={styles.arrayImageContainer} key={index}>
                      <FastImage
                        key={index}
                        source={{uri: item.image}}
                        style={styles.arrayImageStyle}
                      />
                    </View>
                  );
                }
              })}
            {images.length > 5 && (
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
                  adjustsFontSizeToFit>{`+${images.length - 4} `}</Text>
              </View>
            )}
          </View>

          <View style={{marginRight: 15, marginLeft: 5}}>
            <ClassProfileButton
              source={require('../../../../assets/ic_add_new.png')}
              backgroundColor="transparent"
              iconImageSize={36}
              padding={0}
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
export default AssignPupilButton;
