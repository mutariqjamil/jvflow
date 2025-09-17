import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  DollarSign,
  Calendar,
  Package,
  User,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";

interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_name: string;
  vendor_contact: string;
  project: string;
  status:
    | "draft"
    | "sent"
    | "confirmed"
    | "partially-delivered"
    | "delivered"
    | "invoiced"
    | "completed"
    | "cancelled";
  total_amount: number;
  currency: string;
  order_date: string;
  expected_delivery: string;
  actual_delivery?: string;
  payment_terms: string;
  notes?: string;
  items: PurchaseOrderItem[];
  delivery_address: string;
  created_by: string;
  approved_by?: string;
}

interface PurchaseOrderItem {
  id: string;
  material_name: string;
  specification: string;
  quantity_ordered: number;
  quantity_delivered: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

interface VendorInvoice {
  id: string;
  po_id: string;
  invoice_number: string;
  vendor_name: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  status:
    | "received"
    | "under-review"
    | "approved"
    | "rejected"
    | "paid";
  uploaded_by: string;
  upload_date: string;
  file_url?: string;
  notes?: string;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    po_number: "PO-2024-001",
    vendor_name: "Superior Steel Works",
    vendor_contact: "john@superiorsteel.com",
    project: "Metro Heights Tower A",
    status: "delivered",
    total_amount: 122500,
    currency: "USD",
    order_date: "2024-12-21",
    expected_delivery: "2024-12-28",
    actual_delivery: "2024-12-27",
    payment_terms: "Net 30",
    delivery_address: "123 Construction Site, Metro City",
    created_by: "John Smith",
    approved_by: "Project Manager",
    items: [
      {
        id: "1",
        material_name: "Steel Rebar Grade 60",
        specification: "12mm diameter, 12m length",
        quantity_ordered: 50,
        quantity_delivered: 50,
        unit: "tons",
        unit_price: 850,
        total_price: 42500,
      },
      {
        id: "2",
        material_name: "Structural Steel Beams",
        specification: "H-beam 300x150x6.5x9",
        quantity_ordered: 25,
        quantity_delivered: 25,
        unit: "pieces",
        unit_price: 1800,
        total_price: 45000,
      },
    ],
  },
  {
    id: "2",
    po_number: "PO-2024-002",
    vendor_name: "Elite Electrical Services",
    vendor_contact: "mike@eliteelectrical.com",
    project: "Metro Heights Tower A",
    status: "partially-delivered",
    total_amount: 35000,
    currency: "USD",
    order_date: "2024-12-22",
    expected_delivery: "2025-01-05",
    payment_terms: "Net 30",
    delivery_address: "123 Construction Site, Metro City",
    created_by: "Sarah Johnson",
    items: [
      {
        id: "3",
        material_name: "Copper Wire 12 AWG",
        specification: "THWN insulated, 600V rated",
        quantity_ordered: 2000,
        quantity_delivered: 1500,
        unit: "meters",
        unit_price: 2.85,
        total_price: 5700,
      },
      {
        id: "4",
        material_name: "Electrical Panels",
        specification: "200A main breaker panel",
        quantity_ordered: 8,
        quantity_delivered: 0,
        unit: "pieces",
        unit_price: 450,
        total_price: 3600,
      },
    ],
  },
  {
    id: "3",
    po_number: "PO-2024-003",
    vendor_name: "Prime Concrete Solutions",
    vendor_contact: "sarah@primeconcrete.com",
    project: "Garden View Residences",
    status: "confirmed",
    total_amount: 18500,
    currency: "USD",
    order_date: "2024-12-23",
    expected_delivery: "2025-01-02",
    payment_terms: "Net 15",
    delivery_address: "456 Development Ave, Metro City",
    created_by: "Mike Chen",
    items: [
      {
        id: "5",
        material_name: "Portland Cement Type I",
        specification: "Type I Portland cement, 50kg bags",
        quantity_ordered: 500,
        quantity_delivered: 0,
        unit: "bags",
        unit_price: 12.5,
        total_price: 6250,
      },
    ],
  },
];

const mockVendorInvoices: VendorInvoice[] = [
  {
    id: "1",
    po_id: "1",
    invoice_number: "INV-SSW-2024-001",
    vendor_name: "Superior Steel Works",
    invoice_date: "2024-12-28",
    due_date: "2025-01-27",
    amount: 122500,
    status: "approved",
    uploaded_by: "Accounts Team",
    upload_date: "2024-12-29",
    file_url: "/invoices/inv-ssw-2024-001.pdf",
  },
  {
    id: "2",
    po_id: "2",
    invoice_number: "INV-EES-2024-001",
    vendor_name: "Elite Electrical Services",
    invoice_date: "2024-12-30",
    due_date: "2025-01-29",
    amount: 9125,
    status: "under-review",
    uploaded_by: "Accounts Team",
    upload_date: "2024-12-30",
    notes: "Partial delivery invoice - wire only",
  },
];

export function PurchaseOrderDashboard() {
  const [purchaseOrders, setPurchaseOrders] = useState<
    PurchaseOrder[]
  >(mockPurchaseOrders);
  const [vendorInvoices, setVendorInvoices] = useState<
    VendorInvoice[]
  >(mockVendorInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPO, setSelectedPO] =
    useState<PurchaseOrder | null>(null);
  const [selectedInvoice, setSelectedInvoice] =
    useState<VendorInvoice | null>(null);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [isUploadInvoiceOpen, setIsUploadInvoiceOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("purchase-orders");

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.po_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      po.vendor_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      po.project
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "sent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "partially-delivered":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "invoiced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "under-review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDeliveryProgress = (po: PurchaseOrder) => {
    const totalOrdered = po.items.reduce(
      (sum, item) => sum + item.quantity_ordered,
      0,
    );
    const totalDelivered = po.items.reduce(
      (sum, item) => sum + item.quantity_delivered,
      0,
    );
    return totalOrdered > 0
      ? (totalDelivered / totalOrdered) * 100
      : 0;
  };

  const PurchaseOrderForm = ({
    po,
    onSave,
    onClose,
  }: {
    po?: PurchaseOrder;
    onSave: (po: PurchaseOrder) => void;
    onClose: () => void;
  }) => {
    const [formData, setFormData] = useState({
      vendor_name: po?.vendor_name || "",
      vendor_contact: po?.vendor_contact || "",
      project: po?.project || "",
      expected_delivery: po?.expected_delivery || "",
      payment_terms: po?.payment_terms || "Net 30",
      delivery_address: po?.delivery_address || "",
      notes: po?.notes || "",
    });

    const [items, setItems] = useState<PurchaseOrderItem[]>(
      po?.items || [],
    );

    const addItem = () => {
      const newItem: PurchaseOrderItem = {
        id: Date.now().toString(),
        material_name: "",
        specification: "",
        quantity_ordered: 0,
        quantity_delivered: 0,
        unit: "",
        unit_price: 0,
        total_price: 0,
      };
      setItems([...items, newItem]);
    };

    const updateItem = (
      index: number,
      field: keyof PurchaseOrderItem,
      value: any,
    ) => {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Calculate total price for the item
      if (
        field === "quantity_ordered" ||
        field === "unit_price"
      ) {
        updatedItems[index].total_price =
          updatedItems[index].quantity_ordered *
          updatedItems[index].unit_price;
      }

      setItems(updatedItems);
    };

    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce(
      (sum, item) => sum + item.total_price,
      0,
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newPO: PurchaseOrder = {
        id: po?.id || Date.now().toString(),
        po_number:
          po?.po_number ||
          `PO-${new Date().getFullYear()}-${(purchaseOrders.length + 1).toString().padStart(3, "0")}`,
        ...formData,
        status: po?.status || "draft",
        total_amount: totalAmount,
        currency: "USD",
        order_date:
          po?.order_date ||
          new Date().toISOString().split("T")[0],
        created_by: po?.created_by || "Current User",
        items: items,
      };
      onSave(newPO);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_name">Vendor Name</Label>
            <Input
              id="vendor_name"
              value={formData.vendor_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vendor_name: e.target.value,
                })
              }
              placeholder="Vendor company name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vendor_contact">
              Vendor Contact
            </Label>
            <Input
              id="vendor_contact"
              value={formData.vendor_contact}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vendor_contact: e.target.value,
                })
              }
              placeholder="contact@vendor.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.project}
              onValueChange={(value) =>
                setFormData({ ...formData, project: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Metro Heights Tower A">
                  Metro Heights Tower A
                </SelectItem>
                <SelectItem value="Garden View Residences">
                  Garden View Residences
                </SelectItem>
                <SelectItem value="Corporate Plaza">
                  Corporate Plaza
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected_delivery">
              Expected Delivery
            </Label>
            <Input
              id="expected_delivery"
              type="date"
              value={formData.expected_delivery}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expected_delivery: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Select
              value={formData.payment_terms}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  payment_terms: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
                <SelectItem value="COD">
                  Cash on Delivery
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_address">
            Delivery Address
          </Label>
          <Textarea
            id="delivery_address"
            value={formData.delivery_address}
            onChange={(e) =>
              setFormData({
                ...formData,
                delivery_address: e.target.value,
              })
            }
            placeholder="Complete delivery address"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">
              Purchase Order Items
            </h4>
            <Button type="button" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <h5 className="font-medium">
                  Item {index + 1}
                </h5>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Material Name</Label>
                  <Input
                    value={item.material_name}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "material_name",
                        e.target.value,
                      )
                    }
                    placeholder="Material name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specification</Label>
                  <Input
                    value={item.specification}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "specification",
                        e.target.value,
                      )
                    }
                    placeholder="Technical specifications"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity_ordered}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity_ordered",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select
                    value={item.unit}
                    onValueChange={(value) =>
                      updateItem(index, "unit", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pieces">
                        Pieces
                      </SelectItem>
                      <SelectItem value="meters">
                        Meters
                      </SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="rolls">
                        Rolls
                      </SelectItem>
                      <SelectItem value="gallons">
                        Gallons
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "unit_price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input
                    value={`$${item.total_price.toFixed(2)}`}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
            placeholder="Additional notes or special instructions"
          />
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold">
            Total Amount: ${totalAmount.toLocaleString()}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            {po ? "Update PO" : "Create PO"}
          </Button>
        </div>
      </form>
    );
  };

  const InvoiceUploadForm = ({
    onSave,
    onClose,
  }: {
    onSave: (invoice: VendorInvoice) => void;
    onClose: () => void;
  }) => {
    const [formData, setFormData] = useState({
      po_id: "",
      invoice_number: "",
      vendor_name: "",
      invoice_date: "",
      due_date: "",
      amount: 0,
      notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newInvoice: VendorInvoice = {
        id: Date.now().toString(),
        ...formData,
        status: "received",
        uploaded_by: "Current User",
        upload_date: new Date().toISOString().split("T")[0],
      };
      onSave(newInvoice);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="po_id">Purchase Order</Label>
            <Select
              value={formData.po_id}
              onValueChange={(value) =>
                setFormData({ ...formData, po_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select PO" />
              </SelectTrigger>
              <SelectContent>
                {purchaseOrders.map((po) => (
                  <SelectItem key={po.id} value={po.id}>
                    {po.po_number} - {po.vendor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice_number">
              Invoice Number
            </Label>
            <Input
              id="invoice_number"
              value={formData.invoice_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  invoice_number: e.target.value,
                })
              }
              placeholder="Vendor invoice number"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_name">Vendor Name</Label>
            <Input
              id="vendor_name"
              value={formData.vendor_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vendor_name: e.target.value,
                })
              }
              placeholder="Vendor name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Invoice Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoice_date">Invoice Date</Label>
            <Input
              id="invoice_date"
              type="date"
              value={formData.invoice_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  invoice_date: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  due_date: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice_file">
            Upload Invoice File
          </Label>
          <Input
            id="invoice_file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
            placeholder="Additional notes about the invoice"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">Upload Invoice</Button>
        </div>
      </form>
    );
  };

  const deliveredPOs = purchaseOrders.filter(
    (po) =>
      po.status === "delivered" || po.status === "completed",
  );
  const pendingInvoices = vendorInvoices.filter(
    (inv) => inv.status === "under-review",
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Purchase Orders
          </h1>
          <p className="text-muted-foreground">
            Manage purchase orders, deliveries, and vendor
            invoices
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog
            open={isUploadInvoiceOpen}
            onOpenChange={setIsUploadInvoiceOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Vendor Invoice</DialogTitle>
                <DialogDescription>
                  Upload and process vendor invoices for
                  purchase orders
                </DialogDescription>
              </DialogHeader>
              <InvoiceUploadForm
                onSave={(invoice) => {
                  setVendorInvoices([
                    ...vendorInvoices,
                    invoice,
                  ]);
                }}
                onClose={() => setIsUploadInvoiceOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={isCreatePOOpen}
            onOpenChange={setIsCreatePOOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create PO
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
                <DialogDescription>
                  Create a new purchase order for approved
                  procurement requests
                </DialogDescription>
              </DialogHeader>
              <PurchaseOrderForm
                onSave={(po) => {
                  setPurchaseOrders([...purchaseOrders, po]);
                }}
                onClose={() => setIsCreatePOOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {pendingInvoices.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">
              {pendingInvoices.length} invoices
            </span>{" "}
            are pending review and approval.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="purchase-orders">
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="deliveries">
            Deliveries
          </TabsTrigger>
          <TabsTrigger value="invoices">
            Vendor Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="purchase-orders"
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                Track and manage all purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search purchase orders..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Status
                    </SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="confirmed">
                      Confirmed
                    </SelectItem>
                    <SelectItem value="partially-delivered">
                      Partially Delivered
                    </SelectItem>
                    <SelectItem value="delivered">
                      Delivered
                    </SelectItem>
                    <SelectItem value="completed">
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPOs.map((po) => {
                    const progress = getDeliveryProgress(po);
                    return (
                      <TableRow key={po.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {po.po_number}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                po.order_date,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">
                              {po.vendor_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {po.vendor_contact}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {po.project}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(
                              po.status,
                            )}
                            variant="outline"
                          >
                            {po.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ${po.total_amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(
                              po.expected_delivery,
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-20">
                            <Progress
                              value={progress}
                              className="h-2"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {progress.toFixed(0)}%
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setSelectedPO(po)
                                }
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download PO
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Truck className="mr-2 h-4 w-4" />
                                Update Delivery
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Complete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Awaiting Delivery
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    purchaseOrders.filter(
                      (po) => po.status === "confirmed",
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Orders pending delivery
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Partial Deliveries
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    purchaseOrders.filter(
                      (po) =>
                        po.status === "partially-delivered",
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Incomplete deliveries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Delivered
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deliveredPOs.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed deliveries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  On Time Delivery
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Tracking</CardTitle>
              <CardDescription>
                Monitor delivery status and progress for all
                purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders
                  .filter(
                    (po) =>
                      po.status !== "draft" &&
                      po.status !== "completed",
                  )
                  .map((po) => {
                    const progress = getDeliveryProgress(po);
                    return (
                      <div
                        key={po.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium">
                              {po.po_number} - {po.vendor_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {po.project}
                            </div>
                          </div>
                          <Badge
                            className={getStatusColor(
                              po.status,
                            )}
                            variant="outline"
                          >
                            {po.status.replace("-", " ")}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Delivery Progress</span>
                            <span>
                              {progress.toFixed(0)}% Complete
                            </span>
                          </div>
                          <Progress
                            value={progress}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              Expected:{" "}
                              {new Date(
                                po.expected_delivery,
                              ).toLocaleDateString()}
                            </span>
                            {po.actual_delivery && (
                              <span>
                                Delivered:{" "}
                                {new Date(
                                  po.actual_delivery,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Invoices</CardTitle>
              <CardDescription>
                Process and manage vendor invoices against
                purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorInvoices.map((invoice) => {
                    const po = purchaseOrders.find(
                      (p) => p.id === invoice.po_id,
                    );
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {invoice.invoice_number}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                invoice.invoice_date,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {invoice.vendor_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {po?.po_number || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            ${invoice.amount.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getInvoiceStatusColor(
                              invoice.status,
                            )}
                            variant="outline"
                          >
                            {invoice.status.replace("-", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(
                              invoice.due_date,
                            ).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* PO Details Dialog */}
      <Dialog
        open={!!selectedPO}
        onOpenChange={() => setSelectedPO(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>
              Complete information about the purchase order
            </DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedPO.po_number}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPO.vendor_name}
                  </p>
                </div>
                <Badge
                  className={getStatusColor(selectedPO.status)}
                  variant="outline"
                >
                  {selectedPO.status
                    .replace("-", " ")
                    .toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">
                    Order Information
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Project:
                      </dt>
                      <dd>{selectedPO.project}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Order Date:
                      </dt>
                      <dd>
                        {new Date(
                          selectedPO.order_date,
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Expected Delivery:
                      </dt>
                      <dd>
                        {new Date(
                          selectedPO.expected_delivery,
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Payment Terms:
                      </dt>
                      <dd>{selectedPO.payment_terms}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="font-medium mb-3">
                    Delivery Information
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Total Amount:
                      </dt>
                      <dd>
                        $
                        {selectedPO.total_amount.toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Delivery Progress:
                      </dt>
                      <dd>
                        {getDeliveryProgress(
                          selectedPO,
                        ).toFixed(0)}
                        %
                      </dd>
                    </div>
                    {selectedPO.actual_delivery && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          Actual Delivery:
                        </dt>
                        <dd>
                          {new Date(
                            selectedPO.actual_delivery,
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-3">
                    <div className="text-sm text-muted-foreground mb-1">
                      Delivery Address:
                    </div>
                    <div className="text-sm">
                      {selectedPO.delivery_address}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">
                  Order Items
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Specification</TableHead>
                      <TableHead>Ordered</TableHead>
                      <TableHead>Delivered</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-sm">
                          {item.material_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.specification}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.quantity_ordered} {item.unit}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.quantity_delivered} {item.unit}
                        </TableCell>
                        <TableCell className="text-sm">
                          ${item.unit_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">
                          ${item.total_price.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedPO.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPO.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}