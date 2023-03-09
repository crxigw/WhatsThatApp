import React, { Component } from "react";
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as EmailValidator from 'email-validator';

export default class SignUpScreenApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      error: '',
      submitted: false
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('./Logo.png')} />
        <TextInput
          style={styles.textInput}
          placeholder='First Name'
          onChangeText={first_name => this.setState({ first_name })}
          value={this.state.first_name}
        />

        <>
          {this.state.submitted && !this.state.first_name &&
            <Text style={styles.error}>*First Name is needed</Text>}
        </>

        <TextInput
          style={styles.textInput}
          placeholder='Last Name'
          onChangeText={last_name => this.setState({ last_name })}
          value={this.state.last_name}
        />
        <>
          {this.state.submitted && !this.state.last_name &&
            <Text style={styles.error}>*Last Name is needed</Text>}
        </>

        <TextInput
          style={styles.textInput}
          placeholder='Email'
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <>
          {this.state.submitted && !this.state.email &&
            <Text style={styles.error}>*Email is needed</Text>}
        </>

        <TextInput
          style={styles.textInput}
          placeholder='Password'
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <>
          {this.state.submitted && !this.state.password &&
            <Text style={styles.error}>*Password is needed</Text>}
        </>

        <TouchableOpacity style={styles.signupbtn}
          onPress={() => this.SignUpButtonPress()}>
          <Text style={styles.buttonText}
            onPress={() => this.SignUpButtonPress()}>  Create Account  </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupbtn}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={styles.buttonText}
            onPress={() => this.props.navigation.navigate('Login')}>  Already have an account?  </Text>
        </TouchableOpacity>
      </View>
    );
  }

  SignUpButtonPress() {
    this.setState({ submitted: true })
    this.setState({ error: "" })

    if (!(this.state.first_name && this.state.last_name && this.state.email && this.state.password)) {
      this.setState({ error: "Must fill out all text fields" })
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: "Must enter a valid email" })
      return;
    }

    const passwordValidate = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
    if (!passwordValidate.test(this.state.password)) {
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" })
      return;
    }

    console.log("Button clicked")
    console.log("API I'm gunning for you")
    this.SignUpNetworking()
  }

  SignUpNetworking() {
    let userData = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    };

    return fetch('http://localhost:3333/api/1.0.0/user/', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 400) {
          throw "Email already exists or use stronger password"
        } else {
          throw "Something went wrong"
        }
      })
      .then((rJSON) => {
        console.log(rJSON)
        this.setState({ "error": "User created" })
        this.setState({ "submitted": false });
        this.props.navigation.navigate("Login")
      })
      .catch((error) => {
        this.setState({ "error": error })
        this.setState({ "submitted": false });
      })
  };


}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#53d88c',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signupbtn: {
    borderRadius: 25,
    height: 50,
    borderWidth: 1,
    //width: '20%',
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
    alignItems: 'center',
    backgroundColor: 'white'
  },
  login: {
    justifyContent: "center",
    textDecorationLine: "underline"
  },
  button: {
    alignContent: 'center',
    justifyContent: "center",
  },
  buttonText: {
    color: 'white'
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