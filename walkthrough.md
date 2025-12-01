# FPL Draft Dashboard - Walkthrough

## How to Run
1.  Open your terminal in the project folder:
    ```bash
    cd ~/Desktop/coding_projects/fpl-assistant
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open your browser to: [http://localhost:3000](http://localhost:3000)

## How to Use
1.  **Find your League ID**:
    - Go to your league page on the [FPL Draft website](https://draft.premierleague.com).
    - Look at the URL: `https://draft.premierleague.com/league/12345/standings`
    - Your ID is `12345`.
2.  **Enter the ID**: Type it into the app and click "Analyze League".
3.  **View the Watchdog**:
    - The app will show you the **Top Free Agents** in your league.
    - They are sorted by our custom "Watchdog Score" (Form + Underlying Stats).

## Features Built
- **League ID Authentication**: Simple, privacy-focused login.
- **Waiver Wire Watchdog**: Smart filtering of unowned players.
- **Premium UI**: Dark mode, glassmorphism, and responsive design.
