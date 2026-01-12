import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [domain, setDomain] = useState("");
  const [track, setTrack] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToLogin = () => {
    try {
      const parent = navigation.getParent?.();
      if (parent) {
        parent.navigate('Login');
        return;
      }
      navigation.navigate('Login');
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const handleSignUp = async () => {
    // ✅ Validation checks
    if (!isChecked) {
      Alert.alert(
        "Erreur",
        "Vous devez accepter les conditions légales pour vous inscrire."
      );
      return;
    }

    if (!name || !surname || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    setIsLoading(true);

    const userData = {
      name,
      surname,
      email,
      password,
      status: status || "Non spécifié",
      domain: domain || "Non spécifié",
      track: track || "Non spécifié",
    };

    try {
      console.log("[Registration] Sending data:", userData);
      
      // ✅ Add timeout to axios request
      const response = await axios.post(
        'http://localhost:5000/api/auth/register', 
        userData,
        { timeout: 10000 } // 10 second timeout
      );

      console.log("[Registration] Success:", response.data);

      // ✅ Set loading to false BEFORE showing alert
      setIsLoading(false);

      Alert.alert(
        "Succès",
        "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        [
          {
            text: "OK",
            onPress: handleGoToLogin
          }
        ]
      );
      
    } catch (error) {
      // ✅ CRITICAL: Always set loading to false in catch block
      setIsLoading(false);
      
      console.error("[Registration] Error:", error);

      let errorMessage = "Erreur lors de l'inscription";

      if (error.response) {
        // Server responded with error
        console.log("[Registration] Error response:", error.response.data);
        console.log("[Registration] Error status:", error.response.status);
        
        errorMessage = error.response.data?.msg || 
                      error.response.data?.message || 
                      `Erreur ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        console.log("[Registration] No response received");
        errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion et que le serveur est démarré.";
      } else {
        // Error in request setup
        console.log("[Registration] Request setup error:", error.message);
        errorMessage = error.message;
      }

      Alert.alert("Erreur", errorMessage);
    }
  };

  const toggleCheckbox = () => setIsChecked(!isChecked);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../../assets/Logo_2026.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.formContainer}>
          <Text style={styles.header}>Inscription</Text>

          <Text style={styles.inputLabel}>Nom *</Text>
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Entrez votre nom"
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Prénom *</Text>
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Entrez votre prénom"
            value={surname}
            onChangeText={setSurname}
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Adresse email *</Text>
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Entrez votre adresse email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Mot de passe *</Text>
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Minimum 6 caractères"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Statut</Text>
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Ex: Étudiant, Professionnel..."
            value={status}
            onChangeText={setStatus}
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Domaine</Text>
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Ex: Informatique, Marketing..."
            value={domain}
            onChangeText={setDomain}
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Parcours</Text>
          <TextInput
            style={[styles.input, styles.adjustedInput, styles.inputBorder]}
            placeholder="Ex: Master, Licence..."
            value={track}
            onChangeText={setTrack}
            editable={!isLoading}
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={toggleCheckbox}
              disabled={isLoading}
            >
              {isChecked && <View style={styles.checked} />}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
              En cochant cette case, vous acceptez nos conditions d'utilisation.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.signUpButton,
              isLoading && styles.signUpButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleGoToLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>
              Déjà un compte ? Connectez-vous
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactBar}>
          <Text style={styles.contactText}>Contact</Text>
          <View style={styles.iconsContainer}>
            <FontAwesome name="instagram" size={24} color="#000" style={styles.icon} />
            <FontAwesome name="facebook" size={24} color="#000" style={styles.icon} />
            <FontAwesome name="envelope" size={24} color="#000" style={styles.icon} />
            <FontAwesome name="linkedin" size={24} color="#000" style={styles.icon} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 25,
    textAlign: "center",
    color: "#005f73",
    fontFamily: "Roboto",
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 18,
    backgroundColor: "transparent",
  },
  adjustedInput: {
    fontSize: 16,
    paddingVertical: 12,
  },
  signUpButton: {
    backgroundColor: "#005f73",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  contactBar: {
    alignItems: "center",
    marginTop: 15,
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  contactText: {
    fontSize: 16,
    marginBottom: 12,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
    flexWrap: "wrap",
    maxWidth: "85%",
  },
  checked: {
    width: 16,
    height: 16,
    backgroundColor: "#005f73",
  },
  signUpButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  loginLink: {
    marginTop: 15,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#005f73",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "600",
    color: "#005f73",
    marginBottom: 5,
    marginTop: 10,
  },
});

export default RegistrationScreen;