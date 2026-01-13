/**
 * API Client Module
 * Xử lý các gọi API tới backend
 */

const API_BASE = '/api'; // Thay đổi địa chỉ server nếu cần

class API {
    // ===== TABLE API =====
    static async getTables() {
        try {
            const response = await fetch(`${API_BASE}/tables`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching tables:', error);
            return [];
        }
    }

    static async getTable(tableId) {
        try {
            const response = await fetch(`${API_BASE}/tables/${tableId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching table:', error);
            return null;
        }
    }

    static async createTable(capacity) {
        try {
            const response = await fetch(`${API_BASE}/tables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ capacity })
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating table:', error);
            return null;
        }
    }

    static async occupyTable(tableId) {
        try {
            const response = await fetch(`${API_BASE}/tables/${tableId}/occupy`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error occupying table:', error);
            return null;
        }
    }

    static async releaseTable(tableId) {
        try {
            const response = await fetch(`${API_BASE}/tables/${tableId}/release`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error releasing table:', error);
            return null;
        }
    }

    // ===== MENU API =====
    static async getMenuItems() {
        try {
            const response = await fetch(`${API_BASE}/menu`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching menu items:', error);
            return [];
        }
    }

    static async getMenuItem(itemId) {
        try {
            const response = await fetch(`${API_BASE}/menu/${itemId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching menu item:', error);
            return null;
        }
    }

    static async addMenuItem(name, price, description = '') {
        try {
            const response = await fetch(`${API_BASE}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price, description })
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding menu item:', error);
            return null;
        }
    }

    static async setMenuItemAvailable(itemId) {
        try {
            const response = await fetch(`${API_BASE}/menu/${itemId}/available`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    static async setMenuItemOutOfStock(itemId) {
        try {
            const response = await fetch(`${API_BASE}/menu/${itemId}/out-of-stock`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // ===== ORDER API =====
    static async getOrders() {
        try {
            const response = await fetch(`${API_BASE}/orders`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }

    static async getOrder(orderId) {
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching order:', error);
            return null;
        }
    }

    static async createOrder(tableId) {
        try {
            const response = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table_id: tableId })
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    }

    static async addItemToOrder(orderId, menuItemId, quantity, notes = '') {
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    menu_item_id: menuItemId, 
                    quantity, 
                    notes 
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding item to order:', error);
            return null;
        }
    }

    static async removeItemFromOrder(orderId, orderItemId) {
        try {
            const response = await fetch(`${API_BASE}/orders/${orderId}/items/${orderItemId}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Error removing item:', error);
            return null;
        }
    }

    // ===== PAYMENT API =====
    static async getPayments() {
        try {
            const response = await fetch(`${API_BASE}/payments`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching payments:', error);
            return [];
        }
    }

    static async getPayment(paymentId) {
        try {
            const response = await fetch(`${API_BASE}/payments/${paymentId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching payment:', error);
            return null;
        }
    }

    static async createPayment(orderId, amount, method = 'CASH') {
        try {
            const response = await fetch(`${API_BASE}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    order_id: orderId, 
                    amount, 
                    method 
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating payment:', error);
            return null;
        }
    }

    static async completePayment(paymentId) {
        try {
            const response = await fetch(`${API_BASE}/payments/${paymentId}/complete`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Error completing payment:', error);
            return null;
        }
    }
}

/**
 * Mock Data - dùng cho testing trước khi kết nối backend thực
 */
const MOCK_DATA = {
    tables: [
        { id: 1, capacity: 4, status: 'available', current_order_id: null },
        { id: 2, capacity: 2, status: 'occupied', current_order_id: 1 },
        { id: 3, capacity: 6, status: 'available', current_order_id: null },
    ],
    menu_items: [
        { id: 1, name: 'Cơm tấm', price: 50000, status: 'available' },
        { id: 2, name: 'Phở bò', price: 45000, status: 'available' },
        { id: 3, name: 'Bún chả', price: 40000, status: 'available' },
    ],
    orders: [
        { id: 1, table_id: 2, status: 'pending', total_amount: 150000 },
    ],
    payments: [
        { id: 1, order_id: 1, amount: 150000, method: 'CASH', status: 'unpaid' }
    ]
};