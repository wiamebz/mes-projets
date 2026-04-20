#!/bin/bash

echo "=== Lab Kubernetes — Horizontal Pod Autoscaler (HPA) ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Créer un Deployment avec limites CPU"
echo "  2. Créer un HPA (autoscaling)"
echo "  3. Lister les HPA"
echo "  4. Supprimer le HPA"
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
echo "ÉTAPE 1 : Créer un Deployment"
echo "════════════════════════════════"
echo ""
echo "Le HPA surveille la charge CPU du Deployment."
echo ""
echo "Commande à exécuter :"
echo "  kubectl create deployment php-apache --image=nginx"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -qE "kubectl create deployment php-apache --image=nginx"; then
    eval "$cmd1" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_creer_deployment:true:Commande correcte — $cmd1"
    echo "Étape 1 réussie !"
else
    echo "STEP_COMPLETED:etape_1_creer_deployment:false:Commande incorrecte — $cmd1"
    echo "Commande incorrecte. La bonne commande était : kubectl create deployment php-apache --image=nginx"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Créer un HPA"
echo "════════════════════════════════"
echo ""
echo "Le HPA scale automatiquement entre min et max replicas."
echo ""
echo "Commande à exécuter :"
echo "  kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=5"
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -qE "kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=5"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_creer_hpa:true:Commande correcte — $cmd2"
    echo "Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_creer_hpa:false:Commande incorrecte — $cmd2"
    echo "Commande incorrecte. La bonne commande était : kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=5"
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Lister les HPA"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl get hpa"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -qE "kubectl get (hpa|horizontalpodautoscalers?)"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_lister_hpa:true:Commande correcte — $cmd3"
    echo "Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_lister_hpa:false:Commande incorrecte — $cmd3"
    echo "Commande incorrecte. La bonne commande était : kubectl get hpa"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Supprimer le HPA"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl delete hpa php-apache"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -qE "kubectl delete (hpa|horizontalpodautoscalers?) php-apache"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_supprimer_hpa:true:Commande correcte — $cmd4"
    echo "Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_supprimer_hpa:false:Commande incorrecte — $cmd4"
    echo "Commande incorrecte. La bonne commande était : kubectl delete hpa php-apache"
fi

echo ""
echo "════════════════════════════════"
echo "=== Lab terminé ! ==="
echo "LAB_COMPLETED"