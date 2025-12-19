import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const StandRect = ({
    x,
    y,
    w,
    h,
    onPress,
    isSelected = false,
    isVisited = false,
    isFavorite = false,
    debug = false,
}) => {

    const getStyles = () => {
        // 1️⃣ Selected
        if (isSelected) {
            return {
                borderWidth: 2,
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.25)',
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.7,
                shadowRadius: 8,
                elevation: 4,
            };
        }

        // 2️⃣ Favorite
        if (isFavorite) {
            return {
                backgroundColor: 'rgba(255, 204, 0, 0.35)',
                borderWidth: 1,
                borderColor: '#FFB200',
            };
        }

        // 3️⃣ Visited
        if (isVisited) {
            return {
                backgroundColor: 'rgba(76, 217, 100, 0.3)',
                borderWidth: 1,
                borderColor: '#21A453',
            };
        }

        // 4️⃣ Debug
        if (debug) {
            return {
                borderWidth: 1,
                borderColor: 'rgba(255, 0, 0, 0.5)',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
            };
        }

        // 5️⃣ Default: light gray so it's clearly clickable
        return {
            backgroundColor: 'rgba(200, 200, 200, 0.35)',
            borderWidth: 1,
            borderColor: '#CCCCCC',
        };
    };

    return (
        <TouchableOpacity
            style={[
                styles.rect,
                {
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${w}%`,
                    height: `${h}%`,
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
