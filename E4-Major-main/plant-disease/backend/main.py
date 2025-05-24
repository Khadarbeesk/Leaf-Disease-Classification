from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from PIL import Image
import torch
import timm
import json
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load class indices and disease information
with open("class_indices (1).json", "r") as f:
    idx_to_class = json.load(f)

with open("plant_diseases_specific_fertilizer.json", "r") as f:
    disease_info = json.load(f)

# Setup device and model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
num_classes = len(idx_to_class)
model = timm.create_model("efficientnet_b0", pretrained=False, num_classes=num_classes)
model.load_state_dict(torch.load("efficientnet_final (1).pth", map_location=device))
model.to(device)
model.eval()

# Image transformation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Prepare image for prediction
        img_tensor = transform(image).unsqueeze(0).to(device)
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            _, predicted = torch.max(probabilities, 1)
            label_index = predicted.item()
            label_name = idx_to_class[str(label_index)]

        # Get disease information
        disease_data = disease_info.get(label_name, {
            "cause": "Information not available.",
            "solution": "Information not available.",
            "fertilizer": "Information not available."
        })

        # Return the prediction without the confidence
        return JSONResponse(content={
            "label": label_name,
            "cause": disease_data["cause"],
            "solution": disease_data["solution"],
            "fertilizer": disease_data["fertilizer"]
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
