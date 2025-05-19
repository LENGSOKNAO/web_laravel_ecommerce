<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    public function getOrders(): JsonResponse
    {
        try {
            // Fetch orders with related items
            $orders = Order::with('items.product')->get()->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customerName' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'customer_address' => $order->customer_address,
                    'customer_city' => $order->customer_city,
                    'customer_postal_code' => $order->customer_postal_code,
                    'customer_country' => $order->customer_country,
                    'customerImage' => $order->user && $order->user->profile_image 
                        ? url($order->user->profile_image) 
                        : 'https://picsum.photos/200?random=' . $order->id,
                    'products' => $order->items->map(function ($item) {
                        return [
                            'productId' => $item->product_id,
                            'name' => $item->product ? $item->product->name : 'Unknown Product',
                            'quantity' => $item->quantity,
                        ];
                    })->toArray(),
                    'total' => $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'paymentStatus' => ucfirst($order->payment_status),
                    'orderStatus' => ucfirst($order->status),
                    'orderDate' => $order->created_at->format('F d Y'),
                ];
            });

            \Log::info('Orders fetched successfully', ['count' => $orders->count()]);

            return response()->json($orders, 200);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch orders', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteOrder($id): JsonResponse
    {
        try {
            $order = Order::find($id);
            if (!$order) {
                \Log::warning('Order not found for deletion', ['order_id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found',
                ], 404);
            }

            $order->delete();

            \Log::info('Order deleted successfully', ['order_id' => $id]);

            return response()->json([
                'success' => true,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Failed to delete order', ['order_id' => $id, 'error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete order: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function checkout(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer' => 'required|array',
            'customer.name' => 'required|string|max:255',
            'customer.email' => 'required|email|max:255',
            'customer.address' => 'required|string|max:255',
            'customer.city' => 'required|string|max:255',
            'customer.postalCode' => 'required|string|max:20',
            'customer.country' => 'required|string|max:255',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:product,id',
            'products.*.size' => 'nullable|string',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment' => 'required|array',
            'payment.method' => 'required|string|in:PayPal,Other',
            'payment.transaction_id' => 'nullable|string',
            'payment.status' => 'required|string',
        ]);

        if ($validator->fails()) {
            \Log::error('Checkout validation failed', ['errors' => $validator->errors(), 'request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $data = $request->all();
            $user = Auth::user();

            \Log::info('Creating order', ['user' => $user ? $user->id : 'guest', 'data' => $data]);

            $order = Order::create([
                'user_id' => $user ? $user->id : null,
                'customer_name' => $data['customer']['name'],
                'customer_email' => $data['customer']['email'],
                'customer_address' => $data['customer']['address'],
                'customer_city' => $data['customer']['city'],
                'customer_postal_code' => $data['customer']['postalCode'],
                'customer_country' => $data['customer']['country'],
                'total_amount' => $data['total'],
                'payment_method' => $data['payment']['method'],
                'payment_transaction_id' => $data['payment']['transaction_id'] ?? null,
                'payment_status' => $data['payment']['status'],
                'status' => $data['payment']['status'] === 'COMPLETED' ? 'completed' : 'pending',
            ]);

            foreach ($data['products'] as $product) {
                $productModel = Product::find($product['product_id']);
                if (!$productModel) {
                    throw new \Exception('Product not found: ' . $product['product_id']);
                }
                if ($productModel->qty < $product['quantity']) {
                    throw new \Exception('Insufficient stock for product: ' . $productModel->name);
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product['product_id'],
                    'size' => $product['size'],
                    'quantity' => $product['quantity'],
                    'price' => $product['price'],
                ]);

                $productModel->decrement('qty', $product['quantity']);
            }

            DB::commit();

            \Log::info('Order created successfully', ['order_id' => $order->id]);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order' => $order->load('items'),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Checkout failed', ['error' => $e->getMessage(), 'request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Checkout failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}