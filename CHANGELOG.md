# Changelog Digiferro

## 0.1.0-squelette — 2026-10-30

Étape 0 (collecte des données), partielle.

- `data/formations.json` : structure complète, avec les 12 formations, les 4 packs, 5 thèmes, 4 types, l'organisme et les sources légales. Ids, slugs, thèmes, types, liens formation ↔ pack et formations liées sont posés.
- Toutes les valeurs factuelles (tarifs, durées, programmes, mentions légales) sont encore des `[À COMPLÉTER: …]`. digivoda.com n'était pas joignable depuis la session et les deux captures d'écran n'ont pas été fournies.
- Les valeurs lues sur les captures (rapportées dans le brief) sont rangées dans `packs[].constat_capture`. Elles ne sont jamais affichées : seule la valeur publiée par Digivoda fait foi.
- Chaque fiche a un champ `a_verifier` qui liste les incohérences repérées (intitulé TCS M / TES M, correspondance APEC / Percheur, etc.).
