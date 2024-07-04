import React from 'react'
import {View, Text, TextInput } from 'react-native'
import type { ViewStyle } from 'react-native'

interface FormTextInputProps {
    label: string,
    placeholder: string,
    numberOfLines?: number,
    style?: ViewStyle
}

function FormTextInput(props : FormTextInputProps) {
  return (
    <View style={props.style}>
        <Text style={{ fontSize: 14, fontWeight: 400, paddingBottom: 8, fontFamily: "Avenir", color: '#475467'}}>{props.label}</Text>
        <TextInput style={{fontFamily: "Avenir", fontSize: 14, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12,
          shadowOffset : { height: 1, width: 0}, shadowOpacity: 0.05, shadowColor: '#101828',
          }} placeholder={props.placeholder} placeholderTextColor='#94A3B8' multiline numberOfLines={props.numberOfLines ? props.numberOfLines : 1}/>
    </View>
  )
}

export default FormTextInput
