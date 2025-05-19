<?php

// database/migrations/2025_05_15_XXXXXX_alter_orders_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'customer_name')) {
                $table->string('customer_name')->after('user_id');
                $table->string('customer_email')->after('customer_name');
                $table->string('customer_address')->after('customer_email');
                $table->string('customer_city')->after('customer_address');
                $table->string('customer_postal_code')->after('customer_city');
                $table->string('customer_country')->after('customer_postal_code');
            }
            if (!Schema::hasColumn('orders', 'payment_transaction_id')) {
                $table->string('payment_transaction_id')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status')->nullable()->after('payment_transaction_id');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_email',
                'customer_address',
                'customer_city',
                'customer_postal_code',
                'customer_country',
                'payment_transaction_id',
                'payment_status',
            ]);
        });
    }
}