/**
 * Inline boot script: shows the static preloader immediately, lets the full
 * site load underneath, then reveals when animation + page load are both ready.
 */
export const BOOT_PRELOADER_SCRIPT = `(function(){try{
var KEY="pixiio-preloader-seen";
var TEXT_MS=2650,LOGO_MS=500,COUNTER_EXIT_MS=400,EXIT_MS=700,MAX_WAIT_MS=18000;
var TOTAL_MS=TEXT_MS+LOGO_MS;
var t=localStorage.getItem("pixiio-theme");
if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}
else{document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme="light"}
function cleanupShell(){var shell=document.getElementById("boot-preloader");if(shell)shell.remove()}
function reveal(){
  document.documentElement.classList.remove("preloader-pending");
  document.documentElement.classList.add("preloader-skipped");
  cleanupShell();
  var page=document.getElementById("page-content");
  if(page)page.classList.add("page-revealed");
}
function isShared(){return/^\\d{1,3}(?:\\.\\d{1,3}){3}$/.test(location.hostname)}
function whenReady(fn){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fn,{once:true});else fn()}
if(isShared()||sessionStorage.getItem(KEY)||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)){
  document.documentElement.classList.remove("preloader-pending");
  document.documentElement.classList.add("preloader-skipped");
  whenReady(function(){cleanupShell();var page=document.getElementById("page-content");if(page)page.classList.add("page-revealed")});
  try{sessionStorage.setItem(KEY,"1")}catch(e){}
  return;
}
document.documentElement.classList.add("preloader-pending");
function start(){
  var shell=document.getElementById("boot-preloader");
  if(!shell){reveal();return}
  var cylinder=shell.querySelector("[data-boot-cylinder]");
  var logo=shell.querySelector("[data-boot-logo]");
  var counter=shell.querySelector("[data-boot-counter]");
  var countEl=shell.querySelector("[data-boot-count]");
  var animDone=false,pageReady=document.readyState==="complete",exiting=false;
  var startAt=performance.now();
  function tick(now){
    var elapsed=Math.min(now-startAt,TOTAL_MS);
    var eased=1-Math.pow(1-elapsed/TOTAL_MS,3);
    if(countEl)countEl.textContent=String(Math.round(eased*100));
    if(elapsed<TOTAL_MS)requestAnimationFrame(tick);
    else if(countEl)countEl.textContent="100";
  }
  requestAnimationFrame(tick);
  setTimeout(function(){
    shell.setAttribute("data-phase","logo");
    if(cylinder)cylinder.hidden=true;
    if(logo)logo.hidden=false;
  },TEXT_MS);
  setTimeout(function(){animDone=true;tryFinish()},TOTAL_MS);
  function onReady(){pageReady=true;tryFinish()}
  if(pageReady)onReady();
  else window.addEventListener("load",onReady,{once:true});
  setTimeout(function(){pageReady=true;tryFinish()},MAX_WAIT_MS);
  function tryFinish(){
    if(!animDone||!pageReady||exiting)return;
    exiting=true;
    shell.setAttribute("data-phase","counter-exiting");
    if(counter)counter.setAttribute("data-phase","counter-exiting");
    setTimeout(function(){
      shell.setAttribute("data-phase","exiting");
      if(counter)counter.setAttribute("data-phase","exiting");
      setTimeout(function(){
        try{sessionStorage.setItem(KEY,"1")}catch(e){}
        reveal();
      },EXIT_MS);
    },COUNTER_EXIT_MS);
  }
}
whenReady(start);
}catch(e){try{document.documentElement.classList.remove("preloader-pending");document.documentElement.classList.add("preloader-skipped")}catch(_){}}})();`;

/** Critical CSS so the boot preloader paints before the full CSS bundle. */
export const BOOT_PRELOADER_STYLES = `
html.preloader-pending #page-content{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
html.preloader-skipped #page-content{opacity:1!important;visibility:visible!important;pointer-events:auto!important}
html.preloader-skipped #boot-preloader{display:none!important}
#boot-preloader{position:fixed;inset:0;z-index:9999;overflow:hidden;background:#ffffff;color:#111111;transform:translateY(0)}
html.dark #boot-preloader{background:#09090f;color:#ededf2}
#boot-preloader .boot-preloader-center{position:relative;z-index:10;display:flex;height:100%;flex-direction:column;align-items:center;justify-content:center;padding:0 1.5rem;user-select:none}
#boot-preloader .preloader-3d-scene{--segment-angle:calc(360deg / var(--segment-count, 5));--cylinder-radius:clamp(88px,14vw,132px);position:relative;width:100%;max-width:1200px;height:clamp(120px,18vw,200px);margin-inline:auto;transform-style:preserve-3d}
#boot-preloader .preloader-3d-cylinder{position:absolute;inset:0;transform-style:preserve-3d;animation:boot-preloader-3d 2.4s cubic-bezier(0.45,0.05,0.2,1) forwards}
#boot-preloader .preloader-3d-face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-bebas),Impact,sans-serif;font-size:clamp(2.5rem,6.5vw,5.5rem);letter-spacing:0.06em;text-transform:uppercase;color:#0f1a3d;backface-visibility:hidden;transform:rotateX(calc(var(--i) * var(--segment-angle))) translateZ(var(--cylinder-radius))}
html.dark #boot-preloader .preloader-3d-face{color:#e8eaf6}
#boot-preloader .preloader-3d-face--brand{color:#5b5fef}
#boot-preloader .preloader-hero-logo{animation:boot-preloader-logo-in .75s cubic-bezier(0.16,1,0.3,1) both}
#boot-preloader .boot-preloader-logo-mark{display:flex;width:8rem;height:8rem;align-items:center;justify-content:center;border-radius:9999px;border:5px solid #fff;background:#5b5fef;box-shadow:0 20px 40px rgba(91,95,239,.4)}
#boot-preloader .preloader-counter{position:absolute;right:clamp(1.25rem,4vw,3rem);bottom:clamp(1.25rem,4vw,3rem);display:flex;align-items:flex-end;gap:.02em;line-height:.85;font-family:var(--font-inter),Arial,sans-serif;font-weight:900;letter-spacing:-.04em;color:#111;pointer-events:none}
html.dark #boot-preloader .preloader-counter{color:#ededf2}
#boot-preloader .preloader-counter__value{font-size:clamp(3.5rem,12vw,7.5rem)}
#boot-preloader .preloader-counter__symbol{font-size:clamp(1.75rem,5vw,3.75rem);margin-bottom:.12em}
#boot-preloader[data-phase="exiting"]{animation:boot-preloader-shell-exit .7s cubic-bezier(0.76,0,0.24,1) forwards}
#boot-preloader .preloader-counter[data-phase="counter-exiting"],
#boot-preloader .preloader-counter[data-phase="exiting"]{animation:boot-preloader-counter-exit .65s cubic-bezier(0.76,0,0.24,1) forwards}
@keyframes boot-preloader-3d{0%{transform:perspective(1000px) rotateX(0)}100%{transform:perspective(1000px) rotateX(360deg)}}
@keyframes boot-preloader-shell-exit{0%{transform:translateY(0)}100%{transform:translateY(-100%)}}
@keyframes boot-preloader-counter-exit{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-130%)}}
@keyframes boot-preloader-logo-in{0%{opacity:0;transform:scale(.84)}100%{opacity:1;transform:scale(1)}}
`.replace(/\n/g, "");
