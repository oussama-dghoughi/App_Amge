import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Svg, { Path, Rect, Text as SvgText, G, Circle, Defs, Stop, Filter } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { exhibitors, planLayout } from '../data/exhibitors';

const { width, height } = Dimensions.get('window');

const PlanScreen = () => {
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      maximumZoomScale={2}
      minimumZoomScale={0.5}
    >
      <View style={styles.planContainer}>
        <Svg width={width} height={height * 0.8} viewBox="0 0 1000 800">
          <Defs>
            <LinearGradient id="badgeGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#8a348a" />
              <Stop offset="100%" stopColor="#C76B98" />
            </LinearGradient>
            <Filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </Filter>
          </Defs>
          {/* Zones principales */}
          <Rect
            x={planLayout.loungeClub.x}
            y={planLayout.loungeClub.y}
            width={planLayout.loungeClub.width}
            height={planLayout.loungeClub.height}
            fill="#f0f0f0"
            stroke="#8a348a"
            strokeWidth={2}
          />
          <SvgText
            x={planLayout.loungeClub.x + planLayout.loungeClub.width / 2}
            y={planLayout.loungeClub.y + planLayout.loungeClub.height / 2}
            fontSize={12}
            textAnchor="middle"
            fill="#8a348a"
          >
            {planLayout.loungeClub.label}
          </SvgText>

          {/* Salle de repos */}
          <Rect
            x={planLayout.salleRepos.x}
            y={planLayout.salleRepos.y}
            width={planLayout.salleRepos.width}
            height={planLayout.salleRepos.height}
            fill="#f0f0f0"
            stroke="#8a348a"
            strokeWidth={2}
          />
          <SvgText
            x={planLayout.salleRepos.x + planLayout.salleRepos.width / 2}
            y={planLayout.salleRepos.y + planLayout.salleRepos.height / 2}
            fontSize={12}
            textAnchor="middle"
            fill="#8a348a"
          >
            {planLayout.salleRepos.label}
          </SvgText>

          {/* Accueil */}
          <Rect
            x={planLayout.accueil.x}
            y={planLayout.accueil.y}
            width={planLayout.accueil.width}
            height={planLayout.accueil.height}
            fill="#f0f0f0"
            stroke="#8a348a"
            strokeWidth={2}
          />
          <SvgText
            x={planLayout.accueil.x + planLayout.accueil.width / 2}
            y={planLayout.accueil.y + planLayout.accueil.height / 2}
            fontSize={12}
            textAnchor="middle"
            fill="#8a348a"
          >
            {planLayout.accueil.label}
          </SvgText>

          {/* Chemins */}
          <Path
            d={planLayout.paths.entree}
            stroke="#8a348a"
            strokeWidth={2}
            fill="none"
          />
          <Path
            d={planLayout.paths.sortie}
            stroke="#8a348a"
            strokeWidth={2}
            fill="none"
          />

          {/* Stands des exposants */}
          {Object.entries(exhibitors).map(([standId, company], idx) =>
            renderStand(standId, company, idx)
          )}
        </Svg>
      </View>

      <View style={styles.floatingBar}>
        <TouchableOpacity style={styles.floatingButton}>
          <Icon name="search" size={22} color="#8a348a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton}>
          <Icon name="filter" size={22} color="#8a348a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton}>
          <Icon name="home" size={22} color="#8a348a" />
        </TouchableOpacity>
      </View>

      {renderModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  planContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  floatingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  floatingButton: {
    padding: 10,
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