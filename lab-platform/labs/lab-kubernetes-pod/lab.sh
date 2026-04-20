#!/bin/bash

echo "=== Lab Kubernetes — Créer un Pod ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Démarrer un cluster Kubernetes"
echo "  2. Créer un Pod"
echo "  3. Vérifier son statut"
echo "  4. Afficher ses logs"
echo ""
echo "Démarrage du cluster Kind... (patience ~30 secondes)"
echo ""

# Démarrer le cluster
kind create cluster --name lab-cluster 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Erreur lors du démarrage du cluster !"
    exit 1
fi

echo ""
echo " Cluster démarré !"
echo ""

# ─── ÉTAPE 1 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 1 : Créer un Pod nginx"
echo "════════════════════════════════"
echo ""
echo "Un Pod est la plus petite unité dans Kubernetes."
echo "Il contient un ou plusieurs conteneurs."
echo ""
echo "Commande à exécuter :"
echo "  kubectl run nginx --image=nginx"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -q "kubectl run nginx"; then
    eval "$cmd1" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_creer_pod:true:Commande correcte — kubectl run nginx"
    echo " Étape 1 réussie !"
else
    echo "STEP_COMPLETED:etape_1_creer_pod:false:Commande incorrecte — $cmd1"
    echo " Commande incorrecte. La bonne commande était : kubectl run nginx --image=nginx"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Vérifier le statut du Pod"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl get pods"
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -q "kubectl get pods"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_verifier_pod:true:Commande correcte — kubectl get pods"
    echo " Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_verifier_pod:false:Commande incorrecte — $cmd2"
    echo " Commande incorrecte. La bonne commande était : kubectl get pods"
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Afficher les logs du Pod"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl logs nginx"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -q "kubectl logs nginx"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_logs_pod:true:Commande correcte — kubectl logs nginx"
    echo " Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_logs_pod:false:Commande incorrecte — $cmd3"
    echo " Commande incorrecte. La bonne commande était : kubectl logs nginx"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Supprimer le Pod"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl delete pod nginx"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -q "kubectl delete pod nginx"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_supprimer_pod:true:Commande correcte — kubectl delete pod nginx"
    echo " Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_supprimer_pod:false:Commande incorrecte — $cmd4"
    echo " Commande incorrecte. La bonne commande était : kubectl delete pod nginx"
fi

echo ""
echo "════════════════════════════════"
echo "=== Résultats ==="

# Compter les étapes réussies
reussies=$(grep -c "STEP_COMPLETED:.*:true:" <<< "$(cat /tmp/steps.log 2>/dev/null)")

echo "Lab terminé !"
echo "LAB_COMPLETED"