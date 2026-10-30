# Changelog Digiferro

## 0.3.0 — 2026-10-30 · Site complet

- **Pages** : 25 au total.
  - Les 11 fiches formation et 3 fiches pack restantes, chacune avec son propre texte.
  - Le catalogue filtrable : type, thème, durée, recherche sans accents, filtres repris dans l’URL, état vide, repli sans JavaScript.
  - À propos, contact (formulaire complet, emplacement pour le plan d’accès), FAQ par thème (JSON-LD FAQPage).
  - Mentions légales, CGV, politique de confidentialité, avec un bandeau « à faire relire ».
  - Une page 404.
- **Recyclages et e-learning** : encadré « qui peut s’inscrire, quelle validité » repris des règles publiées par Digivoda (6 mois après expiration pour le recyclage SECUFER, évaluation annuelle pour la TCS M).
- **Données** : textes de page pour les 16 fiches ; prérequis et public de la TCS M repris dans les packs, avec mention de l’origine. Les lieux confirmés s’appliquent à toutes les fiches.
- **Retouches de design** (liste de contrôle ui-ux-pro-max, sans sa base de données, absente de l’environnement) :
  - durées d’animation en jetons, fermeture plus rapide que l’ouverture ;
  - couleurs codées en dur remplacées par des jetons nommés ;
  - aucun texte utile sous 12 px ;
  - focus jamais masqué par l’en-tête et la sous-navigation collants ;
  - rubrique active dans l’en-tête ;
  - fil d’Ariane vers le catalogue filtré ;
  - formulaire avec aide sous les champs, résumé d’erreurs cliquable, état « Envoi en cours… » et e-mail exigeant un domaine complet ;
  - fils de caténaire en tête de toutes les pages intérieures.
- **Outillage** : le générateur produit aussi `A-COMPLETER.md`, la liste des contenus manquants page par page.
- **Contrôles** :
  - 2 459 liens et fichiers valides, 0 ancre cassée ;
  - aucun défilement horizontal de 360 à 1536 px sur les 25 pages ;
  - axe sans erreur sur 50 combinaisons page × largeur ;
  - Lighthouse mobile entre 99 et 100 sur 8 pages représentatives (avec gzip) ;
  - titres, descriptions et accroches uniques ;
  - aucun mot interdit.

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
