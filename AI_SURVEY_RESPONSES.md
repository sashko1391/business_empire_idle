# AI Survey Responses: Business Empire Idle

*Collected: 2026-03-16*

---

## Response 1 — Claude Sonnet 4.6

### Section 1: Player Engagement & Retention

**1. Психологічні хуки**

Найсильніші механіки для бізнес-тематики:

**Variable ratio reinforcement** — найпотужніший хук. Замість фіксованого доходу додай випадкові "бонусні контракти" (×2–×10 income burst на 30с), які випадають з непередбачуваною частотою.

**Progress bars everywhere** — кожен бізнес повинен мати видиму шкалу до наступного рівня, загальний net worth meter, milestone tracker.

**Loss aversion / FOMO** — "Ваш бізнес генерує $X/сек. Закрийте вкладку — і пропустите $Y за годину."

**Number escalation dopamine** — коли цифри ростуть швидко, гравець відчуває прогрес навіть без нового контенту.

**Milestone celebration** — кожне досягнення потребує чіткого visual/audio feedback.

---

**2. "Стіна" через 10–30 хвилин**

Конкретна проблема — **середина прогресії (бізнеси 5–8)**:
- 10 хвилин: є 3–4 бізнеси, пасивний дохід ще малий, клікати нудно, чекати довго.
- 15–25 хвилин: гравець бачить ціну наступного бізнесу ($50K+), його дохід $200/сек. Це 4+ хвилини чистого очікування. **Dead zone — тут 70% гравців закривають вкладку.**

Причини: відсутність "micro-goals", апгрейди закінчуються рано, немає anticipation.

---

**3. Redesign Prestige**

**Prestige Currency ("Reputation Points")** — гравець отримує валюту пропорційно заробленим грошам: `RP = floor(sqrt(totalEarned / 1e6))`.

**Prestige Shop:** permanent income multipliers, start with $X after prestige, unlock нових бізнесів, "Golden" версії бізнесів.

**Prestige Milestones** — кожен 5-й prestige відкриває нову механіку (менеджери, M&A).

---

**4. Daily/Weekly механіки**

- **Daily Spin** — 24-год таймер, streak до 7 днів, пропуск скидає streak
- **Daily Contract** — "Заробіть $X за Y хвилин" → бонусна нагорода
- **Weekend Event** — "Market Boom" (+50% income на весь день)
- **Weekly Challenge** — "Досягніть prestige 3 рази за тиждень" → ексклюзивний апгрейд

Все без бекенду: прив'язати до `Math.floor(Date.now() / 86400000)`.

---

**5. Соціальні фічі без бекенду**

- **Achievement Screenshot Cards** — canvas → PNG share card
- **Encoded Save URL** — весь стан в base64 URL (як Wordle)
- **Challenge Mode** — seed-based сценарій з URL-параметром

---

### Section 2: Content & Depth

**6. Бізнес-прогресія (4 ери)**

| Ера | Бізнеси | Настрій |
|-----|---------|---------|
| Side Hustle | Lemonade, Freelance, Food Truck | Гаражний стартап |
| Small Business | Coffee, Laundromat, Restaurant | Перший офіс |
| Corporation | Tech, Bank, Shipping, Media | IPO, boardroom |
| Global Mogul | Space Tourism, AI Lab, Interplanetary | Sci-fi |

---

**7. Система апгрейдів (3 шари)**

- **Шар 1:** Business-specific, багаторівневі (Lv1→Lv10)
- **Шар 2:** Synergy upgrades (cross-business bonuses)
- **Шар 3:** Prestige upgrades (meta-progression, permanent)

---

**8. Менеджери**

Однозначно так. Менеджери — prestige-layer unlock:
- Lv1: авто-збір income
- Lv2: авто-купівля апгрейдів
- Lv3: +25% efficiency

---

**9. Visual/Audio (без зовнішніх assets)**

- CSS: floating "+$123" numbers, card pulse, progress shimmer, screen shake при milestone
- Web Audio API: click tick (800Hz/50ms), purchase "ка-чінг" (523→659Hz), milestone chord
- Dynamic background shift по ерах

---

**10. Mini-games**

- **Investment Opportunity popup** — раз на 2–5 хвилин: "Invest $X for Y%?" з 10с на рішення
- **Market Timing** — графік ціни (sine+noise), BUY/SELL за 15 секунд
- **Speed Click Challenge** — "Підпишіть 50 контрактів за 10 секунд"

---

### Section 3: Monetization Strategy

**11. Модель монетизації**

1. Rewarded Ads — opt-in, "×2 income на 4 год за 30с реклами"
2. One-time "Remove Ads" ($2.99–$4.99) = permanent ×2 замість ads
3. Cosmetic packs ($0.99–$2.99)
4. Starter Pack ($1.99, one-time, після 30 хвилин гри)

**Не рекомендується:** premium currency, subscription, banner ads.

---

**12. Pay-to-progress баланс**

✅ Прискорює, не відкриває ексклюзивний контент
✅ Free player теж може все, просто повільніше
❌ Paywall на автоматизацію або prestige
❌ ×10 permanent multiplier за $5

**Правило:** будь-який платний бонус ≤ 4x того, що free гравець за 1 день.

---

**13. Cosmetic items**

- Office Themes: Industrial Loft, Penthouse, Retro 80s, Cyberpunk
- Business Skins: Golden Lemonade Stand, Neon Coffee Shop
- Income Effects: gold particles, matrix-style числа
- Titles: "Wall Street Wolf", "Serial Entrepreneur"
- Click Effects: вибух монет, підпис документу
- Prestige Animations: rocket, IPO bell, fireworks

---

**14. Mobile port**

**PWA першим кроком** (2–3 години):
- `manifest.json` (10 рядків)
- `service-worker.js` (30 рядків)
- Touch events
- Fullscreen API

Mobile змінює монетизацію: AdMob rewarded video $5–$15 eCPM vs $1–3 web.
Потім: Android TWA → Google Play → real IAP.

---

**15. Revenue estimate (1000 DAU)**

| Канал | Місячний дохід |
|-------|---------------|
| Rewarded ads | ~$225/міс |
| Starter Pack | ~$40/міс |
| Remove Ads | ~$40/міс |
| Cosmetics | ~$10/міс |
| **TOTAL** | **~$300–350/міс** |

---

### Section 4: Technical Architecture

**16. Мінімальний бекенд**

Supabase (добре знайоме): Auth → anonymous/Google, PostgreSQL, RLS, Edge Functions.

```sql
game_saves: id, user_id, save_data (jsonb), updated_at
leaderboard: user_id, display_name, total_earned, prestige_count, updated_at
```

---

**17. Структура codebase**

```
business-empire/
├── src/
│   ├── main.js          — init, game loop, events
│   ├── state.js         — gameState, save/load
│   ├── config.js        — businesses[], upgrades[], costs
│   ├── engine.js        — tick(), calculateIncome(), prestige()
│   ├── ui.js            — DOM, formatNumber(), animations
│   ├── audio.js         — Web Audio API
│   ├── daily.js         — daily bonuses, challenges
│   ├── achievements.js  — milestones
│   └── analytics.js     — event tracking
├── styles/
│   ├── main.css
│   └── themes/
├── index.html
└── build.sh             — cat all JS into single file for prod
```

---

**18. Analytics events (Top 10)**

1. `game_start` — new vs returning
2. `first_business_purchased` — за скільки секунд від старту
3. `business_purchased` — який, ціна, income/sec
4. `upgrade_purchased`
5. `prestige_triggered` — prestige count, total earned
6. `session_end` — duration, last action
7. `daily_bonus_claimed` — streak count
8. `ad_watched` — reward type
9. `purchase_made` — IAP product, price
10. `wall_detected` — idle 3+ хвилини без дії

**Інструменти:** Plausible ($9/міс) або Supabase Edge Function (безкоштовно).

---

**19. Offline progress**

- **Offline Events:** "Ваш Coffee Shop отримав 5-зірковий відгук → +20% бонус"
- **Offline Multiplier Wheel:** spin при поверненні: ×1/×1.5/×2/×3
- **Manager Reports:** "Менеджер автоматично купив 3 апгрейди"
- Збільшити cap до 24 год з diminishing returns (4-8 год = 80%, 8-24 = 50%)

---

**20. Технічні ризики (10K+ users)**

- localStorage ~5MB limit → компресія LZString, міграція на IndexedDB
- Cheat prevention (без бекенду неможливо повністю)
- GitHub Pages: 100GB bandwidth/місяць soft limit
- Cache invalidation: version query param (`?v=1.2.3`)
- **Головний ризик:** save migration — потрібен `saveVersion` field + migration functions

---

### Section 5: Market & Positioning

**21. Target audience**

- 18–35, 65% чоловіки, "tab gamers"
- Desktop browser (70%), mobile (20%), PWA (10%)
- Сесії: 1–5 хвилин активно, потім годину у фоні
- Грають: Cookie Clicker, Adventure Capitalist, Egg Inc

---

**22. USP**

Поточний USP відсутній — generic clone AdVenture Capitalist.

Рекомендовані ніші:
- **A: "Ukrainian Entrepreneur Simulator"** — бізнеси: "Кав'ярня на Хрещатику", "ІТ-аутсорс", "Ферма на Полтавщині". 45M+ потенційних гравців, 0 конкурентів.
- **B: "Ethical Business Empire"** — moral decisions: exploit workers vs go green
- **C: "Idle Startup Simulator"** — MVP→fundraising→IPO→pivot

**Фаворит: Варіант A** — знаєш ринок, локалізація — бар'єр для конкурентів, вірал-потенціал.

---

**23. Marketing channels (zero budget)**

1. **Reddit r/incremental_games** (75K members) — 50–500 players за день від одного посту
2. **itch.io** — безкоштовний хостинг + discovery, тег idle/clicker/business
3. **Hacker News "Show HN"** — якщо є tech angle
4. **TikTok/Shorts** — "From $0 to $1 BILLION in 60 seconds" timelapse
5. **Discord** — свій сервер
6. **DOU.ua, українські Telegram-канали**

---

**24. Readiness checklist**

**itch.io:**
- [ ] 30+ хвилин gameplay без dead zones
- [ ] Prestige відчувається rewarding
- [ ] Offline progress з attractive "welcome back" screen
- [ ] Achievements система (10+)
- [ ] Mobile-responsive
- [ ] 3–5 screenshots + GIF gameplay

**Product Hunt (додатково):**
- [ ] Unique hook в заголовку
- [ ] Social proof: "500+ players on itch.io"
- [ ] 30-секундний demo video
- [ ] Запустити itch.io ПЕРЕД Product Hunt

---

**25. Одна найважливіша зміна (3 речення)**

Додай content depth на перші 30 хвилин гри. Зараз гра порожня після перших 5 покупок — немає нових рішень, нових механік, нових візуальних нагород. Імплементуй achievements (кожні 2–3 хвилини), prestige shop з meaningful choices, і "unlock preview" що показує гравцю ЩО відкриється далі — це перетворить "ще одну idle гру" в гру, яку гравці тримають відкритою і до якої повертаються.

---
---

## Response 2 — AI (з посиланнями)

### Section 1

**1. Психологічні хуки**

Найсильніше — **відчуття постійного приросту**. Гравець має бути майже завжди за 30–90 секунд від нового досягнення.

- **Часті ранні milestones**: "10 кліків", "перший пасивний $/s", "перший менеджер"
- **Visible compounding**: графік доходу що реально "стріляє" вгору
- **Unlock chains**: купив кав'ярню → відкрив supply chain → brand licensing
- **Burst rewards**: "investor call", "viral campaign", "market boom"
- **Progress bars everywhere**: до unlock, до prestige, до event chest
- **Near misses**: "ще 18 секунд до CEO contract"
- **Collection pressure**: закрити весь tier або зібрати тематичний сет

---

**2. 30-хвилинна стіна**

Loop занадто плаский: click → buy → wait → buy → prestige. Нема нових рішень, нових візуальних станів, несподіванок, відчуття "тепер граю інакше".

Критична стіна: клік нецікавий + пасивний дохід недостатній + наступна покупка далека + prestige = покарання = **dead zone**.

---

**3. Prestige redesign**

**Prestige Currency (Influence Points / Legacy Shares)** → meta-tree:
- +X% стартовий капітал
- відкриття менеджерів раніше
- нові business types
- нові random events
- bonus offline earnings

Що змусить хотіти prestige:
- показуй скільки отримаєш ЗАРАЗ vs через 5 хвилин
- milestone rewards на 1-й, 3-й, 5-й, 10-й prestige
- нова мапа / нова ера / новий business vertical
- prestige-only currency
- перші 3–5 хвилин після prestige = ейфорія

---

**4. Daily/Weekly**

- **Daily Briefing**: 3 завдання на день
- **Market Event of the Day**: "Coffee demand +30%", "Tech stocks boom"
- **Login streak**: cash, boosters, cosmetic tokens
- **Weekly challenge run**: "Start from scratch, but restaurants give 5x"
- **Season pass-lite**: 20 безкоштовних steps, 5-10 преміум

---

**5. Social (без бекенду)**

- **Shareable build cards** — encoded URL з параметрами
- **Challenge seeds** — тижневий seed, локальне проходження
- **Screenshot achievements** — "I hit $1B in 47m"
- **Ghost comparison** — URL з benchmark run
- **Score export** — "compare with friends" через share link

---

**6. Бізнес-прогресія (6 епох)**

1. **Hustle Era** — lemonade, coffee cart, food stand
2. **Local Business Era** — café, laundromat, car wash, gym
3. **City Operator Era** — restaurant chain, logistics, ad agency
4. **Corporate Era** — software, biotech, investment fund, telecom
5. **Global Era** — shipping fleet, airline, media network
6. **Post-national / Sci-fi Era** — orbital mining, lunar manufacturing, interplanetary trade

Шлях: самозайнятість → малий бізнес → мережа → корпорація → глобальний капітал → sci-fi absurdity.

---

**7. Upgrade system (3 шари)**

A. **Business-specific:** speed, payout, crit chance, synergy, automation
B. **Global strategic tree:** Operations / Marketing / Finance / Technology
C. **Meta progression:** permanent unlocks після prestige, reroll events

**Synergy sets:**
- Food → boost delivery
- Media → boost всі ad-driven businesses
- Tech → boost automation
- Finance → boost prestige gains

---

**8. Менеджери**

Так. Переводять гру з ручного grind у систему, що живе сама. Мають давати унікальні бонуси:
- **Operations Manager**: авто-збір + faster cycles
- **Brand Manager**: більше burst-event шансів
- **CFO**: кращий prestige exchange
- **CTO**: offline income multiplier

Правило: менеджери не повинні прибирати гру. Вони **переносять фокус** з кліку на стратегію.

---

**9. Visual/Audio**

- Floating income numbers
- Bounce/pulse на кнопці WORK
- Progress bars з smooth fill
- Small particles при великих покупках
- Subtle screen glow при milestones
- Background що змінюється з ростом
- Ticker/news feed: "Your coffee brand is trending"
- М'який click, distinct buy sound, prestige swell

---

**10. Mini-games**

- **Negotiation mini-event**: вибір із 3 ризикових угод раз на кілька хвилин
- **Market timing**: "buy now / wait / hedge" event
- **Spam-click overdrive**: 10 секунд frenzy mode
- **Contract drafting**: реакційна мінігра для bonus payout
- **Investment spin with skill**: контрольований ризик

Фаворит: **90% часу idle, 10% часу короткі decision bursts**.

---

**11. Модель монетизації**

1. **Rewarded ads / opt-in boosts** — найприродніші, гравець сам обирає [Unity]
2. **One-time premium upgrade** — "Golden Briefcase"
3. **Cosmetic purchases**
4. **Supporter pack**

Для itch.io: "pay what you want" [itch.io].

---

**12. Pay-to-win межа**

✅ Fair: прискорює, free player теж може все
❌ Toxic: paywall на automation/prestige, premium-only sectors

Золоте правило: **платіж знімає тертя, а не купує перемогу**.

---

**13. Cosmetic**

- Office/HQ themes
- UI skins: retro terminal, neon finance, luxury boardroom
- Money particle effects
- Custom titles: Founder, Tycoon, Mogul
- Business card / company logo frame
- **"Empire Identity Pack"**: назва холдингу, логотип, accent color, HQ style

---

**14. Mobile**

PWA first, native later. Мінімально: responsive mobile UI, installable PWA, touch-friendly economy screen.

---

**15. Revenue (1000 DAU)**

- Ads: ~$3–$25/день → **$90–$750/міс**
- Ads + supporter + premium (1–3% конверсія): **$300–$1500+/міс**
- Дуже хороший small hit: **$1.5K–$5K/міс** (потребує live продукт)

---

**16. Мінімальний бекенд**

Firebase: Auth (anonymous/Google) + Firestore + Cloud Functions. Firebase Realtime Database заточений під синхронізацію офлайн [Firebase Docs].

---

**17. Структура codebase**

```
/src/core/      — gameLoop, state, saveSystem, economy, time, rng
/src/features/  — businesses, upgrades, prestige, managers, events, offline
/src/ui/        — render, components, animations, audio
/src/data/      — businessesData, upgradesData, balanceConfig
/src/services/  — storageLocal, storageCloud, firebase, shareCode
```

---

**18. Analytics (Top 10 + extras)**

Core: session_start/end, first_click_work, business_purchased, upgrade_purchased, manager_unlocked, prestige_started/completed, offline_claimed, ad_reward_claimed.

Extras: time_to_first_business, time_to_first_prestige, wall_detected, share_clicked.

Google Analytics for Firebase — безкоштовно, до 500 custom events [Firebase Analytics].

---

**19. Offline progress**

- Offline summary screen з деталями по бізнесах
- Random offline events (знайшов інвестора, supply issue, viral brand)
- Choice on return: забрати cash або конвертувати в boost
- Manager reports
- Catch-up multiplier: довго не заходив → перші 5 хв = x2

`base offline income + event roll + return choice + re-entry boost`

---

**20. Технічні ризики**

- localStorage ~5 MiB limit [MDN]
- Cheating: editing save, clock spoofing, console tampering
- No cloud save → немає sync між пристроями
- No trusted leaderboard
- GitHub Pages soft bandwidth limit 100 GB/month [GitHub Docs]
- Performance drift в idle loops на мобілках

---

**21. Target audience**

18–35, mobile-first, casual/mid-casual, session-friendly, daily tasks, soft collection, легкий build-crafting. Смартфони домінують у casual segment [Mordor Intelligence].

---

**22. USP**

Зараз: "ще один економічний idle-клон". Потрібен один з варіантів:
- **A: "Modern Capitalism Simulator"** — sectors, market cycles, investor choices
- **B: "Build a Brand Empire"** — branding, franchising, media synergy
- **C: Lean Solo Founder → Galactic Conglomerate** — наратив + humor + absurd escalation

Вибір: **"сатирична business empire idle про шлях від халтури до міжпланетного капіталу"**.

---

**23. Marketing (zero budget)**

1. itch.io — повна project page, pay-what-you-want [itch.io]
2. Reddit — r/incremental_games, r/indiegames, r/WebGames
3. TikTok/Reels/Shorts — timelapse runs
4. Discord — patch notes, seed challenges, feedback polls
5. Newgrounds
6. Product Hunt — тільки як polished browser product [Product Hunt]

---

**24. Readiness checklist**

**itch.io:** зрозумілий hook за 5 секунд, хороший GIF, mobile-friendly, 60–90 хвилин контенту, save/import, changelog, polish.

**Product Hunt:** installable PWA, унікальний angle, чистий landing, demo video, підготовлений launch.

---

**25. Одна найважливіша зміна**

Перетвори гру з "плоского клікера" у **multi-layer idle system**: prestige відкриває нову meta-гру, бізнеси мають synergy, щоденні market events дають причину повертатися. Потім зроби **mobile-first PWA з polish**. Лише після цього підключай **rewarded monetization + cheap premium** — монетизувати нудну гру неможливо.

---
---

## Response 3 — AI (англомовна)

### Section 1

**1. Psychological Hooks**

- **The "Zeigarnik Effect":** Incomplete tasks create mental tension. Use milestone bars ("90/100 Lemonade Stands to Unlock 2x Speed").
- **Variable Rewards:** Occasional "Market Surges" (5x boost for 30s). Players stare at screen waiting for the next hit.

**2. The 30-Minute Wall**

Players quit when "Time to Next Purchase" exceeds attention span without discovery. A 15-minute idle gap between Coffee Shop and the next tier with nothing new = they leave.

**3. Prestige Redesign**

Give players **Prestige Currency ("Influence")** spent on a permanent tech tree: "Reduce costs 10%", "Unlock Managers", "Start with $500". Choosing makes reset feel like strategic New Game+, not a chore.

**4. Daily/Weekly**

- **"Daily Trade Deal"**: specific business gets 3x boost for 24 hours — forces strategy shift daily.

**5. Social (No Backend)**

- **Exportable "Empire Cards"**: styled image/summary
- **Local Leaderboards**: if multiple players on same machine, Hall of Fame

---

### Section 2

**6. Narrative Progression**

Break into Eras:
1. The Street Corner (Lemonade, Newspaper)
2. Main Street (Coffee, Retail)
3. The Boardroom (Tech Startups, Real Estate)
4. The Moon & Beyond

*Theme: "From a Nickel to a Nebula."*

**7. Upgrade Depth**

**Synergies:** Buying 50 Coffee Shops → 10% boost to Lemonade Stand ("Caffeine Synergy"). Early-game content stays relevant late.

**8. Managers**

Yes, absolutely. Managers shouldn't just automate — they should provide specialized buffs. E.g. "The Accountant" reduces tax/cost.

**9. Visual/Audio**

- Particle Effects: "floating cash" that drifts toward the total
- The "Ding": cash register sound that increases in pitch as you click faster

**10. Mini-games**

- **"Stock Market" Flip**: simple line graph that moves randomly. Buy Low/Sell High. Active, risky, thematic.

---

### Section 3

**11. Ethical Model**

- Rewarded Video Ads: "Watch 30s ad for 4 hours of double income." Player chooses.
- One-time "No Ads" purchase: "The Golden Briefcase."

**12. Pay-to-Progress Balance**

Never sell something only money can buy. Sell "Time Skips." If a player can reach the same goal in 2 days free or 2 minutes for $2 — that's fair.

**13. Cosmetics**

- Office Skins: garage → skyscraper → space station background
- Currency Skins: "$" → "Credits", "Gold", or "Pizza Slices"

**14. Mobile Port**

**PWA is your best friend.** Stays as single HTML/JS, can be "installed" on phone. Unlocks **Push Notifications** ("Your managers made $1M while you were away!") — #1 retention tool.

**15. Revenue (1000 DAU)**

- Ads: ~$10–$20/day (assuming $15 CPM, 1–2 ads/user)
- IAP: ~$30–$50/day (1% conversion at $5 ARPPU)
- **Total: ~$1,200–$2,000/month**

---

### Section 4

**16. Minimum Backend**

Firebase: free for small scale, handles Google Auth + Cloud Firestore with ~20 lines of code.

**17. Code Structure**

Component-based:
- `economy.js` (Math & Logic)
- `ui.js` (DOM Updates)
- `data.js` (Business/Upgrade definitions)
- `main.js` (The Glue)

**18. Analytics (Top 10)**

session_start, business_purchased, upgrade_purchased, prestige_completed, offline_progress_claimed, daily_bonus_claimed, ad_watched, iap_purchased, share_created, wall_detected.

**19. Offline Progress**

- "Your empire earned X while you were away" → animated breakdown by business
- Random offline "mini-events": supply shortage, celebrity endorsement
- Optional: rewarded ad to double offline earnings

**20. Technical Risks (10K+ users)**

- localStorage ~5–10MB limit
- GitHub Pages bandwidth limits for heavy traffic
- No backend = no anti-cheat, no cross-device sync
- Single HTML = cache invalidation headaches on updates

---

### Section 5

**21. Target Audience**

- Age 25–40, white-collar workers playing during commute or lunch
- "One more minute" players who like passive growth
- Fan of business/finance content (Shark Tank, How I Built This podcast)

**22. USP**

Current: just another capitalist clicker.

Options:
- **"Satirical Capitalism Sim"** — parody corporate culture (endless meetings, stock buybacks, layoffs)
- **"Ethical Mogul"** — moral choices affect prestige bonuses
- **"Speedrun Economy"** — compete on time-to-milestones, shareable results

**23. Marketing (Zero Budget)**

1. r/incremental_games — post weekly devlogs
2. itch.io — tag "idle", "clicker", "business", "tycoon"
3. YouTube Shorts — time-lapse of game progression
4. ProductHunt — when polished enough
5. Indie game Discord servers (many have dedicated showcase channels)

**24. Readiness Checklist**

- [ ] 45–60 min of clear progression without hitting a wall
- [ ] At least 3 prestige cycles feel meaningfully different
- [ ] Mobile-responsive layout
- [ ] Compelling "First 5 Minutes" experience
- [ ] Clear call-to-action for sharing/bookmarking
- [ ] Good screenshots for itch.io page

**25. Most Important Change (3 sentences)**

Add a meaningful prestige meta-layer where resetting rewards unlock a skill tree with permanent, strategic upgrades — making each new run feel like a different build path. Without this, players feel reset as pure loss, not a strategic restart. Once the prestige loop is compelling, everything else — monetization, daily quests, social sharing — has something to attach to.

---

## Cross-AI Consensus Summary

| Topic | All 3 models agree |
|-------|--------------------|
| Prestige | Must give currency/tree, not flat multiplier |
| Dead Zone | Bізнеси 5–8, 15–25 хвилин, відсутність рішень |
| Mobile | PWA first, native later |
| Monetization | Rewarded ads + one-time premium |
| Backend | Firebase або Supabase, anonymous auth |
| USP | Потрібен чіткий, зараз відсутній |
| Marketing | itch.io + r/incremental_games як пріоритет 1 |
| One change | Prestige meta-layer + depth в перших 30 хвилинах |

---

*Responses collected 2026-03-16. Game version v1.0.0*
