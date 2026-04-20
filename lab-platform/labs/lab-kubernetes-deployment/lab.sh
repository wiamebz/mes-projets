#!/bin/bash

echo "=== Lab Kubernetes — Deployment et Service ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Créer un Deployment"
echo "  2. Vérifier le Deployment"
echo "  3. Exposer avec un Service"
echo "  4. Vérifier le Service"
echo "  5. Scaler le Deployment"
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
echo "ÉTAPE 1 : Créer un Deployment nginx"
echo "════════════════════════════════"
echo ""
echo "Un Deployment gère plusieurs réplicas d'un Pod."
echo ""
echo "Commande à exécuter :"
echo "  kubectl create deployment nginx --image=nginx"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -q "kubectl create deployment nginx"; then
    eval "$cmd1" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_creer_deployment:true:Commande correcte — $cmd1"
    echo "Étape 1 réussie !"
else
    echo "STEP_COMPLETED:etape_1_creer_deployment:false:Commande incorrecte — $cmd1"
    echo "Commande incorrecte. La bonne commande était : kubectl create deployment nginx --image=nginx"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Vérifier le Deployment"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl get deployments"
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -q "kubectl get deployments"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_verifier_deployment:true:Commande correcte — $cmd2"
    echo "Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_verifier_deployment:false:Commande incorrecte — $cmd2"
    echo "Commande incorrecte. La bonne commande était : kubectl get deployments"
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Exposer avec un Service"
echo "════════════════════════════════"
echo ""
echo "Un Service expose le Deployment à l'extérieur."
echo ""
echo "Commande à exécuter :"
echo "  kubectl expose deployment nginx --port=80 --type=NodePort"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -q "kubectl expose deployment nginx"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_exposer_service:true:Commande correcte — $cmd3"
    echo "Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_exposer_service:false:Commande incorrecte — $cmd3"
    echo "Commande incorrecte. La bonne commande était : kubectl expose deployment nginx --port=80 --type=NodePort"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Vérifier le Service"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl get services"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -q "kubectl get services"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_verifier_service:true:Commande correcte — $cmd4"
    echo "Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_verifier_service:false:Commande incorrecte — $cmd4"
    echo "Commande incorrecte. La bonne commande était : kubectl get services"
fi

echo ""

# ─── ÉTAPE 5 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 5 : Scaler le Deployment"
echo "════════════════════════════════"
echo ""
echo "Scaler = augmenter le nombre de réplicas."
echo ""
echo "Commande à exécuter :"
echo "  kubectl scale deployment nginx --replicas=3"
echo ""
read -p "Votre commande : " cmd5

if echo "$cmd5" | grep -q "kubectl scale deployment nginx --replicas=3"; then
    eval "$cmd5" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_5_scaler_deployment:true:Commande correcte — $cmd5"
    echo "Étape 5 réussie !"
else
    echo "STEP_COMPLETED:etape_5_scaler_deployment:false:Commande incorrecte — $cmd5"
    echo "Commande incorrecte. La bonne commande était : kubectl scale deployment nginx --replicas=3"
fi

echo ""
echo "════════════════════════════════"
echo "=== Lab terminé ! ==="
echo "LAB_COMPLETED"