import requests
import pandas as pd


base_url = 'https://elements.com.br/products.json?page={}'

all_products_list = []


for page in range(1, 6):
    
    url = base_url.format(page)
    
    
    response = requests.get(url)
    data = response.json()

    
    if 'products' in data:
        products_data = data['products']

        
        for product in products_data:
            for variant in product['variants']:
                product_info = {
                    'Product ID': product['id'],
                    'Name': product['title'],
                    'Type': product['product_type'],
                    'Vendor': product['vendor'],
                    'Variant ID': variant['id'],
                    'Variant Name': variant['title'],
                    'Price': variant['price'],
                    'Compare at Price': variant['compare_at_price'],
                    'SKU': variant['sku'],
                    'Available': variant['available'],
                    'Image Src': variant['featured_image']['src'] if variant['featured_image'] else None
                }
                all_products_list.append(product_info)
    else:
        print(f'No products found on page {page}')


df = pd.DataFrame(all_products_list)


df.to_excel('products.xlsx', index=False)

print('Planilha criada com sucesso!')
