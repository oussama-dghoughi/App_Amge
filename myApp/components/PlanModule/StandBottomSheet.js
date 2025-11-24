import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';

const StandBottomSheet = ({ stand, visible, onClose }) => {
    if (!stand) return null;

    const hasCompanyDetails = Boolean(stand.companyDetails);

    const handleWebsitePress = () => {
        const url = stand.companyDetails?.website;

        // Protection : URL vide ou invalide
        if (!url || url.trim() === '') {
            console.warn('[BottomSheet] Website URL is empty');
            return;
        }

        try {
            if (Platform.OS === 'web') {
                // Web : ouvrir dans nouvel onglet
                window.open(url, '_blank');
            } else {
                // Native : utiliser Linking (déjà importé si nécessaire)
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
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* Backdrop cliquable pour fermer */}
            <Pressable style={styles.backdrop} onPress={onClose}>
                {/* Bottom sheet content */}
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    {/* Header avec bouton fermer */}
                    <View style={styles.header}>
                        <View style={styles.handle} />
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Contenu */}
                    <View style={styles.content}>
                        {hasCompanyDetails ? (
                            <>
                                {/* Nom officiel de l'entreprise */}
                                <Text style={styles.companyName}>
                                    {stand.companyDetails.name}
                                </Text>

                                {/* Numéro de stand */}
                                {stand.stand_number && (
                                    <Text style={styles.standNumber}>Stand {stand.stand_number}</Text>
                                )}

                                {/* Secteur/Field */}
                                {stand.companyDetails.field && (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.fieldLabel}>Secteur</Text>
                                        <Text style={styles.fieldValue}>{stand.companyDetails.field}</Text>
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

                                {/* Website - Réactivé avec protection */}
                                {stand.companyDetails.website && stand.companyDetails.website.trim() !== '' && (
                                    <TouchableOpacity
                                        style={styles.websiteButton}
                                        onPress={handleWebsitePress}
                                    >
                                        <Text style={styles.websiteText}>🌐 Voir le site web</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Fallback minimal si pas de match */}
                                <Text style={styles.companyName}>
                                    {stand.company_name}
                                </Text>
                                {stand.stand_number && (
                                    <Text style={styles.standNumber}>Stand {stand.stand_number}</Text>
                                )}
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>
                                        Informations complémentaires non disponibles
                                    </Text>
                                </View>
                            </>
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
    websiteButton: {
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    websiteText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    noDataContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#FFD700',
    },
    noDataText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default StandBottomSheet;
