import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Accelerometer, Gyroscope, DeviceMotion } from 'expo-sensors';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SensorPuzzleProps {
  onComplete: () => void;
  config: {
    type: 'shake' | 'tilt' | 'flip' | 'mic' | 'rub' | 'hold-pull' | 'long-press' | 'rotate' | 'upside-down' | 'rapid-tap' | 'pattern-swipe';
    targetValue?: number;
    title?: string;
    description?: string;
    icon?: string;
  };
}

export const SensorPuzzle: React.FC<SensorPuzzleProps> = ({ onComplete, config }) => {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<'idle' | 'active' | 'success'>('idle');
  
  // Shared values for animations
  const animatedValue = useSharedValue(0);
  const secondaryValue = useSharedValue(0);
  
  // Refs for sensors
  const subscription = useRef<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    startSensor();
    return () => stopSensor();
  }, [config.type]);

  const startSensor = async () => {
    setIsActive(true);
    setProgress(0);
    setStatus('idle');

    switch (config.type) {
      case 'shake':
        Accelerometer.setUpdateInterval(100);
        subscription.current = Accelerometer.addListener(data => {
          const totalForce = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
          if (totalForce > 2.5) {
            setProgress(prev => {
              const next = Math.min(prev + 0.05, 1);
              if (next >= 1 && isActive) {
                completeLevel();
              }
              return next;
            });
          }
        });
        break;

      case 'tilt':
        Accelerometer.setUpdateInterval(100);
        subscription.current = Accelerometer.addListener(data => {
          // Normalize x to -1 to 1 for tilt
          const tiltX = data.x; // -1 to 1
          animatedValue.value = withSpring(tiltX * 100);
          
          // Win condition: stay in center (between -0.1 and 0.1)
          if (Math.abs(tiltX) < 0.1) {
            setProgress(prev => {
              const next = Math.min(prev + 0.02, 1);
              if (next >= 1 && isActive) completeLevel();
              return next;
            });
          } else {
            setProgress(0);
          }
        });
        break;

      case 'flip':
        Accelerometer.setUpdateInterval(200);
        subscription.current = Accelerometer.addListener(data => {
          // z ~ -1 means face down
          if (data.z < -0.8) {
            setProgress(prev => {
              const next = Math.min(prev + 0.1, 1);
              if (next >= 1 && isActive) completeLevel();
              return next;
            });
          } else {
            setProgress(0);
          }
        });
        break;

      case 'mic':
        try {
          const { status } = await Audio.requestPermissionsAsync();
          if (status !== 'granted') {
            toast.error('Microphone permission required for this level');
            return;
          }
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          
          const recording = new Audio.Recording();
          await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
          await recording.getStatusAsync();
          await recording.recordAsync();
          recordingRef.current = recording;

          const interval = setInterval(async () => {
            if (!recordingRef.current) return;
            const status = await recordingRef.current.getStatusAsync();
            if (status.canRecord && status.isRecording) {
                // status.metering is usually -160 to 0
                // Simple threshold for "blowing"
                const level = status.metering || -160;
                if (level > -20) {
                    setProgress(prev => {
                        const next = Math.min(prev + 0.1, 1);
                        if (next >= 1 && isActive) {
                            clearInterval(interval);
                            completeLevel();
                        }
                        return next;
                    });
                }
            }
          }, 100);
          subscription.current = { remove: () => {
              clearInterval(interval);
              recordingRef.current?.stopAndUnloadAsync();
          }};
        } catch (err) {
          console.error(err);
        }
        break;

      case 'rotate':
        Gyroscope.setUpdateInterval(100);
        subscription.current = Gyroscope.addListener(data => {
            // Integrate rotation
            animatedValue.value += data.z * 0.1;
            const normalized = Math.abs(animatedValue.value % (Math.PI * 2));
            // Target: rotate 360 degrees (approx 6.28 rad)
            if (normalized > 6) {
                completeLevel();
            }
        });
        break;

      case 'upside-down':
        Accelerometer.setUpdateInterval(200);
        subscription.current = Accelerometer.addListener(data => {
            // y ~ 1 means bottom up
            if (data.y > 0.8) {
                completeLevel();
            }
        });
        break;

      case 'rub':
        // Handled by touch events in render
        break;

      case 'long-press':
        // Handled by touch events
        break;
        
      case 'rapid-tap':
        // Handled by Pressable in render
        break;

      case 'pattern-swipe':
        // Handled by touch events in render
        break;
    }
  };

  const stopSensor = () => {
    setIsActive(false);
    if (subscription.current) {
      subscription.current.remove();
    }
    if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
    }
  };

  const completeLevel = () => {
    setIsActive(false);
    setStatus('success');
    toast.success('Brilliant! Level Clear! 🎉');
    setTimeout(() => onComplete(), 1000);
  };

  const renderContent = () => {
    switch (config.type) {
      case 'shake':
        return (
          <View style={styles.center}>
             <Animated.View style={[styles.robotContainer, { transform: [{ translateY: Math.sin(progress * 50) * 5 }] }]}>
                <MaterialCommunityIcons name="robot" size={100} color={progress > 0.8 ? '#4CAF50' : '#888'} />
                <View style={styles.batteryContainer}>
                   <View style={[styles.batteryFill, { width: `${progress * 100}%`, backgroundColor: progress > 0.8 ? '#4CAF50' : '#FF5252' }]} />
                </View>
                <Text style={styles.statusText}>{Math.round(progress * 100)}% Charged</Text>
             </Animated.View>
             <Text style={styles.instruction}>SHAKE TO CHARGE</Text>
          </View>
        );

      case 'tilt':
        const ballStyle = useAnimatedStyle(() => ({
          transform: [{ translateX: animatedValue.value }],
        }));
        return (
          <View style={styles.center}>
            <View style={styles.balanceBeam}>
               <Animated.View style={[styles.ball, ballStyle]} />
               <View style={styles.centerMark} />
            </View>
            <Text style={styles.instruction}>KEEP IT CENTERED</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        );

      case 'flip':
        return (
          <View style={styles.center}>
             <MaterialCommunityIcons 
                name={progress > 0.5 ? "sleep" : "sun-side"} 
                size={120} 
                color={progress > 0.5 ? "#5C6BC0" : "#FFB300"} 
             />
             <Text style={styles.instruction}>
                {progress > 0.5 ? "Goodnight..." : "IT'S TOO BRIGHT!"}
             </Text>
             <Text style={styles.hintText}>Try flipping the phone face down</Text>
          </View>
        );

      case 'mic':
        return (
          <View style={styles.center}>
             <MaterialCommunityIcons name="bowl-mix" size={100} color="#8D6E63" />
             {progress < 1 && (
                 <View style={[styles.steam, { opacity: 1 - progress }]}>
                    <MaterialCommunityIcons name="weather-windy" size={40} color="#ccc" />
                 </View>
             )}
             <Text style={styles.instruction}>COOL DOWN THE SOUP</Text>
             <Text style={styles.hintText}>Try blowing into the microphone</Text>
          </View>
        );

      case 'rotate':
        return (
          <View style={styles.center}>
             <Animated.View style={useAnimatedStyle(() => ({
                 transform: [{ rotate: `${animatedValue.value}rad` }]
             }))}>
                <MaterialCommunityIcons name="radio" size={100} color="#607D8B" />
             </Animated.View>
             <Text style={styles.instruction}>FIND THE SIGNAL</Text>
             <Text style={styles.hintText}>Rotate your phone like a dial</Text>
          </View>
        );

      case 'upside-down':
        return (
          <View style={styles.center}>
             <View style={styles.box}>
                <MaterialCommunityIcons name="circle" size={40} color="#FF5252" />
             </View>
             <Text style={styles.instruction}>GET THE BALL OUT</Text>
             <Text style={styles.hintText}>The exit is at the TOP</Text>
             <MaterialCommunityIcons name="arrow-up" size={40} color="#4CAF50" style={{ marginTop: 20 }} />
          </View>
        );

      case 'rub':
        return (
          <View style={styles.container}>
            <View style={styles.mirrorContainer}>
                {/* Revealable content */}
                <View style={styles.hiddenKey}>
                    <MaterialCommunityIcons name="key" size={80} color="#FFD700" />
                </View>
                {/* Fog Layer */}
                <View 
                    style={[styles.fogOverlay, { opacity: 1 - progress }]}
                    onStartShouldSetResponder={() => true}
                    onResponderMove={() => {
                        setProgress(p => Math.min(p + 0.02, 1));
                        if (progress >= 0.98 && isActive) completeLevel();
                    }}
                />
            </View>
            <Text style={styles.instruction}>WIPE THE MIRROR</Text>
          </View>
        );

        case 'long-press':
            return (
                <View style={styles.center}>
                    <Pressable 
                        onLongPress={() => completeLevel()}
                        delayLongPress={3000}
                        onPressIn={() => animatedValue.value = withTiming(1, { duration: 3000 })}
                        onPressOut={() => animatedValue.value = withTiming(0)}
                        style={styles.pressArea}
                    >
                        <Animated.View style={[styles.fillCircle, useAnimatedStyle(() => ({
                            transform: [{ scale: animatedValue.value }]
                        }))]} />
                        <MaterialCommunityIcons name="fingerprint" size={80} color="#fff" />
                    </Pressable>
                    <Text style={styles.instruction}>HOLD TO AUTHENTICATE</Text>
                </View>
            )

        case 'rapid-tap':
            return (
                <View style={styles.center}>
                    <Pressable 
                        onPress={() => {
                            const next = Math.min(progress + 0.05, 1);
                            setProgress(next);
                            if (next >= 1 && isActive) completeLevel();
                        }}
                        style={[styles.pressArea, { backgroundColor: '#FF5722' }]}
                    >
                        <MaterialCommunityIcons name="water-pump" size={80} color="#fff" />
                    </Pressable>
                    <Text style={styles.instruction}>TAP RAPIDLY TO PUMP</Text>
                    <View style={[styles.progressBar, { marginTop: 20 }]}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: '#FF5722' }]} />
                    </View>
                </View>
            )

        case 'pattern-swipe':
            return (
                <View style={styles.center}>
                    <View 
                        style={styles.swipeArea}
                        onStartShouldSetResponder={() => true}
                        onResponderRelease={(evt) => {
                            const { locationX, locationY } = evt.nativeEvent;
                            // Simple swipe detection or just multi-direction tap
                            // Let's make it a "Secret Sequence" tap level for simplicity
                            const next = Math.min(progress + 0.25, 1);
                            setProgress(next);
                            if (next >= 1 && isActive) completeLevel();
                        }}
                    >
                        <MaterialCommunityIcons name="lock-pattern" size={80} color="#fff" />
                    </View>
                    <Text style={styles.instruction}>UNLOCK THE PATTERN</Text>
                    <Text style={styles.hintText}>Tap the lock 5 times</Text>
                </View>
            )

      default:
        return <Text style={styles.statusText}>Sensor level {config.type} coming soon...</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    letterSpacing: 2,
  },
  hintText: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
  statusText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
  // Shake Styles
  robotContainer: {
    alignItems: 'center',
  },
  batteryContainer: {
    width: 100,
    height: 15,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
  },
  // Tilt Styles
  balanceBeam: {
    width: 250,
    height: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF5252',
    position: 'absolute',
    top: -30,
  },
  centerMark: {
    width: 40,
    height: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    position: 'absolute',
  },
  progressBar: {
      width: 200,
      height: 6,
      backgroundColor: '#333',
      borderRadius: 3,
      marginTop: 40,
      overflow: 'hidden',
  },
  progressFill: {
      height: '100%',
      backgroundColor: '#4CAF50',
  },
  // Rub Styles
  mirrorContainer: {
    width: 260,
    height: 260,
    backgroundColor: '#222',
    borderRadius: 130,
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenKey: {
    position: 'absolute',
  },
  fogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#888',
  },
  // Mic Styles
  steam: {
      position: 'absolute',
      top: -50,
  },
  // Long Press
  pressArea: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 4,
      borderColor: '#444',
  },
  fillCircle: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#2196F3',
      borderRadius: 75,
  },
  box: {
    width: 200,
    height: 200,
    borderWidth: 4,
    borderColor: '#fff',
    borderTopWidth: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  swipeArea: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E1BEE7',
  }
});
