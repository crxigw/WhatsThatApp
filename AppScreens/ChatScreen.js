import React, { Component } from "react";
import { FlatList, ActivityIndicator, Text, View, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatScreenApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userChats: [],
      name: '',
      error: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="New Chat Name"
          onChangeText={name => this.setState({ name })}
          defaultValue={this.state.name} />

        <TouchableOpacity style={styles.btn} onPress={() => this.validateChat()}>
          <Text style={styles.btnText}
            onPress={() => this.createChat()}>Create Chat</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.userChats}
          renderItem={({ item }) => <><Text style={styles.btnText}>{item.name}</Text>
            <TouchableOpacity style={styles.btn2} onPress={() => this.props.navigation.navigate('IndividalChat', {chatID: item.chat_id})}><Text style={styles.btnText}>View Chat</Text></TouchableOpacity>
          </>} />
      </View>
    );
  }

  validateChat() {
    if (!(this.state.name)) {
      this.setState({ error: "Chat name must be entered" })
      return;
    }
    this.createChat()
  }

  async createChat() {
    return fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      body: JSON.stringify({ name: this.state.name })
    })
      .then(async (response) => {
        if (response.status === 201) {
          console.log('Chat created')
          this.getChats();
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else if (response.status === 400) {
          console.log('Bad Request')
        } else if (response.status === 500) {
          console.log('Server Error')
        } else {
          throw 'Something went wrong'
        }
      })
  }

  async getChats() {
    return fetch('http://localhost:3333/api/1.0.0/chat', {
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Loading Chats')
          return response.json()
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else {
          throw 'Something has gone wrong'
        }
      })
      .then((rJSON) => {
        this.setState({
          userChats: rJSON
        })
        console.log(rJSON)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount() {
    console.log('Chatscreen mounted')
    this.getChats();
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#53d88c',
    //justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    borderRadius: 25,
    height: 50,
    borderWidth: 1,
    width: '20%',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#249f59",
    marginBottom: 10
  },
  btn2: {
    borderRadius: 25,
    height: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#249f59",
    marginBottom: 10
  },
  btnText: {
    color: 'white'
  },
  textInput: {
    borderRadius: 25,
    height: 50,
    padding: 10,
    borderWidth: 1,
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 30,
    width: '50%',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  error: {
    color: 'red',
    fontWeight: '900'
  }
})