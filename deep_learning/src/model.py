import torch
import torch.nn as nn
from torchvision import models


class PneumoniaClassifier(nn.Module):
    """
    Transfer-learning model based on ResNet18.

    Input:
        3 x 224 x 224 chest X-ray image

    Output:
        2 classes
        0 = Normal
        1 = Pneumonia
    """

    def __init__(self, num_classes=2):
        super().__init__()

        # Load ResNet18 architecture
        self.model = models.resnet18(
            weights=models.ResNet18_Weights.DEFAULT
        )

        # Replace the original ImageNet classifier
        num_features = self.model.fc.in_features

        self.model.fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(
                num_features,
                num_classes
            )
        )

    def forward(self, x):
        return self.model(x)


if __name__ == "__main__":

    print("Creating PneumoniaClassifier...")

    model = PneumoniaClassifier()

    print(model)

    # Test with a fake batch
    test_input = torch.randn(
        2,
        3,
        224,
        224
    )

    output = model(test_input)

    print()
    print("Input shape:", test_input.shape)
    print("Output shape:", output.shape)

    print()
    print("Model test successful.")