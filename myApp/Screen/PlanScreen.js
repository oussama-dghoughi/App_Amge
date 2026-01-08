import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Image } from 'react-native';
import Svg, { Path, Rect, Text as SvgText, G, Circle, Defs, Stop, Filter } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { exhibitors, planLayout } from '../data/exhibitors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const PlanScreen = ({ navigation }) => {
  const [selectedStand, setSelectedStand] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStandPress = (standId) => {
    if (exhibitors[standId]) {
      setSelectedStand(exhibitors[standId]);
      setModalVisible(true);
    }
  };

  const renderModal = () => {
    if (!selectedStand) return null;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={90} tint="light" style={styles.modalBlur}>
            <Animatable.View 
              animation="slideInUp" 
              duration={400} 
              style={styles.modalContent}
            >
              <LinearGradient
                colors={['#fff', '#f7e6fa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalHeader}
              >
                <View style={styles.modalIconContainer}>
                  <Text style={styles.modalIcon}>{selectedStand.icon || '🏢'}</Text>
                </View>
                <Text style={styles.modalTitle}>{selectedStand.name}</Text>
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon name="times" size={24} color="#8a348a" />
                </TouchableOpacity>
              </LinearGradient>
              <View style={styles.modalBody}>
                <Text style={styles.companyDescription}>{selectedStand.description}</Text>
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreButtonText}>Voir plus</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </BlurView>
        </View>
      </Modal>
    );
  };

  const renderStand = (standId, company, index) => (
    <Animatable.G
      key={standId}
      animation="bounceIn"
      delay={index * 120}
      useNativeDriver
      onPress={() => handleStandPress(standId)}
    >
      <G>
        <Circle
          cx={company.coordinates.x + 20}
          cy={company.coordinates.y + 20}
          r={24}
          fill="url(#badgeGradient)"
          stroke="#fff"
          strokeWidth={3}
          filter="url(#glow)"
        />
        <SvgText
          x={company.coordinates.x + 20}
          y={company.coordinates.y + 26}
          fontSize={16}
          fontWeight="bold"
          textAnchor="middle"
          fill="#fff"
          style={{ textShadowColor: '#C76B98', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 }}
        >
          <tspan>{company.icon || '🏢'}</tspan>
        </SvgText>
      </G>
    </Animatable.G>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation} />
      <View style={styles.planContainer}>
        <GestureScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          maximumZoomScale={2}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bouncesZoom={true}
        >
          <Image
            source={require('../assets/Plan.png')}
            style={styles.planImage}
          />
        </GestureScrollView>
      </View>
      <BottomNavigationBar />
      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  planContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planImage: {
    width: width * 0.95,
    height: height * 0.7,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBlur: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  companyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  modalIconContainer: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 10,
  },
  modalIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8a348a',
  },
  moreButton: {
    padding: 10,
    backgroundColor: '#8a348a',
    borderRadius: 5,
  },
  moreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PlanScreen; 