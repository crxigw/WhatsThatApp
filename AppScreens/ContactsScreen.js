import React, { Component } from "react";
import { FlatList, ActivityIndicator, Text, View, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class ContactsScreenApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userContacts: [],
      userBlockList: [],
      newContactID: '',
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter the user ID you wish to add"
          onChangeText={newContactID => this.setState({ newContactID })}
          defaultValue={this.state.newContactID}
        />

        <TouchableOpacity style={styles.btn}
          onPress={() => this.addContact()}>
          <Text style={styles.btnText}
            onPress={() => this.addContact()}>Add Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}
          onPress={() => this.props.navigation.navigate('Blocklist')}>
          <Text style={styles.btnText}
            onPress={() => this.props.navigation.navigate('Blocklist')}>Blocked contacts</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.userContacts}
          renderItem={({ item }) => <><Text style={styles.btnText}>{item.first_name + ' ' + item.last_name}</Text>
            <TouchableOpacity style={styles.btn2} onPress={() => this.deleteContact(item.user_id)}><Text style={styles.btnText}>Delete Contact</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn2} onPress={() => this.blockContact(item.user_id)}><Text style={styles.btnText}>Block Contact</Text></TouchableOpacity></>}
        />

      </View>
    );
  }

  async addContact() {
    let userid = this.state.newContactID
    return fetch('http://localhost:3333/api/1.0.0/user/' + userid + '/contact', {
      method: 'post',
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Added user ID: ' + userid)
          this.getUserContacts();
          this.getBlockedContacts();
        } else if (response.status === 400) {
          console.log('You cannot add yourself')
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else if (response.status === 404) {
          console.log('User not found')
        } else if (response.status === 500) {
          console.log('Server Erron')
        } else {
          throw 'Something went wrong'
        }
      })
  }

  deleteContact = async (user_id) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/contact', {
      method: 'delete',
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('User Deleted')
          this.getUserContacts();
          this.getBlockedContacts();
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else if (response.status === 500) {
          console.log('Server Erron')
        } else {
          throw 'Something went wrong'
        }
      })
  }

  blockContact = async (user_id) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + user_id + '/block', {
      method: 'post',
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('User blocked')
          this.getUserContacts();
          this.getBlockedContacts();
        } else if (response.status === 400) {
          console.log('You cannot block yourself')
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else if (response.status === 404) {
          console.log('User not found')
        } else if (response.status === 500) {
          console.log('Server Erron')
        } else {
          throw 'Something went wrong'
        }
      })
  }

  async getUserContacts() {
    return fetch('http://localhost:3333/api/1.0.0/contacts', {
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Loading User Contacts')
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
          userContacts: rJSON
        })
        console.log(rJSON)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  async getBlockedContacts() {
    return fetch('http://localhost:3333/api/1.0.0/blocked', {
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Loading blocked contacts')
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
          userBlockList: rJSON
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount() {
    this.getUserContacts();
    this.getBlockedContacts();
    console.log('Contacts Mounted')
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