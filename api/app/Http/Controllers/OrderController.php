<?php
// app/Http/Controllers/OrderController.php
namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('items');

        // Search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhereHas('items', function ($q) use ($search) {
                      $q->where('product_name', 'like', "%{$search}%");
                  });
            });
        }

        // Filters
        if ($paymentStatus = $request->query('paymentStatus')) {
            $query->where('payment_status', $paymentStatus);
        }
        if ($orderStatus = $request->query('orderStatus')) {
            $query->where('status', $orderStatus);
        }

        // Sorting
        $sortKey = $request->query('sortKey', 'id');
        $sortDirection = $request->query('sortDirection', 'asc');
        if (in_array($sortKey, ['id', 'customer_name', 'total_amount', 'created_at', 'payment_status', 'status'])) {
            $query->orderBy($sortKey, $sortDirection);
        }

        // Pagination
        $perPage = $request->query('perPage', 10);
        $orders = $query->paginate($perPage);

        return response()->json([
            'orders' => $orders->items()->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customerName' => $order->customer_name,
                    'customerImage' => $order->user->profile_image ?? 'https://via.placeholder.com/50',
                    'products' => $order->items->map(function ($item) {
                        return [
                            'name' => $item->product_name,
                            'quantity' => $item->quantity,
                        ];
                    }),
                    'total' => $order->total_amount,
                    'orderDate' => $order->created_at->toDateString(),
                    'paymentStatus' => $order->payment_status,
                    'orderStatus' => $order->status,
                ];
            }),
            'totalPages' => $orders->lastPage(),
            'total' => $orders->total(),
        ]);
    }

    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);
        return response()->json([
            'order' => [
                'id' => $order->id,
                'customerName' => $order->customer_name,
                'customerEmail' => $order->customer_email,
                'customerAddress' => $order->customer_address,
                'customerCity' => $order->customer_city,
                'customerPostalCode' => $order->customer_postal_code,
                'customerCountry' => $order->customer_country,
                'products' => $order->items->map(function ($item) {
                    return [
                        'name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'unitPrice' => $item->unit_price,
                        'subtotal' => $item->subtotal,
                    ];
                }),
                'total' => $order->total_amount,
                'orderDate' => $order->created_at->toDateString(),
                'paymentMethod' => $order->payment_method,
                'paymentTransactionId' => $order->payment_transaction_id,
                'paymentStatus' => $order->payment_status,
                'orderStatus' => $order->status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'customer_address' => 'required|string',
            'customer_city' => 'required|string',
            'customer_postal_code' => 'required|string',
            'customer_country' => 'required|string',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'payment_status' => 'required|string|in:Pending,Completed,Failed',
            'status' => 'required|string|in:Pending,Processing,Dispatched,Delivered,Cancelled',
            'items' => 'required|array',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $order = Order::create($validated);
            foreach ($validated['items'] as $item) {
                $order->items()->create($item);
            }
            return $order;
        });

        return response()->json(['message' => 'Order created', 'order' => $order], 201);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
            'customer_name' => 'sometimes|string',
            'customer_email' => 'sometimes|email',
            'customer_address' => 'sometimes|string',
            'customer_city' => 'sometimes|string',
            'customer_postal_code' => 'sometimes|string',
            'customer_country' => 'sometimes|string',
            'total_amount' => 'sometimes|numeric|min:0',
            'payment_method' => 'sometimes|string',
            'payment_status' => 'sometimes|string|in:Pending,Completed,Failed',
            'status' => 'sometimes|string|in:Pending,Processing,Dispatched,Delivered,Cancelled',
            'items' => 'sometimes|array',
            'items.*.product_name' => 'sometimes|string',
            'items.*.quantity' => 'sometimes|integer|min:1',
            'items.*.unit_price' => 'sometimes|numeric|min:0',
            'items.*.subtotal' => 'sometimes|numeric|min:0',
        ]);

        $order = DB::transaction(function () use ($order, $validated) {
            $order->update($validated);
            if (isset($validated['items'])) {
                $order->items()->delete();
                foreach ($validated['items'] as $item) {
                    $order->items()->create($item);
                }
            }
            return $order;
        });

        return response()->json(['message' => 'Order updated', 'order' => $order]);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order deleted']);
    }
}