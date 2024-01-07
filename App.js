import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Button, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import { Audio } from 'expo-av';



const colors = ["#f7dc6f", "#A2D9CE", "#D7BDE2"]

export default function App() {
  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  function handleStartStop() {
    playSound();
    setIsActive(!isActive);
  }


  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    } 

    if (time === 0) {
      setIsActive(false);
      setIsWorking(!isWorking);
      setTime(isWorking ? 300 : 1500);
      
    }

    return () => clearInterval(interval);
  }, [isActive, time]);
  
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/mouseclick.wav')
    )
    await sound.playAsync();
  }

  console.log(currentTime)

  return (
  <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime]}]}>
    <View style={{
      flex: 1,
      paddingHorizontal: 15, 
      paddingTop: Platform.OS === 'android' && 30, 
      }}>
      <Text style={styles.text}>Pomodoro</Text>
      <Header 
      currentTime={currentTime} 
      setCurrentTime={setCurrentTime} 
      setTime={setTime}
      />
      <Timer time={time} />
      <TouchableOpacity onPress={handleStartStop} style={[styles.button, {backgroundColor: isActive ? "red" : "green"}]}>
        <Text style={{color: "white", fontWeight: "bold"}}>
        {isActive ? "STOP" : "START"}
        </Text>
      </TouchableOpacity>
    </View>
    
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cyan',
    
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#333333",
    padding: 15,
    marginTop: 15,
    borderRadius: 15,
    alignItems: "center",
  }
});
