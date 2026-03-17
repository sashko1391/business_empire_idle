# Business Empire Idle — Game Design Document

## Концепція

Idle-клікер про побудову бізнес-імперії. Гравець починає з кіоска з лимонадом у гаражі і поступово розростається до міжпланетної торгівлі. Гра автоматично заробляє гроші навіть поки гравець відсутній.

---

## Ігровий цикл

```
Клік → Гроші → Купити бізнес → Пасивний дохід → Більше грошей
                                     ↓
                             Апгрейди, синергії
                                     ↓
                             Досягнути $1M → Престиж
                                     ↓
                             RP → Магазин престижу → Бонуси назавжди
```

---

## Бізнеси (13 рівнів)

| # | Назва | Іконка | Базова ціна | Дохід/с | Вимога розблокування |
|---|-------|--------|-------------|---------|----------------------|
| 1 | Lemonade Stand | 🍋 | $10 | $1 | — |
| 2 | Coffee Shop | ☕ | $100 | $5 | $50 |
| 3 | Small Restaurant | 🍽️ | $1,000 | $25 | $500 |
| 4 | Food Delivery Service | 🛵 | $5,000 | $100 | $2,000 |
| 5 | Fitness Club | 💪 | $13,000 | $200 | $8,000 |
| 6 | Car Wash Network | 🚗 | $25,000 | $450 | $15,000 |
| 7 | IT Company | 💻 | $100,000 | $1,500 | $50,000 |
| 8 | Media Agency | 📱 | $500,000 | $5,000 | $200,000 |
| 9 | Private Bank | 🏦 | $2,000,000 | $15,000 | $1M + Prestige 1 |
| 10 | Real Estate Empire | 🏙️ | $10,000,000 | $50,000 | $5M + Prestige 1 |
| 11 | Investment Fund | 📊 | $50,000,000 | $200,000 | $25M + Prestige 2 |
| 12 | Space Mining Corp | ⛏️ | $500,000,000 | $1,000,000 | $100M + Prestige 3 |
| 13 | Interplanetary Trade | 🚀 | $5,000,000,000 | $10,000,000 | $1B + Prestige 4 |

Ціна кожної наступної одиниці одного бізнесу зростає на **×1.15**.

Кожен бізнес має свою сцену (зображення), яку можна відкрити натиснувши 👁.

---

## Синергії

Якщо гравець має обидва бізнеси з пари — обидва отримують бонус до доходу:

| Пара | Назва | Бонус |
|------|-------|-------|
| Lemonade + Coffee | Caffeine Hustle | +20% |
| Restaurant + Delivery | Full Service | +25% |
| Fitness + Car Wash | Clean & Fit | +15% |
| IT + Media | Digital Empire | +30% |
| Bank + Fund | Finance Titan | +35% |
| Real Estate + Bank | Property Mogul | +25% |
| Space Mining + Interplanetary | Galactic Corp | +40% |
| IT + Fund | Tech Finance | +20% |

---

## Апгрейди (10 штук)

| Назва | Ефект | Ціна |
|-------|-------|------|
| Better Tools | +$1/с пасивного доходу | $25 |
| Second Worker | +$2/с пасивного доходу | $75 |
| Basic Advertising | +10% глобального доходу | $200 |
| Coffee Machine | Coffee Shop ×2 доходу | $500 |
| Ergonomic Chair | +1 до кліку | $150 |
| Delivery Van | +$5/с пасивного доходу | $1,000 |
| Franchise Deal | Lemonade/Coffee/Restaurant +15% | $3,000 |
| Auto Cashier | Авто-клік кожні 2 секунди | $5,000 |
| Viral Marketing | +20% до доходу від кліку | $2,500 |
| Night Shift | +10% офлайн-доходу | $4,000 |

---

## Клік і комбо

- Базова сила кліку: **$1** (зростає з апгрейдами та в магазині престижу)
- **Комбо-система**: 5 кліків за 3 секунди → ×2; 10 кліків → ×5
- Кнопка WORK еволюціонує залежно від прогресу:

| Умова | Назва кнопки |
|-------|--------------|
| Початок | 💪 WORK |
| $1,000+ зароблено | 💪 Hustle Hard |
| $10,000+ | 📋 Run Operations |
| $100,000+ | 🤝 Sign Client |
| $1,000,000+ | 🚀 Launch Campaign |
| Prestige 1+ | 💼 Close Deal |
| Prestige 2+ | 📈 Move Markets |
| Prestige 3+ | 🏢 Run Corporation |
| Prestige 4+ | 🌌 Dominate Galaxy |

---

## Система престижу

- **Вимога**: зароблено $1,000,000 сукупно
- **Нагорода**: Reputation Points (RP) = `floor(sqrt(totalEarned / 1_000_000))`
- **Ефект**: ×1.5 до доходу за кожен рівень (`1 + level × 0.5`)
- Після престижу: гроші та бізнеси скидаються, але досягнення й придбані бонуси зберігаються

### Магазин престижу (RP витрачаються назавжди)

| Апгрейд | Ефект | Ціна |
|---------|-------|------|
| Income Boost I → III | +25% / +50% / +100% доходу | 1 / 3 / 7 RP |
| Head Start I → II | Старт з $1,000 / $25,000 | 1 / 3 RP |
| Click Power I → II | +2 / +5 до базового кліку | 1 / 2 RP |
| Night Owl | +50% офлайн-доходу | 2 RP |
| Bulk Buyer | -10% вартість бізнесів | 2 RP |
| Upgrade Expert | -20% вартість апгрейдів | 2 RP |
| Operations Manager | Авто-купує найдешевший бізнес кожні 30с | 3 RP |
| Brand Manager | +5% доходу за кожен рівень престижу | 4 RP |
| CFO | +10% RP при наступному престижі | 5 RP |
| CTO | Авто-купує апгрейди кожні 60с | 5 RP |

---

## Щоденна система

Кожен день (по UTC) оновлюється:

### Щоденна подія
Випадкова подія, що діє весь день:

| Подія | Ефект |
|-------|-------|
| Market Boom | Весь дохід +50% |
| Rush Hour | Їжа ×2 |
| Tech Surge | IT & Media +75% |
| Finance Day | Bank & Fund +80% |
| Click Frenzy | Клік ×3 |
| Cost Freeze | Ціни бізнесів -25% |
| Viral Moment | Весь дохід +25% |
| Space Race | Космос ×2.5 |
| Gym Trend | Fitness ×2 |
| Property Boom | Real Estate +90% |
| Lucky Stars | Весь дохід +35% |

### Щоденні контракти (3 штуки)
Цілі на день: заробити $2,000 / зробити 50 кліків / купити 3 бізнеси / купити 3 апгрейди. Виконання показується тостом.

---

## Інвестиції

Кожні ~3 хвилини з'являється пропозиція вкласти поточний баланс:

| Інструмент | Ризик | Шанс виграшу | При виграші | При програші |
|-----------|-------|--------------|-------------|--------------|
| Safe Bond | Низький | 85% | +30% | -5% |
| Stock Market | Середній | 65% | ×2 | -30% |
| Crypto Bet | Високий | 45% | ×3.5 | -50% |
| Real Estate Deal | Низький | 80% | +50% | -10% |
| Startup Venture | Високий | 40% | ×5 | -60% |
| Gold Reserve | Дуже низький | 90% | +20% | -2% |

---

## Офлайн-прогрес

- Максимум **8 годин** офлайн-доходу зараховується
- Якщо гравець відсутній більше 30 секунд — при поверненні показується модалка з заробленою сумою
- Бонус Night Owl (апгрейд престижу) підвищує офлайн-коефіцієнт ×1.5

---

## Досягнення (23 штуки)

Категорії: кліки, покупки бізнесів, заробіток, апгрейди, престиж, специфічні бізнеси, дохід/с.

Ключові:
- 👆 First Steps → 💪 Hard Worker → 🏋️ Workaholic (1 / 100 / 1,000 кліків)
- 🏪 Entrepreneur → 🏬 Business Owner → 🏙️ Tycoon (1 / 3 / 13 бізнесів)
- 💵 First Thousand → 💰 Millionaire → 💎 Billionaire
- ⭐ Prestige! → 🌟 Legacy Builder (1 / 5 престижів)
- 🍋 Lemon Empire, ☕ Coffee Baron (10 одиниць конкретного бізнесу)
- 🏦 Banker, 🚀 Space Pioneer (перша одиниця банку / космосу)
- 📈 Income Machine ($1,000/с) → 🏢 Mega Corporation ($1,000,000/с)

---

## Фони (за епохами)

| Стадія | Умова | Візуал |
|--------|-------|--------|
| Early | Початок гри | Фото гаражу (background_1.png) |
| Mid | $100K+ або Prestige 1+ | Темно-синій офіс з сіткою |
| Endgame | $10M+ або Prestige 2+ | Золото-фіолетовий пентхаус з пульсацією |

Перехід між стадіями — плавний fade 1.2 секунди.

---

## Конфеті

Конфеті (80 частинок, canvas) вибухає при:
- Досягненні мілстоунів: $1K / $10K / $100K / $1M / $1B
- Престижі

---

## Новинна стрічка

Ротація ринкових новин кожні 5 секунд у вкладці Businesses. Фільтрується за стадією:
- До $1K: 6 новин
- До $1M: 12 новин
- Далі: всі 18 новин

---

## Технічний стек

- **SvelteKit 2** + Svelte 5 Runes (`$state`, `$derived`, `$effect`)
- **TypeScript**
- `@sveltejs/adapter-static` → GitHub Pages
- `svelte/motion`: `tweened` (лічильник грошей), `spring` (кнопка WORK)
- `svelte/transition`: `fly`, `fade`
- Canvas API (конфеті)
- LocalStorage (збереження)
- Service Worker (PWA-кеш)

---

## Структура файлів

```
src/
  lib/
    data/
      businesses.ts   — 13 бізнесів
      upgrades.ts     — 10 апгрейдів + ефекти
      prestige.ts     — 14 позицій магазину
      achievements.ts — 23 досягнення
      synergies.ts    — 8 синергій
      daily.ts        — події / контракти / інвестиції
    store.svelte.ts   — весь ігровий стан і логіка
    format.ts         — formatNumber
    audio.ts          — звуки
    types.ts          — TypeScript-типи
  components/
    GameBackground.svelte   — фони з epoch-переходами
    Header.svelte           — tweened лічильник грошей
    WorkButton.svelte       — spring + combo + еволюційний лейбл
    BusinessCard.svelte     — glassmorphism + fly + progress bar
    UpgradeCard.svelte
    DailyPanel.svelte       — подія дня + контракти
    SceneModal.svelte       — full-screen сцена бізнесу
    InvestmentModal.svelte  — пропозиція інвестиції
    OfflineModal.svelte     — офлайн-заробіток
    AchievementToast.svelte — toast-повідомлення
    NewsTicker.svelte       — ринкова стрічка
    Confetti.svelte         — canvas-конфеті
  routes/
    +page.svelte   — головна сторінка (4 вкладки)
    +page.ts       — ssr: false, prerender: true
```
