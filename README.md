# Nos Locaux - WebPart SPFx

WebPart SharePoint Framework (SPFx) permettant d'afficher et gérer dynamiquement une liste de localisations de bureaux avec navigation vers Google Maps.

## Fonctionnalités

- 📍 **Affichage des bureaux** avec design moderne (cartes colorées en bleu/rose)
- 🗺️ **Navigation Google Maps** : cliquer sur une carte ouvre l'itinéraire dans un nouvel onglet
- ✏️ **Gestion CRUD** : ajouter, modifier et supprimer des bureaux (en mode édition)
- 💾 **Persistance** des données dans les propriétés du WebPart SharePoint
- ♿ **Accessibilité** : ARIA labels, navigation clavier

## Prérequis

- **Node.js v18.20.8** (compatible avec Node.js 18.x LTS)
- **npm** v9 ou supérieur
- **SPFx** 1.18.x
- Accès à un site SharePoint Online (pour le déploiement)

## Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/kadija-kru/Nos-locaux.git
   cd Nos-locaux
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

## Tester en local

```bash
gulp serve
```

Cela démarre le workbench local SPFx sur `https://localhost:4321/temp/workbench.html`.

Pour tester sur votre site SharePoint, configurez d'abord `config/serve.json` :
```json
{
  "initialPage": "https://votre-site.sharepoint.com/_layouts/workbench.aspx"
}
```

## Build et déploiement

```bash
# Build de développement
gulp bundle

# Build de production + packaging
npm run package
```

Le fichier `.sppkg` sera généré dans `solution/nos-locaux.sppkg`.

## Structure du projet

```
Nos-locaux/
├── config/
│   ├── config.json              # Configuration des bundles et ressources localisées
│   ├── package-solution.json    # Métadonnées de la solution SPFx
│   ├── serve.json               # Configuration du serveur local
│   └── write-manifests.json     # Configuration CDN pour la production
├── src/
│   └── webparts/
│       └── nosLocaux/
│           ├── NosLocauxWebPart.ts              # WebPart principal
│           ├── NosLocauxWebPart.module.scss     # Styles SCSS
│           ├── NosLocauxWebPart.module.scss.d.ts ⚠️ Déclarations TypeScript
│           ├── NosLocauxWebPart.manifest.json   # Manifeste du WebPart
│           ├── components/
│           │   ├── LocationCard.tsx   # Carte de localisation cliquable
│           │   ├── LocationForm.tsx   # Formulaire d'ajout/modification
│           │   └── LocationList.tsx   # Liste et logique CRUD
│           └── loc/
│               ├── mystrings.d.ts    # Interface TypeScript des chaînes
│               ├── en-us.js          # Traductions anglaises
│               └── fr-fr.js          # Traductions françaises
├── package.json
├── tsconfig.json
├── gulpfile.js
└── README.md
```

## Fichier `.module.scss.d.ts` - Explication

Le fichier `NosLocauxWebPart.module.scss.d.ts` est **critique** pour TypeScript. Il déclare les types des classes CSS générées par les modules SCSS, permettant à TypeScript de valider les noms de classes utilisés dans le code :

```typescript
declare const styles: {
  readonly nosLocaux: string;
  readonly locationCard: string;
  readonly blue: string;
  readonly pink: string;
  // ...
};
export default styles;
```

Sans ce fichier, TypeScript génèrerait des erreurs de type lors de l'import du fichier SCSS.

## Interface de données

```typescript
interface ILocation {
  id: string;        // Identifiant unique
  name: string;      // Nom du bureau
  address: string;   // Adresse complète
  city: string;      // Ville et code postal
  iconColor: 'blue' | 'pink'; // Couleur de la carte
}
```

## Utilisation

### Mode consultation (SharePoint page normale)
- Les cartes s'affichent avec le design bleu/rose
- Cliquer sur une carte ouvre Google Maps avec l'adresse

### Mode édition (page en mode édition SharePoint)
- Les boutons ✏️ (modifier) et 🗑️ (supprimer) apparaissent sur chaque carte
- Le bouton "Ajouter un bureau" apparaît en bas
- Les modifications sont sauvegardées dans les propriétés du WebPart

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `gulp serve` | Démarrer le serveur local de développement |
| `gulp bundle` | Builder le projet (développement) |
| `gulp bundle --ship` | Builder pour la production |
| `gulp package-solution --ship` | Créer le package .sppkg |
| `npm run package` | Bundle + package en une commande |
| `gulp clean` | Nettoyer les fichiers de build |
