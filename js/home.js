// js/home.js

document.addEventListener('DOMContentLoaded', async () => {

  // 1. Mobile Menu Toggle Logic
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });
  }

  // 2. Fetch and Render Latest Jobs for the Homepage
  const container = document.getElementById('latestJobs');
  if (!container) return;

  // Fallback data if your Node.js server is offline
  const mockManpowerJobs = [
    {
      title: "Senior Civil Engineer", company: "Al-Futtaim Engineering", location: "Dubai, UAE",
      salary: "12,000 - 15,000 AED/mo", roleSummary: "Leading infrastructure projects in Dubai. Require minimum 8+ years Gulf experience.", urgent: true
    },
    {
      title: "ICU Registered Nurses", company: "King Fahd Medical City", location: "Riyadh, KSA",
      salary: "5,000 - 7,000 SAR/mo", roleSummary: "Urgently seeking licensed ICU nurses. Prometric and Dataflow required.", urgent: true
    },
    {
      title: "Structural Welders (6G)", company: "Qatar Petroleum", location: "Doha, Qatar",
      salary: "3,500 QAR/mo + OT", roleSummary: "6-month shutdown project. Must pass 6G trade test. 10 hours duty + Overtime.", urgent: false
    }
  ];

  try {
    // Fetch LIVE jobs from your Node.js Server
    const res = await fetch('http://localhost:3000/api/jobs');
    if (!res.ok) throw new Error("Server response not OK");
    
    const jobsData = await res.json();
    
    // Filter out 'Done' jobs and get the 3 most recent ones
    const activeJobs = jobsData.filter(job => job.status !== 'Done');
    
    // Pass only the top 3 jobs to the homepage grid
    renderHomepageJobs(activeJobs.slice(0, 3)); 
  } catch (err) {
    console.warn("Backend server offline. Loading Mock Data for Homepage.");
    renderHomepageJobs(mockManpowerJobs.slice(0, 3));
  }
});

// Function to render the compact homepage cards
function renderHomepageJobs(jobs) {
  const container = document.getElementById('latestJobs');
  
  if (jobs.length === 0) {
    container.innerHTML = `<div class="col-span-full bg-slate-50 p-10 rounded-3xl text-center border border-slate-200"><p class="font-black text-slate-500 uppercase tracking-widest">No open positions at the moment.</p></div>`;
    return;
  }

  container.innerHTML = jobs.map(job => {
    // UI Formatters
    const isUrgent = job.urgent ? `<span class="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse shrink-0">🔴 Urgent</span>` : '';
    
    const logoHTML = job.logoPath 
        ? `<img src="http://localhost:3000/${job.logoPath.replace(/\\/g, '/')}" alt="${job.company} Logo" class="w-14 h-14 rounded-xl object-contain border border-slate-200 shadow-sm p-1.5 bg-white shrink-0">` 
        : `<div class="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">🏢</div>`;

    const summary = job.roleSummary || job.description || job.desc || 'Details available on the job portal.';

    return `
      <div class="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group flex flex-col">
        
        <div class="flex justify-between items-start gap-4 mb-6">
          ${logoHTML}
          ${isUrgent}
        </div>
        
        <h3 class="font-heading text-xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 group-hover:text-brand-blue transition-colors line-clamp-2" title="${job.title}">${job.title}</h3>
        <p class="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6">${job.company} <br><span class="text-slate-400 mt-1 inline-block">📍 ${job.location}</span></p>
        
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Salary / CTC</p>
            <p class="font-black text-slate-800">${job.salary || 'Negotiable'}</p>
        </div>

        <p class="text-slate-600 text-sm font-medium leading-relaxed mb-8 line-clamp-3 flex-grow">${summary}</p>
        
        <a href="pages/jobs.html" class="mt-auto w-full px-6 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-brand-blue transition-colors uppercase tracking-widest text-xs flex justify-center items-center gap-2 shadow-md">
          View Details <span>→</span>
        </a>
      </div>
    `;
  }).join('');
}