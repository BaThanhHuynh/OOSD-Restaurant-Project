const adminMenuApp = {
    init: function() {
        this.renderTable();
    },

    renderTable: function() {
        // Sử dụng DATA.products từ Main.js làm nguồn
        const html = DATA.products.map(p => `
            <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 15px 10px;">#${p.id}</td>
                <td style="padding: 15px 10px; font-weight: 500;">${p.name}</td>
                <td style="padding: 15px 10px;">${app.formatMoney(p.price)}</td>
                <td style="padding: 15px 10px;">
                    <span style="background: #F3F4F6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${p.cat}</span>
                </td>
                <td style="padding: 15px 10px;">
                    <span style="color: var(--primary); font-size: 12px; font-weight: 600;">Available</span>
                </td>
                <td style="padding: 15px 10px;">
                    <button style="border: none; background: none; color: var(--primary); cursor: pointer; margin-right: 10px;"><i class='bx bx-edit'></i></button>
                    <button style="border: none; background: none; color: var(--danger); cursor: pointer;"><i class='bx bx-trash'></i></button>
                </td>
            </tr>
        `).join('');
        document.getElementById('admin-menu-table').innerHTML = html;
    }
}