import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaskedView from '@react-native-masked-view/masked-view';

import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';
import Header from '../components/HomeScreen/Header';  

const { width } = Dimensions.get('window');

const COLORS = {
  primaryPurple: '#8E24AA',
  primaryTeal: '#00B8D4',
  titleDark: '#00838F',
  gradientStart: '#9C27B0',
  gradientEnd: '#00E5FF',
  lineColor: '#00ACC1',
  textGrey: '#546E7A',
  white: '#FFFFFF',
};

const initialTimelineData = [
  {
    id: 1,
    day: 7,
    time: '9h30',
    title: "Le Marché de l'Emploi en Afrique",
    category: 'Conférence',
    description: "Discussion sur les opportunités d'emploi et les tendances du marché.",
    isChecked: true,
  },
  {
    id: 2,
    day: 7,
    time: '10h30',
    title: "Rédiger un CV Impactant",
    category: 'Atelier',
    description: "Un atelier pour améliorer vos CV.",
    isChecked: false,
  },
  {
    id: 3,
    day: 7,
    time: '17h00',
    title: "Clôture & Remerciements",
    category: 'Conférence',
    description: "Remerciements et clôture du Forum.",
    isChecked: false,
  },
];

const GradientText = ({ text, style }) => {
  return (
    <MaskedView
      maskElement={<Text style={[style, { backgroundColor: 'transparent' }]}>{text}</Text>}
    >
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const CalendarWidget = ({ selectedDate, onSelectDate }) => {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const row1 = [1, 2, 3, 4, 5, 6, 7];

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calRow}>
        {days.map((d, i) => (
          <View key={i} style={styles.calCellContainer}>
            <Text style={styles.dayLabel}>{d}</Text>
          </View>
        ))}
      </View>
      <View style={styles.calRow}>
        {row1.map((d) => {
          const isSelected = d === selectedDate;
          return (
            <TouchableOpacity key={d} onPress={() => onSelectDate(d)} style={styles.calCellContainer}>
              {isSelected ? (
                <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.calCellSelectedContainer}>
                   <Text style={[styles.calDateText, styles.textWhite]}>{d}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.calCell}>
                   <Text style={styles.calDateText}>{d}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const TimelineItem = ({ data, isLast, onToggle }) => {
  const { id, time, title, category, description, isChecked } = data;

  return (
    <View style={styles.tlItemContainer}>
      <View style={styles.tlTimeContainer}>
        <Text style={styles.tlTimeText}>{time}</Text>
      </View>

      <View style={styles.tlLineContainer}>
        {!isLast && <View style={styles.tlVerticalLine} />}
        <TouchableOpacity onPress={() => onToggle(id)} style={{ zIndex: 2 }}>
          <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.nodeGradientBorder}>
            <View style={styles.nodeWhiteBackground}>
              {isChecked ? (
                <MaterialCommunityIcons name="check" size={18} color={COLORS.primaryPurple} />
              ) : (
                <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.nodeUncheckedDot} />
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.tlContentContainer}>
        <GradientText text={title} style={styles.tlTitle} />
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.tlBadgeContainer}
        >
          <Text style={styles.tlBadgeText}>{category}</Text>
        </LinearGradient>
        <Text style={styles.tlDescription}>{description}</Text>
      </View>
    </View>
  );
};

const PlanningScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(7);
  const [events, setEvents] = useState(initialTimelineData);

  const toggleEventCheck = (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isChecked: !e.isChecked } : e));
  };

  const currentEvents = events.filter(i => i.day === selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* === HEADER identique à OffreScreen === */}
      <View style={styles.safeAreaHeader}>
        <View style={styles.headerWrapper}>
          <Header navigation={navigation} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={28} color={COLORS.primaryPurple} style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Planning FHM</Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity style={styles.monthSelectorBox}>
            <Text style={styles.monthSelectorText}>Juin 2026</Text>
            <Feather name="chevron-down" size={20} color={COLORS.primaryPurple} />
          </TouchableOpacity>
        </View>

        <CalendarWidget selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <View style={{ paddingHorizontal: 20 }}>
          {currentEvents.length === 0 ? (
            <View style={styles.noEventContainer}>
              <MaterialCommunityIcons name="calendar-blank" size={60} color="#E0E0E0" />
              <Text style={styles.noEventText}>Aucun événement prévu ce jour-là</Text>
            </View>
          ) : (
            currentEvents.map((item, index) => (
              <TimelineItem
                key={item.id}
                data={item}
                isLast={index === currentEvents.length - 1}
                onToggle={toggleEventCheck}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <BottomNavigationBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  // <-- Ajout styles header identiques
  safeAreaHeader: {
    backgroundColor: '#fff',
  },
  headerWrapper: {
    backgroundColor: '#fff',
  },

  headerContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.titleDark },

  calendarContainer: { marginHorizontal: 20, marginBottom: 30 },
  calRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  calCellContainer: { width: (width - 40) / 7, alignItems: 'center' },
  dayLabel: { color: COLORS.textGrey, fontSize: 14, fontWeight: '500' },
  calCellSelectedContainer: { borderRadius: 16, alignItems: 'center', justifyContent: 'center', width: 36, height: 36 },
  calCell: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  calDateText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  textWhite: { color: 'white' },
  monthSelectorBox: { flexDirection: 'row', borderWidth: 1.5, borderColor: COLORS.primaryPurple, borderRadius: 20, padding: 8, alignSelf: 'flex-start' },
  monthSelectorText: { fontSize: 16, fontWeight: '600', color: COLORS.primaryPurple, marginRight: 8 },

  tlItemContainer: { flexDirection: 'row', marginBottom: 25, minHeight: 80 },
  tlTimeContainer: { width: 55, alignItems: 'flex-end', marginRight: 15, paddingTop: 4 },
  tlTimeText: { fontSize: 15, fontWeight: 'bold', color: COLORS.primaryTeal },
  tlLineContainer: { width: 36, alignItems: 'center' },
  tlVerticalLine: { position: 'absolute', top: 36, bottom: -30, width: 3, backgroundColor: COLORS.lineColor, borderRadius: 1.5, opacity: 0.5 },
  nodeGradientBorder: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', padding: 2 },
  nodeWhiteBackground: { flex: 1, width: '100%', borderRadius: 15, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  nodeUncheckedDot: { width: 14, height: 14, borderRadius: 7 },
  tlContentContainer: { flex: 1, marginLeft: 12 },
  tlTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  tlBadgeContainer: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8 },
  tlBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  tlDescription: { fontSize: 14, color: COLORS.textGrey, lineHeight: 20 },

  noEventContainer: { alignItems: 'center', marginTop: 50 },
  noEventText: { textAlign: 'center', marginTop: 15, fontSize: 16, color: COLORS.textGrey, fontStyle: 'italic' },

  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
});

export default PlanningScreen;
