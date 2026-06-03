const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`;

export const apiService = {
    // Products
    getProducts: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetch(`${API_BASE_URL}/products?${query}`).then(res => res.json());
    },
    addProduct: (data) => {
        return fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },
    updateProduct: (id, data) => {
        return fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },
    deleteProduct: (id) => {
        return fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE'
        }).then(res => res.json());
    },

    // Loans
    getLoans: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetch(`${API_BASE_URL}/loans?${query}`).then(res => res.json());
    },
    addLoan: (data) => {
        return fetch(`${API_BASE_URL}/loans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },
    updateLoanDate: (id, date) => {
        return fetch(`${API_BASE_URL}/loans/${id}/date`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repaymentDate: date })
        }).then(res => res.json());
    },
    addLoanPayment: (id, data) => {
        return fetch(`${API_BASE_URL}/loans/${id}/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // { amount, paymentType: 'interest' | 'principal' }
        }).then(async res => {
            if (!res.ok) throw new Error((await res.json()).error);
            return res.json();
        });
    },

    // Collections
    getCollections: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetch(`${API_BASE_URL}/collections?${query}`).then(res => res.json());
    },
    addCollection: (data) => {
        return fetch(`${API_BASE_URL}/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },
    updateCollection: (id, data) => {
        return fetch(`${API_BASE_URL}/collections/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },
    updateCollectionDate: (id, date) => {
        return fetch(`${API_BASE_URL}/collections/${id}/date`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nextDueDate: date })
        }).then(res => res.json());
    },

    // Customers
    getCustomers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetch(`${API_BASE_URL}/customers?${query}`).then(res => res.json());
    },
    addCustomer: (data) => {
        return fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },

    // Reports
    getReports: () => {
        return fetch(`${API_BASE_URL}/reports/summary`).then(res => res.json());
    },

    // Dashboard
    getStats: () => {
        return fetch(`${API_BASE_URL}/dashboard`).then(res => res.json());
    },

    // Transactions
    getTransactions: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetch(`${API_BASE_URL}/transactions?${query}`).then(res => res.json());
    },
    addTransaction: (data) => {
        return fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json());
    },
    payTransaction: (id, amount) => {
        return fetch(`${API_BASE_URL}/transactions/${id}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        }).then(res => res.json());
    },
    getProfitAnalysis: () => {
        return fetch(`${API_BASE_URL}/transactions/profit`).then(res => res.json());
    }
};
