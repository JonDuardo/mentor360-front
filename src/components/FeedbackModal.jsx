import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../lib/api";

/**
 * FeedbackModal
 * Mostra 3 notas (Tom, Memória, NPS) + Sim/Não + texto livre.
 * Textos escolhidos: 1C; 2A; 3B; 4B; 5B; 6A.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void                 // fecha/pula sem enviar
 * - onSubmitted?: (payload, resp) => void
 * - userId: string
 * - sessaoId: string
 * - ambiente: 'beta' | 'prod'
 * - modeloAi?: string
 * - versaoApp?: string
 * - motivoGatilho?: string              // default: 'intervalo_sessoes'
 */
export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmitted,
  userId,
  sessaoId,
  ambiente = "beta",
  modeloAi,
  versaoApp,
  motivoGatilho,
}) {
  const [tom, setTom] = useState(null);           // 1..10
  const [memoria, setMemoria] = useState(null);   // 1..10
  const [nps, setNps] = useState(null);           // 0..10
  const [atingiu, setAtingiu] = useState(null);   // true|false|null
  const [sugestao, setSugestao] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const canSend = useMemo(() => {
    // exigimos preencher as 3 notas; o boolean pode ser nulo
    return (
      isOpen &&
      userId &&
      sessaoId &&
      ambiente &&
      Number.isInteger(Number(tom)) &&
      Number.isInteger(Number(memoria)) &&
      Number.isInteger(Number(nps))
    );
  }, [isOpen, userId, sessaoId, ambiente, tom, memoria, nps]);

  useEffect(() => {
    if (!isOpen) {
      // limpa estado ao fechar
      setTom(null);
      setMemoria(null);
      setNps(null);
      setAtingiu(null);
      setSugestao("");
      setSending(false);
      setErr("");
    }
  }, [isOpen]);

  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape" && isOpen && !sending) onClose?.();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, sending, onClose]);

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (!canSend || sending) return;
    setSending(true);
    setErr("");

    const payload = {
      user_id: userId,
      sessao_id: sessaoId,
      ambiente: String(ambiente).toLowerCase(),
      nota_tom_rapport: Number(tom),
      nota_memoria: Number(memoria),
      nps: Number(nps),
      atingiu_objetivo: typeof atingiu === "boolean" ? atingiu : null,
      sugestao: sugestao?.trim() || null,
      modelo_ai: modeloAi || null,
      versao_app: versaoApp || null,
      motivo_gatilho: motivoGatilho || "intervalo_sessoes",
    };

    try {
      const r = await fetch(apiUrl("/feedback/sessao"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(data?.erro || data?.error || "Falha ao enviar feedback");
      }
      onSubmitted?.(payload, data);
      onClose?.();
    } catch (e) {
      setErr(e.message || "Falha ao enviar feedback.");
    } finally {
      setSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal} role="dialog" aria-modal="true" aria-label="Feedback rápido">
        <header style={styles.header}>
          <h3 style={styles.title}>Ajude a melhorar (leva ~10s).</h3>
        </header>

        <form onSubmit={handleSubmit} style={styles.body}>
          {/* 1) Tom e rapport — 1C */}
          <fieldset style={styles.fieldset}>
            <label style={styles.label}>
              O estilo da conversa combinou com você?
              <span style={styles.anchors}>1 não combinou · 10 combinou muito</span>
            </label>
            <Slider value={tom} onChange={setTom} min={1} max={10} />
          </fieldset>

          {/* 2) Memória — 2A */}
          <fieldset style={styles.fieldset}>
            <label style={styles.label}>
              O app lembrou bem do seu contexto e decisões anteriores?
              <span style={styles.anchors}>1 não lembrou · 10 lembrou muito bem</span>
            </label>
            <Slider value={memoria} onChange={setMemoria} min={1} max={10} />
          </fieldset>

          {/* 3) NPS — 3B */}
          <fieldset style={styles.fieldset}>
            <label style={styles.label}>Você recomendaria o Mentor Tríade?</label>
            <div style={styles.npsWrap}>
              {Array.from({ length: 11 }).map((_, idx) => {
                const val = idx; // 0..10
                const active = Number(nps) === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setNps(val)}
                    aria-label={`NPS ${val}`}
                    style={{
                      ...styles.chip,
                      ...(active ? styles.chipActive : null),
                    }}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
            <div style={styles.npsAnchors}>
              <span>0 não recomendaria</span>
              <span>10 recomendaria com certeza</span>
            </div>
          </fieldset>

          {/* 4) Atingiu objetivo — 4B */}
          <fieldset style={styles.fieldset}>
            <label style={styles.label}>Esta sessão te ajudou a avançar no que queria?</label>
            <div style={{ display: "flex", gap: 12 }}>
              <label style={styles.radioLbl}>
                <input
                  type="radio"
                  name="atingiu"
                  checked={atingiu === true}
                  onChange={() => setAtingiu(true)}
                />
                <span>Sim</span>
              </label>
              <label style={styles.radioLbl}>
                <input
                  type="radio"
                  name="atingiu"
                  checked={atingiu === false}
                  onChange={() => setAtingiu(false)}
                />
                <span>Não</span>
              </label>
            </div>
          </fieldset>

          {/* 5) Texto aberto — 5B */}
          <fieldset style={styles.fieldset}>
            <label style={styles.label}>Se algo te incomodou ou faltou, conta aqui.</label>
            <textarea
              value={sugestao}
              onChange={(e) => setSugestao(e.target.value.slice(0, 1000))}
              rows={3}
              placeholder="Mensagem opcional"
              style={styles.textarea}
            />
            <div style={styles.counter}>{sugestao.length}/1000</div>
          </fieldset>

          {err ? <div style={styles.err}>{err}</div> : null}

          <footer style={styles.footer}>
            <button type="button" onClick={onClose} disabled={sending} style={styles.btnGhost}>
              Pular por agora
            </button>
            <button type="submit" disabled={!canSend || sending} style={styles.btnPrimary}>
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </footer>

          <p style={styles.microcopy}>Usamos seu feedback só para melhorar a experiência.</p>
        </form>
      </div>
    </div>
  );
}

/* ===== Subcomponentes ===== */

function Slider({ value, onChange, min = 1, max = 10 }) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value ?? min}
        onChange={(e) => onChange(Number(e.target.value))}
        style={styles.slider}
      />
      <div style={styles.sliderLegend}>
        <span>{min}</span>
        <strong style={styles.sliderValue}>{value ?? "—"}</strong>
        <span>{max}</span>
      </div>
    </div>
  );
}

/* ===== Estilos inline (simples e sem dependências) ===== */
const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 9999,
  },
  modal: {
    width: "100%",
    maxWidth: 560,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  header: { padding: "16px 20px", borderBottom: "1px solid #eee" },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  body: { padding: 20 },
  fieldset: { margin: 0, padding: 0, border: "none", marginBottom: 16 },
  label: { display: "block", fontWeight: 600, marginBottom: 8 },
  anchors: { display: "block", fontSize: 12, color: "#777", marginTop: 4 },
  npsWrap: { display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 8 },
  chip: {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: "8px 0",
    background: "#fafafa",
    cursor: "pointer",
    fontWeight: 600,
  },
  chipActive: {
    borderColor: "#3b82f6",
    background: "#e8f0ff",
    color: "#1f4dd9",
  },
  npsAnchors: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
  radioLbl: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" },
  textarea: {
    width: "100%",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 10,
    font: "inherit",
    resize: "vertical",
  },
  counter: { textAlign: "right", fontSize: 12, color: "#777", marginTop: 4 },
  footer: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8 },
  btnGhost: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #1f4dd9",
    background: "#1f4dd9",
    color: "white",
    cursor: "pointer",
  },
  microcopy: { marginTop: 8, fontSize: 12, color: "#777" },
  err: {
    background: "#fde8e8",
    color: "#b00020",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #f6caca",
    marginBottom: 8,
  },
  slider: { width: "100%" },
  sliderLegend: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
    color: "#555",
    marginTop: 6,
  },
  sliderValue: { fontSize: 14 },
};
