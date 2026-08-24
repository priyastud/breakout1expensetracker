import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CirclePlus,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  ListFilter,
  MoreHorizontal,
  Search,
  Settings,
  Tag,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'

type Transaction = {
  id: number
  merchant: string
  category: string
  amount: number
  date: string
  method: string
  color: string
}

const categories = [
  { name: 'Housing', color: '#e58b62' },
  { name: 'Food & dining', color: '#e4c05e' },
  { name: 'Transport', color: '#78a9a1' },
  { name: 'Shopping', color: '#8a8fc2' },
  { name: 'Subscriptions', color: '#8a8fc2' },
]

const today = new Date()
const currentMonth = today.toISOString().slice(0, 7)
const currentDate = today.toISOString().slice(0, 10)
const monthName = today.toLocaleDateString('en-US', { month: 'long' })
const dateRange = `${monthName} 1 — ${monthName} ${new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()}, ${today.getFullYear()}`

function dateInCurrentMonth(day: number) {
  return new Date(today.getFullYear(), today.getMonth(), day).toISOString().slice(0, 10)
}

const initialTransactions: Transaction[] = [
  { id: 1, merchant: 'Whole Foods Market', category: 'Food & dining', amount: 84.52, date: dateInCurrentMonth(Math.max(1, today.getDate() - 1)), method: 'Visa •••• 4821', color: '#e4c05e' },
  { id: 2, merchant: 'Adobe Creative Cloud', category: 'Subscriptions', amount: 54.99, date: dateInCurrentMonth(Math.max(1, today.getDate() - 2)), method: 'Visa •••• 4821', color: '#8a8fc2' },
  { id: 3, merchant: 'City Power & Light', category: 'Housing', amount: 128.4, date: dateInCurrentMonth(Math.max(1, today.getDate() - 3)), method: 'Checking account', color: '#e58b62' },
  { id: 4, merchant: 'Metro Transit', category: 'Transport', amount: 32, date: dateInCurrentMonth(Math.max(1, today.getDate() - 4)), method: 'Apple Pay', color: '#78a9a1' },
  { id: 5, merchant: 'The Book Nook', category: 'Shopping', amount: 42.75, date: dateInCurrentMonth(Math.max(1, today.getDate() - 5)), method: 'Visa •••• 4821', color: '#8a8fc2' },
]

function loadTransactions() {
  const saved = localStorage.getItem('ledgerly-transactions')
  if (!saved) return initialTransactions

  const savedTransactions: Transaction[] = JSON.parse(saved)
  return savedTransactions.some((transaction) => transaction.date.startsWith(currentMonth))
    ? savedTransactions
    : [...initialTransactions, ...savedTransactions]
}

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const totalBudget = 100000

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return loadTransactions()
  })
  const [activeView, setActiveView] = useState('Overview')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [newExpense, setNewExpense] = useState({ merchant: '', amount: '', category: 'Food & dining', date: currentDate })

  useEffect(() => {
    localStorage.setItem('ledgerly-transactions', JSON.stringify(transactions))
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const normalized = query.toLowerCase().trim()
    return transactions.filter((transaction) =>
      !normalized || `${transaction.merchant} ${transaction.category} ${transaction.method}`.toLowerCase().includes(normalized),
    )
  }, [transactions, query])

  const currentMonthTransactions = transactions.filter((transaction) => transaction.date.startsWith(currentMonth))
  const monthTotal = currentMonthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const monthlyExpenditure = monthTotal
  const categoryTotals = categories.map((category) => ({
    ...category,
    total: currentMonthTransactions.filter((transaction) => transaction.category === category.name).reduce((sum, transaction) => sum + transaction.amount, 0),
  })).filter((category) => category.total > 0)
  const categoryTotal = categoryTotals.reduce((sum, category) => sum + category.total, 0)
  const categoryGradient = categoryTotal ? categoryTotals.reduce<{ stops: string[]; position: number }>((gradient, category) => {
    const end = gradient.position + category.total / categoryTotal * 100
    gradient.stops.push(`${category.color} ${gradient.position}% ${end}%`)
    return { stops: gradient.stops, position: end }
  }, { stops: [], position: 0 }).stops.join(', ') : '#dce5df 0 100%'

  function addExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amount = Number(newExpense.amount)
    if (!newExpense.merchant.trim() || !amount || amount < 0) {
      setFormError('Enter a merchant and a positive amount.')
      return
    }
    const category = categories.find((item) => item.name === newExpense.category)
    setTransactions((current) => [{
      id: Date.now(), merchant: newExpense.merchant.trim(), category: newExpense.category, amount,
      date: newExpense.date, method: 'Visa •••• 4821', color: category?.color ?? '#78a9a1',
    }, ...current])
    setNewExpense({ merchant: '', amount: '', category: 'Food & dining', date: currentDate })
    setFormError('')
    setShowForm(false)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Wallet size={18} /></span><span>ledgerly</span></div>
        <p className="eyebrow">Workspace</p>
        <nav>
          <button className={activeView === 'Overview' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('Overview')}><LayoutDashboard size={18} />Overview</button>
          <button className={activeView === 'Transactions' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('Transactions')}><CreditCard size={18} />Transactions <span className="nav-count">{transactions.length}</span></button>
          <button className="nav-item" onClick={() => setActiveView('Budgets')}><Tag size={18} />Budgets</button>
          <button className="nav-item" onClick={() => setActiveView('Reports')}><TrendingUp size={18} />Reports</button>
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings size={18} />Settings</button><div className="profile"><span className="avatar">AM</span><span><strong>Alex Morgan</strong><small>Personal account</small></span><MoreHorizontal size={17} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><p className="kicker">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><h1>{activeView}</h1></div><button className="add-button" onClick={() => setShowForm(true)}><CirclePlus size={18} />Add expense</button></header>
        {activeView === 'Overview' ? <>
          <section className="summary-grid">
            <article className="summary-card featured"><div className="card-label"><span>Total spent</span><span className="trend down"><ArrowDownRight size={15} /> 8.4%</span></div><strong>{money.format(monthTotal)}</strong><small>{dateRange}</small><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="summary-card"><div className="card-label"><span>Monthly expenditure</span><span className="trend up"><ArrowUpRight size={15} /> 3.2%</span></div><strong>{money.format(monthlyExpenditure)}</strong><small>{monthName} planned expenditure</small><div className="mini-progress"><span style={{ width: `${monthlyExpenditure / totalBudget * 100}%` }} /></div><small className="progress-copy">{monthlyExpenditure / totalBudget * 100}% of total budget</small></article>
            <article className="summary-card"><div className="card-label"><span>Total budget</span><span className="soft-icon"><CalendarDays size={16} /></span></div><strong>{money.format(totalBudget)}</strong><small>Monthly budget limit</small><div className="daily-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
          </section>
          <div className="content-grid"><section className="panel spending-panel"><div className="panel-heading"><div><p className="kicker">{monthName} overview</p><h2>Where your money goes</h2></div><button className="select-button">This month <ChevronDown size={15} /></button></div><div className="category-layout"><div className="donut" style={{ background: `conic-gradient(${categoryGradient})` }}><div><strong>{money.format(categoryTotal)}</strong><span>total</span></div></div><div className="category-list">{categoryTotals.length ? categoryTotals.map((category) => <div className="category-row" key={category.name}><span className="category-name"><i style={{ background: category.color }} />{category.name}</span><strong>{money.format(category.total)}</strong><small>{Math.round(category.total / categoryTotal * 100)}%</small></div>) : <div className="empty-state">No expenses recorded this month.</div>}</div></div><div className="budget-line"><span><strong>Total budget</strong><small>{money.format(totalBudget)} limit</small></span><strong>{money.format(monthlyExpenditure)} <small>planned expenditure</small></strong><div className="budget-track"><i style={{ width: `${Math.min(monthlyExpenditure / totalBudget * 100, 100)}%` }} /></div></div></section><section className="panel insight-panel"><div className="insight-icon"><DollarSign size={19} /></div><p className="kicker">A little insight</p><h2>You're spending less on dining out</h2><p>Dining expenses are down 14% compared to May. That's a saving of <strong>{money.format(8240)}</strong> this month.</p><button className="text-button">View spending report <ArrowUpRight size={15} /></button></section></div>
        </> : <section className="panel transactions-view"><div className="panel-heading"><div><p className="kicker">Your activity</p><h2>All transactions</h2></div><button className="select-button"><ListFilter size={15} /> Filter</button></div><TransactionList transactions={filteredTransactions} query={query} setQuery={setQuery} /></section>}
        {activeView === 'Overview' && <section className="panel recent-panel"><div className="panel-heading"><div><p className="kicker">Latest activity</p><h2>Recent transactions</h2></div><button className="text-button" onClick={() => setActiveView('Transactions')}>View all <ArrowUpRight size={15} /></button></div><TransactionList transactions={filteredTransactions.slice(0, 5)} query={query} setQuery={setQuery} /></section>}
      </main>
      {showForm && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(false)}><form className="expense-modal" onSubmit={addExpense}><button type="button" className="close-button" onClick={() => setShowForm(false)}><X size={18} /></button><p className="kicker">New transaction</p><h2>Add an expense</h2><label>Merchant<input autoFocus value={newExpense.merchant} onChange={(event) => setNewExpense({ ...newExpense, merchant: event.target.value })} placeholder="e.g. Local market" /></label><div className="form-row"><label>Amount<input type="number" min="0.01" step="0.01" value={newExpense.amount} onChange={(event) => setNewExpense({ ...newExpense, amount: event.target.value })} placeholder="0.00" /></label><label>Date<input type="date" value={newExpense.date} onChange={(event) => setNewExpense({ ...newExpense, date: event.target.value })} /></label></div><label>Category<select value={newExpense.category} onChange={(event) => setNewExpense({ ...newExpense, category: event.target.value })}>{categories.map((category) => <option key={category.name}>{category.name}</option>)}</select></label>{formError && <p className="form-error">{formError}</p>}<button className="save-button" type="submit">Save expense</button></form></div>}
    </div>
  )
}

function TransactionList({ transactions, query, setQuery }: { transactions: Transaction[]; query: string; setQuery: (value: string) => void }) {
  return <><div className="search-wrap"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" /></div><div className="transaction-list">{transactions.length ? transactions.map((transaction) => <div className="transaction-row" key={transaction.id}><span className="transaction-icon" style={{ background: `${transaction.color}24`, color: transaction.color }}><CreditCard size={17} /></span><span className="transaction-main"><strong>{transaction.merchant}</strong><small>{transaction.category} · {transaction.method}</small></span><span className="transaction-date">{new Date(`${transaction.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span><strong className="transaction-amount">− {money.format(transaction.amount)}</strong><button className="row-menu" aria-label={`More options for ${transaction.merchant}`}><MoreHorizontal size={17} /></button></div>) : <div className="empty-state">No transactions match “{query}”.</div>}</div></>
}

export default App
