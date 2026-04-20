#!/bin/bash

echo "=== Lab Kubernetes — Rolling Updates ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Créer un Deployment avec une version d'image"
echo "  2. Mettre à jour l'image (rolling update)"
echo "  3. Vérifier l'état du rollout"
echo "  4. Rollback vers la version précédente"
echo "  5. Voir l'historique des révisions"
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
echo "On crée un Deployment avec nginx version 1.21."
echo ""
echo "Commande à exécuter :"
echo "  kubectl create deployment webapp --image=nginx:1.21"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -qE "kubectl create deployment webapp --image=nginx:1\.21"; then
    eval "$cmd1" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_creer_deployment:true:Commande correcte — $cmd1"
    echo "Étape 1 réussie !"
else
    echo "STEP_COMPLETED:etape_1_creer_deployment:false:Commande incorrecte — $cmd1"
    echo "Commande incorrecte. La bonne commande était : kubectl create deployment webapp --image=nginx:1.21"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Mettre à jour l'image vers nginx:1.22"
echo "════════════════════════════════"
echo ""
echo "Kubernetes effectue automatiquement un rolling update."
echo ""
echo "Commande à exécuter :"
echo "  kubectl set image deployment/webapp nginx=nginx:1.22"
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -qE "kubectl set image deployment/webapp nginx=nginx:1\.22"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_update_image:true:Commande correcte — $cmd2"
    echo "Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_update_image:false:Commande incorrecte — $cmd2"
    echo "Commande incorrecte. La bonne commande était : kubectl set image deployment/webapp nginx=nginx:1.22"
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Vérifier l'état du rollout"
echo "════════════════════════════════"
echo ""
echo "On suit la progression du rolling update."
echo ""
echo "Commande à exécuter :"
echo "  kubectl rollout status deployment/webapp"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -qE "kubectl rollout status deployment/webapp"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_rollout_status:true:Commande correcte — $cmd3"
    echo "Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_rollout_status:false:Commande incorrecte — $cmd3"
    echo "Commande incorrecte. La bonne commande était : kubectl rollout status deployment/webapp"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Rollback vers la version précédente"
echo "════════════════════════════════"
echo ""
echo "Si la nouvelle version a un bug, on revient en arrière."
echo ""
echo "Commande à exécuter :"
echo "  kubectl rollout undo deployment/webapp"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -qE "kubectl rollout undo deployment/webapp"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_rollback:true:Commande correcte — $cmd4"
    echo "Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_rollback:false:Commande incorrecte — $cmd4"
    echo "Commande incorrecte. La bonne commande était : kubectl rollout undo deployment/webapp"
fi

echo ""

# ─── ÉTAPE 5 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 5 : Voir l'historique des révisions"
echo "════════════════════════════════"
echo ""
echo "On peut voir toutes les versions déployées."
echo ""
echo "Commande à exécuter :"
echo "  kubectl rollout history deployment/webapp"
echo ""
read -p "Votre commande : " cmd5

if echo "$cmd5" | grep -qE "kubectl rollout history deployment/webapp"; then
    eval "$cmd5" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_5_historique:true:Commande correcte — $cmd5"
    echo "Étape 5 réussie !"
else
    echo "STEP_COMPLETED:etape_5_historique:false:Commande incorrecte — $cmd5"
    echo "Commande incorrecte. La bonne commande était : kubectl rollout history deployment/webapp"
fi

echo ""
echo "════════════════════════════════"
echo "=== Lab terminé ! ==="
echo "LAB_COMPLETED"