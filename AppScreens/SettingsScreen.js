import React, { Component } from "react";
import { FlatList, ActivityIndicator, Text, View, Button, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SettingscreenApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: []
    }
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <TouchableOpacity style={styles.btn}
          onPress={() => this.logOut()}>
            <Text style={styles.btnText}
            onPress={() => this.logOut()}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  getUserData() {
    return fetch('http://localhost:3333/api/1.0.0/'+whatsthat_user_id)
    .then((response) => {
      if (response.status === 201) {
        
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
  btn : {
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
  }
});