import React from 'react'
import type  { PropsWithChildren }  from 'react'
import { Pressable, Text } from 'react-native'

function SecondaryButton(props : PropsWithChildren<{onPress? : () => void, text: string}>) {
  return (
    <Pressable style={{paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ffffff', borderRadius: 8, borderColor: '#D0D5DD', borderWidth: 1, shadowOffset : { height: 1, width: 0}, shadowOpacity: 0.05, shadowColor: '#101828'}}>
          <Text style={{fontWeight: 600, fontSize: 14, fontFamily: 'Avenir', color: '#344054  '}}>
          {props.text}
          </Text>
    </Pressable>
  )
}

export default SecondaryButton
