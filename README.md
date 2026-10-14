# yarnknots.com

The Yarn Knots website: home page, free playable demo (levels 1–10 + Daily Tangle), privacy policy, terms of use, contact form, press kit and a "page not found" page. Plain HTML, CSS and JavaScript: no build step.

This repository is **public** (required for free GitHub Pages). It contains only the website and demo; keep the main game project in a separate private repository.

## Copyright

© 2026 Gudthingz (Ottawa, Ontario, Canada). All rights reserved.

Yarn Knots, its name, characters (including Biscuit, Sir Pounce, Miso, Pillow and Pepper), artwork, voice recordings, sounds, game design and code are the property of Gudthingz. This repository is public only so the website can be hosted; that does **not** grant any licence. You may not copy, modify, redistribute or reuse any part of it, including in other games, apps or websites, without written permission.

Questions or permission requests: hello@yarnknots.com

## 1. Put the site on GitHub Pages

1. On github.com, create a new repository named `yarnknots-site` (any name works). Set it to **Public**. Don't add a README.
2. Open the repository, choose **Add file → Upload files**, and drag in **everything inside this folder** (including the hidden `.nojekyll` file if your computer shows it; it's optional). Click **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, and **Save**.
4. Still on the Pages screen, in **Custom domain** enter `yarnknots.com` and **Save**. (The `CNAME` file in this folder already says yarnknots.com.)

## 2. Point yarnknots.com at GitHub

At the company where you bought the domain, open its **DNS settings** and add these records (delete any existing "parked" A records for `@` first):

| Type | Host / Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-GITHUB-USERNAME.github.io |

Don't change the MX records that make hello@yarnknots.com work.

DNS can take from a few minutes to 24 hours. When GitHub's Pages screen shows the domain check passed, tick **Enforce HTTPS**. (Optional but recommended: verify the domain under your GitHub profile **Settings → Pages → Add a domain**, so nobody else can claim it.)

GitHub's own guide, in case anything differs: docs.github.com → "Managing a custom domain for your GitHub Pages site".

## 3. Connect the forms and stats

All settings live in **`assets/config.js`**. Edit it on GitHub (open the file, click the pencil icon, paste, **Commit changes**).

**Launch email signups: Sender.net (free up to 2,500 subscribers)**
The signup form is a Sender.net embedded form ("Yarn Knots – Launch signup", group "Launch list", double opt-in). Its script and form id are placed directly in `index.html` and `play/index.html`, not in `config.js`. If the form doesn't load (an ad blocker, for example), the page shows an "email hello@yarnknots.com" message instead.

**Contact form: Formspree (free, 50 messages a month)**
1. Sign up at formspree.io with hello@yarnknots.com and create a new form.
2. Copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`) into `formspreeUrl`.
3. In the form's settings, restrict submissions to the domain `yarnknots.com`.

**Visitor stats: GoatCounter (free, no cookies)**
1. Sign up at goatcounter.com. Choose the code `yarnknots` (giving yarnknots.goatcounter.com).
2. Put that code in `goatcounterCode`.
3. Besides page views, the demo reports these events, which are what the ad test measures:
   `demo-first-visit`, `demo-start-level-N`, `demo-complete-level-N`, `demo-help-free`, `demo-help-yarn`, `demo-daily-complete`, `demo-finished`, `contact-sent`, plus `playtest-page-open` and `playtest-feedback-sent` on the playtest page. (Email signups are counted in Sender.net.)

**Socials:** the links in `config.js` assume the handle @yarnknots everywhere. Change any that differ, or delete a line to hide that icon.

## 4. Legal pages

The Privacy, Terms and Press pages name Gudthingz, Ottawa, Ontario, Canada as the operator (filled in October 14, 2026). Have a lawyer review the privacy policy and terms before running paid ads.

## Playtest page

`playtest/index.html` (yarnknots.com/playtest) is a hidden page for testers: instructions plus a feedback form that sends to Formspree with the subject "Yarn Knots playtest feedback" and attaches the tester's demo progress from their browser. It isn't linked from the menu and asks search engines not to index it.

## Links for the ad test

- Demo: https://yarnknots.com/play/
- Add tracking tags per video so GoatCounter shows which ad sent each visitor, e.g.
  `https://yarnknots.com/play/?utm_source=tiktok&utm_campaign=mischief`

## Updating the demo later

`play/index.html` is the whole game in one file. To update it, replace that file. Levels beyond 10 show a "You finished the demo!" screen with the email signup; the limit is `DEMO_MAX` near the middle of the file.
