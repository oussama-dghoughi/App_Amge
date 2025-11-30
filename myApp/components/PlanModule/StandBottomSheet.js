import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';

const StandBottomSheet = ({
  stand,
  visible,
  onClose,
  isVisited,
  isFavorite,
  onToggleVisited,
  onToggleFavorite,
}) => {
        if (!stand) return null;

    const hasCompanyDetails = Boolean(stand.companyDetails);

    const handleWebsitePress = () => {
        const url = stand.companyDetails?.website;
        if (!url || url.trim() === '') {
            console.warn('[BottomSheet] Website URL is empty');
            return;
        }

        try {
            if (Platform.OS === 'web') {
                window.open(url, '_blank');
            } else {
                const { Linking } = require('react-native');
                Linking.openURL(url).catch((err) =>
                    console.error('[BottomSheet] Error opening URL:', err)
                );
            }
        } catch (error) {
            console.error('[BottomSheet] Error handling website press:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.handle} />
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                   <View style={styles.content}>
                        {hasCompanyDetails ? (
                            <>
                                {/* Nom officiel de l'entreprise */}
                                <Text style={styles.companyName}>
                                    {stand.companyDetails.name}
                                </Text>

                                {/* Numéro de stand */}
                                {stand.stand_number && (
                                    <Text style={styles.standNumber}>
                                        Stand {stand.stand_number}
                                    </Text>
                                )}

                                {/* Secteur/Field */}
                                {stand.companyDetails.field && (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldLabel}>Secteur</Text>
                                        <Text style={styles.fieldValue}>
                                            {stand.companyDetails.field}
                                        </Text>
                                    </View>
                                )}

                                {/* Description */}
                                {stand.companyDetails.details && (
                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.detailsText}>
                                            {stand.companyDetails.details}
                                        </Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Fallback minimal si pas de match */}
                                <Text style={styles.companyName}>
                                    {stand.company_name}
                                </Text>
                                {stand.stand_number && (
                                    <Text style={styles.standNumber}>
                                        Stand {stand.stand_number}
                                    </Text>
                                )}
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>
                                        Informations complémentaires non disponibles
                                    </Text>
                                </View>
                            </>
                        )}

                        {/* ✅ STATUS BUTTONS – always visible */}
                        <View style={styles.statusRow}>
                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    isVisited && styles.statusButtonVisited,
                                ]}
                                onPress={() => onToggleVisited?.(stand.id)}
                            >
                                <Text
                                    style={[
                                        styles.statusButtonText,
                                        isVisited && styles.statusButtonTextVisited,
                                    ]}
                                >
                                    {isVisited ? '✅ Visité' : 'Marquer comme visité'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    isFavorite && styles.statusButtonFavorite,
                                ]}
                                onPress={() => onToggleFavorite?.(stand.id)}
                            >
                                <Text
                                    style={[
                                        styles.statusButtonText,
                                        isFavorite && styles.statusButtonTextFavorite,
                                    ]}
                                >
                                    {isFavorite ? '★ Favori' : 'Ajouter aux favoris'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* 🌐 Website button – only if we have a website */}
                        {hasCompanyDetails &&
                            stand.companyDetails.website &&
                            stand.companyDetails.website.trim() !== '' && (
                                <TouchableOpacity
                                    style={[
                                        styles.websiteButton,
                                        isVisited && styles.websiteButtonVisited,
                                        isFavorite && styles.websiteButtonFavorite,
                                    ]}
                                    onPress={handleWebsitePress}
                                >
                                    <Text style={styles.websiteText}>
                                        🌐 Voir le site web
                                        {isFavorite ? ' ★' : ''}
                                    </Text>
                                </TouchableOpacity>
                            )}
                    </View>

                </Pressable>
            </Pressable>
        </Modal>
    );
};


const styles = StyleSheet.create({
 backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },

    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        minHeight: 250,
        maxHeight: '70%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },

    header: {
        paddingTop: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 8,
    },

    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#DDD',
        borderRadius: 2,
        marginBottom: 10,
    },

    closeButton: {
        position: 'absolute',
        right: 16,
        top: 12,
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

    content: {
        paddingHorizontal: 24,
        paddingTop: 12,
    },

    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },

    standNumber: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
        fontWeight: '600',
    },

    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },

    fieldLabel: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
        fontWeight: '600',
    },

    fieldValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },

    detailsContainer: {
        marginTop: 8,
        marginBottom: 16,
    },

    detailsText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#555',
    },

    /* ----------------------------
       VISITED / FAVORITE BUTTONS
       ---------------------------- */
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: 12,
    },

    statusButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        marginRight: 10, // fallback instead of RN gap
    },

    statusButtonVisited: {
        backgroundColor: '#E6F9EB',   // light green
        borderColor: '#21A453',
    },

    statusButtonFavorite: {
        backgroundColor: '#FFF5D9',   // light yellow
        borderColor: '#FFB200',
    },

    statusButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },

    statusButtonTextVisited: {
        color: '#177A3D',
    },

    statusButtonTextFavorite: {
        color: '#A66A00',
    },

    /* ----------------------------
       WEBSITE BUTTON (dynamic)
       ---------------------------- */
    websiteButton: {
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',  // default blue
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    websiteButtonVisited: {
        backgroundColor: '#0058C5',  // deeper blue
    },

    websiteButtonFavorite: {
        borderWidth: 2,
        borderColor: '#FFD700',      // gold border
    },

    websiteText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});

export default StandBottomSheet;
