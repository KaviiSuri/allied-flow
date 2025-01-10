import { SafeAreaView } from "react-native";
import { OrderPage } from "~/components/orders/OrderPage";

export default function Orders() {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <OrderPage type="REGULAR" />
    </SafeAreaView>
  );
}
