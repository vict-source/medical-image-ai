import numpy as np
import medmnist
from medmnist import INFO


DATA_DIR = "../data"

info = INFO["pneumoniamnist"]
DataClass = getattr(medmnist, info["python_class"])

print("Downloading PneumoniaMNIST...")

train_dataset = DataClass(
    split="train",
    root=DATA_DIR,
    download=True,
)

val_dataset = DataClass(
    split="val",
    root=DATA_DIR,
    download=True,
)

test_dataset = DataClass(
    split="test",
    root=DATA_DIR,
    download=True,
)

print()
print("=" * 50)
print("DATASET READY")
print("=" * 50)

print(f"Training images:   {len(train_dataset)}")
print(f"Validation images: {len(val_dataset)}")
print(f"Test images:       {len(test_dataset)}")

print()
print("Classes:")
print(info["label"])

print()
print("Dataset files:")

for file in sorted(__import__("os").listdir(DATA_DIR)):
    print(" -", file)