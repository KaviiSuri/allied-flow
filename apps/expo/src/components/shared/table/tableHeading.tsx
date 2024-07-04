import React from 'react'
import type { PropsWithChildren } from 'react'
import { View } from 'react-native'
import type { ViewStyle } from 'react-native'

function TableHeading(props: PropsWithChildren<{style? : ViewStyle}>) {
    const defaultStyles: ViewStyle = {
        flexDirection: 'row',
    }
  return (
    <View style={{...defaultStyles, ...props.style}}>
        {props.children}
    </View> 
  )
}

export default TableHeading
