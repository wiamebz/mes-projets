#!/bin/bash

echo "=== Lab Kubernetes — Labels & Selectors ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Créer un Pod avec un label"
echo "  2. Lister les Pods avec un filtre par label"
echo "  3. Ajouter un label à un Pod existant"
echo "  4. Supprimer un label d'un Pod"
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
echo "ÉTAPE 1 : Créer un Pod avec un label"
echo "════════════════════════════════"
echo ""
echo "Les labels permettent d'identifier et de filtrer les ressources."
echo ""
echo "Commande à exécuter :"
echo "  kubectl run nginx --image=nginx --labels=env=prod"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -qE "kubectl run nginx --image=nginx.*--labels?=env=prod"; then
    eval "$cmd1" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_creer_pod_label:true:Commande correcte — $cmd1"
    echo "Étape 1 réussie !"
else
    echo "STEP_COMPLETED:etape_1_creer_pod_label:false:Commande incorrecte — $cmd1"
    echo "Commande incorrecte. La bonne commande était : kubectl run nginx --image=nginx --labels=env=prod"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Filtrer les Pods par label"
echo "════════════════════════════════"
echo ""
echo "Le flag -l (ou --selector) filtre par label."
echo ""
echo "Commande à exécuter :"
echo "  kubectl get pods -l env=prod"
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -qE "kubectl get pods (-l|--selector)=? ?env=prod"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_filtrer_par_label:true:Commande correcte — $cmd2"
    echo "Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_filtrer_par_label:false:Commande incorrecte — $cmd2"
    echo "Commande incorrecte. La bonne commande était : kubectl get pods -l env=prod"
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Ajouter un label à un Pod existant"
echo "════════════════════════════════"
echo ""
echo "La commande label permet d'ajouter ou modifier des labels."
echo ""
echo "Commande à exécuter :"
echo "  kubectl label pod nginx tier=frontend"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -qE "kubectl label pod nginx tier=frontend"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_ajouter_label:true:Commande correcte — $cmd3"
    echo "Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_ajouter_label:false:Commande incorrecte — $cmd3"
    echo "Commande incorrecte. La bonne commande était : kubectl label pod nginx tier=frontend"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Supprimer un label"
echo "════════════════════════════════"
echo ""
echo "On utilise 'label-' avec un tiret pour retirer un label."
echo ""
echo "Commande à exécuter :"
echo "  kubectl label pod nginx tier-"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -qE "kubectl label pod nginx tier-"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_supprimer_label:true:Commande correcte — $cmd4"
    echo "Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_supprimer_label:false:Commande incorrecte — $cmd4"
    echo "Commande incorrecte. La bonne commande était : kubectl label pod nginx tier-"
fi

echo ""
echo "════════════════════════════════"
echo "=== Lab terminé ! ==="
echo "LAB_COMPLETED"