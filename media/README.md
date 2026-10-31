# Photos du site

Déposez ici les photos (JPG, PNG ou WebP), puis lancez `node tools/build.mjs` : chaque photo remplace automatiquement le visuel provisoire correspondant, avec ses dimensions réelles.

## Nommage

La casse, les accents et les séparateurs ne comptent pas (`TCS M.jpg`, `tcs-m.jpg` et `Tcs_M.webp` sont équivalents). Les sous-dossiers sont libres.

| Où la photo apparaît | Nom du fichier (exemples) |
|---|---|
| Fiche et cartes d'une formation | `secufer.jpg`, `recyclage-secufer.jpg`, `secufer-e-learning.jpg`, `tcs-m.jpg`, `recyclage-tcs-m.jpg`, `tsae.jpg`, `c0.jpg`, `rso.jpg`, `aipr.jpg`, `tes-f.jpg`, `s9a3.jpg`, `ch1-cb1.jpg` |
| Fiche et carte d'un pack | `pack-prestations-connexes.jpg`, `pack-sentinelle-complet.jpg`, `pack-rso.jpg`, `pack-ferroviaire-premium.jpg`, `pack-catenaire.jpg` |
| Galerie du centre (page À propos) et bloc « Centres » de l'accueil | tout fichier dont le nom ou le dossier contient `palaiseau` ou `centre`, par exemple `centre-palaiseau/salle-1.jpg` |
| Logo Qualiopi (pied de page, À propos) | tout fichier dont le nom contient `qualiopi`, par exemple `logo-qualiopi.png` (fichier officiel, sans modification) |

Le nom peut reprendre l'identifiant, le slug, le nom court ou le code d'une fiche, tels qu'ils figurent dans `data/formations.json`. Une photo nommée avec le code seul (`secufer.jpg`) sert aussi au recyclage et à l'e-learning SECUFER, tant qu'ils n'ont pas leur propre photo.

## Conseils

- Cadrage paysage, idéalement au format 3:2. Les cartes recadrent l'image au centre.
- 1 600 px de large au maximum, 300 Ko environ par photo (WebP conseillé) pour garder un site rapide sur mobile.
- Le texte alternatif par défaut est « Formation <nom> ». Pour le préciser, ajoutez un champ `image_alt` à la fiche dans `data/formations.json`.
- Lors du build, le fichier `A-COMPLETER.md` liste les photos du dossier qui ne correspondent à aucune fiche.
