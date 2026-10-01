# Evaluation Checklist

- [x] React frontend
- [x] Node.js + Express backend
- [x] SQLite
- [x] Authentication
- [x] Admin / Manager / Staff roles
- [x] Backend RBAC
- [x] Product inventory
- [x] Stock IN
- [x] Stock OUT
- [x] Negative-stock prevention
- [x] Transactional stock logic
- [x] Stock movement history
- [x] Suppliers
- [x] Purchase orders
- [x] Safe purchase-order receiving
- [x] Warehouses
- [x] Dashboard
- [x] Low-stock alerts
- [x] Category and stock filters
- [x] Reports
- [x] Audit logs
- [x] Barcode/SKU simulation
- [x] Frontend/backend validation
- [x] Error handling
- [x] Loading/empty/success states
- [x] Responsive media queries
- [x] Seed data
- [x] README
- [x] Environment examples
- [x] Deployment notes

## Important manual QA

1. Login as each role.
2. Verify restricted navigation and API authorization.
3. Create a product and refresh.
4. Stock IN and refresh.
5. Stock OUT within available quantity and refresh.
6. Attempt Stock OUT above available quantity; verify no quantity changes.
7. Create a purchase order and receive it.
8. Try receiving the same PO again; verify no duplicate stock.
9. Check movement history previous/new quantities.
10. Verify dashboard and reports use backend data.
11. Test mobile width around 320–480px.
12. Run frontend production build.
