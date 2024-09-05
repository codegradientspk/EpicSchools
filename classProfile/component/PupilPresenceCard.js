import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Image, StyleSheet, Text, View, FlatList} from 'react-native';
import colors from '../../../../config/colors';
import ClassProfileViewModel from '../../ui/ClassProfileViewModel';
import moment from 'moment';

function PupilPresenceCard({data, classId}) {
  console.log('data>>>>>>>>', data);
  var classProfileViewModel = ClassProfileViewModel();
  const isFocused = useIsFocused();

  const [tempArray, setTempArray] = useState([]);

  var isMounted = false;
  useEffect(() => {
    isMounted = true;
    if (isFocused) {
      getClssProfileData();
    }
    return () => {
      isMounted = false;
    };
  }, [data, isFocused]);

  var getClssProfileData = async () => {
    classProfileViewModel.getClassProfile(classId).then(response => {
      if (response.getClassProfileApi_.ok) {
        var daata__ = response.getClassProfileApi_.data;
        if (daata__.data !== undefined) {
          if (isMounted) {
            const array = [];
            daata__.data.class_timings.forEach((element, index) => {
              if (element.timetable_date <= moment().format('YYYY-MM-DD')) {
                array.push(element);
              }
            });
            var tempo = array.splice(0, 5);
            setTempArray(tempo);
          }
        }
      }
    });
  };

  const colorMapping = {
    0: colors.gray,
    1: colors.lightGreen,
    2: colors.lightRed,
    3: colors.primaryColor,
    4: colors.lightBlue,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.nestedContainer]}>
        <View style={styles.leftSmallView} />
        <View style={styles.imageView}>
          <Image
            resizeMode="cover"
            source={{uri: data.user_image}}
            style={styles.image}
          />
        </View>
        <View style={{alignItems: 'flex-start'}}>
          <Text style={styles.name}>
            {data.user_name + ' ' + data.user_lastname}
          </Text>
          <FlatList
            inverted={true}
            scrollEnabled={false}
            contentContainerStyle={{
              justifyContent: 'flex-end',
            }}
            horizontal
            data={tempArray}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              var my =
                tempArray[
                  tempArray.findIndex(
                    a => a.timetable_date === item.timetable_date,
                  )
                ];
              var myAttandence = my.attendance;
              var current = myAttandence.filter(
                (value, index, self) =>
                  index === self.findIndex(t => t.student === data.id),
              );
              if (current !== undefined && current !== null) {
                return (
                  <View>
                    <View
                      style={[
                        styles.presence,
                        {
                          backgroundColor:
                            item.attendance !== undefined &&
                            item.attendance.length > 0
                              ? current.length > 0 &&
                                current[0].status !== undefined
                                ? colorMapping[current[0].status]
                                : colors.gray
                              : colors.gray,
                        },
                      ]}
                    />
                  </View>
                );
              }
            }}
          />
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
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingVertical: 10,
  },
  leftSmallView: {
    height: '200%',
    width: 12,
    backgroundColor: colors.camel,
    position: 'absolute',
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
    marginLeft: 30,
  },
  image: {
    height: 55,
    width: 55,
  },
  name: {
    marginTop: 15,
    color: colors.backgroundColor,
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
    marginBottom: 20,
  },
  presence: {
    height: 9,
    width: 36,
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 15,
  },
});
export default PupilPresenceCard;
