import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../../../../config/colors';
import ClassProfileViewModel from '../../ui/ClassProfileViewModel';
import ClassProfileButton from './ClassProfileButton';

function AssignPupilCard({
  item,
  pupilSelected,
  setPupilSelected,
  imagesSelected,
  setImageselected,
  classId,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const isFocused = useIsFocused();
  const classProfileViewModel = ClassProfileViewModel();

  var isMounted = false;
  useEffect(() => {
    isMounted = true;
    if (isFocused) {
      getClassProfileData();
      return () => {
        isMounted = false;
      };
    }
  }, [isFocused]);

  const getClassProfileData = async () => {
    classProfileViewModel.getClassProfile(classId).then(response => {
      if (response.getClassProfileApi_.ok) {
        var daata__ = response.getClassProfileApi_.data;
        if (daata__.data !== undefined) {
          if (isMounted) {
            const assignedPulipIdArr = [];
            const assignedPupilImagesArr = [];
            const assignedPupilList = daata__.data.pupil_list;
            assignedPupilList.forEach(each => {
              assignedPulipIdArr.push(each.id);
              assignedPupilImagesArr.push(each.user_image);
            });

            if (assignedPulipIdArr.includes(item.id)) {
              setIsSelected(true);
            } else {
              setIsSelected(false);
            }
          }
        }
      }
    });
  };

  var onTap = () => {
    setIsSelected(!isSelected);
    if (isSelected) {
      var index = pupilSelected.indexOf(item.id);
      var imageIndex = imagesSelected.indexOf(item.user_image);
      if (index > -1) {
        pupilSelected.splice(index, 1);
      }
    } else {
      pupilSelected.push(item.id);
    }

    if (imageIndex > -1) {
      imagesSelected.splice(imageIndex, 1);
    } else {
      imagesSelected.push(item.user_image);
    }
    setImageselected(imagesSelected);
    setPupilSelected(pupilSelected);
  };

  return (
    <TouchableWithoutFeedback onPress={onTap}>
      <View style={styles.container}>
        <View style={styles.nestedContainer}>
          <View style={styles.leftView} />
          <View style={{marginHorizontal: 15}}>
            <View style={styles.imageView}>
              {item && (
                <Image source={{uri: item.user_image}} style={styles.image} />
              )}
            </View>
          </View>
          <View style={{marginVertical: 18}}>
            {item && <Text style={styles.text}>{item.user_name}</Text>}
            {item && <Text style={styles.text}>{item.user_lastname}</Text>}
          </View>
          <View style={{flex: 1}} />

          <ClassProfileButton
            source={
              isSelected
                ? require('../../../../assets/ic_check.png')
                : require('../../../../assets/ic_add_new.png')
            }
            backgroundColor="transparent"
            iconImageSize={32}
            padding={24}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    shadowColor: colors.gray,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  nestedContainer: {
    backgroundColor: colors.cream,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  leftView: {
    backgroundColor: colors.camel,
    height: '100%',
    width: 12,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Bariol-Bold',
    color: colors.backgroundColor,
  },
  imageView: {
    height: 55,
    width: 55,
    borderRadius: 27.5,
    backgroundColor: colors.white,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.camel,
  },
  image: {
    height: 55,
    width: 55,
  },
});
export default AssignPupilCard;
