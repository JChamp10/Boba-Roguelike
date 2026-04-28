# Firebase Login Setup

This game is static-site friendly, so it can run on GitHub Pages and talk directly to Firebase Auth plus Firestore from the browser.

## GitHub Pages

1. Push the repo to GitHub.
2. Open the repo on GitHub.
3. Go to Settings > Pages.
4. Set Source to Deploy from a branch.
5. Choose `main` and `/root`, then save.
6. Your site should publish at `https://jchamp10.github.io/Boba-Roguelike/`.

## Firebase Project

1. Go to the Firebase Console and create a project.
2. Add a Web app and copy the `firebaseConfig` object.
3. In Authentication > Sign-in method, enable Email/Password.
4. In Firestore Database, create a database.
5. Start with rules that only let each signed-in user read and write their own save document:

```txt
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Browser Module Shape

Add a module script after `js/game.js` is loaded, or bundle this later if you move to Vite:

```html
<script type="module" src="js/firebase-login.js"></script>
```

The save path I recommend is:

```txt
users/{uid}
```

Store the current local save blob from `localStorage.getItem('boba_roguelike_save')` as a `save` field. That lets the game keep working offline today, then sync cloud saves once login is wired in.

Never commit service account JSON files or admin keys. The normal web `firebaseConfig` is okay to expose; Firestore rules are what protect player data.
