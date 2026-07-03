/* ====================================
   STERLING GOLD DASHBOARD - JAVASCRIPT
   ==================================== */

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadSamplesFromStorage();
    setupEventListeners();
    updateStats();
    setTodayDate();
});

// ====================================
// INITIALIZATION FUNCTIONS
// ====================================

function initializeDashboard() {
    console.log('Sterling Gold Dashboard Initialized');
    const reportDate = document.getElementById('reportDate');
    reportDate.valueAsDate = new Date();
}

function setTodayDate() {
    const sampleDate = document.getElementById('sampleDate');
    const today = new Date().toISOString().split('T')[0];
    sampleDate.value = today;
}

function setupEventListeners() {
    // Form submission
    document.getElementById('sampleForm').addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('keyup', performSearch);
    
    // Auto-calculate on form input
    document.getElementById('tonnage').addEventListener('change', updateAutoCalculations);
    document.getElementById('assayResults').addEventListener('change', updateAutoCalculations);
    document.getElementById('samplePrice').addEventListener('change', updateAutoCalculations);
}

// ====================================
// FORM HANDLING & VALIDATION
// ====================================

function handleFormSubmit(event) {
    event.preventDefault();
    
    const sample = collectFormData();
    
    if (!validateSample(sample)) {
        showAlert('Please fill in all required fields correctly', 'danger');
        return;
    }
    
    // Auto-generate Sample ID if not provided
    if (!sample.sampleID || sample.sampleID.trim() === '') {
        sample.sampleID = generateSampleID();
    }
    
    // Calculate Au Content (Tonnage * Assay Results)
    sample.auContent = parseFloat((sample.tonnage * sample.assayResults).toFixed(2));
    
    // Calculate Gold Value (Au Content in grams converted to oz, then multiplied by price)
    // 1 ounce = 31.1035 grams
    const auOunces = sample.auContent / 31.1035;
    sample.goldValue = parseFloat((auOunces * sample.samplePrice).toFixed(2));
    
    // Calculate Total Cost
    sample.totalCost = parseFloat((sample.tonnage * sample.costPerTon).toFixed(2));
    
    // Calculate Net Value
    sample.netValue = parseFloat((sample.goldValue - sample.totalCost).toFixed(2));
    
    // Add timestamp
    sample.timestamp = new Date().toISOString();
    
    // Save to storage
    saveSampleToStorage(sample);
    
    // Update display
    addSampleToTable(sample);
    updateStats();
    
    // Reset form
    event.target.reset();
    setTodayDate();
    
    showAlert('✓ Sample added successfully!', 'success');
}

function collectFormData() {
    return {
        sampleDate: document.getElementById('sampleDate').value,
        mineName: document.getElementById('mineName').value,
        mineArea: document.getElementById('mineArea').value,
        sampleID: document.getElementById('sampleID').value,
        tonnage: parseFloat(document.getElementById('tonnage').value) || 0,
        assumedGrade: parseFloat(document.getElementById('assumedGrade').value) || 0,
        assayResults: parseFloat(document.getElementById('assayResults').value) || 0,
        geoLat: parseFloat(document.getElementById('geoLat').value) || 0,
        geoLon: parseFloat(document.getElementById('geoLon').value) || 0,
        samplePrice: parseFloat(document.getElementById('samplePrice').value) || 0,
        costPerTon: parseFloat(document.getElementById('costPerTon').value) || 0,
        commentary: document.getElementById('commentary').value
    };
}

function validateSample(sample) {
    return sample.sampleDate && 
           sample.mineName && 
           sample.mineArea && 
           sample.tonnage > 0 && 
           sample.assumedGrade >= 0 &&
           sample.assayResults >= 0 && 
           sample.geoLat && 
           sample.geoLon && 
           sample.costPerTon >= 0;
}

function generateSampleID() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SG-${year}${month}${day}-${random}`;
}

function updateAutoCalculations() {
    const tonnage = parseFloat(document.getElementById('tonnage').value) || 0;
    const assayResults = parseFloat(document.getElementById('assayResults').value) || 0;
    const samplePrice = parseFloat(document.getElementById('samplePrice').value) || 0;
    const costPerTon = parseFloat(document.getElementById('costPerTon').value) || 0;
    
    // Au Content calculation
    const auContent = (tonnage * assayResults).toFixed(2);
    
    // Gold Value calculation
    const auOunces = (auContent / 31.1035).toFixed(4);
    const goldValue = (auOunces * samplePrice).toFixed(2);
    
    // Total Cost
    const totalCost = (tonnage * costPerTon).toFixed(2);
    
    // Net Value
    const netValue = (goldValue - totalCost).toFixed(2);
    
    console.log(`Au Content: ${auContent}g, Gold Value: $${goldValue}, Net: $${netValue}`);
}

// ====================================
// STORAGE FUNCTIONS
// ====================================

function saveSampleToStorage(sample) {
    let samples = getSamplesFromStorage();
    samples.push(sample);
    localStorage.setItem('sterlingGoldSamples', JSON.stringify(samples));
}

function getSamplesFromStorage() {
    const data = localStorage.getItem('sterlingGoldSamples');
    return data ? JSON.parse(data) : [];
}

function loadSamplesFromStorage() {
    const samples = getSamplesFromStorage();
    const tbody = document.getElementById('samplesTableBody');
    tbody.innerHTML = '';
    samples.forEach(sample => addSampleToTable(sample));
}

function deleteSampleFromStorage(index) {
    if (confirm('Are you sure you want to delete this sample?')) {
        let samples = getSamplesFromStorage();
        samples.splice(index, 1);
        localStorage.setItem('sterlingGoldSamples', JSON.stringify(samples));
        loadSamplesFromStorage();
        updateStats();
        showAlert('✓ Sample deleted successfully!', 'success');
    }
}

function clearAllData() {
    if (confirm('⚠️ WARNING: This will permanently delete ALL sample data. Are you sure?')) {
        if (confirm('This action cannot be undone. Click OK again to confirm.')) {
            localStorage.removeItem('sterlingGoldSamples');
            loadSamplesFromStorage();
            updateStats();
            showAlert('✓ All data cleared!', 'success');
        }
    }
}

// ====================================
// TABLE FUNCTIONS
// ====================================

function addSampleToTable(sample) {
    const tbody = document.getElementById('samplesTableBody');
    const index = getSamplesFromStorage().findIndex(s => s.timestamp === sample.timestamp);
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${sample.sampleDate}</td>
        <td>${sample.mineName}</td>
        <td>${sample.mineArea}</td>
        <td>${sample.sampleID}</td>
        <td>${parseFloat(sample.tonnage).toFixed(2)}</td>
        <td>${parseFloat(sample.assumedGrade).toFixed(2)}</td>
        <td>${parseFloat(sample.assayResults).toFixed(2)}</td>
        <td>${sample.geoLat.toFixed(4)}, ${sample.geoLon.toFixed(4)}</td>
        <td><strong>${sample.auContent.toFixed(2)}</strong></td>
        <td>$${sample.goldValue.toFixed(2)}</td>
        <td>$${sample.totalCost.toFixed(2)}</td>
        <td><strong>${sample.netValue > 0 ? '+' : ''}$${sample.netValue.toFixed(2)}</strong></td>
        <td title="${sample.commentary}">${sample.commentary.substring(0, 30)}${sample.commentary.length > 30 ? '...' : ''}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-delete" onclick="deleteSampleFromStorage(${index})">Delete</button>
            </div>
        </td>
    `;
    tbody.appendChild(row);
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#samplesTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// ====================================
// STATISTICS & CALCULATIONS
// ====================================

function updateStats() {
    const samples = getSamplesFromStorage();
    
    if (samples.length === 0) {
        resetStats();
        return;
    }
    
    const totalSamples = samples.length;
    const totalAuContent = samples.reduce((sum, s) => sum + s.auContent, 0);
    const totalTonnage = samples.reduce((sum, s) => sum + s.tonnage, 0);
    const avgGrade = samples.reduce((sum, s) => sum + s.assumedGrade, 0) / totalSamples;
    const totalValue = samples.reduce((sum, s) => sum + s.goldValue, 0);
    
    document.getElementById('totalSamples').textContent = totalSamples;
    document.getElementById('totalAuContent').textContent = totalAuContent.toFixed(2);
    document.getElementById('totalTonnage').textContent = totalTonnage.toFixed(2);
    document.getElementById('avgGrade').textContent = avgGrade.toFixed(2);
    document.getElementById('totalValue').textContent = '$' + totalValue.toFixed(2);
    
    // Update last updated timestamp
    updateLastModified();
}

function resetStats() {
    document.getElementById('totalSamples').textContent = '0';
    document.getElementById('totalAuContent').textContent = '0.00';
    document.getElementById('totalTonnage').textContent = '0.00';
    document.getElementById('avgGrade').textContent = '0.00';
    document.getElementById('totalValue').textContent = '$0.00';
}

function updateLastModified() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdated').textContent = formatted;
}

// ====================================
// REPORT GENERATION
// ====================================

function generateDailyReport() {
    const reportDate = document.getElementById('reportDate').value;
    const samples = getSamplesFromStorage();
    
    if (!reportDate) {
        showAlert('Please select a report date', 'danger');
        return;
    }
    
    // Filter samples by date
    const filteredSamples = samples.filter(s => s.sampleDate === reportDate);
    
    if (filteredSamples.length === 0) {
        document.getElementById('reportContent').innerHTML = `
            <div class="alert alert-info">
                No samples found for ${formatDate(reportDate)}
            </div>
        `;
        return;
    }
    
    const reportHTML = generateReportHTML(reportDate, filteredSamples);
    document.getElementById('reportContent').innerHTML = reportHTML;
    
    // Scroll to report
    document.getElementById('reportSection').scrollIntoView({ behavior: 'smooth' });
}

function generateReportHTML(date, samples) {
    const formatDate = new Date(date).toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const totalAu = samples.reduce((sum, s) => sum + s.auContent, 0);
    const totalValue = samples.reduce((sum, s) => sum + s.goldValue, 0);
    const totalCost = samples.reduce((sum, s) => sum + s.totalCost, 0);
    const totalNet = samples.reduce((sum, s) => sum + s.netValue, 0);
    const avgGrade = samples.reduce((sum, s) => sum + s.assumedGrade, 0) / samples.length;
    const totalTonnage = samples.reduce((sum, s) => sum + s.tonnage, 0);
    
    let html = `
        <div class="report-header">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Cdefs%3E%3Cstyle%3E.logo-text%7Bfont-family:cursive%3Bfont-size:48px%3Bfill:%23FF8C00%3B%7D.logo-sub%7Bfont-family:cursive%3Bfont-size:32px%3B%7D.gold%7Bfill:%23FFD700%3B%7D.mining%7Bfill:%23000%3B%7D%3C/style%3E%3C/defs%3E%3Ctext x='50' y='70' class='logo-text'%3ESterling%3C/text%3E%3Ctext x='80' y='110' class='logo-sub gold'%3EGold%3C/text%3E%3Ctext x='160' y='110' class='logo-sub mining'%3EMining%3C/text%3E%3Cline x1='80' y1='125' x2='280' y2='125' stroke='%23FF8C00' stroke-width='3'/%3E%3C/svg%3E" style="height: 60px; margin-bottom: 15px;">
            <h3>Daily Sample Collection Report</h3>
            <p><strong>Report Date:</strong> ${formatDate}</p>
            <p><strong>Location:</strong> 152 Aurora Processing Plant, Zimbabwe</p>
        </div>
        
        <table class="report-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Mine Name</th>
                    <th>Sample ID</th>
                    <th>Tonnage</th>
                    <th>Assay (g/ton)</th>
                    <th>Au Content (g)</th>
                    <th>Gold Value ($)</th>
                    <th>Cost ($)</th>
                    <th>Net Value ($)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    samples.forEach(sample => {
        html += `
            <tr>
                <td>${sample.sampleDate}</td>
                <td>${sample.mineName}</td>
                <td>${sample.sampleID}</td>
                <td>${parseFloat(sample.tonnage).toFixed(2)}</td>
                <td>${parseFloat(sample.assayResults).toFixed(2)}</td>
                <td><strong>${sample.auContent.toFixed(2)}</strong></td>
                <td>$${sample.goldValue.toFixed(2)}</td>
                <td>$${sample.totalCost.toFixed(2)}</td>
                <td><strong class="${sample.netValue >= 0 ? 'text-success' : 'text-danger'}">${sample.netValue > 0 ? '+' : ''}$${sample.netValue.toFixed(2)}</strong></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
        <div class="report-summary">
            <div class="summary-item">
                <label>Total Samples</label>
                <div class="value">${samples.length}</div>
            </div>
            <div class="summary-item">
                <label>Total Tonnage</label>
                <div class="value">${totalTonnage.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <label>Total Au Content</label>
                <div class="value">${totalAu.toFixed(2)} g</div>
            </div>
            <div class="summary-item">
                <label>Average Grade</label>
                <div class="value">${avgGrade.toFixed(2)} %</div>
            </div>
            <div class="summary-item">
                <label>Total Gold Value</label>
                <div class="value">$${totalValue.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <label>Total Cost</label>
                <div class="value">$${totalCost.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <label>Total Net Value</label>
                <div class="value" style="color: ${totalNet >= 0 ? '#28a745' : '#dc3545'}">${totalNet > 0 ? '+' : ''}$${totalNet.toFixed(2)}</div>
            </div>
        </div>
    `;
    
    if (samples.some(s => s.commentary)) {
        html += `
            <div style="margin-top: 30px; border-top: 2px solid #FF8C00; padding-top: 20px;">
                <h4>Comments & Observations</h4>
                <ul>
        `;
        samples.forEach(sample => {
            if (sample.commentary) {
                html += `<li><strong>${sample.sampleID}:</strong> ${sample.commentary}</li>`;
            }
        });
        html += `
                </ul>
            </div>
        `;
    }
    
    html += `
        <div style="margin-top: 30px; border-top: 2px solid #FF8C00; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Report Generated: ${new Date().toLocaleString()}</p>
            <p>&copy; Sterling Gold Geology Department</p>
        </div>
    `;
    
    return html;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ====================================
// PDF EXPORT
// ====================================

function exportToPDF() {
    const reportDate = document.getElementById('reportDate').value;
    
    if (!reportDate) {
        showAlert('Please select a report date first', 'danger');
        return;
    }
    
    const reportContent = document.getElementById('reportContent').innerHTML;
    
    if (reportContent.includes('No samples found')) {
        showAlert('No data available for the selected date', 'warning');
        return;
    }
    
    // Clone the report for PDF
    const printSection = document.getElementById('printSection');
    printSection.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif;">
            ${reportContent}
        </div>
    `;
    
    // Use html2canvas and jsPDF
    const element = printSection.firstChild;
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        // First page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        const fileName = `Sterling_Gold_Report_${reportDate}.pdf`;
        pdf.save(fileName);
        
        showAlert(`✓ PDF exported: ${fileName}`, 'success');
    }).catch(error => {
        console.error('PDF Export Error:', error);
        showAlert('Error exporting PDF. Please try again.', 'danger');
    });
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 20px; line-height: 1;">&times;</button>
    `;
    
    // Insert at top of main content
    const main = document.querySelector('.dashboard-main');
    main.insertBefore(alert, main.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

console.log('Sterling Gold Dashboard App Ready');