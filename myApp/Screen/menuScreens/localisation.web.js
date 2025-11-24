import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const LOCATION = {
    latitude: 48.8852,
    longitude: 2.2889,
};
const PLACE_NAME = "Espace Champerret, Paris";
const PLACE_ADDRESS = "6 Rue Jean Oestreicher, 75017 Paris, France";

export default function LocalisationScreen() {
    const navigation = useNavigation();

    const openMaps = () => {
        window.open(
            `https://www.google.com/maps?q=${LOCATION.latitude},${LOCATION.longitude}`,
            "_blank"
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#8a348a", "#c76b98"]} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-left" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Localisation (Web)</Text>
            </LinearGradient>

            <View style={styles.webBox}>
                <Text style={styles.infoTitle}>{PLACE_NAME}</Text>
                <Text style={styles.infoText}>{PLACE_ADDRESS}</Text>

                <TouchableOpacity style={styles.btn} onPress={openMaps}>
                    <Icon name="location-arrow" size={18} color="#fff" />
                    <Text style={styles.btnText}>Ouvrir dans Google Maps</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 18,
        paddingHorizontal: 18,
    },
    backBtn: { marginRight: 12, padding: 6 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

    webBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    infoTitle: { fontSize: 20, color: '#8a348a', fontWeight: 'bold', marginBottom: 12 },
    infoText: { fontSize: 15, color: '#444', marginBottom: 18 },

    btn: {
        flexDirection: 'row',
        backgroundColor: "#8a348a",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 18,
        alignItems: 'center'
    },
    btnText: { color: "#fff", marginLeft: 8, fontSize: 15, fontWeight: 'bold' }
});
