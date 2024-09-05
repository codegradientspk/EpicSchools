import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import ScreenComponent from '../../../components/ScreenComponent';
import colors from '../../../config/colors';
import {
  appNavigatorIDS,
  classprofileErrors,
  createEventErrors,
  localStorageEnum,
} from '../../../config/Enum';
import Language from '../../../config/Language';
import AppEditText from '../../../components/AppEditText';
import TopBackComponent from '../../../components/TopBackComponent';

import ProfileDataComponent from '../component/ProfileDataComponent';
import ProfileTabComponent from '../component/ProfileTabComponent';
import ClassProfileViewModel from '../ui/ClassProfileViewModel';
import AssignComponent from '../../superAdmin/component/AssignComponent';
import PupilPresenceCard from './component/PupilPresenceCard';
import ClassProfileTopComponent from './component/ClassProfileTopComponent';
import PupilAttendanceCard from './component/PupilAttendanceCard';
import SelectFilesComponent from './component/SelectFilesComponent';
import MarkAllButton from './component/MarkAllButton';
import ProfileScreenBottomButton from './component/ProfileScreenBottomButton';
import AssignButton from './component/AssignButton';
import AssignPupilToClassViewModal from '../ui/AssignPupilToClassViewModal';
import ClassProfileButton from './component/ClassProfileButton';
import AttendancePupilViewModel from '../ui/AttendancePupilViewModel';
import ProcessClassViewModel from '../ui/ProcessClassViewModel';
import MyIndicator from '../../../components/MyIndicator';
import ViewClassFeedsViewModel from '../ui/ViewClassFeedsViewModel';
import FeedCard from '../newsfeed/component/FeedCard';
import DeleteClassViewModel from '../ui/DeleteClassViewModel';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AssignPupilToClassCard from './component/AssignPupilToClassCard';
import ErrorComponent from '../../../components/ErrorComponent';
import MyCalendar from '../event/component/MyCalendar';

function ClassProfileScreen({navigation, route}) {
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceStates, setAttendanceStates] = useState([]);
  const [feedData, setFeedData] = useState([]);

  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [markAllSundays, setMarkAllSundays] = useState(false);

  const [markPresent, setMarkPresent] = useState(Language.markAllPresent);
  const [markAbsent, setMarkAbsent] = useState(Language.markAllAbsent);
  const [markPresentIcon, setMarkPresentIcon] = useState(
    require('../../../assets/ic_done.png'),
  );
  const [markAbsentIcon, setMarkAbsentIcon] = useState(
    require('../../../assets/ic_done.png'),
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

  const [pupilTabSelected, setPupilTabSelected] = useState(true);
  const [calendarTabSelected, setCalendarTabSelected] = useState(false);
  const [tabComponentVisible, setTabComponentVisible] = useState(true);
  const [focusIndex, setFocusIndex] = useState(null);

  const [startPickerTime, setStartPickerTime] = useState(new Date());
  const [endPickerTime, setEndPickerTime] = useState(new Date());

  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
  const [classData, setClassData] = useState([]);

  const [assignedPupilArr, setAssignedPupilArr] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [assignedPupilsId, setAssignedPupilsId] = useState([]);
  const [assignedTeacher, setAssignedTeacher] = useState({});
  const [assignedTeacherImage, setAssignedTeacherImage] = useState('');
  const [classTimingsArr, setClassTimingsArr] = useState([]);
  const [selectedDate, setSelectedDate] = useState();

  const [formatedDates, setFormatedDates] = useState([]);
  const [classTimingsArrVisible, setClassTimingsArrVisible] = useState(false);
  const [classTiming, setClassTiming] = useState();
  const [timeableUidArray, setTimeableUidArray] = useState([]);
  const [timeableUid, setTimeableUid] = useState();

  var ClassProfileView = ClassProfileViewModel();
  var AssignPupilToClass = AssignPupilToClassViewModal();
  var AttendancePupilView = AttendancePupilViewModel();
  var ProcessClassView = ProcessClassViewModel();
  var ViewClassFeeds = ViewClassFeedsViewModel();
  var DeleteClassView = DeleteClassViewModel();
  const scrollRef = useRef();
  const [temp, setTemp] = useState();
  const item = route.params;
  const isFocused = useIsFocused();

  var classId;
  if (item.item.class_uid) {
    classId = item.item.class_uid;
  } else {
    classId = item.item.classid;
  }

  useEffect(() => {
    getTeacherData();
    getFeedsData();
  }, [isFocused]);

  isMounted = true;
  useEffect(() => {
    fetchData();
  }, [isFocused]);
  useEffect(() => {
    getClassProfileData();
    if (item.selectCalendar) {
      setCalendarTabSelected(true);
      setPupilTabSelected(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const showAlert = id =>
    Alert.alert(Language.alert, Language.deleteAlert, [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleDelete(id)},
    ]);

  const handleDelete = id => {
    DeleteClassView.deleteClass(id).then(response => {
      if (response.deleteClassApi_.ok) {
        navigation.goBack();
      } else {
        alert(response.deleteClassApi_.data.message);
      }
    });
  };

  const getFeedsData = async () => {
    ViewClassFeeds.viewClassFeeds(classId).then(response => {
      if (response.viewClassFeedsApi_.ok) {
        var daata__ = response.viewClassFeedsApi_.data;
        if (daata__.data !== undefined) {
          if (isMounted) {
            setFeedData(daata__.data.feed_list.data);
          }
        }
      } else {
        alert(response.viewClassFeedsApi_.data.message);
      }
    });
  };

  const fetchData = async () => {
    try {
      const selectedTeacher = await AsyncStorage.getItem(
        localStorageEnum.SELECTEDTECHERS,
      );
      if (selectedTeacher) {
        const fetched = JSON.parse(selectedTeacher);
        if (
          fetched &&
          fetched.user_image !== null &&
          fetched.user_image !== undefined
        ) {
          setAssignedTeacherImage(fetched.user_image);
        }
        setAssignedTeacher(fetched);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const RefreshSelectedTeacherData = async () => {
    try {
      await AsyncStorage.setItem(localStorageEnum.SELECTEDTECHERS, '');
    } catch (error) {
      console.log(error);
    }
  };

  var getTeacherData = async () => {
    setIsLoading(true);
    ClassProfileView.getClassProfile(classId).then(response => {
      if (response.getClassProfileApi_.ok) {
        var daata__ = response.getClassProfileApi_.data.data;
        if (daata__ !== undefined) {
          if (
            daata__.teacher_list !== null &&
            daata__.teacher_list !== undefined
          ) {
            setAssignedTeacher(daata__.teacher_list);
            setAssignedTeacherImage(daata__.teacher_list.user_image);
          }
        }
      } else {
        alert(response.getClassProfileApi_.data.message);
        setIsLoading(false);
      }
    });
  };

  var getClassProfileData = async () => {
    setIsLoading(true);
    ClassProfileView.getClassProfile(classId).then(response => {
      if (response.getClassProfileApi_.ok) {
        var daata__ = response.getClassProfileApi_.data;
        if (daata__.data !== undefined) {
          if (isMounted) {
            const classData = daata__.data.class_list;
            const pupilData = daata__.data.pupil_list;
            setClassData(classData);
            setAssignedPupilArr(pupilData);

            if (pupilData.length > 0) {
              var sel = [];
              pupilData.forEach(element => {
                sel.push({pupilid: element.id, status: 1});
              });
              setSelectedList(sel);
            }

            setNameText(classData.class_fullname);
            setRoomNumberText(classData.class_room_number);
            const sTime = classData.class_start_time.split(':');
            const eTime = classData.class_end_time.split(':');
            sTime.pop();
            eTime.pop();
            setStartTime(sTime.join(':'));
            setEndTime(eTime.join(':'));
            const teacher = daata__.data.teacher_list;
            if (
              teacher &&
              teacher.user_image !== undefined &&
              teacher.user_image !== null
            ) {
              setAssignedTeacherImage(teacher.user_image);
              setAssignedTeacher(teacher);
            }
            // setAssignedTeacher(daata__.data.teacher_list);
            setTemp(daata__.data.class_timings);
            const AssignedPupilsIdArray = [];
            const array = [];
            const timeableUidArray = [];
            daata__.data.class_timings.forEach(element => {
              if (element.timetable_date) {
                array.push(element.timetable_date);
                timeableUidArray.push(element.timetable_uid);
              }
            });
            pupilData.forEach(each => AssignedPupilsIdArray.push(each.id));
            setAssignedPupilsId(AssignedPupilsIdArray);
            filterDates(array);
            setSelectedDates(array);
            setTimeableUidArray(timeableUidArray);
            setTimeableUid(timeableUidArray[0]); // by default timeable uid of zero index
            const matchingObject = daata__.data.class_timings.find(
              obj => obj.timetable_date === selectedDate,
            );
            if (matchingObject) {
              marchingId = matchingObject.attendance.filter(obj =>
                assignedPupilArr.some(pupil => pupil.id === obj.student),
              );
              const transformedArray = machingId
                .map(obj => ({
                  pupil: obj.student,
                  status: obj.status,
                }))
                .sort((a, b) => a.status - b.status);
              if (transformedArray) {
                setAttendanceStates(transformedArray);
              }
            }
            setIsLoading(false);
          }
        }
      } else {
        alert(response.getClassProfileApi_.data.message);
        setIsLoading(false);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });
  };

  const toogleClassTimingsVisible = () => {
    classTimingsArrVisible
      ? setClassTimingsArrVisible(false)
      : setClassTimingsArrVisible(true);
  };

  const filterDates = dateStrings => {
    const dates = dateStrings.map(dateString => new Date(dateString));
    dates.sort((a, b) => b - a);
    const finalDates = dates.map(date => date.toISOString().slice(0, 10));
    const formatedDates = dates.map(date => moment(date).format('D MMMM YYYY'));
    const datesArray = [];
    const formatedDatesArray = [];
    finalDates.forEach(each => {
      if (each <= moment().format('YYYY-MM-DD')) {
        datesArray.push(each);
      }
    });
    formatedDates.forEach(each => {
      formatedDatesArray.push(each);
    });
    setClassTimingsArr(datesArray);
    setFormatedDates(formatedDatesArray);
    setClassTiming(formatedDatesArray[0]);
  };

  const unAssigningPupilToClass = () => {
    setIsLoading(true);
    AssignPupilToClass.assignPupilToClass(classId, selectedList).then(
      response => {
        setIsLoading(false);
        if (response.assignPupilToClassApi_.ok) {
          getClassProfileData();
          Alert.alert(
            '',
            response.assignPupilToClassApi_.data.message,
            [{text: 'OK'}],
            {
              cancelable: false,
            },
          );
        } else {
          setIsLoading(false);
        }
      },
    );
  };

  const addRemovePupil = item => {
    setSelectedList(prevSelectedList => {
      const updatedList = [...prevSelectedList];
      const index = updatedList.findIndex(doc => doc.pupilid === item);
      if (index !== -1) {
        updatedList[index] = {
          ...updatedList[index],
          status: updatedList[index].status === 1 ? 0 : 1,
        };
      } else {
        updatedList.push({pupilid: item, status: 0});
      }
      return updatedList;
    });
  };

  const handleSave = () => {
    if (
      attendanceStates.includes(null) ||
      attendanceStates.length < assignedPupilArr.length ||
      attendanceStates.includes(undefined)
    ) {
      Alert.alert(
        'Please select all options',
        'Make sure you have selected attendance for all Pupils',
      );
    } else {
      postAttendance();
    }
  };

  const EditClass = () => {
    setIsLoading(true);
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
      alert('Please select at least date');
    }

    if (startTime === '') {
      setStartTimeError(true);
      setStartTimeErrorText(createEventErrors.STARTTIMEREQUIRED);
    } else {
      setStartTimeError(false);
      setStartTimeErrorText('');
    }

    if (endTime === '') {
      setEndTimeError(true);
      setEndTimeErrorText(createEventErrors.ENDTIMEREQUIRED);
    } else if (endTime <= startTime) {
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
      setIsLoading(false);
    } else {
      EditCLassProfileData();
    }
  };

  const EditCLassProfileData = async () => {
    ProcessClassView.processClass(
      classId,
      nameText,
      roomNumberText,
      startTime,
      endTime,
      selectedDates,
      assignedTeacher.id !== undefined &&
        assignedTeacher.id !== null &&
        assignedTeacher.id,
      assignedPupilsId,
    ).then(response => {
      if (response.processClassApi_.ok) {
        RefreshSelectedTeacherData();
        getClassProfileData();
        getTeacherData();
        setMarkAllSundays(false);
      }
      alert(response.processClassApi_.data.message);
      setTimeout(() => {
        setIsLoading(false);
      }, 6000);
    });
  };

  var postAttendance = async () => {
    AttendancePupilView.attendancePupil(timeableUid, attendanceStates).then(
      response => {
        if (response.attendancePupilApi_.ok) {
          getClassProfileData();
        }
        setFocusIndex(null);
        setPupilTabSelected(true);
        setTabComponentVisible(true);
        alert(response.attendancePupilApi_.data.message);
      },
    );
  };

  const handleTopComponentIconsPress = index => {
    if (index === focusIndex) {
      setFocusIndex(null);
      setPupilTabSelected(true);
      setTabComponentVisible(true);
      if (index === 3 && pupilTabSelected) {
        setCalendarTabSelected(false);
      } else if (index === 3 && calendarTabSelected) {
        setPupilTabSelected(false);
      }
    } else {
      setFocusIndex(index);
      setPupilTabSelected(false);
      setCalendarTabSelected(false);
      if (index !== 3) {
        setTabComponentVisible(false);
      } else {
        if (calendarTabSelected) {
          setCalendarTabSelected(true);
          setTabComponentVisible(true);
        } else {
          setPupilTabSelected(true);
          setTabComponentVisible(true);
        }
      }
    }
  };

  const onAttendanceButtonsPress = (newState, index, pupilId) => {
    const updatedStates = [...attendanceStates];
    updatedStates[index] = {pupil: pupilId, status: newState};
    setAttendanceStates(updatedStates);
  };

  const markAllPresent = () => {
    if (markPresent === Language.removeAllPresent) {
      setMarkPresent(Language.markAllPresent);
      setMarkPresentIcon(require('../../../assets/ic_done.png'));
      setAttendanceStates([]);
    } else {
      setMarkPresent(Language.removeAllPresent);
      setMarkPresentIcon(require('../../../assets/ic_cancel.png'));
      setMarkAbsent(Language.markAllAbsent);
      setMarkAbsentIcon(require('../../../assets/ic_done.png'));
      const updatedStates = assignedPupilArr.map(id => ({
        pupil: id.id,
        status: 1,
      }));
      setAttendanceStates(updatedStates);
    }
  };
  const markAllAbsent = () => {
    if (markAbsent === Language.removeAllAbsent) {
      setMarkAbsent(Language.markAllAbsent);
      setMarkAbsentIcon(require('../../../assets/ic_done.png'));
      setAttendanceStates([]);
    } else {
      setMarkAbsent(Language.removeAllAbsent);
      setMarkAbsentIcon(require('../../../assets/ic_cancel.png'));
      setMarkPresent(Language.markAllPresent);
      setMarkPresentIcon(require('../../../assets/ic_done.png'));
      const updatedStates = assignedPupilArr.map(id => ({
        pupil: id.id,
        status: 2,
      }));
      setAttendanceStates(updatedStates);
    }
  };

  const handleDateSelect = date => {
    console.log('..', date);
    if (focusIndex === 3) {
      const selected = selectedDates.includes(date.dateString);
      if (selected) {
        const filteredDates = selectedDates.filter(d => d !== date.dateString);
        setSelectedDates(filteredDates);
      } else {
        setSelectedDates([...selectedDates, date.dateString]);
      }
    }
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

  const filterDataAccNewDate = date => {
    setIsLoading(true);
    const matchingObject = temp.find(obj => obj.timetable_date === date);
    if (matchingObject) {
      machingId = matchingObject.attendance.filter(obj =>
        assignedPupilArr.some(pupil => pupil.id === obj.student),
      );
      const transformedArray = machingId
        .map(obj => ({
          pupil: obj.student,
          status: obj.status,
        }))
        .sort((a, b) => a.status - b.status);
      if (transformedArray) {
        setAttendanceStates(transformedArray);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <ScreenComponent style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} />
        <TopBackComponent
          back={true}
          title={Language.classProfile}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            backgroundColor: colors.cardBackground,
            marginBottom: 10,
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
          <ClassProfileTopComponent
            item={classData}
            focusIndex={focusIndex}
            handleIconPress={handleTopComponentIconsPress}
          />
          {tabComponentVisible && (
            <View style={styles.topSelectComponent}>
              <ProfileTabComponent
                title={Language.pupil}
                image={require('../../../assets/ic_face.png')}
                selected={pupilTabSelected}
                onPress={() => {
                  setPupilTabSelected(true);
                  setCalendarTabSelected(false);
                }}
              />

              <ProfileTabComponent
                title={Language.calendar}
                image={require('../../../assets/ic_calender.png')}
                selected={calendarTabSelected}
                onPress={() => {
                  setPupilTabSelected(false);
                  setCalendarTabSelected(true);
                }}
              />
            </View>
          )}
          {focusIndex === 0 && ( // attendance Icon
            <>
              <View style={{marginHorizontal: 15}}>
                <AppEditText
                  editable={false}
                  label={Language.date}
                  value={classTiming}
                  containerStyle={styles.editTextContainer}
                  onPressIn={() => toogleClassTimingsVisible()}
                />
                <ScrollView
                  horizontal
                  scrollEnabled={false}
                  contentContainerStyle={{flexGrow: 1}}>
                  {classTimingsArrVisible && (
                    <FlatList
                      style={{flex: 1, borderRadius: 20}}
                      scrollEnabled={false}
                      data={formatedDates}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item, index}) => (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            setClassTimingsArrVisible(false);
                            setClassTiming(item);
                            setTimeableUid(timeableUidArray[index]);
                            setSelectedDate(classTimingsArr[index]);
                            filterDataAccNewDate(classTimingsArr[index]);
                            setMarkPresent(Language.markAllPresent);
                            setMarkPresentIcon(
                              require('../../../assets/ic_done.png'),
                            );
                            setMarkAbsent(Language.markAllAbsent);
                            setMarkAbsentIcon(
                              require('../../../assets/ic_done.png'),
                            );
                            // setAttendanceStates([]);
                          }}>
                          <View
                            style={{
                              backgroundColor: colors.white,
                            }}>
                            <Text
                              style={{
                                fontSize: 20,
                                marginVertical: 10,
                                alignSelf: 'center',
                                color: colors.textColorPrimary,
                              }}>
                              {item}
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    />
                  )}
                </ScrollView>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: 15,
                }}>
                <MarkAllButton
                  buttonColor={colors.lightGreen}
                  title={markPresent}
                  onPress={() => markAllPresent()}
                  source={markPresentIcon}
                />
                <MarkAllButton
                  buttonColor={colors.lightRed}
                  title={markAbsent}
                  onPress={() => markAllAbsent()}
                  source={markAbsentIcon}
                />
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{flexGrow: 1}}
                scrollEnabled={false}>
                <FlatList
                  scrollEnabled={false}
                  data={assignedPupilArr}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <PupilAttendanceCard
                      data={item.id ? item : null}
                      buttonPress={onAttendanceButtonsPress}
                      index={index}
                      attendanceStatus={
                        attendanceStates[index]
                          ? attendanceStates[index].status
                          : null
                      }
                    />
                  )}
                />
              </ScrollView>
              {assignedPupilArr[0] ? (
                <ProfileScreenBottomButton
                  title={Language.save}
                  onPress={() => handleSave()}
                />
              ) : (
                <ErrorComponent />
              )}
            </>
          )}
          {focusIndex === 1 && (
            <ScrollView
              horizontal
              scrollEnabled={false}
              contentContainerStyle={{flexGrow: 1}}>
              {feedData.length > 0 ? (
                <FlatList
                  scrollEnabled={false}
                  data={feedData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => <FeedCard item={item} />}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginTop: 50,
                  }}>
                  <ErrorComponent />
                </View>
              )}
            </ScrollView>
          )}
          {focusIndex === 2 && ( // Files Icon
            <View style={{marginTop: 20}}>
              <SelectFilesComponent
                title={Language.weeklyStatics}
                source={require('../../../assets/ic_chart_pie.png')}
                onPress={() =>
                  navigation.navigate(appNavigatorIDS.FILESCREEN, {
                    title: Language.weeklyStatics,
                    source: require('../../../assets/ic_chart_pie.png'),
                    classId: classId,
                  })
                }
              />
              <SelectFilesComponent
                title={Language.attendanceReports}
                source={require('../../../assets/ic_hand.png')}
                onPress={() =>
                  navigation.navigate(appNavigatorIDS.FILESCREEN, {
                    pupilarray: assignedPupilArr,
                    title: Language.attendanceReports,
                    source: require('../../../assets/ic_hand.png'),
                    classId: classId,
                  })
                }
              />
              <SelectFilesComponent
                title={Language.leaveFiles}
                source={require('../../../assets/ic_file_board.png')}
                onPress={() =>
                  navigation.navigate(appNavigatorIDS.FILESCREEN, {
                    title: Language.leaveFiles,
                    source: require('../../../assets/ic_file_board.png'),
                    classId: classId,
                  })
                }
              />
              <SelectFilesComponent
                title={Language.customUploads}
                source={require('../../../assets/ic_docs_upload.png')}
                onPress={() =>
                  navigation.navigate(appNavigatorIDS.FILESCREEN, {
                    title: Language.customUploads,
                    source: require('../../../assets/ic_docs_upload.png'),
                    classId: classId,
                  })
                }
              />
            </View>
          )}
          {focusIndex === 3 &&
            pupilTabSelected && ( // Edit Icon
              <>
                <AssignButton
                  onPress={() =>
                    navigation.navigate(appNavigatorIDS.ASSIGNPUPILTOCLASS, {
                      classId: classId,
                    })
                  }
                />
                <ScrollView
                  horizontal
                  scrollEnabled={false}
                  contentContainerStyle={{flexGrow: 1}}>
                  <FlatList
                    scrollEnabled={false}
                    data={assignedPupilArr}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => {
                      const isSelected = selectedList.some(
                        doc => doc.pupilid === item.id && doc.status === 1,
                      );
                      return (
                        <AssignPupilToClassCard
                          item={item}
                          isSelected={isSelected}
                          onPress={() => addRemovePupil(item.id)}
                        />
                      );
                    }}
                  />
                </ScrollView>

                {assignedPupilArr[0] ? (
                  <ProfileScreenBottomButton
                    title={Language.unAssignPupil}
                    onPress={() => unAssigningPupilToClass()}
                  />
                ) : (
                  <ErrorComponent />
                )}
              </>
            )}
          {focusIndex !== 3 &&
            pupilTabSelected && ( // Edit Icon not selected
              <ScrollView
                horizontal
                scrollEnabled={false}
                contentContainerStyle={{flexGrow: 1}}>
                {assignedPupilArr[0] ? (
                  <FlatList
                    scrollEnabled={false}
                    data={assignedPupilArr}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <PupilPresenceCard
                        data={item.id ? item : null}
                        classId={classId}
                      />
                    )}
                  />
                ) : (
                  <View
                    style={{
                      marginVertical: 100,
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <ClassProfileButton
                      backgroundColor={colors.backgroundColor}
                      source={require('../../../assets/ic_warning.png')}
                      iconColor={colors.white}
                      padding={10}
                    />
                    <Text style={styles.warningText}>
                      {Language.noRecordsFound}
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          {calendarTabSelected && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {focusIndex === 3 &&
                calendarTabSelected && ( // Edit Icon
                  <>
                    <View style={styles.calssInformationContainer}>
                      <Text style={styles.label}>
                        {Language.classInformation}
                      </Text>
                      <AppEditText
                        onChangeText={txt => setNameText(txt)}
                        label={Language.name}
                        value={nameText}
                        error={nameError}
                        errorText={nameErrorText}
                        containerStyle={styles.editTextContainer}
                      />

                      <AppEditText
                        onChangeText={txt => setRoomNumberText(txt)}
                        label={Language.roomNumber}
                        value={roomNumberText}
                        error={roomNumberError}
                        errorText={roomErrorText}
                        containerStyle={[
                          styles.editTextContainer,
                          {marginTop: 20},
                        ]}
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
                        iconColor={
                          markAllSundays ? colors.lightRed : colors.primaryColor
                        }
                        titleColor={
                          markAllSundays ? colors.lightRed : colors.primaryColor
                        }
                        onPress={() => toggleMarkSundays()}
                      />
                    </View>
                  </>
                )}
              <View style={styles.container}>
                {!isLoading && (
                  <MyCalendar
                    onDayPress={handleDateSelect}
                    onMonthChange={handleMonthChange}
                    markedDates={selectedDates.reduce((marked, date) => {
                      marked[date] = {selected: true};
                      return marked;
                    }, {})}
                  />
                )}
                <View style={styles.scheduleContainer}>
                  <AppEditText
                    label={Language.startTime}
                    value={startTime}
                    containerStyle={styles.editTimeContainer}
                    onPressIn={() => {
                      if (focusIndex === 3) setOpenStartTimeModal(true);
                    }}
                    editable={false}
                    error={startTimeError}
                    errorText={startTimeErrorText}
                  />
                  <AppEditText
                    label={Language.endTime}
                    value={endTime}
                    containerStyle={styles.editTimeContainer}
                    onPressIn={() => {
                      if (focusIndex === 3) setOpenEndTimeModal(true);
                    }}
                    editable={false}
                    error={endTimeError}
                    errorText={endTimeErrorText}
                  />
                </View>
                <DatePicker
                  locale={'en_GB'}
                  mode="time"
                  modal
                  open={openStartTimeModal}
                  date={startPickerTime}
                  onConfirm={date => {
                    setStartPickerTime(date);
                    setOpenStartTimeModal(false);
                    setStartTime(date);
                    const options = {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    };
                    const time = date.toLocaleString('en-US', options);
                    setStartTime(time);
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
                  date={endPickerTime}
                  onConfirm={date => {
                    setEndPickerTime(date);
                    setOpenEndTimeModal(false);
                    setEndTime(date);
                    const options = {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    };
                    const time = date.toLocaleString('en-US', options);
                    setEndTime(time);
                  }}
                  onCancel={() => {
                    setOpenEndTimeModal(false);
                  }}
                />
                {focusIndex !== 3 && calendarTabSelected && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                        marginRight: 5,
                      }}>
                      <ProfileDataComponent
                        style={{backgroundColor: colors.cream}}
                        barStyle={{backgroundColor: colors.camel}}
                        topImageContainerStyle={{backgroundColor: colors.camel}}
                        title={Language.pupil}
                        subTitle={
                          assignedPupilArr.length +
                          ' ' +
                          Language.pupilsResponsibility
                        }
                        image={require('../../../assets/ic_classes.png')}
                        onPress={() => {
                          setFocusIndex();
                          setPupilTabSelected(true);
                          setCalendarTabSelected(false);
                        }}
                      />
                      <ProfileDataComponent
                        style={{backgroundColor: colors.cream}}
                        barStyle={{backgroundColor: colors.camel}}
                        topImageContainerStyle={{backgroundColor: colors.camel}}
                        title={Language.assignPupil}
                        subTitle={Language.assignNewPupil}
                        image={require('../../../assets/ic_plus.png')}
                        imageSize={24}
                        onPress={() =>
                          navigation.navigate(
                            appNavigatorIDS.ASSIGNPUPILTOCLASS,
                            {
                              classId: classId,
                            },
                          )
                        }
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setCalendarTabSelected(false);
                        setTabComponentVisible(false);
                        setFocusIndex(0);
                        scrollRef.current?.scrollTo({
                          y: 0,
                          animated: false,
                        });
                      }}>
                      <View style={styles.markButtonContainer}>
                        <View style={styles.markButtonNestedContainer}>
                          <View style={styles.markButtonLeftView} />
                          <View style={{marginHorizontal: 15}}></View>
                          <View style={{marginVertical: 18}}>
                            <Text style={styles.markButtonText}>
                              {Language.mark}
                            </Text>
                            <Text style={styles.markButtonText}>
                              {Language.attendance}
                            </Text>
                          </View>
                          <View style={{flex: 1}} />
                          <ClassProfileButton
                            source={require('../../../assets/ic_check.png')}
                            backgroundColor="transparent"
                            iconImageSize={32}
                            padding={24}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              {focusIndex === 3 &&
                calendarTabSelected && ( // Edit Icon
                  <>
                    <AssignComponent
                      singleImage={true}
                      images={assignedTeacherImage}
                      title={Language.teacher}
                      barStyle={{
                        backgroundColor: colors.greenIcon,
                      }}
                      style={{
                        backgroundColor: colors.greenOpacity,
                      }}
                      onPress={() =>
                        navigation.navigate(
                          appNavigatorIDS.ASSIGNTEACHERTOCLASS,
                          {
                            item: item,
                            classId: classId,
                            id: assignedTeacher ? assignedTeacher.id : null,
                          },
                        )
                      }
                    />
                    <ProfileScreenBottomButton
                      title={Language.save}
                      onPress={() => EditClass()}
                    />
                    <ProfileScreenBottomButton
                      title={Language.deleteClass}
                      buttonColor="transparent"
                      titleColor={colors.red}
                      borderColor={colors.red}
                      titleFont={16}
                      onPress={() => showAlert(classId)}
                    />
                  </>
                )}
            </ScrollView>
          )}
        </ScrollView>
      </ScreenComponent>
      <MyIndicator visible={isLoading} />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSelectComponent: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: colors.primaryColor,
    marginStart: 15,
    marginEnd: 15,
    borderRadius: 40,
  },
  editTextContainer: {
    width: '100%',
    height: 70,
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
    textSectionTitleColor: colors.backgroundColor,
    dayTextColor: colors.backgroundColor,
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
  headerText: {
    color: colors.textColorPrimary,
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
  },
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
  editTimeContainer: {
    width: '48%',
    height: 70,
  },
  scheduleContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  warningText: {
    marginTop: 5,
    color: colors.gray,
    fontFamily: 'Bariol-Bold',
  },
  markButtonContainer: {
    shadowColor: colors.gray,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  markButtonNestedContainer: {
    backgroundColor: colors.classCardGreen,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  markButtonLeftView: {
    backgroundColor: colors.greenDark,
    height: '100%',
    width: 12,
  },
  markButtonText: {
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
    color: colors.backgroundColor,
  },
});
export default ClassProfileScreen;
