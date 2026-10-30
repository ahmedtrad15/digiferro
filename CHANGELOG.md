# Changelog Digiferro

## 0.4.0 — 2026-10-30 · Fiches complètes, typographie lisible

- **Fiches formation et pack** : les 16 fiches sont entièrement remplies (objectifs, public, prérequis, programme jour par jour ou par module, méthodes, évaluation, validité, effectif, accessibilité, délais, financement). Les durées et les contenus non publiés par Digivoda sont **provisoires** ; les tarifs inconnus s’affichent « Sur devis ». Chaque fiche liste ses champs provisoires (`provisoire` dans les données), récapitulés dans `A-COMPLETER.md`.
- **Sous-navigation des fiches corrigée** : un clic arrêtait le défilement en cours de route. Le repérage de section faisait défiler la page (`scrollIntoView`) et interrompait le défilement doux. Désormais, seule la barre défile horizontalement. Le repérage est suspendu pendant le défilement vers l’ancre, et un recalage final compense les décalages dus au chargement des polices. Ajouts : fondu sur les bords quand des liens dépassent, ancrage des liens, barre de défilement fine à la souris. Résultat : 64 clics testés sur les 16 fiches, à 375 et 1 280 px, tous au bon endroit.
- **Typographie** (ui-ux-pro-max, paire « Corporate Trust ») : Lexend pour les titres et l’interface, Source Sans 3 pour le texte courant, à 18 px. Échelle des titres resserrée, majuscules réservées aux petites étiquettes de signalétique, boutons et menus en casse normale.
- **Mouvement** (ui-ux-pro-max, « Stagger list ») : les cartes apparaissent avec un léger décalage par colonne (400 ms, pas de 60 ms), désactivé si le mouvement réduit est demandé.
- **Divers** : bandeau du héros sur mobile (libellés sur toute la largeur), JSON-LD « Online » pour l’e-learning, tableau de prix des packs sans total incomplet.
- **Outils** : `tools/qa/` (contrôles automatiques, serveur gzip, captures). Lighthouse mobile à 100 sur les 5 pages testées (avec gzip).

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
