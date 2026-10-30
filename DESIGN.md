---
name: Angel’s Concept
description: Le carnet de rendez-vous d’un petit institut angélique : papier, surligneur, tampons, tickets perforés, onglets et ruban adhésif.
colors:
  papier: "#ECE3D4"
  papier-clair: "#F6F0E5"
  sable: "#DACDB6"
  or-pale: "#EBDCAA"
  or-feuille: "#B5893A"
  surligneur: "#F8FBA4"
  encre: "#2A211C"
  encre-douce: "#5E5046"
  nuit-olive: "#1D2316"
  nuit-olive-2: "#2B3320"
typography:
  display:
    fontFamily: "Young Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(4rem, 12.4vw, 12.2rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Young Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Young Serif, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(1.8rem, 3vw, 2.7rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 800
    letterSpacing: "0.16em"
rounded:
  ticket: "14px"
  card: "20px"
  photo: "14px"
  pill: "999px"
  arch: "50% 50% 14px 14px / 34% 34% 14px 14px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
  section: "clamp(5rem, 9vw, 8rem)"
  stack: "1.5rem"
components:
  ticket:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.surligneur}"
    rounded: "{rounded.ticket}"
    padding: "1.05rem 1.35rem 1.05rem 1.7rem"
  ticket-hover:
    backgroundColor: "{colors.surligneur}"
    textColor: "{colors.encre}"
  ticket-lime:
    backgroundColor: "{colors.surligneur}"
    textColor: "{colors.encre}"
    rounded: "{rounded.ticket}"
  pill:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.surligneur}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.3rem"
  tab:
    backgroundColor: "{colors.sable}"
    textColor: "{colors.encre}"
    rounded: "16px 16px 0 0"
    padding: "0.85rem 1.25rem 0.8rem"
  tab-selected:
    backgroundColor: "{colors.surligneur}"
    textColor: "{colors.encre}"
  chapter-card:
    backgroundColor: "{colors.papier-clair}"
    textColor: "{colors.encre}"
    rounded: "{rounded.card}"
    padding: "clamp(1.5rem, 2.4vw, 2.2rem)"
  chapter-card-night:
    backgroundColor: "{colors.nuit-olive}"
    textColor: "{colors.papier}"
  review-card:
    backgroundColor: "{colors.papier-clair}"
    textColor: "{colors.encre}"
    rounded: "{rounded.card}"
    padding: "2rem 1.8rem 1.8rem"
---

# Design System: Angel’s Concept

## Overview

**Creative North Star: « Le carnet de rendez-vous »**

La page est l’agenda de l’institut, ouvert sur le comptoir d’accueil. Le papier est la couleur de ton client (#ECE3D4), le surligneur est son second imposé (#F8FBA4) : il sert comme un vrai marqueur, en traits sous les mots-clés et en champs saturés pleine largeur. Les objets de papeterie portent toute l’interface : tickets perforés pour réserver, onglets d’intercalaire pour les tarifs, tampons circulaires pour les offres, ruban adhésif qui tient les photos, perforations et spirale aux changements de page.

Le ton est chaleureux et convivial, avec une touche angélique : le halo (anneau doré, tampon qui tourne, orbite) est le fil rouge répété de l’en-tête au pied de page. Les photos sont posées comme des tirages scotchés ou découpées en arches de fenêtre ; elles ne remplissent jamais une section entière (les sources sont petites).

**Key Characteristics:**
- Papier crème, marqueur lime, encre brun-noir, couverture olive nuit : peu de couleurs, utilisées à grande échelle.
- Un titre serif chaleureux et massif, un texte sans-serif rond et lisible.
- Chaque section a sa propre mise en scène (pinnée, horizontale, onglets, polaroïds, carrousel de fiches) dans la même grammaire de papeterie.
- Le mouvement est riche mais jamais entre le visiteur et un prix ou un numéro de téléphone.

## Colors

Palette de papeterie : un papier chaud, un marqueur fluo pâle, une encre sombre, une couverture verte.

### Primary
- **Surligneur lime** (#F8FBA4) : couleur imposée. Traits de marqueur sous les mots clés, fond des sections « Étudiantes » et « Rendez-vous », ruban adhésif, durées et étiquettes, survol des tickets. Jamais comme couleur de texte sur fond clair (contraste insuffisant).

### Secondary
- **Or de feuille** (#B5893A) : filets et anneaux du halo (dégradé #8E6B22 → #EBD08A → #B5893A), étincelles. Décoratif seulement.
- **Or pâle** (#EBDCAA) : fond de carte « Épilation », onglets alternés, 3e carte Bloomea.

### Neutral
- **Papier** (#ECE3D4) : couleur imposée, fond de page.
- **Papier clair** (#F6F0E5) : feuilles et cartes posées sur le papier (histoire, carte des tarifs, avis, accès).
- **Sable** (#DACDB6) : onglets, section des avis, intercalaires.
- **Encre** (#2A211C) : texte, boutons, filets. **Encre douce** (#5E5046) : texte secondaire (6:1 sur papier).
- **Nuit olive** (#1D2316) et **Nuit olive 2** (#2B3320) : couverture sombre (Bloomea, pied de page, cartes « nuit »). Texte papier dessus, accents lime.

### Named Rules
**The Highlighter Rule.** Le lime ne sert qu’à surligner (fond d’un mot, d’une étiquette, d’un bouton) ou à saturer une section entière. Sur fond sombre ou encre, le surligneur couvre toute la hauteur de la ligne et le texte prend la couleur du fond.

**The Gold Is Decoration Rule.** L’or ne porte jamais d’information : filets, anneaux, étincelles.

## Typography

**Display Font:** Young Serif (Iowan Old Style, Palatino, Georgia en repli)
**Body Font:** Figtree (variable 300–900, system-ui en repli)

**Character:** une serif ronde et gourmande, presque « livre de cuisine de famille », qui rend la marque accueillante ; associée à une sans-serif géométrique douce pour tout ce qui se lit vite (prix, horaires, avis). Polices auto-hébergées (`assets/fonts`), aucun hébergeur tiers.

### Hierarchy
- **Display** (400, `clamp(4rem, 12.4vw, 12.2rem)`, 0.88, -0.035em) : le nom « Angel’s Concept » du hero et du pied de page uniquement.
- **Headline** (400, `clamp(2.5rem, 6vw, 6rem)`, 1.02, -0.025em) : titres de sections, avec un mot surligné.
- **Title** (400, `clamp(1.8rem, 3vw, 2.7rem)`, 1.1) : titres d’étapes, de cartes, de groupes de tarifs.
- **Body** (400, `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)`, 1.6) : lignes de 65 caractères maximum (`max-width` en `ch`).
- **Label** (800, 0.8rem, +0.16em, majuscules) : intitulés du pied de page, indice « Défiler ». Jamais au-dessus d’un titre.

### Named Rules
**The One Serif Rule.** Les prix et les chiffres sont toujours en Young Serif (chiffres tabulaires) ; tout le reste de l’information utilitaire est en Figtree.

## Layout

Grille fluide à gouttière `clamp(1.25rem, 4vw, 3.5rem)`, contenu centré jusqu’à 1320 px (hero jusqu’à 1520 px). Chaque section change de mise en page : hero asymétrique à photos superposées, histoire pinnée (texte à gauche, photo à droite), six cartes en défilement horizontal, onglets + tableau à deux colonnes, polaroïds en trois colonnes décalées, fiches d’avis en rail horizontal, FAQ avec titre collant, carte + horaires.

Sur mobile et en mouvement réduit, tout s’empile : plus de pin ni de défilement horizontal piloté, les cartes se rangent en colonnes, les animations lourdes sont supprimées. Le bouton flottant « Appeler » s’efface en descendant et revient en remontant.

## Elevation & Depth

Hybride papier : surfaces à plat, avec des ombres portées décalées et floues pour poser les objets sur la table (jamais d’ombres dures).

### Shadow Vocabulary
- **Tirage posé** (`box-shadow: 0 28px 40px -24px rgba(42,33,28,.55)`) : photos du hero et de la galerie.
- **Carte posée** (`box-shadow: 0 34px 50px -36px rgba(42,33,28,.6)`) : cartes de chapitres, fiches d’avis.
- **Ruban** (`box-shadow: 0 2px 4px -1px rgba(42,33,28,.28), inset 0 0 0 1px rgba(42,33,28,.07)`) : ruban adhésif.

### Named Rules
**The Taped-Down Rule.** Ce qui est posé a une ombre décalée ; ce qui est collé (ruban, tampon) n’en a presque pas.

## Shapes

Trois silhouettes : l’**arche** de fenêtre pour les photos (`50% 50% 14px 14px / 34% 34% 14px 14px`), le **ticket** à encoches et talon perforé (14 px, masque radial), le **cercle** du halo et des tampons. Cartes à 20 px. Pastilles à 999 px, réservées aux petits contrôles. Séparateurs de sections : spirale de carnet (tarifs), perforation (offre étudiante), nuages en festons (Bloomea, pied de page), sillon courbe (appel à l’action), page arrachée (préchargeur).

## Components

### Buttons (Ticket)
- **Shape:** rectangle 14 px, encoches semi-circulaires à mi-hauteur (masque), talon séparé par un pointillé.
- **Primary:** encre sur fond, texte lime. **Hover/Focus:** un disque lime s’ouvre depuis le point d’entrée du curseur, le texte passe à l’encre, un liseré encre apparaît. Version `--lime` sur fond sombre, `--ink` sur fond lime.
- **Magnétique:** attire légèrement le curseur (bureau, souris seulement).

### Navigation
En-tête fixe qui se cache en descendant et revient en remontant ; fond papier à 94 % une fois décollé. Lien : soulignement double (fin permanent + trait plein qui balaie au survol). Menu plein écran lime sur < 1100 px, ouvert par un cercle qui grandit depuis le bouton.

### Tabs (carte des tarifs)
Onglets d’intercalaire aux couleurs alternées (sable, or pâle, papier), onglet actif lime, relié au panneau bordé d’encre. Flèches, Début et Fin au clavier.

### Cards / Containers
Cartes de chapitres de 20 px, languette sombre dépassant en haut à gauche, liste de prix à points de conduite. Fiches d’avis : papier clair, texte droit (jamais pivoté, pour rester net), séparées par un filet pointillé.

### Price rows
Nom en gras, points de conduite, prix en Young Serif à droite. Durée en pastille surlignée, description en `encre-douce`. Étiquette noire « SUR APPEL » pour les prestations téléphoniques.

### Stamp (signature)
Tampon circulaire à texte sur cercle qui tourne (26 s), halo doré et lettre A au centre dans le hero ; « −10 % » pour les étudiantes ; icône téléphone pour l’appel à l’action.

## Do's and Don'ts

### Do:
- **Do** garder le lime pour surligner ou saturer une section ; le texte dessus est toujours encre.
- **Do** poser les photos en arche ou en tirage scotché, avec ruban et ombre décalée.
- **Do** animer en priorité `transform` et `opacity` ; réserver `clip-path` et `background-size` aux révélations ponctuelles.
- **Do** toujours prévoir la version mouvement réduit : contenu visible, aucun pin, aucun défilement piloté.
- **Do** écrire les prix en euros avec espace insécable (`25 €`).

### Don't:
- **Don't** mettre de petit libellé (« eyebrow ») au-dessus d’un titre.
- **Don't** écrire du texte lime sur fond clair ; ne pas pivoter du texte courant.
- **Don't** inventer un chiffre, un avis ou une note : tout provient des informations fournies.
- **Don't** utiliser d’emoji comme icône ni de bordure latérale colorée sur les cartes.
- **Don't** remplir une section entière avec une photo : les sources sont petites (de 195 à 640 px).
