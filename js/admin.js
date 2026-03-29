/* =========================================================
   TALENT WORLD CONNECT — admin.js
   Dashboard: jobs CRUD, applications, callbacks
   ========================================================= */

let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Date display
  document.getElementById('adminDate').textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Tab navigation
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      switchTab(tab);
    });
  });

  // Initial render
  updateOverview();
  renderAdminJobs();
  renderApplications();
  renderCallbacks();
});

function switchTab(tab) {
  document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById('pageTitle').textContent = {
    overview: 'Overview', jobs: 'Manage Jobs', applications: 'Applications', callbacks: 'Callback Requests'
  }[tab];
}

window.toggleSidebar = function() {
  document.getElementById('adminSidebar').classList.toggle('open');
};

// ---- OVERVIEW ----
function updateOverview() {
  const jobs  = TWC.getJobs().filter(j => j.active);
  const apps  = TWC.getApplications();
  const cbs   = TWC.getCallbacks();

  document.getElementById('totalJobs').textContent = jobs.length;
  document.getElementById('totalApps').textContent = apps.length;
  document.getElementById('totalCallbacks').textContent = cbs.length;

  const tbody = document.getElementById('recentAppsBody');
  const recent = apps.slice(0, 8);
  tbody.innerHTML = recent.length ? recent.map(a => `
    <tr>
      <td><strong>${a.firstName} ${a.lastName}</strong></td>
      <td>${a.jobTitle}</td>
      <td><a href="mailto:${a.email}" style="color:var(--blue)">${a.email}</a></td>
      <td>${new Date(a.date).toLocaleDateString('en-GB')}</td>
      <td><span class="status-badge status-${a.status.toLowerCase()}">${a.status}</span></td>
    </tr>
  `).join('') : `<tr><td colspan="5" class="admin-empty">No applications yet.</td></tr>`;
}

// ---- JOBS ----
window.renderAdminJobs = function() {
  const search = (document.getElementById('jobSearchAdmin')?.value || '').toLowerCase();
  let jobs = TWC.getJobs();
  if (search) jobs = jobs.filter(j => j.title.toLowerCase().includes(search) || j.industry.toLowerCase().includes(search));

  const tbody = document.getElementById('adminJobsBody');
  tbody.innerHTML = jobs.length ? jobs.map(job => `
    <tr>
      <td><strong>${job.title}</strong></td>
      <td><span class="status-badge" style="background:${hexToLight(TWC.industryColor[job.industry]||'#1565C0')};color:${TWC.industryColor[job.industry]||'#1565C0'}">${job.industry}</span></td>
      <td>${job.location}</td>
      <td>${job.salary}</td>
      <td>${new Date(job.expiry).toLocaleDateString('en-GB')}</td>
      <td><span class="status-badge ${job.active ? 'status-active' : 'status-draft'}">${job.active ? 'Active' : 'Draft'}</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap;padding:10px 18px">
        <button class="action-btn action-edit" onclick="editJob('${job.id}')">Edit</button>
        <button class="action-btn action-toggle" onclick="toggleJobStatus('${job.id}')">${job.active ? 'Unpublish' : 'Publish'}</button>
        <button class="action-btn action-delete" onclick="promptDelete('${job.id}')">Delete</button>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="7" class="admin-empty">No jobs found.</td></tr>`;
};

function hexToLight(hex) {
  return hex + '18';
}

window.openJobForm = function() {
  document.getElementById('jobFormTitle').textContent = 'Post New Job';
  document.getElementById('editJobId').value = '';
  document.getElementById('jobForm').reset();
  document.getElementById('fExpiry').min = new Date().toISOString().split('T')[0];
  document.getElementById('jobFormPanel').style.display = 'block';
  document.getElementById('jobFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.closeJobForm = function() {
  document.getElementById('jobFormPanel').style.display = 'none';
};

window.editJob = function(id) {
  const job = TWC.getJob(id);
  if (!job) return;
  document.getElementById('jobFormTitle').textContent = 'Edit Job';
  document.getElementById('editJobId').value = id;
  document.getElementById('fTitle').value = job.title;
  document.getElementById('fIndustry').value = job.industry;
  document.getElementById('fLocation').value = job.location;
  document.getElementById('fSalary').value = job.salary;
  document.getElementById('fDescription').value = job.description;
  document.getElementById('fRequirements').value = job.requirements;
  document.getElementById('fExpiry').value = job.expiry;
  document.getElementById('fActive').value = String(job.active);
  document.getElementById('jobFormPanel').style.display = 'block';
  document.getElementById('jobFormPanel').scrollIntoView({ behavior: 'smooth' });
};

window.saveJob = function(e) {
  e.preventDefault();
  const editId = document.getElementById('editJobId').value;
  const jobs = TWC.getJobs();

  const jobData = {
    id:           editId || 'j' + Date.now(),
    title:        document.getElementById('fTitle').value,
    industry:     document.getElementById('fIndustry').value,
    location:     document.getElementById('fLocation').value,
    salary:       document.getElementById('fSalary').value,
    description:  document.getElementById('fDescription').value,
    requirements: document.getElementById('fRequirements').value,
    expiry:       document.getElementById('fExpiry').value,
    active:       document.getElementById('fActive').value === 'true',
    posted:       editId ? (TWC.getJob(editId)?.posted || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]
  };

  if (editId) {
    const idx = jobs.findIndex(j => j.id === editId);
    if (idx > -1) jobs[idx] = jobData;
  } else {
    jobs.unshift(jobData);
  }

  TWC.saveJobs(jobs);
  closeJobForm();
  renderAdminJobs();
  updateOverview();
  showToast(editId ? '✅ Job updated successfully.' : '✅ New job posted!', 'success');
};

window.toggleJobStatus = function(id) {
  const jobs = TWC.getJobs();
  const job = jobs.find(j => j.id === id);
  if (job) { job.active = !job.active; TWC.saveJobs(jobs); }
  renderAdminJobs();
  updateOverview();
  showToast(`Job ${job?.active ? 'published' : 'unpublished'}.`, 'success');
};

window.promptDelete = function(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').style.display = 'flex';
};

window.closeDeleteModal = function(e) {
  if (!e || e.target.id === 'deleteModal' || !e.target) {
    document.getElementById('deleteModal').style.display = 'none';
    deleteTargetId = null;
  }
};

window.confirmDelete = function() {
  if (!deleteTargetId) return;
  const jobs = TWC.getJobs().filter(j => j.id !== deleteTargetId);
  TWC.saveJobs(jobs);
  closeDeleteModal();
  renderAdminJobs();
  updateOverview();
  showToast('Job deleted.', 'error');
};

// ---- APPLICATIONS ----
window.renderApplications = function() {
  const search = (document.getElementById('appSearch')?.value || '').toLowerCase();
  const statusF = document.getElementById('appStatusFilter')?.value || '';
  let apps = TWC.getApplications();
  if (search) apps = apps.filter(a => (a.firstName + ' ' + a.lastName).toLowerCase().includes(search) || a.jobTitle.toLowerCase().includes(search));
  if (statusF) apps = apps.filter(a => a.status === statusF);

  const tbody = document.getElementById('applicationsBody');
  tbody.innerHTML = apps.length ? apps.map(a => `
    <tr>
      <td><strong>${a.firstName} ${a.lastName}</strong><br/><span style="font-size:12px;color:var(--text-muted)">${a.nationality || ''}</span></td>
      <td>${a.jobTitle}</td>
      <td>
        <a href="mailto:${a.email}" style="color:var(--blue);font-size:13px">${a.email}</a><br/>
        <span style="font-size:13px;color:var(--text-muted)">${a.phone}</span>
      </td>
      <td style="font-size:13px">${a.currentLocation || '—'}</td>
      <td><span style="font-size:12px;color:var(--green)">📄 ${a.cvName || 'CV uploaded'}</span></td>
      <td style="font-size:13px">${new Date(a.date).toLocaleDateString('en-GB')}</td>
      <td>
        <select class="status-select" onchange="updateAppStatus('${a.id}', this.value)" style="font-size:12px;padding:4px 8px;border-radius:4px">
          ${['New','Reviewed','Shortlisted','Rejected'].map(s => `<option ${a.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
      <td><a href="mailto:${a.email}?subject=Re: ${encodeURIComponent(a.jobTitle)} Application" class="action-btn action-edit" style="text-decoration:none">Reply</a></td>
    </tr>
  `).join('') : `<tr><td colspan="8" class="admin-empty">No applications found.</td></tr>`;
};

window.updateAppStatus = function(id, status) {
  const apps = TWC.getApplications();
  const app = apps.find(a => a.id === id);
  if (app) { app.status = status; localStorage.setItem('twc_applications', JSON.stringify(apps)); }
  showToast(`Status updated to "${status}".`, 'success');
};

// ---- CALLBACKS ----
function renderCallbacks() {
  const cbs = TWC.getCallbacks();
  const tbody = document.getElementById('callbacksBody');
  tbody.innerHTML = cbs.length ? cbs.map(cb => `
    <tr>
      <td><strong>${cb.name}</strong></td>
      <td><a href="tel:${cb.phone}" style="color:var(--blue)">${cb.phone}</a></td>
      <td><a href="mailto:${cb.email}" style="color:var(--blue)">${cb.email}</a></td>
      <td><span class="status-badge status-new">${cb.interest || 'General'}</span></td>
      <td>${new Date(cb.date).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</td>
    </tr>
  `).join('') : `<tr><td colspan="5" class="admin-empty">No callback requests yet.</td></tr>`;
}
