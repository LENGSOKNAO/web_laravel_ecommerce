FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy custom PHP config
COPY php.ini /usr/local/etc/php/php.ini

# Set working directory
WORKDIR /var/www

# Copy application files
COPY --chown=www-data:www-data . .

# Create and set permissions for bootstrap/cache and storage
RUN mkdir -p /var/www/bootstrap/cache /var/www/storage \
    && chown -R www-data:www-data /var/www/bootstrap /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache /var/www/storage

# Install Composer dependencies
RUN composer install --optimize-autoloader --no-dev

EXPOSE 9000
CMD ["php-fpm"]