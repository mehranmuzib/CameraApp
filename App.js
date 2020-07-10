import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity,StyleSheet,Image } from 'react-native';
import { Camera } from 'expo-camera';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Slider } from 'react-native-elements';

const CameraScreen= (props)=> {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash,setFlash]= useState(Camera.Constants.FlashMode.off);
  const [cameraRef, setCameraRef] = useState(null)
  const [value,setValue]= useState(.5);
  const [ratio,setRatio]= useState("16:9")

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const flipcamera= () =>{


        if (type===Camera.Constants.Type.back){
          setType(Camera.Constants.Type.front)
        }
        else{
          setType(Camera.Constants.Type.back)
        }
    
  }

  const toggleflash= () =>{

    if (flash===Camera.Constants.FlashMode.off){
      setFlash(Camera.Constants.FlashMode.on)
    }
    else{
      setFlash(Camera.Constants.FlashMode.off)
    }
  }

  const takePicture = async () => {
    if(cameraRef){
        let data = await cameraRef.takePictureAsync();
        console.log(data.uri);
        props.navigation.navigate("home",{uri:data.uri})
      }
  }

  handleSliderChange = (value) =>{
    setValue(value)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>

<Slider value={value}  
      onValueChange={handleSliderChange}
      maximumValue={1}
      minimumValue={0} 
      />
                    
      <Camera style={{ flex: 5}} type={type} flashMode={flash} zoom={value} ratio={ratio} ref={ref => {
        setCameraRef(ref) ;
  }}>
      </Camera>
      
        <View
          style={{
            flex: 1,
            backgroundColor: '#3B312A',
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={()=> flipcamera()} style={styles.capture}>
            <Text style={{ fontSize: 15, alignSelf: 'center'  }}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignSelf: 'center'}} onPress={()=>takePicture()}>
            <View style={{ 
               borderWidth: 2,
               borderRadius:50,
               borderColor: 'white',
               height: 50,
               width:50,
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center'}}
            >
              <View style={{
                 borderWidth: 3,
                 borderRadius:50,
                 borderColor: '#925B5B',
                 height: 60,
                 width:60,
                 backgroundColor: 'white'}} >
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> toggleflash()} style={styles.capture}>
            <Text style={{ fontSize: 15, alignSelf: 'center'  }}> Flash </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: .5,
      backgroundColor: '#FFF',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });

  const Stack = createStackNavigator();

  function HomeScreen(props){
      return(
        <View style={{justifyContent : 'center' , alignItems: 'center', flex :1}}>
            <Image style={{width:300,height:350 }}
            source={{uri:props.route.params.uri}}
            />

        </View>
      )
  }

function MyStack() {
  return (
      <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Camera" component={CameraScreen} options={{
          title: 'Camera',
          headerStyle: {
            backgroundColor: '#3B312A',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/>
      <Stack.Screen name="home" component={HomeScreen} options={{
          title: 'Saved Picture',
          headerStyle: {
            backgroundColor: '#3B312A',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

  export default MyStack;