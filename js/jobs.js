// js/jobs.js

let allJobs = [];

// ================= LOAD JOBS & FALLBACK DATA =================
document.addEventListener('DOMContentLoaded', async () => {
    
    // Realistic Manpower Mock Data with Detailed Fields & Documents
    const mockManpowerJobs = [
        {
            title: "Senior Civil Engineer",
            company: "Al-Futtaim Engineering",
            location: "Dubai, UAE",
            sector: "construction",
            type: "long-term",
            salary: "12,000 - 15,000 AED/mo",
            quantity: "15",
            urgent: true,
            perks: ["Flight", "Accommodation", "Medical"],
            desc: "Leading infrastructure projects in Dubai. Require minimum 8+ years Gulf experience.",
            responsibilities: "• Oversee massive structural builds.\n• Manage site subcontractors.\n• Ensure safety & compliance standards.",
            qualifications: "• BSc in Civil Engineering.\n• AutoCAD & Primavera proficiency.\n• 8+ years Gulf Experience.",
            documentUrl: "#", // Replace '#' with an actual PDF link when ready
            status: "Active"
        },
        {
            title: "ICU Registered Nurses (Female)",
            company: "King Fahd Medical City",
            location: "Riyadh, Saudi Arabia",
            sector: "healthcare",
            type: "long-term",
            salary: "5,000 - 7,000 SAR/mo",
            quantity: "50",
            urgent: true,
            perks: ["Flight", "Accommodation", "Food Allowance", "Transport", "Hotels"],
            desc: "Urgently seeking licensed ICU nurses. Prometric and Dataflow required.",
            responsibilities: "• Patient monitoring in critical care.\n• Administering IVs and medications.\n• Assisting physicians in emergencies.",
            qualifications: "• BSc Nursing.\n• Valid RN License.\n• ACLS/BLS certified.",
            documentUrl: "#",
            status: "Active"
        },
        
    ];

    try {
        const res = await fetch('http://localhost:3000/api/jobs');
        if (!res.ok) throw new Error("Server response not OK");
        
        const jobsData = await res.json();
        allJobs = jobsData.filter(job => job.status !== 'Done');
        
    } catch (err) {
        console.warn("Backend server offline. Loading Manpower Mock Data.");
        allJobs = mockManpowerJobs;
    }

    renderJobs(allJobs);
});

// ================= RENDER JOBS =================
function renderJobs(jobs) {
    const container = document.getElementById('jobListings');
    document.getElementById('jobCount').innerText = jobs.length;
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-12 rounded-[2rem] text-center border border-slate-200 shadow-sm">
                <div class="text-4xl mb-4">📭</div>
                <h3 class="font-heading text-xl font-bold text-slate-900 mb-2">No Vacancies Found</h3>
                <p class="text-slate-500 font-medium text-sm">Try adjusting your search filters or check back later.</p>
            </div>`;
        return;
    }

    container.innerHTML = jobs.map(job => {
        const isUrgent = job.urgent ? `<span class="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><span class="animate-pulse">🔴</span> Urgent Requirement</span>` : '';
        const qtyRequired = job.quantity ? `<span class="bg-blue-50 text-brand-blue border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Qty Required: ${job.quantity}</span>` : '';
        
        let perksHTML = '';
        if (job.perks && Array.isArray(job.perks)) {
            perksHTML = job.perks.map(p => {
                let icon = '✨';
                if(p.toLowerCase().includes('flight') || p.toLowerCase().includes('ticket')) icon = '✈️';
                if(p.toLowerCase().includes('accom')) icon = '🏢';
                if(p.toLowerCase().includes('food') || p.toLowerCase().includes('meal')) icon = '🍽️';
                if(p.toLowerCase().includes('medical') || p.toLowerCase().includes('health')) icon = '🏥';
                return `<span class="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">${icon} ${p}</span>`;
            }).join('');
        }

        // Check if there's a document/spec link provided
        const documentButton = job.documentUrl ? 
            `<a href="${job.documentUrl}" target="_blank" class="w-full sm:w-auto px-6 py-4 bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-xs flex justify-center items-center gap-2 shadow-sm shrink-0">
                📄 View Official Document
            </a>` : '';

        return `
            <div class="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                
                <div class="flex flex-wrap justify-between items-start gap-4 mb-5">
                    <div class="flex gap-2 flex-wrap">
                        ${isUrgent}
                        ${qtyRequired}
                        <span class="bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">${job.type === 'short-term' ? '⏳ Short-Term' : '📅 Long-Term'}</span>
                    </div>
                </div>

                <h3 class="font-heading text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 group-hover:text-brand-blue transition-colors">${job.title}</h3>
                <p class="text-brand-orange font-bold text-base uppercase tracking-widest mb-8">${job.company} <span class="text-slate-400 ml-2">📍 ${job.location}</span></p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Basic Salary / CTC</p>
                        <p class="font-black text-slate-800 text-xl">${job.salary}</p>
                    </div>
                    <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Provided Allowances</p>
                        <div class="flex flex-wrap gap-2">${perksHTML || '<span class="text-xs font-medium text-slate-500">Standard benefits apply</span>'}</div>
                    </div>
                </div>

                <div class="space-y-6 mb-8 border-t border-slate-100 pt-6">
                    <div>
                        <h4 class="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">Role Overview</h4>
                        <p class="text-slate-600 text-sm font-medium leading-relaxed">${job.desc || job.description || 'Detailed job description available upon application.'}</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">Key Responsibilities</h4>
                            <p class="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line">${job.responsibilities || 'Standard duties as per industry norm.'}</p>
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2">Required Qualifications</h4>
                            <p class="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line">${job.qualifications || 'Relevant trade certification or degree required.'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                    <button onclick="openApplyModal('${job.title}')" class="w-full sm:flex-1 px-6 py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-colors uppercase tracking-widest text-xs flex justify-center items-center gap-2 shadow-md">
                        Apply Now <span>→</span>
                    </button>
                    ${documentButton}
                </div>
            </div>
        `;
    }).join('');
}

// ================= QUICK SEARCH & FILTERS =================
window.quickSearch = function(keyword) {
    document.getElementById('searchInput').value = keyword;
    filterJobs();
}

window.clearFilters = function() {
    document.getElementById('searchInput').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('sortFilter').value = 'newest';
    
    document.querySelector('input[name="sector"][value=""]').checked = true;
    document.querySelectorAll('.type-filter').forEach(cb => cb.checked = true);
    
    filterJobs();
}

window.filterJobs = function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const loc = document.getElementById('locationFilter').value.toLowerCase();
    const sort = document.getElementById('sortFilter').value;
    
    const sectorRadio = document.querySelector('input[name="sector"]:checked');
    const sector = sectorRadio ? sectorRadio.value.toLowerCase() : '';
    
    const activeTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);

    let filtered = allJobs.filter(job => {
        const matchText = (job.title + " " + job.company).toLowerCase().includes(query);
        const matchLoc = loc === "" || (job.location && job.location.toLowerCase().includes(loc));
        const matchSector = sector === "" || (job.sector && job.sector.toLowerCase() === sector);
        const matchType = activeTypes.includes(job.type) || !job.type; 
        
        return matchText && matchLoc && matchSector && matchType;
    });

    if (sort === 'urgent') {
        filtered.sort((a, b) => (b.urgent === true) - (a.urgent === true));
    }

    renderJobs(filtered);
}
// ================= MODAL CONTROLS =================
window.openApplyModal = function(title) {
    document.getElementById('modalJobTitleText').textContent = title;
    document.getElementById('applyJobTitle').value = title;
    document.getElementById('applyModal').classList.add('open');
    document.body.style.overflow = 'hidden'; 
}

window.closeApplyModal = function() {
    document.getElementById('applyModal').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('applyForm').reset();
}

// ================= FORM SUBMISSION (EMAIL VIA WEB3FORMS) =================
window.submitApplication = async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending Application... ⏳';
    btn.disabled = true;

    const formData = new FormData(form);
    
    // >>> IMPORTANT: Put your Web3Forms Access Key here <<<
    formData.append("access_key", "da403217-db32-434c-993d-978655167fd4");
    formData.append("subject", "New Job Application: " + document.getElementById('applyJobTitle').value);

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST', 
            body: formData
        });
        
        if(res.ok) { 
            alert('✅ Application Successfully Submitted! Our recruitment team will review your CV and contact you via email shortly.'); 
            closeApplyModal(); 
        } else { 
            alert('❌ Processing Error. Please try again.'); 
        }
    } catch (err) { 
        alert('📡 Network error. Please check your connection and try again.');
    } finally { 
        btn.innerHTML = originalText; 
        btn.disabled = false; 
    }
}