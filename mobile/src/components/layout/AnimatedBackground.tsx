import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import FloatingBlob from "./FloatingBlob";
import CenterGlow from "./CenterGlow";

export default function AnimatedBackground() {

  return (

    <View style={styles.container}>

      <LinearGradient
        colors={[
          "#F7FAFF",
          "#EEF5FF",
          "#FFFFFF",
        ]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient Glow */}

      <View style={styles.centerGlow}>
        <CenterGlow />
      </View>

      {/* Top Left */}

      <FloatingBlob
        size={320}
        color="#4A90E2"
        top={-120}
        left={-140}
        duration={9000}
      />

      {/* Bottom Right */}

      <FloatingBlob
        size={260}
        color="#7DB8FF"
        bottom={-90}
        right={-90}
        duration={10000}
      />

      {/* Right */}

      <FloatingBlob
        size={150}
        color="#5EA8FF"
        top={180}
        right={30}
        duration={11000}
      />

      {/* Bottom Left */}

      <FloatingBlob
        size={120}
        color="#80B8FF"
        bottom={150}
        left={40}
        duration={9500}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  centerGlow: {
    position: "absolute",
    top: "18%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});