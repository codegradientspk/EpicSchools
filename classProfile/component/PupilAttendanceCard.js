import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import colors from '../../../../config/colors';
import Language from '../../../../config/Language';

function PupilAttendanceCard({buttonPress, index, attendanceStatus, data}) {
  const pupilId = data.id;
  return (
    <View style={styles.container}>
      <View style={styles.nestedContainer}>
        <View style={styles.leftView} />
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 30,
            }}>
            <View style={styles.imageView}>
              <Image
                source={{uri: data.user_image}}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.name}>
              {data.user_name + ' ' + data.user_lastname}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
              marginBottom: 20,
            }}>
            <TouchableWithoutFeedback
              onPress={() => buttonPress(1, index, pupilId)}>
              <View
                style={{
                  flex: 1,
                  marginStart: 10,
                  borderRadius: 5,
                  backgroundColor:
                    attendanceStatus === 1 ? colors.lightGreen : colors.gray,
                }}>
                <Text style={styles.buttonText}>{Language.present}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => buttonPress(3, index, pupilId)}>
              <View
                style={{
                  flex: 1,
                  marginStart: 20,
                  borderRadius: 5,
                  backgroundColor:
                    attendanceStatus === 3 ? colors.primaryColor : colors.gray,
                }}>
                <Text style={styles.buttonText}>{Language.late}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => buttonPress(4, index, pupilId)}>
              <View
                style={{
                  flex: 1,
                  marginStart: 20,
                  borderRadius: 5,
                  backgroundColor:
                    attendanceStatus === 4 ? colors.lightBlue : colors.gray,
                }}>
                <Text style={styles.buttonText}>{Language.leave}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => buttonPress(2, index, pupilId)}>
              <View
                style={{
                  marginStart: 20,
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor:
                    attendanceStatus === 2 ? colors.lightRed : colors.gray,
                }}>
                <Text style={styles.buttonText}>{Language.absent}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: colors.gray,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    elevation: 10,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  nestedContainer: {
    backgroundColor: colors.cream,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  leftView: {
    height: '100%',
    width: 12,
    backgroundColor: colors.camel,
    position: 'absolute',
  },
  image: {
    height: 55,
    width: 55,
  },
  imageView: {
    height: 55,
    width: 55,
    backgroundColor: colors.white,
    borderRadius: 27.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: colors.camel,
    marginTop: 15,
    marginBottom: 8,
  },
  name: {
    color: colors.backgroundColor,
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
  },
  attendanceButtonContainer: {
    width: '90%',
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-evenly',
    marginHorizontal: 20,
  },
  buttonText: {
    color: colors.lightBrown,
    fontFamily: 'Bariol-Bold',
    marginVertical: 10,
    marginHorizontal: 15,
    alignSelf: 'center',
  },
});
export default PupilAttendanceCard;
