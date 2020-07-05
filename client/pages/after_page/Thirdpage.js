import * as React from 'react';
import { Button, View, Text, SafeAreaView } from 'react-native';
import { color } from 'react-native-reanimated';
//Not ready yet
const SecondPage = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 16,
              color: 'blue'
            }}>
              Area: 105302.625 m^2
              
           </Text>
           <Text style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 16,
              color: 'green'
            }}>Total water need is 315.906 m^3</Text>
          
         </View>
      </View>
    </SafeAreaView>
  );
}

export default SecondPage;