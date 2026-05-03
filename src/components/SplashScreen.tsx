import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [logoAnim] = useState(new Animated.Value(0));
  const [titleAnim] = useState(new Animated.Value(0));
  const [showTitle, setShowTitle] = useState(false);
  const titleLetters = useRef('FrugalFox'.split(''));

  useEffect(() => {
    // Start with fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Jump and bounce animation for logo
      Animated.sequence([
        // Jump up
        Animated.timing(logoAnim, {
          toValue: -50,
          duration: 600,
          useNativeDriver: true,
        }),
        // Bounce down past original position
        Animated.timing(logoAnim, {
          toValue: 20,
          duration: 700,
          useNativeDriver: true,
        }),
        // Settle back to center
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Show title after logo animation
        setShowTitle(true);
        // Animate title letter by letter
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }).start();
      });
    });

    // Auto hide after total animation time
    const timer = setTimeout(() => {
      onFinish();
    }, 6000); // Increased time to accommodate all animations

    return () => clearTimeout(timer);
  }, [fadeAnim, logoAnim, titleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoAnim }] }]}>
          <Image 
            source={require('../../assets/frugalfox.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        {showTitle && (
          <View style={styles.titleContainer}>
            {titleLetters.current.map((letter, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.titleLetter,
                  {
                    opacity: titleAnim.interpolate({
                      inputRange: [
                        index / titleLetters.current.length,
                        (index + 0.9) / titleLetters.current.length,
                        (index + 1) / titleLetters.current.length,
                      ],
                      outputRange: [0, 0, 1],
                      extrapolate: 'clamp',
                    }),
                    transform: [
                      {
                        translateX: titleAnim.interpolate({
                          inputRange: [
                            index / titleLetters.current.length,
                            (index + 1) / titleLetters.current.length,
                          ],
                          outputRange: [-20, 0],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              >
                {letter}
              </Animated.Text>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#178ae7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
});

export default SplashScreen;
