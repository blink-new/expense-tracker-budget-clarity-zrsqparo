import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from './components/ui/button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { AddExpenseDialog } from './components/AddExpenseDialog'
import { ExpenseList } from './components/ExpenseList'
import { Dashboard } from './components/Dashboard'
import { AccountSelector } from './components/AccountSelector'
import { Expense, Account } from './types'

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Main Checking', type: 'checking', balance: 2500 },
    { id: '2', name: 'Savings', type: 'savings', balance: 8900 },
    { id: '3', name: 'Credit Card', type: 'credit', balance: -450 }
  ])
  const [selectedAccount, setSelectedAccount] = useState<string>('all')
  const [showAddExpense, setShowAddExpense] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }

    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    }
  }, [])

  // Save expenses to localStorage when they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  // Save accounts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts))
  }, [accounts])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    }
    setExpenses([newExpense, ...expenses])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  const filteredExpenses = selectedAccount === 'all' 
    ? expenses 
    : expenses.filter(exp => exp.accountId === selectedAccount)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
              <p className="text-sm text-gray-600">Smart budget clarity</p>
            </div>
            <div className="flex items-center gap-3">
              <AccountSelector
                accounts={accounts}
                selectedAccount={selectedAccount}
                onAccountChange={setSelectedAccount}
              />
              <Button 
                onClick={() => setShowAddExpense(true)}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              expenses={filteredExpenses} 
              accounts={accounts}
              selectedAccount={selectedAccount}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseList 
              expenses={filteredExpenses}
              accounts={accounts}
              onDeleteExpense={deleteExpense}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        onAddExpense={addExpense}
        accounts={accounts}
      />
    </div>
  )
}

export default App