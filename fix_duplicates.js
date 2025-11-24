const fs = require('fs');
const path = require('path');

// Lire le fichier stands_2025.js
const filePath = path.join(__dirname, 'myApp/data/stands_2025.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extraire le tableau JSON (entre 'const stands = ' et ';')
const match = fileContent.match(/const stands = (\[[\s\S]+\]);/);
if (!match) {
    console.error('Impossible de parser le fichier');
    process.exit(1);
}

const stands = JSON.parse(match[1]);

// Détecter les doublons
const idCounts = {};
const duplicates = [];

stands.forEach((stand, index) => {
    if (!idCounts[stand.id]) {
        idCounts[stand.id] = [];
    }
    idCounts[stand.id].push({ index, stand });
});

Object.keys(idCounts).forEach(id => {
    if (idCounts[id].length > 1) {
        duplicates.push({ id, occurrences: idCounts[id] });
    }
});

console.log(`\n🔍 Analyse des doublons dans stands_2025.js\n`);
console.log(`Total stands: ${stands.length}`);
console.log(`IDs uniques: ${Object.keys(idCounts).length}`);
console.log(`IDs dupliqués: ${duplicates.length}\n`);

if (duplicates.length > 0) {
    console.log('⚠️  Doublons détectés:\n');
    duplicates.forEach(({ id, occurrences }) => {
        console.log(`ID "${id}" - ${occurrences.length} occurrences:`);
        occurrences.forEach(({ index, stand }) => {
            console.log(`  [${index}] ${stand.company_name} (stand ${stand.stand_number})`);
        });
        console.log('');
    });

    // Correction automatique : suffixer les doublons
    console.log('🔧 Correction automatique...\n');

    duplicates.forEach(({ id, occurrences }) => {
        // Garder le premier, suffixer les autres
        occurrences.slice(1).forEach(({ index }, i) => {
            const newId = `${id}_dup${i + 1}`;
            stands[index].id = newId;
            console.log(`✓ Changé ID "${id}" → "${newId}" (index ${index})`);
        });
    });

    // Réécrire le fichier
    const newContent = `const stands = ${JSON.stringify(stands, null, 2)};\n\nexport default stands;\n`;
    fs.writeFileSync(filePath, newContent);
    console.log(`\n✅ Fichier corrigé et sauvegardé : ${filePath}`);
} else {
    console.log('✅ Aucun doublon détecté !');
}
