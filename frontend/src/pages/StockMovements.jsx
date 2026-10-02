import { useEffect, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCcw
} from 'lucide-react';

import api from '../services/api';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';

export default function StockMovements() {
  const { user } = useAuth();

  const [moves, setMoves] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [type, setType] = useState('');
  const [product, setProduct] = useState('');
  const [warehouse, setWarehouse] = useState('');

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('IN');

  const [form, setForm] = useState({
    product_id: '',
    quantity: 1,
    reference: ''
  });

  const [toast, setToast] = useState('');

  // Load stock movements
  const load = () => {
    api
      .get('/stock/movements', {
        params: {
          type,
          product_id: product,
          warehouse_id: warehouse
        }
      })
      .then((r) => {
        setMoves(r.data.movements || []);
      })
      .catch((error) => {
        console.error('Failed to load stock movements:', error);
        setToast('Could not load stock movements');
      });
  };

  // Load products and warehouses when page opens
  useEffect(() => {
    load();

    api
      .get('/products')
      .then((r) => {
        setProducts(r.data.products || []);
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
      });

    api
      .get('/warehouses')
      .then((r) => {
        setWarehouses(r.data.warehouses || []);
      })
      .catch((error) => {
        console.error('Failed to load warehouses:', error);
      });
  }, []);

  // Reload movements when filters change
  useEffect(() => {
    load();
  }, [type, product, warehouse]);

  // Submit Stock IN / OUT
  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/stock/${mode.toLowerCase()}`, {
        ...form,
        quantity: Number(form.quantity),
        product_id: Number(form.product_id)
      });

      setToast(`Stock ${mode} completed`);

      setOpen(false);

      setForm({
        product_id: '',
        quantity: 1,
        reference: ''
      });

      load();
    } catch (e) {
      setToast(
        e.response?.data?.message || 'Operation failed'
      );
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-title">
        <div>
          <h1>Stock Movements</h1>
          <p>
            Every quantity change is transactionally recorded.
          </p>
        </div>

        <div className="button-row">
          <button
            className="btn green"
            onClick={() => {
              setMode('IN');
              setOpen(true);
            }}
          >
            <ArrowDownToLine size={17} />
            Stock IN
          </button>

          <button
            className="btn danger"
            onClick={() => {
              setMode('OUT');
              setOpen(true);
            }}
          >
            <ArrowUpFromLine size={17} />
            Stock OUT
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="panel toolbar">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        >
          <option value="">All products</option>

          {products.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
        >
          <option value="">All warehouses</option>

          {warehouses.map((w) => (
            <option value={w.id} key={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <button
          className="btn secondary"
          onClick={load}
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* Movements Table */}
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Warehouse</th>
                <th>User</th>
                <th>Reference</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {moves.map((m) => (
                <tr key={m.id}>
                  <td>
                    <b>{m.product_name}</b>
                    <small>{m.sku}</small>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        m.type === 'IN'
                          ? 'success'
                          : 'danger'
                      }`}
                    >
                      {m.type}
                    </span>
                  </td>

                  <td>{m.quantity}</td>

                  <td>
                    {m.warehouse_name || '—'}
                  </td>

                  <td>
                    {m.performed_by_name || '—'}
                  </td>

                  <td>
                    {m.reference || '—'}
                  </td>

                  <td>
                    {m.created_at
                      ? new Date(
                          m.created_at
                        ).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}

              {moves.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: 'center' }}
                  >
                    No stock movements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toast}
        onClose={() => setToast('')}
      />

      {/* Stock IN / OUT Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Record stock ${mode}`}
      >
        <form onSubmit={submit}>
          <label>
            Product

            <select
              required
              value={form.product_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  product_id: e.target.value
                })
              }
            >
              <option value="">
                Select product
              </option>

              {products.map((p) => (
                <option
                  value={p.id}
                  key={p.id}
                >
                  {p.name} — {p.quantity} available
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity

            <input
              type="number"
              min="1"
              step="1"
              required
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: e.target.value
                })
              }
            />
          </label>

          <label>
            Reference

            <input
              placeholder="PO-1001 / transfer note"
              value={form.reference}
              onChange={(e) =>
                setForm({
                  ...form,
                  reference: e.target.value
                })
              }
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>

            <button
              className={`btn ${
                mode === 'IN'
                  ? 'green'
                  : 'danger'
              }`}
            >
              Confirm {mode}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}