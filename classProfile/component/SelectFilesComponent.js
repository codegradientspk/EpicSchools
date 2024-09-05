import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import colors from '../../../../config/colors';
import ClassProfileButton from './ClassProfileButton';

function SelectFilesComponent({source, title, onPress}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <ClassProfileButton
          backgroundColor={colors.lightBlue}
          source={require('../../../../assets/ic_folder.png')}
          iconColor={colors.dimblue}
          iconImageSize={25}
          padding={17}
        />
        <Text style={styles.title}>{title}</Text>
        <View style={{flex: 1}} />
        <ClassProfileButton
          backgroundColor={colors.dimblue}
          source={source}
          borderRadius={10}
          padding={7}
        />
        <View style={{marginRight: 15}} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Bariol-Bold',
    fontSize: 22,
    marginVertical: 24,
  },
});
export default SelectFilesComponent;
