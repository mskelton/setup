import csv
import os
from xml.etree import ElementTree


def do(input_dir, output_file):
    files = os.listdir(input_dir)
    w = csv.writer(open(output_file, 'w'))

    w.writerow(['filename', 'width', 'height', 'class',
               'xmin', 'ymin', 'xmax', 'ymax'])

    for file in files:
        tree = ElementTree.parse(os.path.join(input_dir, file))
        root = tree.getroot()
        filename = root.find('filename').text

        for obj in root.findall('object'):
            box = obj.find('bndbox')

            w.writerow([
                filename,
                root.find('size').find('width').text,
                root.find('size').find('height').text,
                obj.find('name').text,
                box.find('xmin').text,
                box.find('ymin').text,
                box.find('xmax').text,
                box.find('ymax').text
            ])


do('data/labels', 'train_labels.csv')
do('data-val/labels', 'test_labels.csv')
