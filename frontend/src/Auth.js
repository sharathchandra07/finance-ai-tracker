import React, { useState, useEffect } from "react";
import API from "./api";

function Auth() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: "",
    aiText: ""
  });

  // Load transactions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };
    fetchData();
  }, []);

  // Add transaction
  const addTransaction = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;

    try {
      const res = await API.post("/api/transactions", {
        description: form.description,
        amount: Number(form.amount), // ✅ ensure number
        category: form.category,
        date: form.date,
      });

      // ✅ instantly update state with new transaction
      setTransactions([...transactions, res.data]);

      // reset form
      setForm({
        description: "",
        amount: "",
        category: "Food",
        date: "",
        aiText: ""
      });
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  // Delete transaction
  const removeTransaction = async (id) => {
    try {
      await API.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  // Summary calculations
  const income = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((s, t) => s + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((s, t) => s + Number(t.amount), 0);

  const savings = income + expenses;

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #1d2671 0%, #c33764 100%)",
        color: "white",
        padding: "20px",
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-4">💰 AI Finance Tracker</h1>
          <p className="lead">Track your money with style ✨</p>
        </div>

        {/* Summary Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div
              className="card shadow-lg border-0 text-white"
              style={{ background: "linear-gradient(45deg, #20bf55, #01baef)" }}
            >
              <div className="card-body text-center">
                <h5 className="fw-semibold">Income</h5>
                <p className="display-6 fw-bold">${Number(income).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card shadow-lg border-0 text-white"
              style={{ background: "linear-gradient(45deg, #ff416c, #ff4b2b)" }}
            >
              <div className="card-body text-center">
                <h5 className="fw-semibold">Expenses</h5>
                <p className="display-6 fw-bold">${Math.abs(expenses).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="card shadow-lg border-0 text-white"
              style={{ background: "linear-gradient(45deg, #8360c3, #2ebf91)" }}
            >
              <div className="card-body text-center">
                <h5 className="fw-semibold">Savings</h5>
                <p className="display-6 fw-bold">${Number(savings).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Parser Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">🤖 Smart Add with AI</h5>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder='e.g. "Bought coffee for 120 on 2025-09-01"'
                value={form.aiText}
                onChange={(e) => setForm({ ...form, aiText: e.target.value })}
              />
              <button
                className="btn btn-outline-primary"
                onClick={async () => {
                  if (!form.aiText) return;
                  try {
                    const res = await API.post("/api/transactions/parse", {
                      text: form.aiText,
                    });
                    const parsed = res.data;

                    setForm({
                      description: parsed.description || "",
                      amount: parsed.amount || "",
                      category: parsed.category || "Other",
                      date: parsed.date || "",
                      aiText: "",
                    });
                  } catch (err) {
                    console.error("AI parsing failed:", err);
                    alert("AI could not understand that input.");
                  }
                }}
              >
                Parse
              </button>
            </div>
            <small className="text-muted">
              Describe your expense in natural language.
            </small>
          </div>
        </div>

        {/* Add Transaction Form */}
        <div
          className="card shadow-lg border-0 mb-5"
          style={{ borderRadius: "20px", background: "#ffffffdd", color: "#333" }}
        >
          <div className="card-body">
            <h4 className="fw-bold mb-4">➕ Add Transaction</h4>
            <form className="row g-3" onSubmit={addTransaction}>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Income</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="col-md-2 d-grid">
                <button type="submit" className="btn btn-primary fw-bold">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Transaction History */}
        <div
          className="card shadow-lg border-0"
          style={{ borderRadius: "20px", background: "#ffffffdd", color: "#333" }}
        >
          <div className="card-body">
            <h4 className="fw-bold mb-4">📜 Transaction History</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t, i) => (
                      <tr key={t.id}>
                        <td>{i + 1}</td>
                        <td>{t.description}</td>
                        <td>
                          <span className="badge bg-secondary">{t.category}</span>
                        </td>
                        <td>{t.date}</td>
                        <td
                          className={
                            Number(t.amount) > 0
                              ? "text-success fw-bold"
                              : "text-danger fw-bold"
                          }
                        >
                          {Number(t.amount) > 0 ? "+" : ""}
                          {Number(t.amount)}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeTransaction(t.id)}
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No transactions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-5 text-white-50">
          <p>© {new Date().getFullYear()} AI Finance Tracker · Built with ❤️</p>
        </footer>
      </div>
    </div>
  );
}

export default Auth;
