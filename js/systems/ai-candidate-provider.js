/* ═══════════════════ AI Candidate Provider Registry ═══════════════════
 * Utility AI only knows how to collect, score and choose candidates.
 * Domain systems provide candidates through this registry.
 */
const AiCandidateProviderSystem = (() => {
  const providers = [];

  function register(provider) {
    if (!provider?.id || typeof provider.provide !== 'function') return false;
    const idx = providers.findIndex(p => p.id === provider.id);
    if (idx >= 0) providers[idx] = provider;
    else providers.push(provider);
    providers.sort((a, b) => (a.order || 100) - (b.order || 100));
    return true;
  }

  function clear() {
    providers.length = 0;
  }

  function makeStats() {
    return { checked: 0, accepted: 0, rejected: {} };
  }

  function makeContext(c, extra = {}) {
    const providerStats = {};
    const statFor = id => {
      if (!providerStats[id]) providerStats[id] = makeStats();
      return providerStats[id];
    };
    return {
      char: c,
      accessible: extra.accessible || null,
      near: extra.near || null,
      diagnostics: extra.diagnostics || {},
      stats: providerStats,
      check(providerId, count = 1) {
        statFor(providerId).checked += count;
      },
      accept(providerId, row, out) {
        const stat = statFor(providerId);
        stat.accepted++;
        row.provider = row.provider || providerId;
        out.push(row);
      },
      reject(providerId, reason) {
        const stat = statFor(providerId);
        stat.rejected[reason] = (stat.rejected[reason] || 0) + 1;
      },
    };
  }

  function collect(c, extra = {}) {
    const ctx = makeContext(c, extra);
    const rows = [];
    for (const provider of providers) {
      if (provider.enabled && !provider.enabled(c, ctx)) continue;
      try {
        provider.provide(c, ctx, rows);
      } catch (err) {
        ctx.reject(provider.id, 'provider_error');
        console.warn(`[AI Provider] ${provider.id} failed`, err);
      }
    }
    return { rows, ctx };
  }

  function list() {
    return providers.map(p => ({ id: p.id, order: p.order || 100 }));
  }

  return { register, clear, collect, list };
})();

window.AiCandidateProviderSystem = AiCandidateProviderSystem;
