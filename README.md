# ShqipLingo 🇦🇱 - Albanisch lernen auf Deutsch

Eine moderne, mobile-first Web-App (PWA) zum spielerischen Erlernen des Standardalbanischen (*Gjuha Standarde Shqipe*) für Deutschsprachige. Sie kombiniert einen Duolingo-ähnlichen Lernpfad mit interaktiven Lerneinheiten, Smart Flashcards und einem kontextuellen KI-Tutor.

![ShqipLingo Preview](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Ready-2ea44f?style=for-the-badge&logo=github)

---

## 🌟 Hauptfunktionen

1. **Gamifizierter Lernpfad ("Lernen")**:
   - **Tage-Serie (Streak)** mit Flammen-Icon, **XP-Belohnungen** und **5 Herzen** mit Auffüllung.
   - 3 Einheiten mit je 3 interaktiven Lektionen:
     - **Einheit 1**: Begrüßungen & Grundlagen (*Përshëndetje dhe Bazat*)
     - **Einheit 2**: Im Café & Essen (*Në Kafe dhe Ushqimi*)
     - **Einheit 3**: Familie & Alltag (*Familja dhe Përditshmëria*)
2. **Interaktive Lektionen-Engine**:
   - Multiple-Choice Übersetzung (Albanisch ↔ Deutsch).
   - Satzbaukasten mit Wort-Kacheln (*Word Bank*).
   - Wortpaare verbinden (*Matching Pairs*).
   - **"Warum?"-Grammatik-Erklärungen**: Detaillierte Erklärungen im Vergleich zur deutschen Grammatik (z.B. nachgestellter bestimmter Artikel, Konjunktiv mit *të*, Verneinung mit *nuk*).
   - **Sprachausgabe**: Standardalbanische Aussprache per Web Speech API.
3. **Smart Wiederholen ("Wiederholen")**:
   - Fehlerhafte Wörter werden automatisch im Karteikarten-Deck gespeichert.
   - Smooth 3D-Flip Animation (Albanisch ↔ Deutsch).
   - Vokabeln als "Gelernt" markieren oder weiter üben.
4. **KI-Tutor ("KI-Tutor")**:
   - Rollenspiele für Alltagssituationen:
     - *Kaffee bestellen in Tirana (Blloku)*
     - *Sich vorstellen im Hostel (Shkodra)*
     - *Auf dem Basar in Kruja*
   - Geduldige albanische Antworten, deutsche Übersetzungen und Grammatik-Tipps.
5. **Profil & Statistiken ("Profil")**:
   - Rangstufe (*Fillestar*), Gesamt-XP, gemeisterte Lektionen & Wortschatz.

---

## 🚀 GitHub Pages Bereitstellung

Das Repository enthält eine automatisierte GitHub Actions Workflow-Datei (`.github/workflows/deploy.yml`):

1. **Repository auf GitHub erstellen** (z.B. `shqiplingo`).
2. **Code pushen**:
   ```bash
   git remote add origin https://github.com/<DEIN-BENUTZERNAME>/<REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```
3. **GitHub Pages aktivieren**:
   - Gehe in deinem GitHub-Repository auf **Settings** → **Pages**.
   - Wähle unter **Build and deployment** > **Source**: **GitHub Actions**.
   - Nach wenigen Augenblicken ist deine App live unter:  
     `https://<DEIN-BENUTZERNAME>.github.io/<REPO-NAME>/`
