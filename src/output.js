// Your "Output" tab should look like this

// SIS: Gate parser — reads the raw AI output to capture APPROVE/REJECT verdict
// before Inner Self or the modifier process the text.
(function parseGate() {
    try {
        if (!state?.vars) return;

        // Check if ANY kind of gate is currently pending (wallet, inventory, or legacy flag)
        const pending = !!(state.vars.awaitingGate || state.vars.awaitingMoneyGate || state.vars.awaitingInvGate);
        if (!pending) return;

        // Look for a single-line verdict "APPROVE" or "REJECT" in the model's output
        const rxVerdict = /^\s*(APPROVE|REJECT)\s*$/im;
        const m = String(text || "").match(rxVerdict);
        if (!m) return;

        // Store the verdict and mark the unified flag resolved.
        state.vars.lastGateVerdict = m[1].toUpperCase();
        state.vars.awaitingGate = false;

        // Clear the temporary system prompt from frontMemory once verdict is captured.
        if (state?.memory) state.memory.frontMemory = "";
    } catch { }
})();

InnerSelf("output");
const modifier = (text) => {
  // SIS + Stats: Ensure all state and story cards are present each turn.
  ensureInventoryState();
  ensureInventoryCard();
  ensureCustomCommandCard();
  ensureStatsCard();

  // SIS: Auto-clear a stuck gate after 2 turns without a verdict.
  // Free-tier models may not reliably output APPROVE/REJECT; without this,
  // state.vars.awaitingGate stays true forever and blocks all future commands.
  try {
    if (state?.vars?.awaitingGate &&
        typeof state.vars.gateStartedAt === "number" &&
        typeof info !== "undefined" &&
        info.actionCount > state.vars.gateStartedAt + 2) {
      state.vars.lastGateVerdict = "REJECT";
      state.vars.awaitingGate = false;
      if (state?.memory) state.memory.frontMemory = "";
    }
  } catch { }

  // SIS: Finalize gated operations depending on kind of gate (wallet vs inv)
  try {
    const kind = state?.vars?.gateKind || null;
    const verdict = state?.vars?.lastGateVerdict || null;

    if (kind && verdict) {
      // Wallet gate finalization
      if (kind === "wallet") {
        const p = state?.vars?.pendingCollect || null;
        if (p && p.currency && p.amount > 0) {
          if (verdict === "APPROVE") {
            const r = addToWallet(p.currency, p.amount);
            if (r?.ok && typeof rebuildInventoryCardFromState === "function") {
              rebuildInventoryCardFromState();
            }
            recordInventoryAction("wallet_add", p.currency, p.amount, "collect");
            const msg = `You collected ${p.amount} ${p.currency}.`;
            text = msg + (text ? `\n\n${text}` : "");
          } else {
            const msg = `You failed to collect ${p.amount} ${p.currency}.`;
            text = msg + (text ? `\n\n${text}` : "");
          }
        }
        state.vars.pendingCollect = null;
        removeGateText();
        clearUnifiedGate();

      // Inventory gate finalization
      } else if (kind === "inv") {
        const p = state?.vars?.pendingAdd || null;
        if (p && p.itemName) {
          if (verdict === "APPROVE") {
            const r = addToInventoryCapped(p.itemName, p.amount);
            if (r.added > 0 && typeof rebuildInventoryCardFromState === "function") {
              rebuildInventoryCardFromState();
            }
            if (r.added > 0) {
              recordInventoryAction("add", p.itemName, r.added, p.cmdName);
            }
            let msg = (r.added === 1)
              ? `You ${p.verb || "add"} ${p.itemName}, adding it to your inventory.`
              : `You ${p.verb || "add"} ${r.added} × ${p.itemName}, adding them to your inventory.`;
            if (r.blocked > 0) msg += ` (inventory cap ${r.cap}; ${r.blocked} couldn't fit)`;
            text = msg + (text ? `\n\n${text}` : "");
          } else {
            const failVerb = p.verb || "add";
            const fail = `You fail to ${failVerb} ${p.itemName} × ${p.amount} to your inventory.`;
            text = fail + (text ? `\n\n${text}` : "");
          }
        }
        state.vars.pendingAdd = null;
        clearUnifiedGate();
      }
    }
  } catch { }

  // SIS: Strip leftover "APPROVE"/"REJECT" lines from the visible output.
  text = String(text || "").replace(/^\s*(APPROVE|REJECT)\s*$/gim, "").trim();

  // SIS: On the very first turn, blank out the model's intro output once.
  if (info.actionCount === 0 && !state.suppressedIntro) {
    text = '';
    state.suppressedIntro = true;
  }

  // Any other output modifier scripts can go here
  return { text };
};
modifier(text);
