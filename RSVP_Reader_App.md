# RSVP Reader App

A distraction-free, modern Rapid Serial Visual Presentation (RSVP) reader built with React Native. The app eliminates eye movement (saccades) to allow users to read at incredible speeds (400–1000+ WPM) by flashing words in the center of the screen.

## 1. The Modern UI Concept: "Distraction-Free Minimalism"

The entire philosophy of an RSVP app should be getting everything out of the way of the text.

### The Reader Screen (The Core)
* **Massive Negative Space:** The screen should be almost entirely blank.
* **The Focal Point:** The active word should sit dead center.
* **Optimal Recognition Point (ORP) Alignment:** This is crucial. Align the words based on their ORP (usually slightly left of center of the word) and highlight that specific letter in an accent color (like vibrant red or electric blue). This gives the eye a strict anchor point.
* **Hidden Controls:** When the words are flashing, hide all UI elements (status bar, navigation bar, buttons). A simple tap on the screen should pause the reading and bring up the controls.

### Typography & Colors
* **Typography:** Use highly legible, modern sans-serif fonts (like Inter, SF Pro, or Roboto) and monospace fonts. Offer a dyslexic-friendly font option (like OpenDyslexic).
* **Color Palettes:** Offer high-contrast themes.
  * *True Black (OLED)* for night reading to reduce eye fatigue.
  * *Sepia/Warm Paper* for daytime reading.
  * *Crisp White* with dark grey text (pure black on pure white can cause ghosting).

### Gestures
* **Scrubbing:** Swipe left/right anywhere on the screen to scrub backward or forward by a sentence or paragraph.
* **Playback:** Tap to play/pause.
* **Speed Adjustment:** Swipe up/down to quickly adjust the Words Per Minute (WPM) speed.

---

## 2. Essential Features (The MVP)

To be a functional RSVP reader, your app needs these baseline features:

* **Variable Speed Control:** Allow users to adjust WPM anywhere from 100 to 1000+ WPM.
* **Dynamic Pacing:** The app shouldn't flash every word for the exact same millisecond duration. It should slightly pause on punctuation (commas, periods, paragraph breaks) and leave longer words on the screen just a fraction of a second longer than short words (like "a" or "the").
* **Chunking:** Allow users to read 1, 2, or 3 words at a time. Some power users prefer absorbing short phrases rather than single words.
* **Context Peeking:** When paused, show the full surrounding sentence or paragraph so the user can regain their context if they zoned out.
* **Library Management:** A clean grid or list view of the user's books and articles with visual progress bars indicating how far along they are.

---

## 3. "Killer" Features to Stand Out

To elevate your app above basic RSVP readers currently on the market, consider adding these:

* **Universal Content Ingestion (The Share Sheet):** This is the most important feature for user retention. Users should be able to send an article from their web browser directly to your app via the OS "Share" button. It should instantly strip the ads and formatting and begin the RSVP playback.
* **Broad File Support:** Support ePubs, PDFs (text-parsed), TXT files, and a simple "Paste from Clipboard" option.
* **Smart Summaries (AI Integration):** Since reading at 800 WPM can sometimes hurt comprehension, offer a feature that generates a bulleted summary of the chapter or article once the user finishes it.
* **Reading Analytics:** Gamify the experience. Track metrics like "Time Saved," "Top WPM," "Books Read," and show graphs of their reading speed progression over time.
* **Wearable Support:** An Apple Watch or WearOS companion app. Tapping your wrist to speed-read a text message or a short news brief is a great use case for RSVP.
