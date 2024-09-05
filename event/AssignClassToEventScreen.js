import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import TopBackComponent from '../../../components/TopBackComponent';
import ScreenComponent from '../../../components/ScreenComponent';
import Language from '../../../config/Language';
import colors from '../../../config/colors';
import MarkAllButton from '../classProfile/component/MarkAllButton';
import ProfileScreenBottomButton from '../classProfile/component/ProfileScreenBottomButton';
import ClassListViewModel from '../ui/ClassListViewModel';
import {localStorageEnum} from '../../../config/Enum';
import AssignClassChildComponent from '../assign/component/AssignClassChildComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyIndicator from '../../../components/MyIndicator';

function AssignClassToEventScreen({navigation}) {
  const [classesData, setClassesData] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [allSelected, setAllSelected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  var classList = ClassListViewModel();
  const isFocused = useIsFocused();

  var isMounted = false;
  useEffect(() => {
    isMounted = true;
    if (isFocused) {
      getClassesList();
    }
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  const getClassesList = async () => {
    classList.getClassList('').then(response => {
      if (response.getClassListApi_.ok) {
        var daata__ = response.getClassListApi_.data;
        if (daata__.data !== undefined) {
          if (isMounted) {
            setClassesData(daata__.data.class_list);
            fetchAsyncData(daata__.data.class_list);
            setIsLoading(false);
          }
        }
      }
    });
  };

  const addRemovePupil = item => {
    setSelectedList(prevSelectedList => {
      const updatedList = [...prevSelectedList];
      const index = updatedList.findIndex(
        doc => doc.classid === item.class_uid,
      );
      if (index !== -1) {
        setAllSelected(true);
        updatedList[index] = {
          ...updatedList[index],
          status: updatedList[index].status === 0 ? 1 : 0,
        };
      } else {
        updatedList.push({
          classid: item.class_uid,
          status: 1,
        });
      }
      return updatedList;
    });
  };

  const fetchAsyncData = async data => {
    setIsLoading(true);
    try {
      const selectedClasses = await AsyncStorage.getItem(
        localStorageEnum.SELECTEDCLASSES,
      );
      if (selectedClasses) {
        const list = JSON.parse(selectedClasses);
        setSelectedList(list);
        if (list.length !== data.length) {
          setAllSelected(true);
        } else {
          setAllSelected(false);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onSelect = async () => {
    const array = [];
    selectedList.forEach(each => {
      if (each.status === 1) {
        array.push({
          classid: each.classid,
          image: 'http://3.8.35.155/storage/uploads/placeholder.png',
          status: each.status,
        });
      }
    });
    try {
      if (array.length > 0) {
        await AsyncStorage.setItem(
          localStorageEnum.SELECTEDCLASSES,
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

  const selectAlllClasses = () => {
    setAllSelected(!allSelected);
    if (allSelected) {
      const array = [];
      classesData.forEach(each =>
        array.push({
          classid: each.class_uid,
          status: 1,
        }),
      );
      setSelectedList(array);
    } else {
      setSelectedList([]);
    }
  };

  return (
    <>
      <ScreenComponent style={{flex: 1}}>
        <TopBackComponent
          back={true}
          title={Language.calendar}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            backgroundColor: colors.lightBlue,
          }}
        />
        <View
          style={{marginVertical: -20, flexDirection: 'row', marginStart: 15}}>
          <MarkAllButton
            buttonColor={allSelected ? colors.primaryColor : colors.lightRed}
            title={
              allSelected
                ? Language.selectAllClasses
                : Language.unselectAllClasses
            }
            onPress={() => selectAlllClasses()}
            source={
              allSelected
                ? require('../../../assets/ic_done.png')
                : require('../../../assets/ic_cancel.png')
            }
          />
        </View>
        <FlatList
          style={{marginBottom: 50}}
          showsVerticalScrollIndicator={false}
          data={classesData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            const isSelected = selectedList.some(
              doc => doc.classid === item.class_uid && doc.status === 1,
            );
            return (
              <AssignClassChildComponent
                item={item}
                isSelected={isSelected}
                onPress={() => addRemovePupil(item)}
              />
            );
          }}
        />

        <View style={styles.bottomButtonContainer}>
          <ProfileScreenBottomButton
            title={Language.save}
            onPress={() => onSelect()}
          />
        </View>
      </ScreenComponent>
      <MyIndicator visible={isLoading} />
    </>
  );
}

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    paddingTop: 20,
  },
});
export default AssignClassToEventScreen;
