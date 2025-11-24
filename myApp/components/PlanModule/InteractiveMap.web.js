import React, { useState, useRef, useMemo } from 'react';
import { View, Image, StyleSheet, ScrollView, Pressable, Dimensions, TouchableOpacity, Text } from 'react-native';
import StandRect from './StandRect';
import StandBottomSheet from './StandBottomSheet';
import SearchBar from './SearchBar';
import ExhibitorsList from './ExhibitorsList';
import { standsCurrent } from '../../data/standsIndex';
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

    const scrollViewRef = useRef(null);
    const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

    const DEBUG_MODE = false;

    const standsEnriched = useMemo(() => {
        console.log('[InteractiveMap.web] Enriching stands...');
        return enrichAllStands(standsCurrent);
    }, [standsCurrent]);

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

        const standCenterX = ((stand.position_x + stand.stand_w / 2) / 100) * mapDimensions.width;
        const standCenterY = ((stand.position_y + stand.stand_h / 2) / 100) * mapDimensions.height;

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

    const mapWidth = Math.max(SCREEN_WIDTH * 0.8, 600);

    const handleMapLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setMapDimensions({ width, height });
    };

    const showListButton = !showList && !showBottomSheet;

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
                                    position_x={stand.position_x}
                                    position_y={stand.position_y}
                                    stand_w={stand.stand_w}
                                    stand_h={stand.stand_h}
                                    isSelected={selectedStand?.id === stand.id}
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
        top: 80,
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
