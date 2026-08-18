import numpy as np
import torch

from torch.utils.data import Dataset
from torchvision import transforms


class PneumoniaMNISTDataset(Dataset):
    """
    Dataset loader for PneumoniaMNIST.

    Classes:
        0 = Normal
        1 = Pneumonia
    """

    CLASS_NAMES = [
        "Normal",
        "Pneumonia",
    ]

    def __init__(self, npz_file, split="train", transform=None):
        self.transform = transform

        data = np.load(npz_file)

        if split == "train":
            self.images = data["train_images"]
            self.labels = data["train_labels"]

        elif split == "val":
            self.images = data["val_images"]
            self.labels = data["val_labels"]

        elif split == "test":
            self.images = data["test_images"]
            self.labels = data["test_labels"]

        else:
            raise ValueError(
                "split must be 'train', 'val', or 'test'"
            )

        self.labels = self.labels.squeeze()

        print(
            f"{split}: {len(self.images)} images loaded"
        )

    def __len__(self):
        return len(self.images)

    def __getitem__(self, index):
        image = self.images[index]
        label = int(self.labels[index])

        image = image.astype(np.uint8)

        if self.transform:
            image = self.transform(image)
        else:
            image = torch.tensor(
                image,
                dtype=torch.float32
            )

            if image.ndim == 2:
                image = image.unsqueeze(0)

            image = image / 255.0

        return image, label


def get_train_transform():

    return transforms.Compose(
        [
            transforms.ToPILImage(),

            transforms.Resize(
                (224, 224)
            ),

            transforms.RandomHorizontalFlip(
                p=0.5
            ),

            transforms.RandomRotation(
                degrees=7
            ),

            transforms.ToTensor(),

            transforms.Normalize(
                mean=[0.5],
                std=[0.5]
            ),

            transforms.Lambda(
                lambda x: x.repeat(3, 1, 1)
            ),
        ]
    )


def get_eval_transform():

    return transforms.Compose(
        [
            transforms.ToPILImage(),

            transforms.Resize(
                (224, 224)
            ),

            transforms.ToTensor(),

            transforms.Normalize(
                mean=[0.5],
                std=[0.5]
            ),

            transforms.Lambda(
                lambda x: x.repeat(3, 1, 1)
            ),
        ]
    )