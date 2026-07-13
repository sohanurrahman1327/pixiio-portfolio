/** Static boot preloader — paints with first HTML, before React hydrates. */
export default function BootPreloader() {
  return (
    <div
      id="boot-preloader"
      className="preloader-shell"
      data-phase="playing"
      aria-hidden="true"
    >
      <div className="boot-preloader-center">
        <div
          className="preloader-3d-scene"
          style={{ ["--segment-count" as string]: 5 }}
          data-boot-cylinder
        >
          <div className="preloader-3d-cylinder" aria-hidden="true">
            {(["Agency", "Creative", "Led", "Design", "Pixiio"] as const).map((part, index) => (
              <span
                key={`${part}-${index}`}
                className={`preloader-3d-face${index === 4 ? " preloader-3d-face--brand" : ""}`}
                style={{ ["--i" as string]: index }}
              >
                {part}
              </span>
            ))}
          </div>
        </div>
        <div className="preloader-hero-logo" data-boot-logo hidden>
          <div className="boot-preloader-logo-mark">
            <svg width="64" height="64" viewBox="30.5 24.8 39 50.4" fill="none" aria-hidden="true">
              <path
                d="M67.9385 55.7363C68.5411 55.1955 69.4997 55.6229 69.5 56.4326V68.3936C69.5 72.129 66.4718 75.1572 62.7363 75.1572C62.5496 75.1572 62.3984 75.0061 62.3984 74.8193V61.1592C62.3984 60.8754 62.5185 60.6047 62.7295 60.415L67.9385 55.7363ZM59.0947 24.8428C59.3599 24.8428 59.6142 24.9483 59.8018 25.1357L69.207 34.541C69.3945 34.7285 69.5 34.9829 69.5 35.248V47.7559C69.5 48.0355 69.3825 48.3028 69.1768 48.4922L59.7871 57.1338C59.6079 57.2987 59.3744 57.3933 59.1309 57.3984L51.3818 57.5615C50.8217 57.5731 50.3615 57.1228 50.3613 56.5625V49.1943C50.3615 48.6422 50.8091 48.1943 51.3613 48.1943H55.3984C55.713 48.1942 56.0094 48.0466 56.1982 47.7949L59.3096 43.6465C59.4392 43.4735 59.5087 43.263 59.5088 43.0469V39.4609C59.5088 39.1959 59.4041 38.9414 59.2168 38.7539L56.1914 35.7285C56.004 35.5411 55.7494 35.4357 55.4844 35.4355H42.5742C42.0219 35.4355 41.5742 35.8833 41.5742 36.4355V51.6855L49.707 59.8184C49.8945 60.0059 50 60.2602 50 60.5254V72.7432C50 73.6341 48.9229 74.0802 48.293 73.4502L41.7471 66.9043C41.5596 66.7168 41.4542 66.4624 41.4541 66.1973V51.5654L30.793 40.9043C30.6055 40.7168 30.5 40.4624 30.5 40.1973V25.8428C30.5 25.2905 30.9477 24.8428 31.5 24.8428H59.0947Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="preloader-counter" data-boot-counter aria-hidden="true">
        <span className="preloader-counter__value" data-boot-count>
          0
        </span>
        <span className="preloader-counter__symbol">%</span>
      </div>
    </div>
  );
}
