import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Image, StyleSheet, Platform, Pressable, TouchableOpacity, Text } from 'react-native';
import StandRect from './StandRect';
import StandBottomSheet from './StandBottomSheet';
import SearchBar from './SearchBar';
import ExhibitorsList from './ExhibitorsList';
import { standsCurrent } from '../../data/standsIndex';
import { PLAN_RATIO } from './planConfig';
import { filterStands } from './searchUtils';
import { enrichAllStands } from './enrichUtils';

// Conditional import for zoomable view (mobile only)
let ReactNativeZoomableView;
if (Platform.OS !== 'web') {
    ReactNativeZoomableView = require('@dudigital/react-native-zoomable-view').ReactNativeZoomableView;
}

const InteractiveMap = () => {
    const [imageRatio, setImageRatio] = useState(null);
    const [selectedStand, setSelectedStand] = useState(null);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showList, setShowList] = useState(false);
    const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
    const [visitedStands, setVisitedStands] = useState({});
    const [favoriteStands, setFavoriteStands] = useState({});

    const zoomableViewRef = useRef(null);

    const DEBUG_MODE = false;

    // Load image ratio (fallback to config)
    useEffect(() => {
        const mapImage = require('../../assets/maps/PLAN.png');
        Image.getSize(
            Image.resolveAssetSource(mapImage).uri,
            (width, height) => {
                const ratio = width / height;
                console.log(`[InteractiveMap Native] Image dimensions: ${width}x${height}, ratio: ${ratio}`);
                setImageRatio(ratio);
            },
            (error) => {
                console.error('[InteractiveMap Native] Error loading image size:', error);
                console.warn('[InteractiveMap Native] Using fallback ratio from config:', PLAN_RATIO);
                setImageRatio(PLAN_RATIO);
            }
        );
    }, []);

    // Enrich stands (memoized)
    const standsEnriched = useMemo(() => {
        console.log('[InteractiveMap.native] Enriching stands...');
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

    // Autofocus after search selection (native zoomable view)
    const focusOnStand = (stand) => {
        if (!zoomableViewRef.current || !mapDimensions.width) return;
        const standCenterX = (stand.x + stand.w / 2) / 100;
        const standCenterY = (stand.y + stand.h / 2) / 100;
        try {
            if (typeof zoomableViewRef.current.zoomToLocation === 'function') {
                zoomableViewRef.current.zoomToLocation(
                    standCenterX * mapDimensions.width,
                    standCenterY * mapDimensions.height,
                    2,
                    true
                );
            } else if (typeof zoomableViewRef.current.moveTo === 'function') {
                zoomableViewRef.current.moveTo(
                    standCenterX * mapDimensions.width,
                    standCenterY * mapDimensions.height,
                    true
                );
            } else {
                console.warn('[Autofocus Native] ZoomableView API not available');
            }
        } catch (error) {
            console.warn('[Autofocus Native] Error focusing:', error);
        }
    };

    const handleSearchResultSelect = (stand) => {
        setSearchQuery('');
        setShowSearchResults(false);
        handleStandPress(stand);
        setTimeout(() => focusOnStand(stand), 100);
    };

    const handleSelectFromList = (stand) => {
        console.log('[List] Stand selected:', stand.company_name);
        setShowList(false);
        setSelectedStand(stand);
        setShowBottomSheet(true);

        setVisitedStands((prev) => ({
            ...prev,
            [stand.id]: true,
        }));
    };


    const handleQueryChange = (text) => {
        setSearchQuery(text);
        setShowSearchResults(text.length > 0);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const handleMapLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setMapDimensions({ width, height });
    };
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

    if (!imageRatio) {
        return <View style={styles.loadingContainer} />;
    }

    const showListButton = !showList && !showBottomSheet;

    const mapContent = (
        <Pressable onPress={handleMapPress}>
            <View style={[styles.mapWrapper, { aspectRatio: imageRatio }]} onLayout={handleMapLayout}>
                <Image source={require('../../assets/maps/PLAN.png')} style={styles.mapImage} resizeMode="contain" />
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
    );

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

            <ReactNativeZoomableView
                ref={zoomableViewRef}
                maxZoom={3}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                style={styles.zoomableView}
            >
                {mapContent}
            </ReactNativeZoomableView>

            {showListButton && (
                <TouchableOpacity style={styles.listButton} onPress={() => setShowList(true)}>
                    <Text style={styles.listButtonText}>📋 Liste</Text>
                </TouchableOpacity>
            )}

            <StandBottomSheet
                stand={selectedStand}
                visible={showBottomSheet}
                onClose={handleCloseBottomSheet}
                isVisited={selectedStand ? !!visitedStands[selectedStand.id] : false}
                isFavorite={selectedStand ? !!favoriteStands[selectedStand.id] : false}
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
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, backgroundColor: '#f5f5f5' },
    zoomableView: { flex: 1, padding: 10 },
    mapWrapper: { width: '100%', position: 'relative' },
    mapImage: { width: '100%', height: '100%' },
    overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
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
    listButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export default InteractiveMap;
