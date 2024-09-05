import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

import TopBackComponent from '../../../components/TopBackComponent';
import ScreenComponent from '../../../components/ScreenComponent';
import AppEditText from '../../../components/AppEditText';
import colors from '../../../config/colors';
import Language from '../../../config/Language';
import ClassProfileButton from '../classProfile/component/ClassProfileButton';
import ProfileScreenBottomButton from '../classProfile/component/ProfileScreenBottomButton';
import {appNavigatorIDS, localStorageEnum} from '../../../config/Enum';
import AssignButton from '../classProfile/component/AssignButton';
import ProcessEventViewModel from '../ui/ProcessEventViewModel';
import {createEventErrors} from '../../../config/Enum';
import MyIndicator from '../../../components/MyIndicator';
import AssignComponent from '../component/AssignComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import apiConstants from '../../../api/apiConstants';

function CreateEventScreen({navigation, route}) {
  var scrollRef = useRef(null);
  const [isloading, setIsloading] = useState(false);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [titleErrorText, setTitleErrorText] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [descriptionErrorText, setDescriptionErrorText] = useState('');
  const [street, setStreet] = useState('');
  const [streetError, setStreetError] = useState('');
  const [streetErrorText, setStreetErrorText] = useState('');
  const [postCode, setPostCode] = useState('');
  const [postCodeError, setPostCodeError] = useState('');
  const [postCodeErrorText, setPostCodeErrorText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDateError, setSelectedDateError] = useState('');
  const [selectedDateErrorText, setSelectedDateErrorText] = useState('');
  const [markedDate, setMarkedDate] = useState({});
  const [authorization, setAuthorization] = useState('0');
  const [message, setMessage] = useState('0');
  const [classsesId, setClassesId] = useState([]);
  const [classesIdError, setClassesIdError] = useState('');
  const [classesIdErrorText, setClassesIdErrorText] = useState('');
  const [selectType, setSelectType] = useState('1'); // 1 for trip 2 for holiday
  const [startTime, setStartTime] = useState('');
  const [startTimeError, setStartTimeError] = useState('');
  const [startTimeErrorText, setStartTimeErrorText] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [endTimeErrorText, setEndTimeErrorText] = useState('');
  const [openStartTimeModal, setOpenStartTimeModal] = useState(false);
  const [openEndTimeModal, setOpenEndTimeModal] = useState(false);
  var ProcessEvent = ProcessEventViewModel();

  const [classesImages, setClassesImages] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) fetchAsyncData();
  }, [isFocused]);

  const fetchAsyncData = () => {
    try {
      AsyncStorage.getItem(localStorageEnum.SELECTEDCLASSES).then(value => {
        if (value !== null) {
          const given = JSON.parse(value);
          const idsArray = [];
          const imgArray = [];
          given.forEach(each => {
            idsArray.push(each.classid);
            imgArray.push({image: each.image});
          });
          setClassesId(idsArray);
          if (imgArray !== undefined && imgArray.length > 0) {
            setClassesImages(imgArray);
          } else {
            setClassesImages([]);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const selectionToggle = num => {
    console.log(num);
    setSelectType(num);
  };
  const checkValidations = () => {
    if (title === '') {
      setTitleError(true);
      setTitleErrorText(createEventErrors.TITLEREQUIRED);
    } else if (title.length < 2) {
      setTitleError(true);
      setTitleErrorText(createEventErrors.TITLEERROR);
    } else {
      setTitleError(false);
      setTitleErrorText('');
    }

    if (description === '') {
      setDescriptionError(true);
      setDescriptionErrorText(createEventErrors.DESCRIPTIONREQUIRED);
    } else if (description.length < 5) {
      setDescriptionError(true);
      setDescriptionErrorText(createEventErrors.DESCRIPTIONERROR);
    } else {
      setDescriptionError(false);
      setDescriptionErrorText('');
    }

    if (street === '' && selectType === '1') {
      setStreetError(true);
      setStreetErrorText(createEventErrors.STREETREQUIRED);
    } else if (street.length < 5 && selectType === '1') {
      setStreetError(true);
      setStreetErrorText(createEventErrors.STREETERROR);
    } else {
      setStreetError(false);
      setStreetErrorText('');
    }

    if (postCode === '' && selectType === '1') {
      setPostCodeError(true);
      setPostCodeErrorText(createEventErrors.POSTCODEREQUIRED);
    } else if (postCode.length < 6 && selectType === '1') {
      setPostCodeError(true);
      setPostCodeErrorText(createEventErrors.POSTCODEERROR);
    } else if (postCode.length > 10 && selectType === '1') {
      setPostCodeError(true);
      setPostCodeErrorText(createEventErrors.POSTCODEGREATER);
    } else {
      setPostCodeError(false);
      setPostCodeErrorText('');
    }
    if (selectedDate === '') {
      setSelectedDateError(true);
      setSelectedDateErrorText(createEventErrors.DATEREQUIRED);
    } else if (selectedDate < moment().format('YYYY-MM-DD')) {
      setSelectedDateError(true);
      setSelectedDateErrorText(createEventErrors.DATEERROR);
    } else {
      setSelectedDateError(false);
      setSelectedDateErrorText('');
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
    } else {
      setEndTimeError(false);
      setEndTimeErrorText('');
    }
    if (classsesId.length === 0 && selectType === '1') {
      setClassesIdError(true);
      setClassesIdErrorText(createEventErrors.CLASSREQUIRED);
    } else {
      setClassesIdError(false);
      setClassesIdErrorText('');
    }

    if (selectType === '1') {
      if (
        title === '' ||
        title.length < 2 ||
        description === '' ||
        description.length < 5 ||
        street === '' ||
        street.length < 5 ||
        postCode === '' ||
        postCode.length < 6 ||
        selectedDate === '' ||
        selectedDate.length < 2 ||
        startTime === '' ||
        endTime === '' ||
        classsesId.length === 0
      ) {
        scrollRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
        console.log('All fields are empty');
        return;
      }
      CreateNewEvent();
      setIsloading(true);
    } else {
      if (
        title === '' ||
        title.length < 2 ||
        description === '' ||
        description.length < 5 ||
        selectedDate === '' ||
        selectedDate.length < 2 ||
        startTime === '' ||
        endTime === ''
      ) {
        scrollRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
        console.log('All fields are empty');
        return;
      }
      CreateNewEvent();
      setIsloading(true);
    }
  };

  const toggleAuthorization = () => {
    authorization === '0' ? setAuthorization('1') : setAuthorization('0');
  };

  const toggleMessage = () => {
    message === '0' ? setMessage('1') : setMessage('0');
  };

  const CreateNewEvent = async () => {
    ProcessEvent.processEvent(
      0,
      title,
      description,
      selectType,
      message,
      selectedDate,
      startTime,
      endTime,
      // authorization,
      selectType === '1' ? authorization : '0',
      selectType === '1' ? street : '',
      selectType === '1' ? postCode : '',
      selectType === '1' ? classsesId : [],
    ).then(response => {
      if (response.processEventApi_.ok) {
        setIsloading(false);
        navigation.goBack();
      } else {
        console.log(response.processEventApi_.data);
        Alert.alert('Alert!', response.processEventApi_.data.errors);
      }

      setIsloading(false);
    });
  };

  const handleDateSelect = date => {
    const markedDate = {};
    markedDate[date.dateString] = {
      selected: true,
      selectedColor: colors.backgroundColor,
    };
    setSelectedDate(date.dateString);
    setMarkedDate(markedDate);
    setSelectedDateError(false);
    setSelectedDateErrorText('');
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
    const formatted = moment(new Date(date)).format('MMM YYYY');
    return <Text style={styles.headerText}>{formatted}</Text>;
  };
  return (
    <>
      <MyIndicator visible={isloading} />
      <ScreenComponent style={{flex: 1}}>
        <ScrollView ref={scrollRef}>
          <TopBackComponent
            back={true}
            title={Language.calendar}
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              backgroundColor: colors.cardBackground,
              marginBottom: 10,
            }}
          />
          <View style={styles.detailsContainer}>
            <Text style={{fontSize: 16, color: colors.gray, fontWeight: '600'}}>
              {Language.information}
            </Text>
            <AppEditText
              label={Language.title}
              value={title}
              error={titleError}
              errorText={titleErrorText}
              containerStyle={styles.editTextContainer}
              onChangeText={txt => {
                if (txt.length > 0) {
                  setTitleError(false);
                  setTitleErrorText('');
                }
                setTitle(txt);
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => selectionToggle('1')}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.dotSelectedContainer}>
                    {selectType === '1' && <View style={styles.dotSelected} />}
                  </View>
                  <Text style={styles.dotSelectedText}>{Language.trip}</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => selectionToggle('2')}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.dotSelectedContainer}>
                    {selectType === '2' && <View style={styles.dotSelected} />}
                  </View>
                  <Text style={styles.dotSelectedText}>{Language.holiday}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <AppEditText
              label={Language.description}
              value={description}
              error={descriptionError}
              errorText={descriptionErrorText}
              containerStyle={styles.descriptionTextContainer}
              onChangeText={txt => {
                if (txt.length > 0) {
                  setDescriptionError(false);
                  setDescriptionErrorText('');
                }
                setDescription(txt);
              }}
              numberOfLines={8}
            />
            {selectType === '1' && (
              <>
                <AppEditText
                  label={Language.street}
                  value={street}
                  error={streetError}
                  errorText={streetErrorText}
                  containerStyle={styles.descriptionTextContainer}
                  onChangeText={txt => {
                    if (txt.length > 0) {
                      setStreetError(false);
                      setStreetErrorText('');
                    }
                    setStreet(txt);
                  }}
                  numberOfLines={8}
                />
                <AppEditText
                  label={Language.postCode}
                  value={postCode}
                  error={postCodeError}
                  errorText={postCodeErrorText}
                  containerStyle={styles.descriptionTextContainer}
                  onChangeText={txt => {
                    if (txt.length > 0) {
                      setPostCodeError(false);
                      setPostCodeErrorText('');
                    }
                    setPostCode(txt);
                  }}
                  numberOfLines={8}
                />
              </>
            )}
            <View>
              {selectType === '1' && (
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <TouchableWithoutFeedback
                    onPress={() => toggleAuthorization()}>
                    <View style={styles.tickBox}>
                      {authorization === '1' && (
                        <ClassProfileButton
                          padding={0}
                          iconImageSize={13}
                          backgroundColor={colors.cream}
                          source={require('../../../assets/ic_done.png')}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.backgroundColor,
                      fontWeight: '600',
                    }}>
                    {Language.parentAuthorization}
                  </Text>
                </View>
              )}
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <TouchableWithoutFeedback onPress={() => toggleMessage()}>
                  <View style={styles.tickBox}>
                    {message === '1' && (
                      <ClassProfileButton
                        padding={0}
                        iconImageSize={13}
                        backgroundColor={colors.cream}
                        source={require('../../../assets/ic_done.png')}
                        onPress={() => toggleMessage()}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: colors.backgroundColor,
                  }}>
                  {Language.message}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.calendarContainer,
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
              markedDates={markedDate}
            />
          </View>
          {selectedDateError ? (
            <Text style={styles.calendarWarningText}>
              {selectedDateErrorText}
            </Text>
          ) : null}
          <View style={styles.scheduleContainer}>
            <AppEditText
              editable={false}
              label={Language.startTime}
              value={startTime}
              error={startTimeError}
              errorText={startTimeErrorText}
              containerStyle={styles.editTimeContainer}
              onPress={() => {
                setOpenStartTimeModal(true);
              }}
              onPressIn={() => {
                setOpenStartTimeModal(true);
              }}
            />

            <AppEditText
              editable={false}
              label={Language.endTime}
              value={endTime}
              error={endTimeError}
              errorText={endTimeErrorText}
              containerStyle={styles.editTimeContainer}
              onPress={() => setOpenEndTimeModal(true)}
              onPressIn={() => setOpenEndTimeModal(true)}
            />
            <View>
              {openStartTimeModal ? (
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
              ) : null}
              {openEndTimeModal ? (
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
              ) : null}
            </View>
          </View>
          {selectType === '1' && (
            <View style={{marginTop: 10}}>
              <AssignComponent
                images={classesImages}
                source={require('../../../assets/ic_classes.png')}
                title={Language.class}
                barStyle={{
                  backgroundColor: colors.dimblue,
                }}
                style={{
                  backgroundColor: colors.lightBlue,
                }}
                onPress={() => {
                  navigation.navigate(appNavigatorIDS.ASSIGNCLASSTOEVENT);
                }}
              />
              {classesIdError ? (
                <Text
                  style={[
                    styles.calendarWarningText,
                    {marginTop: -15, marginBottom: 15},
                  ]}>
                  {classesIdErrorText}
                </Text>
              ) : null}
            </View>
          )}
          <ProfileScreenBottomButton
            title={Language.addEvent}
            onPress={() => checkValidations()}
          />
        </ScrollView>
      </ScreenComponent>
    </>
  );
}
const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: colors.cream,
    marginBottom: 20,
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: colors.backgroundColor,
    borderWidth: 2,
  },
  editTextContainer: {
    width: '100%',
    height: 70,
    marginTop: 20,
  },
  descriptionTextContainer: {
    width: '100%',
    marginTop: 20,
  },
  tickBox: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: colors.backgroundColor,
    marginRight: 15,
    marginBottom: 20,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    marginHorizontal: 15,
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
    height: 14,
    width: 14,
    tintColor: colors.textColorPrimary,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'Bariol-Bold',
    color: colors.backgroundColor,
  },
  calendarWarningText: {
    color: colors.red,
    fontFamily: 'Bariol-Bold',
    fontSize: 12,
    marginLeft: 25,
  },
  editTimeContainer: {
    width: '48%',
    height: 70,
  },
  scheduleContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  dotSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.backgroundColor,
    margin: 3,
  },
  dotSelectedContainer: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotSelectedText: {
    fontSize: 16,
    marginLeft: 5,
    color: colors.textColorPrimary,
  },
});
export default CreateEventScreen;
