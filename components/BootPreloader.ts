/**
 * Boot preloader (currently DISABLED — not imported/used anywhere).
 *
 * Kept here so it can be dropped back into `app/layout.tsx` on request:
 *   import { BOOT_PRELOADER_SCRIPT, BOOT_PRELOADER_STYLES } from "@/components/BootPreloader";
 *   // in <head>:
 *   <style dangerouslySetInnerHTML={{ __html: BOOT_PRELOADER_STYLES }} />
 *   <script dangerouslySetInnerHTML={{ __html: BOOT_PRELOADER_SCRIPT }} />
 *
 * Also remove the standalone THEME_INIT_SCRIPT from layout.tsx if re-enabling
 * this, since BOOT_PRELOADER_SCRIPT already handles theme init + sets
 * `preloader-skipped` on completion (which components like SmoothScroll wait
 * on before starting).
 */

/**
 * Critical CSS — first paint never shows page until it fades in.
 * #page-content uses opacity only (never visibility/display), so the browser
 * can paint it in the background the whole time the preloader is up. That
 * makes the eventual reveal a cheap compositor-only fade instead of a big
 * layout+paint burst (which was the cause of the "white screen" pause).
 */
export const BOOT_PRELOADER_STYLES = `
#page-content{opacity:0;transform:translateY(18px);pointer-events:none;transition:opacity .7s cubic-bezier(0.16,1,0.3,1),transform .7s cubic-bezier(0.16,1,0.3,1)}
#page-content.page-revealed{opacity:1;transform:translateY(0);pointer-events:auto}
html:not(.preloader-skipped)::before{content:"";position:fixed;inset:0;z-index:9998;background:#ffffff}
html.dark:not(.preloader-skipped)::before{background:#09090f}
html.preloader-skipped::before{display:none!important;content:none!important}
html.preloader-skipped #boot-preloader{display:none!important;pointer-events:none!important}
#boot-preloader{position:fixed;inset:0;z-index:9999;overflow:hidden;background:#ffffff;color:#111111;transform:translateY(0);will-change:transform}
html.dark #boot-preloader{background:#09090f;color:#ededf2}
#boot-preloader .boot-preloader-center{position:relative;z-index:10;display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;padding:0 1.5rem;user-select:none;pointer-events:none}
#boot-preloader .preloader-3d-scene{--segment-count:5;--segment-angle:72deg;--cylinder-radius:clamp(88px,14vw,132px);position:relative;width:100%;max-width:1200px;height:clamp(120px,18vw,200px);margin-inline:auto;perspective:1000px;transform-style:preserve-3d}
#boot-preloader .preloader-3d-cylinder{position:absolute;inset:0;transform-style:preserve-3d;animation:boot-preloader-3d 2.4s cubic-bezier(0.45,0.05,0.2,1) forwards}
#boot-preloader .preloader-3d-face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-bebas),Impact,Haettenschweiler,sans-serif;font-size:clamp(2.5rem,6.5vw,5.5rem);letter-spacing:0.06em;text-transform:uppercase;color:#0f1a3d;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:rotateX(calc(var(--i) * 72deg)) translateZ(var(--cylinder-radius))}
html.dark #boot-preloader .preloader-3d-face{color:#e8eaf6}
#boot-preloader .preloader-3d-face--brand{color:#5b5fef}
#boot-preloader .preloader-hero-logo{display:none;animation:boot-preloader-logo-in .75s cubic-bezier(0.16,1,0.3,1) both}
#boot-preloader[data-phase="logo"] .preloader-3d-scene,
#boot-preloader[data-phase="counter-exiting"] .preloader-3d-scene,
#boot-preloader[data-phase="exiting"] .preloader-3d-scene{display:none}
#boot-preloader[data-phase="logo"] .preloader-hero-logo,
#boot-preloader[data-phase="counter-exiting"] .preloader-hero-logo,
#boot-preloader[data-phase="exiting"] .preloader-hero-logo{display:block}
#boot-preloader .boot-preloader-logo-mark{display:flex;width:8rem;height:8rem;align-items:center;justify-content:center;border-radius:9999px;border:5px solid #fff;background:#5b5fef;box-shadow:0 20px 40px rgba(91,95,239,.4)}
#boot-preloader .preloader-counter{position:absolute;right:clamp(1.25rem,4vw,3rem);bottom:clamp(1.25rem,4vw,3rem);display:flex;align-items:flex-end;gap:.02em;line-height:.85;font-family:var(--font-inter),Arial,Helvetica,sans-serif;font-weight:900;letter-spacing:-.04em;color:#111111;pointer-events:none;z-index:11}
html.dark #boot-preloader .preloader-counter{color:#ededf2}
#boot-preloader .preloader-counter__value{font-size:clamp(3.5rem,12vw,7.5rem)}
#boot-preloader .preloader-counter__symbol{font-size:clamp(1.75rem,5vw,3.75rem);margin-bottom:.12em}
#boot-preloader[data-phase="exiting"]{animation:boot-preloader-shell-exit .7s cubic-bezier(0.76,0,0.24,1) forwards}
#boot-preloader[data-phase="counter-exiting"] .preloader-counter,
#boot-preloader[data-phase="exiting"] .preloader-counter{animation:boot-preloader-counter-exit .65s cubic-bezier(0.76,0,0.24,1) forwards}
@keyframes boot-preloader-3d{0%{transform:rotateX(0deg)}100%{transform:rotateX(-360deg)}}
@keyframes boot-preloader-shell-exit{0%{transform:translateY(0)}100%{transform:translateY(-100%)}}
@keyframes boot-preloader-counter-exit{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-130%)}}
@keyframes boot-preloader-logo-in{0%{opacity:0;transform:scale(.84)}100%{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
  #boot-preloader .preloader-3d-cylinder{animation:none!important;transform:rotateX(-12deg)}
  #boot-preloader[data-phase="exiting"]{animation:none!important}
}
`.replace(/\n/g, "");

/**
 * One blocking head script: theme + skip/pending + animation + guaranteed reveal.
 * Kept as a single sync script so Next.js cannot reorder it ahead of bootstrap.
 */
export const BOOT_PRELOADER_SCRIPT = `(function(){try{
if(window.__pixiioBootPreloader)return;
window.__pixiioBootPreloader=true;
var KEY="pixiio-preloader-seen";
var TEXT_MS=2650,LOGO_MS=500,COUNTER_EXIT_MS=400,EXIT_MS=700;
var TOTAL_MS=TEXT_MS+LOGO_MS;
var HARD_REVEAL_MS=TOTAL_MS+COUNTER_EXIT_MS+EXIT_MS+1500;
var root=document.documentElement;
var revealed=false;

var t=localStorage.getItem("pixiio-theme");
if(t==="dark"){root.classList.add("dark");root.style.colorScheme="dark"}
else{root.classList.remove("dark");root.style.colorScheme="light"}

function fadeInPage(){
  var page=document.getElementById("page-content");
  if(page)page.classList.add("page-revealed");
}

function reveal(){
  if(revealed)return;
  revealed=true;
  fadeInPage();
  root.classList.remove("preloader-pending");
  root.classList.add("preloader-skipped");
  var shell=document.getElementById("boot-preloader");
  if(shell)shell.remove();
  try{sessionStorage.setItem(KEY,"1")}catch(e){}
}

var skip=/^\\d{1,3}(?:\\.\\d{1,3}){3}$/.test(location.hostname)
  ||!!sessionStorage.getItem(KEY)
  ||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);

root.classList.remove("preloader-pending","preloader-skipped");
if(skip){reveal();return}
root.classList.add("preloader-pending");

var HTML='<div id="boot-preloader" data-phase="playing" aria-hidden="true">'
+'<div class="boot-preloader-center">'
+'<div class="preloader-3d-scene">'
+'<div class="preloader-3d-cylinder" aria-hidden="true">'
+'<span class="preloader-3d-face" style="--i:0">Agency</span>'
+'<span class="preloader-3d-face" style="--i:1">Creative</span>'
+'<span class="preloader-3d-face" style="--i:2">Led</span>'
+'<span class="preloader-3d-face" style="--i:3">Design</span>'
+'<span class="preloader-3d-face preloader-3d-face--brand" style="--i:4">Pixiio</span>'
+'</div></div>'
+'<div class="preloader-hero-logo">'
+'<div class="boot-preloader-logo-mark">'
+'<svg width="64" height="64" viewBox="30.5 24.8 39 50.4" fill="none" aria-hidden="true"><path d="M67.9385 55.7363C68.5411 55.1955 69.4997 55.6229 69.5 56.4326V68.3936C69.5 72.129 66.4718 75.1572 62.7363 75.1572C62.5496 75.1572 62.3984 75.0061 62.3984 74.8193V61.1592C62.3984 60.8754 62.5185 60.6047 62.7295 60.415L67.9385 55.7363ZM59.0947 24.8428C59.3599 24.8428 59.6142 24.9483 59.8018 25.1357L69.207 34.541C69.3945 34.7285 69.5 34.9829 69.5 35.248V47.7559C69.5 48.0355 69.3825 48.3028 69.1768 48.4922L59.7871 57.1338C59.6079 57.2987 59.3744 57.3933 59.1309 57.3984L51.3818 57.5615C50.8217 57.5731 50.3615 57.1228 50.3613 56.5625V49.1943C50.3615 48.6422 50.8091 48.1943 51.3613 48.1943H55.3984C55.713 48.1942 56.0094 48.0466 56.1982 47.7949L59.3096 43.6465C59.4392 43.4735 59.5087 43.263 59.5088 43.0469V39.4609C59.5088 39.1959 59.4041 38.9414 59.2168 38.7539L56.1914 35.7285C56.004 35.5411 55.7494 35.4357 55.4844 35.4355H42.5742C42.0219 35.4355 41.5742 35.8833 41.5742 36.4355V51.6855L49.707 59.8184C49.8945 60.0059 50 60.2602 50 60.5254V72.7432C50 73.6341 48.9229 74.0802 48.293 73.4502L41.7471 66.9043C41.5596 66.7168 41.4542 66.4624 41.4541 66.1973V51.5654L30.793 40.9043C30.6055 40.7168 30.5 40.4624 30.5 40.1973V25.8428C30.5 25.2905 30.9477 24.8428 31.5 24.8428H59.0947Z" fill="white"/></svg>'
+'</div></div></div>'
+'<div class="preloader-counter" aria-hidden="true"><span class="preloader-counter__value" data-boot-count>0</span><span class="preloader-counter__symbol">%</span></div>'
+'</div>';

function ensureShell(){
  var existing=document.getElementById("boot-preloader");
  if(existing)return existing;
  if(!document.body)return null;
  document.body.insertAdjacentHTML("afterbegin",HTML);
  return document.getElementById("boot-preloader");
}

function start(){
  var shell=ensureShell();
  if(!shell){
    if(!document.body){requestAnimationFrame(start);return}
    reveal();
    return;
  }

  var countEl=shell.querySelector("[data-boot-count]");
  var counter=shell.querySelector(".preloader-counter");
  var exiting=false;
  var startAt=performance.now();
  var raf=0;

  function tick(now){
    if(revealed)return;
    var live=document.querySelector("#boot-preloader [data-boot-count]")||countEl;
    var elapsed=Math.min(now-startAt,TOTAL_MS);
    var eased=1-Math.pow(1-elapsed/TOTAL_MS,3);
    if(live)live.textContent=String(Math.round(eased*100));
    if(elapsed<TOTAL_MS)raf=requestAnimationFrame(tick);
    else if(live)live.textContent="100";
  }
  raf=requestAnimationFrame(tick);

  setTimeout(function(){
    if(revealed)return;
    var liveShell=document.getElementById("boot-preloader");
    if(liveShell)liveShell.setAttribute("data-phase","logo");
  },TEXT_MS);

  setTimeout(function(){
    if(revealed||exiting)return;
    exiting=true;
    if(raf)cancelAnimationFrame(raf);
    var liveShell=document.getElementById("boot-preloader");
    if(!liveShell){reveal();return}
    var liveCount=liveShell.querySelector("[data-boot-count]");
    if(liveCount)liveCount.textContent="100";
    liveShell.setAttribute("data-phase","counter-exiting");
    if(counter)counter.setAttribute("data-phase","counter-exiting");
    // Start the page fade-in now, in parallel with the shell's exit
    // animation, so the design is already faded in (or nearly there) by
    // the time the opaque shell finishes sliding away — no gap, no flash.
    fadeInPage();
    setTimeout(function(){
      if(revealed)return;
      var s=document.getElementById("boot-preloader");
      if(!s){reveal();return}
      s.setAttribute("data-phase","exiting");
      var c=s.querySelector(".preloader-counter");
      if(c)c.setAttribute("data-phase","exiting");
      setTimeout(reveal,EXIT_MS);
    },COUNTER_EXIT_MS);
  },TOTAL_MS);

  // Never leave users stuck behind the cover.
  setTimeout(reveal,HARD_REVEAL_MS);
}

if(document.body)start();
else document.addEventListener("DOMContentLoaded",start,{once:true});
}catch(e){
  try{
    document.documentElement.classList.remove("preloader-pending");
    document.documentElement.classList.add("preloader-skipped");
  }catch(_){}
}})();`;
