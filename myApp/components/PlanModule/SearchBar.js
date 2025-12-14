import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';

const SearchBar = ({
    query,
    onQueryChange,
    results = [],
    onResultSelect,
    showResults = false,
    onClearSearch
}) => {
    const handleClear = () => {
        onQueryChange('');
        onClearSearch?.();
    };

    return (
        <View style={styles.container}>
            {/* Barre de recherche */}
            <View style={styles.searchBarWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Rechercher un exposant ou stand..."
                    placeholderTextColor="#999"
                    value={query}
                    onChangeText={onQueryChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {query.length > 0 && (
                    <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Dropdown résultats */}
            {showResults && query.length > 0 && (
                <View style={styles.dropdown}>
                    {results.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Aucun résultat</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={results.slice(0, 6)}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.resultItem}
                                    onPress={() => onResultSelect(item)}
                                >
                                    <Text style={styles.companyName} numberOfLines={1}>
                                        {item.company_name}
                                    </Text>
                                    <Text style={styles.standNumber}>
                                        Stand {item.number || item.id}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            style={styles.resultsList}
                            keyboardShouldPersistTaps="handled"
                        />
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 1001,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        outlineStyle: 'none',
    },
    clearButton: {
        padding: 8,
        marginLeft: 8,
        zIndex: 1002,
    },
    clearIcon: {
        fontSize: 18,
        color: '#999',
        fontWeight: 'bold',
    },
    dropdown: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: -8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 3,
        maxHeight: 300,
        zIndex: 999,
    },
    resultsList: {
        maxHeight: 300,
    },
    resultItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    standNumber: {
        fontSize: 14,
        color: '#666',
    },
    emptyState: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
});

export default SearchBar;
