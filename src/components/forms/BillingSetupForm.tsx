import { useState } from "react";
import { useAuth } from "../AuthProvider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import {
  CreditCard,
  Smartphone,
  Shield,
  Check,
  AlertCircle,
  Clock,
  Building2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  projectId,
  publicAnonKey,
} from "../../utils/supabase/info";

interface BillingSetupFormProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function BillingSetupForm({
  onComplete,
  onCancel,
}: BillingSetupFormProps) {
  const {
    currentOrganization,
    trialDaysRemaining,
    isDemoMode,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);

  const [billingData, setBillingData] = useState({
    payment_method: "google_pay",
    plan_type: "monthly",
    billing_details: {
      company_name: currentOrganization?.name || "",
      contact_email: "",
      phone: "",
      address: "",
      tax_id: "",
    },
  });

  const plans = [
    {
      id: "monthly",
      name: "Monthly Plan",
      price: "$49",
      period: "per month",
      description: "Perfect for small to medium projects",
      popular: false,
      features: [
        "Up to 5 projects",
        "Unlimited users",
        "All core features",
        "Email support",
        "Monthly billing",
      ],
    },
    {
      id: "yearly",
      name: "Annual Plan",
      price: "$499",
      period: "per year",
      description: "Best value for established organizations",
      savings: "Save $89/year",
      popular: true,
      features: [
        "Unlimited projects",
        "Unlimited users",
        "All premium features",
        "Priority support",
        "Annual billing",
        "Advanced analytics",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations with complex needs",
      popular: false,
      features: [
        "Unlimited everything",
        "Dedicated account manager",
        "Custom integrations",
        "On-premise deployment",
        "SLA guarantees",
        "Training & onboarding",
      ],
    },
  ];

  const apiCall = async (
    endpoint: string,
    options: RequestInit = {},
  ) => {
    const token = isDemoMode ? "demo-token" : publicAnonKey;

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-df4644bf${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Request failed");
    }

    return response.json();
  };

  const handleSetupBilling = async () => {
    if (!billingData.billing_details.contact_email) {
      setError("Contact email is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isDemoMode) {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000),
        );
        setSuccess("Demo billing setup completed!");
      } else {
        await apiCall("/billing/setup", {
          method: "POST",
          body: JSON.stringify({
            organization_id: currentOrganization?.id,
            payment_method: billingData.payment_method,
            billing_details: billingData.billing_details,
          }),
        });
        setSuccess("Billing setup completed successfully!");
      }

      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to setup billing",
      );
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Setup Billing
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Configure your billing information to continue using
          JV-Flow after your trial period ends
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of 3</span>
            <span>
              {Math.round(progressPercentage)}% complete
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2"
          />
        </div>
      </div>

      {/* Trial Status */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">
                  Free Trial Active
                </p>
                <p className="text-sm text-yellow-800">
                  Setup billing to avoid service interruption
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              {trialDaysRemaining} days remaining
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Choose Your Plan
              </h2>
              <p className="text-muted-foreground">
                Select the plan that best fits your
                organization's needs
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all relative ${
                    billingData.plan_type === plan.id
                      ? "ring-2 ring-primary border-primary shadow-lg"
                      : "hover:border-primary/50 hover:shadow-md"
                  } ${plan.popular ? "border-primary/30" : ""}`}
                  onClick={() =>
                    setBillingData((prev) => ({
                      ...prev,
                      plan_type: plan.id,
                    }))
                  }
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pt-8">
                    <CardTitle className="text-xl">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <div className="text-4xl font-bold">
                        {plan.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.period}
                      </div>
                      {plan.savings && (
                        <Badge
                          variant="secondary"
                          className="mt-2"
                        >
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-4">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full mt-6 ${
                        billingData.plan_type === plan.id
                          ? "bg-primary text-primary-foreground"
                          : "border-2 border-muted hover:border-primary"
                      }`}
                      variant={
                        billingData.plan_type === plan.id
                          ? "default"
                          : "outline"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        setBillingData((prev) => ({
                          ...prev,
                          plan_type: plan.id,
                        }));
                      }}
                    >
                      {billingData.plan_type === plan.id
                        ? "Selected"
                        : "Select Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} size="lg">
                Continue with{" "}
                {
                  plans.find(
                    (p) => p.id === billingData.plan_type,
                  )?.name
                }
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Payment Method
              </h2>
              <p className="text-muted-foreground">
                Choose how you'd like to pay for your
                subscription
              </p>
            </div>

            <div className="space-y-4">
              <Card
                className={`cursor-pointer transition-all ${
                  billingData.payment_method === "google_pay"
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() =>
                  setBillingData((prev) => ({
                    ...prev,
                    payment_method: "google_pay",
                  }))
                }
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        Google Pay
                      </h3>
                      <p className="text-muted-foreground">
                        Quick and secure mobile payments
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">
                        Recommended
                      </Badge>
                      {billingData.payment_method ===
                        "google_pay" && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="opacity-50 cursor-not-allowed">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-500">
                        Credit/Debit Card
                      </h3>
                      <p className="text-muted-foreground">
                        Coming soon
                      </p>
                    </div>
                    <Badge variant="secondary">
                      Coming Soon
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} size="lg">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Billing Information
              </h2>
              <p className="text-muted-foreground">
                Provide your billing details for invoicing
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Company Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">
                      Company Name
                    </Label>
                    <Input
                      id="company-name"
                      value={
                        billingData.billing_details.company_name
                      }
                      onChange={(e) =>
                        setBillingData((prev) => ({
                          ...prev,
                          billing_details: {
                            ...prev.billing_details,
                            company_name: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      Contact Email *
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={
                        billingData.billing_details
                          .contact_email
                      }
                      onChange={(e) =>
                        setBillingData((prev) => ({
                          ...prev,
                          billing_details: {
                            ...prev.billing_details,
                            contact_email: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={billingData.billing_details.phone}
                    onChange={(e) =>
                      setBillingData((prev) => ({
                        ...prev,
                        billing_details: {
                          ...prev.billing_details,
                          phone: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={billingData.billing_details.address}
                    onChange={(e) =>
                      setBillingData((prev) => ({
                        ...prev,
                        billing_details: {
                          ...prev.billing_details,
                          address: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-id">
                    Tax ID (Optional)
                  </Label>
                  <Input
                    id="tax-id"
                    value={billingData.billing_details.tax_id}
                    onChange={(e) =>
                      setBillingData((prev) => ({
                        ...prev,
                        billing_details: {
                          ...prev.billing_details,
                          tax_id: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSetupBilling}
                disabled={loading || success !== ""}
                size="lg"
              >
                {loading ? (
                  "Setting up..."
                ) : success ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">
                Bank-Level Security
              </p>
              <p className="text-sm text-blue-800">
                Your payment information is protected with
                enterprise-grade encryption
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Option */}
      {onCancel && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-muted-foreground"
          >
            Cancel Setup
          </Button>
        </div>
      )}
    </div>
  );
}