from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import dlib
from imutils import face_utils
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize the face detector and the shape predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(r"C:\Users\MIR\Downloads\Final Farukh Projects\Final Farukh Projects\shape_predictor_68_face_landmarks.dat")

# Eye blink detection functions
def compute(ptA, ptB):
    return np.linalg.norm(ptA - ptB)

def blinked(a, b, c, d, e, f):
    up = compute(b, d) + compute(c, e)
    down = compute(a, f)
    ratio = up / (2.0 * down)
    if ratio > 0.25:
        return 2  # Eyes closed
    elif ratio > 0.21:
        return 1  # Drowsy
    return 0  # Eyes open

# 3D model for head pose
def ref3DModel():
    return np.array([[0.0, 0.0, 0.0],
                     [0.0, -330.0, -65.0],
                     [-255.0, 170.0, -135.0],
                     [225.0, 170.0, -135.0],
                     [-150.0, -150.0, -125.0],
                     [150.0, -150.0, -125.0]], dtype=np.float64)

def ref2DImagePoints(shape):
    return np.array([[shape.part(30).x, shape.part(30).y],
                     [shape.part(8).x, shape.part(8).y],
                     [shape.part(36).x, shape.part(36).y],
                     [shape.part(45).x, shape.part(45).y],
                     [shape.part(48).x, shape.part(48).y],
                     [shape.part(54).x, shape.part(54).y]], dtype=np.float64)

# Main processing function
def process_frame(image: np.ndarray):
    status = ""
    GAZE = "Face Not Found"
    sleep = 0
    drowsy = 0
    active = 0

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = detector(gray)
    if not faces:
        return {"status": "No face detected", "gaze": GAZE}

    for face in faces:
        landmarks = predictor(gray, face)
        landmarks_np = face_utils.shape_to_np(landmarks)

        # Eye tracking
        left_blink = blinked(landmarks_np[36], landmarks_np[37],
                             landmarks_np[38], landmarks_np[41], landmarks_np[40], landmarks_np[39])
        right_blink = blinked(landmarks_np[42], landmarks_np[43],
                              landmarks_np[44], landmarks_np[47], landmarks_np[46], landmarks_np[45])

        # Update tracking status
        if left_blink == 0 or right_blink == 0:
            sleep += 1
            drowsy = 0
            active = 0
            if sleep > 6:
                status = "Distracted !!!"
        elif left_blink == 1 or right_blink == 1:
            sleep = 0
            active = 0
            drowsy += 1
            if drowsy > 6:
                status = "Drowsy !"
        else:
            drowsy = 0
            sleep = 0
            active += 1
            if active > 6:
                status = "Attentive :)"

        # Logging for debugging
        print(f"Left blink: {left_blink}, Right blink: {right_blink}, Status: {status}")

        # Head pose estimation (remains unchanged)
        face3Dmodel = ref3DModel()
        refImgPts = ref2DImagePoints(landmarks)
        height, width, _ = image.shape
        mtx = np.array([[width, 0, width / 2], [0, width, height / 2], [0, 0, 1]], dtype="double")
        dist = np.zeros((4, 1))
        success, rotationVector, translationVector = cv2.solvePnP(face3Dmodel, refImgPts, mtx, dist)

        noseEndPoints3D = np.array([[0, 0, 1000.0]], dtype=np.float64)
        noseEndPoint2D, _ = cv2.projectPoints(noseEndPoints3D, rotationVector, translationVector, mtx, dist)

        rmat, _ = cv2.Rodrigues(rotationVector)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

        GAZE = "Looking: Forward"
        if angles[1] < -15:
            GAZE = "Looking: Left"
        elif angles[1] > 15:
            GAZE = "Looking: Right"

    return {"status": status, "gaze": GAZE}

@app.post("/analyze_frame")
async def analyze_frame(file: UploadFile = File(...)):
    print("request recieved")
    # Read the uploaded image file
    image_data = await file.read()
    np_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    # Process the frame and get results
    result = process_frame(image)
    print(JSONResponse(content=result))

    return JSONResponse(content=result)

# To run the server:
# uvicorn filename:app --reload
