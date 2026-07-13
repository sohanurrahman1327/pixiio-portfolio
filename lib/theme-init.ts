/**
 * Tiny blocking head script — applies the stored theme before first paint
 * (avoids a light/dark flash) and marks `preloader-skipped` immediately
 * since the boot preloader is currently disabled. Components like
 * SmoothScroll wait for that class before starting, so it must always end
 * up on <html> even with no preloader running.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
var root=document.documentElement;
var t=localStorage.getItem("pixiio-theme");
if(t==="dark"){root.classList.add("dark");root.style.colorScheme="dark"}
else{root.classList.remove("dark");root.style.colorScheme="light"}
root.classList.add("preloader-skipped");
}catch(e){}})();`;
