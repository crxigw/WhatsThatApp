import React, { Component } from "react";
import { FlatList, ActivityIndicator, Text, View, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class IndividualChat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      newMessage: '',
      chatDetails: []
    }
  }

  render() {
    const { chatID } = this.props.route.params;
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <TouchableOpacity style={styles.btn} onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headingText}>Indivual Chat Screen</Text>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.messages}>
          <Text>Chat ID: {chatID}</Text>
          <FlatList
          data={this.state.chatDetails}
          renderItem={({item}) => <><Text>{item.messages}</Text></>} />
        </View>


        <View style={styles.input}>
          <TextInput style={styles.textInput}
            placeholder="Type message here..."
            defaultValue={this.state.newMessage}
            onChangeText={newMessage => this.setState({ newMessage })} />
          <TouchableOpacity style={styles.btn} onPress={() => this.sendMessage()}>
            <Text style={styles.btnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  sendMessage() {
    if (!this.state.newMessage) {
      return;
    }
    this.messageNetworking()
  }

  async messageNetworking() {
    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID + '/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token')
      },
      body: JSON.stringify({ name: this.state.newMessage })
    })
      .then(async (response) => {
        if (response.status === 200) {
          this.loadDetails();
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

  async loadDetails() {
    return fetch('http://localhost:3333/api/1.0.0/chat/' + chatID, {
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
    .then(async(response) => {
      if( response.status === 200) {
        return response.json()
      } else if (response.status === 401) {
        await AsyncStorage.removeItem('whatsthat_session_token')
        await AsyncStorage.removeItem('whatsthat_user_id')
        this.props.navigation.navigate('Login')
      } else if (response.status === 403) {
        console.log('Forbidden')
      } else if (response.status === 500) {
        console.log('Server Error')
      } else {
        throw 'Something went wrong'
      }
    })
    .then((rJSON) => {
      this.setState({
        chatDetails: rJSON
      })
      console.log(rJSON)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  componentDidMount() {
    this.loadDetails()
  }

}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#53d88c',
  },
  heading: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  headingText: {
    color: 'white',
    fontSize: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  messages: {
    flex: 9,
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  btn: {
    borderRadius: 25,
    height: 50,
    borderWidth: 1,
    width: '10%',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginLeft: 10,
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
    marginBottom: 10,
    marginRight: 20,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 30,
    width: '70%',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  error: {
    color: 'red',
    fontWeight: '900'
  }
})