import { Image, StyleSheet } from "react-native";

interface Props {
    size?: number;
}

export default function BrandLogo({ size = 120 }: Props) {
    return (
        <Image
            source={require("@/assets/images/logo.png")}
            style={[
                styles.logo,
                styles.glow,
                {
                    width: size,
                    height: size
                }
            ]}
            resizeMode="contain"
        />
    );
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: "center",
    },
    glow: {
        shadowColor: "#2F80ED",
        shadowOpacity: 0.25,
        shadowRadius: 35,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        elevation: 20,
    }
})