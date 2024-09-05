import React, {useEffect, useState, useRef} from 'react';
import {StatusBar, ScrollView, FlatList, Dimensions} from 'react-native';
import ScreenComponent from '../../../components/ScreenComponent';
import TopBackComponent from '../../../components/TopBackComponent';
import Language from '../../../config/Language';
import colors from '../../../config/colors';
import {appNavigatorIDS} from '../../../config/Enum';
import TripEventCard from './component/TripEventCard';
import HolidayEventCard from './component/HolidayEventCard';
import {useIsFocused} from '@react-navigation/native';
import GetEventsViewModel from '../ui/GetEventsViewModel';
import MyIndicator from '../../../components/MyIndicator';
import EventDateCard from './component/EventDateCard';
import moment from 'moment';
import MyCalendar from './component/MyCalendar';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
function EventsScreen({navigation}) {
  const [isLoading, setIsLoading] = useState(true);
  const [allEventsArr, setAllEventsArr] = useState([]);
  const [markedDates, setMarkedDates] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [changedMonth, setChangedMonth] = useState('');
  var getEvents = GetEventsViewModel();
  const isFocused = useIsFocused();
  const flatListRef = useRef(null);
  var isMounted = false;

  useEffect(() => {
    isMounted = true;
    if (isFocused) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          const month = changedMonth ? changedMonth : '';
          getEventsData(month);
        } else {
          getCachedFeedData();
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused, changedMonth]);

  var getCachedFeedData = async () => {
    try {
      const AdminEventsData = await AsyncStorage.getItem('AdminEventsData');
      if (AdminEventsData) {
        const parsedCachedData = JSON.parse(AdminEventsData);
        setAllEventsArr(parsedCachedData);
        processMarkedDates(parsedCachedData, '');
        setIsLoading(false);
      } else {
        const month = changedMonth ? changedMonth : '';
        getEventsData(month);
      }
    } catch (error) {
      console.error('Error retrieving cached feed data:', error);
      setIsLoading(false);
    }
  };
  var getEventsData = async month => {
    setIsLoading(true);
    getEvents.getEvents(month).then(response => {
      if (response.getEventsApi_.ok) {
        var daata__ = response.getEventsApi_.data;
        if (daata__.data !== undefined) {
          if (isMounted) {
            const array = [];
            const datesArray = [];
            const eventsArr = daata__.data.event_list;
            eventsArr.forEach(each => array.push(each));
            setAllEventsArr(array);
            array.forEach(each => {
              datesArray.push(each.date);
            });
            processMarkedDates(array, '');
            AsyncStorage.setItem('AdminEventsData', JSON.stringify(array));
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    });
  };
  const scrollToSelectedCard = date => {
    const index = findIndexForDate(date);

    if (index !== -1 && flatListRef.current) {
      let cumulativeHeight = 0;

      // Calculate the cumulative height up to the target index
      for (let i = 0; i < index; i++) {
        // Adjust the height calculation based on your item heights
        cumulativeHeight += calculateItemHeight(allEventsArr[i]);
      }

      flatListRef.current?.scrollTo({
        x: 0,
        y: cumulativeHeight,
        animated: true,
      });
    }
  };

  // Example function to calculate item height based on your data structure
  const calculateItemHeight = item => {
    // Adjust this based on how your items are structured
    return 370 + item.events.length * 100; // Adjust the calculation based on your item structure
  };

  const findIndexForDate = date => {
    const index = allEventsArr.findIndex(item => item.date === date.dateString);
    return index;
  };

  const processMarkedDates = (eventsArr, selectedDate) => {
    const markedDatesData = {};
    const trip = {color: '#8F43EE'};
    const holiday = {color: '#FFDE00'};
    const classs = {color: '#FF640C'};

    eventsArr.forEach(each => {
      const dots = [];

      each.events.forEach(event => {
        const eventType = event.event_type;
        if (eventType === 1) {
          dots.push(trip);
        } else if (eventType === 2) {
          dots.push(holiday);
        } else if (eventType === 3) {
          dots.push(classs);
        }
      });

      if (dots.length > 0) {
        markedDatesData[each.date] = {
          dots,
          selected: each.date == selectedDate ? true : false,
        };
      }
    });
    setMarkedDates(markedDatesData);
  };

  const handleMarkedDatePress = date => {
    const dateString = date.dateString;
    processMarkedDates(allEventsArr, dateString);
    setSelectedDate(date);
    setTimeout(() => {
      scrollToSelectedCard(date);
    }, 500);
  };

  const changeMonth = month => {
    const formatted = moment(month.dateString).format('MM-YYYY');
    setChangedMonth(formatted);
    // getEventsData(formatted);
  };

  return (
    <>
      <ScreenComponent style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} />
        <TopBackComponent
          back={true}
          title={Language.calendar}
          onPress={() => {
            navigation.navigate(appNavigatorIDS.MAIN);
          }}
          style={{
            backgroundColor: colors.cardBackground,
            marginBottom: 10,
          }}
        />
        <ScrollView ref={flatListRef} showsVerticalScrollIndicator={false}>
          <MyCalendar
            onDayPress={day => handleMarkedDatePress(day)}
            onMonthChange={month => changeMonth(month)}
            markedDates={markedDates}
            createIconVisible={true}
          />
          <ScrollView
            horizontal
            scrollEnabled={false}
            contentContainerStyle={{
              flexGrow: 1,
              width: Dimensions.get('window').width,
            }}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              data={allEventsArr}
              renderItem={({item, index}) => (
                <>
                  <EventDateCard date={item.date} />
                  <FlatList
                    scrollEnabled={false}
                    data={item.events}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={prop => {
                      const eventType = prop.item.event_type;
                      {
                        if (eventType === 3)
                          return (
                            <TripEventCard
                              item={prop.item}
                              onPress={() =>
                                navigation.navigate(
                                  appNavigatorIDS.CLASSPROFILE,
                                  {item: prop.item},
                                )
                              }
                            />
                          );
                        if (eventType === 2)
                          return <HolidayEventCard item={prop.item} />;
                        if (eventType === 1)
                          return (
                            <TripEventCard
                              item={prop.item}
                              onPress={() =>
                                navigation.navigate(
                                  appNavigatorIDS.TRIPDETAILS,
                                  {item: prop.item},
                                )
                              }
                            />
                          );

                        return null;
                      }
                    }}
                  />
                </>
              )}
            />
          </ScrollView>
        </ScrollView>
      </ScreenComponent>
      <MyIndicator visible={isLoading} />
    </>
  );
}

export default EventsScreen;
