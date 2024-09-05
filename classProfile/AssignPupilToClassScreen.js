import React, {useEffect, useState} from 'react';
import {Alert, FlatList} from 'react-native';
import ScreenComponent from '../../../components/ScreenComponent';
import TopBackComponent from '../../../components/TopBackComponent';
import Language from '../../../config/Language';
import colors from '../../../config/colors';
import ProfileScreenBottomButton from './component/ProfileScreenBottomButton';
import AssignPupilToClassViewModal from '../ui/AssignPupilToClassViewModal';
import MyIndicator from '../../../components/MyIndicator';
import PupilViewModel from '../ui/PupilListViewModel';
import AssignPupilToClassCard from './component/AssignPupilToClassCard';
import {useIsFocused} from '@react-navigation/native';
import ClassProfileViewModel from '../ui/ClassProfileViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {localStorageEnum} from '../../../config/Enum';

function AssignPupilToClassScreen({navigation, route}) {
  var assignPupilToClass = AssignPupilToClassViewModal();
  var ClassProfileView = ClassProfileViewModel();
  var pupilsViewModel = PupilViewModel();
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedList, setSelectedList] = useState([]);
  const [allpupilArr, setAllPupilArr] = useState([]);

  const classId = route.params.classId;

  isMounted = true;
  useEffect(() => {
    if (isFocused) {
      if (classId !== 0) classesData();
      if (classId === 0) getPupilsData();
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const classesData = () => {
    ClassProfileView.getClassProfile(classId).then(response => {
      if (response.getClassProfileApi_.ok) {
        const daata__ = response.getClassProfileApi_.data.data;
        if (daata__ !== undefined) {
          if (isMounted) {
            const pupilData = daata__.pupil_list;
            const allPupils = daata__.all_pupils;
            const sel = [];
            pupilData.forEach(each => sel.push({pupilid: each.id, status: 1}));
            setAllPupilArr(allPupils);
            setSelectedList(sel);
          }
        }
      } else {
        alert(response.getClassProfileApi_.data.message);
      }
      setIsLoading(false);
    });
  };

  const addRemovePupil = item => {
    setSelectedList(prevSelectedList => {
      const updatedList = [...prevSelectedList];
      const index = updatedList.findIndex(doc => doc.pupilid === item.id);
      if (index !== -1) {
        updatedList[index] = {
          ...updatedList[index],
          status: updatedList[index].status === 0 ? 1 : 0,
        };
      } else {
        if (classId !== 0) {
          updatedList.push({pupilid: item.id, status: 1});
        } else {
          updatedList.push({
            pupilid: item.id,
            status: 1,
            user_image: item.user_image,
          });
        }
      }
      return updatedList;
    });
  };

  const AssignPupilToClass = () => {
    setIsLoading(true);
    assignPupilToClass
      .assignPupilToClass(classId, selectedList)
      .then(response => {
        setIsLoading(false);
        if (response.assignPupilToClassApi_.ok) {
          Alert.alert(
            '',
            response.assignPupilToClassApi_.data.message,
            [{text: 'OK', onPress: () => navigation.goBack()}],
            {
              cancelable: false,
            },
          );
        } else {
          Alert.alert(
            '',
            response.assignPupilToClassApi_.data.message,
            [{text: 'OK'}],
            {
              cancelable: false,
            },
          );
        }
      });
  };

  // used only while adding new class
  const getPupilsData = () => {
    pupilsViewModel.getPupil('').then(response => {
      const daata__ = response.getPupilApi_.data.data;
      if (response.getPupilApi_.ok) {
        if (isMounted) {
          setAllPupilArr(daata__.pupil_list);
          fetchAsyncData();
        }
      } else {
        alert(response.getPupilApi_.data.message);
      }
      setIsLoading(false);
    });
  };

  const fetchAsyncData = async () => {
    try {
      const selectedPupils = await AsyncStorage.getItem(
        localStorageEnum.SELECTEDPUPILS,
      );
      if (selectedPupils) {
        const pupilsList = JSON.parse(selectedPupils);
        setSelectedList(pupilsList);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // used only while adding new class
  const onSelect = async () => {
    const array = [];
    selectedList.forEach(each => {
      if (each.status === 1) {
        array.push(each);
      }
    });

    try {
      if (array.length > 0) {
        await AsyncStorage.setItem(
          localStorageEnum.SELECTEDPUPILS,
          JSON.stringify(array),
        );
        navigation.goBack();
      } else {
        alert('please Select atleast one Pupil');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScreenComponent style={{flex: 1}}>
      <TopBackComponent
        back={true}
        title={Language.assignPupils}
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          backgroundColor: colors.cream,
          marginBottom: 10,
        }}
      />
      <FlatList
        data={allpupilArr}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          const isSelected = selectedList.some(
            doc => doc.pupilid === item.id && doc.status === 1,
          );
          return (
            <AssignPupilToClassCard
              isSelected={isSelected}
              item={item}
              onPress={() => addRemovePupil(item)}
            />
          );
        }}
      />
      <ProfileScreenBottomButton
        title={Language.assignNewPupil}
        onPress={() => {
          classId === 0 ? onSelect() : AssignPupilToClass();
        }}
      />
      <MyIndicator visible={isLoading} />
    </ScreenComponent>
  );
}
export default AssignPupilToClassScreen;
