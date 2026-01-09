import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { images, fonts, Colors, styles } from '../Constant/Index'

const MainButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.btnView} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.titleText}>{title}</Text>
</TouchableOpacity>
  )
}

export default MainButton

