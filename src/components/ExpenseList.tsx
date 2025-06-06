import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Expense, Account } from '../types'

interface ExpenseListProps {
  expenses: Expense[]
  accounts: Account[]
  onDeleteExpense: (id: string) => void
}

export function ExpenseList({ expenses, accounts, onDeleteExpense }: ExpenseListProps) {
  const getAccountName = (accountId: string) => {
    return accounts.find(account => account.id === accountId)?.name || 'Unknown Account'
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-500">
            <p className="text-lg font-medium">No expenses yet</p>
            <p className="text-sm">Add your first expense to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Expenses
            <Badge variant="secondary" className="ml-2">
              {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${expense.category.color}20` }}
                >
                  {expense.category.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{expense.category.name}</span>
                    <span>•</span>
                    <span>{getAccountName(expense.accountId)}</span>
                    <span>•</span>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    -${expense.amount.toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}