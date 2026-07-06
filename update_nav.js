const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const newNavDropdown = `        <div class="nav-dropdown">
          <button class="nav-dropdown-button">Products ▾</button>
          <div class="dropdown-menu" style="padding: 12px; width: 340px;">
            
            <div class="dropdown-group" style="margin-bottom: 0;">
              <button class="dropdown-item" style="width: 100%; text-align: left; background: none; border: none; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'">
                Personal Products <span style="font-size: 16px; color: var(--green);">+</span>
              </button>
              <div class="dropdown-submenu" style="display: none; padding-left: 12px; border-left: 2px solid var(--border); margin: 8px 0 8px 12px;">
                <a class="dropdown-item" href="cova-personal.html" style="padding: 8px 12px;">
                  <strong>All personal cover</strong>
                  <span style="font-size: 12px;">View personal insurance products and quotes</span>
                </a>
                <a class="dropdown-item" href="cova-personal.html" style="padding: 8px 12px;">
                  <strong>Life</strong>
                  <span style="font-size: 12px;">Life insurance for individuals and families</span>
                </a>
                <a class="dropdown-item" href="cova-personal.html" style="padding: 8px 12px;">
                  <strong>Health</strong>
                  <span style="font-size: 12px;">Health and HMO plans</span>
                </a>
                <a class="dropdown-item" href="cova-personal.html" style="padding: 8px 12px;">
                  <strong>Motor</strong>
                  <span style="font-size: 12px;">Private car and motorcycle cover</span>
                </a>
                <a class="dropdown-item" href="cova-personal.html" style="padding: 8px 12px;">
                  <strong>Travel</strong>
                  <span style="font-size: 12px;">Travel protection for trips abroad</span>
                </a>
                <a class="dropdown-item" href="cova-personal.html" style="padding: 8px 12px;">
                  <strong>Property</strong>
                  <span style="font-size: 12px;">Home and rental property insurance</span>
                </a>
                <a class="dropdown-item" href="cova-personal.html" style="padding: 8px 12px;">
                  <strong>Devices</strong>
                  <span style="font-size: 12px;">Phones, laptops and gadgets cover</span>
                </a>
              </div>
            </div>

            <div class="dropdown-group" style="margin-bottom: 0;">
              <button class="dropdown-item" style="width: 100%; text-align: left; background: none; border: none; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'">
                Business Products <span style="font-size: 16px; color: var(--green);">+</span>
              </button>
              <div class="dropdown-submenu" style="display: none; padding-left: 12px; border-left: 2px solid var(--border); margin: 8px 0 8px 12px;">
                <a class="dropdown-item" href="cova-business.html" style="padding: 8px 12px;">
                  <strong>All business cover</strong>
                  <span style="font-size: 12px;">View business solutions and SME plans</span>
                </a>
                <a class="dropdown-item" href="cova-business.html" style="padding: 8px 12px;">
                  <strong>Electronic fleet</strong>
                  <span style="font-size: 12px;">Smart device cover for teams</span>
                </a>
                <a class="dropdown-item" href="cova-business.html" style="padding: 8px 12px;">
                  <strong>Motor fleet</strong>
                  <span style="font-size: 12px;">Commercial vehicle protection</span>
                </a>
                <a class="dropdown-item" href="cova-business.html" style="padding: 8px 12px;">
                  <strong>Group life</strong>
                  <span style="font-size: 12px;">Employee life protection for staff</span>
                </a>
                <a class="dropdown-item" href="cova-business.html" style="padding: 8px 12px;">
                  <strong>Group health</strong>
                  <span style="font-size: 12px;">Healthcare for your workforce</span>
                </a>
                <a class="dropdown-item" href="cova-business.html" style="padding: 8px 12px;">
                  <strong>Fire & special perils</strong>
                  <span style="font-size: 12px;">Property and stock protection</span>
                </a>
                <a class="dropdown-item" href="cova-business.html" style="padding: 8px 12px;">
                  <strong>Workmen's compensation</strong>
                  <span style="font-size: 12px;">Staff injury and liability cover</span>
                </a>
              </div>
            </div>
          </div>
        </div>`;

const regexOldNavDropdown = /<div class="nav-dropdown">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

for (const file of files) {
  if (file === 'index.html') continue;
  
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<div class="nav-dropdown">')) {
    content = content.replace(regexOldNavDropdown, newNavDropdown);
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}