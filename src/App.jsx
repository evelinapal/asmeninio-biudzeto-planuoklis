import { useState } from 'react'
import './App.css'
import BudgetForm from './components/BudgetForm'
import BudgetOverview from './components/BudgetOverview'
import EmptyBudget from './components/EmptyBudget'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Modal from './components/Modal'
import MonthSwitcher from './components/MonthSwitcher'
import Notice from './components/Notice'
import { createInitialMonths } from './demoData'
import { sumCents } from './money'
import { monthKey, shiftMonth } from './months'

let expenseSequence = 0

function nextExpenseId() {
  expenseSequence += 1
  return `expense-${expenseSequence}`
}

export default function App() {
  const [months, setMonths] = useState(createInitialMonths)
  const [selected, setSelected] = useState({ year: 2026, month: 11 })
  const [notice, setNotice] = useState(null)
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)

  const key = monthKey(selected.year, selected.month)
  const monthData = months[key]
  const hasBudget = Boolean(monthData)

  function changeMonth(delta) {
    setSelected((current) => shiftMonth(current.year, current.month, delta))
    setNotice(null)
    setBudgetOpen(false)
    setExpenseOpen(false)
  }

  function saveBudget(amountCents) {
    setMonths((current) => {
      if (current[key]) return current
      return {
        ...current,
        [key]: { budgetCents: amountCents, expenses: [] },
      }
    })
    setBudgetOpen(false)
    setNotice({ type: 'success', text: 'Biudžetas išsaugotas.' })
  }

  function saveExpense({ name, amountCents }) {
    const expense = {
      id: nextExpenseId(),
      name,
      amountCents,
      createdAt: Date.now(),
    }
    setMonths((current) => {
      const existing = current[key]
      if (!existing || existing.expenses.some((item) => item.id === expense.id)) {
        return current
      }
      return {
        ...current,
        [key]: {
          ...existing,
          expenses: [...existing.expenses, expense],
        },
      }
    })
    setExpenseOpen(false)
    setNotice({ type: 'success', text: 'Išlaida pridėta.' })
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Asmeniniai finansai</p>
          <h1>Mano biudžetas</h1>
        </div>
        <MonthSwitcher
          year={selected.year}
          month={selected.month}
          onShift={changeMonth}
        />
      </header>

      <main>
        <Notice notice={notice} />

        {hasBudget ? (
          <>
            <BudgetOverview
              budgetCents={monthData.budgetCents}
              spentCents={sumCents(monthData.expenses)}
            />
            <ExpenseList
              expenses={monthData.expenses}
              onAdd={() => {
                setNotice(null)
                setExpenseOpen(true)
              }}
            />
          </>
        ) : (
          <EmptyBudget
            onCreate={() => {
              setNotice(null)
              setBudgetOpen(true)
            }}
          />
        )}
      </main>

      {budgetOpen ? (
        <Modal title="Naujas biudžetas" onClose={() => setBudgetOpen(false)}>
          <BudgetForm onSave={saveBudget} onCancel={() => setBudgetOpen(false)} />
        </Modal>
      ) : null}

      {expenseOpen && hasBudget ? (
        <Modal title="Nauja išlaida" onClose={() => setExpenseOpen(false)}>
          <ExpenseForm onSave={saveExpense} onCancel={() => setExpenseOpen(false)} />
        </Modal>
      ) : null}
    </div>
  )
}
