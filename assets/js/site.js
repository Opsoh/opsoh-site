const b=document.getElementById('menu'),p=document.getElementById('panel');
if(b&&p){
  b.onclick=()=>{
    const isOpen=b.getAttribute('aria-expanded')==='true';
    b.setAttribute('aria-expanded',String(!isOpen));
    p.hidden=isOpen;
  };
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'&&!p.hidden){
      p.hidden=true;
      b.setAttribute('aria-expanded','false');
      b.focus();
    }
  });
  p.querySelectorAll('a').forEach((link)=>{
    link.addEventListener('click',()=>{
      p.hidden=true;
      b.setAttribute('aria-expanded','false');
    });
  });
}


// v16_3_scroll_close
if(b&&p){
  let lastY=window.scrollY;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(!p.hidden && Math.abs(y-lastY)>24){
      p.hidden=true;
      b.setAttribute('aria-expanded','false');
    }
    lastY=y;
  },{passive:true});
}


// v17.2 lightweight screenshot lightbox
const screenshotLightbox=document.getElementById('screenshot-lightbox');
const screenshotLightboxImage=document.getElementById('lightbox-image');
const screenshotLightboxClose=document.querySelector('.lightbox-close');

function openScreenshotLightbox(img){
  if(!screenshotLightbox||!screenshotLightboxImage||!img) return;
  const src=img.getAttribute('data-lightbox-src')||img.getAttribute('src');
  screenshotLightboxImage.src=src;
  screenshotLightboxImage.alt=img.getAttribute('alt')||'App screenshot preview';
  screenshotLightbox.hidden=false;
  screenshotLightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  if(screenshotLightboxClose) screenshotLightboxClose.focus();
}

function closeScreenshotLightbox(){
  if(!screenshotLightbox||!screenshotLightboxImage) return;
  screenshotLightbox.hidden=true;
  screenshotLightbox.setAttribute('aria-hidden','true');
  screenshotLightboxImage.src='';
  document.body.style.overflow='';
}

document.querySelectorAll('img[data-lightbox-src]').forEach((img)=>{
  img.addEventListener('click',()=>openScreenshotLightbox(img));
  img.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      openScreenshotLightbox(img);
    }
  });
});

if(screenshotLightbox){
  screenshotLightbox.addEventListener('click',(e)=>{
    if(e.target===screenshotLightbox) closeScreenshotLightbox();
  });
}

if(screenshotLightboxClose){
  screenshotLightboxClose.addEventListener('click',closeScreenshotLightbox);
}

document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'&&screenshotLightbox&&!screenshotLightbox.hidden){
    closeScreenshotLightbox();
  }
});
