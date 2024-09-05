import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';

import ClassProfileButton from '../classProfile/component/ClassProfileButton';
import ScreenComponent from '../../../components/ScreenComponent';
import TopBackComponent from '../../../components/TopBackComponent';
import Language from '../../../config/Language';
import colors from '../../../config/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import EventDateCard from './component/EventDateCard';
import ViewTripViewModel from '../ui/ViewTripViewModel';
import MyIndicator from '../../../components/MyIndicator';

function TripDetailsScreen() {
  const navigation = useNavigation();
  var viewTrip = ViewTripViewModel();
  const route = useRoute();
  const item = route.params.item;
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState([]);
  const [eventDate, setEventDate] = useState('');
  const [pupillist, setpupilList] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  var isMounted = false;
  useEffect(() => {
    isMounted = true;
    getTripData();
    return () => {
      isMounted = false;
    };
  }, []);

  var getTripData = async () => {
    viewTrip.viewTrip(item.id).then(response => {
      if (response.viewTripApi_.ok) {
        var daata__ = response.viewTripApi_.data;
        if (daata__.data !== undefined) {
          if (isMounted) {
            setIsLoading(false);
            const event = daata__.data.event_list;
            const pupillist = daata__.data.pupil_list;
            setEventData(event);
            setEventDate(event.event_date);
            setpupilList(pupillist);
            if (event.length > 0) {
              const sTime = event.event_stime.split(':');
              const eTime = item.event_etime.split(':');
              sTime.pop();
              eTime.pop();
              const startTime = sTime.join(':');
              const endTime = eTime.join(':');
              setStartTime(startTime);
              setEndTime(endTime);
            }
          }
        }
      } else {
        // alert(response.viewTripApi_.data.message);
        setIsLoading(false);
      }
    });
  };

  const colorMapping = {
    0: colors.gray,
    1: colors.lightGreen,
    2: colors.lightRed,
  };
  return (
    <ScreenComponent style={{flex: 1}}>
      <MyIndicator visible={isLoading} />
      <ScrollView>
        <TopBackComponent
          back={true}
          title={Language.eventDetail}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            backgroundColor: colors.cardBackground,
            marginBottom: 10,
          }}
        />
        <EventDateCard date={item.date} />

        <View style={styles.cardContainer}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
            <Text style={styles.subtitleText}>{item.content}</Text>
            <View style={styles.textContainer}>
              <ClassProfileButton
                iconImageSize={15}
                source={require('../../../assets/ic_clock.png')}
                padding={7}
                iconColor={colors.dimPurple}
                backgroundColor={colors.lightPurple}
              />
              <Text style={{color: colors.dimPurple}}>
                {item.start_time} PM - {item.end_time} PM
              </Text>
            </View>
            <View style={styles.textContainer}>
              <ClassProfileButton
                iconImageSize={15}
                source={require('../../../assets/ic_group.png')}
                padding={7}
                iconColor={colors.dimPurple}
                backgroundColor={colors.lightPurple}
              />
              <Text style={{color: colors.dimPurple}}>{item.teacher}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <ClassProfileButton
                iconImageSize={15}
                source={require('../../../assets/ic_location.png')}
                padding={7}
                iconColor={colors.dimPurple}
                backgroundColor={colors.lightPurple}
              />
              <Text style={{color: colors.dimPurple}}>{item.location}</Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
            }}>
            <View style={styles.tripTextContainer}>
              <Text style={{color: colors.purple, textTransform: 'uppercase'}}>
                {Language.trip}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionlabel}>{Language.description}</Text>
          <Text style={styles.descriptionText}>{item.content}</Text>
        </View>
        <ScrollView
          scrollEnabled={false}
          horizontal
          contentContainerStyle={{flexGrow: 1}}>
          <FlatList
            style={{marginTop: 20}}
            scrollEnabled={false}
            data={pupillist}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              const status = item.confirm_status;
              return (
                <View style={styles.container}>
                  <View style={[styles.nestedContainer]}>
                    <View style={styles.leftSmallView} />
                    <View style={styles.imageView}>
                      <Image
                        resizeMode="cover"
                        source={{uri: item.user_image}}
                        style={styles.image}
                      />
                    </View>
                    <View style={{alignItems: 'flex-start'}}>
                      <Text style={styles.name}>
                        {item.user_name + ' ' + item.user_lastname}
                      </Text>
                      <View
                        style={[
                          styles.presence,
                          {
                            backgroundColor: colorMapping[status],
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      </ScrollView>
    </ScreenComponent>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    backgroundColor: colors.cardBackground,
    padding: 10,
    borderColor: colors.backgroundColor,
    borderWidth: 2,
    marginHorizontal: 20,
    borderRadius: 15,
    height: 150,
    marginTop: 20,
  },
  descriptionlabel: {
    color: colors.backgroundColor,
    fontSize: 10,
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 22,
    fontFamily: 'Bariol-Regular',
    color: colors.backgroundColor,
    marginTop: 5,
  },
  cardContainer: {
    backgroundColor: colors.lightPurple,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
  },
  titleText: {
    color: colors.purple,
    fontFamily: 'Bariol-Bold',
    fontSize: 22,
  },
  subtitleText: {
    fontFamily: 'Bariol-Bold',
    color: colors.dimPurple,
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tripTextContainer: {
    backgroundColor: '#e2def9',
    padding: 6,
    borderRadius: 13,
    width: 70,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  container: {
    shadowColor: colors.gray,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    elevation: 10,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  nestedContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  leftSmallView: {
    height: '100%',
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
    marginTop: 20,
    color: colors.backgroundColor,
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
    marginBottom: 10,
  },
  presence: {
    height: 9,
    width: 36,
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 20,
  },
});
export default TripDetailsScreen;
