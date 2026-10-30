# Digiferro

Site vitrine et de génération de demandes pour les formations à la sécurité ferroviaire dispensées par DIGIVODA.
HTML, CSS et JavaScript natifs, sans framework ni dépendance. Seules les polices Barlow et Barlow Condensed viennent de Google Fonts.

## État actuel

Les 25 pages sont en place :

- accueil ;
- catalogue filtrable ;
- 12 fiches formation et 4 fiches pack ;
- à propos, contact, FAQ ;
- mentions légales, CGV, politique de confidentialité ;
- page 404.

Les informations encore manquantes apparaissent sur le site dans des encadrés `[À COMPLÉTER: …]`. Leur liste, page par page, est dans `A-COMPLETER.md`, régénéré à chaque build.

## Arborescence

```
data/formations.json   source unique : formations, packs, organisme, textes de page
tools/                 générateur Node (aucune dépendance) qui produit les pages HTML
css/                   base (jetons, typo) · layout (en-tête, méga-menu, pied) · components · pages
js/                    nav · megamenu · reveal · video · map · form · filter
assets/                img · video · svg · favicon · CREDITS.md
*.html, formations/, packs/       pages générées (ne pas modifier à la main)
A-COMPLETER.md                    liste des contenus manquants, générée
sitemap.xml, robots.txt           générés avec les pages
```

## Modifier le contenu

1. Modifiez `data/formations.json` : tarifs, durées, programmes, textes.
2. Régénérez les pages :

```bash
node tools/build.mjs
```

Node 18 ou plus récent suffit, sans `npm install`. Le site produit reste 100 % statique.

Une donnée manquante s'écrit `"[À COMPLÉTER: libellé]"` (ou `null`). Elle s'affiche alors sur le site dans un encadré hachuré jaune, pour être repérée et remplie. Pour toutes les lister :

```bash
grep -o "\[À COMPLÉTER: [^]]*\]" -r data/formations.json | sort | uniq -c
```

## Lancer en local

Avec l'extension **Live Server** de VS Code : clic droit sur `index.html`, puis « Open with Live Server ».

Ou en ligne de commande :

```bash
python3 -m http.server 8080
```

Puis ouvrez http://localhost:8080.

## Formulaire de devis

Le formulaire valide les champs en français, à la volée. En cas d’erreur, un résumé en tête de formulaire renvoie à chaque champ fautif, et le bouton indique « Envoi en cours… » pendant l’envoi. Un champ piège bloque les robots, et la formation est pré-sélectionnée via `?formation=<id>`. Sans point d'envoi configuré, **rien n'est envoyé** : le message de succès est simulé.

Pour le brancher, renseignez `data-endpoint` sur la balise `<form>` dans `tools/item.mjs` (fonction `formBox`, utilisée par toutes les pages), puis régénérez :

- **Formspree** : `data-endpoint="https://formspree.io/f/VOTRE_ID"` et `action` identique.
- **Netlify Forms** : ajoutez `name="devis" data-netlify="true"` au `<form>` et `data-endpoint="/"`.
- **Backend maison** : toute URL qui accepte un POST `multipart/form-data` et répond 2xx.

## Catalogue

`formations/index.html` se filtre par type, thème et durée, avec une recherche par nom qui ignore les accents. Les filtres sont repris dans l’adresse, par exemple `formations/index.html?type=pack` ou `?theme=catenaire`. Une vue filtrée peut donc être partagée, et le lien « Packs » du menu y mène directement. Sans JavaScript, tout le catalogue reste affiché.

## Mise en ligne

Le site est statique : il suffit de copier le dossier tel quel.

- **Netlify / Cloudflare Pages** : glissez le dossier dans l'interface, ou reliez le dépôt sans commande de build et avec `/` comme dossier publié. `_headers` règle le cache.
- **Hébergement Apache (OVH, o2switch…)** : envoyez les fichiers par FTP. `.htaccess` active la compression et le cache.
- **Page 404** : `404.html` est reconnue automatiquement par Netlify et Cloudflare Pages. Sur Apache, `.htaccess` la déclare déjà (`ErrorDocument 404 /404.html`).
- **Avant la mise en ligne** : remplacez `site.base_url` dans `data/formations.json` par le domaine définitif, régénérez, puis déclarez `sitemap.xml` dans la Search Console.

La compression gzip ou brotli compte beaucoup. Mesuré sur mobile avec Lighthouse, le site obtient 99 à 100 dans les quatre catégories (performance, accessibilité, bonnes pratiques, SEO) avec compression, contre 84 à 88 en performance sans.
