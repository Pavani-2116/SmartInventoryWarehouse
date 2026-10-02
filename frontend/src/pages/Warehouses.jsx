import { useEffect, useState } from 'react';
import { Plus, Warehouse as WIcon } from 'lucide-react';

import api from '../services/api';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';

export default function Warehouses() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    location: '',
    manager: '',
    capacity: 0
  });

  const [toast, setToast] = useState('');

  // Load warehouses
  const load = () => {
    api
      .get('/warehouses')
      .then((r) => {
        setRows(r.data.warehouses || []);
      })
      .catch((error) => {
        console.error('Failed to load warehouses:', error);
        setToast('Could not load warehouses');
      });
  };

  // Load when page opens
  useEffect(() => {
    load();
  }, []);

  // Create warehouse
  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/warehouses', {
        ...form,
        capacity: Number(form.capacity)
      });

      setToast('Warehouse created');

      setOpen(false);

      setForm({
        name: '',
        location: '',
        manager: '',
        capacity: 0
      });

      load();
    } catch (e) {
      setToast(
        e.response?.data?.message ||
          'Could not create warehouse'
      );
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-title">
        <div>
          <h1>Warehouses</h1>
          <p>
            Locations, capacity and stock footprint.
          </p>
        </div>

        <button
          className="btn primary"
          onClick={() => setOpen(true)}
        >
          <Plus size={17} />
          Add warehouse
        </button>
      </div>

      {/* Warehouse Cards */}
      <div className="warehouse-grid">
        {rows.map((w) => {
          const currentStock =
            Number(w.current_stock) || 0;

          const capacity =
            Number(w.capacity) || 0;

          const productCount =
            Number(w.product_count) || 0;

          const lowStockCount =
            Number(w.low_stock_count) || 0;

          const percentage = capacity
            ? Math.min(
                100,
                Math.round(
                  (currentStock / capacity) * 100
                )
              )
            : 0;

          return (
            <div
              className="warehouse-card"
              key={w.id}
            >
              <div className="warehouse-icon">
                <WIcon />
              </div>

              <h3>{w.name}</h3>

              <p>{w.location || '—'}</p>

              <div className="warehouse-stats">
                <span>
                  <b>{currentStock}</b> stock
                </span>

                <span>
                  <b>{productCount}</b> products
                </span>

                <span>
                  <b>{lowStockCount}</b> low
                </span>
              </div>

              <div className="capacity">
                <div>
                  <span>Capacity</span>

                  <b>
                    {currentStock.toLocaleString()} /{' '}
                    {capacity.toLocaleString()}
                  </b>
                </div>

                <div className="progress">
                  <i
                    style={{
                      width: `${percentage}%`
                    }}
                  />
                </div>
              </div>

              <small>
                Manager:{' '}
                {w.manager || 'Unassigned'}
              </small>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <div className="panel">
          <div className="empty">
            No warehouses found.
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toast}
        onClose={() => setToast('')}
      />

      {/* Add Warehouse Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add warehouse"
      >
        <form onSubmit={submit}>
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
            Location

            <input
              required
              value={form.location}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: e.target.value
                })
              }
            />
          </label>

          <label>
            Manager

            <input
              value={form.manager}
              onChange={(e) =>
                setForm({
                  ...form,
                  manager: e.target.value
                })
              }
            />
          </label>

          <label>
            Capacity

            <input
              type="number"
              min="0"
              value={form.capacity}
              onChange={(e) =>
                setForm({
                  ...form,
                  capacity: e.target.value
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
              type="submit"
              className="btn primary"
            >
              Create warehouse
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}