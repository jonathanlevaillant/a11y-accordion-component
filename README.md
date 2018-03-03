<h3 align="center">A11Y Accordion Component</h3>

---

## Introduction

**a11y-accordion-component** est une librairie écrite en pur JavaScript permettant de configurer facilement des
accordéons accessibles.

Cette librairie respecte l'ensemble des critères d'accessibilité définis par 
[WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion) tout en étant très légère (1 Ko minifiée / gzippée)
et simple à configurer.

## Fonctionnalités

- Presser la touche `Enter` ou `Space` sur le bouton d'entête d'un panneau replié, déplie le panneau associé.  
Si l'accordéon n'autorise le déploiement que d'un seul panneau à la fois via l'attribut `data-multiselectable="false"`, 
et si un autre panneau est déjà déplié, replie ce panneau.
- Presser la touche `Enter` ou `Space` sur le bouton d'entête d'un panneau déplié, replie le panneau associé.  
Sauf si l'accordéon exige qu'un seul et unique panneau soit déplié à tout instant via l'attribut `data-collapsible="false"`.
- Presser la touche `Up Arrow` sur un bouton d'entête déplace le focus clavier sur le précédent bouton d'entête s'il existe,
sinon sur le dernier bouton d'entête.
- Presser la touche `Down Arrow` sur un bouton d'entête déplace le focus clavier sur le bouton d'entête suivant s'il existe,
sinon sur le premier bouton d'entête.
- Presser la touche `Home` sur un bouton d'entête déplace le focus clavier sur le premier bouton d'entête.
- Presser la touche `End` sur un bouton d'entête déplace le focus clavier sur le dernier bouton d'entête.
- Possibilité d'imbriquer plusieurs accordéons.

## Installation

- via [npm](https://www.npmjs.com/) : `npm install a11y-accordion-component`
- via [yarn](https://yarnpkg.com/lang/en/) : `yarn add a11y-accordion-component`
- via [jsDelivr](https://www.jsdelivr.com/) : `<script src="https://cdn.jsdelivr.net/npm/a11y-accordion-component/dist/a11y-accordion-component.min.js"></script>`

## Utilisation

#### 1. La structure HTML de l'accordéon

L'attribut `data-component="accordion"` permet d'instancier un nouvel accordéon :

```
<div role="presentation" class="c-accordion" data-component="accordion">
  ...
</div>
```

Deux autres attributs facultatifs sont disponibles :

- Déployer un seul panneau à la fois : `data-multiselectable="false"`
- Verrouiller un panneau déployé : `data-collapsible="false"`

#### 2. La structure HTML de l'entête et du panneau associé

Afin de répondre aux critères d'accessibilité définis par WAI-ARIA, il est conseillé d'utiliser la structure suivante :

```
<div role="heading" aria-level="3">
  <button type="button" id="accordion-trigger-1" class="c-accordion__trigger" aria-controls="accordion-panel-1" aria-expanded="true">
    Accordion Header 1
  </button>
</div>
<div id="accordion-panel-1" class="c-accordion__panel" role="region" aria-labelledby="accordion-trigger-1">
  <div class="c-accordion__inner">
    <h3>Section 1</h3>
    <p>
      A paragraph (from the Greek paragraphos, "to write beside" or "written beside") is a self-contained unit of a
      discourse in writing dealing with a particular point or idea. A paragraph consists of one or more sentences.
      Though not required by the syntax of any language, paragraphs are usually an expected part of formal writing,
      used to organize longer prose.
    </p>
    <p><a href="#">This is a text link</a></p>
  </div>
</div>
```

- Associer l'entête à son panneau : `aria-controls="panel-ID"`
- Déplier un panneau : `aria-expanded="true"` (sur l'entête).

#### 3. Ajout de la librairie JavaScript

Vous pouvez directement importer **a11y-accordion-component** dans votre projet JavaScript 
en utilisant une syntaxe ES6 (ES2015) ou CommonJS :

```
import Accordions from 'a11y-accordion-component'; // es6 module
const Accordions = require('a11y-accordion-component').default; // commonjs module
```

#### 4. Instanciation JavaScript

```
Accordions.init();
```

#### 5. Styles CSS

Styles CSS basiques pour l'affichage d'un accordéon :

```
.c-accordion__trigger {
  background-color: #ccc;
}

.c-accordion__trigger[aria-expanded="true"] {
  background-color: #e91e63;
  color: #fff;
}

.c-accordion__panel[aria-hidden="true"] {
  display: none;
}
```

## Contribution

Si vous désirez contribuer à ce projet, rien de plus simple, suivez ces quelques étapes ! :kissing_closed_eyes:

#### Environnement de développement

1. Cloner le dépôt GitHub : `$git clone https://github.com/jonathanlevaillant/a11y-accordion-component.git`
2. Installer le gestionnaire de packages [yarn](https://yarnpkg.com/en/docs/install#mac-tab)
3. Installer les dépendances à la racine du projet : `yarn start`
4. Lancer le projet : `yarn dev`
5. Créer une pull-request :ok_hand:

## Créateur

**Jonathan Levaillant**

- [https://twitter.com/jlwebart](https://twitter.com/jlwebart)
- [https://github.com/jonathanlevaillant](https://github.com/jonathanlevaillant)

## Licence

Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).
