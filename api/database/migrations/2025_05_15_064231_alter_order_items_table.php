<?php
// database/migrations/2025_05_15_XXXXXX_alter_order_items_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrderItemsTable extends Migration
{
    public function up()
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'size')) {
                $table->string('size')->nullable()->after('product_id');
            }
            $table->decimal('price', 8, 2)->change();
            if (!Schema::hasColumn('order_items', 'order_id')) {
                $table->foreignId('order_id')->constrained()->onDelete('cascade')->after('id');
            }
            if (!Schema::hasColumn('order_items', 'product_id')) {
                $table->foreignId('product_id')->constrained('product')->onDelete('cascade')->after('order_id');
            }
        });
    }

    public function down()
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('size');
        });
    }
}