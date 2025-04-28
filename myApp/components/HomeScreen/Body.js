import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, TouchableOpacity, Image,ScrollView, Animated, Dimensions, Platform, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');


const PourquoiItem = ({ title, icon, content, style, isExpanded, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.pourquoiCard, style]}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginRight: 10 }}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      
      {isExpanded && (
        <Text style={styles.cardContent}>
          {content}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const PlanningItem = ({ time, title, description, details, isExpanded, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.planningItem, isExpanded && styles.expandedPlanningItem]}
      activeOpacity={0.8}
    >
      <View style={styles.planningHeader}>
        <Text style={styles.planningTime}>{time}</Text>
        <Icon 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="#6A0DAD" 
          style={styles.chevronIcon}
        />
      </View>
      <Text style={styles.planningTitle}>{title}</Text>
      
      {isExpanded && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>{description}</Text>
          <View style={styles.detailsDivider} />
          <Text style={styles.detailsHeading}>Détails de l'événement:</Text>
          {details.map((detail, index) => (
            <View key={index} style={styles.detailItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Composant pour chaque chiffre du compte à rebours
const CountdownDigit = ({ value, label }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 20,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <BlurView intensity={80} tint="light" style={styles.digitContainer}>
      <LinearGradient
        colors={['rgba(138, 52, 138, 0.8)', 'rgba(161, 60, 161, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.digitGradient}
      >
        <Animated.View
          style={[
            styles.digitValue,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.digitText}>{String(value).padStart(2, '0')}</Text>
        </Animated.View>
        <View style={styles.labelContainer}>
          <Text style={styles.digitLabel}>{label}</Text>
        </View>
      </LinearGradient>
    </BlurView>
  );
};

const FlipNumber = ({ value, label }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);

  useEffect(() => {
    if (value !== displayValue) {
      setNextValue(value);
      Animated.parallel([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        flipAnim.setValue(0);
        setDisplayValue(value);
      });
    }
  }, [value]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });


  return (
    
    <View style={styles.flipContainer}>
      <BlurView intensity={40} tint="light" style={styles.flipBlurContainer}>
        <LinearGradient
          colors={['rgba(138, 52, 138, 0.95)', 'rgba(161, 60, 161, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.flipGradient}
        >
          <View style={styles.flipInnerContainer}>
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowOpacity,
                },
              ]}
            />
            <View style={styles.flipTop}>
              <Text style={styles.flipNumber}>{String(displayValue).padStart(2, '0')}</Text>
            </View>
            <View style={styles.flipDivider} />
            <View style={styles.flipBottom}>
              <Text style={styles.flipNumber}>{String(displayValue).padStart(2, '0')}</Text>
            </View>
            <Animated.View
              style={[
                styles.flipCard,
                {
                  transform: [{ rotateX: frontInterpolate }],
                },
              ]}
            >
              <Text style={styles.flipNumber}>{String(displayValue).padStart(2, '0')}</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.flipCardBack,
                {
                  transform: [{ rotateX: backInterpolate }],
                },
              ]}
            >
              <Text style={styles.flipNumber}>{String(nextValue).padStart(2, '0')}</Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </BlurView>
      <LinearGradient
        colors={['rgba(138, 52, 138, 0.8)', 'rgba(161, 60, 161, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.labelGradient}
      >
        <Text style={styles.flipLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );
};

const StatCard = ({ number, label, icon, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 200),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: 20,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCardContainer,
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <BlurView intensity={60} tint="light" style={styles.statCardBlur}>
        <LinearGradient
          colors={['rgba(138, 52, 138, 0.9)', 'rgba(161, 60, 161, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statCardGradient}
        >
          <View style={styles.statIconContainer}>
            <Icon name={icon} size={24} color="#fff" style={styles.statIcon} />
          </View>
          <Text style={styles.statCardNumber}>{number}</Text>
          <Text style={styles.statCardLabel}>{label}</Text>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
};
const MediaCard = ({ logo, headline, excerpt, details, link, isExpanded, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.mediaCard, isExpanded && styles.expandedMediaCard]}
      activeOpacity={0.9}
    >
      <Image source={logo} style={styles.mediaLogo} resizeMode="contain" />
      <Text style={styles.mediaHeadline}>{headline}</Text>
      
      <View style={styles.excerptContainer}>
        <Text style={styles.mediaExcerpt}>{excerpt}</Text>
        {!isExpanded && (
          <Text style={styles.readMore}>Lire la suite</Text>
        )}
      </View>

      {isExpanded && (
        <View style={styles.detailsContainer}>
          {details.map((detail, index) => (
            <Text key={index} style={styles.detailText}>
              • {detail}
            </Text>
          ))}
          <TouchableOpacity 
            onPress={() => Linking.openURL(link)}
            style={styles.originalArticleButton}
          >
            <Text style={styles.originalArticleText}>Lire l'article original</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Body = () => {
  const [timeLeft, setTimeLeft] = useState(360000);
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const buttonPressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);

  const planningItems = [
    {
      time: "9h30 - 10h30",
      title: "Marché de l'Emploi en Afrique",
      description: "Opportunités et tendances du marché",
      details: [
        "Intervenants: PDG de grandes entreprises africaines",
        "Lieu: Salle Principale",
        "Public: Tous les participants",
        "Durée: 1h avec session Q/R"
      ]
    },
    {
      time: "10h30 - 12h00",
      title: "Atelier: CV Impactant",
      description: "Techniques de rédaction modernes",
      details: [
        "Animé par des experts RH",
        "Apportez votre CV existant",
        "Séance de coaching individuel",
        "Matériel fourni"
      ]
    }
  ];
  const pourquoiItems = [
    {
      title: "Prestige",
      icon: "⭐",
      content: <>
            <Text style={{ fontWeight: 'bold' }}>
              Venez à la rencontre des meilleures entreprises marocaines et multinationales.
            </Text>
            {"\n\n"}
            <Text>
              Étudiants, <Text style={{ fontWeight: 'bold' }}>jeunes diplômés</Text> ou{" "}
              <Text style={{ fontWeight: 'bold' }}>expérimentés</Text>, intéressés par un emploi en Afrique ou curieux du marché de l’emploi africain :{" "}
              <Text style={{ fontWeight: 'bold' }}>Notre Forum est fait pour vous !</Text>
            </Text>
            {"\n\n"}
            <Text>
              À la clé : <Text style={{ fontWeight: 'bold' }}>CDI</Text>,{" "}
              <Text style={{ fontWeight: 'bold' }}>stages</Text> et{" "}
              <Text style={{ fontWeight: 'bold' }}>beaucoup d’échanges</Text>.{" "}
              Même ceux qui ne recherchent pas d’emploi{" "}
              <Text style={{ fontWeight: 'bold' }}>y trouveront leur bonheur</Text>.
            </Text>
            {"\n\n"}
            <Text>
              Tout au long de la journée,{" "}
              <Text style={{ fontWeight: 'bold' }}>des conférences de qualité</Text>{" "}
              seront tenues avec des{" "}
              <Text style={{ fontWeight: 'bold' }}>invités prestigieux</Text>.
            </Text>
          </>,
    },
    {
      title: "Networking",
      icon: "🤝",
      content: <>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>C’est l’occasion rêvée</Text> pour échanger avec de nombreux acteurs du tissu économique :{" "}
              <Text style={{ fontWeight: 'bold' }}>grands groupes</Text>,{" "}
              <Text style={{ fontWeight: 'bold' }}>PME</Text> et{" "}
              <Text style={{ fontWeight: 'bold' }}>startups</Text>.
            </Text>
      
            {"\n\n"}
      
            <Text>
              Si vous êtes en <Text style={{ fontWeight: 'bold' }}>recherche active</Text> d’un{" "}
              <Text style={{ fontWeight: 'bold' }}>emploi</Text> ou d’un{" "}
              <Text style={{ fontWeight: 'bold' }}>stage</Text>, c’est{" "}
              <Text style={{ fontWeight: 'bold' }}>l’endroit idéal</Text> !
            </Text>
      
            {"\n\n"}
      
            <Text>
              Les recruteurs reçoivent souvent des candidatures par mail,{" "}
              <Text style={{ fontWeight: 'bold' }}>mais rien ne vaut un dépôt de CV physique</Text>. Pensez à venir avec le vôtre pour le{" "}
              <Text style={{ fontWeight: 'bold' }}>transmettre directement</Text> aux recruteurs, sans passer par un{" "}
              <Text style={{ fontWeight: 'bold' }}>process long</Text> et{" "}
              <Text style={{ fontWeight: 'bold' }}>parfois non concluant</Text>.
            </Text>
      
            {"\n\n"}
      
            <Text>
              Même si vous ne comptez pas quitter votre emploi actuel,{" "}
              <Text style={{ fontWeight: 'bold' }}>il est toujours utile de développer son réseau</Text>.{" "}
              <Text style={{ fontWeight: 'bold' }}>Ne ratez pas cette opportunité !</Text>
            </Text>
          </>,
    },
    {
      title: "Instruction",
      icon: "📚",
      content: <>
            <Text>
              Les <Text style={{ fontWeight: 'bold' }}>conférences organisées</Text> ne seront pas axées sur un seul thème.
            </Text>
      
            {"\n\n"}
      
            <Text>
              Vous aurez un <Text style={{ fontWeight: 'bold' }}>vaste choix</Text> :
            </Text>
      
            {"\n"}
            <Text>
              - <Text style={{ fontWeight: 'bold' }}>Des ateliers d’entreprises</Text> pour découvrir les{" "}
              <Text style={{ fontWeight: 'bold' }}>plus grands groupes africains</Text>.
            </Text>
      
            <Text>
              - <Text style={{ fontWeight: 'bold' }}>
                Des conférences sur le développement personnel au travail
              </Text>.
            </Text>
      
            <Text>
              - <Text style={{ fontWeight: 'bold' }}>
                Des discussions sur l’actualité économique du continent
              </Text>.
            </Text>
      
            {"\n\n"}
      
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Y’en aura pour tous les goûts !</Text>
            </Text>
          </>,
    },
    {
      title: "Projection",
      icon: "🌍",
      content: <>
            <Text>
              Quel que soit votre <Text style={{ fontWeight: 'bold' }}>parcours</Text> ou{" "}
              <Text style={{ fontWeight: 'bold' }}>formation</Text>, nos{" "}
              <Text style={{ fontWeight: 'bold' }}>prestigieux exposants</Text> seront toujours disponibles pour :
            </Text>
      
            {"\n\n"}
      
            <Text>
              - Vous parler des <Text style={{ fontWeight: 'bold' }}>postes proposés</Text> et des{" "}
              <Text style={{ fontWeight: 'bold' }}>compétences recherchées</Text>.
            </Text>
            <Text>
              - Vous présenter leur <Text style={{ fontWeight: 'bold' }}>entreprise</Text> et leurs attentes.
            </Text>
      
            {"\n\n"}
      
            <Text>Ces échanges vous aideront à :</Text>
            <Text>
              - <Text style={{ fontWeight: 'bold' }}>Construire votre propre opinion</Text>
            </Text>
            <Text>
              - <Text style={{ fontWeight: 'bold' }}>Affiner votre projet professionnel</Text>
            </Text>
      
            {"\n\n"}
      
            <Text>
              <Text style={{ fontWeight: 'bold' }}>
                Ces professionnels sauront vous aiguiller mieux que quiconque.
              </Text>
            </Text>
          </>,
    },
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Animation continue du bouton
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPressAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const days = Math.floor(time / (3600 * 24));
    const hours = Math.floor((time % (3600 * 24)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonAnimatedStyle = {
    transform: [
      { scale: buttonScaleAnim },
      {
        translateY: buttonPressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  // Image Carousel (Slide Images every 5 seconds)
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    require('../../assets/image1.jpeg'),
    require('../../assets/image1.png'),
    require('../../assets/image2.png'),
    require('../../assets/image3.png'), // Add more images here
  ];

  const animateImageTransition = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      animateImageTransition();
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);
  const SectionSeparator = () => (
    <View style={styles.separatorContainer}>
      {/* Fading line left */}
      <LinearGradient
        colors={['transparent', '#8a348a88']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.separatorLine}
      />
  
      {/* Icon with glow */}
      <View style={styles.iconWrapper}>
        <LinearGradient
          colors={['#8a348a', '#a13ca1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconBackground}
        >
          <Icon name="asterisk" size={14} color="#fff" />
        </LinearGradient>
      </View>
  
      {/* Fading line right */}
      <LinearGradient
        colors={['#8a348a88', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.separatorLine}
      />
    </View>
  );
  
  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentIndex ? '#8a348a' : 'rgba(138, 52, 138, 0.3)',
                width: index === currentIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  };
  return (
    
    <SafeAreaProvider>
      <View style={{ flex: 1, position: 'relative' }}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
       {/* StatusBar */}
       <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       
        {/* Main Text */}
        <Text style={styles.mainText}>Forum Horizons Maroc 2025</Text>

        {/* Countdown Timer */}
        <View style={styles.countdownContainer}>
          <FlipNumber value={days} label="JOURS" />
          <FlipNumber value={hours} label="HEURES" />
        </View>

        {/* Inscrivez-vous Button */}
        <Animated.View style={[styles.registerButtonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            onPress={handleButtonPress}
            activeOpacity={0.7}
          >
            <BlurView intensity={90} tint="light" style={styles.registerButton}>
              <LinearGradient
                colors={['rgba(138, 52, 138, 0.9)', 'rgba(255, 107, 139, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.registerGradient}
              >
                <Text style={styles.registerButtonText}>Inscrivez-vous</Text>
                <View style={styles.buttonGlow} />
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Image Box with Slideshow */}
        <View style={styles.imageBoxContainer}>
          <BlurView intensity={20} tint="light" style={styles.imageBlurContainer}>
            <LinearGradient
              colors={['rgba(138, 52, 138, 0.1)', 'rgba(161, 60, 161, 0.1)']}
              style={styles.imageGradient}
            >
              <Animated.View
                style={[
                  styles.imageAnimatedContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <Image
                  source={images[currentIndex]}
                  style={styles.imageBox}
                  resizeMode="cover"
                />
              </Animated.View>
              {renderPaginationDots()}
            </LinearGradient>
          </BlurView>
        </View>

        {/* Statistics Section */}
        <View style={styles.statisticsContainer}>
          <StatCard
            number="+2200"
            label="Visiteurs"
            icon="users"
            index={0}
          />
          <StatCard
            number="+60"
            label="Entreprises"
            icon="building"
            index={1}
          />
          <StatCard
            number="+5000 m²"
            label="Surface"
            icon="map-marker"
            index={2}
          />
        </View>

        <View style={styles.pourquoiSection}>
      <LinearGradient
        colors={['#f8f5fc', '#f2e6fa']}
        style={styles.pourquoiGradient}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pourquoi venir au forum ?</Text>
          <View style={styles.titleUnderline} />
        </View>

        <View style={styles.pourquoiGrid}>
          {pourquoiItems.map((item) => (
            (expandedItem === null || expandedItem === item.title) && (
              <PourquoiItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                content={item.content}
                style={[
                  styles.pourquoiCard,
                  expandedItem === item.title && styles.expandedCard
                ]}
                isExpanded={expandedItem === item.title}
                onPress={() => {
                  setExpandedItem(expandedItem === item.title ? null : item.title);
                }}
              />
            )
          ))}
        </View>
      </LinearGradient>
    </View>
    <SectionSeparator />
    <View style={styles.planningSection}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>🗓️ Ne ratez pas</Text>
          <View style={styles.titleUnderline} />
        </View>

        <View style={styles.planningContainer}>
          {planningItems.map((item, index) => (
            <PlanningItem
              key={index}
              time={item.time}
              title={item.title}
              description={item.description}
              details={item.details}
              isExpanded={expandedEvent === index}
              onPress={() => setExpandedEvent(expandedEvent === index ? null : index)}
            />
          ))}
          <TouchableOpacity 
            style={styles.seeMoreButton} 
            onPress={() => console.log("Voir plus clicked")}
          >
            <Text style={styles.seeMoreText}>Voir plus d'événements</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SectionSeparator />
  <View style={styles.mediaSection}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>📢 Ils parlent de nous</Text>
    <View style={styles.titleUnderline} />
  </View>

      <View style={styles.mediaContent}>
        <MediaCard
          logo={require('../../assets/medi1radio.png')}
          headline="منتدى آفاق المغرب.. أو طريق العودة إلى الوطن"
          excerpt="من الطلاب المغاربة إلى بلدان أوروبية منها فرنسا لإتمام دراستهم أو البحث عن عمل بعد الحصول على شهادات تؤهلهم ..."
          details={[
            "Interview avec le président de l'association",
            "Témoignages exclusifs des participants",
            "Analyse du marché de l'emploi africain"
          ]}
          link="https://www.medi1.com/ar/episode/198031/%D9%85%D9%86%D8%AA%D8%AF%D9%89-%D8%A2%D9%81%D8%A7%D9%82-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8.-%D8%A3%D9%88-%D8%B7%D8%B1%D9%8A%D9%82-%D8%A7%D9%84%D8%B9%D9%88%D8%AF%D8%A9-%D8%A5%D9%84%D9%89-%D8%A7%D9%84%D9%88%D8%B7%D9%86"
          isExpanded={expandedArticle === 0}
          onPress={() => setExpandedArticle(expandedArticle === 0 ? null : 0)}
        />

        <MediaCard
          logo={require('../../assets/snrt.png')}
          headline="Le Forum Horizons Maroc, invité de la SNRT"
          excerpt="Invité de l'émission matinale « Sbah Bladi », Ahmed Belghiti..."
          details={[
            "Discussion sur les objectifs du forum",
            "Présentation des partenaires clés",
            "Programme détaillé des activités"
          ]}
          link="https://soundcloud.com/hassan-yazane-965217114/intervention-snrt-forum-horizons-maroc"
          isExpanded={expandedArticle === 1}
          onPress={() => setExpandedArticle(expandedArticle === 1 ? null : 1)}
        />

        <MediaCard
          logo={require('../../assets/map.png')}
          headline="Le Forum Horizons Maroc revient fin mai à Paris"
          excerpt="Après une édition 100% digitale en 2021 à cause de la pandémie mondiale du Covid-19..."
          details={[
            "Nouvelles entreprises participantes",
            "Focus sur les innovations 2025",
            "Programme des conférences spéciales"
          ]}
          link="https://www.mapexpress.ma/actualite/economie-et-finance/forum-horizons-maroc-revient-fin-mai-paris-nouvelle-edition-tournee-vers-lafrique/"
          isExpanded={expandedArticle === 2}
          onPress={() => setExpandedArticle(expandedArticle === 2 ? null : 2)}
        />
      </View>
    </View>
          </ScrollView>
      </SafeAreaView>
      </View>
    </SafeAreaProvider>
    
  );
};

const styles = StyleSheet.create({
  cardTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#6A0DAD',
  marginBottom: 8,
},
cardContent: {
  fontSize: 14,
  color: '#555',
  lineHeight: 20,
  marginTop: 10,
  paddingTop: 10,
  borderTopWidth: 1,
  borderTopColor: '#eee',
},
  mainText: {
    color: '#8a348a',
    fontSize: 18,
    fontFamily: 'Josefin Sans',
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 5,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  flipContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  flipBlurContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  flipGradient: {
    borderRadius: 12,
    padding: 1.5,
  },
  flipInnerContainer: {
    width: 60,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 3,
  },
  flipTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  flipBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  flipDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    top: '50%',
    marginTop: -0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 2,
  },
  flipCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backfaceVisibility: 'hidden',
    transformOrigin: 'bottom',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  flipCardBack: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backfaceVisibility: 'hidden',
    transformOrigin: 'top',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  flipNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  labelGradient: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  flipLabel: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  registerButtonContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  registerButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  registerGradient: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
  },
  imageBoxContainer: {
    marginTop: 30,
    width: width * 0.85,
    height: 200,
    alignSelf: 'center',
  },
  imageBlurContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageGradient: {
    flex: 1,
    padding: 8,
  },
  imageAnimatedContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageBox: {
    width: '100%',
    height: '100%',
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
    gap: 12,
  },
  statCardContainer: {
    flex: 1,
    maxWidth: 110,
    aspectRatio: 0.8,
  },
  statCardBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statCardGradient: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statCardNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statCardLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

 
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: '0.3s',
  },
  expandedCard: {
    width: '100%',
    marginVertical: 10,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  sectionHeader: {
    paddingVertical: 15,
    marginTop: 30,
    alignItems: 'center',
  },
  // In the StyleSheet object:
pourquoiSection: {
  marginTop: 30,
  marginBottom: 30,
  backgroundColor: '#f8f7fc',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 5,
  borderRadius:10,
},
pourquoiGradient: {
  paddingVertical: 25,
  paddingHorizontal: 15,
},
sectionHeader: {
  alignItems: 'center',
  marginBottom: 25,
  width: '100%',
},
sectionTitle: {
  fontSize: 20,
  fontFamily: 'Nunito-ExtraBold',
  fontWeight: '600',
  color: '#6A0DAD',
  textTransform: 'uppercase',
  letterSpacing: 1.2,
  marginBottom: 10,
  textAlign: 'center', // Ensure title centering
},

pourquoiGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  paddingHorizontal: 10,
},
pourquoiCard: {
  width: '48%', // For 2-column layout
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 15,
  marginVertical: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},
// Update existing PourquoiItem text styles
planningSection: {
  backgroundColor: '#f8f7fc',
  width: '100%',
  marginTop: 30,
  marginBottom: 30,
  paddingVertical: 20,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: '#eeeef5',
},
sectionHeaderContainer: {
  paddingHorizontal: 20,
  marginBottom: 15,
},

planningContainer: {
  paddingHorizontal: 20,
},
planningItem: {
  marginBottom: 15,
  padding: 18,
  borderRadius: 12,
  backgroundColor: '#fff',
  shadowColor: '#8a348a',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  elevation: 5,
},
expandedPlanningItem: {
  backgroundColor: '#fdfbff',
  borderWidth: 1,
  borderColor: '#8a348a22',
},
planningTime: {
  fontSize: 15,
  fontWeight: '700',
  color: '#8a348a',
  letterSpacing: 0.5,
  marginBottom: 5,
},
planningTitle: {
  alignItems: 'center',
  fontSize: 17,
  fontWeight: '600',
  color: '#2d3748',
  marginBottom: 8,
},
detailsContainer: {
  marginTop: 12,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#eeeef5',
},
detailsText: {
  fontSize: 14,
  color: '#4a5568',
  lineHeight: 20,
  marginBottom: 12,
},
detailsHeading: {
  fontSize: 14,
  fontWeight: '700',
  color: '#6A0DAD',
  marginBottom: 8,
},
detailItem: {
  flexDirection: 'row',
  marginBottom: 6,
},
bullet: {
  color: '#8a348a',
  marginRight: 8,
},
detailText: {
  fontSize: 14,
  color: '#4a5568',
  flex: 1,
},
chevronIcon: {
  marginLeft: 10,
},
seeMoreButton: {
  marginTop: 15,
  paddingVertical: 12,
  alignItems: 'center',
  backgroundColor: '#8a348a10',
  borderRadius: 10,
},
seeMoreText: {
  color: '#8a348a',
  fontWeight: '600',
  fontSize: 14,
},
  mediaContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sectionHeader: {
  paddingHorizontal: 20,
  marginBottom: 15,
},
  mediaLogo: {
    width: 120,
    height: 50,
    marginBottom: 10,
  },
  mediaHeadline: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  mediaExcerpt: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  readMore: {
    fontSize: 14,
    color: '#8a348a',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  mediaSection: {
  backgroundColor: '#f8f7fc',
  width: '100%',
  marginTop: 25,
  paddingVertical: 25,
  borderTopWidth: 1,
  borderColor: '#eee',
},
mediaContent: {
  paddingHorizontal: 20,
},
mediaCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  marginBottom: 15,
  alignItems: 'center',
  shadowColor: '#8a348a',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 3,
},
expandedMediaCard: {
  backgroundColor: '#fdfcff',
  borderWidth: 1,
  borderColor: '#8a348a33',
},
mediaLogo: {
  width: 140,
  height: 60,
  marginBottom: 15,
},
mediaHeadline: {
  fontSize: 16,
  fontWeight: '600',
  color: '#2d3748',
  textAlign: 'center',
  marginBottom: 12,
  lineHeight: 22,
},
excerptContainer: {
  alignItems: 'center',
},
mediaExcerpt: {
  fontSize: 14,
  color: '#4a5568',
  textAlign: 'center',
  lineHeight: 20,
  marginBottom: 8,
},
detailsContainer: {
  marginTop: 15,
  paddingTop: 15,
  borderTopWidth: 1,
  borderTopColor: '#eee',
  width: '100%',
},
detailText: {
  fontSize: 14,
  color: '#4a5568',
  lineHeight: 20,
  marginBottom: 8,
  textAlign: 'left',
},
originalArticleButton: {
  marginTop: 15,
  paddingVertical: 12,
  backgroundColor: '#8a348a10',
  borderRadius: 8,
  alignItems: 'center',
},
originalArticleText: {
  color: '#8a348a',
  fontWeight: '600',
  fontSize: 14,
},
readMore: {
  color: '#8a348a',
  fontSize: 14,
  fontWeight: '600',
  marginTop: 8,
},
titleUnderline: {
  height: 3,
  width: '100%', // Changed to percentage-based width
  backgroundColor: '#8a348a',
  borderRadius: 2,
  marginTop: 5,
},
separatorContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 20,
  width: '100%',
  paddingHorizontal: 20,
},
separatorLine: {
  flex: 1,
  height: 1,
},
iconWrapper: {
  marginHorizontal: 10,
  width: 30,
  height: 30,
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
},
iconBackground: {
  width: 30,
  height: 30,
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
},

});

export default Body;