import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { Expense, Account } from '../types'

interface DashboardProps {
  expenses: Expense[]
  accounts: Account[]
  selectedAccount: string
}

export function Dashboard({ expenses, accounts, selectedAccount }: DashboardProps) {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Filter expenses for current month
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })

  // Calculate total spending for current month
  const totalSpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate spending by category
  const categoryData = useMemo(() => {
    const categoryMap = new Map()
    
    monthlyExpenses.forEach(expense => {
      const key = expense.category.name
      if (categoryMap.has(key)) {
        categoryMap.set(key, {
          ...categoryMap.get(key),
          amount: categoryMap.get(key).amount + expense.amount
        })
      } else {
        categoryMap.set(key, {
          name: expense.category.name,
          amount: expense.amount,
          color: expense.category.color,
          icon: expense.category.icon
        })
      }
    })

    return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount)
  }, [monthlyExpenses])

  // Calculate daily spending for the current month
  const dailySpending = useMemo(() => {
    const dailyMap = new Map()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    
    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
      dailyMap.set(day, 0)
    }
    
    // Add actual spending
    monthlyExpenses.forEach(expense => {
      const day = new Date(expense.date).getDate()
      dailyMap.set(day, dailyMap.get(day) + expense.amount)
    })

    return Array.from(dailyMap.entries())
      .slice(0, Math.min(currentDate.getDate(), 14)) // Show last 14 days or current day
      .map(([day, amount]) => ({
        day: `${day}`,
        amount: Number(amount.toFixed(2))
      }))
  }, [monthlyExpenses, currentDate])

  // Calculate account balances for selected account view
  const accountData = useMemo(() => {
    if (selectedAccount === 'all') {
      return accounts.map(account => ({
        name: account.name,
        balance: account.balance,
        type: account.type
      }))
    } else {
      const account = accounts.find(acc => acc.id === selectedAccount)
      return account ? [{ name: account.name, balance: account.balance, type: account.type }] : []
    }
  }, [accounts, selectedAccount])

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month Total</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalSpending.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthName} {currentYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${(totalSpending / Math.max(currentDate.getDate(), 1)).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {currentDate.getDate()} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryData.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthlyExpenses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Spending Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="amount"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Category Legend */}
                <div className="space-y-2">
                  {categoryData.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs">{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <span className="font-medium">${category.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm">No spending data</p>
                  <p className="text-xs">Add some expenses to see charts</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Spending Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {dailySpending.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySpending}>
                    <XAxis 
                      dataKey="day" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="#ef4444"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm">No daily data</p>
                  <p className="text-xs">Start tracking to see trends</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accountData.map((account, index) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {account.balance >= 0 ? '+' : ''}${account.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}