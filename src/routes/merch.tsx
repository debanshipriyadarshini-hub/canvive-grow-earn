import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart, Package, Zap } from "lucide-react";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MERCH_PRODUCTS, MERCH_IMPACT_STEPS, type MerchProduct } from "@/lib/canvive/data";
import { formatDate, useCanVive, type Redemption } from "@/lib/canvive/store";
import { Meter } from "@/components/canvive/StatCard";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch Store — CanVive" },
      { name: "description", content: "Explore and redeem creative CanVive merchandise made from collected aluminium cans." },
      { property: "og:title", content: "Merch Store — CanVive" },
      { property: "og:description", content: "Your cans can become something more." },
    ],
  }),
  component: () => (
    <AppShell>
      <MerchStore />
    </AppShell>
  ),
});

function MerchStore() {
  const { state, redeemMerch } = useCanVive();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [confirmProduct, setConfirmProduct] = useState<MerchProduct | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<MerchProduct | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [redemptionResult, setRedemptionResult] = useState<Redemption | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<{ product: MerchProduct; quantity: number } | null>(null);

  const filteredProducts =
    selectedCategory === "all"
      ? MERCH_PRODUCTS
      : MERCH_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleRedeem = (product: MerchProduct) => {
    if (state.points < product.pointsCost) {
      toast.error(`You need ${product.pointsCost - state.points} more points to redeem this item.`);
      return;
    }

    // Use the redeemMerch function to properly handle merch redemption
    const result = redeemMerch(product);
    
    if (result) {
      setRedemptionResult(result);
      setConfirmProduct(null);
      toast.success(`You redeemed the ${product.name}! 🎉`);
    } else {
      toast.error("Failed to redeem. Please try again.");
    }
  };

  const handleBuyNow = (product: MerchProduct) => {
    setCheckoutProduct(product);
    setCheckoutQuantity(1);
  };

  const handlePurchaseConfirm = () => {
    if (checkoutProduct) {
      setPurchaseResult({ product: checkoutProduct, quantity: checkoutQuantity });
      setCheckoutProduct(null);
      toast.success(`Order placed successfully! 📦`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="mb-12 rounded-3xl bg-gradient-to-r from-coral-soft via-beige to-sage-soft px-8 py-12 text-center sm:py-16 lg:px-16">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Waste, Reimagined.</h1>
        <p className="mt-4 text-lg text-foreground/80 sm:text-xl">Your cans can become something more.</p>
        <p className="mt-2 text-base text-muted-foreground">
          Explore creative CanVive merchandise crafted from collected aluminium cans.
        </p>
      </section>

      {/* Points Display */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Made from Your Impact."
          subtitle="Every piece begins with a can and gets a second life."
        />
        <div className="rounded-full bg-sage-soft px-6 py-3 text-sm font-medium">
          <div className="text-xs text-muted-foreground">YOUR POINTS</div>
          <div className="text-2xl font-bold">{state.points} ⭐</div>
        </div>
      </div>

      {/* Tabs for Categories */}
      <Tabs
        defaultValue="all"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-5 gap-2 sm:gap-4">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All Products
          </TabsTrigger>
          <TabsTrigger value="accessories" className="text-xs sm:text-sm">
            Accessories
          </TabsTrigger>
          <TabsTrigger value="badges" className="text-xs sm:text-sm">
            Badges
          </TabsTrigger>
          <TabsTrigger value="desk" className="text-xs sm:text-sm">
            Desk Items
          </TabsTrigger>
          <TabsTrigger value="lighting" className="text-xs sm:text-sm">
            Lighting
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => {
          const affordable = state.points >= product.pointsCost;
          return (
            <article
              key={product.id}
              className="card-soft flex flex-col overflow-hidden transition-transform hover:scale-105"
            >
              {/* Product Icon/Visual */}
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-sage-soft to-beige text-5xl sm:h-40">
                {product.icon}
              </div>

              {/* Product Content */}
              <div className="flex flex-col p-4 sm:p-5">
                <div className="mb-2 inline-block w-fit rounded-full bg-coral-soft px-3 py-1 text-xs font-medium text-foreground/80">
                  {product.tag}
                </div>

                <h3 className="text-base font-semibold sm:text-lg">{product.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{product.description}</p>

                {/* Pricing */}
                <div className="mt-4 space-y-2 border-t border-border pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold">₹{product.priceRupees}</span>
                    <span className="text-xs text-muted-foreground">Direct Purchase</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-lg font-bold text-orange-600">
                      {product.pointsCost} ⭐
                    </span>
                    <span className="text-xs text-muted-foreground">Or Redeem</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    className="w-full"
                    variant="accent"
                    size="sm"
                    onClick={() => handleBuyNow(product)}
                  >
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                    Buy Now
                  </Button>
                  <Button
                    className="w-full"
                    variant={affordable ? "default" : "outline"}
                    size="sm"
                    disabled={!affordable}
                    onClick={() => setConfirmProduct(product)}
                  >
                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                    {affordable ? "Redeem" : `${product.pointsCost - state.points} more points`}
                  </Button>
                </div>

                {!affordable && (
                  <div className="mt-3">
                    <Meter value={state.points} max={product.pointsCost} tone="coral" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {state.points} / {product.pointsCost}
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Circular Impact Section */}
      <section className="mt-16 rounded-3xl bg-gradient-to-r from-sage-soft/50 via-beige/50 to-coral-soft/50 px-8 py-12 sm:px-12 sm:py-16">
        <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">From Can to Creation</h2>
        <p className="mt-4 text-center text-muted-foreground">
          Watch how your collected cans transform into meaningful merchandise.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-5">
          {MERCH_IMPACT_STEPS.map((step, idx) => (
            <div key={step.step} className="flex flex-col items-center text-center">
              <div className="mb-3 text-5xl">{step.emoji}</div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              {idx < MERCH_IMPACT_STEPS.length - 1 && (
                <div className="mt-4 hidden h-0.5 w-8 bg-gradient-to-r from-transparent via-foreground to-transparent sm:block md:hidden lg:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Redemption Confirmation Dialog */}
      <Dialog open={!!confirmProduct} onOpenChange={(open) => !open && setConfirmProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem with Points?</DialogTitle>
            <DialogDescription>
              You're about to redeem <strong>{confirmProduct?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cost:</span>
                <span className="font-display text-lg font-bold">{confirmProduct?.pointsCost} ⭐</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Your Points:</span>
                <span className="text-lg font-bold">{state.points} ⭐</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <span className="text-sm font-medium">After Redemption:</span>
                <span className="text-lg font-bold">
                  {confirmProduct ? state.points - confirmProduct.pointsCost : state.points} ⭐
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmProduct(null)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={() => confirmProduct && handleRedeem(confirmProduct)}
            >
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={!!checkoutProduct} onOpenChange={(open) => !open && setCheckoutProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your purchase for <strong>{checkoutProduct?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex gap-4 rounded-lg bg-secondary p-4">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-beige text-4xl">
                {checkoutProduct?.icon}
              </div>
              <div>
                <h4 className="font-semibold">{checkoutProduct?.name}</h4>
                <p className="text-sm text-muted-foreground">{checkoutProduct?.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-md border border-border px-3 py-1 hover:bg-secondary"
                    onClick={() => setCheckoutQuantity(Math.max(1, checkoutQuantity - 1))}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{checkoutQuantity}</span>
                  <button
                    className="rounded-md border border-border px-3 py-1 hover:bg-secondary"
                    onClick={() => setCheckoutQuantity(checkoutQuantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Price:</span>
                  <span>₹{(checkoutProduct?.priceRupees ?? 0) * checkoutQuantity}</span>
                </div>
              </div>

              <div className="rounded-lg bg-blue-soft p-4">
                <p className="text-sm">
                  <strong>Delivery Information:</strong> Please provide your delivery details during final checkout.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckoutProduct(null)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handlePurchaseConfirm}
            >
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* My Collection Section */}
      {(redemptionResult || purchaseResult) && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">My Collection</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {redemptionResult && (
              <div className="card-soft p-4">
                <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-sage-soft text-3xl">
                  {MERCH_PRODUCTS.find((p) => p.id === redemptionResult.rewardId.replace("merch-", ""))?.icon}
                </div>
                <h3 className="font-semibold">{redemptionResult.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Redeemed • {formatDate(redemptionResult.date)}</p>
                <p className="mt-2 rounded-full bg-sage-soft px-3 py-1 text-center text-xs font-medium">
                  Code: {redemptionResult.code}
                </p>
              </div>
            )}
            {purchaseResult && (
              <div className="card-soft p-4">
                <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-beige text-3xl">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="font-semibold">{purchaseResult.product.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Purchased • Qty: {purchaseResult.quantity}
                </p>
                <p className="mt-2 rounded-full bg-coral-soft px-3 py-1 text-center text-xs font-medium">
                  ₹{purchaseResult.product.priceRupees * purchaseResult.quantity}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
