import { StyleSheet, View } from "react-native"
import { TabProvider } from "./shared/tabs/tabContext"
import { Tab, TabList } from "./shared/tabs/tabList"
import { TabPanel } from "./shared/tabs/tabPanel"
import { DetailsSection } from "./inquiryDetails/details"
import { CommentsSection } from "./inquiryDetails/comments"
import { ActivitySection } from "./inquiryDetails/activity"


export const DetailsTabs = () => {
  return (
    <>
      <TabProvider defaultValue="details">
        <View style={{ backgroundColor: "#FFF", flex: 1, paddingTop: 8 }}>
          <TabList >
            <Tab label="Details" value="details" />
            <Tab label="Comments" value="comments" />
            <Tab label="Activity" value="activity" />
          </TabList>
          <TabPanel value="details">
            <DetailsSection />
          </TabPanel>
          <TabPanel value="comments">
            <CommentsSection />
          </TabPanel>
          <TabPanel value="activity">
            <ActivitySection />
          </TabPanel>
        </View>
      </TabProvider>
    </>
  )
}

const styles = StyleSheet.create({

})
