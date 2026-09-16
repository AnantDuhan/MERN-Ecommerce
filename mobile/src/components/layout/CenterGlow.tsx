// import React from "react";
// import { StyleSheet, View } from "react-native";
// import { BlurView } from "expo-blur";
// import { LinearGradient } from "expo-linear-gradient";

// export default function CenterGlow() {
//   return (
//     <View style={styles.container}>

//       {/* Large Ambient Glow */}

//       <LinearGradient
//         colors={[
//           "rgba(94,168,255,0.08)",
//           "rgba(94,168,255,0.08)",
//           "rgba(94,168,255,0.02)",
//           "transparent",
//         ]}
//         style={styles.largeGlow}
//       />

//       {/* Medium Glow */}

//       <BlurView
//         intensity={40}
//         tint="light"
//         style={styles.mediumGlow}
//       />

//       {/* Inner Highlight */}

//       <LinearGradient
//         colors={[
//           "rgba(255,255,255,0.35)",
//           "rgba(255,255,255,0.12)",
//           "transparent",
//         ]}
//         style={styles.innerGlow}
//       />

//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   container: {
//     width: 500,
//     height: 500,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   largeGlow: {
//     position: "absolute",
//     width: 500,
//     height: 500,
//     borderRadius: 250,
//   },

//   mediumGlow: {
//     position: "absolute",
//     width: 340,
//     height: 340,
//     borderRadius: 170,
//     backgroundColor: "rgba(94,168,255,0.12)",
//   },

//   innerGlow: {
//     position: "absolute",
//     width: 170,
//     height: 170,
//     borderRadius: 85,
//   },

// });