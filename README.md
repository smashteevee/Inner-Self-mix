<p align="center">
  <img src="https://raw.githubusercontent.com/LewdLeah/Inner-Self/main/assets/cover1.png" width="800">
</p>

# Inner Self 🎭
### *Giving characters minds of their own~*
Made by LewdLeah ❤️

---

## Overview

Inner Self is an AI Dungeon mod that grants memory, goals, secrets, planning, and self-reflection capabilities to the characters living in your story. Simulated agents build and maintain their own minds to learn from experiences, form opinions, and adapt their behavior over time. Inner Self provides the AI with the tools it needs to truly embody characters, allowing them to feel more alive and nuanced over long adventures.

In some ways this is the spiritual successor to [Auto-Cards](https://github.com/LewdLeah/Auto-Cards), which is already included with Inner Self and can be enabled at any time.

---

## Main Features

| Feature | Description |
|:--------|:------------|
| **Segmented Memory** | Each NPC maintains their own private thoughts, separate from other characters |
| **Self-Organizing Thoughts** | Characters agentically revise, prune, and maintain their own mental state |
| **Zero Immersion Breaks** | Absolutely NO "please select continue" messages (!!!) |
| **Real-Time Brain Editor** | View or edit any NPC brain in the associated story card notes |
| **Name-Based Triggers** | Different NPCs coexist seamlessly, activating when mentioned in the story |
| **Visual Indicators** | See exactly which character is thinking at any given moment |
| **Universal Compatibility** | General-purpose design works across diverse character archetypes and scenarios |
| **Auto-Cards Integration** | Fully merged for comprehensive world-building (optional) |
| **SCE Integration** | Story Card Extension runs alongside Inner Self for smart card recall and events |
| **SIS Integration** | Stackable Inventory System adds slash-command inventory management to any scenario |

### SCE (Story Card Extension) Features

[SCE](https://github.com/Kenflesh/SCE-Story-Card-Extension) is integrated into Inner Self and runs automatically. It enhances story cards with:

| Feature | Description |
|:--------|:------------|
| **Context Recall** | Cards auto-trigger based on keyword similarity to recent story text — no trigger words needed |
| **Parent Hierarchies** | Link cards (e.g. City → Tavern) so related cards surface together |
| **Events** | Cards marked as "Event" type fire at random with configurable chance and duration |
| **Always Include** | Pin specific cards into context every turn (more reliable than Plot Essentials) |
| **Random Cards** | Optionally inject a random card each turn to spark unexpected story directions |
| **Weighted Selection** | Add `weight=2` to a card's triggers to make it appear more (or less) often |

### SIS (Stackable Inventory System) Features

[SIS](https://better-repository.netlify.app/scripts) by bottledfox is integrated and active automatically. It gives players a live story card that tracks items and currency:

| Feature | Description |
|:--------|:------------|
| **Slash Commands** | `/take`, `/use`, `/drop`, `/give`, `/throw`, `/collect`, `/undo` — typed in Do mode |
| **Auto-stacking** | Items of the same name are stacked with a count (e.g., `- Iron Sword x 3`) |
| **Wallet** | Currency collected via `/collect [amount] [currency]` is tracked separately |
| **Rules Gate** | When adding items, a quick AI check ensures they are obtainable before confirming |
| **Custom Commands** | Add your own add/remove commands via the "Custom Commands" story card |
| **Undo** | `/undo` reverses the last inventory or wallet action |
| **Item Cap** | Each item is capped at 99 copies to prevent runaway accumulation |

**Story cards created automatically:** "Inventory" (shows wallet + item list) and "Custom Commands" (define extra slash commands).

**Command syntax:**
```
/take [amount] itemName       — pick up items (gated by AI rules check)
/use itemName                 — consume one item from inventory
/drop [amount] itemName       — remove items (or currency) from inventory
/give [amount] itemName to X  — give items/currency to a target
/throw [amount] itemName at X — throw items/currency
/collect [amount] currency    — add currency to wallet (gated by AI rules check)
/undo                         — undo last inventory or wallet change
```

---

## Permission

Inner Self is both free and open-source for anyone to use in their own scenarios or scripts, even published ones. You have my full permission to use, copy, or modify Inner Self. Please enjoy! ❤️

---

## Scenario Script Install Guide
1. Use the [AI Dungeon website](https://aidungeon.com/) on PC (or view as desktop if mobile-only)
2. [Create a new scenario](https://help.aidungeon.com/faq/what-are-scenarios) or edit an existing scenario
3. Open the `DETAILS` tab at the top while editing your scenario
4. Scroll down to `Scripting` and toggle ON → `Scripts Enabled`
5. Select `EDIT SCRIPTS`
6. Select the `Input` tab on the left
7. Delete all code within said tab
8. Copy and paste the following code into your empty `Input` tab:
```javascript
// Your "Input" tab should look like this

// SIS: Ensure Inventory and Custom Commands cards exist on first load
(function initCardsOnce() {
    if (typeof ensureInventoryCard === "function") ensureInventoryCard();
    if (typeof ensureCustomCommandCard === "function") ensureCustomCommandCard();
})();

InnerSelf("input");
const modifier = (text) => {
  // SIS: intercept slash commands before passing text to the AI
  const reply =
    handleCollectCommand(text) || handleCustomCommand(text) ||
    handleDropCommand(text) || handleGiveCommand(text) ||
    handleTakeCommand(text) || handleThrowCommand(text) ||
    handleUndoCommand(text) || handleUseCommand(text);
  if (reply) return { text: reply };

  // Any other input modifier scripts can go here
  return { text };
};
modifier(text);
```
9. Select the `Context` tab on the left
10. Delete all code within said tab
11. Copy and paste the following code into your empty `Context` tab:
```javascript
// Your "Context" tab should look like this
InnerSelf("context");
const modifier = (text) => {
  // Any other context modifier scripts can go here
  text = StoryCardExtensionContext(text);
  return { text, stop };
};
modifier(text);
```
12. Select the `Output` tab on the left
13. Delete all code within said tab
14. Copy and paste the following code into your empty `Output` tab:
- [Output code](./src/output.js)
15. Select the `Library` tab on the left
16. Delete all code within said tab
17. Open the Library code (hyperlink below) in a new browser tab
- [Library code](./src/library.js)
18. Copy the *full* code from the page above and paste into your empty `Library` tab
19. Click the big yellow `SAVE` button in the top right corner

### *And you're done!*

All adventures played from your scenario will now include Inner Self (even existing adventures)

<sub>Remember to read the in-game config card!</sub>

---

## Gameplay Tips

- Read the in-game config card to learn how to easily add NPCs
- Set response length to 200 tokens if you notice short or empty outputs
- Enable scripts if you don't see a config card (homepage > settings > gameplay)
- Protect your mental health: Inner Self is intended to be a narrative experience only
- Plot components matter because the AI sees them when writing thoughts
- Different story models also tend to manage brains differently
- But avoid Atlas and Raven models for this one 😅

---

## For Creators

### Creator Control Panel
At the very top of the Inner Self `Library` script tab, you'll find optional settings with simple explanations. Modify these before publishing to customize your scenario's default experience.

### SCE Configuration
When the adventure starts, a story card called **"SCE Config"** will be created automatically. All SCE settings are managed through it. You can also edit the default values at the top of the `Library` script (the `DEFAULT_CONFIG` block, near the `// StoryCard Extension` section header).

<details>
<summary><b>SCE default config values (click to expand)</b></summary>

```javascript
const DEFAULT_CONFIG = {
  randomCardChance: 0.0,       // Chance each turn a random story card is injected
  randomEventChance: 0.05,     // Chance each turn an Event card fires (5%)
  useOnlyAutouseCards: false,  // true = only cards with "autouse" in Triggers are used
  eventDuration: 2,            // How many turns an Event stays in context
  useEventWeights: true,       // Respect weight= triggers for event selection
  useCardWeights: true,        // Respect weight= triggers for random card selection
  contextRecallEnabled: true,  // Master switch for keyword-based recall
  contextRecallThreshold: 0.05,// Minimum match score for a card to be recalled
  contextWindowChars: 10000,   // Recent story characters scanned for keywords
  contextRecallMaxCards: 5,    // Max cards/hierarchies recalled per turn
  recallInsertPosition: "bot", // "top" or "bot" — where recalled cards are injected
  recallDecayRate: 0.995,      // Weight decay for older context tokens (1.0 = no decay)
  cascadeEnabled: false,       // Iterative recall expansion for deeper card chains
  cascadePriorityMultiplier: 1.3, // Score boost for descendants of already-recalled cards
  alwaysIncludeCards: [],      // Card titles always injected every turn
  customStopWords: [],         // Words to ignore during keyword matching
};
```

**Key setting:** Set `useOnlyAutouseCards: true` if you want precise control — only cards with `autouse` written in their Triggers field will be used by SCE.

</details>

<details>
<summary><b>SCE card trigger syntax (click to expand)</b></summary>

Write triggers in the **Keys / Triggers** field of any story card:
- `autouse` — marks the card for SCE (required when `useOnlyAutouseCards = true`)
- `weight=2` — make SCE pay twice as much attention to this card
- `weight=0` — exclude this card from SCE entirely
- `parent=CityName` — attach this card to a parent card (builds hierarchy chains)
- `event=10` — override event duration to 10 turns for this specific Event card

Example triggers field: `autouse weight=1.5 parent=Kingdom of Larion`

</details>

### Preparing Scenario NPCs
To work on its own, provide Inner Self with the names of your scenario's most important NPCs. Inner Self will create a new brain card for each NPC you prepare, after their name appears in the story. (Kinda like story card triggers, if that makes sense!) Brains are created on-demand to avoid overwhelming players.

Creators provide Inner Self with scenario NPC names in one of two ways:

<details>
<summary><b>regular method (click to expand)</b></summary>

In the creator control panel near the top of your `Library` script tab:
```javascript
// List the first name of every scenario NPC whose brain should be simulated by Inner Self:
IMPORTANT_SCENARIO_CHARACTERS: ""
// (write a comma separated list of names inside the "" like so: "Leah, Lily, Lydia")
```
Simply list your NPC names inside the quotations. Then click the yellow `SAVE` button!

</details>

<details>
<summary><b>alternative method for mobile creators (click to expand)</b></summary>
  
Prefix regular AID story card titles with the `@` symbol so Inner Self knows which characters should think:
- Example card name: `@Leah`
- Remember to use simple first names here!
- This method is easier on mobile

</details>

### Custom NPC Brains
Inner Self uses the full context of your scenario to form minds that follow your creative vision. No extra effort required.

But if you want more advanced control:

<details>
<summary><b>initial thoughts (click to expand)</b></summary>
  
1. Transfer any NPC brain card from adventure to scenario
2. Leave the card entry completely empty
3. Replace the notes section with any valid string-valued JSON
4. Feel free to use an AI assistant to transform your concept into valid JSON by filling out the prompt below:
````markdown
# You are a JSON generator:
- Always reply with valid JSON only, no extra text
- Base your output on the instructions provided
- Do not include comments or explanations

## Overarching setting:
```
[Describe the setting of your scenario here!]
```

## Fictional character concept:
```
[Describe your character concept here!]
```

## Task instructions:
Your task is to transform the character concept into a JSON object
- The object should resemble a flat collection of key-value pairs
- All values are strings written from the character's inner 1st person PoV
- Values should be short single-sentence thoughts that capture core aspects
- Keys use distinct and descriptive lower snake_case syntax
- The object represents the character's identity of self
- Be creative when roleplaying as the character
- Respect the overarching setting
````

</details>

---

## Useful Links

<details>
<summary><b>(click to expand)</b></summary>

### Basic Demo Scenario
- [Inner Self](https://play.aidungeon.com/scenario/tsu1WMJXaaAZ/inner-self)

### Discussion Thread
- [Inner Self main thread](https://discordapp.com/channels/903327676884979802/1455232694379221165)
- [AI Dungeon official Discord server invite](https://discord.gg/MXNqpSbuZT) (required to access the first link)
- Please remember this is a personal passion project for me, something I do because I enjoy it, not as a job. Your kindness, patience, and love mean so much to me~ ❤️

</details>

---

## Changelog

<details>
<summary><b>(click to expand)</b></summary>

### 1.0.2
- Added config "Brain card notes store brains as JSON"
- When disabled, brain card notes use a simpler colon + newline delimited format instead of JSON
- Makes it much easier to manually edit NPC thoughts without accidentally breaking syntax
- Backward and forward compatible; both formats are safe during parsing
- Pull request by [dirtymined13](https://github.com/dirtymined13)

### 1.0.1
- Added config "Half thought chance for Do/Say/Story"
- Lets players decide if the thought formation chance should be reduced by half during Do/Say/Story turns
- This reduction was previously mandatory in v1.0.0, to help enforce player agency when using free models
- Pull request by [-Vinny-](https://play.aidungeon.com/profile/-Vinny-)

### 1.0.0
- Inner Self released!

</details>

---

## Contributions

<details>
<summary><b>(click to expand)</b></summary>

- v1.0.1 → v1.0.2 by [dirtymined13](https://github.com/dirtymined13)
- v1.0.0 → v1.0.1 by [-Vinny-](https://play.aidungeon.com/profile/-Vinny-)

</details>

<p align="center"><i>Thank you so much for your curiosity and support~</i> ❤️</p>
<p align="center"><b>Inner Self v1.0.2</b> · Made with love by <a href="https://play.aidungeon.com/profile/LewdLeah">LewdLeah</a></p>
