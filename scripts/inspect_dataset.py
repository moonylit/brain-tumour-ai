from src.preprocessing.dataset_loader import DatasetLoader
from src.preprocessing.image_visualizer import ImageVisualizer


DATASET_PATH = "data/raw/classification/Masoud/Training"


loader = DatasetLoader(DATASET_PATH)

print("=" * 50)
print("Brain Tumour Dataset Inspection")
print("=" * 50)

print("\nDataset Exists:", loader.exists())

counts = loader.count_images()

print("\nImage Count Per Class")

total_images = 0

for class_name, image_count in counts.items():
    print(f"{class_name}: {image_count}")
    total_images += image_count

print("\nTotal Images:", total_images)


visualizer = ImageVisualizer(DATASET_PATH)
visualizer.show_random_images()