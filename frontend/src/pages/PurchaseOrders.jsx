import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, CheckCircle2 } from 'lucide-react';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [sup, setSup] = useState([]);
  const [wh, setWh] = useState([]);
  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    supplier_id: '',
    warehouse_id: '',
    expected_date: '',
    product_id: '',
    quantity: 1,
    unit_price: 0
  });

  const [toast, setToast] = useState('');

  const load = () => {
    api
      .get('/purchase-orders')
      .then((r) => {
        setOrders(r.data.orders || []);
      })
      .catch((error) => {
        console.error('Failed to load purchase orders:', error);
        setToast('Could not load purchase orders');
      });
  };

  useEffect(() => {
    load();

    api
      .get('/suppliers')
      .then((r) => setSup(r.data.suppliers || []))
      .catch((error) => console.error('Failed to load suppliers:', error));

    api
      .get('/warehouses')
      .then((r) => setWh(r.data.warehouses || []))
      .catch((error) => console.error('Failed to load warehouses:', error));

    api
      .get('/products')
      .then((r) => setProducts(r.data.products || []))
      .catch((error) => console.error('Failed to load products:', error));
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/purchase-orders', {
        supplier_id: Number(form.supplier_id),
        warehouse_id: Number(form.warehouse_id),
        expected_date: form.expected_date,
        items: [
          {
            product_id: Number(form.product_id),
            quantity: Number(form.quantity),
            unit_price: Number(form.unit_price)
          }
        ]
      });

      setToast('Purchase order created');
      setOpen(false);

      setForm({
        supplier_id: '',
        warehouse_id: '',
        expected_date: '',
        product_id: '',
        quantity: 1,
        unit_price: 0
      });

      load();
    } catch (e) {
      console.error('Create purchase order error:', e);

      setToast(
        e.response?.data?.message ||
        'Could not create purchase order'
      );
    }
  };

  const receive = async (id) => {
    try {
      await api.put(`/purchase-orders/${id}`, {
        status: 'Received'
      });

      setToast('Order received and inventory updated');

      load();
    } catch (e) {
      console.error('Receive purchase order error:', e);

      setToast(
        e.response?.data?.message ||
        'Could not receive order'
      );
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;

    const selectedProduct = products.find(
      (p) => p.id === Number(productId)
    );

    setForm({
      ...form,
      product_id: productId,
      unit_price: Number(selectedProduct?.price ?? 0)
    });
  };

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Purchase Orders</h1>
          <p>
            Procurement workflow with safe inventory receiving.
          </p>
        </div>

        <button
          className="btn primary"
          onClick={() => setOpen(true)}
        >
          <Plus size={17} />
          New order
        </button>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PO</th>
                <th>Supplier</th>
                <th>Warehouse</th>
                <th>Status</th>
                <th>Total</th>
                <th>Expected</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <b>
                      PO-{String(o.id).padStart(4, '0')}
                    </b>
                  </td>

                  <td>{o.supplier_name || '—'}</td>

                  <td>{o.warehouse_name || '—'}</td>

                  <td>
                    <span
                      className={`badge ${
                        o.status === 'Received'
                          ? 'success'
                          : o.status === 'Cancelled'
                          ? 'danger'
                          : 'warning'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td>
                    ₹
                    {Number(
                      o.total_amount ?? 0
                    ).toLocaleString('en-IN')}
                  </td>

                  <td>
                    {o.expected_date || '—'}
                  </td>

                  <td>
                    {o.status !== 'Received' &&
                    o.status !== 'Cancelled' ? (
                      <button
                        className="btn small green"
                        onClick={() => receive(o.id)}
                      >
                        <CheckCircle2 size={14} />
                        Receive
                      </button>
                    ) : (
                      <span className="muted">
                        Done
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: 'center' }}
                  >
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toast
        message={toast}
        onClose={() => setToast('')}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create purchase order"
      >
        <form onSubmit={submit}>
          <label>
            Supplier

            <select
              required
              value={form.supplier_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  supplier_id: e.target.value
                })
              }
            >
              <option value="">
                Select
              </option>

              {sup.map((s) => (
                <option
                  value={s.id}
                  key={s.id}
                >
                  {s.name}
                </option>
              ))}
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
                  warehouse_id: e.target.value
                })
              }
            >
              <option value="">
                Select
              </option>

              {wh.map((w) => (
                <option
                  value={w.id}
                  key={w.id}
                >
                  {w.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Product

            <select
              required
              value={form.product_id}
              onChange={handleProductChange}
            >
              <option value="">
                Select
              </option>

              {products.map((p) => (
                <option
                  value={p.id}
                  key={p.id}
                >
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity

            <input
              type="number"
              min="1"
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
            Unit price

            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.unit_price}
              onChange={(e) =>
                setForm({
                  ...form,
                  unit_price: e.target.value
                })
              }
            />
          </label>

          <label>
            Expected date

            <input
              type="date"
              value={form.expected_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  expected_date: e.target.value
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
              Create order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}