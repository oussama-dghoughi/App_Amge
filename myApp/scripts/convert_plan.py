import csv
import json
import os
import re

# ================= CONFIGURATION =================
# 1. Chemin du fichier CSV exporté depuis VGG Image Annotator
INPUT_CSV = "../data/annotations_2026.csv"

# 2. Chemin du fichier de sortie (directement dans l'app)
OUTPUT_JS = "../data/stands_2026.js"

# 3. Dimensions de l'image ORIGINALE (celle utilisée pour l'annotation)
# IMPORTANT : À modifier selon votre image PNG !
IMAGE_WIDTH = 1725
IMAGE_HEIGHT = 1725   # Exemple (ratio A4)

# =================================================

def parse_vgg_csv(csv_path):
    stands = []
    print(f" Lecture de {csv_path}...")

    try:
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader, None) # Skip header

            for row in reader:
                if not row or len(row) < 6:
                    continue
                
                # Colonnes VGG standard :
                # 0: filename, 1: file_size, 2: file_attributes, 3: region_count, 4: region_id, 5: region_shape_attributes, 6: region_attributes
                
                # Parfois VGG exporte différemment selon les versions.
                # On assume ici le format standard "CSV" de VGG (pas "CSV for YOLO" etc).
                
                # La colonne 5 contient la géométrie (x, y, w, h)
                # La colonne 6 contient les attributs (nom, id...)
                
                # Si votre CSV a un format différent (comme celui de votre ancien script),
                # on adapte le parsing ici.
                
                # D'après votre ancien script, vous aviez :
                # 4: spatial_coordinates "[2,494,1177,52,70]"
                # 5: metadata "{"1":"54"}"
                
                # Adaptons pour être robuste aux deux formats (VGG standard JSON ou VGG Legacy Array)
                
                spatial_raw = row[4] if len(row) > 4 else "{}"
                attributes_raw = row[5] if len(row) > 5 else "{}"
                
                x, y, w, h = 0, 0, 0, 0
                stand_id = ""
                company_name = ""

                # --- CAS 1 : Format JSON (VGG Standard) ---
                if "{" in spatial_raw:
                    try:
                        shape = json.loads(spatial_raw)
                        if shape.get('name') == 'rect':
                            x = shape.get('x', 0)
                            y = shape.get('y', 0)
                            w = shape.get('width', 0)
                            h = shape.get('height', 0)
                    except:
                        pass
                        
                    try:
                        attrs = json.loads(attributes_raw)
                        # On cherche un attribut 'id', 'stand', 'name' ou 'company'
                        stand_id = attrs.get('stand_number', attrs.get('id', ''))
                        company_name = attrs.get('company_name', attrs.get('name', ''))
                    except:
                        pass

                # --- CAS 2 : Format Legacy (Votre ancien script) ---
                elif "[" in spatial_raw:
                    # "[2,494,1177,52,70]" -> shape_id, x, y, w, h
                    nums = list(map(float, re.findall(r"[-+]?\d*\.?\d+", spatial_raw)))
                    if len(nums) >= 5:
                        x, y, w, h = nums[1], nums[2], nums[3], nums[4]
                    
                    # Metadata: {"1":"54"} -> id = 54
                    try:
                        meta_clean = attributes_raw.replace('""', '"')
                        meta_dict = json.loads(meta_clean)
                        if meta_dict:
                            stand_id = list(meta_dict.values())[0] # Prend la première valeur comme ID
                    except:
                        pass

                # Si on a trouvé un rectangle valide
                if w > 0 and h > 0:
                    # CONVERSION PIXELS -> POURCENTAGES
                    # C'est ici que se fait l'adaptation multi-écrans
                    stand = {
                        "id": str(stand_id),
                        "stand_number": str(stand_id),
                        "company_name": company_name, # Peut être vide, sera enrichi par l'app via companies.js
                        "x": round((x / IMAGE_WIDTH) * 100, 4),
                        "y": round((y / IMAGE_HEIGHT) * 100, 4),
                        "w": round((w / IMAGE_WIDTH) * 100, 4),
                        "h": round((h / IMAGE_HEIGHT) * 100, 4)
                    }
                    stands.append(stand)

    except Exception as e:
        print(f" Erreur lors de la lecture du CSV : {e}")
        return []

    return stands

def generate_js_file(stands, output_path):
    print(f" Génération de {output_path}...")
    
    # On crée le contenu JS
    js_content = f"""// GÉNÉRÉ AUTOMATIQUEMENT PAR scripts/convert_plan.py
// NE PAS MODIFIER MANUELLEMENT

export const stands_2026 = {json.dumps(stands, indent=2, ensure_ascii=False)};
"""
    
    # Création du dossier si inexistant
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    
    print(f" Succès ! {len(stands)} stands exportés.")

if __name__ == "__main__":
    print("--- DÉBUT CONVERSION PLAN ---")
    
    # Vérification de l'existence du CSV
    if not os.path.exists(INPUT_CSV):
        print(f" Fichier introuvable : {INPUT_CSV}")
        print("Veuillez placer votre export VGG dans myApp/data/annotations_2026.csv")
    else:
        stands_data = parse_vgg_csv(INPUT_CSV)
        if stands_data:
            generate_js_file(stands_data, OUTPUT_JS)
            print("--- TERMINÉ ---")
        else:
            print(" Aucun stand trouvé ou erreur de parsing.")
