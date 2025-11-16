# 🖼️ Museum Accessibility Study

A two-part interactive experiment comparing user performance in an **inaccessible (bad)** museum interface vs a **fully accessible (good)** interface.
Built using **React**, **Vite**, and deployed via **GitHub Pages**.

Participants complete timed search tasks and export a CSV containing their reaction times, accuracy, and participant identifiers.

## 🚀 Running the Project Locally
1. Clone the repository
   ```
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```

3. Install dependencies
   
   `npm install`

5. Start the dev server

   `npm run dev`

7. The project will be available at:
   
    <http://localhost:5173>

## 🧪 Study Flow

1. Start at the Tutorial page

2. Enter Participant Name and Computing ID

3. Complete tasks in the Bad Museum

4. After the last task, a transition screen appears

5. Continue to the Good Museum

6. Complete the same set of tasks

7. Export session data as a CSV file

## 🏛️ Museum Versions
### Bad Museum

- Blurry and low-visibility images

- Misleading, vague alt text

- Poor keyboard navigation

- Inconsistent focus states

- Simulates real accessibility barriers

### Good Museum

- Clear, high-quality images

- Descriptive, accurate alt text

- Full keyboard & screen reader support

- Improved layouts and focus indicators

- Demonstrates good accessibility practice

## 📄 Data Collected

The exported CSV includes:

| Field         | Description                   |
| ------------- | ----------------------------- |
| `participant` | Participant name              |
| `computingId` | Computing ID                  |
| `condition`   | `"bad"` or `"good"`           |
| `taskId`      | Task identifier               |
| `targetId`    | Correct exhibit ID            |
| `chosenId`    | Image selected                |
| `correct`     | `1` if correct, `0` otherwise |
| `ms`          | Reaction time (milliseconds)  |
| `createdAt`   | Timestamp of session start    |


CSV filename format:

`<participant>_<computingId>_museum-study.csv`

## 📦 Build

To create a production build:

`npm run build`

This outputs the final static site to:

`dist/`

## 🌐 Deploying to GitHub Pages
1. Install gh-pages


`npm install --save-dev gh-pages`

2. Add the following to package.json
   
```
{
  "homepage": "https://<your-username>.github.io/<your-repo>/",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Build and deploy
```
npm run build
npm run deploy
```

5. Enable GitHub Pages

   In GitHub:

   **Settings → Pages → Source → Deploy from Branch → gh-pages**

   Your site will be available at: https://your-username.github.io/your-repo/


## 🗂️ Project Structure
```
src/
  components/
    ExhibitCard.jsx
  study/
    StudyHUD.jsx
    dataStore.js
    tasks.js
  pages/
    Tutorial.jsx
    BadMuseum.jsx
    GoodMuseum.jsx
  data.js

public/
  (all exhibit images)
```

## 🧑‍🎨 About

This project was created for an accessibility-focused HCI study.

It demonstrates how interface design impacts:
- Task performance
- User experience
- Accessibility awareness
- Empathy toward screen reader and low-vision users
