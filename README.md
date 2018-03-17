<h3 align="center">A11Y Accordion Component</h3>

---

## Introduction

**a11y-accordion-component** est une librairie écrite en JavaScript natif permettant de configurer facilement des
accordéons accessibles.

Cette librairie respecte l'ensemble des critères d'accessibilité définis par 
[WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion) tout en étant très légère (1 Ko minifiée et gzippée)
et simple à configurer.

## Fonctionnalités

- Presser la touche `Enter` ou `Space` sur le bouton d'entête d'un panneau replié, déplie le panneau associé.  
Si l'accordéon n'autorise le déploiement que d'un seul panneau à la fois, et si un autre panneau est déjà déplié, replie ce panneau.
- Presser la touche `Enter` ou `Space` sur le bouton d'entête d'un panneau déplié, replie le panneau associé.  
Si l'accordéon exige qu'un seul et unique panneau soit déplié à tout instant, le panneau déplié ne peut pas être replié.
- Presser la touche `Up Arrow` sur un bouton d'entête, déplace le focus clavier sur le précédent bouton d'entête s'il existe,
sinon sur le dernier bouton d'entête.
- Presser la touche `Down Arrow` sur un bouton d'entête, déplace le focus clavier sur le bouton d'entête suivant s'il existe,
sinon sur le premier bouton d'entête.
- Presser la touche `Home` sur un bouton d'entête (où que l'on soit), déplace le focus clavier sur le premier bouton d'entête.
- Presser la touche `End` sur un bouton d'entête (où que l'on soit), déplace le focus clavier sur le dernier bouton d'entête.
- Presser la touche `Page Up` à l'intérieur d'un panneau , déplace le focus clavier sur le bouton d'entête associé.
- Presser la touche `Page Down` à l'intérieur d'un panneau , déplace le focus clavier sur le bouton d'entête suivant s'il existe,
sinon sur le premier bouton d'entête.
- Possibilité d'imbriquer plusieurs accordéons.

## Installation

- via [npm](https://www.npmjs.com/) : `npm install a11y-accordion-component`
- via [yarn](https://yarnpkg.com/lang/en/) : `yarn add a11y-accordion-component`
- via [jsDelivr](https://www.jsdelivr.com/) : `<script src="https://cdn.jsdelivr.net/npm/a11y-accordion-component/dist/a11y-accordion-component.min.js"></script>`

## Utilisation

#### 1. Structure HTML de l'accordéon

L'attribut de données `data-component="accordion"` permet d'instancier un nouvel accordéon :

```
<div data-component="accordion">
  ...
</div>
```

**Attributs facultatifs :**

- `data-multiselectable="false"` : Autorise l'ouverture d'un seul panneau à la fois. 
- `data-collapsible="false"` : Verrouille le panneau déplié.

#### 2. Structure HTML de l'entête et du panneau associé

La librairie génère à la volée les attributs nécessaires afin de répondre aux critères d'accessibilité 
définis par WAI-ARIA.

**Structure initiale :**

```
<div class="c-accordion" data-component="accordion">
  <div role="heading" aria-level="3">
    <div id="accordion-trigger-1" class="c-accordion__trigger" data-controls="accordion-panel-1">
      Accordion Header 1
    </div>
  </div>
  <div id="accordion-panel-1" class="c-accordion__panel">
    <div class="c-accordion__inner">
      <h4>Section 1</h4>
      <p>
        A paragraph (from the Greek paragraphos, "to write beside" or "written beside") is a self-contained unit of a
        discourse in writing dealing with a particular point or idea. A paragraph consists of one or more sentences.
        Though not required by the syntax of any language, paragraphs are usually an expected part of formal writing,
        used to organize longer prose.
      </p>
      <p><a href="#">This is a text link</a></p>
    </div>
  </div>
</div>
```

**Structure finale (après le chargement du script) :**

```
<div class="c-accordion" role="presentation" data-component="accordion">
  <div role="heading" aria-level="3">
    <div id="accordion-trigger-1" class="c-accordion__trigger" data-controls="accordion-panel-1" role="button" tabindex="0" aria-controls="accordion-panel-1">
      Accordion Header 1
    </div>
  </div>
  <div id="accordion-panel-1" class="c-accordion__panel role="region" tabindex="-1" aria-labelledby="accordion-trigger-1" aria-hidden="true">
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
</div>
```

**Attributs obligatoires :**

- `id="trigger-ID"` : Identifie le bouton d'entête.
- `id="panel-ID"` : Identifie le panneau.
- `data-controls="panel-ID"` : Associe le bouton d'entête à son panneau.

**Attribut facultatif (sur le bouton d'entête) :**

- `data-open="true"` : Déplie un panneau lors de l'initialisation de l'accordéon.  
Cet attribut de données générera l'attribut ARIA `aria-expanded="true"` 

#### 3. Ajout de la librairie JavaScript

Vous pouvez importer directement **a11y-accordion-component** dans votre projet JavaScript 
en utilisant une syntaxe ES6 (ES2015) ou CommonJS :

```
import Accordions from 'a11y-accordion-component'; // es6 module
const Accordions = require('a11y-accordion-component').default; // commonjs module
```

#### 4. Instanciation JavaScript

L'instanciation de tous les accordéons possédant l'attribut de données `data-component="accordion"` se fait simplement
par la méthode `init()` :

```
Accordions.init();
```

#### 5. Événements JavaScript

En cas de besoin, vous pouvez déclencher le rendu d'un ou plusieurs accordéons directement en JavaScript 
grâce à la méthode `render('accordion-ID')` :

```
Accordions.render('accordion-2');
```

**Paramètres facultatifs :**

- `isMultiSelectable: false` : Autorise l'ouverture d'un seul panneau à la fois. 
- `isCollapsible: false` : Verrouille le panneau déplié.

```
Accordions.render('accordion-2', {
  isMultiSelectable: false,
  isCollapsible: false,
});
```

**Suppression d'un accordéon instancié :**

Vous pouvez supprimer le rendu d'un ou plusieurs accordéons grâce à la méthode `destroy('accordion-ID')` :

```
Accordions.destroy('accordion-2');
```

#### 6. Styles CSS

**a11y-accordion-component** a fait le choix de ne pas embarquer de styles CSS par défaut.  
Vous êtes donc libres d'utiliser les styles que vous souhaitez !

Néanmoins, nous recommandons au minimum ce style nécessaire à l'ouverture et à la fermeture d'un panneau :

```
.c-accordion__panel[aria-hidden="true"] {
  display: none;
}
```

Si vous désirez utiliser des styles CSS par défaut, vous pouvez consulter le fichier `main.css` de la démo disponible 
[ici](https://github.com/jonathanlevaillant/a11y-accordion-component/blob/master/demo/src/main.css)

## Contribution

Si vous désirez contribuer à ce projet, rien de plus simple, suivez ces quelques étapes ! :kissing_closed_eyes:  
**a11y-accordion-component** suit les standards de développement JavaScript ES2015.

#### Environnement de développement

1. Clonez le dépôt GitHub : `$git clone https://github.com/jonathanlevaillant/a11y-accordion-component.git`
2. Installez le gestionnaire de packages [yarn](https://yarnpkg.com/en/docs/install#mac-tab)
3. Installez les dépendances de développement : `yarn start`
4. Lancez le projet (watch) : `yarn dev`
5. Créez une pull-request :ok_hand:

## D'autres librairies accessibles ?

- [a11y-dialog-component](https://github.com/jonathanlevaillant/a11y-dialog-component) - Fenêtres modales accessibles.

## Créateur

**Jonathan Levaillant**

- [https://twitter.com/jlwebart](https://twitter.com/jlwebart)
- [https://github.com/jonathanlevaillant](https://github.com/jonathanlevaillant)

## Licence

Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).
