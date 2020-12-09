import sys
import csv
import json
import argparse
from decimal import getcontext, Decimal
from collections import namedtuple


getcontext().prec = 3

PRODUCT_NAME = 'ТМЦ'
PRODUCT_UNIT = 'Ед.'
PRODUCT_PRICE = 'Усред. себест-ть с НДС (руб.)'

SHOPS = [
    'Артемовский МАГАЗИН',
    'Камышлов, ул. Куйбышева, 2',
    'Основной склад',
    'РК "Ботанический" пав. № 176',
    'РК "Верх-Исетский" пав. № 75-76',
    'Реж, ул. Ленина,8',
    'г.Алапаевск ТЦ ул.Фрунзе,32'
]

CATEGORIES = [
    # 'Искусственный мех',
    # 'Коврики прорезиненные',
    # 'Дорожка ковровая',
    # ''
]

Product = namedtuple(
    'Product',
    'name, unit, price, category, quantities'
)


def get_filename():
    parser = argparse.ArgumentParser()
    parser.add_argument('csvfile')
    args = parser.parse_args()
    return args.csvfile


def open_file(filename):
    try:
        file = open(filename, 'r', encoding='utf-8', newline='')
    except OSError as e:
        print('Error:', e)
        sys.exit()
    else:
        return file


def read_file(file):
    try:
        reader = csv.DictReader(file, delimiter=',')
        return reader
    except UnicodeDecodeError as e:
        print(e)
        close_file(file)
        sys.exit()


def close_file(file):
    file.close()


def get_quantity(row, shop_name):
    quanity = row[shop_name]
    if quanity == ' ':
        return 0
    quanity = quanity.replace(',', '.')
    return int(Decimal(quanity))


def get_quantities_all(row):
    quantities = {}
    for shop_name in SHOPS:
        quantities.update(
            {shop_name: get_quantity(row, shop_name)}
        )
    return quantities


def all_quantities_is_empty(quantities):
    return all(val == 0 for val in quantities.values())


def get_name(row):
    return row[PRODUCT_NAME]


def get_unit(row):
    return row[PRODUCT_UNIT]


def get_price(row):
    price = row[PRODUCT_PRICE]
    if price == ' ':
        return 0
    price = price.replace(',', '.').replace('\xa0', '')
    return Decimal(price)


def get_products(reader):
    currrent_category = None

    for row in reader:
        product_name = get_name(row)
        if product_name in CATEGORIES:
            currrent_category = product_name
            continue

        quantities = get_quantities_all(row)
        if all_quantities_is_empty(quantities):
            continue

        product = Product(
            name=product_name,
            unit=get_unit(row),
            price=get_price(row),
            category=currrent_category,
            quantities=quantities
        )
        yield product._asdict()


def get_categories(reader):
    for row in reader:
        quantities = get_quantities_all(row)
        if all_quantities_is_empty(quantities):
            yield get_name(row)


def save_to_json(filename, items_list):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(
            items_list,
            file,
            indent=2,
            ensure_ascii=False,
            default=str
        )


def main():
    filename = get_filename()
    file = open_file(filename)
    reader = read_file(file)

    # products = []
    # for product in get_products(reader):
    #     products.append(product)

    categories = []
    for category in get_categories(reader):
        categories.append(category)

    # save_to_json('items.json', products)
    save_to_json('categories.json', categories)

    close_file(file)


if __name__ == '__main__':
    main()
