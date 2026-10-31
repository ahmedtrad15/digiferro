# Changelog Digiferro

## 0.6.2 — 2026-10-31 · Formulaire relié à Web3Forms

- **Formulaire de devis relié à Web3Forms** sur la page Contact et sur les 17 fiches formation et pack. Les demandes partent par e-mail à l'adresse liée à la clé d'accès, réglée dans `site.formulaire` (`data/formations.json`).
- **E-mails lisibles** :
  - objet « Demande de devis : <formation> (<n> participants) » ;
  - champs en français (Nom, Entreprise, Téléphone, Formation, Participants, Message) ;
  - formation en toutes lettres, page d'origine en fin de message ;
  - réponse directe au demandeur.
- **Anti-robot** : case piège `botcheck` recommandée par Web3Forms. La pré-sélection `?formation=<id>` fonctionne toujours. Sans JavaScript, le formulaire est envoyé directement au service.
- **Erreurs** : un refus du service (clé invalide, limite atteinte) affiche le message d'échec avec le numéro à appeler, au lieu d'un faux succès.
- **Politique de confidentialité** : Web3Forms est nommé parmi les sous-traitants. Un envoi réel de vérification est ajouté aux points à confirmer.
- **Contrôles** : envoi réussi, envoi refusé, champs manquants et case piège testés dans le navigateur, avec des réponses du service simulées.

## 0.6.1 — 2026-10-31 · Badges retirés, nouveaux numéros

- Badges d'économie (« −X € ») retirés partout : cartes, billets de pack, méga-menu, tiroir mobile, panneau devis, catalogue, tableau de prix des packs. Les prix barrés publiés restent affichés. Sur les fiches pack, l'économie réelle par rapport à l'achat à l'unité (Premium, Caténaire) apparaît en texte simple.
- Deux numéros du gestionnaire de formations ferroviaires ajoutés : 07 80 98 89 20 et 07 44 30 73 56. Ils sont regroupés sous un seul libellé, partout :
  - page Contact, pied de page, blocs devis, panneau devis des fiches ;
  - page À propos, mentions légales, JSON-LD (`contactPoint`) ;
  - bandeau supérieur, méga-menu, bandeau d'appel de l'accueil et aide du catalogue.
  Le 01 89 70 55 70 reste le numéro principal des boutons « Appeler ». Dans le bandeau supérieur, les numéros ne se coupent plus, et la phrase d'introduction est masquée sous 1 280 px.

## 0.6.0 — 2026-10-31 · Photos du client, plus aucun « À compléter »

- **Photos** : les 59 photos du client sont réparties sur tout le site, la vidéo du héros restant inchangée.
  - Chaque fiche formation et pack a sa photo (cartes et héros), avec 2 à 3 photos supplémentaires dans une bande sous le programme.
  - La page À propos montre une galerie de 6 photos du centre de Palaiseau, sans les doublons « (1) ».
  - L'accueil et le méga-menu utilisent aussi des photos.
  - Le choix suit le contenu des images (par exemple, les photos de passage à niveau vont à la TES F), et chaque photo a un texte alternatif descriptif.
- **Optimisation** : `tools/photos.py` génère des copies WebP de 600 px et pleine largeur, servies avec `srcset`. L'accueil pèse 447 Ko sur mobile, et Lighthouse donne 94 à 100.
- **Logo Qualiopi officiel** dans le pied de page et sur la page À propos, sans modification. Sa mention des catégories est reprise dans le texte alternatif.
- **Plus aucun encadré « [À COMPLÉTER] » sur le site** :
  - mentions légales remplies avec les données publiques de DIGIVODA (SAS au capital de 10 000 €, RCS Nanterre 488 347 444, SIRET 488 347 444 00033, siège de Châtenay-Malabry) ;
  - CGV et politique de confidentialité rédigées sans renvoi à compléter ;
  - bandeaux « à faire relire » retirés ;
  - référent handicap joignable par les coordonnées générales, et mention « Numéro non surtaxé » sur la page Contact.
  Les points à confirmer (hébergeur, éditeur, numéro de déclaration d'activité) sont listés dans `A-COMPLETER.md`.
- **Contrôles** :
  - 2 718 liens valides ;
  - aucun débordement de 360 à 1 536 px ;
  - axe sans erreur (52 contrôles) ;
  - sous-navigation 68/68.

## 0.5.0 — 2026-10-31 · Tarifs, Pack Caténaire, photos, FAQ

- **Tarifs du client (TTC, intra sur devis)** :
  - SECUFER 160 € en classe virtuelle, SECUFER e-learning 150 €, recyclage SECUFER 130 € ;
  - TCS M 900 € au lieu de 1 100 €, recyclage TCS M 450 € ;
  - TSAE 900 €, C0 180 €, RSO 800 €, AIPR 250 €, TES F 900 €, Agent S9A3 900 €, Percheur CH1-CB1 1 100 €.
  La mention « Intra : sur devis » apparaît sous chaque prix, et la SECUFER indique le format classe virtuelle.
- **Nouveau Pack Caténaire (TCS M + APEC, 1 800 € TTC)** : fiche complète, présent dans le catalogue, le méga-menu, le pied de page et le formulaire. L'APEC est rattaché à la fiche Percheur CH1-CB1 : les organismes du secteur présentent les deux intitulés comme une même fonction.
- **Prix des packs** : le tableau ne montre la somme des tarifs à l'unité et l'économie que lorsque l'achat groupé est réellement moins cher. Les incohérences relevées avec les nouveaux tarifs sont listées dans les données (`a_verifier`).
- **Photos** : dossier `media/` branché sur tout le site (fiches, cartes, galerie du centre, logo Qualiopi), avec les dimensions réelles et la priorité au nom exact. La vidéo du héros est inchangée.
- **À propos** : la section « Digiferro et Digivoda » est retirée. Ajout de la galerie du centre de Palaiseau et du plan d'accès Google Maps, chargé au clic, aussi sur la page Contact. La politique de confidentialité le mentionne.
- **FAQ** : 11 à 13 questions par formation et 9 par pack, nourries par les fiches et par les questions les plus posées sur ces formations (décret 2017-694, arrêté du 7 mai 2015, examen AIPR, NF C 18-510, LAM, S9, perchage). La page FAQ passe à 36 questions en 7 thèmes, plus un index « FAQ par formation ».
- **Sous-navigation des fiches** : défilement entièrement géré en JavaScript (position exacte sous la barre, vérification en fin de défilement, focus sur le titre de section). 68 clics testés, tous au bon endroit.
- **Divers** : les mots longs ne débordent plus pendant le chargement des polices (`overflow-wrap`).

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
