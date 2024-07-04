import React from 'react'
import type  { PropsWithChildren }  from 'react'
import { Pressable, Text } from 'react-native'

function PrimaryButton(props : PropsWithChildren<{onPress? : void, text: string}>) {
  return (
    <Pressable style={{paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#2F80F5', borderRadius: 8}}>
          <Text style={{fontWeight: 600, fontSize: 14, color: 'white'}}>
          {props.text}
          </Text>
    </Pressable>
  )
}

export default PrimaryButton
