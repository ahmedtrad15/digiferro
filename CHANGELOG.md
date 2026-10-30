# Changelog Digiferro

## 0.2.0 — 2026-10-30 · Point de validation

- **Données** (`data/formations.json` v0.2.0) :
  - réponses du client intégrées : intitulé « TCS M », Pack Sentinelle Complet = C0 + TCS M, tous les tarifs en TTC, lieux « Centres Digivoda partout en France / Sur site client en intra » ;
  - valeurs relevées dans l'index de recherche de digivoda.com (le site n'est pas joignable en direct) : TCS M, Recyclage SECUFER, prix et prix barrés des 4 packs, coordonnées, mention Qualiopi ;
  - chaque fiche porte un `statut_verification`.
- **Charte** : bleu nuit et anthracite, jaune signal, sarcelle en secondaire ; Barlow Condensed et Barlow ; voie et traverses, bornes PK, panneaux de gare, plaques signal, billets de pack, pictogrammes au trait.
- **Gabarit commun** : en-tête collant qui se resserre, méga-menu (survol, clic, clavier, Échap, clic extérieur), tiroir mobile en accordéon avec piège de focus, barre « Appeler / Devis » sur mobile, pied de page complet, retour en haut.
- **Accueil** : héros vidéo avec bouton pause et repli sur l'affiche, catalogue par thème, packs en billets, « pourquoi se former », parcours en 4 arrêts avec rail tracé au défilement, carte de France animée, financement, FAQ, bandeau d'appel.
- **Fiche formation TCS M** et **fiche Pack Sentinelle Complet** : faits clés, sous-navigation, programme en ligne de temps, schéma de ligne du pack, comparaison de prix, panneau devis collant, formulaire pré-rempli, JSON-LD Course, BreadcrumbList et FAQPage.
- **Générateur** `tools/build.mjs` : produit les pages, `sitemap.xml`, `robots.txt` et le sprite de pictogrammes.
- **Contrôles** :
  - aucun défilement horizontal de 360 à 1536 px ;
  - axe sans erreur à 375 et 1280 px ;
  - Lighthouse mobile à 100 sur les quatre catégories (avec gzip) ;
  - vidéo testée sur bureau, mobile, mouvement réduit et fichier absent ;
  - 112 liens internes valides ; les seuls manquants visent les pages à venir.
- **Visuels** : illustrations SVG provisoires et boucle vidéo générée, en attendant les vraies photos (voir `assets/CREDITS.md`).

## 0.1.0-squelette — 2026-10-30

- `data/formations.json` : structure des 12 formations et des 4 packs. digivoda.com n'était pas joignable et les captures n'avaient pas été fournies.
