// Your "Input" tab should look like this

// SIS + Stats: Ensure system cards exist on first load
(function initCardsOnce() {
    if (typeof ensureInventoryCard === "function") ensureInventoryCard();
    if (typeof ensureCustomCommandCard === "function") ensureCustomCommandCard();
    if (typeof ensureStatsCard === "function") ensureStatsCard();
})();

InnerSelf("input");
const modifier = (text) => {
  // SIS + Stats: intercept slash commands before passing text to the AI
  const reply =
    handleStatCommand(text) ||   // /stat (no-gate stat tracking)
    handleCollectCommand(text) || // /collect (adds currency to wallet)
    handleCustomCommand(text) ||  // dynamic commands from "Custom Commands" card
    handleDropCommand(text) ||    // /drop (removes items from inventory)
    handleGiveCommand(text) ||    // /give (gives items to target)
    handleTakeCommand(text) ||    // /take (adds items to inventory)
    handleThrowCommand(text) ||   // /throw (throw an item from your inventory)
    handleUndoCommand(text) ||    // /undo (undo an inventory/wallet action)
    handleUseCommand(text);       // /use (consumes an item to perform an action)
  if (reply) return { text: reply };

  // Any other input modifier scripts can go here
  return { text };
};
modifier(text);
