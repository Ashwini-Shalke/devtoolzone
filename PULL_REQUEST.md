# Fix Dev Tools Navigation

This PR fixes the Dev Tools navigation link to properly redirect to the dev tools application instead of showing blog content.

## Changes

1. Updated netlify.toml to properly build and copy the dev tools app
2. Fixed the menu configuration in config.yml to point to the correct location
3. Removed conflicting content that was causing redirection issues

## Testing

- Verified locally that clicking on Dev Tools in the navigation correctly redirects to the dev tools application
- Created a production build to confirm it works in a production-like environment

## Screenshots

[Add screenshots if needed]
