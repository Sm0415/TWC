/* =========================================================
   TALENT WORLD CONNECT — global.js
   Shared utilities, nav, localStorage helpers
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle Logic
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
    });
  }

  // 2. Admin Link Visibility Logic
  const adminLink = document.getElementById('adminNavLink');
  if (adminLink && sessionStorage.getItem('twc_admin_auth') === 'true') {
    adminLink.classList.remove('hidden');
    adminLink.classList.add('block', 'lg:inline-block'); 
  }
});

// ---- TOAST UTILITY ----
window.showToast = function(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  });
};

// =========================================================
// COMPANY MODAL (GLOBAL PAGE)
// =========================================================

const companyData = {
  "TWC Recruitment Ltd.": {
    type: "Recruitment & Staffing",
    desc: "Specializes in global recruitment solutions connecting skilled workers with top employers across Europe and the Middle East.",
    location: "Sarajevo, Bosnia",
    email: "hr@twc.com",
    phone: "+387 61 616 422"
  },
  "TWC Construction Group": {
    type: "Infrastructure & Engineering",
    desc: "Provides manpower and project support for large-scale construction projects across UAE, Qatar, and Saudi Arabia.",
    location: "Dubai, UAE",
    email: "construction@twc.com",
    phone: "+971 50 000 0000"
  },
  "TWC Tech Solutions": {
    type: "IT & Software Services",
    desc: "Provides IT staffing, software development, and digital transformation services worldwide.",
    location: "Berlin, Germany",
    email: "tech@twc.com",
    phone: "+49 30 000 000"
  },
  "TWC Healthcare Services": {
    type: "Medical Recruitment",
    desc: "Supplies trained nurses, doctors, and healthcare professionals globally.",
    location: "London, UK",
    email: "healthcare@twc.com",
    phone: "+44 20 0000 0000"
  },
  "TWC Logistics": {
    type: "Supply Chain & Logistics",
    desc: "Handles workforce logistics, transportation, and supply chain management.",
    location: "Doha, Qatar",
    email: "logistics@twc.com",
    phone: "+974 4000 0000"
  },
  "TWC Hospitality Group": {
    type: "Hospitality & Tourism",
    desc: "Provides skilled staff for hotels, resorts, and tourism industries worldwide.",
    location: "Riyadh, Saudi Arabia",
    email: "hospitality@twc.com",
    phone: "+966 11 000 0000"
  }
};

// OPEN MODAL
window.openCompanyModal = function(name) {
  const data = companyData[name];
  if (!data) return;

  document.getElementById('companyName').innerText = name;
  document.getElementById('companyType').innerText = data.type;
  document.getElementById('companyDesc').innerText = data.desc;
  
  // Notice we stripped the emojis from the JS data and put them in the HTML instead for cleaner code
  document.getElementById('companyLocation').innerText = data.location;
  document.getElementById('companyEmail').innerText = data.email;
  document.getElementById('companyPhone').innerText = data.phone;

  const modal = document.getElementById('companyModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
};

// CLOSE MODAL
window.closeCompanyModal = function() {
  const modal = document.getElementById('companyModal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scrolling
};

// CLOSE ON OUTSIDE CLICK
document.addEventListener('click', function(e) {
  const modal = document.getElementById('companyModal');
  // Check if click was specifically on the dark overlay background
  if (modal && e.target === modal) {
    closeCompanyModal();
  }
});

// ---- JOB DATA STORE ----
window.TWC = window.TWC || {};

TWC.getJobs = function() {
  const raw = localStorage.getItem('twc_jobs');
  if (raw) return JSON.parse(raw);
  const defaults = [
    {
      id: 'j1',
      title: 'Senior Civil Engineer',
      location: 'Dubai, UAE',
      salary: '€5,500 – €7,000/mo',
      industry: 'Construction',
      description: 'We are looking for an experienced civil engineer to lead infrastructure projects in the UAE.',
      requirements: 'BSc Civil Engineering, 5+ years exp',
      expiry: '2026-06-30',
      posted: '2026-03-01',
      active: true
    }
  ];
  localStorage.setItem('twc_jobs', JSON.stringify(defaults));
  return defaults;
};

TWC.saveJobs = function(jobs) { localStorage.setItem('twc_jobs', JSON.stringify(jobs)); };
TWC.getJob = function(id) { return TWC.getJobs().find(j => j.id === id); };

TWC.getApplications = function() {
  const raw = localStorage.getItem('twc_applications');
  return raw ? JSON.parse(raw) : [];
};

TWC.saveApplication = function(app) {
  const apps = TWC.getApplications();
  apps.unshift(app);
  localStorage.setItem('twc_applications', JSON.stringify(apps));
};

TWC.getCallbacks = function() {
  const raw = localStorage.getItem('twc_callbacks');
  return raw ? JSON.parse(raw) : [];
};

TWC.saveCallback = function(cb) {
  const cbs = TWC.getCallbacks();
  cbs.unshift(cb);
  localStorage.setItem('twc_callbacks', JSON.stringify(cbs));
};

// ---- CALLBACK FORM SUBMISSION ----
window.submitCallback = function(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const cb = {
    id: 'cb' + Date.now(),
    name: fd.get('name'),
    phone: fd.get('phone'),
    email: fd.get('email'),
    interest: fd.get('interest'),
    date: new Date().toISOString()
  };
  TWC.saveCallback(cb);
  e.target.reset();
  showToast('✅ Callback request received! We\'ll contact you soon.', 'success');
};