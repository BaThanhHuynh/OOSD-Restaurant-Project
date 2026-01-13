const tableApp = {
    init: function() {
        this.renderTables();
    },

    renderTables: async function() {
        // Gọi API lấy dữ liệu bàn thực tế
        // const tables = await API.getTables(); 
        
        // Dữ liệu mẫu mô phỏng (theo api.js)
        const tables = [
            { id: 1, name: 'Bàn 1', capacity: 4, status: 'AVAILABLE' },
            { id: 2, name: 'Bàn 2', capacity: 2, status: 'OCCUPIED' },
            { id: 3, name: 'Bàn 3', capacity: 6, status: 'ORDERING' },
            { id: 4, name: 'Bàn 4', capacity: 4, status: 'PAID' }
        ];

        const container = document.querySelector('#tables-page .table-grid-container');
        
        container.innerHTML = tables.map(table => {
            let statusColor = '';
            let actionBtn = '';

            // Logic hiển thị theo trạng thái (Backend Enum: TableStatus)
            switch(table.status) {
                case 'AVAILABLE': 
                    statusColor = 'background: #E8F5E9; color: var(--primary); border: 2px solid var(--primary);';
                    actionBtn = `<button class="btn-action" onclick="API.occupyTable(${table.id})">Mở bàn</button>`;
                    break;
                case 'OCCUPIED':
                case 'ORDERING':
                    statusColor = 'background: #FEF3C7; color: #D97706; border: 2px solid #D97706;';
                    actionBtn = `<button class="btn-action" onclick="app.loadPage('pos', ${table.id})">Gọi món</button>`;
                    break;
                case 'PAID':
                    statusColor = 'background: #E0E7FF; color: #4338CA; border: 2px solid #4338CA;';
                    actionBtn = `<button class="btn-action" onclick="API.releaseTable(${table.id})">Dọn bàn</button>`;
                    break;
            }

            return `
            <div class="table-card" style="padding: 20px; border-radius: 16px; ${statusColor} display: flex; flex-direction: column; gap: 10px; transition: 0.3s;">
                <div style="font-size: 40px; text-align: center;"><i class='bx bx-restaurant'></i></div>
                <h3 style="text-align: center;">${table.name}</h3>
                <p style="text-align: center; font-size: 13px;">${table.capacity} Ghế • ${table.status}</p>
                <div style="margin-top: auto;">${actionBtn}</div>
            </div>
            `;
        }).join('');
    }
};