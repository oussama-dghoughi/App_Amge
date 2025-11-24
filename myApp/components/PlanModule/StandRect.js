import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const StandRect = ({
    position_x,
    position_y,
    stand_w,
    stand_h,
    onPress,
    isSelected = false,
    debug = false,
}) => {
    // Styles conditionnels selon l'état
    const getStyles = () => {
        if (isSelected) {
            // Stand sélectionné : bordure jaune + halo
            return {
                borderWidth: 2,
                borderColor: '#FFD700', // Jaune doré
                backgroundColor: 'rgba(255, 215, 0, 0.2)', // Halo jaune léger
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 5, // Android shadow
            };
        }

        if (debug) {
            // Mode debug : rectangles rouges visibles
            return {
                borderWidth: 1,
                borderColor: 'rgba(255, 0, 0, 0.5)',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
            };
        }

        // Production : invisible mais cliquable
        return {
            borderWidth: 0,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
        };
    };

    return (
        <TouchableOpacity
            style={[
                styles.rect,
                {
                    left: `${position_x}%`,
                    top: `${position_y}%`,
                    width: `${stand_w}%`,
                    height: `${stand_h}%`,
                },
                getStyles(),
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        />
    );
};

const styles = StyleSheet.create({
    rect: {
        position: 'absolute',
        zIndex: 10,
    },
});

export default StandRect;
