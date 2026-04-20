#!/bin/bash

echo "=== Lab Kubernetes — Ingress ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Créer un Deployment + Service"
echo "  2. Créer une ressource Ingress"
echo "  3. Lister les Ingress"
echo "  4. Supprimer l'Ingress"
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
echo "ÉTAPE 1 : Créer un Deployment + Service"
echo "════════════════════════════════"
echo ""
echo "Avant de créer un Ingress, il faut un Service qui expose l'app."
echo ""
echo "Commande à exécuter :"
echo "  kubectl create deployment web --image=nginx"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -qE "kubectl create deployment web --image=nginx"; then
    eval "$cmd1" 2>/dev/null
    kubectl expose deployment web --port=80 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_deployment_service:true:Commande correcte — $cmd1"
    echo "Étape 1 réussie ! (Service exposé automatiquement)"
else
    echo "STEP_COMPLETED:etape_1_deployment_service:false:Commande incorrecte — $cmd1"
    echo "Commande incorrecte. La bonne commande était : kubectl create deployment web --image=nginx"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Créer une ressource Ingress"
echo "════════════════════════════════"
echo ""
echo "L'Ingress route le trafic HTTP vers les services."
echo ""
echo "Commande à exécuter :"
echo "  kubectl create ingress web-ingress --rule=\"example.com/*=web:80\""
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -qE "kubectl create ingress web-ingress.*--rule"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_creer_ingress:true:Commande correcte — $cmd2"
    echo "Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_creer_ingress:false:Commande incorrecte — $cmd2"
    echo "Commande incorrecte. La bonne commande était : kubectl create ingress web-ingress --rule=\"example.com/*=web:80\""
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Lister les Ingress"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl get ingress"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -qE "kubectl get (ingress|ing)"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_lister_ingress:true:Commande correcte — $cmd3"
    echo "Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_lister_ingress:false:Commande incorrecte — $cmd3"
    echo "Commande incorrecte. La bonne commande était : kubectl get ingress"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Supprimer l'Ingress"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl delete ingress web-ingress"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -qE "kubectl delete (ingress|ing) web-ingress"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_supprimer_ingress:true:Commande correcte — $cmd4"
    echo "Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_supprimer_ingress:false:Commande incorrecte — $cmd4"
    echo "Commande incorrecte. La bonne commande était : kubectl delete ingress web-ingress"
fi

echo ""
echo "════════════════════════════════"
echo "=== Lab terminé ! ==="
echo "LAB_COMPLETED"