import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShoppingCart, Package, Zap } from "lucide-react";
import { AppShell, PageHeader } from "@/components/canvive/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MERCH_PRODUCTS, MERCH_IMPACT_STEPS, type MerchProduct } from "@/lib/canvive/data";
import { formatDate, useCanVive, type Redemption } from "@/lib/canvive/store";
import { Meter } from "@/components/canvive/StatCard";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Products",
  accessories: "Accessories",
  home: "Home & Decor",
  desk: "Desk & Utility",
  collectibles: "Collectibles",
};

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

  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? MERCH_PRODUCTS
        : MERCH_PRODUCTS.filter((p) => p.category === selectedCategory),
    [selectedCategory],
  );

  const handleRedeem = (product: MerchProduct) => {
    if (state.points < product.redeemPoints) {
      toast.error(`You need ${product.redeemPoints - state.points} more points to redeem this item.`);
      return;
    }

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
      <section className="mb-10 rounded-[32px] border border-border bg-gradient-to-r from-secondary via-card to-sun/40 px-6 py-8 shadow-soft sm:px-10 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">CANVIVE UPCYCLED COLLECTION</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Every can gets a second life.</h1>
        <p className="mt-3 max-w-2xl text-base text-foreground/75 sm:text-lg">
          Made from collected cans. Designed for a second life.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="CANVIVE UPCYCLED COLLECTION"
          subtitle="Premium pieces crafted from reclaimed aluminium cans and redesigned for daily life."
        />
        <div className="rounded-full bg-sage-soft px-6 py-3 text-sm font-medium shadow-sm">
          <div className="text-xs text-muted-foreground">YOUR POINTS</div>
          <div className="text-2xl font-bold text-primary">{state.points} ⭐</div>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="text-[11px] sm:text-sm">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => {
          const affordable = state.points >= product.redeemPoints;
          const requiredPoints = Math.max(0, product.redeemPoints - state.points);
          return (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-sage-soft via-cream to-coral-soft">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-sage-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">CanVive Studio</span>
                </div>

                <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {product.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 text-[10px] font-medium text-secondary-foreground"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-t border-border pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Direct Price</div>
                      <div className="mt-1 font-display text-3xl font-bold text-foreground">₹{product.directPrice}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Redeem</div>
                      <div className="mt-1 font-display text-2xl font-bold text-primary">{product.redeemPoints} ⭐</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Button className="w-full" variant="accent" size="sm" onClick={() => handleBuyNow(product)}>
                    <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                    Buy Directly
                  </Button>
                  <Button
                    className="w-full"
                    variant={affordable ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (!affordable) {
                        toast.error(`You need ${requiredPoints} more points to redeem this item.`);
                        return;
                      }
                      setConfirmProduct(product);
                    }}
                  >
                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                    {affordable ? "Redeem with Points" : `Need ${requiredPoints} more points`}
                  </Button>
                </div>

                {!affordable && (
                  <div className="mt-3 rounded-xl bg-coral-soft px-3 py-2">
                    <Meter value={state.points} max={product.redeemPoints} tone="coral" />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{state.points} / {product.redeemPoints} points</span>
                      <span className="font-medium text-foreground">More points needed</span>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-16 rounded-[30px] border border-border bg-gradient-to-r from-sage-soft via-card to-blossom/30 px-6 py-8 sm:px-10 sm:py-12">
        <h2 className="text-center font-display text-3xl font-bold text-foreground sm:text-4xl">From Can to Creation</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-muted-foreground">
          The cans collected through CanVive don't always end their journey at recycling. Selected materials can be transformed into handcrafted products, giving everyday waste a meaningful second life.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MERCH_IMPACT_STEPS.map((step, idx) => (
            <div key={step.step} className="rounded-2xl bg-card/80 p-4 text-center shadow-sm">
              <div className="mb-3 text-4xl">{step.emoji}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Step {idx + 1}</div>
              <h3 className="mt-2 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={!!confirmProduct} onOpenChange={(open) => !open && setConfirmProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem with Points?</DialogTitle>
            <DialogDescription>
              You are about to redeem <strong>{confirmProduct?.name}</strong> using your CanVive points.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Required Points</span>
                <span className="font-display text-2xl font-bold text-primary">{confirmProduct?.redeemPoints} ⭐</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Your Points</span>
                <span className="text-lg font-bold text-primary">{state.points} ⭐</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-medium text-muted-foreground">After Redemption</span>
                <span className="text-lg font-bold text-primary">
                  {confirmProduct ? state.points - confirmProduct.redeemPoints : state.points} ⭐
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmProduct(null)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => confirmProduct && handleRedeem(confirmProduct)}>
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!checkoutProduct} onOpenChange={(open) => !open && setCheckoutProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Directly</DialogTitle>
            <DialogDescription>
              Complete your purchase for <strong>{checkoutProduct?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex gap-4 rounded-xl bg-muted p-4">
              <img src={checkoutProduct?.image} alt={checkoutProduct?.name} className="h-20 w-20 rounded-lg object-cover" />
              <div>
                <h4 className="font-semibold text-foreground">{checkoutProduct?.name}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{checkoutProduct?.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-md border border-border px-3 py-1 text-lg hover:bg-secondary"
                    onClick={() => setCheckoutQuantity(Math.max(1, checkoutQuantity - 1))}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{checkoutQuantity}</span>
                  <button
                    className="rounded-md border border-border px-3 py-1 text-lg hover:bg-secondary"
                    onClick={() => setCheckoutQuantity(checkoutQuantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total Price</span>
                  <span>₹{(checkoutProduct?.directPrice ?? 0) * checkoutQuantity}</span>
                </div>
              </div>

              <div className="rounded-xl bg-sage-soft p-4 text-sm text-foreground">
                <strong>Delivery Information:</strong> Please provide your delivery details during final checkout.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutProduct(null)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handlePurchaseConfirm}>
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {(redemptionResult || purchaseResult) && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground">My Collection</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {redemptionResult && (
              <div className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 overflow-hidden rounded-xl bg-sage-soft">
                  <img
                    src={MERCH_PRODUCTS.find((p) => p.id === redemptionResult.rewardId.replace("merch-", ""))?.image}
                    alt={redemptionResult.name}
                    className="h-20 w-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-foreground">{redemptionResult.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Redeemed • {formatDate(redemptionResult.date)}</p>
                <p className="mt-2 rounded-full bg-sage-soft px-3 py-1 text-center text-xs font-medium text-primary">
                  Code: {redemptionResult.code}
                </p>
              </div>
            )}
            {purchaseResult && (
              <div className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 overflow-hidden rounded-xl bg-coral-soft">
                  <img src={purchaseResult.product.image} alt={purchaseResult.product.name} className="h-20 w-full object-cover" />
                </div>
                <h3 className="font-semibold text-foreground">{purchaseResult.product.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Purchased • Qty: {purchaseResult.quantity}</p>
                <p className="mt-2 rounded-full bg-coral-soft px-3 py-1 text-center text-xs font-medium text-foreground">
                  ₹{purchaseResult.product.directPrice * purchaseResult.quantity}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
