FROM php:8.2-apache

RUN docker-php-ext-install pdo pdo_mysql mysqli
RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/html/frontend-interno

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Alias para la API
RUN echo "Alias /api-stock /var/www/html/api-stock/public" >> /etc/apache2/conf-available/api.conf \
    && echo "<Directory /var/www/html/api-stock/public>" >> /etc/apache2/conf-available/api.conf \
    && echo "Options Indexes FollowSymLinks" >> /etc/apache2/conf-available/api.conf \
    && echo "AllowOverride All" >> /etc/apache2/conf-available/api.conf \
    && echo "Require all granted" >> /etc/apache2/conf-available/api.conf \
    && echo "</Directory>" >> /etc/apache2/conf-available/api.conf \
    && a2enconf api
    
COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html