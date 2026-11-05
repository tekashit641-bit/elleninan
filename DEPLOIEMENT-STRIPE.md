# EL LE NINAN — site Vercel et paiement Stripe

Le site est une page HTML statique servie à la racine (`index.html`). Les routes `api/` sont des fonctions Vercel : le secret Stripe n’est jamais placé dans le HTML.

## Configuration Vercel

Dans **Project → Settings → Environment Variables**, renseigner pour Production (et Preview/Test séparément si souhaité) :

- `STRIPE_SECRET_KEY` : clé secrète du compte Stripe connecté. Ne jamais la mettre dans le HTML, GitHub, un message ou une variable `NEXT_PUBLIC_*`.
- `SITE_URL` : origine publique exacte, par exemple `https://elleninan.fr` (sans slash final).
- `STRIPE_WEBHOOK_SECRET` : secret `whsec_...` de l’endpoint webhook ci-dessous.

La clé publiable n’est pas nécessaire à Stripe Checkout hébergé. Le code n’utilise ni `STRIPE_MCP_KEY` ni une clé `NEXT_PUBLIC_*` pour le paiement.

Il est préférable de connecter le compte Stripe existant via l’intégration Vercel (Import Existing Stripe Account) ou de saisir une clé secrète neuve dans la variable d’environnement. Les clés live qui ont été partagées dans une conversation doivent être révoquées puis remplacées dans Stripe avant la mise en production. Après chaque changement des variables, redéployer le projet.

## Webhook Stripe

Dans le Dashboard Stripe, créer un endpoint `https://elleninan.fr/api/stripe-webhook`, en sélectionnant `checkout.session.completed` et `checkout.session.async_payment_succeeded`. Copier le secret de signature `whsec_...` dans `STRIPE_WEBHOOK_SECRET` dans Vercel, puis redéployer. Le webhook vérifie la signature et confirme l’événement ; aucun accès ou secret n’est exposé au navigateur.

## Fonctionnement et limites métier

- `POST /api/create-checkout-session` vérifie les coordonnées, les produits et les quantités, puis recalcule les montants à partir du catalogue serveur. Les prix envoyés par le navigateur ne sont jamais acceptés.
- Le client paie sur la page hébergée par Stripe. Au retour, le site interroge Stripe côté serveur et ne marque le panier payé qu’après vérification de `payment_status=paid`.
- Les prix appliqués sont les prix de départ affichés par le site. Livraison et disponibilité restent à confirmer séparément ; aucun frais de livraison n’est ajouté au paiement.
- Le webhook n’enregistre pas de commande dans une base de données et n’envoie pas d’e-mail de confirmation ou de préparation. Consulter Stripe pour le suivi des paiements. Pour une gestion automatique des commandes, remboursements, première livraison offerte ou stocks, ajouter une base de données et une procédure de traitement fiable avant d’activer ces règles.
- L’anti-abus en mémoire limite sommairement les tentatives par instance. Pour un trafic important, ajouter un rate limit partagé (Redis/WAF) et une base de données avec clés d’idempotence.

## Compteurs visiteurs

La route existante `api/visitors.js` conserve ses compteurs Upstash. Configurez `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` dans Vercel comme auparavant.
