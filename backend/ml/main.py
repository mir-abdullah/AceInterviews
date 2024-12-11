import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from PIL import Image
import dlib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your React app's origin
    allow_credentials=True,                  # Allow cookies and credentials
    allow_methods=["*"],                     # Allow all HTTP methods
    allow_headers=["*"],                     # Allow all headers
)
# Initialize the face detector and the shape predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(r"C:\Users\MIR\Downloads\Final Farukh Projects\Final Farukh Projects\shape_predictor_68_face_landmarks.dat")

# Eye blink detection functions
def compute(ptA, ptB):
    return np.linalg.norm(np.array(ptA) - np.array(ptB))

def blinked(a, b, c, d, e, f):
    up = compute(b, d) + compute(c, e)
    down = compute(a, f)
    ratio = up / (2.0 * down)
    if ratio > 0.25:
        return 2  # Eyes closed
    elif ratio > 0.21:
        return 1  # Drowsy
    return 0  # Eyes open

# Process the image and return the status
def process_image(image_path):
    # Open the image and convert it to grayscale
    img = Image.open(image_path).convert('RGB')
    img_gray = img.convert('L')
    img_array = np.array(img_gray)

    # Detect faces
    faces = detector(img_array)
    response = []

    for face in faces:
        # Predict facial landmarks
        landmarks = predictor(img_array, face)

        # Extract landmark points
        landmark_points = [(landmarks.part(i).x, landmarks.part(i).y) for i in range(68)]

        # Eye tracking
        left_blink = blinked(landmark_points[36], landmark_points[37],
                             landmark_points[38], landmark_points[41], landmark_points[40], landmark_points[39])
        right_blink = blinked(landmark_points[42], landmark_points[43],
                              landmark_points[44], landmark_points[47], landmark_points[46], landmark_points[45])

        # Determine status
        if left_blink == 0 or right_blink == 0:
            status = "Distracted"
        elif left_blink == 1 or right_blink == 1:
            status = "Drowsy"
        else:
            status = "Attentive"

        # Append status to the response
        # response.append({"face": (face.left(), face.top(), face.right(), face.bottom()), "status": status})
        response.append({"face": (face.left(), face.top(), face.right(), face.bottom()), "status": status})

    return response

@app.post("/analyze_frame")
async def analyze_frame(file: UploadFile = File(...)):
    print("Request received.")
    
    # Read the uploaded image file
    image_data = await file.read()
    np_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    
    # Define the image path where the image will be saved
    image_dir = 'images'
    os.makedirs(image_dir, exist_ok=True)
    image_path = os.path.join(image_dir, 'frame.jpg')
    
    # Save the image to the specified path
    cv2.imwrite(image_path, image)
    print(f"Image saved at {image_path}")
    
    # Process the frame and get results by passing the image path
    result = process_image(image_path)
    print(f"Processing result: {result}")
    
    # Return the result as a JSON response
    return JSONResponse(content=result)
