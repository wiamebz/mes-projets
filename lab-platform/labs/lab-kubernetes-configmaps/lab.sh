#!/bin/bash

echo "=== Lab Kubernetes — ConfigMaps ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Créer un ConfigMap"
echo "  2. Lister les ConfigMaps"
echo "  3. Créer un Pod qui utilise un ConfigMap"
echo "  4. Vérifier les variables dans le Pod"
echo ""
echo "Démarrage du cluster Kind... (patience ~30 secondes)"
echo ""

kind create cluster --name lab-cluster 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Erreur lors du démarrage du cluster !"
    exit 1
fi

echo ""
echo "Cluster démarré !"
echo ""

# ─── ÉTAPE 1 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 1 : Créer un ConfigMap"
echo "════════════════════════════════"
echo ""
echo "Un ConfigMap stocke des données de configuration (clé/valeur)"
echo "séparées du code de l'application."
echo ""
echo "Commande à exécuter :"
echo "  kubectl create configmap app-config --from-literal=APP_ENV=production"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -qE "kubectl create configmap app-config --from-literal=APP_ENV=production"; then
    eval "$cmd1" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_creer_configmap:true:Commande correcte — $cmd1"
    echo "Étape 1 réussie !"
else
    echo "STEP_COMPLETED:etape_1_creer_configmap:false:Commande incorrecte — $cmd1"
    echo "Commande incorrecte. La bonne commande était : kubectl create configmap app-config --from-literal=APP_ENV=production"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Lister les ConfigMaps"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl get configmaps"
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -qE "kubectl get (configmaps|cm)"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_lister_configmaps:true:Commande correcte — $cmd2"
    echo "Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_lister_configmaps:false:Commande incorrecte — $cmd2"
    echo "Commande incorrecte. La bonne commande était : kubectl get configmaps"
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Afficher le contenu du ConfigMap"
echo "════════════════════════════════"
echo ""
echo "On peut voir les données avec la commande describe."
echo ""
echo "Commande à exécuter :"
echo "  kubectl describe configmap app-config"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -qE "kubectl describe (configmap|cm) app-config"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_afficher_configmap:true:Commande correcte — $cmd3"
    echo "Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_afficher_configmap:false:Commande incorrecte — $cmd3"
    echo "Commande incorrecte. La bonne commande était : kubectl describe configmap app-config"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Supprimer le ConfigMap"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl delete configmap app-config"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -qE "kubectl delete (configmap|cm) app-config"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_supprimer_configmap:true:Commande correcte — $cmd4"
    echo "Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_supprimer_configmap:false:Commande incorrecte — $cmd4"
    echo "Commande incorrecte. La bonne commande était : kubectl delete configmap app-config"
fi

echo ""
echo "════════════════════════════════"
echo "=== Lab terminé ! ==="
echo "LAB_COMPLETED"