const seed=[
 {id:1,name:"Netflix",category:"Entertainment",price:649,billing:"monthly",renewal:addDays(3),status:"active"},
 {id:2,name:"GitHub Pro",category:"Software",price:400,billing:"monthly",renewal:addDays(6),status:"active"},
 {id:3,name:"Spotify",category:"Entertainment",price:119,billing:"monthly",renewal:addDays(12),status:"active"},
 {id:4,name:"AWS",category:"Cloud",price:1800,billing:"monthly",renewal:addDays(20),status:"active"},
 {id:5,name:"Coursera",category:"Education",price:4999,billing:"yearly",renewal:addDays(45),status:"paused"}
];
let data=JSON.parse(localStorage.getItem("subtrack"))||seed;
function addDays(n){const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
const $=s=>document.querySelector(s);
const money=n=>"₹"+Math.round(n).toLocaleString("en-IN");
function monthly(s){return s.billing==="yearly"?s.price/12:s.price}
function save(){localStorage.setItem("subtrack",JSON.stringify(data));render()}
function render(){
 const active=data.filter(s=>s.status==="active");
 const monthlySpend=active.reduce((a,s)=>a+monthly(s),0);
 $("#monthlySpend").textContent=money(monthlySpend);
 $("#yearlySpend").textContent=money(monthlySpend*12);
 $("#activeCount").textContent=active.length;
 const now=new Date(), week=new Date();week.setDate(now.getDate()+7);
 $("#dueCount").textContent=active.filter(s=>new Date(s.renewal)<=week).length;
 renderUpcoming();renderList();renderCategories();renderAnalytics();
}
function renderUpcoming(){
 const arr=data.filter(s=>s.status==="active").sort((a,b)=>new Date(a.renewal)-new Date(b.renewal)).slice(0,5);
 $("#upcoming").innerHTML=arr.length?arr.map(s=>`<div class="renewal"><strong>${s.name}</strong><span class="muted">${s.category}</span><span>${money(s.price)}/${s.billing==="yearly"?"yr":"mo"}</span><span>${s.renewal}</span></div>`).join(""):"<p class='muted'>No active subscriptions.</p>";
}
function renderList(){
 const q=$("#search").value.toLowerCase(), f=$("#filter").value;
 const arr=data.filter(s=>(f==="all"||s.status===f)&&s.name.toLowerCase().includes(q));
 $("#subscriptionList").innerHTML=arr.length?arr.map(s=>`<div class="row"><div><strong>${s.name}</strong><div class="muted">${s.category}</div></div><div>${money(s.price)}/${s.billing==="yearly"?"yr":"mo"}</div><div>${s.renewal}</div><span class="badge ${s.status}">${s.status}</span><button class="delete" onclick="removeSub(${s.id})">Delete</button></div>`).join(""):"<p class='muted'>No subscriptions found.</p>";
}
function renderCategories(){
 const totals={};data.filter(s=>s.status==="active").forEach(s=>totals[s.category]=(totals[s.category]||0)+monthly(s));
 const max=Math.max(...Object.values(totals),1);
 $("#categoryChart").innerHTML=Object.entries(totals).map(([k,v])=>`<div class="bar-line"><span>${k}</span><div class="bar"><i style="width:${v/max*100}%"></i></div><b>${money(v)}</b></div>`).join("")||"<p class='muted'>No data yet.</p>";
}
function renderAnalytics(){
 const active=data.filter(s=>s.status==="active"), m=active.reduce((a,s)=>a+monthly(s),0);
 $("#analyticsText").innerHTML=`<p><strong>${money(m)}</strong> estimated monthly recurring spend.</p><p><strong>${money(m*12)}</strong> projected yearly recurring spend.</p><p><strong>${active.length}</strong> active services are currently tracked.</p>`;
}
function removeSub(id){data=data.filter(s=>s.id!==id);save()}
document.querySelectorAll(".nav").forEach(btn=>btn.onclick=()=>go(btn.dataset.section));
document.querySelectorAll("[data-go]").forEach(btn=>btn.onclick=()=>go(btn.dataset.go));
function go(section){document.querySelectorAll(".section").forEach(x=>x.classList.remove("active-section"));$("#"+section).classList.add("active-section");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.section===section));$("#pageTitle").textContent=section[0].toUpperCase()+section.slice(1)}
$("#openModal").onclick=()=>$("#modal").classList.remove("hidden");
$("#closeModal").onclick=()=>$("#modal").classList.add("hidden");
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.add("hidden")};
$("#search").oninput=renderList;$("#filter").onchange=renderList;
$("#form").onsubmit=e=>{
 e.preventDefault();const f=new FormData(e.target);
 data.push({id:Date.now(),name:f.get("name"),category:f.get("category"),price:Number(f.get("price")),billing:f.get("billing"),renewal:f.get("renewal"),status:f.get("status")});
 save();e.target.reset();$("#modal").classList.add("hidden");
};
render();
