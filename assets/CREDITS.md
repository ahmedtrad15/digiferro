# Crédits des visuels

Aucun fichier de ce dossier ne provient d'une banque d'images. Les sites Pexels, Pixabay, Unsplash et Wikimedia n'étaient pas joignables depuis l'environnement de développement. Tous les visuels sont donc **provisoires** et ont été créés pour Digiferro. Ils sont à remplacer par de vraies photos.

Aucune image de Digivoda n'est utilisée. Pour en reprendre, il faut l'accord écrit du client.

## Photos provisoires (SVG, 1200 × 800, ratio 3:2)

Chaque visuel porte la mention « Photo à fournir » dans le site. Pour la retirer, supprimez la règle `[data-ph]::after` dans `css/components.css`.

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

Pour les remplacer : gardez le même nom de base, exportez en WebP (1200 × 800, qualité 70 à 80) et changez l'extension `.svg` en `.webp` dans `tools/home.mjs` (fonction `img`). Sources libres conseillées : Pexels (licence Pexels), Pixabay (licence Pixabay), Unsplash (licence Unsplash). Notez ici l'URL d'origine, l'auteur et la licence de chaque photo.

## Vidéo du héros

| Fichier | Nature | Poids |
|---|---|---|
| `video/hero-voie.mp4` | H.264, 1280 × 720, 6 s en boucle, muet | ≈ 190 Ko |
| `video/hero-voie.webm` | VP9, mêmes caractéristiques | ≈ 325 Ko |
| `img/hero-voie-poster.webp` | Image d'affiche (1re image de la boucle) | ≈ 8 Ko |

Il s'agit d'une animation générée (voie de nuit, traverses et poteaux qui défilent), produite pour Digiferro, sans droits tiers. Elle est **à remplacer** par une vraie séquence ferroviaire libre de droits (Pexels, Pixabay ou Coverr) : 15 s au plus, 3 Mo au plus, MP4 H.264 et WebM, sans son, avec une affiche extraite de la vidéo. Gardez les mêmes noms de fichiers.

## Logo Qualiopi

`img/qualiopi-logo-a-fournir.svg` est un **emplacement**, pas le logo. Déposez le fichier officiel (fourni par le certificateur de Digivoda) sans le modifier, puis mettez à jour `organisme.qualiopi.logo` dans `data/formations.json`.

## Autres fichiers

- `favicon/` : favicon SVG, PNG 32 px et icône Apple 180 px, dessinés pour Digiferro.
- `img/og-digiferro.jpg` : image de partage (1200 × 630), composée à partir de l'affiche vidéo.
- `svg/pictogrammes.svg` : pictogrammes au trait (train, rails, caténaire, signal, casque, gilet, agent, passage à niveau, trompe), dessinés pour Digiferro.
- Polices : Barlow Condensed et Barlow (Google Fonts, licence SIL Open Font License 1.1).
