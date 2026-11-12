# Brief projet : AssoShare V1

## 1. Contexte et problème

Les associations d'une même commune achètent du matériel événementiel neuf (barnums, baffles, tables) alors que l'association voisine en possède déjà, souvent inutilisé la majeure partie de l'année. Il n'existe ni inventaire partagé ni canal de communication structuré. Contacter chaque association une par une est perçu comme long, incertain et fastidieux.

**Cause racine :** l'absence d'une visibilité simple et centralisée sur les ressources dormantes des associations locales empêche la mutualisation du matériel.

**Question directrice :** comment faciliter la mise en relation et le prêt de matériel pour les responsables d'associations bénévoles, sans imposer la création d'un compte sur une application lourde ni l'usage continu d'un smartphone récent ?

## 2. Vision

Permettre à toutes les associations d'un territoire de partager leurs ressources pour zéro euro et zéro achat inutile.

> Pour les responsables d'associations locales qui ont besoin de matériel événementiel ponctuel, AssoShare est une plateforme web sobre et collaborative qui permet de trouver et prêter des équipements à proximité en 2 clics. Contrairement aux plateformes commerciales ou aux groupes Facebook désorganisés, elle ne nécessite aucune installation ni création de compte complexe, avec une empreinte inférieure à 0,2 g éq. CO2 par visite.

## 3. Utilisateurs cibles

| Persona | Profil | Contrainte clé |
|---|---|---|
| Jean-Pierre (persona contraint) | 71 ans, trésorier d'une asso de quartier | Ordinateur fixe ou smartphone de 7 ans, ADSL lent, refuse de créer un compte de plus |
| Marc | 62 ans, président d'un club de randonnée | Smartphone de 4 ans, ne sait pas qui contacter |
| Sofia | 27 ans, chargée de projet dans une asso culturelle | Utilisatrice quotidienne, fatiguée des groupes Facebook désorganisés |

La conception est faite pour Jean-Pierre : ce qui fonctionne pour lui fonctionne pour tous.

## 4. Objectifs mesurables

- 150 prêts d'ici juin 2027.
- 50 associations actives sur la commune en 6 mois.
- Réduire de 30 % les achats de matériel neuf des associations.
- Impact positif visé : 2 tonnes d'équivalent CO2 évitées la première année.
- Impact négatif limité : moins de 0,2 g éq. CO2 par consultation de page.
- Effet rebond identifié : les économies pourraient financer davantage d'événements énergivores (surveillé, non traité en V1).

## 5. Périmètre de la V1

### À faire (MUST)

1. **Consultation anonyme** : la page d'accueil affiche directement le catalogue, sans inscription, mot de passe ni connexion.
2. **Recherche textuelle** : filtrage instantané par mot-clé ou catégorie, exécuté côté client.
3. **Fiche matériel** : description textuelle et une seule photo WebP (max 40 Ko).
4. **Contact direct par e-mail** : bouton « Contacter l'association » générant un lien `mailto:` avec l'objet `[AssoShare] Demande de prêt : [Nom du matériel]`.
5. **Dépôt d'annonce simplifié** : formulaire à 4 champs (titre, catégorie, e-mail, téléphone), sans profil, avec envoi d'un lien unique de modification par e-mail.

### Pour plus tard (COULD)

Filtre par calendrier de disponibilité, récapitulatif bimensuel par e-mail, filtre par quartier ou date.

### Écarté volontairement (WON'T)

| Fonctionnalité | Raison |
|---|---|
| Carte interactive OpenStreetMap | Alourdit chaque page (plus de 800 Ko), bloque l'affichage sur ADSL lent, remplacée par un filtre textuel par quartier ou code postal |
| Chat instantané interne | Lourd à maintenir, le mail et le téléphone suffisent |
| Notation et avis par étoiles | Ne déclenche pas le prêt, la confiance repose sur l'interconnaissance locale |
| Application mobile native | Exclut les téléphones anciens et les bénévoles seniors, multiplie l'empreinte |
| Géolocalisation temps réel | Même raison, plus un coût en requêtes et en données |

## 6. Contraintes techniques (budget de performance)

| Indicateur | Limite |
|---|---|
| Poids par page | < 150 Ko, toutes ressources comprises |
| Requêtes HTTP | < 8 par chargement |
| Affichage (3G simulée) | < 1,2 s |
| Images | 1 par fiche, WebP, 800 px max, < 40 Ko |
| Score EcoIndex | A (supérieur à 85/100) |
| Accessibilité | WCAG AA, utilisable au clavier, compatible navigateurs de plus de 6 ans |
| Vie privée | Aucun cookie tiers, traceur, analytics lourd ni police distante |

**Architecture :** HTML, CSS et JavaScript vanille (ou Astro/Svelte ultra-léger), hébergement vert, polices système.

## 7. Definition of Done verte

Une user story est terminée uniquement si :

1. Le budget de performance est respecté (150 Ko, affichage < 1,2 s en 3G simulée).
2. La fonctionnalité est utilisable au clavier, testée sur un navigateur de plus de 6 ans, et conforme WCAG AA.
3. Aucun script tiers n'est exécuté sans consentement.
4. Les images sont compressées en WebP (800 px max, < 40 Ko).
5. Les critères RGESN applicables sont vérifiés et documentés.

## 8. Critères d'acceptation (Gherkin)

```gherkin
Fonctionnalité: Consultation anonyme
  Scénario: Accès direct au catalogue
    Étant donné que je suis sur la page d'accueil
    Quand je clique sur "Voir le matériel disponible"
    Alors la liste des annonces s'affiche sans identifiant
    Et le poids de la page est inférieur à 100 Ko

Fonctionnalité: Recherche textuelle
  Scénario: Recherche d'un équipement
    Étant donné que je suis sur la liste des annonces
    Quand je saisis "barnum" et je valide
    Alors seules les annonces contenant "barnum" apparaissent
    Et aucune requête réseau supplémentaire n'est exécutée

Fonctionnalité: Contact par e-mail
  Scénario: Génération du lien de contact
    Étant donné que je consulte la fiche "Enceinte 500W"
    Quand je clique sur "Contacter l'association"
    Alors mon client de messagerie s'ouvre avec l'adresse du prêteur
    Et l'objet est prérempli "[AssoShare] Demande de prêt : Enceinte 500W"

Fonctionnalité: Dépôt d'annonce
  Scénario: Soumission d'une annonce
    Étant donné que je suis sur le formulaire "Proposer du matériel"
    Quand je renseigne titre, catégorie, e-mail et téléphone
    Et que je clique sur "Publier l'annonce"
    Alors l'annonce est enregistrée
    Et je reçois un e-mail avec un lien unique de modification

Fonctionnalité: Fiche sobre
  Scénario: Affichage avec photo légère
    Étant donné qu'une annonce comporte une photo
    Quand j'ouvre la fiche détaillée
    Alors l'image est en WebP, 40 Ko maximum
    Et EcoIndex attribue la note A à la page
```

## 9. Parties prenantes

| Niveau d'engagement | Parties prenantes |
|---|---|
| Satisfaire | Mairie et service vie associative, mécènes et financeurs |
| Gérer de près | Référent·e écoconception, bureau des grands collectifs d'associations |
| Informer et impliquer | Bénévoles peu équipés (Jean-Pierre), membres des associations, environnement |
| Surveiller | Prestataires de location privés |

## 10. Livrables attendus

- Structure de fichiers : `index.html`, `style.css`, `app.js`, `img/*.webp`, endpoint de dépôt.
- Script JavaScript minimal pour le filtrage local et le formulaire.
- Instructions de validation : EcoIndex A (ecoindex.fr), affichage < 1,2 s (Lighthouse en Slow 4G, WebPageTest en 3G), WCAG AA (axe, WAVE), documentation RGESN.

## 11. Pitch (5 points)

1. **Problème :** des milliers d'euros dépensés chaque année pour du matériel qui dort le reste du temps, alors que l'association voisine l'a déjà.
2. **Pour qui :** Jean-Pierre, 71 ans, trésorier bénévole, ADSL lent, refuse un compte de plus.
3. **Réponse :** une page web sobre, sans application ni mot de passe, pour prêter et emprunter en quelques secondes.
4. **Impact :** 2 t éq. CO2 évitées la première année, moins de 0,2 g éq. CO2 par visite.
5. **Renoncement :** pas d'application mobile ni de géolocalisation temps réel, pour ne pas exclure Jean-Pierre ni alourdir l'outil.
