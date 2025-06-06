import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Account } from '../types'

interface AccountSelectorProps {
  accounts: Account[]
  selectedAccount: string
  onAccountChange: (accountId: string) => void
}

export function AccountSelector({ accounts, selectedAccount, onAccountChange }: AccountSelectorProps) {
  return (
    <Select value={selectedAccount} onValueChange={onAccountChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center justify-between w-full">
            <span>All Accounts</span>
            <span className="text-xs text-gray-500 ml-2">
              ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toFixed(2)}
            </span>
          </div>
        </SelectItem>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            <div className="flex items-center justify-between w-full">
              <span>{account.name}</span>
              <span className={`text-xs ml-2 ${
                account.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${account.balance.toFixed(2)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}