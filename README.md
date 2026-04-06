# RevIA — Déploiement Vercel

## Structure
```
revia-vercel/
├── api/
│   └── chat.js        ← proxy backend (appelle Anthropic côté serveur)
├── public/
│   └── index.html     ← app RevIA
└── vercel.json        ← config routing
```

## Étapes de déploiement

### 1. Push sur GitHub
```bash
cd revia-vercel
git init
git add .
git commit -m "RevIA initial"
# Crée un repo sur github.com puis :
git remote add origin https://github.com/TON_USERNAME/revia.git
git push -u origin main
```

### 2. Connecter à Vercel
1. Va sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importe ton repo GitHub `revia`
3. **Root Directory** : laisse vide (auto-détecte)
4. **Framework Preset** : Other
5. Clique **Deploy**

### 3. Ajouter la clé API Anthropic
1. Dans Vercel → ton projet → **Settings** → **Environment Variables**
2. Ajoute :
   - Name : `ANTHROPIC_API_KEY`
   - Value : `sk-ant-api03-...` (ta vraie clé)
3. Clique **Save** puis **Redeploy**

## ⚠️ Important
La clé API est côté serveur uniquement — jamais exposée au navigateur.
L'app fonctionne en freemium (4 gratuites sans clé utilisateur) ou avec clé API perso entrée dans l'onboarding.
