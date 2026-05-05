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
  const shakeValue = useSharedValue(0);

  // Reanimated styles (Must be at top level)
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeValue.value }]
  }));

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value }]
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animatedValue.value}rad` }]
  }));

  const fillCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedValue.value }]
  }));

  // Refs for sensors
  const subscription = useRef<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    startSensor();
    return () => stopSensor();
  }, [config.type]);

  // Decay for rapid-tap
  useEffect(() => {
    if (config.type === 'rapid-tap' && isActive) {
      const interval = setInterval(() => {
        setProgress(p => Math.max(p - 0.005, 0));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [config.type, isActive]);

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
          const permission = await Audio.getPermissionsAsync();
          let status = permission.status;

          if (status !== 'granted') {
            const request = await Audio.requestPermissionsAsync();
            status = request.status;
          }

          if (status !== 'granted') {
            toast.error('Microphone permission required! Please enable it in settings.');
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
          subscription.current = {
            remove: () => {
              clearInterval(interval);
              recordingRef.current?.stopAndUnloadAsync();
            }
          };
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
          // y ~ -1 is normal upright for some devices, check orientation
          // We want the phone to be turned "downward" (upside down)
          // Typically y ~ 1 when upside down
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

      case 'hold-pull':
        // Handled by two-finger touch
        break;
    }
  };

  const stopSensor = async () => {
    setIsActive(false);
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (e) { }
      recordingRef.current = null;
    }
  };

  const completeLevel = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsActive(false);
    stopSensor(); // Immediate cleanup
    setStatus('success');
    toast.success('Brilliant! Level Clear! 🎉');
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 800);
  };

  const renderContent = () => {
    switch (config.type) {
      case 'shake':
        return (
          <View style={styles.center}>
            <Animated.View style={shakeStyle}>
              <MaterialCommunityIcons name="robot" size={120} color={progress > 0.8 ? "#4CAF50" : "#757575"} />
              <View style={styles.batteryContainer}>
                <View style={[styles.batteryFill, { width: `${progress * 100}%`, backgroundColor: progress > 0.8 ? '#4CAF50' : '#FF5252' }]} />
              </View>
              <Text style={styles.statusText}>{Math.round(progress * 100)}% Charged</Text>
            </Animated.View>
            <Text style={styles.instruction}>SHAKE TO CHARGE</Text>
          </View>
        );

      case 'tilt':
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
        const isDark = progress > 0.5 || status === 'success';
        return (
          <View style={[styles.center, { flex: 1, width: '100%', backgroundColor: isDark ? '#1A237E' : '#FFF9C4', borderRadius: 20 }]}>
            <View style={styles.owlContainer}>
              <Text style={{ fontSize: 80 }}>{isDark ? '😴' : '🦉'}</Text>
              <MaterialCommunityIcons
                name={isDark ? "weather-night" : "weather-sunny"}
                size={60}
                color={isDark ? "#E8EAF6" : "#FBC02D"}
                style={styles.weatherIcon}
              />
            </View>
            <Text style={[styles.instruction, { color: isDark ? '#fff' : '#333' }]}>
              {isDark ? "Goodnight..." : "IT'S TOO BRIGHT!"}
            </Text>
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
            <Pressable
              onPress={startSensor}
              style={[styles.actionButton, { marginTop: 20, backgroundColor: '#795548' }]}
            >
              <Text style={styles.buttonText}>Enable Microphone</Text>
            </Pressable>
          </View>
        );

      case 'rotate':
        return (
          <View style={styles.center}>
            <Animated.View style={rotateStyle}>
              <MaterialCommunityIcons name="radio" size={100} color="#607D8B" />
            </Animated.View>
            <Text style={styles.instruction}>FIND THE SIGNAL</Text>
          </View>
        );

      case 'upside-down':
        return (
          <View style={styles.center}>
            <View style={styles.box}>
              <MaterialCommunityIcons name="circle" size={40} color="#FF5252" />
            </View>
            <Text style={styles.instruction}>GET THE BALL OUT</Text>
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
              <Animated.View style={[styles.fillCircle, fillCircleStyle]} />
              <MaterialCommunityIcons name="fingerprint" size={80} color="#fff" />
            </Pressable>
            <Text style={styles.instruction}>HOLD TO AUTHENTICATE</Text>
          </View>
        )

      case 'rapid-tap':
        return (
          <View style={styles.center}>
            <View style={styles.pumpScene}>
              {/* Hand Pump */}
              <View style={styles.pumpContainer}>
                <Pressable
                  onPress={() => {
                    const next = Math.min(progress + 0.05, 1);
                    setProgress(next);
                    if (next >= 1 && isActive) completeLevel();
                  }}
                >
                  {({ pressed }) => (
                    <View style={[
                      styles.pumpHandle,
                      { transform: [{ translateY: pressed ? 10 : 0 }] }
                    ]}>
                      <MaterialCommunityIcons name="water-pump" size={80} color="#795548" />
                      {/* Pumping Water Visual - Only show when pressing */}
                      {pressed && (
                        <View style={styles.waterStreamContainer}>
                          <View style={styles.waterStream} />
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
                <View style={styles.pumpBase} />
              </View>

              {/* Connection Pipe */}
              <View style={styles.pipe} />

              {/* Water Tank */}
              <View style={styles.tankContainer}>
                <View style={styles.tankOuter}>
                  <Animated.View
                    style={[
                      styles.tankWater,
                      { height: `${progress * 100}%` }
                    ]}
                  />
                </View>

                {/* External Leak at bottom right */}
                {progress > 0 && (
                  <View style={styles.externalLeak}>
                    <View style={styles.leakDrops}>
                      <MaterialCommunityIcons name="water" size={12} color="#2196F3" style={styles.drop1} />
                      <MaterialCommunityIcons name="water" size={12} color="#2196F3" style={styles.drop2} />
                    </View>
                  </View>
                )}

                <View style={styles.tankLegs} />
              </View>
            </View>

            <Text style={styles.instruction}>FILL THE TANK</Text>

            <View style={[styles.progressBar, { marginTop: 40 }]}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: '#2196F3' }]} />
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
              <MaterialCommunityIcons name="pattern-lock" size={80} color="#fff" />
            </View>
            <Text style={styles.instruction}>UNLOCK THE PATTERN</Text>
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
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Pump Scene Styles
  pumpScene: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 200,
    width: '100%',
    paddingHorizontal: 20,
  },
  pumpContainer: {
    alignItems: 'center',
    zIndex: 2,
  },
  pumpHandle: {
    padding: 10,
  },
  pumpBase: {
    width: 20,
    height: 60,
    backgroundColor: '#5D4037',
    borderRadius: 2,
  },
  pipe: {
    width: 60,
    height: 8,
    backgroundColor: '#757575',
    marginBottom: 20,
  },
  tankContainer: {
    alignItems: 'center',
  },
  tankOuter: {
    width: 100,
    height: 120,
    borderWidth: 4,
    borderColor: '#9E9E9E',
    borderTopWidth: 0,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  tankWater: {
    width: '100%',
    backgroundColor: '#2196F3',
    opacity: 0.8,
  },
  tankLegs: {
    width: 80,
    height: 10,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#9E9E9E',
  },
  externalLeak: {
    position: 'absolute',
    bottom: -10,
    right: -5,
    alignItems: 'center',
  },
  leakDrops: {
    alignItems: 'center',
    marginTop: -2,
  },
  drop1: {
    opacity: 0.6,
  },
  drop2: {
    marginTop: -4,
    opacity: 0.3,
  },
  waterStreamContainer: {
    position: 'absolute',
    bottom: -10,
    right: 5,
    height: 30,
    width: 10,
    alignItems: 'center',
  },
  waterStream: {
    width: 6,
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  owlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    position: 'absolute',
    top: -40,
    right: -40,
  }
});
