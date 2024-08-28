import { useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

export const QuotePanel = () => {
  const [terms, setTerms] = useState('')
  return (
    <>
      <View style={styles.quoteCard}>
        <Text style={styles.termsText}>Terms &amp; Conditions</Text>

        <TextInput
          style={styles.termsInput}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setTerms(text)}
          value={terms}
          placeholder="Enter remark here..."
        />

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  quoteCard: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: "100%",
    padding: 16,
  },
  termsInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: "#D0D5DD",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8
  },
  termsText: {
    color: "#344054",
    fontFamily: "Avenir",
    fontWeight: 500,
    fontSize: 14,
  }
})
