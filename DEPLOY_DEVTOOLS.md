# Deploy Dev Tools Separately

To solve the issue with integrating the Dev Tools application with the Hugo site, we're going to deploy it as a separate application and link to it from the blog. Here's how to set it up:

## Step 1: Deploy the Dev Tools app to Netlify

1. Go to the learnerloft-apps directory:
   ```bash
   cd ../learnerloft-apps
   ```

2. Configure base path in vite.config.ts (if needed):
   ```js
   // Remove the base path setting since it will be deployed to root
   export default defineConfig({
     // Remove the line: base: '/devtools/',
     build: {
       outDir: 'dist',
       emptyOutDir: true,
     },
   })
   ```

3. Update the Router component in App.tsx to not use a basename:
   ```jsx
   <Router>
     {/* Remove the basename="/devtools" */}
     <Routes>
       <Route path="/" element={<LandingPage />} />
       {/* Other routes */}
     </Routes>
   </Router>
   ```

4. Create a netlify.toml file in the learnerloft-apps directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

5. Deploy to Netlify:
   - Either connect the learnerloft-apps repository to Netlify
   - Or deploy manually using Netlify CLI or drag-and-drop the dist folder

## Step 2: Update the blog to link to the deployed Dev Tools app

We've already updated the menu link in config.yml to point to:
```
https://learnerloft-devtools.netlify.app/
```

This approach has several advantages:
1. Separates concerns between blog and app
2. Avoids build configuration issues
3. Makes it easier to maintain and update each project independently
4. Avoids path conflicts
