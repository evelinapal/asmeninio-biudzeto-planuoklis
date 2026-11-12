
import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import './App.css'
import AuthForm from './components/AuthForm'
import BudgetForm from './components/BudgetForm'
import BudgetOverview from './components/BudgetOverview'
import EmptyBudget from './components/EmptyBudget'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import Modal from './components/Modal'
import MonthSwitcher from './components/MonthSwitcher'
import Notice from './components/Notice'
import { sumCents } from './money'
import { monthKey, shiftMonth } from './months'

export default function App() {
  const [session, setSession] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [months, setMonths] = useState({})
  const [selected, setSelected] = useState({ year: 2026, month: 11 })
  const [notice, setNotice] = useState(null)
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [budgetLoading, setBudgetLoading] = useState(false)
  const requestVersion = useRef(0)
  const saveInProgress = useRef(false)

  useEffect(() => {
    let active = true
    let currentUserId = null

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return

      const nextUserId = nextSession?.user?.id ?? null
      if (nextUserId !== currentUserId) {
        requestVersion.current += 1
        currentUserId = nextUserId
        setMonths({})
        setBudgetLoading(false)
        setSelected({ year: 2026, month: 11 })
        setNotice(null)
        setBudgetOpen(false)
        setExpenseOpen(false)
      }
      setSession(nextSession)
      setSessionLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!active) return
      if (error) {
        console.error('Nepavyko patikrinti prisijungimo sesijos:', error.message)
        setSession(null)
        setSessionLoading(false)
        return
      }

      const initialUserId = initialSession?.user?.id ?? null
      if (initialUserId !== currentUserId) {
        requestVersion.current += 1
        currentUserId = initialUserId
        setMonths({})
        setBudgetLoading(false)
        setSelected({ year: 2026, month: 11 })
        setNotice(null)
        setBudgetOpen(false)
        setExpenseOpen(false)
      }
      setSession(initialSession)
      setSessionLoading(false)
    }).catch((error) => {
      if (!active) return
      console.error('Nepavyko patikrinti prisijungimo sesijos:', error?.message)
      setSession(null)
      setSessionLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user?.id
  const monthQueryKey = monthKey(selected.year, selected.month)

  useEffect(() => {
    if (!userId || sessionLoading) return undefined

    const version = ++requestVersion.current
    let active = true
    setBudgetLoading(true)

    supabase
      .from('budgets')
      .select('id, amount')
      .eq('user_id', userId)
      .eq('name', monthQueryKey)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (!active || version !== requestVersion.current) return
        if (error) {
          setNotice({ type: 'error', text: 'Biudžeto nuskaityti nepavyko. Bandykite dar kartą.' })
          return
        }

        if (data) {
          const budgetCents = Math.round(Number(data.amount) * 100)
          if (!Number.isFinite(budgetCents)) {
            setNotice({ type: 'error', text: 'Išsaugoto biudžeto suma netinkama.' })
            return
          }
          const { data: expenseRows, error: expensesError } = await supabase
            .from('expenses')
            .select('id, title, amount, category, created_at')
            .eq('budget_id', data.id)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

          if (!active || version !== requestVersion.current) return
          if (expensesError) {
            setNotice({ type: 'error', text: 'Išlaidų nuskaityti nepavyko. Bandykite dar kartą.' })
            return
          }

          const expenses = expenseRows.map((expense) => ({
            id: expense.id,
            name: expense.title,
            amountCents: Math.round(Number(expense.amount) * 100),
            category: expense.category,
            createdAt: new Date(expense.created_at).getTime(),
          }))
          setMonths((current) => ({
            ...current,
            [monthQueryKey]: { ...current[monthQueryKey], budgetId: data.id, budgetCents, expenses },
          }))
        }
      })
      .catch(() => {
        if (active && version === requestVersion.current) {
          setNotice({ type: 'error', text: 'Biudžeto nuskaityti nepavyko. Bandykite dar kartą.' })
        }
      })
      .finally(() => {
        if (active && version === requestVersion.current) setBudgetLoading(false)
      })

    return () => {
      active = false
    }
  }, [userId, sessionLoading, monthQueryKey])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) setNotice({ type: 'error', text: 'Nepavyko atsijungti. Bandykite dar kartą.' })
  }

  if (sessionLoading) {
    return <div className="app"><main><p role="status">Tikrinama prisijungimo sesija…</p></main></div>
  }

  if (!session) {
    return (
      <div className="app">
        <header className="topbar">
          <div>
            <p className="eyebrow">Asmeniniai finansai</p>
            <h1>Mano biudžetas</h1>
          </div>
        </header>
        <main><AuthForm /></main>
      </div>
    )
  }

  const key = monthKey(selected.year, selected.month)
  const monthData = months[key]
  const hasBudget = Boolean(monthData)

  function changeMonth(delta) {
    setSelected((current) => shiftMonth(current.year, current.month, delta))
    setNotice(null)
    setBudgetOpen(false)
    setExpenseOpen(false)
  }

  async function saveBudget(amountCents) {
    if (!userId || saveInProgress.current || months[key]) return
    saveInProgress.current = true
    setBudgetLoading(true)
    setNotice(null)
    const version = requestVersion.current
    const saveUserId = userId
    const saveMonthKey = key
    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({ user_id: saveUserId, name: saveMonthKey, amount: amountCents / 100 })
        .select('id, amount')
        .single()
      if (error) {
        if (version === requestVersion.current) setNotice({ type: 'error', text: error.code === '23505' ? 'Šio mėnesio biudžetas jau sukurtas.' : 'Biudžeto išsaugoti nepavyko. Bandykite dar kartą.' })
        return
      }
      if (version !== requestVersion.current || saveUserId !== session?.user?.id || saveMonthKey !== monthKey(selected.year, selected.month)) return
      setMonths((current) => current[saveMonthKey] ? current : { ...current, [saveMonthKey]: { budgetId: data.id, budgetCents: Math.round(Number(data.amount) * 100), expenses: [] } })
      setBudgetOpen(false)
      setNotice({ type: 'success', text: 'Biudžetas išsaugotas.' })
    } catch {
      if (version === requestVersion.current) setNotice({ type: 'error', text: 'Biudžeto išsaugoti nepavyko. Bandykite dar kartą.' })
    } finally {
      saveInProgress.current = false
      if (version === requestVersion.current) setBudgetLoading(false)
    }
  }

  async function saveExpense({ name, amountCents, category }) {
    const monthBudget = months[key]
    if (!userId || !monthBudget) {
      setNotice({ type: 'error', text: 'Pirmiausia įkelkite mėnesio biudžetą.' })
      return false
    }

    const version = requestVersion.current
    const saveUserId = userId
    const saveMonthKey = key
    setBudgetLoading(true)
    setNotice(null)
    try {
      let budgetId = monthBudget.budgetId
      if (!budgetId) {
        const { data: budgetRow, error: budgetError } = await supabase
          .from('budgets')
          .select('id')
          .eq('user_id', saveUserId)
          .eq('name', saveMonthKey)
          .maybeSingle()

        if (budgetError) throw budgetError
        if (!budgetRow?.id) {
          if (version === requestVersion.current) {
            setNotice({ type: 'error', text: 'Nepavyko rasti šio mėnesio biudžeto. Atnaujinkite mėnesio duomenis.' })
          }
          return false
        }
        budgetId = budgetRow.id
        if (version !== requestVersion.current || saveUserId !== session?.user?.id || saveMonthKey !== monthKey(selected.year, selected.month)) return false
        setMonths((current) => {
          const existing = current[saveMonthKey]
          if (!existing || existing.budgetId) return current
          return { ...current, [saveMonthKey]: { ...existing, budgetId } }
        })
      }

      const { data, error } = await supabase
        .from('expenses')
        .insert({ budget_id: budgetId, user_id: saveUserId, title: name, amount: amountCents / 100, category })
        .select('id, title, amount, category, created_at')
        .single()

      if (error) throw error
      if (version !== requestVersion.current || saveUserId !== session?.user?.id || saveMonthKey !== monthKey(selected.year, selected.month)) return false

      const expense = {
        id: data.id,
        name: data.title,
        amountCents: Math.round(Number(data.amount) * 100),
        category: data.category,
        createdAt: new Date(data.created_at).getTime(),
      }
      setMonths((current) => {
        const existing = current[saveMonthKey]
        if (!existing || existing.budgetId !== budgetId) return current
        return { ...current, [saveMonthKey]: { ...existing, expenses: [...existing.expenses, expense] } }
      })
      setExpenseOpen(false)
      setNotice({ type: 'success', text: 'Išlaida pridėta.' })
      return true
    } catch {
      if (version === requestVersion.current) setNotice({ type: 'error', text: 'Išlaidos išsaugoti nepavyko. Bandykite dar kartą.' })
      return false
    } finally {
      if (version === requestVersion.current) setBudgetLoading(false)
    }
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
        <button type="button" className="btn btn-ghost" onClick={signOut}>
          Atsijungti
        </button>
      </header>

      <main>
        <Notice notice={notice} />

        {budgetLoading ? (
          <p role="status">Įkeliamas mėnesio biudžetas…</p>
        ) : hasBudget ? (
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

      {budgetOpen && !budgetLoading ? (
        <Modal title="Naujas biudžetas" onClose={() => setBudgetOpen(false)}>
          <BudgetForm onSave={saveBudget} onCancel={() => setBudgetOpen(false)} />
        </Modal>
      ) : null}

      {expenseOpen && hasBudget ? (
        <Modal title="Nauja išlaida" onClose={() => setExpenseOpen(false)}>
          <ExpenseForm onSave={saveExpense} onCancel={() => setExpenseOpen(false)} saving={budgetLoading} />
        </Modal>
      ) : null}
    </div>
  )
}
