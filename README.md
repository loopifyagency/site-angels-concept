# Angel’s Concept — site vitrine

Site one-page de l’institut de beauté **Angel’s Concept** (28 Quai de la Douane, 29200 Brest).
HTML / CSS / JavaScript statique : aucun build, aucun framework, aucune dépendance au runtime.

**Direction artistique** : le *carnet de rendez-vous* de l’institut. Papier `#ECE3D4`, surligneur `#F8FBA4`, tampons circulaires (le halo), tickets perforés, onglets d’agenda, ruban adhésif. Détails dans [`DESIGN.md`](DESIGN.md).

## Lancer en local

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>. N’importe quel serveur statique convient.

## Fichiers à déployer

```
index.html          page unique (SEO, JSON-LD LocalBusiness, contenu complet en HTML statique)
favicon.svg
css/base.css        jetons, typographie, boutons, en-tête, menu, préchargeur
css/sections.css    mise en page de chaque section
js/main.js          mouvement et interactions
assets/img/         photos (WebP)
assets/fonts/       Young Serif + Figtree (auto-hébergées, aucun appel à Google Fonts)
vendor/             GSAP 3.13 + ScrollTrigger + SplitText, Lenis 1.3 (embarqués)
```

`PRODUCT.md`, `DESIGN.md`, `.impeccable/` et `.claude/` sont des documents de travail : ils n’ont pas besoin d’être publiés.

## Ce que fait le site

- Préchargeur « page de carnet arrachée », hero multicouche avec parallax, bandeaux défilants réactifs au scroll.
- Section **pinnée** (l’histoire en 4 étapes), section à **défilement horizontal** piloté par le scroll vertical (6 univers).
- Carte des tarifs en onglets (52 prestations, en HTML statique), section Bloomea, offre étudiante, compteurs, galerie pêle-mêle (tilt 3D), avis en rail glissant, FAQ, appel à l’action, accès avec carte Google Maps et horaires (jour courant surligné, statut « ouvert / fermé » calculé à l’heure de Paris).
- Bouton « Appeler » flottant sur mobile, menu plein écran, barre de progression, curseur-halo (souris uniquement).
- Mobile : pin et défilement horizontal remplacés par un empilement simple. `prefers-reduced-motion` : aucun pin, aucun défilement lissé, contenu entièrement visible.

## ⚠️ À faire confirmer avant mise en ligne

Le texte des tarifs fourni était un OCR dégradé. Les lectures les plus probables sont affichées ; **ces prix sont à vérifier** :

| Prestation | Prix affiché | Doute |
|---|---|---|
| Épilation sourcils | 10 € | lu « M70 € » |
| Épilation lèvres | 9 € | |
| Épilation menton | 12 € | lu « 1260€ » |
| Épilation joues | 10 € | lu « 1080€ » |
| Forfait lèvres + menton | 20 € | le texte contient aussi « 18 € » pour ce forfait |
| Remplissage gel / gainage (< 4 semaines) | 55 € | lu « ss € » |
| Nail art niveau 1 | 10 € | lu « 0€ » |
| Nail art niveau 3 | de 30 à 60 € | lu « 30€260€ » |
| Dépose semi-permanent renforcé + repose | 45 € | lu « as€ » |
| Soin Pureté Absolue | 55 € | un autre passage du texte donne « 48,50 € » |

Autres points :

- **Durées** : volontairement omises pour la plupart des prestations ongles (OCR sans « 1h »). Pour les soins visage et corps, la durée affichée est celle de la réservation (ex. 1 h 10), pas celle du nom (« 45 min »).
- **Sans prix dans le texte** : « Gommage Gourmand + enveloppement », « Premier bilan Bloomea », « Brow lift effet sophistiqué » (affichés « Sur demande » / « En option »).
- **Photo de groupe** : légendée « L’équipe d’Angel’s Concept ». À confirmer.
- **Avis** : recopiés mot pour mot. Le premier est signé « M M » dans la source, affiché « M. M. ». Aucune note chiffrée n’est affichée (elle n’a pas été fournie). Un avis était dupliqué dans la source : il n’apparaît qu’une fois.
- **Chiffres clés** : uniquement des faits tirés des informations fournies (6 jours sur 7, 3 technologies Bloomea, 10 % étudiantes, nombre de prestations compté automatiquement). Pour afficher « années d’expérience » ou « clientes », donner les vrais chiffres : modifier la section `#chiffres` dans `index.html`.
- **Dimanche** : lu comme fermé (« dimanche (Toussaint) Fermé »).
- **Photos** : les sources sont petites (195 à 640 px de large, une seule photo de soin à 195 px). Des photos plus grandes amélioreraient surtout la galerie et le hero.
- **Carte Google Maps** : iframe officielle sans clé ; elle peut être bloquée par un bloqueur de publicités (un repli « adresse » s’affiche alors).

## Performance et accessibilité

Poids mesuré : environ 0,4 Mo non compressé, hors carte Google Maps (images WebP, polices WOFF2 en sous-ensembles, bibliothèques minifiées). Images à dimensions déclarées et chargement différé, navigation clavier complète (onglets avec flèches, accordéon natif, menu avec `Échap`), focus visibles, textes alternatifs sur toutes les images, contrastes ≥ 4,5:1 sur le texte.

## Modifier les tarifs

Les lignes de la carte sont dans `index.html` (`<li class="row">`). Le compteur « prestations à la carte » se met à jour tout seul.
