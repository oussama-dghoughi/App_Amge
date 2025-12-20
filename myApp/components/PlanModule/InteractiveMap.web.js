import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, Pressable, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import StandRect from './StandRect';
import StandBottomSheet from './StandBottomSheet';
import SearchBar from './SearchBar';
import ExhibitorsList from './ExhibitorsList';
import { fetchActivePlan, transformStandsForApp } from '../../services/planApi';
import { PLAN_RATIO } from './planConfig';
import { filterStands } from './searchUtils';
import { enrichAllStands } from './enrichUtils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const InteractiveMap = () => {
    const imageRatio = PLAN_RATIO;
    const [selectedStand, setSelectedStand] = useState(null);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showList, setShowList] = useState(false);

    // Nouveaux states pour l'API
    const [stands, setStands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States pour visité/favoris
    const [visitedStands, setVisitedStands] = useState({});
    const [favoriteStands, setFavoriteStands] = useState({});

    const scrollViewRef = useRef(null);
    const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

    const DEBUG_MODE = false;

    // Load stands from API
    useEffect(() => {
        const loadStands = async () => {
            try {
                setLoading(true);
                console.log('[InteractiveMap.web] Loading stands from API...');
                const data = await fetchActivePlan();

                if (data.success && data.data && data.data.stands) {
                    const transformedStands = transformStandsForApp(data.data.stands);
                    setStands(transformedStands);
                    console.log(`[InteractiveMap.web] Loaded ${transformedStands.length} stands from API`);
                } else {
                    throw new Error('Invalid API response');
                }

                setLoading(false);
            } catch (err) {
                console.error('[InteractiveMap.web] Error loading stands:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadStands();
    }, []);

    const standsEnriched = useMemo(() => {
        if (!stands.length) {
            console.log('[InteractiveMap.web] No stands to display');
            return [];
        }
        console.log('[InteractiveMap.web] Using stands from API (already enriched)');
        // Pas besoin d'enrichir - les données de l'API contiennent déjà companyDetails
        return stands;
    }, [stands]);

    const searchResults = useMemo(() => {
        return filterStands(standsEnriched, searchQuery);
    }, [searchQuery, standsEnriched]);

    const handleStandPress = (stand) => {
        console.log('Stand pressed:', stand.company_name);
        setSelectedStand(stand);
        setShowBottomSheet(true);
        setShowSearchResults(false);
    };

    const handleCloseBottomSheet = () => {
        setShowBottomSheet(false);
        setSelectedStand(null);
    };

    const handleMapPress = () => {
        if (showSearchResults) {
            setShowSearchResults(false);
        } else if (showBottomSheet || selectedStand) {
            handleCloseBottomSheet();
        }
    };

    const focusOnStand = (stand) => {
        if (!scrollViewRef.current || !mapDimensions.width) return;

        const standCenterX = ((stand.x + stand.w / 2) / 100) * mapDimensions.width;
        const standCenterY = ((stand.y + stand.h / 2) / 100) * mapDimensions.height;

        const scrollX = Math.max(0, standCenterX - SCREEN_WIDTH / 2);
        const scrollY = Math.max(0, standCenterY - SCREEN_HEIGHT / 2);

        scrollViewRef.current.scrollTo({
            x: scrollX,
            y: scrollY,
            animated: true,
        });
    };

    const handleSearchResultSelect = (stand) => {
        setSearchQuery('');
        setShowSearchResults(false);
        handleStandPress(stand);

        setTimeout(() => {
            focusOnStand(stand);
        }, 100);
    };

    const handleSelectFromList = (stand) => {
        console.log('[List] Stand selected:', stand.company_name);
        setShowList(false);
        setSelectedStand(stand);
        setShowBottomSheet(true);
    };

    const handleQueryChange = (text) => {
        setSearchQuery(text);
        setShowSearchResults(text.length > 0);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowSearchResults(false);
    };

    // Toggle visited/favorite (same as native)
    const toggleVisited = (standId) => {
        setVisitedStands((prev) => ({
            ...prev,
            [standId]: !prev[standId],
        }));
    };

    const toggleFavorite = (standId) => {
        setFavoriteStands((prev) => ({
            ...prev,
            [standId]: !prev[standId],
        }));
    };

    const mapWidth = Math.max(SCREEN_WIDTH * 0.8, 600);

    const handleMapLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setMapDimensions({ width, height });
    };

    const showListButton = !showList && !showBottomSheet;

    // Afficher loading
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>
                    Chargement du plan...
                </Text>
            </View>
        );
    }

    // Afficher erreur
    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ fontSize: 18, color: '#dc3545', marginBottom: 10, fontWeight: 'bold' }}>
                    ❌ Erreur
                </Text>
                <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
                    {error}
                </Text>
                <Text style={{ fontSize: 12, color: '#999', textAlign: 'center', marginTop: 10 }}>
                    Vérifiez que le backend est démarré sur http://localhost:5000
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SearchBar
                query={searchQuery}
                onQueryChange={handleQueryChange}
                results={searchResults}
                onResultSelect={handleSearchResultSelect}
                showResults={showSearchResults}
                onClearSearch={handleClearSearch}
            />

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <Pressable onPress={handleMapPress}>
                    <View
                        style={[styles.mapWrapper, {
                            aspectRatio: imageRatio,
                            width: mapWidth,
                        }]}
                        onLayout={handleMapLayout}
                    >
                        <Image
                            source={require('../../assets/maps/PLAN.png')}
                            style={styles.mapImage}
                            resizeMode="contain"
                        />
                        <View style={styles.overlayContainer}>
                            {standsEnriched.map((stand) => (
                                <StandRect
                                    key={stand.id}
                                    x={stand.x}
                                    y={stand.y}
                                    w={stand.w}
                                    h={stand.h}
                                    isSelected={selectedStand?.id === stand.id}
                                    isVisited={!!visitedStands[stand.id]}
                                    isFavorite={!!favoriteStands[stand.id]}
                                    debug={DEBUG_MODE}
                                    onPress={() => handleStandPress(stand)}
                                />
                            ))}
                        </View>
                    </View>
                </Pressable>
            </ScrollView>

            {showListButton && (
                <TouchableOpacity
                    style={styles.listButton}
                    onPress={() => setShowList(true)}
                >
                    <Text style={styles.listButtonText}>📋 Liste</Text>
                </TouchableOpacity>
            )}

            <StandBottomSheet
                stand={selectedStand}
                visible={showBottomSheet}
                onClose={handleCloseBottomSheet}
                isVisited={selectedStand ? visitedStands[selectedStand.id] : false}
                isFavorite={selectedStand ? favoriteStands[selectedStand.id] : false}
                onToggleVisited={toggleVisited}
                onToggleFavorite={toggleFavorite}
            />

            <ExhibitorsList
                visible={showList}
                onClose={() => setShowList(false)}
                standsEnriched={standsEnriched}
                onSelectStand={handleSelectFromList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    mapWrapper: {
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    listButton: {
        position: 'absolute',
        top: 90,
        right: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 100,
    },
    listButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default InteractiveMap;
