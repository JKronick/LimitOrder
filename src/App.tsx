import { registerRootComponent } from "expo";
import { RecoilRoot } from "recoil";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts, Inter_900Black } from "@expo-google-fonts/dev";

import { ExamplesScreens } from "./screens/ExamplesScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { TokenListNavigator } from "./screens/TokenNavigator";
import { LimitOrderScreen } from "./screens/LimitOrderScreen";
import { useState } from "react";
import OrderContextProvider from "./contexts/OrderContext";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  let [orders, setOrders] = useState(0)
  let num = 0
  return (
    <OrderContextProvider>
      <Tab.Navigator
        initialRouteName="Orders"
        screenOptions={{
          tabBarActiveTintColor: "#e91e63",
        }}
      >
        <Tab.Screen
          name="Orders"
          component={LimitOrderScreen}
          options={{
            tabBarLabel: "Orders",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bank" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </OrderContextProvider>
  );
}

function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <RecoilRoot>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default registerRootComponent(App);
