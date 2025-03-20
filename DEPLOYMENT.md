# Deployment Instructions

## Prerequisites
To build and deploy the site with the Dev Tools app, ensure you have:
- Hugo installed (v0.145.0)
- Node.js and npm installed
- Access to both repositories:
  - devtoolzone (this repository)
  - learnerloft-apps (contains the React app for Dev Tools)

## Build Process

For local development:
```bash
# 1. Build the Dev Tools app
cd ../learnerloft-apps
npm install
npm run build

# 2. Copy the built files to the Hugo static directory
mkdir -p ../devtoolzone/static/devtools
cp -r dist/* ../devtoolzone/static/devtools/

# 3. Build the Hugo site
cd ../devtoolzone
hugo server -D
```

## Deployment Process

Before pushing changes for deployment:

1. Build the Dev Tools app and copy its built files to the Hugo static directory:
```bash
cd ../learnerloft-apps
npm install
npm run build
mkdir -p ../devtoolzone/static/devtools
cp -r dist/* ../devtoolzone/static/devtools/
```

2. Add and commit the generated files:
```bash
cd ../devtoolzone
git add static/devtools/
git commit -m "Update Dev Tools built files"
```

3. Push to the repository:
```bash
git push
```

> **IMPORTANT**: The `static/devtools/` directory containing the built Dev Tools app MUST be committed to the repository for successful deployment, as the build environment doesn't have access to the learnerloft-apps repository.
