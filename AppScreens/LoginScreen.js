import React, { Component } from "react";
import * as EmailValidator from 'email-validator';
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginScreenApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      submitted: false
    }
  }

  LoginButtonPress() {
    this.setState({ submitted: true })
    this.setState({ error: "" })

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: "Must enter email and password" })
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: "Must enter valid email" })
      return;
    }
    console.log("Button clicked: " + this.state.email + " " + this.state.password)
    console.log("Locked and loaded. Target: API")
    this.setState({ submitted: false })
    this.LoginNetworking()
  }

  LoginNetworking() {
    let signinData = {
      email: this.state.email,
      password: this.state.password
    }
    console.log(signinData)
    return fetch('http://localhost:3333/api/1.0.0/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinData)
      })
      .then((response) => {
        if (response.status===200) {
          return response.json();
        } else if (response.status === 400) {
          throw "Invalid email or password"
        } else {
          throw "Something went wrong"
        }
        })
        .then(async (rJSON) => {
          console.log(rJSON)
          try{
            await AsyncStorage.setItem("whatsthat_user_id", rJSON.id)
            await AsyncStorage.setItem("whatsthat_session_token", rJSON.token)
            this.setState({"submitted": false});
            this.props.navigation.navigate("AppTabNavi")
          } catch{
            throw "Something went wrong"
          }
        })
      } 

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('./Logo.png')} />
        <TextInput
          style={styles.textInput}
          placeholder='Enter Email'
          onChangeText={email => this.setState({ email })}
          defaultValue={this.state.email}
        />

        <>
          {this.state.submitted && !this.state.email &&
            <Text style={styles.error}>*Email is needed</Text>}
        </>

        <TextInput
          style={styles.textInput}
          placeholder="Enter password"
          onChangeText={password => this.setState({ password })}
          defaultValue={this.state.password}
          secureTextEntry
        />

        <>
          {this.state.submitted && !this.state.password &&
            <Text style={styles.error}>*Password is required</Text>
          }
        </>

        <TouchableOpacity style={styles.loginbtn}
          onPress={() => this.LoginButtonPress()}>
          <Text
            style={styles.buttonText}
            onPress={() => this.LoginButtonPress()}>Login</Text>
        </TouchableOpacity>

        <>
          {this.state.error &&
            <Text style={styles.error}>{this.state.error}</Text>
          }
        </>

        <TouchableOpacity style={styles.loginbtn}>
          <Text
            style={styles.buttonText}
            onPress={() => this.props.navigation.navigate('Create Account')}>Create an Account</Text>
        </TouchableOpacity>


      </View>
    );
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
  loginbtn: {
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
  textInput: {
    borderRadius: 25,
    height: 50,
    padding: 10,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 30,
    width: '20%',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  buttonText: {
    color: 'white',
    textDecorationLine: 'underline'
  },
  error: {
    color: "red",
    fontWeight: '900'
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  }
});