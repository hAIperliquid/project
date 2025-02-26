import { DollarSign, Bitcoin, EclipseIcon as Ethereum } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FundPortfolio() {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-xl">Fund Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="text-2xl font-bold mb-4">$28,000,000</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="text-green-500" size={18} />
              <span className="text-sm font-semibold">USDC</span>
            </div>
            <div className="text-lg font-bold">20,000,000</div>
            <div className="text-xs text-muted-foreground">
              71.43% of portfolio
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Bitcoin className="text-orange-500" size={18} />
              <span className="text-sm font-semibold">BTC</span>
            </div>
            <div className="text-lg font-bold">100</div>
            <div className="text-xs text-muted-foreground">
              ≈ $3,000,000 (10.71%)
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Ethereum className="text-blue-500" size={18} />
              <span className="text-sm font-semibold">ETH</span>
            </div>
            <div className="text-lg font-bold">50</div>
            <div className="text-xs text-muted-foreground">
              ≈ $100,000 (0.36%)
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="text-purple-500" size={18} />
              <span className="text-sm font-semibold">SOL</span>
            </div>
            <div className="text-lg font-bold">100</div>
            <div className="text-xs text-muted-foreground">
              ≈ $2,000 (0.01%)
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
