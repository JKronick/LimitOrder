import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Animated,
  Button,
  Pressable,
  StyleSheet,
  TextInput
} from "react-native";
import tw from "twrnc";
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "../components/Screen";
import { TokenRow } from "../components/TokenRow";
import { NavigationContainer, NavigationContainerRefContext } from "@react-navigation/native";
import { useContext } from "react";
import { OrderContext } from "../contexts/OrderContext";
import { Oregano_400Regular } from "@expo-google-fonts/dev";
import { TokenListNavigator } from "./TokenNavigator";

type RootStackParamList = {
  List: {setToken: Function};
  Detail: { id: string };
  Orders: { orders: Array<Object> };
  UpdateOrder: { id: Number };
  Temp: {id: number};
  Temp1: {id: number}
};

const Stack = createStackNavigator<RootStackParamList>();

function FullScreenLoadingIndicator() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

async function fetchTokenData(count = 20) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=true&price_change_percentage=24h`;
  return fetch(url).then((r) => r.json());
}

function useTokenData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await fetchTokenData();
      console.log("data", data);
      setData(data);
      setLoading(false);
    }

    fetch();
  }, []);

  return { data, loading };
}

function List({
  navigation,
  route
}: NativeStackScreenProps<RootStackParamList, "List">) {
  const { data, loading } = useTokenData();

  const {setToken} = route.params

  const handlePressTokenRow = (id: string) => {
    let token = data.find((token) => token.id == id)
    setToken(token)
    navigation.pop()
  };

  if (loading) {
    return <FullScreenLoadingIndicator />;
  }

  const ItemSeparatorComponent = () => (
    <View
      style={{ marginVertical: 8, borderColor: "#eee", borderBottomWidth: 1 }}
    />
  );

  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={({ item }) => {
          return (
            <TokenRow
              id={item.id}
              name={item.name}
              price={item.current_price}
              imageUrl={item.image}
              onPress={handlePressTokenRow}
            />
          );
        }}
      />
    </Screen>
  );
}

function Detail({
  route,
}: NativeStackScreenProps<RootStackParamList, "Detail">) {
  const { data, loading } = useTokenData();
  const { id } = route.params;

  if (loading) {
    return <FullScreenLoadingIndicator />;
  }

  const item = data.find((d) => d.id === id);

  if (!item) {
    return null;
  }

  return (
    <Screen>
      <View style={tw`bg-yellow-100 items-center justify-center p-4`}>
        <Image source={{ uri: item.image }} style={tw`w-8 h-8 rounded m-4`} />
        <Text style={tw`font-bold text-lg`}>{item.name}</Text>
        <Text style={tw`font-bold text-lg`}>Symbol: {item.symbol}</Text>
        <Text style={tw`font-bold text-lg`}>
          Total supply: {item.total_supply}
        </Text>
        <Text style={tw`font-bold text-lg`}>All time high: {item.ath}</Text>
      </View>
    </Screen>
  );
}

const forSlide: StackCardStyleInterpolator = ({
  current,
  next,
  inverted,
  layouts: { screen },
}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0,
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: "clamp",
            }),
            inverted,
          ),
        },
      ],
    },
  };
};

const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'gray',
      color: 'black',
      width: '20%'
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200
      },
      container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      image: {
        width: 20,
        height: 20,
        borderRadius: 22,
        marginRight: 12,
      },
      name: {
        fontSize: 16,
        fontWeight: "500",
        color: "white"
      },
      price: {
        fontSize: 18,
      },
      tokenSelector:{
            fontSize: 18,
            color: "white",
            height: 40,
            width: 150,
            flexDirection: "row",
            borderRadius: 10,
            margin: 10,
            padding: 10,
            alignItems: "center",
            justifyContent: "space-between"
      },
      tokenSelectorContainer: {
          width: "100%",
          padding: 20,
          backgroundColor: "#1d1e26",
          flexDirection: "row",
          borderRadius: 10,
          margin: 10
      },
      priceContainer: {
        width: "50%",
        padding: 20,
        backgroundColor: "#1d1e26",
        borderRadius: 10,
        margin: 10
      },
      updateOrderButton: {
          width: "100%",
          alignItems: "center",
          backgroundColor: "#161830",
          margin: 10,
          height: 40,
          padding: 10,
          borderRadius: 10
      }
  });

function LimitOrderList({
    navigation,
    route
  }: NativeStackScreenProps<RootStackParamList, "Orders">){
    let {orders, setOrders} = useContext(OrderContext)
    let order = orders[0]
    const ItemSeparatorComponent = () => (
        <View
          style={{ marginVertical: 8, borderColor: "#eee", borderBottomWidth: 1 }}
        />
      );
    return (
        <View>
            <FlatList
            style={{ flex: 1 }}
            data={orders}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={({ item }) => {
                let id = item.id
                return (
                    <View style={{flex: 1}}>
                        <Text>
                            {item.payToken.name} &#8594; {item.recieveToken.name} at {item.price}
                        </Text>
                        <Pressable onPress={() => navigation.push("UpdateOrder", {id})} style={styles.button}>
                                Edit
                        </Pressable>
                    </View>
                );
                }}
            />
            <Button title="Add new order" onPress={() => navigation.push("UpdateOrder", {id: -1})}></Button>
        </View>

    )
}
type Props = {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    onPress: (id: string) => void;
  };

function UpdateOrder({
    navigation,
    route
}: NativeStackScreenProps<RootStackParamList, "UpdateOrder">){
    let {orders, setOrders} = useContext(OrderContext)
    let [recieveToken, setRecieveToken] = useState({"name": ""})
    let [payToken, setPayToken] = useState({"name": ""})

    let {data, loading} = useTokenData()

    let { id } = route.params
    let updatedOrders = JSON.parse(JSON.stringify(orders))
    let [quantity, setQuantity] = useState(0)
    let [price, setPrice] = useState(0)
    if (id == -1){
        console.log(id)
        id = updatedOrders.length + 10
        updatedOrders.push({"name": "", "id": id, "quantity": 0})
    }
        
    let order = updatedOrders.find((order)=>order.id == id)

    const TokenSelector = ({token, setToken}: {token: Object, setToken: Function}) => {
        return (
        <Pressable onPress={() => navigation.push("List", {setToken})} style={styles.tokenSelector}>
            {token.name == "" ? 
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{color: "white", fontWeight: 800}}>
                    Select a token  &#9660;
                </Text>
            </View>
            :
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={{ uri: token.image }} style={styles.image} />
                <Text style={styles.name}>{token.name}  &#9660; </Text>
            </View>
            }
        </Pressable>
        )
    }

    if (loading) {
        return <FullScreenLoadingIndicator />;
      }

    return (
        <View  style={{backgroundColor: "#404552", padding: 20, height: "100%"}}>
            <Text style={{color: "white", fontWeight:"700"}}>
                You're paying
            </Text>
            <View style={styles.tokenSelectorContainer}>
                <TokenSelector token={payToken}  setToken={setPayToken} ></TokenSelector>
                <View>
                    <TextInput 
                        placeholder="0" 
                        style={{height: 30, margin: 10, color: "white", fontWeight: "700"}}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            <View style={styles.priceContainer}>
                <Text style={{color: "white", fontWeight:"700"}}>
                    SOL Price
                </Text>
                <View style={{width: "100%", flexDirection: "row"}}>
                    <TextInput
                        style={{height: 30, margin: 10, color: "white", fontWeight: "700"}}
                        onChangeText={setPrice}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                    <Text style={{color: "white", fontWeight: "700"}}>{payToken.name}</Text>
                </View>
            </View>
            <Text style={{color: "white", fontWeight:"700"}}>
                To Receive
            </Text>
            <View style={styles.tokenSelectorContainer}>
                <TokenSelector token={recieveToken} setToken={setRecieveToken} ></TokenSelector>
                <View>
                    <Text style={{height: 30, margin: 10, color: "white", fontWeight: "700"}}> 
                    {false ? "" : quantity/price}
                    </Text>
                </View>
            </View>

            <Pressable onPress={() => {
                order.recieveToken = recieveToken
                order.payToken = payToken
                order.price = price
                setOrders(updatedOrders)
                navigation.pop()
                }}
                style={styles.updateOrderButton}
            >
                <Text style={{color: "white", fontWeight: "700"}}>
                    Save
                </Text>
            </Pressable>
        </View>
    )
}

export const LimitOrderScreen = () => {
    return (
        <Stack.Navigator
        screenOptions={{
        animationEnabled: true,
        cardStyleInterpolator: forSlide,
        }}
    >
        <Stack.Screen
        name="Orders"
        component={LimitOrderList}
        options={{ title: "Order List" }}
        />
        <Stack.Screen
        name="UpdateOrder"
        component={UpdateOrder}
        options={{ title: "Update List" }}
        />
        <Stack.Screen
        name = "List"
        component={List}
        options={{title: "Select a Token"}}
        />

    </Stack.Navigator>
    );
};
