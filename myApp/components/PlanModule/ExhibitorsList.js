import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    SectionList,
    TouchableOpacity,
    SafeAreaView,
    TextInput // Added TextInput
} from 'react-native';
import { normalize } from './searchUtils';

const ExhibitorsList = ({ visible, onClose, standsEnriched, onSelectStand }) => {
    const [searchQuery, setSearchQuery] = useState(''); // Added state for search query

    // Grouper et trier les stands par première lettre
    const sections = useMemo(() => {
        if (!standsEnriched || standsEnriched.length === 0) return [];

        const normalizedQuery = normalize(searchQuery);

        // First, filter based on search query
        const searchFilteredStands = standsEnriched.filter(stand => {
            const name = stand.companyDetails?.name || stand.company_name;
            if (!name) return false; // Skip stands without a name
            return normalize(name).includes(normalizedQuery);
        });

        // Filtrer les stands avec noms valides (already handled by searchFilteredStands implicitly)
        const validStands = searchFilteredStands.filter(stand =>
            stand.company_name || stand.companyDetails?.name
        );

        // Grouper par première lettre
        const grouped = validStands.reduce((acc, stand) => {
            const name = stand.companyDetails?.name || stand.company_name;
            const normalized = normalize(name);
            const firstLetter = normalized.charAt(0).toUpperCase();

            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }

            acc[firstLetter].push(stand);
            return acc;
        }, {});

        // Convertir en array et trier
        const sectionsArray = Object.keys(grouped)
            .sort() // Tri A→Z
            .map(letter => ({
                title: letter,
                data: grouped[letter].sort((a, b) => {
                    const nameA = normalize(a.companyDetails?.name || a.company_name);
                    const nameB = normalize(b.companyDetails?.name || b.company_name);
                    return nameA.localeCompare(nameB);
                })
            }));

        console.log('[ExhibitorsList] Generated sections:', sectionsArray.length);
        return sectionsArray;
    }, [standsEnriched, searchQuery]); // Added searchQuery to dependencies

    const renderSectionHeader = ({ section }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
    );

    const renderItem = ({ item }) => {
        const displayName = item.companyDetails?.name || item.company_name;
        const standNumber = item.stand_number || item.id;

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => onSelectStand(item)}
            >
                <Text style={styles.itemName} numberOfLines={2}>
                    {displayName}
                </Text>
                {standNumber && (
                    <Text style={styles.itemStand}>Stand {standNumber}</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Liste des exposants</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher un exposant..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        clearButtonMode="whileEditing"
                    />
                </View>

                {/* Liste */}
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderSectionHeader={renderSectionHeader}
                    renderItem={renderItem}
                    stickySectionHeadersEnabled={true}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyListContainer}>
                            <Text style={styles.emptyListText}>Aucun exposant trouvé.</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 20,
        color: '#666',
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    listContent: {
        paddingBottom: 20,
    },
    sectionHeader: {
        backgroundColor: '#f8f8f8',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    itemStand: {
        fontSize: 14,
        color: '#666',
    },
    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyListText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ExhibitorsList;
