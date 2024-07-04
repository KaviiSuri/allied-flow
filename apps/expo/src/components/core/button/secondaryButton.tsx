import React from 'react'
import type { PressableProps } from 'react-native'
import { Pressable, Text } from 'react-native'

function SecondaryButton(props : {onPress? : PressableProps["onPress"], text : string}) {
  return (
    <Pressable style={{paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ffffff', borderRadius: 8, borderColor: '#D0D5DD', borderWidth: 1, shadowOffset : { height: 1, width: 0}, shadowOpacity: 0.05, shadowColor: '#101828'}} onPress={props.onPress}>
          <Text style={{fontWeight: 600, fontSize: 14, fontFamily: 'Avenir', color: '#344054  '}}>
          {props.text}
          </Text>
    </Pressable>
  )
}

export default SecondaryButton
