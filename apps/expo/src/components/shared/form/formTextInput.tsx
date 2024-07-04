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
        <Text style={{ fontSize: 14, fontWeight: 400, paddingBottom: 8 }}>{props.label}</Text>
        <TextInput style={{fontSize: 14, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12 }} placeholder={props.placeholder} multiline numberOfLines={props.numberOfLines ? props.numberOfLines : 1}/>
    </View>
  )
}

export default FormTextInput
