import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { IndianRupee, Wallet, TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BudgetSummaryCardsProps {
    overview: {
        totalEstimated: number
        totalActual: number
        totalPaid: number
    }
}

export function BudgetSummaryCards({ overview }: BudgetSummaryCardsProps) {
    const { totalEstimated, totalActual, totalPaid } = overview

    const percentageSpent = totalEstimated > 0 ? (totalActual / totalEstimated) * 100 : 0
    const remainingBudget = totalEstimated - totalActual
    const isOverBudget = remainingBudget < 0

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Estimated
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalEstimated)}</div>
                    <p className="text-xs text-muted-foreground">
                        Allocated budget
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Spent (Actual)
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", isOverBudget ? "text-red-600" : "text-gray-900")}>
                        {formatCurrency(totalActual)}
                    </div>
                    <Progress
                        value={Math.min(percentageSpent, 100)}
                        className={cn("h-2 mt-2", isOverBudget ? "bg-red-100" : "bg-gray-100")}
                    // indicatorClassName handled by standard Progress or we need custom indicator styles logic
                    // shadcn Progress 'indicator' is internal. To style it, we rely on value.
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                        {percentageSpent.toFixed(1)}% utilizing
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Remaining
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", isOverBudget ? "text-red-600" : "text-green-600")}>
                        {formatCurrency(remainingBudget)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {isOverBudget ? "Over budget" : "Available to spend"}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
