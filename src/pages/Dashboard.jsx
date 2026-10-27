import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import InventoryModal from '../components/InventoryModal.jsx';
import Overview from './Overview.jsx';
import InventoryPage from './InventoryPage.jsx';
import RestockPlanner from './RestockPlanner.jsx';
import Transactions from './Transactions.jsx';
import Reports from './Reports.jsx';
import Settings from './Settings.jsx';
import { initialProducts } from '../data/products.js';
import { allViewLabels } from '../data/navigation.js';
import { getStatus } from '../utils/inventory.js';

const SETTINGS_KEY = 'stockwise-settings';
const defaultSettings = { workspaceName: 'stockwise', userName: 'Admin', defaultReorder: 5, defaultBudget: 25000 };

const loadSettings = () => {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; }
  catch { return defaultSettings; }
};

export default function Dashboard() {
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState(loadSettings);
  const [activeView, setActiveView] = useState('Overview');
  const [modalMode, setModalMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* storage unavailable */ }
  }, [settings]);

  const lowCount = products.filter((p) => p.qty > 0 && p.qty <= p.reorder).length;
  const outCount = products.filter((p) => p.qty === 0).length;
  const workspaceName = settings.workspaceName.trim() || defaultSettings.workspaceName;
  const userName = settings.userName.trim() || defaultSettings.userName;
  const defaultReorder = Math.max(0, Number(settings.defaultReorder) || 0);
  const defaultBudget = Math.max(0, Number(settings.defaultBudget) || 0);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };
  const exportCsv = () => {
    const rows = [['Name', 'SKU', 'Category', 'Unit Cost', 'Quantity', 'Reorder Level', 'Status'],
      ...products.map((p) => [p.name, p.sku, p.category, p.cost, p.qty, p.reorder, getStatus(p)])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'stockwise-inventory.csv'; link.click();
    URL.revokeObjectURL(url); notify('Inventory CSV exported.');
  };
  const navigate = (view) => {
    setActiveView(view); setMobileNav(false);
    window.scrollTo({ top: 0 });
  };
  const openAddProduct = () => { setSelectedProduct(null); setModalMode('add-product'); };
  const openUpdateStock = (product) => { setSelectedProduct(product); setModalMode('edit-stock'); };

  const addProduct = (form) => {
    if (products.some((p) => p.sku.toLowerCase() === form.sku.toLowerCase())) { notify('That SKU already exists. Choose a unique SKU.'); return; }
    setProducts((current) => [...current, { ...form, id: Math.max(0, ...current.map((p) => p.id)) + 1, icon: '▤' }]);
    setModalMode(null); notify('Product added. Inventory totals updated.');
  };
  const applyTransaction = (productId, action, quantity) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;
    if (!Number.isInteger(quantity) || quantity < 1) { notify('Enter a whole quantity of 1 or more.'); return false; }
    if (action === 'sale' && quantity > product.qty) { notify(`Only ${product.qty} units are available.`); return false; }
    const balance = product.qty + (action === 'sale' ? -quantity : quantity);
    setProducts((current) => current.map((p) => p.id === productId ? { ...p, qty: balance } : p));
    setTransactions((current) => [{ id: `${Date.now()}-${current.length}`, productId, name: product.name, sku: product.sku, type: action, quantity, balance, at: new Date().toISOString() }, ...current]);
    notify(action === 'sale' ? 'Sale recorded. Stock recalculated.' : 'Restock recorded. Stock recalculated.');
    return true;
  };
  const saveStockFromModal = ({ action, quantity }) => {
    if (selectedProduct && applyTransaction(selectedProduct.id, action, quantity)) setModalMode(null);
  };

  const updateSettings = (patch) => { setSettings((current) => ({ ...current, ...patch })); notify('Setting updated.'); };
  const resetSettings = () => { setSettings(defaultSettings); notify('Settings restored to defaults.'); };
  const resetData = () => {
    setProducts(initialProducts); setTransactions([]); notify('Demo data restored.');
  };
  const clearTransactions = () => {
    setTransactions([]); notify('Transaction history cleared.');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar activeView={activeView} onNavigate={navigate} lowCount={lowCount + outCount} workspaceName={workspaceName} />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-9 lg:py-7">
          <Header activeView={activeView} workspaceName={workspaceName} userName={userName} onExport={exportCsv} onMenu={() => setMobileNav((v) => !v)} />
          {mobileNav && <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 lg:hidden">{allViewLabels.map((view) => <button key={view} onClick={() => navigate(view)} className={`rounded-lg px-3 py-2 text-xs font-bold ${activeView === view ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{view}</button>)}</div>}

          {activeView === 'Overview' && <Overview products={products} onAddProduct={openAddProduct} onRestock={openUpdateStock} />}
          {activeView === 'Inventory' && <InventoryPage products={products} onUpdateStock={openUpdateStock} onAddProduct={openAddProduct} />}
          {activeView === 'Restock planner' && <RestockPlanner products={products} defaultBudget={defaultBudget} />}
          {activeView === 'Transactions' && <Transactions products={products} transactions={transactions} onRecord={applyTransaction} />}
          {activeView === 'Reports' && <Reports products={products} transactions={transactions} onExport={exportCsv} />}
          {activeView === 'Settings' && <Settings settings={settings} onChange={updateSettings} onResetSettings={resetSettings} onResetData={resetData} onClearTransactions={clearTransactions} onExport={exportCsv} />}

          <footer className="py-6 text-center text-xs text-slate-400">{workspaceName} demo · Product data is stored in memory and resets on refresh</footer>
        </main>
      </div>

      <InventoryModal mode={modalMode} product={selectedProduct} defaultReorder={defaultReorder} onClose={() => setModalMode(null)} onSaveProduct={addProduct} onSaveStock={saveStockFromModal} />
      {toast && <div role="status" className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}
    </div>
  );
}
