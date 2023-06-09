import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
} from "react-native";
import config from "../../Config/config";
import AppLoader from "../AppLoader";

const ListScreen = ({ route, navigation }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState("");
  const nameHandler = (value) => setName(value);
  const noteHandler = (value) => setNote(value);

  useEffect(() => {
    setPending(true);
    fetch(config.BASE_URL + "/list/" + route.params.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + route.params.token,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setName(response.name);
        setNote(response.note);
        setPending(false);
      });
    setPending(true);
    fetch(config.BASE_URL + "/item/" + route.params.id)
      .then((res) => res.json())
      .then((response) => {
        setItems(response);
        setPending(false);
      });
  }, []);

  const edit = () => {
    setPending(true);
    fetch(config.BASE_URL + "/list/" + route.params.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        note,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setPending(false);
      });
  };
  function deleteItem(id) {
    console.log(id);
    setPending(true);
    fetch(config.BASE_URL + "/item/" + id, { method: "DELETE" }).then(
      (response) => {
        fetch(config.BASE_URL + "/item/" + route.params.id)
          .then((res) => res.json())
          .then((result) => {
            setItems(result);
            setPending(false);
          });
      }
    );
  }

  const addItem = () => {
    navigation.navigate("Components", {
      token: route.params.token,
      mode: 2,
      listId: route.params.id,
    });
  };

  return (
    <View>
      {!pending ? (
        <View style={styles.appContainer}>
          <View>
            <TextInput
              style={styles.textInputContainer}
              placeholder="Name"
              value={name}
              onChangeText={nameHandler}
              onEndEditing={edit}
            />
            <TextInput
              style={styles.textInputContainer2}
              placeholder="Note..."
              value={note}
              onChangeText={noteHandler}
              onEndEditing={edit}
            />
          </View>
          <FlatList
            data={items}
            renderItem={(itemData) => {
              return (
                <View style={styles.goalItem}>
                  <View style={styles.ListsContainer}>
                    <Text style={styles.listTextContainer}>
                      {itemData.item.name}
                    </Text>
                    <Text style={styles.listTextContainer}>
                      {itemData.item.quantity}
                    </Text>
                    <Button
                      title="-"
                      onPress={() => {
                        deleteItem(itemData.item.id);
                      }}
                    ></Button>
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => {
              return item.id;
            }}
          />
          <View>
            <Button
              title="Add to List"
              onPress={() => {
                addItem();
              }}
            ></Button>
          </View>
        </View>
      ) : (
        <AppLoader />
      )}
    </View>
  );
};

export default ListScreen;
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 50,
    paddingRight: 16,
    paddingLeft: 16,
  },
  inputContainer: {
    flex: 2,
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    width: "80%",
    marginRight: 8,
    padding: 8,
    justifyContent: "center",
    paddingLeft: 15,
    borderRadius: 6,
    width: 265,
    marginLeft: 10,
    backgroundColor: "#CBB279",
    height: 40,
  },
  textInputContainer: {
    borderColor: "grey",
    borderRadius: 6,
    borderWidth: 1,
    width: "90%",
    margin: 5,
    paddingLeft: 10,
  },
  textInputContainer2: {
    borderColor: "grey",
    borderRadius: 6,
    borderWidth: 1,
    width: "90%",
    margin: 5,
    height: 100,
    paddingLeft: 10,
  },
  addGoal: {
    borderWidth: 1,
    borderColor: "#cccccc",
    marginLeft: 10,
    color: "white",
    backgroundColor: "yellow",
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
  },
  goalsContainer: {
    flex: 19,
  },
  goalItem: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#537188",
    color: "white",
    height: 35,
    justifyContent: "center",
    paddingLeft: 15,
  },
  goalText: {
    color: "white",
  },

  ListsContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
  },
  listTextContainer: {
    color: "white",
  },
});
