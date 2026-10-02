import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  RefreshCcw,
  ScanLine
} from 'lucide-react';

import api from '../services/api';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';

const empty = {
  sku: '',
  name: '',
  description: '',
  category: 'Electronics',
  quantity: 0,
  reorder_level: 10,
  price: 0,
  warehouse_id: '',
  supplier_id: ''
};

export default function Inventory() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [wh, setWh] = useState([]);
  const [sup, setSup] = useState([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const [open, setOpen] = useState(false);
  const [scan, setScan] = useState('');

  const [form, setForm] = useState(empty);
  const [toast, setToast] = useState('');

  // Load products
  const load = () => {
    api
      .get('/products', {
        params: {
          search,
          category,
          stock
        }
      })
      .then((r) => {
        setItems(r.data.products || []);
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        setToast('Could not load products');
      });
  };

  // Reload products when filters change
  useEffect(() => {
    load();
  }, [search, category, stock]);

  // Load warehouses and suppliers
  useEffect(() => {
    api
      .get('/warehouses')
      .then((r) => {
        setWh(r.data.warehouses || []);
      })
      .catch((error) => {
        console.error('Failed to load warehouses:', error);
      });

    api
      .get('/suppliers')
      .then((r) => {
        setSup(r.data.suppliers || []);
      })
      .catch((error) => {
        console.error('Failed to load suppliers:', error);
      });
  }, []);

  // Create product
  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/products', {
        ...form,
        quantity: Number(form.quantity),
        reorder_level: Number(form.reorder_level),
        price: Number(form.price),
        warehouse_id: Number(form.warehouse_id),
        supplier_id: form.supplier_id
          ? Number(form.supplier_id)
          : null
      });

      setToast('Product created');

      setOpen(false);
      setForm(empty);

      load();
    } catch (e) {
      setToast(
        e.response?.data?.message ||
          'Unable to save product'
      );
    }
  };

  // Simulated SKU scanner
  const doScan = () => {
    const p = items.find(
      (x) =>
        x.sku.toLowerCase() ===
        scan.toLowerCase()
    );

    setToast(
      p
        ? `Found ${p.name} — stock ${p.quantity}`
        : 'SKU not found'
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-title">
        <div>
          <h1>Inventory</h1>
          <p>
            Products, availability and stock levels.
          </p>
        </div>

        {user.role !== 'staff' && (
          <button
            className="btn primary"
            onClick={() => setOpen(true)}
          >
            <Plus size={17} />
            Add product
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="panel toolbar">
        <div className="search">
          <Search size={17} />

          <input
            placeholder="Search name or SKU…"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            All categories
          </option>

          {[
            'Electronics',
            'Grocery',
            'Clothing',
            'Furniture'
          ].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <select
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        >
          <option value="">
            All stock
          </option>

          <option value="in">
            In stock
          </option>

          <option value="low">
            Low stock
          </option>

          <option value="out">
            Out of stock
          </option>
        </select>

        <button
          className="btn secondary"
          onClick={load}
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* Inventory Table */}
      <div className="panel">
        <div className="panel-head">
          <h3>
            Inventory ({items.length})
          </h3>

          <div className="barcode">
            <ScanLine size={16} />

            <input
              placeholder="Simulate SKU scan"
              value={scan}
              onChange={(e) =>
                setScan(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  doScan();
                }
              }}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Reorder</th>
                <th>Warehouse</th>
                <th>Unit price</th>
              </tr>
            </thead>

            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <code>{p.sku}</code>
                  </td>

                  <td>
                    <b>{p.name}</b>
                    <small>
                      {p.description}
                    </small>
                  </td>

                  <td>{p.category}</td>

                  <td>
                    <span
                      className={`stock-number ${
                        p.quantity === 0
                          ? 'red'
                          : p.quantity <=
                            p.reorder_level
                          ? 'amber'
                          : ''
                      }`}
                    >
                      {p.quantity}
                    </span>
                  </td>

                  <td>
                    {p.reorder_level}
                  </td>

                  <td>
                    {p.warehouse_name || '—'}
                  </td>

                  <td>
                    ₹
                    {Number(
                      p.price ?? 0
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center'
                    }}
                  >
                    No products match your
                    filters.
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

      {/* Add Product Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add product"
      >
        <form
          className="form-grid"
          onSubmit={submit}
        >
          <label>
            SKU

            <input
              required
              pattern="[A-Za-z0-9_-]+"
              value={form.sku}
              onChange={(e) =>
                setForm({
                  ...form,
                  sku: e.target.value
                })
              }
            />
          </label>

          <label>
            Name

            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
            />
          </label>

          <label>
            Category

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value
                })
              }
            >
              <option>
                Electronics
              </option>
              <option>
                Grocery
              </option>
              <option>
                Clothing
              </option>
              <option>
                Furniture
              </option>
            </select>
          </label>

          <label>
            Warehouse

            <select
              required
              value={form.warehouse_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  warehouse_id:
                    e.target.value
                })
              }
            >
              <option value="">
                Select
              </option>

              {wh.map((x) => (
                <option
                  value={x.id}
                  key={x.id}
                >
                  {x.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Supplier

            <select
              value={form.supplier_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  supplier_id:
                    e.target.value
                })
              }
            >
              <option value="">
                None
              </option>

              {sup.map((x) => (
                <option
                  value={x.id}
                  key={x.id}
                >
                  {x.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Opening quantity

            <input
              type="number"
              min="0"
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
            Reorder level

            <input
              type="number"
              min="0"
              value={form.reorder_level}
              onChange={(e) =>
                setForm({
                  ...form,
                  reorder_level:
                    e.target.value
                })
              }
            />
          </label>

          <label>
            Unit price

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value
                })
              }
            />
          </label>

          <label className="full-field">
            Description

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value
                })
              }
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </button>

            <button
              className="btn primary"
              type="submit"
            >
              Create product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}