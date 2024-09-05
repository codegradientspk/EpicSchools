import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import ScreenComponent from '../../../components/ScreenComponent';
import TopBackComponent from '../../../components/TopBackComponent';
import AppEditText from '../../../components/AppEditText';
import MarkAllButton from './component/MarkAllButton';
import colors from '../../../config/colors';
import Language from '../../../config/Language';
import {Calendar} from 'react-native-calendars';
import ProfileScreenBottomButton from './component/ProfileScreenBottomButton';
import ProcessClassViewModel from '../ui/ProcessClassViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  appNavigatorIDS,
  createEventErrors,
  localStorageEnum,
} from '../../../config/Enum';
import {useIsFocused} from '@react-navigation/native';
import MyIndicator from '../../../components/MyIndicator';
import AssignComponent from '../component/AssignComponent';
import {classprofileErrors} from '../../../config/Enum';
import moment from 'moment';

function AddClassScreen({navigation}) {
  const scrollRef = useRef();
  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [nameText, setNameText] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorText, setNameErrorText] = useState('');

  const [roomNumberText, setRoomNumberText] = useState('');
  const [roomNumberError, setRoomNumberError] = useState('');
  const [roomErrorText, setRoomErrorText] = useState('');

  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDateError, setSelectedDateError] = useState('');
  const [selectedDateErrorText, setSelectedDateErrorText] = useState('');

  const [startTime, setStartTime] = useState('');
  const [startTimeError, setStartTimeError] = useState('');
  const [startTimeErrorText, setStartTimeErrorText] = useState('');

  const [endTime, setEndTime] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [endTimeErrorText, setEndTimeErrorText] = useState('');

  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
  const [markAllSundays, setMarkAllSundays] = useState(false);
  const [assignedTeacher, setAssignedTeacher] = useState({});
  const [teacherImage, setTeacherImage] = useState([]);
  const [assignedPupils, setAssignedPupils] = useState([]);
  const [assignedpupilImages, setAssignedPupilImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  var ProcessClassView = ProcessClassViewModel();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchData = async () => {
    try {
      const selectedTeacher = await AsyncStorage.getItem(
        localStorageEnum.SELECTEDTECHERS,
      );
      const selectedPupils = await AsyncStorage.getItem(
        localStorageEnum.SELECTEDPUPILS,
      );
      const fetched = JSON.parse(selectedTeacher);
      if (selectedTeacher) {
        if (
          fetched.user_image &&
          fetched.user_image !== undefined &&
          fetched.user_image !== null
        )
          setTeacherImage([{image: fetched.user_image}]);
        setAssignedTeacher(fetched);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
      if (selectedPupils) {
        const pupilsList = JSON.parse(selectedPupils);
        setAssignedPupils(pupilsList);
        const imagesArray = [];
        pupilsList.forEach(each => imagesArray.push({image: each.user_image}));
        if (imagesArray !== undefined && imagesArray[0].image) {
          setAssignedPupilImages(imagesArray);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const registerClass = () => {
    if (nameText === '') {
      setNameError(true);
      setNameErrorText(classprofileErrors.CLASSNAMEREQUIRED);
    } else if (nameText.length < 2) {
      setNameError(true);
      setNameErrorText(classprofileErrors.CLASSNAMEERROR);
    } else {
      setNameError(false);
      setNameErrorText('');
    }

    if (roomNumberText === '') {
      setRoomErrorText(classprofileErrors.ROOMNUMBERREQUIRED);
      setRoomNumberError(true);
    } else if (roomNumberText.length < 2) {
      setRoomErrorText(classprofileErrors.ROOMNUMBERERROR);
      setRoomNumberError(true);
    } else if (roomNumberText.length > 20) {
      setRoomErrorText(classprofileErrors.ROOMNUMBERGREATER);
      setRoomNumberError(true);
    } else {
      setRoomErrorText('');
      setNameErrorText(false);
    }

    if (selectedDates.length === 0) {
      setSelectedDateError(true);
      setSelectedDateErrorText(createEventErrors.DATEREQUIRED);
    } else {
      setSelectedDateError(false);
      setSelectedDateErrorText('');
    }

    selectedDates.forEach(each => {
      if (each < moment().format('YYYY-MM-DD')) {
        setSelectedDateError(true);
        setSelectedDateErrorText(createEventErrors.DATEERROR);
      }
    });

    if (startTime === '') {
      setStartTimeError(true);
      setStartTimeErrorText(createEventErrors.STARTTIMEREQUIRED);
    } else {
      setStartTimeError(false);
      setStartTimeErrorText('');
    }

    if (endTime <= startTime) {
      setEndTimeError(true);
      setEndTimeErrorText(createEventErrors.ENDTIMEERROR);
    } else {
      setEndTimeError(false);
      setEndTimeErrorText('');
    }

    if (
      nameText === '' ||
      nameText.length < 2 ||
      roomNumberText === '' ||
      roomNumberText.length < 2 ||
      roomNumberText.length > 20 ||
      selectedDates.length === 0 ||
      startTime === '' ||
      endTime === '' ||
      endTime <= startTime
    ) {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      console.log('All fields are empty');
      return;
    } else {
      CreateNewClass();
    }
  };

  const CreateNewClass = async () => {
    const pupilsIdArray = [];
    assignedPupils.forEach(each => pupilsIdArray.push(each.pupilid));
    setIsLoading(true);
    ProcessClassView.processClass(
      0,
      nameText,
      roomNumberText,
      startTime,
      endTime,
      selectedDates,
      assignedTeacher.id,
      pupilsIdArray,
    ).then(response => {
      if (response.processClassApi_.ok) {
        setIsLoading(false);
        navigation.goBack();
      }
      alert(response.processClassApi_.data.message);
      setIsLoading(false);
    });
  };

  const renderCustomArrows = direction => {
    return (
      <>
        {direction === 'left' ? (
          <View style={{marginLeft: 100}}>
            <Image
              style={styles.calendarArrows}
              source={require('../../../assets/ic_previous.png')}
            />
          </View>
        ) : (
          <View style={{marginRight: 100}}>
            <Image
              style={styles.calendarArrows}
              source={require('../../../assets/ic_forward.png')}
            />
          </View>
        )}
      </>
    );
  };

  const renderCustomHeader = date => {
    const monthData = date.toLocaleString('default', {month: 'short'});
    const month = monthData.split('/')[0];
    const monthName = new Date(Date.UTC(0, month - 1, 1)).toLocaleString(
      'en-US',
      {month: 'short'},
    );
    const year = date.getFullYear().toString();
    return <Text style={styles.headerText}>{`${monthName} ${year}`}</Text>;
  };

  const handleDateSelect = date => {
    setSelectedDateError(false);
    setSelectedDateErrorText('');
    const selected = selectedDates.includes(date.dateString);
    if (selected) {
      const filteredDates = selectedDates.filter(d => d !== date.dateString);
      setSelectedDates(filteredDates);
    } else {
      setSelectedDates([...selectedDates, date.dateString]);
    }
    setMarkAllSundays(false); // Unselect all Sundays it wil select dates
  };

  const handleMonthChange = newMonth => {
    const date = newMonth.dateString;
    setCurrentCalendarDate(date);

    const month = newMonth.month;
    const year = newMonth.year;
    sundays = [];

    const lastDayOfMonth = new Date(year, month + 1, 0);

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === 1) {
        sundays.push(date.toISOString().split('T')[0]);
      }
    }
    if (sundays.every(sunday => selectedDates.includes(sunday))) {
      setMarkAllSundays(true);
    } else {
      setMarkAllSundays(false);
    }
  };

  const toggleMarkSundays = () => {
    setMarkAllSundays(prevMarkAllSundays => {
      if (!prevMarkAllSundays) {
        const currentYear = parseInt(currentCalendarDate.split('-')[0]);
        const currentMonth = parseInt(currentCalendarDate.split('-')[1]);
        const sundays = [];

        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
          const date = new Date(currentYear, currentMonth - 1, day);
          if (date.getDay() === 1) {
            sundays.push(date.toISOString().split('T')[0]);
          }
        }

        setSelectedDates([...selectedDates, ...sundays]);
      } else {
        setSelectedDates(
          selectedDates.filter(date => {
            const date_ = parseInt(date.split('-')[1]);
            const d = parseInt(currentCalendarDate.split('-')[1]);
            return d !== date_;
          }),
        );
      }
      return !prevMarkAllSundays;
    });
  };

  return (
    <>
      <ScreenComponent style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} />
        <TopBackComponent
          back={true}
          title={Language.addClass}
          onPress={async () => {
            await AsyncStorage.setItem(
              localStorageEnum.SELECTEDTECHERS,
              JSON.stringify(''),
            );
            await AsyncStorage.setItem(
              localStorageEnum.SELECTEDPUPILS,
              JSON.stringify(''),
            );

            setTimeout(() => {
              navigation.goBack();
            }, 300);
          }}
          style={{
            backgroundColor: colors.extraLightBlue,
            marginBottom: 10,
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
          <View style={styles.calssInformationContainer}>
            <Text style={styles.label}>{Language.classInformation}</Text>
            <AppEditText
              onChangeText={txt => {
                if (txt.length > 0) {
                  setNameError(false);
                  setNameErrorText('');
                }
                setNameText(txt);
              }}
              label={Language.name}
              error={nameError}
              errorText={nameErrorText}
              value={nameText}
              containerStyle={styles.editTextContainer}
            />

            <AppEditText
              onChangeText={txt => {
                if (txt.length > 0) {
                  setRoomErrorText('');
                  setRoomNumberError(false);
                }
                setRoomNumberText(txt);
              }}
              label={Language.roomNumber}
              value={roomNumberText}
              error={roomNumberError}
              errorText={roomErrorText}
              containerStyle={[styles.editTextContainer, {marginTop: 20}]}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginStart: 15,
              marginVertical: -20,
            }}>
            <MarkAllButton
              source={
                markAllSundays
                  ? require('../../../assets/ic_cancel.png')
                  : require('../../../assets/ic_done.png')
              }
              buttonColor={colors.backgroundColor}
              title={
                markAllSundays
                  ? Language.unselectAllSundays
                  : Language.selectAllSundays
              }
              iconColor={markAllSundays ? colors.lightRed : colors.primaryColor}
              titleColor={
                markAllSundays ? colors.lightRed : colors.primaryColor
              }
              onPress={() => toggleMarkSundays()}
            />
          </View>

          <View style={styles.calendarContainer}>
            <View
              style={[
                styles.nestedCalendarContainer,
                {
                  borderColor: selectedDateError
                    ? colors.red
                    : colors.backgroundColor,
                },
              ]}>
              <Calendar
                theme={styles.theme}
                renderArrow={direction => renderCustomArrows(direction)}
                renderHeader={date => renderCustomHeader(date)}
                onDayPress={handleDateSelect}
                onMonthChange={handleMonthChange}
                markedDates={selectedDates.reduce((marked, date) => {
                  marked[date] = {selected: true};
                  return marked;
                }, {})}
              />
            </View>
            {selectedDateError && (
              <Text style={styles.calendarWarningText}>
                {selectedDateErrorText}
              </Text>
            )}
          </View>
          <View style={styles.scheduleContainer}>
            <AppEditText
              label={Language.startTime}
              value={startTime}
              error={startTimeError}
              errorText={startTimeErrorText}
              containerStyle={styles.editTimeContainer}
              onPressIn={() => setOpenStartTimeModal(true)}
              editable={false}
            />
            <AppEditText
              label={Language.endTime}
              value={endTime}
              error={endTimeError}
              errorText={endTimeErrorText}
              containerStyle={styles.editTimeContainer}
              onPressIn={() => setOpenEndTimeModal(true)}
              editable={false}
            />
          </View>
          <DatePicker
            locale={'en_GB'}
            mode="time"
            modal
            open={openStartTimeModal}
            date={new Date()}
            onConfirm={date => {
              setOpenStartTimeModal(false);
              setStartTime(date);
              const options = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
              };
              const time = date.toLocaleString('en-US', options);
              setStartTime(time);
              setStartTimeError(false);
              setStartTimeErrorText('');
            }}
            onCancel={() => {
              setOpenStartTimeModal(false);
            }}
          />
          <DatePicker
            locale={'en_GB'}
            mode="time"
            modal
            open={openEndTimeModal}
            date={new Date()}
            onConfirm={date => {
              setOpenEndTimeModal(false);
              setEndTime(date);
              const options = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
              };
              const time = date.toLocaleString('en-US', options);
              setEndTime(time);
              setEndTimeError(false);
              setEndTimeErrorText('');
            }}
            onCancel={() => {
              setOpenEndTimeModal(false);
            }}
          />
          <AssignComponent
            images={teacherImage}
            style={{backgroundColor: colors.greenOpacity}}
            title={Language.teacher}
            barStyle={{backgroundColor: colors.lightGreen}}
            onPress={() =>
              navigation.navigate(appNavigatorIDS.ASSIGNTEACHERTOCLASS, {
                id: assignedTeacher.id,
              })
            }
          />
          <AssignComponent
            images={assignedpupilImages}
            title={Language.pupil}
            source={require('../../../assets/ic_face.png')}
            style={{backgroundColor: colors.cream}}
            barStyle={{backgroundColor: colors.camel}}
            onPress={() =>
              navigation.navigate(appNavigatorIDS.ASSIGNPUPILTOCLASS, {
                classId: 0,
              })
            }
          />
          <ProfileScreenBottomButton
            title={Language.save}
            onPress={() => registerClass()}
          />
        </ScrollView>
      </ScreenComponent>
      <MyIndicator visible={isLoading} />
    </>
  );
}

const styles = StyleSheet.create({
  calssInformationContainer: {
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.backgroundColor,
    backgroundColor: colors.cream,
    paddingHorizontal: 16,
    paddingVertical: 32,
    marginTop: 10,
  },
  label: {
    fontFamily: 'Bariol-Bold',
    fontSize: 18,
    marginBottom: 16,
    color: colors.textColorPrimary,
  },
  editTextContainer: {
    width: '100%',
    height: 70,
    marginTop: 20,
  },
  calendarContainer: {
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 10,
    marginHorizontal: 15,
  },
  nestedCalendarContainer: {
    borderRadius: 15,
    borderColor: colors.backgroundColor,
    overflow: 'hidden',
    borderWidth: 2,
  },
  theme: {
    calendarBackground: colors.cream,
    textSectionTitleColor: colors.background,
    dayTextColor: colors.background,
    todayTextColor: colors.primaryColor,
    textDisabledColor: colors.gray,
    selectedDayBackgroundColor: colors.backgroundColor,
    selectedDayTextColor: colors.primaryColor,
  },
  calendarArrows: {
    height: 20,
    width: 20,
    tintColor: colors.textColorPrimary,
  },
  scheduleContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  editTimeContainer: {
    width: '48%',
    height: 70,
  },
  calendarWarningText: {
    color: colors.red,
    fontFamily: 'Bariol-Bold',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 5,
  },
});
export default AddClassScreen;
