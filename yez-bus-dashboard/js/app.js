// Yez Bus — Web Dashboard App Logic
// Centered around Holy Grace Academy, Mala, Kerala, India

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // App State
  const state = {
    currentView: "dashboard",
    routes: [...MOCK_ROUTES],
    buses: [...MOCK_BUSES],
    drivers: [...MOCK_DRIVERS],
    students: [...MOCK_STUDENTS],
    alerts: [...MOCK_ALERTS],
    trips: [
      { id: "TR-1001", busId: "KL-45-H-1001", routeId: "R-01", startLocation: "Kodungallur Temple", status: "Completed", delay: "On Time", date: "2026-07-02" },
      { id: "TR-1002", busId: "KL-45-H-1002", routeId: "R-02", startLocation: "Chalakudy Junction", status: "Completed", delay: "4 min late", date: "2026-07-02" },
      { id: "TR-1003", busId: "KL-45-H-1003", routeId: "R-03", startLocation: "Angamaly Stand", status: "Completed", delay: "On Time", date: "2026-07-02" },
      { id: "TR-1004", busId: "KL-45-H-1004", routeId: "R-04", startLocation: "Poyya Village Office", status: "Completed", delay: "On Time", date: "2026-07-02" },
      { id: "TR-1005", busId: "KL-45-H-1005", routeId: "R-05", startLocation: "Irinjalakuda Stand", status: "Completed", delay: "2 min late", date: "2026-07-02" },
      { id: "TR-1006", busId: "KL-45-H-1001", routeId: "R-01", startLocation: "Kodungallur Temple", status: "Completed", delay: "On Time", date: "2026-07-01" },
      { id: "TR-1007", busId: "KL-45-H-1002", routeId: "R-02", startLocation: "Chalakudy Junction", status: "Completed", delay: "On Time", date: "2026-07-01" },
      { id: "TR-1008", busId: "KL-45-H-1003", routeId: "R-03", startLocation: "Angamaly Stand", status: "Completed", delay: "6 min late", date: "2026-07-01" }
    ],
    selectedRoute: null,
    selectedStudent: null,
    selectedTripId: null,
    trackingBusId: null,
    maps: {
      routes: null,
      tracking: null
    },
    markers: {
      routes: [],
      tracking: {}
    },
    polylines: {
      routes: null
    },
    charts: {
      dispatch: null
    }
  };

  // -----------------------------------------
  // 1. ROUTER & VIEWS NAVIGATION
  // -----------------------------------------
  const viewTitles = {
    dashboard: { title: "Dashboard", subtitle: "Holy Grace Institution, Mala - Fleet Overview & Analytics" },
    routes: { title: "Route Optimization", subtitle: "Annual allocation, routing solver, & stop sequencing" },
    students: { title: "Student Transport Registry", subtitle: "Manage 4,000+ student allocations, bus passes, and boarding" },
    tracking: { title: "Live Vehicle Tracking", subtitle: "Real-time Transight GPS telemetry and route adherence monitoring" },
    trips: { title: "Trip Lifecycle Manager", subtitle: "Active dispatches, scheduling, and delay propagation tracking" },
    "trip-history": { title: "Trip History & Student Rosters", subtitle: "Auditing completed school bus journeys, vehicle status, and assigned student details" },
    drivers: { title: "Driver Behavior Dashboard", subtitle: "Safety compliance scorecard, harsh driving events, and ranking" },
    fleet: { title: "Fleet Management & Compliance", subtitle: "Vehicle registry, maintenance schedules, and document compliance" },
    alerts: { title: "System Alerts & Settings", subtitle: "Real-time telemetry event triggers, compliance logs, and thresholds" }
  };

  function switchView(viewId) {
    // Hide current view, show target view
    document.querySelectorAll(".view-container").forEach(el => el.classList.remove("active"));
    const targetViewEl = document.getElementById(`view-${viewId}`);
    if (targetViewEl) {
      targetViewEl.classList.add("active");
    }

    // Toggle active sidebar link
    document.querySelectorAll(".sidebar-link").forEach(link => {
      if (link.getAttribute("data-view") === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update Header Text
    document.getElementById("view-title").textContent = viewTitles[viewId].title;
    document.getElementById("view-subtitle").textContent = viewTitles[viewId].subtitle;

    state.currentView = viewId;

    // Trigger View-Specific Handlers
    handleViewActivation(viewId);
  }

  // Bind Sidebar Navigation
  document.querySelectorAll(".sidebar-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const viewId = link.getAttribute("data-view");
      switchView(viewId);
    });
  });

  function handleViewActivation(viewId) {
    if (viewId === "dashboard") {
      renderDashboardCounters();
      renderDashboardAlerts();
      initDashboardChart();
    } else if (viewId === "routes") {
      initRoutesMap();
      renderRoutesList();
    } else if (viewId === "students") {
      renderStudentsTable();
      renderStudentFilters();
    } else if (viewId === "tracking") {
      initTrackingMap();
      renderTrackingBusList();
    } else if (viewId === "trips") {
      renderTripLanes();
    } else if (viewId === "trip-history") {
      renderTripHistoryView();
    } else if (viewId === "drivers") {
      renderDriversCards();
    } else if (viewId === "fleet") {
      renderFleetCards();
    } else if (viewId === "alerts") {
      renderAlertsLog();
    }
  }

  // -----------------------------------------
  // 2. DASHBOARD VIEW LOGIC
  // -----------------------------------------
  function renderDashboardCounters() {
    const activeBuses = state.buses.filter(b => b.gpsStatus === "Online").length;
    const boarded = state.students.filter(s => s.boardingStatus === "Boarded" || s.boardingStatus === "Reached School").length;
    const critical = state.alerts.filter(a => a.severity === "critical" && !a.resolved).length;
    
    document.getElementById("dash-active-buses").textContent = activeBuses;
    document.getElementById("dash-boarded-students").textContent = boarded;
    document.getElementById("dash-completed-trips").textContent = "38 / 70";
    document.getElementById("dash-alerts-count").textContent = critical;

    // Pulse red if critical alerts > 0
    const alertWidget = document.getElementById("dash-alerts-count").parentElement.previousElementSibling;
    if (critical > 0) {
      alertWidget.classList.add("pulse-bg-red");
    } else {
      alertWidget.classList.remove("pulse-bg-red");
    }
  }

  function renderDashboardAlerts() {
    const container = document.getElementById("dash-alerts-timeline");
    container.innerHTML = "";
    
    const activeAlerts = state.alerts.filter(a => !a.resolved).slice(0, 3);
    
    if (activeAlerts.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-light); padding: 24px;">All systems running optimally. No active alerts.</div>`;
      return;
    }

    activeAlerts.forEach(alert => {
      const item = document.createElement("div");
      item.className = `alert-item ${alert.severity}`;
      item.innerHTML = `
        <div class="alert-item-content">
          <div class="alert-item-title">${alert.type.toUpperCase()}: ${alert.bus || "System"}</div>
          <div class="alert-item-desc">${alert.message}</div>
        </div>
        <div style="text-align: right;">
          <div class="alert-item-time">${alert.time}</div>
          <button class="btn btn-secondary btn-sm resolve-alert-btn" data-id="${alert.id}" style="padding: 2px 8px; font-size: 0.7rem; margin-top: 4px;">Resolve</button>
        </div>
      `;
      container.appendChild(item);
    });

    // Bind resolve buttons
    container.querySelectorAll(".resolve-alert-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const alertId = e.target.getAttribute("data-id");
        const alertIdx = state.alerts.findIndex(a => a.id === alertId);
        if (alertIdx !== -1) {
          state.alerts[alertIdx].resolved = true;
          renderDashboardAlerts();
          renderDashboardCounters();
          updateAlertBadge();
        }
      });
    });
  }

  function initDashboardChart() {
    const canvas = document.getElementById("tripDispatchChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (state.charts.dispatch) {
      state.charts.dispatch.destroy();
    }
    
    // Create Neon Burgundy Gradient
    const burgundyGradient = ctx.createLinearGradient(0, 0, 0, 250);
    burgundyGradient.addColorStop(0, 'rgba(225, 29, 72, 0.45)');   // Rose-Burgundy Highlight
    burgundyGradient.addColorStop(0.6, 'rgba(159, 18, 57, 0.15)');  // Deep Burgundy Mid
     burgundyGradient.addColorStop(1, 'rgba(76, 5, 25, 0.01)');      // Dark Fade Base
    
    state.charts.dispatch = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM'],
        datasets: [
          {
            label: 'Scheduled Dispatches',
            data: [5, 20, 50, 70, 70, 70],
            borderColor: '#94A3B8',
            borderDash: [5, 5],
            fill: false,
            tension: 0.1
          },
          {
            label: 'Actual Departures (Transight GPS)',
            data: [4, 18, 48, 68, 70, 70],
            borderColor: '#E11D48',
            backgroundColor: burgundyGradient,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#E11D48',
            pointBorderColor: '#FFF',
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 80,
            title: { display: true, text: 'Number of Active Buses' }
          }
        }
      }
    });
  }

  // -----------------------------------------
  // 3. ROUTE OPTIMIZATION LOGIC
  // -----------------------------------------
  function initRoutesMap() {
    if (state.maps.routes) return;
    
    state.maps.routes = L.map('routes-map').setView(SCHOOL_COORDS, 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(state.maps.routes);
  }

  function renderRoutesList() {
    const container = document.getElementById("routes-list");
    container.innerHTML = "";

    state.routes.forEach(route => {
      const card = document.createElement("div");
      card.className = `route-mini-card ${state.selectedRoute && state.selectedRoute.id === route.id ? 'active' : ''}`;
      card.innerHTML = `
        <div class="route-mini-card-header">
          <span class="route-mini-card-title">${route.name}</span>
          <span class="badge" style="background-color: ${route.color}15; color: ${route.color}; border: 1px solid ${route.color}50">${route.id}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Assigned Bus: ${route.busId}</div>
        <div class="route-mini-card-stats">
          <div><i data-lucide="navigation" style="width: 10px; height: 10px; display: inline; margin-right: 2px;"></i> ${route.distance}</div>
          <div><i data-lucide="clock" style="width: 10px; height: 10px; display: inline; margin-right: 2px;"></i> ${route.duration}</div>
          <div><i data-lucide="users" style="width: 10px; height: 10px; display: inline; margin-right: 2px;"></i> ${route.studentsCount}/${route.capacity}</div>
        </div>
      `;
      
      card.addEventListener("click", () => {
        selectRoute(route);
        // Highlight active card
        container.querySelectorAll(".route-mini-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      });
      
      container.appendChild(card);
    });
    
    // Select first route by default if none selected
    if (!state.selectedRoute && state.routes.length > 0) {
      selectRoute(state.routes[0]);
      container.querySelector(".route-mini-card").classList.add("active");
    }
    
    lucide.createIcons({ attrs: { class: 'lucide-route-icons' } });
  }

  function selectRoute(route) {
    state.selectedRoute = route;
    
    // Clear old route markers/lines
    state.markers.routes.forEach(m => state.maps.routes.removeLayer(m));
    state.markers.routes = [];
    
    if (state.polylines.routes) {
      state.maps.routes.removeLayer(state.polylines.routes);
    }

    // Plot school marker
    const schoolIcon = L.divIcon({
      html: `<div style="background-color: var(--dark-bg); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 2px solid var(--primary); font-weight: bold; box-shadow: 0 0 10px rgba(0,0,0,0.3);"><i data-lucide="school" style="width: 16px; height: 16px;"></i></div>`,
      className: 'school-map-marker',
      iconSize: [30, 30]
    });
    
    const schoolMarker = L.marker(SCHOOL_COORDS, { icon: schoolIcon }).addTo(state.maps.routes)
      .bindPopup("<b>Holy Grace Academy</b><br>Mala, Kerala");
    state.markers.routes.push(schoolMarker);

    // Plot Stops
    const stopCoords = [];
    route.stops.forEach((stop, index) => {
      const isSchool = index === route.stops.length - 1;
      if (isSchool) return; // School already plotted
      
      const stopIcon = L.divIcon({
        html: `<div style="background-color: var(--light-card); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${route.color}; border: 3px solid ${route.color}; font-weight: bold; font-size: 0.8rem; box-shadow: 0 0 8px rgba(0,0,0,0.2);">${index + 1}</div>`,
        className: 'stop-map-marker',
        iconSize: [24, 24]
      });

      // Query students boarding at this stop
      const stopStudents = state.students.filter(s => s.routeId === route.id && s.stopName === stop.name);

      let popupContent = `
        <div class="custom-leaflet-popup" style="min-width: 250px; max-width: 320px;">
          <div class="popup-title" style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: var(--primary);">Stop ${index + 1}: ${stop.name}</div>
          <div class="popup-row" style="font-size: 0.8rem; margin-bottom: 8px; color: var(--text-muted);">
            <b>Arrival:</b> ${stop.time} | <b>Boarding:</b> ${stopStudents.length} Students
          </div>
          <div style="border-top: 1px solid var(--light-border); padding-top: 8px; max-height: 150px; overflow-y: auto;">
            <table style="width: 100%; font-size: 0.75rem; border-collapse: collapse; text-align: left;">
              <thead>
                <tr style="color: var(--text-light); font-weight: 600;">
                  <th style="padding-bottom: 4px; padding-right: 8px;">Student</th>
                  <th style="padding-bottom: 4px; padding-right: 8px;">Class</th>
                  <th style="padding-bottom: 4px;">Parent Phone</th>
                </tr>
              </thead>
              <tbody>
      `;

      if (stopStudents.length === 0) {
        popupContent += `
          <tr>
            <td colspan="3" style="text-align: center; color: var(--text-light); padding: 8px 0;">No active student boarders.</td>
          </tr>
        `;
      } else {
        stopStudents.forEach(student => {
          popupContent += `
            <tr style="border-top: 1px solid #f1f5f9;">
              <td style="padding: 4px 8px 4px 0; font-weight: 600; color: var(--text-main);">${student.name}</td>
              <td style="padding: 4px 8px 4px 0; color: var(--text-muted);">${student.class}-${student.section}</td>
              <td style="padding: 4px 0; color: var(--text-muted); font-family: monospace; font-size: 0.7rem;">${student.parentPhone}</td>
            </tr>
          `;
        });
      }

      popupContent += `
              </tbody>
            </table>
          </div>
        </div>
      `;

      const marker = L.marker(stop.coords, { icon: stopIcon }).addTo(state.maps.routes)
        .bindPopup(popupContent, { minWidth: 260, maxWidth: 320 });
      state.markers.routes.push(marker);
      stopCoords.push(stop.coords);
    });
    
    stopCoords.push(SCHOOL_COORDS);

    // Draw route path line
    state.polylines.routes = L.polyline(stopCoords, {
      color: route.color,
      weight: 4,
      opacity: 0.8,
      dashArray: '5, 10'
    }).addTo(state.maps.routes);

    // Fit Map Bounds
    const bounds = L.latLngBounds(stopCoords);
    state.maps.routes.fitBounds(bounds, { padding: [40, 40] });

    // Render Stop Timeline at bottom
    renderStopsSequence(route);
    lucide.createIcons();
  }

  function renderStopsSequence(route) {
    const container = document.getElementById("stops-sequence-list");
    container.innerHTML = "";

    route.stops.forEach((stop, idx) => {
      const node = document.createElement("div");
      node.className = "stop-timeline";
      const isSchool = idx === route.stops.length - 1;
      
      node.innerHTML = `
        <div class="stop-node">
          <div class="stop-circle" style="border-color: ${route.color}; color: ${isSchool ? 'var(--primary)' : 'var(--text-main)'}">
            ${isSchool ? '<i data-lucide="school" style="width: 14px; height: 14px;"></i>' : idx + 1}
          </div>
          <div class="stop-line" style="background: ${idx < route.stops.length - 1 ? `linear-gradient(to right, ${route.color}, var(--light-border))` : 'transparent'}"></div>
          <div class="stop-info-card">
            <div class="stop-name">${stop.name}</div>
            <div class="stop-time">
              <i data-lucide="clock" style="width: 12px; height: 12px; color: var(--text-muted);"></i>
              <span>${stop.time}</span>
            </div>
            <span class="stop-boarders-badge" style="background-color: ${route.color}15; color: ${route.color}">
              +${stop.studentCount} boarders
            </span>
          </div>
        </div>
      `;
      container.appendChild(node);
    });
    lucide.createIcons();
  }

  // -----------------------------------------
  // 4. STUDENTS VIEW LOGIC
  // -----------------------------------------
  function renderStudentFilters() {
    // Populate Route Filters
    const routeSelect = document.getElementById("student-filter-route");
    routeSelect.innerHTML = `<option value="">All Routes</option>`;
    state.routes.forEach(r => {
      routeSelect.innerHTML += `<option value="${r.id}">${r.id} - ${r.name}</option>`;
    });

    // Populate Class Filters
    const classSelect = document.getElementById("student-filter-class");
    classSelect.innerHTML = `<option value="">All Classes</option>`;
    const uniqueClasses = [...new Set(state.students.map(s => s.class))].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    uniqueClasses.forEach(c => {
      classSelect.innerHTML += `<option value="${c}">Class ${c}</option>`;
    });

    // Bind filters input change
    document.getElementById("student-search-name").addEventListener("input", renderStudentsTable);
    document.getElementById("student-filter-class").addEventListener("change", renderStudentsTable);
    document.getElementById("student-filter-route").addEventListener("change", renderStudentsTable);
    document.getElementById("student-filter-status").addEventListener("change", renderStudentsTable);
  }

  function renderStudentsTable() {
    const searchVal = document.getElementById("student-search-name").value.toLowerCase();
    const classVal = document.getElementById("student-filter-class").value;
    const routeVal = document.getElementById("student-filter-route").value;
    const statusVal = document.getElementById("student-filter-status").value;

    const filtered = state.students.filter(student => {
      const matchSearch = student.name.toLowerCase().includes(searchVal) || student.id.toLowerCase().includes(searchVal);
      const matchClass = classVal === "" || student.class === classVal;
      const matchRoute = routeVal === "" || student.routeId === routeVal;
      const matchStatus = statusVal === "" || student.boardingStatus === statusVal;
      return matchSearch && matchClass && matchRoute && matchStatus;
    });

    const tbody = document.getElementById("students-table-body");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-light); padding: 40px;">No student records match filters.</td></tr>`;
      return;
    }

    filtered.slice(0, 50).forEach(student => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.className = state.selectedStudent && state.selectedStudent.id === student.id ? "selected-row" : "";
      
      let badgeClass = "badge-info";
      if (student.boardingStatus === "Boarded") badgeClass = "badge-warning";
      else if (student.boardingStatus === "Reached School") badgeClass = "badge-success";
      
      tr.innerHTML = `
        <td><b>${student.id}</b></td>
        <td>${student.name}</td>
        <td>Class ${student.class}-${student.section}</td>
        <td><span class="badge" style="background-color: var(--primary-light); color: var(--primary-hover);">${student.routeId}</span></td>
        <td>${student.stopName}</td>
        <td style="color: ${parseInt(student.rideTime) > 40 ? 'var(--danger)' : 'var(--text-main)'}; font-weight: 500;">
          ${student.rideTime}
        </td>
        <td><span class="badge ${badgeClass}">${student.boardingStatus}</span></td>
      `;
      
      tr.addEventListener("click", () => {
        selectStudent(student);
        tbody.querySelectorAll("tr").forEach(r => r.classList.remove("selected-row"));
        tr.classList.add("selected-row");
      });
      tbody.appendChild(tr);
    });

    if (filtered.length > 50) {
      const moreRow = document.createElement("tr");
      moreRow.innerHTML = `<td colspan="7" style="text-align: center; color: var(--text-muted); font-size: 0.8rem; background-color: var(--light-bg); padding: 8px;">Showing first 50 results of ${filtered.length}. Use filters to narrow search.</td>`;
      tbody.appendChild(moreRow);
    }
  }

  function selectStudent(student) {
    state.selectedStudent = student;
    const container = document.getElementById("student-digital-pass");
    
    // Draw Digital ID Pass
    container.innerHTML = `
      <div class="digital-pass">
        <div class="pass-header">
          <span class="pass-school">HOLY GRACE INSTITUTION</span>
          <span class="pass-title">BUS PASS</span>
        </div>
        <div class="pass-body">
          <img class="pass-avatar" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60" alt="Student Photo">
          <div class="pass-details">
            <span class="pass-name">${student.name}</span>
            <span class="pass-class">Class ${student.class} - Sec ${student.section}</span>
            <span style="font-size: 0.75rem; color: var(--primary); font-weight: bold; margin-top: 4px;">ID: ${student.id}</span>
          </div>
        </div>
        <div class="pass-meta">
          <div>
            <div style="color: var(--text-light); font-size: 0.65rem;">ROUTE</div>
            <div style="font-weight: 600;">${student.routeId}</div>
          </div>
          <div>
            <div style="color: var(--text-light); font-size: 0.65rem;">PICKUP STOP</div>
            <div style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;">${student.stopName}</div>
          </div>
          <div>
            <div style="color: var(--text-light); font-size: 0.65rem;">GUARDIAN</div>
            <div style="font-weight: 600;">${student.parentName.split(" ")[0]}</div>
          </div>
          <div>
            <div style="color: var(--text-light); font-size: 0.65rem;">RIDE TIME</div>
            <div style="font-weight: 600; color: ${parseInt(student.rideTime) > 40 ? 'var(--danger)' : 'var(--success)'};">${student.rideTime}</div>
          </div>
        </div>
        
        <!-- NFC/QR simulation footer -->
        <div style="margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; background-color: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">
          <div style="background-color: white; padding: 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
            <!-- Simulating QR Code with inline CSS patterns -->
            <div style="width: 80px; height: 80px; background-image: radial-gradient(var(--dark-bg) 20%, transparent 20%), radial-gradient(var(--dark-bg) 20%, transparent 20%); background-size: 8px 8px; background-position: 0 0, 4px 4px; background-color: white;"></div>
          </div>
          <span style="font-size: 0.65rem; color: var(--text-light);">Scan pass at vehicle check-in / check-out</span>
        </div>
      </div>
      
      <!-- Student Actions -->
      <div style="width: 100%; display: flex; flex-direction: column; gap: 8px; margin-top: 12px;">
        <button class="btn btn-secondary btn-sm" id="btn-edit-student" style="width: 100%;"><i data-lucide="edit"></i> Modify Assignment</button>
        <button class="btn btn-danger btn-sm" id="btn-opt-out-student" style="width: 100%;"><i data-lucide="user-minus"></i> Opt-out Transport</button>
      </div>
    `;
    
    lucide.createIcons();
    
    // Bind digital pass button triggers
    document.getElementById("btn-opt-out-student").addEventListener("click", () => {
      if (confirm(`Are you sure you want to opt-out ${student.name} from school bus services?`)) {
        const idx = state.students.findIndex(s => s.id === student.id);
        if (idx !== -1) {
          state.students.splice(idx, 1);
          state.selectedStudent = null;
          container.innerHTML = `<div style="text-align: center; color: var(--text-light); margin-top: 40px;"><i data-lucide="credit-card" style="width: 48px; height: 48px; margin-bottom: 12px;"></i><p>Select a student to display their digital bus pass</p></div>`;
          renderStudentsTable();
          renderDashboardCounters();
        }
      }
    });
  }

  // -----------------------------------------
  // 5. LIVE TRACKING VIEW LOGIC
  // -----------------------------------------
  function initTrackingMap() {
    if (state.maps.tracking) return;

    state.maps.tracking = L.map('live-tracking-map').setView(SCHOOL_COORDS, 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(state.maps.tracking);

    // Plot school marker
    const schoolIcon = L.divIcon({
      html: `<div style="background-color: var(--dark-bg); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 2.5px solid var(--primary);"><i data-lucide="school" style="width: 16px; height: 16px;"></i></div>`,
      className: 'school-map-marker',
      iconSize: [32, 32]
    });
    L.marker(SCHOOL_COORDS, { icon: schoolIcon }).addTo(state.maps.tracking).bindPopup("<b>Holy Grace Academy</b>");

    // Add geofence overlay circular limits around school
    L.circle(SCHOOL_COORDS, {
      color: 'var(--success)',
      fillColor: 'var(--success)',
      fillOpacity: 0.05,
      radius: 800 // 800 meters geofence radius
    }).addTo(state.maps.tracking).bindPopup("Holy Grace Safe Zone Geofence");

    // Plot and update active buses
    updateTrackingMarkers();

    // Start simulated movement loop
    startMovementSimulation();
  }

  function updateTrackingMarkers() {
    state.buses.forEach(bus => {
      // Choose icon color based on speed and alerts
      let markerColor = 'var(--success)'; // Green
      if (bus.gpsStatus === "Offline") markerColor = 'var(--text-light)'; // Grey
      else if (bus.gpsStatus === "Maintenance") markerColor = 'var(--warning)'; // Yellow
      
      const speedAlert = state.alerts.find(a => a.bus === bus.regNumber && a.type === "Speeding" && !a.resolved);
      const sosAlert = state.alerts.find(a => a.bus === bus.regNumber && a.type === "SOS" && !a.resolved);
      
      let badgeHtml = "";
      if (sosAlert) {
        markerColor = 'var(--danger)';
        badgeHtml = `<div class="pulse-marker-ring"></div>`;
      } else if (speedAlert) {
        markerColor = 'var(--warning)';
      }

      const busIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 32px; height: 32px;">
            ${badgeHtml}
            <div style="background-color: var(--dark-bg); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${markerColor}; border: 2.5px solid ${markerColor}; font-weight: bold; font-size: 0.75rem; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
              <i data-lucide="bus" style="width: 16px; height: 16px;"></i>
            </div>
          </div>
        `,
        className: 'bus-map-marker',
        iconSize: [32, 32]
      });

      if (state.markers.tracking[bus.id]) {
        state.markers.tracking[bus.id].setLatLng([bus.lat, bus.lng]);
        state.markers.tracking[bus.id].setPopupContent(getBusPopupHtml(bus));
      } else {
        const marker = L.marker([bus.lat, bus.lng], { icon: busIcon })
          .addTo(state.maps.tracking)
          .bindPopup(getBusPopupHtml(bus));
        
        state.markers.tracking[bus.id] = marker;
      }
    });

    lucide.createIcons();
  }

  function getBusPopupHtml(bus) {
    const route = state.routes.find(r => r.busId === bus.id);
    const driver = state.drivers.find(d => d.id === (route ? route.driverId : ''));
    return `
      <div class="custom-leaflet-popup">
        <div class="popup-title">${bus.regNumber}</div>
        <div class="popup-row"><b>Route:</b> ${route ? route.name : 'Unassigned'}</div>
        <div class="popup-row"><b>Driver:</b> ${driver ? driver.name : 'Unknown'}</div>
        <div class="popup-row"><b>Speed:</b> ${bus.speed} km/h</div>
        <div class="popup-row"><b>Tracker GPS:</b> <span class="badge ${bus.gpsStatus === 'Online' ? 'badge-success' : 'badge-danger'}" style="padding: 2px 6px; font-size: 0.65rem;">${bus.gpsStatus}</span></div>
      </div>
    `;
  }

  function renderTrackingBusList() {
    const searchVal = document.getElementById("tracking-search").value.toLowerCase();
    const container = document.getElementById("tracking-bus-list");
    container.innerHTML = "";

    const filtered = state.buses.filter(b => b.regNumber.toLowerCase().includes(searchVal));

    filtered.forEach(bus => {
      const item = document.createElement("div");
      item.className = `tracking-bus-item ${state.trackingBusId === bus.id ? 'active' : ''}`;
      
      let statusClass = "status-online";
      if (bus.gpsStatus === "Offline") statusClass = "status-offline";
      else if (bus.gpsStatus === "Maintenance") statusClass = "status-maintenance";

      const speedAlert = state.alerts.find(a => a.bus === bus.regNumber && a.type === "Speeding" && !a.resolved);
      const sosAlert = state.alerts.find(a => a.bus === bus.regNumber && a.type === "SOS" && !a.resolved);
      
      let alertBadge = "";
      if (sosAlert) alertBadge = `<span class="badge badge-danger" style="margin-left: auto; font-size: 0.6rem; animation: pulse-dot 1.5s infinite;">SOS</span>`;
      else if (speedAlert) alertBadge = `<span class="badge badge-warning" style="margin-left: auto; font-size: 0.6rem;">Speeding</span>`;

      item.innerHTML = `
        <div class="status-indicator ${statusClass}"></div>
        <div class="tracking-bus-details">
          <div class="tracking-bus-name">${bus.regNumber}</div>
          <div class="tracking-bus-meta">Speed: ${bus.speed} km/h • Odo: ${bus.serviceOdo}</div>
        </div>
        ${alertBadge}
      `;

      item.addEventListener("click", () => {
        state.trackingBusId = bus.id;
        container.querySelectorAll(".tracking-bus-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        
        // Pan map and open popup
        state.maps.tracking.setView([bus.lat, bus.lng], 14);
        state.markers.tracking[bus.id].openPopup();
      });

      container.appendChild(item);
    });

    document.getElementById("tracking-search").addEventListener("input", renderTrackingBusList);
  }

  // Real-time position simulation loop (Transight Simulator)
  function startMovementSimulation() {
    setInterval(() => {
      state.buses.forEach(bus => {
        if (bus.gpsStatus === "Online" && bus.speed > 0) {
          // Add micro adjustments to simulate driving
          const latOffset = (Math.random() - 0.5) * 0.0008;
          const lngOffset = (Math.random() - 0.5) * 0.0008;
          bus.lat += latOffset;
          bus.lng += lngOffset;
          
          // Randomize speed slightly
          bus.speed = Math.max(15, Math.min(65, bus.speed + Math.floor((Math.random() - 0.5) * 10)));
        }
      });

      if (state.currentView === "tracking" && state.maps.tracking) {
        updateTrackingMarkers();
        renderTrackingBusList();
      }
    }, 4000);
  }

  // -----------------------------------------
  // 6. TRIP MANAGEMENT LOGIC
  // -----------------------------------------
  function renderTripLanes() {
    const lanes = {
      notStarted: document.getElementById("lane-not-started"),
      inProgress: document.getElementById("lane-in-progress"),
      delayed: document.getElementById("lane-delayed"),
      completed: document.getElementById("lane-completed")
    };

    // Clear lanes
    Object.values(lanes).forEach(l => {
      const header = l.firstElementChild;
      l.innerHTML = "";
      l.appendChild(header);
    });

    let counts = { notStarted: 0, inProgress: 0, delayed: 0, completed: 0 };

    state.routes.forEach((route, idx) => {
      const bus = state.buses.find(b => b.id === route.busId);
      let status = "notStarted";
      let progress = 0;
      let stopLinesHtml = "";
      
      if (idx === 0) {
        status = "delayed";
        progress = 40;
        stopLinesHtml = `
          <div class="trip-stop-line"><span class="status-indicator status-online" style="margin-right: 4px; width: 6px; height: 6px;"></span> Covered: Pullut Bridge</div>
          <div class="trip-stop-line"><span class="status-indicator status-maintenance" style="margin-right: 4px; width: 6px; height: 6px;"></span> Delayed: Vellangallur</div>
        `;
      } else if (idx === 1 || idx === 4) {
        status = "inProgress";
        progress = 60;
        stopLinesHtml = `
          <div class="trip-stop-line"><span class="status-indicator status-online" style="margin-right: 4px; width: 6px; height: 6px;"></span> Next: Mala Town Hall</div>
        `;
      } else if (idx === 2) {
        status = "completed";
        progress = 100;
      }

      counts[status]++;

      const card = document.createElement("div");
      card.className = "trip-card";
      card.innerHTML = `
        <div class="trip-card-header">
          <span class="trip-bus-badge">${route.busId}</span>
          <span class="badge ${status === 'completed' ? 'badge-success' : status === 'delayed' ? 'badge-danger' : 'badge-info'}" style="font-size: 0.65rem;">${route.id}</span>
        </div>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">${route.name}</div>
        <div class="trip-progress-bar">
          <div class="trip-progress-fill" style="width: ${progress}%; background-color: ${status === 'delayed' ? 'var(--danger)' : 'var(--primary)'}"></div>
        </div>
        <div class="trip-card-stops">
          ${stopLinesHtml || '<div class="trip-stop-line">Route ready. Pending dispatch.</div>'}
        </div>
      `;

      lanes[status].appendChild(card);
    });

    // Update headers count badges
    document.getElementById("count-not-started").textContent = counts.notStarted;
    document.getElementById("count-in-progress").textContent = counts.inProgress;
    document.getElementById("count-delayed").textContent = counts.delayed;
    document.getElementById("count-completed").textContent = counts.completed;
  }

  // -----------------------------------------
  // 7. DRIVERS VIEW LOGIC
  // -----------------------------------------
  function renderDriversCards() {
    const container = document.getElementById("drivers-cards-container");
    container.innerHTML = "";

    state.drivers.forEach(driver => {
      const card = document.createElement("div");
      card.className = "driver-card";
      
      let scoreColorClass = "";
      if (driver.score >= 90) scoreColorClass = "";
      else if (driver.score >= 80) scoreColorClass = "medium";
      else scoreColorClass = "low";

      card.innerHTML = `
        <div class="driver-card-header">
          <img class="driver-photo" src="${driver.avatar}" alt="${driver.name}">
          <div class="driver-info-main">
            <span class="driver-name-text">${driver.name}</span>
            <span class="driver-status-pill badge ${driver.status === 'Active' ? 'badge-success' : 'badge-info'}">${driver.status}</span>
          </div>
        </div>
        <div class="driver-performance-score-sec">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">DRIVING COMPLIANCE</div>
            <div style="font-size: 0.85rem; color: var(--text-light); margin-top: 2px;">Transight Scorecard</div>
          </div>
          <span class="score-gauge ${scoreColorClass}">${driver.score}</span>
        </div>
        <div class="driver-metric-row">
          <div class="driver-metric-card" style="border-right: 1px solid var(--light-border);">
            <span class="driver-metric-val" style="color: var(--danger);">${driver.harshBrake}</span>
            <span class="driver-metric-lbl">Harsh Brakes</span>
          </div>
          <div class="driver-metric-card" style="border-right: 1px solid var(--light-border);">
            <span class="driver-metric-val" style="color: var(--warning);">${driver.speeding}</span>
            <span class="driver-metric-lbl">Over Speed</span>
          </div>
          <div class="driver-metric-card">
            <span class="driver-metric-val" style="color: var(--success);">${driver.onTimeRate}</span>
            <span class="driver-metric-lbl">On-Time</span>
          </div>
        </div>
        <div style="padding: 0 24px 24px 24px; display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" style="flex-grow: 1;"><i data-lucide="phone"></i> Call</button>
          <button class="btn btn-primary btn-sm driver-perf-btn" data-id="${driver.id}" style="flex-grow: 1;">Performance Log</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Bind performance log buttons click
    container.querySelectorAll(".driver-perf-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        openDriverPerformanceLog(id);
      });
    });

    lucide.createIcons();
  }

  // -----------------------------------------
  // 8. FLEET VIEW LOGIC
  // -----------------------------------------
  function renderFleetCards() {
    const container = document.getElementById("fleet-cards-container");
    container.innerHTML = "";

    state.buses.forEach(bus => {
      const card = document.createElement("div");
      card.className = "vehicle-card";
      
      let statusClass = "badge-success";
      if (bus.gpsStatus === "Offline") statusClass = "badge-danger";
      else if (bus.gpsStatus === "Maintenance") statusClass = "badge-warning";

      card.innerHTML = `
        <div class="vehicle-card-header">
          <span class="vehicle-reg">${bus.regNumber}</span>
          <span class="badge ${statusClass}">${bus.gpsStatus}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          <div>Capacity: <b>${bus.capacity} Students</b></div>
          <div style="margin-top: 4px;">Transight IMEI: <span style="font-family: monospace;">${bus.trackerIMEI}</span></div>
          <div style="margin-top: 4px;">Odometer: <b>${bus.serviceOdo}</b></div>
        </div>
        <div class="vehicle-card-actions" style="margin-top: 4px; border-top: 1px solid var(--light-border); padding-top: 16px;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">COMPLIANCE DOCUMENTS</div>
          <div class="doc-status-item">
            <span>Insurance Due:</span>
            <span style="font-weight: 600;">${bus.insuranceDue}</span>
          </div>
          <div class="doc-status-item" style="margin-top: 4px;">
            <span>Fitness Cert:</span>
            <span style="font-weight: 600;">${bus.fitnessDue}</span>
          </div>
          <div class="doc-status-item" style="margin-top: 4px;">
            <span>PUC Limit:</span>
            <span style="font-weight: 600; color: ${bus.docExpiry === 'Expired' ? 'var(--danger)' : 'var(--text-main)'}">${bus.pucDue}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // -----------------------------------------
  // 9. ALERTS LOG & SETTINGS LOGIC
  // -----------------------------------------
  function renderAlertsLog() {
    const container = document.getElementById("alerts-log-feed");
    container.innerHTML = "";

    const filtered = state.alerts;

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-light); padding: 40px;">No alerts logs found.</div>`;
      return;
    }

    filtered.forEach(alert => {
      const card = document.createElement("div");
      card.className = `alert-card ${alert.severity}`;
      
      let icon = "bell";
      if (alert.type === "SOS") icon = "alert-circle";
      else if (alert.type === "Speeding") icon = "gauge";
      else if (alert.type === "Deviation") icon = "navigation";

      card.innerHTML = `
        <div class="alert-icon-wrap alert-icon-${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'warning' : 'info'}">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="alert-body-area">
          <div class="alert-header-row">
            <span class="alert-title-text" style="color: ${alert.severity === 'critical' ? 'var(--danger)' : 'var(--text-main)'}">${alert.type.toUpperCase()}</span>
            <span style="font-size: 0.75rem; color: var(--text-light);">${alert.time}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${alert.message}</p>
          <div style="margin-top: 10px; display: flex; gap: 8px; justify-content: flex-end;">
            ${!alert.resolved ? `<button class="btn btn-secondary btn-sm resolve-btn-action" data-id="${alert.id}" style="padding: 2px 10px; font-size: 0.75rem;">Mark Resolved</button>` : '<span class="badge badge-success" style="font-size: 0.65rem;">Resolved</span>'}
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    lucide.createIcons();

    // Bind mark resolved actions
    container.querySelectorAll(".resolve-btn-action").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const alertIdx = state.alerts.findIndex(a => a.id === id);
        if (alertIdx !== -1) {
          state.alerts[alertIdx].resolved = true;
          renderAlertsLog();
          renderDashboardCounters();
          updateAlertBadge();
        }
      });
    });
  }

  function updateAlertBadge() {
    const unread = state.alerts.filter(a => !a.resolved).length;
    const badge = document.getElementById("header-alert-badge");
    if (unread > 0) {
      badge.style.display = "block";
    } else {
      badge.style.display = "none";
    }
  }

  // -----------------------------------------
  // 10. SIMULATOR TRIGGERS (TRANSIGHT GPS TELEMETRY)
  // -----------------------------------------
  
  // Speeding Simulation
  document.getElementById("sim-speeding-btn").addEventListener("click", () => {
    const randomBus = state.buses[Math.floor(Math.random() * state.buses.length)];
    const speed = Math.floor(65 + Math.random() * 20);
    
    // update bus speed
    randomBus.speed = speed;
    randomBus.gpsStatus = "Online";
    
    // insert alert
    const newAlert = {
      id: `A-${Date.now()}`,
      type: "Speeding",
      message: `Bus ${randomBus.regNumber} over-speeding (${speed} km/h in school zone limit 40 km/h)`,
      time: "Just now",
      severity: "high",
      resolved: false,
      bus: randomBus.regNumber,
      location: [randomBus.lat, randomBus.lng]
    };
    state.alerts.unshift(newAlert);
    
    alert(`[Transight GPS Alert] Over-speeding event simulated for bus ${randomBus.regNumber} at ${speed} km/h.`);
    updateAlertBadge();
    renderDashboardCounters();
    if (state.currentView === "alerts") renderAlertsLog();
  });

  // Deviation Simulation
  document.getElementById("sim-deviation-btn").addEventListener("click", () => {
    const randomBus = state.buses[Math.floor(Math.random() * state.buses.length)];
    
    // adjust lat/lng to force route deviation
    randomBus.lat += 0.015; 
    randomBus.lng += 0.015;
    
    const newAlert = {
      id: `A-${Date.now()}`,
      type: "Deviation",
      message: `Route deviation detected on Bus ${randomBus.regNumber} - Vehicle moved 1.2 km outside planned route envelope`,
      time: "Just now",
      severity: "medium",
      resolved: false,
      bus: randomBus.regNumber,
      location: [randomBus.lat, randomBus.lng]
    };
    state.alerts.unshift(newAlert);
    
    alert(`[Transight GPS Alert] Route deviation event simulated for bus ${randomBus.regNumber}.`);
    updateAlertBadge();
    renderDashboardCounters();
    if (state.currentView === "alerts") renderAlertsLog();
  });

  // SOS Simulation
  document.getElementById("sim-sos-btn").addEventListener("click", () => {
    const randomBus = state.buses[Math.floor(Math.random() * state.buses.length)];
    
    const newAlert = {
      id: `A-${Date.now()}`,
      type: "SOS",
      message: `CRITICAL: SOS Panic Button pressed on Bus ${randomBus.regNumber} at coordinates [${randomBus.lat.toFixed(4)}, ${randomBus.lng.toFixed(4)}]`,
      time: "Just now",
      severity: "critical",
      resolved: false,
      bus: randomBus.regNumber,
      location: [randomBus.lat, randomBus.lng]
    };
    state.alerts.unshift(newAlert);
    
    // Flash dashboard widget or notify
    alert(`[CRITICAL SOS SIGNAL] Emergency SOS signal received from driver on Bus ${randomBus.regNumber}!`);
    updateAlertBadge();
    renderDashboardCounters();
    if (state.currentView === "alerts") renderAlertsLog();
  });

  // Settings Sliders Labels Updates
  document.getElementById("slider-speed-limit").addEventListener("input", (e) => {
    document.getElementById("label-speed-limit").textContent = `${e.target.value} km/h`;
  });
  document.getElementById("slider-idle-limit").addEventListener("input", (e) => {
    document.getElementById("label-idle-limit").textContent = `${e.target.value} min`;
  });
  document.getElementById("slider-deviation-limit").addEventListener("input", (e) => {
    document.getElementById("label-deviation-limit").textContent = `${e.target.value} m`;
  });

  // Clear Alerts Trigger
  document.getElementById("btn-clear-alerts").addEventListener("click", () => {
    state.alerts.forEach(a => a.resolved = true);
    renderDashboardAlerts();
    renderDashboardCounters();
    updateAlertBadge();
    if (state.currentView === "alerts") renderAlertsLog();
  });

  // Manual Auto-Optimize Routes Wizard Trigger
  document.getElementById("btn-reoptimize").addEventListener("click", () => {
    alert("Running Yez Bus Route Optimization Engine...\n- Geocoding 150 student addresses...\n- Applying 45-minute maximum ride time constraints...\n- Reallocating buses based on seating capacities...\n\nOptimization complete! 5 routes optimized successfully.");
  });

  // ==========================================
  // BULK UPLOAD MODAL INTERACTION & SIMULATION
  // ==========================================
  const modalBulkUpload = document.getElementById("modal-bulk-upload");
  const btnBulkUploadTrigger = document.getElementById("btn-bulk-upload");
  const closeBulkUpload = document.getElementById("close-bulk-upload");
  const cancelBulkUpload = document.getElementById("cancel-bulk-upload");
  const dropzone = document.getElementById("dropzone");
  const bulkFileInput = document.getElementById("bulk-file-input");
  const fileIndicator = document.getElementById("file-indicator");
  const btnRunOpt = document.getElementById("btn-run-opt");
  const optProgress = document.getElementById("opt-progress");
  const optResults = document.getElementById("opt-results");
  const optProgressPercent = document.getElementById("opt-progress-percent");
  const optProgressBar = document.getElementById("opt-progress-bar");
  const optProgressStatus = document.getElementById("opt-progress-status");

  btnBulkUploadTrigger.addEventListener("click", () => {
    modalBulkUpload.classList.add("active");
    // Reset modal state
    dropzone.style.display = "flex";
    document.querySelector(".columns-mapping-section").style.display = "block";
    btnRunOpt.style.display = "inline-flex";
    btnRunOpt.disabled = true;
    fileIndicator.style.display = "none";
    optProgress.style.display = "none";
    optResults.style.display = "none";
    optProgressBar.style.width = "0%";
    optProgressPercent.textContent = "0%";
  });

  function closeModalBulk() {
    modalBulkUpload.classList.remove("active");
  }
  closeBulkUpload.addEventListener("click", closeModalBulk);
  cancelBulkUpload.addEventListener("click", closeModalBulk);

  // File drag & drop simulator
  dropzone.addEventListener("click", () => {
    bulkFileInput.click();
  });

  bulkFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      document.getElementById("file-name-text").textContent = file.name;
      fileIndicator.style.display = "flex";
      btnRunOpt.disabled = false;
    }
  });

  btnRunOpt.addEventListener("click", () => {
    // Hide upload triggers
    dropzone.style.display = "none";
    document.querySelector(".columns-mapping-section").style.display = "none";
    btnRunOpt.style.display = "none";
    cancelBulkUpload.style.display = "none";
    optProgress.style.display = "block";

    // Simulate Route Optimization Engine
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      optProgressBar.style.width = `${progress}%`;
      optProgressPercent.textContent = `${progress}%`;

      if (progress < 25) {
        optProgressStatus.textContent = "Parsing spreadsheet rows (4,821 records)...";
      } else if (progress < 55) {
        optProgressStatus.textContent = "Geocoding student home locations...";
      } else if (progress < 80) {
        optProgressStatus.textContent = "Clustering locations & balancing bus capacities...";
      } else if (progress < 95) {
        optProgressStatus.textContent = "Solving 45-minute travel constraint routing...";
      } else {
        optProgressStatus.textContent = "Optimizing route sequences...";
      }

      if (progress >= 100) {
        clearInterval(interval);
        optProgress.style.display = "none";
        optResults.style.display = "block";
        
        // Update Statistics
        document.getElementById("res-parsed").textContent = "4,821 students";
        document.getElementById("res-geocoded").textContent = "4,809 matched (99.7%)";
        document.getElementById("res-routes").textContent = "68 active routes";
        document.getElementById("res-avg-time").textContent = "28.4 minutes";

        // Update main dashboard values
        document.getElementById("dash-boarded-students").textContent = "4,809";
        document.getElementById("dash-completed-trips").textContent = "68 / 68";

        // Play brief success sound or flash
        alert("Route Optimization Strategy Complete!\nAll 4,809 students allocated across 68 balanced routes. No student travel duration exceeds 45 minutes one-way.");
        
        // Show close footer actions
        cancelBulkUpload.style.display = "block";
        cancelBulkUpload.textContent = "Close & Update Dashboard";
        cancelBulkUpload.className = "btn btn-primary";
        cancelBulkUpload.addEventListener("click", () => {
          closeModalBulk();
          // Reset cancel button
          cancelBulkUpload.textContent = "Cancel";
          cancelBulkUpload.className = "btn btn-secondary";
          // Re-render
          renderDashboardCounters();
        });
      }
    }, 100);
  });

  // ==========================================
  // INDIVIDUAL STUDENT ROUTING SOLVER LOGIC
  // ==========================================
  const modalAddStudent = document.getElementById("modal-add-student");
  const btnAddStudentTrigger = document.getElementById("btn-add-student");
  const closeAddStudent = document.getElementById("close-add-student");
  const cancelAddStudent = document.getElementById("cancel-add-student");
  const btnRunSolver = document.getElementById("btn-run-solver");
  const solverResults = document.getElementById("ind-solver-results");

  btnAddStudentTrigger.addEventListener("click", () => {
    modalAddStudent.classList.add("active");
    // Reset Form
    document.getElementById("individual-student-form").reset();
    solverResults.style.display = "none";
    btnRunSolver.textContent = "Solve & Allocate";
    btnRunSolver.disabled = false;
  });

  function closeModalAdd() {
    modalAddStudent.classList.remove("active");
  }
  closeAddStudent.addEventListener("click", closeModalAdd);
  cancelAddStudent.addEventListener("click", closeModalAdd);

  btnRunSolver.addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.getElementById("individual-student-form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById("ind-name").value;
    const cls = document.getElementById("ind-class").value;
    const div = document.getElementById("ind-division").value;
    const location = document.getElementById("ind-location").value;
    const guardian = document.getElementById("ind-guardian").value;
    const phone = document.getElementById("ind-phone").value;

    // Simulate Solver calculation based on location node
    btnRunSolver.textContent = "Running routing solver...";
    btnRunSolver.disabled = true;

    setTimeout(() => {
      let routeId = "R-05";
      let stopName = "Mala Private Bus Stand";
      let busId = "KL-45-H-5011";
      let rideTime = "14 mins";
      let capacityStr = "40 / 45 seats occupied";

      if (location.includes("Kodungallur")) {
        routeId = "R-01";
        stopName = "Kodungallur Temple Junction";
        busId = "KL-45-H-1024";
        rideTime = "38 mins";
        capacityStr = "43 / 50 seats occupied";
      } else if (location.includes("Vellangallur")) {
        routeId = "R-01";
        stopName = "Vellangallur Junction";
        busId = "KL-45-H-1024";
        rideTime = "23 mins";
        capacityStr = "43 / 50 seats occupied";
      } else if (location.includes("Chalakudy")) {
        routeId = "R-02";
        stopName = "Chalakudy Railway Station Stop";
        busId = "KL-45-H-4560";
        rideTime = "32 mins";
        capacityStr = "36 / 40 seats occupied";
      } else if (location.includes("Potta")) {
        routeId = "R-02";
        stopName = "Potta Bypass Corner";
        busId = "KL-45-H-4560";
        rideTime = "18 mins";
        capacityStr = "36 / 40 seats occupied";
      } else if (location.includes("Angamaly")) {
        routeId = "R-03";
        stopName = "Angamaly KSRTC Stand";
        busId = "KL-45-H-8921";
        rideTime = "44 mins";
        capacityStr = "49 / 50 seats occupied";
      } else if (location.includes("Kidangoor")) {
        routeId = "R-03";
        stopName = "Kidangoor Junction";
        busId = "KL-45-H-8921";
        rideTime = "34 mins";
        capacityStr = "49 / 50 seats occupied";
      } else if (location.includes("Irinjalakuda")) {
        routeId = "R-04";
        stopName = "Irinjalakuda Koodalmanikyam Temple";
        busId = "KL-45-H-3321";
        rideTime = "30 mins";
        capacityStr = "29 / 35 seats occupied";
      } else if (location.includes("Poyya")) {
        routeId = "R-05";
        stopName = "Poyya Village Office";
        busId = "KL-45-H-5011";
        rideTime = "22 mins";
        capacityStr = "40 / 45 seats occupied";
      }

      // Populate output details
      document.getElementById("ind-res-bus").textContent = busId;
      document.getElementById("ind-res-route").textContent = `${routeId} - ${MOCK_ROUTES.find(r=>r.id===routeId).name}`;
      document.getElementById("ind-res-stop").textContent = stopName;
      document.getElementById("ind-res-time").textContent = `${rideTime} (Safe < 45 min)`;
      document.getElementById("ind-res-capacity").textContent = capacityStr;

      // Show Results
      solverResults.style.display = "block";
      btnRunSolver.textContent = "Allocate & Close";
      btnRunSolver.disabled = false;

      // Click solver button again to commit addition and close
      btnRunSolver.onclick = (event) => {
        event.preventDefault();
        
        // Add new student to local database state
        const newStudentId = `ST-${1000 + state.students.length + 1}`;
        const newStudent = {
          id: newStudentId,
          name: name,
          class: cls,
          section: div,
          parentName: guardian,
          parentPhone: phone,
          address: `Ward ${Math.floor(1 + Math.random() * 15)}, Near ${stopName}, Mala, Thrissur`,
          coords: MOCK_ROUTES.find(r=>r.id===routeId).stops.find(s=>s.name===stopName).coords,
          routeId: routeId,
          stopName: stopName,
          rideTime: rideTime,
          boardingStatus: "Not Boarded",
          boardTime: "--",
          feeStatus: "Paid"
        };

        state.students.unshift(newStudent);
        
        // Increment route student count
        const routeObj = state.routes.find(r=>r.id===routeId);
        if (routeObj) {
          routeObj.studentsCount++;
        }

        // Reset onclick and close modal
        btnRunSolver.onclick = null;
        closeModalAdd();
        
        // Re-render student grid and update tables
        renderStudentsTable();
        renderDashboardCounters();
        
        alert(`Successfully allocated ${name} to Route ${routeId} at Stop: ${stopName}.`);
      };

    }, 800);
  });

  // ==========================================
  // DRIVER PERFORMANCE HISTORY LOG LOGIC
  // ==========================================
  const modalPerfLog = document.getElementById("modal-performance-log");
  const closePerfLog = document.getElementById("close-performance-log");
  const btnClosePerfLog = document.getElementById("btn-close-perf-log");

  window.openDriverPerformanceLog = function(driverId) {
    const driver = state.drivers.find(d => d.id === driverId);
    if (!driver) return;

    // Populate Bio Details
    document.getElementById("perf-driver-photo").src = driver.avatar;
    document.getElementById("perf-driver-name").textContent = driver.name;
    document.getElementById("perf-driver-meta").textContent = `License: ${driver.license} • Status: ${driver.status} • Phone: ${driver.phone}`;
    
    const scoreBadge = document.getElementById("perf-driver-score");
    scoreBadge.textContent = `Score: ${driver.score}`;
    scoreBadge.className = "badge";
    if (driver.score >= 90) scoreBadge.classList.add("badge-success");
    else if (driver.score >= 80) scoreBadge.classList.add("badge-warning");
    else scoreBadge.classList.add("badge-danger");

    document.getElementById("perf-driver-rating").innerHTML = `<i data-lucide="star" style="width: 14px; height: 14px; display: inline-block; vertical-align: text-top; fill: var(--warning); color: var(--warning);"></i> ${driver.rating}`;

    // Generate simulated events log timeline based on safety score
    const eventsContainer = document.getElementById("perf-log-events");
    eventsContainer.innerHTML = "";

    const timestampBase = new Date();
    const eventLogs = [];

    if (driver.score >= 95) {
      // Clean safety scorecard
      eventLogs.push(
        { time: "07:54 AM", type: "Trip Complete", desc: "Completed Route on time. No speeding or deceleration triggers recorded.", typeClass: "low" },
        { time: "07:38 AM", type: "Geofence Exit", desc: "Exited stop geofence zone: Kuruvilassery School Stop. Speed: 32 km/h.", typeClass: "low" },
        { time: "07:30 AM", type: "Trip Start", desc: "Ignition detected. Commenced morning pickup schedule.", typeClass: "low" },
        { time: "Yesterday", type: "Route Adherence", desc: "Perfect route sequence adherence (100% path coverage matching planned template).", typeClass: "low" }
      );
    } else if (driver.score >= 85) {
      // Moderate warnings
      eventLogs.push(
        { time: "07:44 AM", type: "Harsh Cornering", desc: "Vellangallur Corner: Lateral forces reached 0.48G. Rotation rate: 16 deg/s.", typeClass: "medium" },
        { time: "07:22 AM", type: "Excessive Idling", desc: "Idle duration reached 6 minutes at Pullut Bridge Stop with AC On.", typeClass: "medium" },
        { time: "07:15 AM", type: "Trip Start", desc: "Ignition detected. Commenced morning pickup schedule.", typeClass: "low" },
        { time: "Yesterday", type: "Harsh Braking", desc: "1 Harsh braking event detected at Kodungallur Temple bypass (0.55G).", typeClass: "medium" }
      );
    } else {
      // Multiple critical safety violations
      eventLogs.push(
        { time: "07:47 AM", type: "HARSH BRAKING", desc: "CRITICAL: sudden deceleration of 0.72G detected at Aloor Junction stop corridor.", typeClass: "critical" },
        { time: "07:32 AM", type: "OVER-SPEEDING", desc: "Speed warning: bus traveled at 58 km/h inside school perimeter speed-restricted zone.", typeClass: "high" },
        { time: "07:25 AM", type: "Harsh Cornering", desc: "Severe lateral sway (0.58G) at Irinjalakuda Koodalmanikyam Temple curve.", typeClass: "medium" },
        { time: "Yesterday", type: "HARSH BRAKING", desc: "2 Harsh braking events recorded during afternoon drop-off schedule.", typeClass: "high" },
        { time: "2 Days Ago", type: "Speeding Alert", desc: "Exceeded city speed limits (62 km/h in 40 km/h grid zone).", typeClass: "medium" }
      );
    }

    eventLogs.forEach(log => {
      const item = document.createElement("div");
      item.className = `alert-item ${log.typeClass}`;
      item.innerHTML = `
        <div class="alert-item-content">
          <div class="alert-item-title" style="font-weight: 700;">${log.type}</div>
          <div class="alert-item-desc">${log.desc}</div>
        </div>
        <div style="text-align: right; min-width: 80px;">
          <div class="alert-item-time" style="font-size: 0.75rem;">${log.time}</div>
        </div>
      `;
      eventsContainer.appendChild(item);
    });

    modalPerfLog.classList.add("active");
    lucide.createIcons();
  };

  function closeModalPerf() {
    modalPerfLog.classList.remove("active");
  }
  closePerfLog.addEventListener("click", closeModalPerf);
  btnClosePerfLog.addEventListener("click", closeModalPerf);

  // ==========================================
  // REGISTER VEHICLE MODAL FLOW
  // ==========================================
  const modalAddBus = document.getElementById("modal-add-bus");
  const btnAddBusTrigger = document.getElementById("btn-add-bus");
  const closeAddBus = document.getElementById("close-add-bus");
  const cancelAddBus = document.getElementById("cancel-add-bus");
  const btnSubmitBus = document.getElementById("btn-submit-bus");
  const busAssignDriver = document.getElementById("bus-assign-driver");

  btnAddBusTrigger.addEventListener("click", () => {
    // Populate Standby Drivers in dropdown
    busAssignDriver.innerHTML = `<option value="">-- Keep Unassigned (Standby) --</option>`;
    
    // Unassigned drivers are those not allocated in MOCK_ROUTES
    const assignedDriverIds = state.routes.map(r => r.driverId);
    const unassigned = state.drivers.filter(d => !assignedDriverIds.includes(d.id));

    unassigned.forEach(d => {
      busAssignDriver.innerHTML += `<option value="${d.id}">${d.name} (${d.status})</option>`;
    });

    document.getElementById("add-bus-form").reset();
    modalAddBus.classList.add("active");
  });

  function closeModalBus() {
    modalAddBus.classList.remove("active");
  }
  closeAddBus.addEventListener("click", closeModalBus);
  cancelAddBus.addEventListener("click", closeModalBus);

  btnSubmitBus.addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.getElementById("add-bus-form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const reg = document.getElementById("bus-reg").value;
    const capacity = parseInt(document.getElementById("bus-capacity").value);
    const imei = document.getElementById("bus-imei").value;
    const odo = document.getElementById("bus-odo").value;
    const ins = document.getElementById("bus-ins").value;
    const fit = document.getElementById("bus-fit").value;
    const puc = document.getElementById("bus-puc").value;
    const driverId = busAssignDriver.value;

    const newBusId = reg;
    const newBus = {
      id: newBusId,
      regNumber: reg,
      capacity: capacity,
      gpsStatus: "Online",
      trackerIMEI: imei,
      docExpiry: "Valid",
      insuranceDue: ins,
      fitnessDue: fit,
      pucDue: puc,
      serviceOdo: `${odo} km`,
      speed: 0,
      lat: SCHOOL_COORDS[0],
      lng: SCHOOL_COORDS[1]
    };

    state.buses.push(newBus);

    // If driver is assigned, generate a route or update mapping
    if (driverId) {
      // Create simulated standby route
      const newRouteId = `R-0${state.routes.length + 1}`;
      const newRoute = {
        id: newRouteId,
        name: `Local Route Route ${state.routes.length + 1}`,
        busId: newBusId,
        driverId: driverId,
        studentsCount: 0,
        capacity: capacity,
        distance: "12.0 km",
        duration: "25 min",
        status: "Active",
        color: "#EC4899", // Pink neon
        stops: [
          { name: "Mala Private Bus Stand", coords: [10.2162, 76.2942], time: "07:35 AM", studentCount: 0 },
          { name: "Holy Grace Academy", coords: SCHOOL_COORDS, time: "07:50 AM", studentCount: 0 }
        ]
      };
      state.routes.push(newRoute);

      // Update driver status to Active
      const dIdx = state.drivers.findIndex(d => d.id === driverId);
      if (dIdx !== -1) {
        state.drivers[dIdx].status = "Active";
      }
    }

    closeModalBus();
    renderFleetCards();
    renderDriversCards();
    renderDashboardCounters();
    alert(`Successfully registered school bus ${reg} to the platform${driverId ? ' and assigned driver' : ''}.`);
  });

  // ==========================================
  // ONBOARD DRIVER MODAL FLOW
  // ==========================================
  const modalAddDriver = document.getElementById("modal-add-driver");
  const btnAddDriverTrigger = document.getElementById("btn-add-driver-trigger");
  const closeAddDriver = document.getElementById("close-add-driver");
  const cancelAddDriver = document.getElementById("cancel-add-driver");
  const btnSubmitDriver = document.getElementById("btn-submit-driver");
  const driverAssignBus = document.getElementById("driver-assign-bus");

  btnAddDriverTrigger.addEventListener("click", () => {
    // Populate Unassigned Buses in dropdown
    driverAssignBus.innerHTML = `<option value="">-- Keep Standby (Unassigned) --</option>`;
    
    const assignedBusIds = state.routes.map(r => r.busId);
    const unassignedBuses = state.buses.filter(b => !assignedBusIds.includes(b.id));

    unassignedBuses.forEach(b => {
      driverAssignBus.innerHTML += `<option value="${b.id}">${b.regNumber} (Cap: ${b.capacity})</option>`;
    });

    document.getElementById("add-driver-form").reset();
    modalAddDriver.classList.add("active");
  });

  function closeModalDriver() {
    modalAddDriver.classList.remove("active");
  }
  closeAddDriver.addEventListener("click", closeModalDriver);
  cancelAddDriver.addEventListener("click", closeModalDriver);

  btnSubmitDriver.addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.getElementById("add-driver-form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById("driver-name").value;
    const status = document.getElementById("driver-status").value;
    const phone = document.getElementById("driver-phone").value;
    const license = document.getElementById("driver-license").value;
    let avatar = document.getElementById("driver-avatar").value;
    const busId = driverAssignBus.value;

    if (!avatar) {
      avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60"; // Default avatar
    }

    const newDriverId = `D-0${state.drivers.length + 1}`;
    const newDriver = {
      id: newDriverId,
      name: name,
      phone: phone,
      license: license,
      rating: 5.0,
      status: busId ? "Active" : status,
      score: 100, // Starts perfect
      harshBrake: 0,
      speeding: 0,
      cornering: 0,
      onTimeRate: "100%",
      avatar: avatar
    };

    state.drivers.push(newDriver);

    // If bus is assigned, create a route mapping
    if (busId) {
      const busObj = state.buses.find(b => b.id === busId);
      const newRouteId = `R-0${state.routes.length + 1}`;
      const newRoute = {
        id: newRouteId,
        name: `Local Route Route ${state.routes.length + 1}`,
        busId: busId,
        driverId: newDriverId,
        studentsCount: 0,
        capacity: busObj ? busObj.capacity : 40,
        distance: "10.5 km",
        duration: "22 min",
        status: "Active",
        color: "#EC4899",
        stops: [
          { name: "Mala Town Hall", coords: [10.2185, 76.2981], time: "07:40 AM", studentCount: 0 },
          { name: "Holy Grace Academy", coords: SCHOOL_COORDS, time: "07:52 AM", studentCount: 0 }
        ]
      };
      state.routes.push(newRoute);
    }

    closeModalDriver();
    renderDriversCards();
    renderFleetCards();
    renderDashboardCounters();
    alert(`Successfully onboarded driver ${name}${busId ? ' and assigned vehicle' : ''}.`);
  });

  // ==========================================
  // TRIP HISTORY & ROSTER AUDITS VIEW LOGIC
  // ==========================================
  function renderTripHistoryView() {
    const routeFilter = document.getElementById("history-filter-route");
    const busFilter = document.getElementById("history-filter-bus");

    // Populate route filter options if empty
    if (routeFilter && routeFilter.options.length <= 1) {
      routeFilter.innerHTML = `<option value="">All Routes</option>`;
      state.routes.forEach(r => {
        routeFilter.innerHTML += `<option value="${r.id}">${r.id} - ${r.name}</option>`;
      });
    }

    // Populate bus filter options if empty
    if (busFilter && busFilter.options.length <= 1) {
      busFilter.innerHTML = `<option value="">All Vehicles</option>`;
      state.buses.forEach(b => {
        busFilter.innerHTML += `<option value="${b.id}">${b.regNumber}</option>`;
      });
    }

    // Filter trips
    const selectedRouteId = routeFilter ? routeFilter.value : "";
    const selectedBusId = busFilter ? busFilter.value : "";
    
    const startDateVal = document.getElementById("history-filter-start-date") ? document.getElementById("history-filter-start-date").value : "";
    const endDateVal = document.getElementById("history-filter-end-date") ? document.getElementById("history-filter-end-date").value : "";

    const filteredTrips = state.trips.filter(t => {
      const matchRoute = !selectedRouteId || t.routeId === selectedRouteId;
      const matchBus = !selectedBusId || t.busId === selectedBusId;
      
      let matchDate = true;
      if (startDateVal) matchDate = matchDate && (t.date >= startDateVal);
      if (endDateVal) matchDate = matchDate && (t.date <= endDateVal);
      
      return matchRoute && matchBus && matchDate;
    });

    const tbody = document.getElementById("history-trips-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (filteredTrips.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light); padding: 24px;">No completed trips match selected parameters.</td></tr>`;
      return;
    }

    filteredTrips.forEach(trip => {
      const routeObj = state.routes.find(r => r.id === trip.routeId);
      const studentCount = state.students.filter(s => s.routeId === trip.routeId).length;
      
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.style.transition = "background-color var(--transition-fast)";
      if (state.selectedTripId === trip.id) {
        tr.style.backgroundColor = "rgba(225, 29, 72, 0.08)";
      }

      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--primary);">${trip.id}</td>
        <td><b>${trip.busId}</b></td>
        <td>${trip.routeId} - ${routeObj ? routeObj.name : 'Unknown'}</td>
        <td>${trip.startLocation}</td>
        <td style="font-weight: 600;">${studentCount} Students</td>
        <td>
          <span class="badge ${trip.delay.includes('late') ? 'badge-warning' : 'badge-success'}">
            ${trip.status} (${trip.delay})
          </span>
        </td>
      `;

      tr.addEventListener("click", () => {
        state.selectedTripId = trip.id;
        renderTripHistoryView();
        renderTripRoster(trip);
      });

      tbody.appendChild(tr);
    });

    // Auto-load details of the selected trip if visible, otherwise load first matching
    if (state.selectedTripId) {
      const activeTrip = state.trips.find(t => t.id === state.selectedTripId);
      if (activeTrip) {
        renderTripRoster(activeTrip);
      }
    } else if (filteredTrips.length > 0) {
      state.selectedTripId = filteredTrips[0].id;
      renderTripHistoryView();
    }
  }

  // Bind change listeners to history filters
  const routeHistFilter = document.getElementById("history-filter-route");
  if (routeHistFilter) routeHistFilter.addEventListener("change", renderTripHistoryView);
  
  const busHistFilter = document.getElementById("history-filter-bus");
  if (busHistFilter) busHistFilter.addEventListener("change", renderTripHistoryView);

  const startHistFilter = document.getElementById("history-filter-start-date");
  if (startHistFilter) startHistFilter.addEventListener("change", renderTripHistoryView);

  const endHistFilter = document.getElementById("history-filter-end-date");
  if (endHistFilter) endHistFilter.addEventListener("change", renderTripHistoryView);

  function renderTripRoster(trip) {
    const container = document.getElementById("history-roster-container");
    if (!container) return;

    const routeObj = state.routes.find(r => r.id === trip.routeId);
    const busObj = state.buses.find(b => b.id === trip.busId);
    const driverObj = state.drivers.find(d => d.id === (routeObj ? routeObj.driverId : ''));
    
    // Query students
    const rosterStudents = state.students.filter(s => s.routeId === trip.routeId);

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; height: 100%;">
        <div style="border-bottom: 1px solid var(--light-border); padding-bottom: 16px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">${trip.id} — Vehicle Student Roster</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; font-size: 0.8rem; line-height: 1.4;">
            <div><b>Vehicle:</b> ${trip.busId} (Cap: ${busObj ? busObj.capacity : 40})</div>
            <div><b>Route:</b> ${trip.routeId} - ${routeObj ? routeObj.name : 'Unknown'}</div>
            <div><b>Assigned Driver:</b> ${driverObj ? driverObj.name : 'Standby Driver'}</div>
            <div><b>Assigned Students:</b> ${rosterStudents.length} Boarders</div>
          </div>
        </div>

        <div class="search-box" style="width: 100%; border: none; box-shadow: var(--neo-sunken-sm);">
          <i data-lucide="search"></i>
          <input type="text" id="roster-search-input" placeholder="Search student by name or class...">
        </div>

        <div class="history-roster-students-list" id="roster-list-elements">
          <!-- Student cards generated below -->
        </div>
      </div>
    `;

    const listContainer = document.getElementById("roster-list-elements");

    function drawRosterList(filteredRoster) {
      listContainer.innerHTML = "";
      if (filteredRoster.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-light); padding: 40px 0;">No matching students found.</div>`;
        return;
      }

      filteredRoster.forEach(student => {
        const item = document.createElement("div");
        item.className = "roster-student-item";
        
        item.innerHTML = `
          <div class="roster-student-header">
            <div>
              <div class="roster-student-name">${student.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">ID: ${student.id} | Stop: ${student.stopName}</div>
            </div>
            <span class="roster-student-class">Class ${student.class}-${student.section}</span>
          </div>
          <div class="student-expanded-details" style="display: none;">
            <div class="student-detail-field">
              <span class="student-detail-lbl">Enrolled Date</span>
              <span class="student-detail-val">${student.enrolledDate || '2025-06-01'}</span>
            </div>
            <div class="student-detail-field">
              <span class="student-detail-lbl">Fee Status</span>
              <span class="student-detail-val" style="color: ${student.feeStatus === 'Paid' ? 'var(--success)' : 'var(--danger)'}; font-weight: bold;">
                ${student.feeStatus}
              </span>
            </div>
            <div class="student-detail-field">
              <span class="student-detail-lbl">Parent/Guardian</span>
              <span class="student-detail-val">${student.parentName}</span>
            </div>
            <div class="student-detail-field">
              <span class="student-detail-lbl">Parent Phone</span>
              <span class="student-detail-val">${student.parentPhone}</span>
            </div>
            <div class="student-detail-field" style="grid-column: span 2;">
              <span class="student-detail-lbl">Home Address Landmark</span>
              <span class="student-detail-val">${student.address}</span>
            </div>
            <div class="student-detail-field" style="grid-column: span 2;">
              <span class="student-detail-lbl">Boarding Log Status</span>
              <span class="student-detail-val" style="color: ${student.boardingStatus === 'Boarded' || student.boardingStatus === 'Reached School' ? 'var(--success)' : 'var(--text-muted)'}; font-weight: bold;">
                ${student.boardingStatus} (${student.boardTime})
              </span>
            </div>
          </div>
        `;

        item.addEventListener("click", (e) => {
          if (e.target.closest(".student-expanded-details")) return;
          
          const detailsPanel = item.querySelector(".student-expanded-details");
          const isHidden = detailsPanel.style.display === "none";
          
          // Collapse other active details in list
          listContainer.querySelectorAll(".student-expanded-details").forEach(p => {
            p.style.display = "none";
            p.parentElement.style.boxShadow = "var(--neo-raised-sm)";
          });

          if (isHidden) {
            detailsPanel.style.display = "grid";
            item.style.boxShadow = "var(--neo-sunken-sm)";
          } else {
            detailsPanel.style.display = "none";
            item.style.boxShadow = "var(--neo-raised-sm)";
          }
        });

        listContainer.appendChild(item);
      });
    }

    drawRosterList(rosterStudents);

    // Bind search roster filter input
    const searchInput = document.getElementById("roster-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.toLowerCase().trim();
        const filtered = rosterStudents.filter(s => 
          s.name.toLowerCase().includes(q) || 
          s.class.toLowerCase().includes(q) ||
          s.stopName.toLowerCase().includes(q)
        );
        drawRosterList(filtered);
      });
    }

    lucide.createIcons();
  }

  // Global Header Alerts Bell Click Action
  document.getElementById("alerts-trigger").addEventListener("click", () => {
    switchView("alerts");
  });

  // Initialize App
  switchView("dashboard");
  updateAlertBadge();
});
