# AssoShare V1

Prototype web léger pour mutualiser le matériel des associations de Val-sur-Loire.

## Utilisation

Le projet ne nécessite ni installation ni dépendance. Ouvrir `index.html` dans un navigateur moderne, ou lancer un serveur local :

```bash
python3 -m http.server 4173
```

Puis ouvrir <http://localhost:4173>.

## Fonctionnalités V1

- consultation anonyme du catalogue ;
- recherche instantanée côté client et filtre par catégorie ;
- fiche détaillée accessible au clavier ;
- contact direct par e-mail avec objet prérempli ;
- dépôt d’annonce en quatre informations, conservé localement pour la démonstration.

Le dépôt est volontairement simulé côté navigateur : un endpoint serveur devra remplacer le stockage `localStorage` pour envoyer réellement le lien privé de modification.

## Validation écoresponsable

- **Poids** : vérifier `index.html`, `style.css`, `app.js` dans l’onglet Network ; aucune police, librairie ou ressource tierce n’est chargée.
- **Optimisations** : le script est différé, les sections hors écran sont rendues à la demande et l’index de recherche est précalculé pour éviter des recalculs à chaque frappe.
- **Rendu initial** : les styles du header et du hero sont intégrés dans le HTML ; le reste de `style.css` est préchargé sans bloquer le premier affichage.
- **Mesure Lighthouse** : les scripts `chrome-extension://` et leur poids ne font pas partie du site ; tester en navigation privée ou avec les extensions désactivées pour mesurer uniquement AssoShare.
- **Affichage** : lancer Lighthouse en mode *Slow 4G* et vérifier un affichage inférieur à 1,2 s.
- **EcoIndex** : tester l’URL sur [ecoindex.fr](https://www.ecoindex.fr/) et viser la note A.
- **Accessibilité** : tester la navigation au clavier, puis lancer axe ou WAVE ; le lien d’évitement, les labels, le focus visible et la boîte de dialogue sont inclus.
- **RGESN** : aucun cookie, traceur, analytics ou script tiers ; les illustrations sont en CSS afin d’éviter le poids d’images et les requêtes supplémentaires.
