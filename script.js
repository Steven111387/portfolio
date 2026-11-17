const works=[
{id:5,kind:'video',label:'SHORT FILM',title:'탈피',desc:'교사가 된 나와 과거의 나를 닮은 여학생의 만남을 그린 단편 영상입니다. 시공간을 넘어 상처를 치유하고 성장하는 이야기를 담았습니다.'},
{id:6,kind:'video',label:'VIDEO / CONTEST',title:'시민안전공모전',desc:'시민의 일상과 안전을 주제로 제작한 공모전 영상입니다. 전하고자 하는 메시지를 장면으로 풀어냈습니다.'},
{id:7,kind:'video',label:'EDITORIAL / VIDEO',title:'잡지 공모전',desc:'출판물의 지면을 영상으로 연결한 작업입니다. 미디어 콘텐츠를 화면 위에서 새롭게 소개합니다.'},
{id:8,kind:'media',label:'TRAVEL / STORY',title:'나의 여행 기록',desc:'여행의 순간과 기억을 이야기로 엮은 콘텐츠입니다. 개인의 기록을 시각적으로 표현하는 방법을 탐색했습니다.'},
{id:9,kind:'media',label:'STORYTELLING / VISUAL',title:'그림책 제작',desc:'스토리텔링과 시각화를 연결한 그림책 작업입니다. 이야기의 흐름에 맞춰 글과 이미지의 관계를 구성했습니다.'},
{id:10,kind:'media',label:'PUBLISHING / MEDIA',title:'책을 만드는 사람들',desc:'책과 미디어를 통해 이야기를 전달하는 출판 기획 작업입니다. 콘텐츠의 구성과 시각적 표현 방식을 담았습니다.'}
];
// Google Drive video for each work (file ID from the share link). Vertical videos are marked so the player keeps a 9:16 frame.
const videos={5:{id:'1dLA29sQ41rHxKEuhSHkz7ZOnhJSvlnmA'},6:{id:'1_DNpDx3UvyjZoWgm2CMYOwfq344NUGX5',vertical:true},7:{id:'1Dg6p-axlHWlKTjeLTRvO5o9lhm1Cse7q'}};
// Card thumbnails (photo area only) and the point each one stays centred on when it fills the frame.
const thumbs={5:'work-5.jpg',6:'work-6-portrait.jpg',7:'work-7.jpg',8:'work-8-phone.jpg',9:'work-9.jpg',10:'work-10.jpg'};
const focus={5:'68% 50%',6:'50% 30%',8:'50% 0%'};
const cards=document.querySelector('#cards');
cards.innerHTML=works.map((w,i)=>`<article class="project" id="work-${w.id}" data-kind="${w.kind}"><button data-id="${w.id}" aria-label="${w.title} 작업 상세 보기"><figure><img src="assets/${thumbs[w.id]}" alt="${w.title} 작업 이미지" loading="lazy" style="object-position:${focus[w.id]||'center'}">${videos[w.id]?'<span class="play-badge" aria-hidden="true"><i>▶</i> 영상 보기</span>':''}</figure><div class="project-body"><span class="project-category">${w.label}</span><small>PROJECT 0${i+1}</small><h3>${w.title}</h3><p>${w.desc}</p><div class="more">작업 자세히 보기 <span>↗</span></div></div></button></article>`).join('');
const dialog=document.querySelector('#detail');
cards.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(!b)return;const w=works.find(w=>w.id===Number(b.dataset.id));document.querySelector('#detail-kind').textContent=w.label;document.querySelector('#detail-title').textContent=w.title;document.querySelector('#detail-description').textContent=w.desc;const img=document.querySelector('#detail-image');img.src=`assets/page-${w.id}.jpg`;img.alt=`${w.title} 포트폴리오 원본 페이지`;const v=videos[w.id],box=document.querySelector('#detail-video');if(v){box.className='video-frame'+(v.vertical?' vertical':'');box.innerHTML=`<iframe src="https://drive.google.com/file/d/${v.id}/preview" title="${w.title} 영상" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>`;box.hidden=false;}else{box.innerHTML='';box.hidden=true;}dialog.showModal();dialog.scrollTop=0;});
// Highlight cards jump to the exact work or history entry and briefly mark it.
document.querySelectorAll('.highlight[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();
if(t.classList.contains('project')&&t.hidden)document.querySelector('[data-filter="all"]').click();
t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});history.replaceState(null,'',a.getAttribute('href'));
t.classList.remove('flash');void t.offsetWidth;t.classList.add('flash');setTimeout(()=>t.classList.remove('flash'),2600);}));
// Hero "대표 영상 보기" button opens that work's popup with its video.
document.querySelectorAll('[data-open-work]').forEach(a=>a.addEventListener('click',e=>{const card=document.querySelector(`#cards [data-id="${a.dataset.openWork}"]`);if(!card)return;e.preventDefault();card.click();}));
// Remove the player when the popup closes so the video stops playing.
dialog.addEventListener('close',()=>{if(dialog.open)return;const box=document.querySelector('#detail-video');box.innerHTML='';box.hidden=true;});
document.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});document.querySelectorAll('.project').forEach(c=>c.hidden=b.dataset.filter!=='all'&&c.dataset.kind!==b.dataset.filter);}));
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');}));
document.querySelector('#copy').addEventListener('click',async()=>{const s=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('thsgpwn5565@naver.com');s.textContent='이메일 주소를 복사했습니다.';}catch{s.textContent='주소를 선택해 복사해 주세요: thsgpwn5565@naver.com';}});

