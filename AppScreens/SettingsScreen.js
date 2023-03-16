import React, { Component } from "react";
import { FlatList, ActivityIndicator, Text, View, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SettingscreenApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: [],
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder='first_name'
          onChangeText={this.setState.first_name}
        />
        <TextInput
          style={styles.textInput}
          placeholder='last_name'
          onChangeText={this.setState.last_name}
        />
        <TextInput
          style={styles.textInput}
          placeholder='email'
          onChangeText={this.setState.email}
        />

        <TextInput
          style={styles.textInput}
          placeholder='password'
          onChangeText={this.setState.password}
        />

        <TouchableOpacity style={styles.btn}
          onPress={() => this.updateUser()}>
          <Text style={styles.btnText}
            onPress={() => this.updateUser()}>Update Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}
          onPress={() => this.logOut()}>
          <Text style={styles.btnText}
            onPress={() => this.logOut()}>Log Out</Text>
        </TouchableOpacity>
      </View>
    )
  }



  async getUserData() {
    let id = await AsyncStorage.getItem('whatsthat_user_id')
    return fetch('http://localhost:3333/api/1.0.0/' + id, {
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('This works, load data')
            .then((responseJSON) => {
              this.setState({
                isLoading: false,
                userData: responseJSON
              })
            })
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else {
          throw 'Something has gone wrong'
        }
      })
  }

  async logOut() {
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else if (response.status === 401) {
          await AsyncStorage.removeItem('whatsthat_session_token')
          await AsyncStorage.removeItem('whatsthat_user_id')
          this.props.navigation.navigate('Login')
        } else {
          throw 'Something has gone wrong'
        }
      })
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#53d88c',
    justifyContent: 'center',
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
  btnText: {
    color: 'white'
  },
  textInput: {
    borderRadius: 25,
    height: 50,
    padding: 10,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'white'
  }
});