import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';

export default class SettingscreenApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userData: [],
      isLoading: true,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      submitted: false
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder={this.state.userData.first_name}
          onChangeText={first_name => this.setState({ first_name })}
        />

        <TextInput
          style={styles.textInput}
          placeholder={this.state.userData.last_name}
          onChangeText={last_name => this.setState({ last_name })}
        />

        <TextInput
          style={styles.textInput}
          placeholder={this.state.userData.email}
          onChangeText={email => this.setState({ email })}
        />

        <TextInput
          style={styles.textInput}
          placeholder='New Password'
          onChangeText={password => this.setState({ password })}
        />

        <TouchableOpacity style={styles.btn}
          onPress={() => this.updateUserValidation()}>
          <Text style={styles.btnText}
            onPress={() => this.updateUserValidation()}>Update Info</Text>
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
    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token') }
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Loading User Data')
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
          userData: rJSON
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  componentDidMount() {
    console.log('Getting user data')
    this.getUserData();
  }

  async updateUserValidation() {
    let data = {}
    this.setState({ submitted: true })
    this.setState({ error: "" })

    if (this.state.userData.first_name != this.state.first_name) {
      if (this.state.first_name.trim !== ''){
      data["first_name"] = this.state.first_name
      }
    }

    if (this.state.userData.last_name != this.state.last_name) {
      if (this.state.last_name.trim() !== ''){
      data["last_name"] = this.state.last_name
      }
    }

    if (this.state.userData.email != this.state.email) {
      if (this.state.email.trim() !== ''){
      data["email"] = this.state.email
      }
    }

    if (this.state.password != '') {
      const passwordValidate = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
      if (!passwordValidate.test(this.state.password)) {
        this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" })
        return;
      } else {
        data["password"] = this.state.password
      }
    }

    console.log(data)

    let id = await AsyncStorage.getItem('whatsthat_user_id')

    return fetch('http://localhost:3333/api/1.0.0/user/' + id, {
      method: 'patch',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then (console.log(JSON.stringify(data)))
      .then((response) => {
        if (response.status === 200) {
          return response.json();
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
  },
  error: {
    color: 'red',
    fontWeight: '900'
  }
});