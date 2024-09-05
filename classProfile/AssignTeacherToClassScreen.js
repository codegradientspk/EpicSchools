import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenComponent from '../../../components/ScreenComponent';
import TopBackComponent from '../../../components/TopBackComponent';
import colors from '../../../config/colors';
import Language from '../../../config/Language';
import TeachersViewModel from '../ui/TeachersViewModel';
import ProfileScreenBottomButton from './component/ProfileScreenBottomButton';
import AssignTeacherCard from './component/AssignTeacherCard';
import MyIndicator from '../../../components/MyIndicator';
import {localStorageEnum} from '../../../config/Enum';

function AssignTeacherToClassScreen({navigation, route}) {
  var teachersViewModel = TeachersViewModel();
  const [teachersArr, setTeachersArr] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const assignedTeacherId = route.params.id;
  const [selectedTeacherId, setSelectedTeacherId] = useState(assignedTeacherId);
  const [selectedTeacherdata, setSelectedTeacherData] = useState({});

  var isMounted = false;
  useEffect(() => {
    isMounted = true;
    getTeachersData();
    return () => {
      isMounted = false;
    };
  }, [route]);

  var getTeachersData = async () => {
    teachersViewModel.getTeachers('').then(response => {
      if (response.getTeachersApi_.ok) {
        var daata__ = response.getTeachersApi_.data.data;
        if (daata__.teacher_list != undefined) {
          if (isMounted) {
            setTeachersArr(daata__.teacher_list);
            setIsLoading(false);
          }
        }
      } else {
        alert(response.getTeachersApi_.data.message);
        setIsLoading(false);
      }
    });
  };

  const handleTeacherSelection = data => {
    if (data !== null) {
      const obj = {id: data.id, user_image: data.user_image};
      setSelectedTeacherData(obj);
      setSelectedTeacherId(data.id);
    }
  };

  const onSelect = async () => {
    try {
      if (
        selectedTeacherId !== assignedTeacherId &&
        selectedTeacherId !== undefined &&
        selectedTeacherId !== null
      ) {
        await AsyncStorage.setItem(
          localStorageEnum.SELECTEDTECHERS,
          JSON.stringify(selectedTeacherdata),
        );
        navigation.goBack();
      } else if (
        selectedTeacherId === undefined ||
        selectedTeacherId === null
      ) {
        alert('A Teacher should be selected for Class');
      } else {
        alert('Teacher already assigned to class');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScreenComponent style={{flex: 1}}>
      <TopBackComponent
        back={true}
        title={Language.assignTeacher}
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          backgroundColor: colors.greenIcon,
          marginBottom: 10,
        }}
      />
      <FlatList
        data={teachersArr}
        keyExtractor={(String, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <AssignTeacherCard
              item={item}
              selectedItemId={selectedTeacherId}
              setSelectedItemId={setSelectedTeacherId}
              handleTeacherSelection={handleTeacherSelection}
            />
          );
        }}
      />
      <ProfileScreenBottomButton
        title={Language.assignToClass}
        onPress={() => onSelect()}
      />
      <MyIndicator visible={isLoading} />
    </ScreenComponent>
  );
}
export default AssignTeacherToClassScreen;
