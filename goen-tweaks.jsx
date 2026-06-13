/* 語縁 GOEN — Tweaks bridge */
const { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakColor } = window;

const GOEN_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#D9B66D",
  "density": 1,
  "connect": 1
}/*EDITMODE-END*/;

function GoenTweaks() {
  const [t, setTweak] = useTweaks(GOEN_TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    window.GOEN_CONFIG = { density: t.density, connect: t.connect };
    window.dispatchEvent(new CustomEvent("goen:config"));
  }, [t.accent, t.density, t.connect]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="ブランド" />
      <TweakColor
        label="アクセント"
        value={t.accent}
        options={["#D9B66D", "#BFCBDD", "#C98A6D"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="モーション" />
      <TweakSlider
        label="粒子の密度"
        value={t.density}
        min={0.4}
        max={1.8}
        step={0.1}
        onChange={(v) => setTweak("density", v)}
      />
      <TweakSlider
        label="つながりの距離"
        value={t.connect}
        min={0.6}
        max={1.6}
        step={0.1}
        onChange={(v) => setTweak("connect", v)}
      />
    </TweaksPanel>
  );
}

const goenTweaksRoot = document.createElement("div");
document.body.appendChild(goenTweaksRoot);
ReactDOM.createRoot(goenTweaksRoot).render(<GoenTweaks />);
