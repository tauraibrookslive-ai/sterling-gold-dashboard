# Sterling Gold Mining - Sample Collection Dashboard

A professional, feature-rich web dashboard for the Sterling Gold Geology Department to manage and track sample collection data from mining operations at 152 Aurora Processing Plant, Zimbabwe.

## 🌟 Features

### Core Functionality
- **Sample Data Management**: Add, view, search, and delete sample collection records
- **Auto-Calculations**: 
  - Gold Content (Au) calculated from Tonnage × Assay Results
  - Gold Value based on current gold prices
  - Net Value (Gold Value - Processing Cost)
- **Daily Report Generation**: Filter and generate comprehensive reports by date
- **Data Persistence**: All data saved to browser's local storage (no server needed)
- **PDF Export**: Download reports as professional PDF documents with company branding

### Data Fields
- **Sample Date**: Date the sample was collected
- **Mine Name**: Name of the mining location
- **Mine Area**: Specific area/zone within the mine
- **Sample ID**: Unique identifier (auto-generated or custom)
- **Sampled Tonnage**: Amount of material sampled (in tons)
- **Assumed Grade**: Estimated gold grade percentage
- **Assay Results**: Laboratory assay results (g/ton)
- **Geo Coordinates**: Latitude and Longitude of sample location
- **Gold Price**: Current market price per ounce (default: $2000)
- **Cost/Ton**: Processing cost per ton
- **Sample Au Content**: Auto-calculated gold content in grams
- **Sample Price**: Estimated value of gold content
- **Sample Cost**: Total processing cost
- **Report Commentary**: Additional observations and notes

### Dashboard Components

#### Statistics Cards
Quick overview of key metrics:
- Total number of samples collected
- Total gold (Au) content in grams
- Total tonnage processed
- Average grade percentage
- Total estimated value

#### Sample Entry Form
Comprehensive form for adding new samples with:
- Real-time validation
- Auto-generated Sample IDs (format: SG-YYMMDD-XXXX)
- Automatic calculation of derived fields
- Commentary section for detailed notes

#### Sample Records Table
Sortable, searchable table displaying:
- All sample details
- Calculated values (Au content, Gold value, Net value)
- Quick delete functionality
- Full-width responsive design

#### Daily Report Generator
- Date-based filtering
- Summary statistics
- Detailed sample breakdown
- Commentary compilation
- Professional formatting

#### PDF Export
- One-click export of daily reports
- Professional styling with Sterling Gold branding
- Multi-page support for large reports
- Includes company address and timestamp

### Additional Features
- 🔍 **Search Functionality**: Find samples by any criteria
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Professional Styling**: Sterling Gold branding and color scheme
- 💾 **Local Storage**: No internet required after initial load
- 🔄 **Real-time Calculations**: Auto-updating derived fields
- 📊 **Summary Statistics**: Aggregated metrics
- 📋 **Advanced Filtering**: Date-based report generation
- ⏱️ **Last Updated Timestamp**: Track when data was last modified

## 🚀 How to Use

### Installation
1. Download all files (index.html, styles.css, app.js)
2. Place them in the same directory
3. Open `index.html` in a web browser
4. No server or installation required!

### Adding Samples
1. Fill out the "Add New Sample" form with sample details
2. The Sample ID will be auto-generated if left blank
3. Gold content and value will auto-calculate based on input
4. Click "Add Sample" to save
5. Data is automatically saved to browser storage

### Searching Samples
- Use the search box to filter samples by any field
- Search is instant and case-insensitive

### Generating Reports
1. Select a date using the "Report Date" picker
2. Click "Generate Report"
3. View the comprehensive daily summary
4. Download as PDF for sharing and archiving

### Exporting Data
- Click "Download PDF" to export the current report
- PDF includes all calculated values and company branding
- Automatic filename with date stamp

## 📊 Data Management

### Storage
- All data stored in browser's localStorage
- Persists across browser sessions
- Each sample includes a unique timestamp

### Backup & Recovery
- Export reports as PDF for archiving
- To back up all data, use browser developer tools:
  - Open DevTools (F12)
  - Go to Application → Local Storage
  - Copy `sterlingGoldSamples` value and save

### Data Deletion
- Delete individual samples with the Delete button
- Clear all data with "Clear All Data" button (with confirmation)

## 🔢 Calculation Formulas

### Gold Content (Au)
```
Au Content (g) = Sampled Tonnage × Assay Results (g/ton)
```

### Gold Value
```
Au Content (oz) = Au Content (g) ÷ 31.1035
Gold Value ($) = Au Content (oz) × Gold Price ($/oz)
```

### Processing Cost
```
Total Cost ($) = Sampled Tonnage × Cost per Ton ($)
```

### Net Value
```
Net Value ($) = Gold Value ($) - Total Cost ($)
```

## 🎨 Branding

### Color Scheme
- **Primary**: Orange (#FF8C00) - Sterling Gold signature color
- **Secondary**: Gold (#FFD700) - Accent color
- **Dark**: #1a1a1a - Headers and text
- **Light**: #f5f5f5 - Backgrounds

### Typography
- Header: Cursive style with company branding
- Body: Clean, professional sans-serif font
- Responsive sizing for all screen sizes

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- 📱 Mobile phones (480px and up)
- 📱 Tablets (768px and up)
- 💻 Laptops (1024px and up)
- 🖥️ Large desktop displays

## 🛠️ Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 📝 Sample Data Entry Example

```
Sample Date: 2024-01-15
Mine Name: Northern Sector
Mine Area: Zone A-3
Sample ID: (auto-generated)
Sampled Tonnage: 5.50 tons
Assumed Grade: 2.5%
Assay Results: 3.2 g/ton
Geo Coordinates: -17.8252, 25.2637
Gold Price: $2000/oz
Cost/Ton: $75
Commentary: Good recovery, minimal contamination
```

**Auto-calculated Results:**
- Au Content: 17.60 g
- Gold Value: $1,128.47
- Total Cost: $412.50
- Net Value: $715.97

## 🔒 Data Privacy

- All data is stored locally on your computer
- No data is sent to any server
- No cookies or tracking
- Your data is completely private

## ⚠️ Important Notes

- Keep your browser data storage enabled
- Clearing browser cache/history may delete stored data
- Regularly export reports for backup
- Sample ID must be unique (duplicates not prevented but not recommended)

## 📞 Support

For assistance with the Sterling Gold Dashboard:
- Check that your browser allows local storage
- Ensure JavaScript is enabled
- Try clearing your browser cache and reloading
- Export your data before clearing browser data

## 📜 Version

**Version**: 1.0.0  
**Last Updated**: 2024  
**Department**: Sterling Gold Geology  
**Location**: 152 Aurora Processing Plant, Zimbabwe

---

**© 2024 Sterling Gold Mining. All Rights Reserved.**