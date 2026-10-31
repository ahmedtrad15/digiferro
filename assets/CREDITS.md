# Crédits des visuels

## Photos du client

Les 59 photos de `assets/img/` (ajoutées le 31/10/2026), y compris celles du centre de Palaiseau et le logo Qualiopi officiel, ont été fournies par le client. Elles sont utilisées sur tout le site, dans des copies WebP générées par `tools/photos.py` (`assets/photos/`). Le client doit disposer des droits d'utilisation de chaque image ; notez ici leur origine (banque d'images, licence, photographe) :

| Photos | Origine et licence |
|---|---|
| `palaiseau_campus-*.jpg` | Centre Digivoda de Palaiseau, photos du client |
| `logo-qualiopi.png` | Logo officiel Qualiopi, reproduit sans modification |
| Autres photos de chantier et de formation | À préciser par le client |

Les visuels ci-dessous ont été créés pour Digiferro et ne servent plus que de secours si une photo manque.

## Visuels de secours (SVG, 1200 × 800, ratio 3:2)

Utilisés seulement quand une fiche n'a pas de photo ; ils portent alors la mention « Photo à fournir ». Aujourd'hui, aucune page ne les affiche.

| Fichier | Photo attendue | Utilisé sur |
|---|---|---|
| `img/ph-voie-perspective.svg` | Voie ferrée en perspective, rails et traverses | SECUFER |
| `img/ph-salle-formation.svg` | Salle de formation, schéma de voie au tableau | Recyclage SECUFER, modalités |
| `img/ph-e-learning.svg` | Ordinateur avec module e-learning | SECUFER e-learning, modalités |
| `img/ph-sentinelle-annonce.svg` | Annonceur sentinelle (trompe, drapeau) au bord des voies | TCS M, Pack Sentinelle Complet |
| `img/ph-agent-epi.svg` | Agent en casque et gilet haute visibilité près d'une voie | Recyclage TCS M, méga-menu, accueil |
| `img/ph-catenaire.svg` | Poteaux et fils de caténaire | TSAE, Pack Prestations Connexes |
| `img/ph-signal-electrique.svg` | Signal lumineux, installations de traction | Risques électriques C0 |
| `img/ph-chantier-coordination.svg` | Chantier ferroviaire, équipe en EPI orange/jaune | RSO, Pack RSO, modalités intra |
| `img/ph-reseaux.svg` | Tranchée, réseaux enterrés près des voies | AIPR |
| `img/ph-passage-niveau.svg` | Passage à niveau, croix de Saint-André, barrière | TES F |
| `img/ph-train-face.svg` | Train vu de face | Agent S9A3, Pack Premium |
| `img/ph-catenaire-perche.svg` | Intervention caténaire, perche de mise à la terre | Percheur CH1-CB1 |

Pour les remplacer, déposez la photo dans `media/` en la nommant d'après la formation (voir `media/README.md`), puis lancez `node tools/build.mjs`. Sources libres conseillées : Pexels (licence Pexels), Pixabay (licence Pixabay), Unsplash (licence Unsplash). Notez ici l'URL d'origine, l'auteur et la licence de chaque photo.

## Vidéo du héros

| Fichier | Nature | Poids |
|---|---|---|
| `video/hero-voie.mp4` | H.264, 1280 × 720, 6 s en boucle, muet | ≈ 190 Ko |
| `video/hero-voie.webm` | VP9, mêmes caractéristiques | ≈ 325 Ko |
| `img/hero-voie-poster.webp` | Image d'affiche (1re image de la boucle) | ≈ 8 Ko |

Il s'agit d'une animation générée (voie de nuit, traverses et poteaux qui défilent), produite pour Digiferro, sans droits tiers. Elle est **à remplacer** par une vraie séquence ferroviaire libre de droits (Pexels, Pixabay ou Coverr) : 15 s au plus, 3 Mo au plus, MP4 H.264 et WebM, sans son, avec une affiche extraite de la vidéo. Gardez les mêmes noms de fichiers.

## Logo Qualiopi

Le logo officiel fourni par le client (`img/logo-qualiopi.png`) est utilisé tel quel dans le pied de page et la page À propos. `img/qualiopi-logo-a-fournir.svg` ne sert plus que d'emplacement de secours.

## Autres fichiers

- `favicon/` : favicon SVG, PNG 32 px et icône Apple 180 px, dessinés pour Digiferro.
- `img/og-digiferro.jpg` : image de partage (1200 × 630), composée à partir de l'affiche vidéo.
- `svg/pictogrammes.svg` : pictogrammes au trait (train, rails, caténaire, signal, casque, gilet, agent, passage à niveau, trompe), dessinés pour Digiferro.
- Polices : Lexend et Source Sans 3 (Google Fonts, licence SIL Open Font License 1.1).
