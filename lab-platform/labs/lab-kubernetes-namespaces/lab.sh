#!/bin/bash

echo "=== Lab Kubernetes — Namespaces ==="
echo ""
echo "Dans ce lab vous allez apprendre à :"
echo "  1. Créer un Namespace"
echo "  2. Lister les Namespaces"
echo "  3. Créer un Pod dans un Namespace spécifique"
echo "  4. Supprimer le Namespace"
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
echo "ÉTAPE 1 : Créer un Namespace"
echo "════════════════════════════════"
echo ""
echo "Un Namespace permet d'isoler les ressources Kubernetes."
echo ""
echo "Commande à exécuter :"
echo "  kubectl create namespace dev"
echo ""
read -p "Votre commande : " cmd1

if echo "$cmd1" | grep -q "kubectl create namespace dev"; then
    eval "$cmd1" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_1_creer_namespace:true:Commande correcte — $cmd1"
    echo "Étape 1 réussie !"
else
    echo "STEP_COMPLETED:etape_1_creer_namespace:false:Commande incorrecte — $cmd1"
    echo "Commande incorrecte. La bonne commande était : kubectl create namespace dev"
fi

echo ""

# ─── ÉTAPE 2 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 2 : Lister les Namespaces"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl get namespaces"
echo ""
read -p "Votre commande : " cmd2

if echo "$cmd2" | grep -qE "kubectl get (namespaces|ns)"; then
    eval "$cmd2" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_2_lister_namespaces:true:Commande correcte — $cmd2"
    echo "Étape 2 réussie !"
else
    echo "STEP_COMPLETED:etape_2_lister_namespaces:false:Commande incorrecte — $cmd2"
    echo "Commande incorrecte. La bonne commande était : kubectl get namespaces"
fi

echo ""

# ─── ÉTAPE 3 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 3 : Créer un Pod dans le Namespace dev"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl run nginx --image=nginx --namespace=dev"
echo ""
read -p "Votre commande : " cmd3

if echo "$cmd3" | grep -qE "kubectl run nginx --image=nginx.*(-n |--namespace)(=| )?dev"; then
    eval "$cmd3" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_3_pod_dans_namespace:true:Commande correcte — $cmd3"
    echo "Étape 3 réussie !"
else
    echo "STEP_COMPLETED:etape_3_pod_dans_namespace:false:Commande incorrecte — $cmd3"
    echo "Commande incorrecte. La bonne commande était : kubectl run nginx --image=nginx --namespace=dev"
fi

echo ""

# ─── ÉTAPE 4 ───────────────────────────────────────────
echo "════════════════════════════════"
echo "ÉTAPE 4 : Supprimer le Namespace"
echo "════════════════════════════════"
echo ""
echo "Commande à exécuter :"
echo "  kubectl delete namespace dev"
echo ""
read -p "Votre commande : " cmd4

if echo "$cmd4" | grep -qE "kubectl delete (namespace|ns) dev"; then
    eval "$cmd4" 2>/dev/null
    echo ""
    echo "STEP_COMPLETED:etape_4_supprimer_namespace:true:Commande correcte — $cmd4"
    echo "Étape 4 réussie !"
else
    echo "STEP_COMPLETED:etape_4_supprimer_namespace:false:Commande incorrecte — $cmd4"
    echo "Commande incorrecte. La bonne commande était : kubectl delete namespace dev"
fi

echo ""
echo "════════════════════════════════"
echo "=== Lab terminé ! ==="
echo "LAB_COMPLETED"