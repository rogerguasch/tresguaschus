FROM php:8.4-fpm

# Instala dependencias del sistema y extensiones necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    zip \
    curl \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip \
    && docker-php-ext-install pcntl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instala Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Opcional: habilita y configura Opcache para mejor rendimiento en Laravel
RUN docker-php-ext-install opcache \
    && docker-php-ext-enable opcache

# Crea usuario no root para mayor seguridad
RUN useradd -ms /bin/bash tresguaschus
USER tresguaschus

WORKDIR /var/www

EXPOSE 9000

CMD ["php-fpm"]
