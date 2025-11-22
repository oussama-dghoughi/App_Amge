import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Rect,
  Path,
  Text as SvgText,
  G,
  Circle,
} from 'react-native-svg';

import Header from '../components/HomeScreen/Header';
import BottomNavigationBar from '../components/HomeScreen/BottomNavigationBar';

const { width, height } = Dimensions.get('window');

const PlanScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header navigation={navigation} />

      <View style={styles.planContainer}>
        {/* ScrollView from 'react-native' for pinch-zoom (iOS) */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bouncesZoom
        >
          <View style={styles.svgWrapper}>
            <Svg
              // Smaller than screen width/height => margin around drawing
              width={width * 0.9}
              height={height * 0.9}
              viewBox="0 0 1000 1400"
            >
              {/* ==== OUTER WALLS ==== */}
              <Path
                d="
                  M120 260
                  L780 260
                  L900 320
                  L900 520
                  L960 580
                  L960 1040
                  L860 1040
                  L860 1080
                  L180 1080
                  L100 1000
                  L100 880
                  L60 840
                  L60 520
                  L120 460
                  Z
                "
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />

              {/* LOUNGE CLUB - EXPOSANTS */}
              <Rect
                x={170}
                y={320}
                width={420}
                height={280}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />
              <SvgText
                x={170 + 210}
                y={320 + 140}
                fontSize={26}
                fontWeight="bold"
                textAnchor="middle"
                fill="#000000"
              >
                LOUNGE CLUB - EXPOSANTS
              </SvgText>

              {/* Corridor under lounge */}
              <Rect
                x={170}
                y={600}
                width={420}
                height={40}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />

              {/* SALLE DE REPOS */}
              <Rect
                x={720}
                y={330}
                width={190}
                height={230}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />
              <SvgText
                x={720 + 95}
                y={330 + 40}
                fontSize={24}
                fontWeight="bold"
                textAnchor="middle"
                fill="#000000"
              >
                SALLE DE REPOS
              </SvgText>

              {/* Toilets icon */}
              <G>
                <Circle
                  cx={720 + 160}
                  cy={330 + 180}
                  r={20}
                  fill="#000000"
                />
                <SvgText
                  x={720 + 160}
                  y={330 + 186}
                  fontSize={18}
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#ffffff"
                >
                  WC
                </SvgText>
              </G>

              {/* Central hall */}
              <Rect
                x={200}
                y={600}
                width={680}
                height={620}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />

              {/* Inscription (bottom-left) */}
              <Rect
                x={120}
                y={760+280}
                width={120}
                height={140}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />
              <SvgText
                x={120 + 60}
                y={760 + 75 + 280}
                fontSize={20}
                fontWeight="bold"
                textAnchor="middle"
                fill="#000000"
              >
                INSCRIPTION
              </SvgText>

              {/* Right vertical corridor */}
              <Rect
                x={860}
                y={600}
                width={80}
                height={360}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />

              {/* ACCUEIL */}
              <Rect
                x={420 + 260}
                y={960+180}
                width={200}
                height={80}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={2}
              />
              <SvgText
                x={420 + 100 + 260}
                y={960 + 48 + 180}
                fontSize={24}
                fontWeight="bold"
                textAnchor="middle"
                fill="#000000"
              >
                ACCUEIL
              </SvgText>

              {/* ENTRÉE */}
              <G>
                <Rect
                  x={540}
                  y={1040 +180}
                  width={200}
                  height={120}
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth={2}
                />
                <SvgText
                  x={540 + 100}
                  y={1040 + 80 + 180}
                  fontSize={28}
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#0040ff"
                >
                  ENTRÉE
                </SvgText>
                <Path
                  d="M640 1260 L660 1260 L650 1230 Z"
                  fill="#0040ff"
                />
              </G>

              {/* SORTIE */}
              <G>
                <Rect
                  x={220}
                  y={1040 + 180}
                  width={200}
                  height={120}
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth={2}
                />
                <SvgText
                  x={220 + 100}
                  y={1040 + 80 + 180}
                  fontSize={28}
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#0040ff"
                >
                  SORTIE
                </SvgText>
                <Path
                  d="M330 1230 L310 1230 L320 1260 Z"
                  fill="#0040ff"
                />
              </G>

              {/* Info points */}
              <G>
                <Circle
                  cx={540}
                  cy={740}
                  r={18}
                  fill="#d40000"
                />
                <SvgText
                  x={540}
                  y={746}
                  fontSize={20}
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#ffffff"
                >
                  i
                </SvgText>
                <SvgText
                  x={540}
                  y={770}
                  fontSize={14}
                  textAnchor="middle"
                  fill="#000000"
                >
                  POINT INFO
                </SvgText>
              </G>

              <G>
                <Circle
                  cx={690}
                  cy={640}
                  r={18}
                  fill="#d40000"
                />
                <SvgText
                  x={690}
                  y={646}
                  fontSize={20}
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#ffffff"
                >
                  i
                </SvgText>
                <SvgText
                  x={690}
                  y={670}
                  fontSize={14}
                  textAnchor="middle"
                  fill="#000000"
                >
                  POINT INFO
                </SvgText>
              </G>
            </Svg>
          </View>
        </ScrollView>
      </View>

      <BottomNavigationBar />
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
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrapper: {
    padding: 16, // margin between drawing and screen edges
  },
});

export default PlanScreen;
