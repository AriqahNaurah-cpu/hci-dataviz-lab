const nav = document.getElementById('nav');
document.getElementById('menuBtn').addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('themeBtn').addEventListener('click',()=>document.body.classList.toggle('light-mode'));

const days=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
const defaults=[120,185,150,240,205,280,260];
let values=[...defaults];
const inputs=document.getElementById('dataInputs');
const chart=document.getElementById('chart');
const legend=document.getElementById('legend');
const totalValue=document.getElementById('totalValue');
function makeInputs(){
  inputs.innerHTML='';
  days.forEach((day,i)=>{
    const label=document.createElement('label'); label.textContent=day;
    const input=document.createElement('input');input.type='number';input.min='0';input.max='10000';input.value=values[i];input.setAttribute('aria-label','Jumlah kunjungan '+day);
    input.addEventListener('input',()=>{values[i]=Math.max(0,Number(input.value)||0);renderChart()});
    label.appendChild(input);inputs.appendChild(label);
  });
}
function renderChart(){
  const type=document.getElementById('chartType').value;
  const total=values.reduce((a,b)=>a+b,0);
  totalValue.textContent=total.toLocaleString('id-ID');
  chart.innerHTML='';legend.innerHTML='';
  if(type==='bar'){
    values.forEach((v,i)=>{
      const group=document.createElement('div');group.className='bar-group';
      const value=document.createElement('span');value.className='bar-value';value.textContent=v.toLocaleString('id-ID');
      const bar=document.createElement('div');bar.className='bar';bar.style.height=(Math.max(v,0)/(Math.max(...values,1))*165)+'px';bar.title=days[i]+': '+v;
      const label=document.createElement('span');label.className='bar-label';label.textContent=days[i];
      group.append(value,bar,label);chart.appendChild(group);
    });
    legend.innerHTML='<span><i class="legend-dot" style="background:#398bf6"></i>Jumlah kunjungan</span>';
  } else if(type==='line'){
    const max=Math.max(...values,1), w=600,h=220,pad=30;
    const x=i=>pad+i*(w-2*pad)/(values.length-1), y=v=>h-pad-(v/max)*(h-2*pad);
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.setAttribute('class','line-svg');
    for(let i=0;i<5;i++){let yy=pad+i*(h-2*pad)/4;let line=document.createElementNS(ns,'line');line.setAttribute('x1',pad);line.setAttribute('x2',w-pad);line.setAttribute('y1',yy);line.setAttribute('y2',yy);line.setAttribute('stroke','#e5edf6');svg.appendChild(line)}
    const poly=document.createElementNS(ns,'polyline');poly.setAttribute('points',values.map((v,i)=>`${x(i)},${y(v)}`).join(' '));poly.setAttribute('fill','none');poly.setAttribute('stroke','#398bf6');poly.setAttribute('stroke-width','4');poly.setAttribute('stroke-linecap','round');poly.setAttribute('stroke-linejoin','round');svg.appendChild(poly);
    values.forEach((v,i)=>{let c=document.createElementNS(ns,'circle');c.setAttribute('cx',x(i));c.setAttribute('cy',y(v));c.setAttribute('r','5');c.setAttribute('fill','#fff');c.setAttribute('stroke','#398bf6');c.setAttribute('stroke-width','3');svg.appendChild(c);let t=document.createElementNS(ns,'text');t.setAttribute('x',x(i));t.setAttribute('y',h-6);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','12');t.setAttribute('fill','#65758c');t.textContent=days[i];svg.appendChild(t)});
    chart.appendChild(svg);legend.innerHTML='<span><i class="legend-dot" style="background:#398bf6"></i>Tren kunjungan harian</span>';
  } else {
    const colors=['#3b8df5','#8b69e8','#2bb78a','#f0a34a','#e66e9d','#35b9cf','#667b9d'];
    const donut=document.createElement('div');donut.style.cssText='width:min(220px,65vw);aspect-ratio:1;border-radius:50%;margin:auto;position:relative;display:grid;place-items:center;';
    let cumulative=0;const stops=values.map((v,i)=>{const start=cumulative;cumulative+=total?100*v/total:100/values.length;return `${colors[i]} ${start}% ${cumulative}%`});
    donut.style.background=`conic-gradient(${stops.join(',')})`;
    const hole=document.createElement('div');hole.style.cssText='width:58%;height:58%;border-radius:50%;background:var(--card);display:flex;align-items:center;justify-content:center;flex-direction:column;color:var(--ink)';
    hole.innerHTML=`<b style="font:800 23px Manrope">${total.toLocaleString('id-ID')}</b><small style="font-size:10px;color:var(--muted)">total kunjungan</small>`;
    donut.appendChild(hole);chart.style.background='none';chart.style.minHeight='250px';chart.style.alignItems='center';chart.style.justifyContent='center';chart.appendChild(donut);
    days.forEach((d,i)=>{const item=document.createElement('span');item.innerHTML=`<i class="legend-dot" style="background:${colors[i]}"></i>${d}: ${total?(100*values[i]/total).toFixed(1):'0.0'}%`;legend.appendChild(item)});
  }
  if(type!=='donut'){chart.style.background='repeating-linear-gradient(to bottom,transparent 0,transparent 44px,#eaf0f7 45px,#eaf0f7 46px)';chart.style.minHeight='230px';chart.style.alignItems='end';chart.style.justifyContent='space-around'}
  document.getElementById('chartTitle').textContent=type==='bar'?'Kunjungan per Hari':type==='line'?'Tren Kunjungan Harian':'Proporsi Kunjungan';
  document.getElementById('chartSubtitle').textContent=type==='donut'?'Persentase kontribusi setiap hari':'Total kunjungan minggu ini';
}
document.getElementById('chartType').addEventListener('change',renderChart);
document.getElementById('resetBtn').addEventListener('click',()=>{values=[...defaults];makeInputs();renderChart()});
makeInputs();renderChart();

const caseText={
 campus:'<b>Alur HCI:</b> wawancara pengguna → petakan masalah → buat wireframe/prototipe → uji tugas dengan mahasiswa → perbaiki navigasi berdasarkan hasil pengujian.',
 sales:'<b>Alur visualisasi:</b> kumpulkan data penjualan → bersihkan data → pilih grafik batang untuk perbandingan dan grafik garis untuk tren → tambahkan label yang jelas → gunakan insight untuk diskusi keputusan.',
 air:'<b>Alur visualisasi:</b> kumpulkan pengukuran kualitas udara → periksa kelengkapan dan satuan → tampilkan tren waktu dan peta lokasi → sertakan legenda, waktu pembaruan, serta konteks ambang pengukuran.'
};
const detail=document.getElementById('caseDetail');
document.querySelectorAll('[data-case]').forEach(btn=>btn.addEventListener('click',()=>{detail.innerHTML=caseText[btn.dataset.case];detail.hidden=false;detail.scrollIntoView({behavior:'smooth',block:'nearest'})}));
