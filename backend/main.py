# # Importing necessary libraries
# import cv2
# import numpy as np
# import dlib
# from imutils import face_utils
# import glob

# # Initialize camera
# cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# # Initialize the face detector and the shape predictor
# detector = dlib.get_frontal_face_detector()
# predictor = dlib.shape_predictor( r"C:\Users\MIR\Downloads\Final Farukh Projects\Final Farukh Projects\shape_predictor_68_face_landmarks.dat")

# # Status marking for current state (eye tracking)
# sleep = 0
# drowsy = 0
# active = 0
# status = ""
# color = (0, 0, 0)

# # Chessboard calibration for face tracking
# criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
# objp = np.zeros((6 * 7, 3), np.float32)
# objp[:, :2] = np.mgrid[0:7, 0:6].T.reshape(-1, 2)
# objpoints = []
# imgpoints = []

# # Load chessboard images for calibration
# images = glob.glob('data/images/*.jpg')
# for image in images:
#     img = cv2.imread(image)
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     ret, corners = cv2.findChessboardCorners(gray, (7, 6), None)
#     if ret:
#         objpoints.append(objp)
#         corners2 = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
#         imgpoints.append(corners2)

# # Eye blink detection functions
# def compute(ptA, ptB):
#     return np.linalg.norm(ptA - ptB)

# def blinked(a, b, c, d, e, f):
#     up = compute(b, d) + compute(c, e)
#     down = compute(a, f)
#     ratio = up / (2.0 * down)
#     if ratio > 0.25:
#         return 2  # Eyes closed
#     elif ratio > 0.21:
#         return 1  # Drowsy
#     return 0  # Eyes open

# # 3D model for head pose
# def ref3DModel():
#     return np.array([[0.0, 0.0, 0.0],
#                      [0.0, -330.0, -65.0],
#                      [-255.0, 170.0, -135.0],
#                      [225.0, 170.0, -135.0],
#                      [-150.0, -150.0, -125.0],
#                      [150.0, -150.0, -125.0]], dtype=np.float64)

# def ref2DImagePoints(shape):
#     return np.array([[shape.part(30).x, shape.part(30).y],
#                      [shape.part(8).x, shape.part(8).y],
#                      [shape.part(36).x, shape.part(36).y],
#                      [shape.part(45).x, shape.part(45).y],
#                      [shape.part(48).x, shape.part(48).y],
#                      [shape.part(54).x, shape.part(54).y]], dtype=np.float64)

# # Drawing face landmarks for head pose estimation
# def drawPolyline(img, shapes, start, end, isClosed=False):
#     points = np.array([[shapes.part(i).x, shapes.part(i).y] for i in range(start, end + 1)], dtype=np.float32)
#     cv2.polylines(img, np.int32([points]), isClosed, (255, 80, 0), thickness=1, lineType=cv2.LINE_8)

# def draw(img, shapes):
#     drawPolyline(img, shapes, 0, 16)
#     drawPolyline(img, shapes, 17, 21)
#     drawPolyline(img, shapes, 22, 26)
#     drawPolyline(img, shapes, 27, 30)
#     drawPolyline(img, shapes, 30, 35, True)
#     drawPolyline(img, shapes, 36, 41, True)
#     drawPolyline(img, shapes, 42, 47, True)
#     drawPolyline(img, shapes, 48, 59, True)
#     drawPolyline(img, shapes, 60, 67, True)

# # Main loop
# while True:
#     GAZE = "Face Not Found"
#     ret, img = cap.read()
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#     # Detect faces
#     faces = detector(gray)
    
#     for face in faces:
#         landmarks = predictor(gray, face)
#         landmarks_np = face_utils.shape_to_np(landmarks)

#         # Eye tracking
#         left_blink = blinked(landmarks_np[36], landmarks_np[37],
#                              landmarks_np[38], landmarks_np[41], landmarks_np[40], landmarks_np[39])
#         right_blink = blinked(landmarks_np[42], landmarks_np[43],
#                               landmarks_np[44], landmarks_np[47], landmarks_np[46], landmarks_np[45])

#         # Update tracking status
#         if left_blink == 0 or right_blink == 0:
#             sleep += 1
#             drowsy = 0
#             active = 0
#             if sleep > 6:
#                 status = "Distracted !!!"
#                 color = (255, 0, 0)
#         elif left_blink == 1 or right_blink == 1:
#             sleep = 0
#             active = 0
#             drowsy += 1
#             if drowsy > 6:
#                 status = "Drowsy !"
#                 color = (0, 0, 255)
#         else:
#             drowsy = 0
#             sleep = 0
#             active += 1
#             if active > 6:
#                 status = "Attentive :)"
#                 color = (0, 255, 0)

#         cv2.putText(img, status, (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)

#         # Head pose estimation
#         face3Dmodel = ref3DModel()
#         refImgPts = ref2DImagePoints(landmarks)
#         height, width, _ = img.shape
#         mtx = np.array([[width, 0, width / 2], [0, width, height / 2], [0, 0, 1]], dtype="double")
#         dist = np.zeros((4, 1))
#         success, rotationVector, translationVector = cv2.solvePnP(face3Dmodel, refImgPts, mtx, dist)

#         noseEndPoints3D = np.array([[0, 0, 1000.0]], dtype=np.float64)
#         noseEndPoint2D, _ = cv2.projectPoints(noseEndPoints3D, rotationVector, translationVector, mtx, dist)

#         rmat, _ = cv2.Rodrigues(rotationVector)
#         angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

#         GAZE = "Looking: Forward"
#         if angles[1] < -15:
#             GAZE = "Looking: Left"
#         elif angles[1] > 15:
#             GAZE = "Looking: Right"

#         draw(img, landmarks)
    
#     cv2.putText(img, GAZE, (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 80), 2)
#     cv2.imshow("Eye and Head Pose Tracking", img)

#     key = cv2.waitKey(1) & 0xFF
#     if key == 27:  # Esc key to exit
#         break

# cap.release()
# cv2.destroyAllWindows()
# from flask import Flask, Response, render_template
# import cv2
# import numpy as np
# import dlib
# from imutils import face_utils

# app = Flask(__name__)  # Corrected __name__

# # Initialize the face detector and the shape predictor
# detector = dlib.get_frontal_face_detector()
# predictor = dlib.shape_predictor( r"C:\Users\MIR\Downloads\Final Farukh Projects\Final Farukh Projects\shape_predictor_68_face_landmarks.dat")

# # Status marking for current state (eye tracking)
# sleep = 0
# drowsy = 0
# active = 0
# status = ""
# color = (0, 0, 0)

# # Eye blink detection functions
# def compute(ptA, ptB):
#     dist = np.linalg.norm(ptA - ptB)
#     return dist

# def blinked(a, b, c, d, e, f):
#     up = compute(b, d) + compute(c, e)
#     down = compute(a, f)
#     ratio = up / (2.0 * down)
#     if ratio > 0.25:
#         return 2
#     elif 0.21 < ratio <= 0.25:
#         return 1
#     else:
#         return 0

# 3D model for head pose
# def ref3DModel():
#     modelPoints = [[0.0, 0.0, 0.0],
#                    [0.0, -330.0, -65.0],
#                    [-255.0, 170.0, -135.0],
#                    [225.0, 170.0, -135.0],
#                    [-150.0, -150.0, -125.0],
#                    [150.0, -150.0, -125.0]]
#     return np.array(modelPoints, dtype=np.float64)

# def ref2DImagePoints(shape):
#     imagePoints = [[shape.part(30).x, shape.part(30).y],
#                    [shape.part(8).x, shape.part(8).y],
#                    [shape.part(36).x, shape.part(36).y],
#                    [shape.part(45).x, shape.part(45).y],
#                    [shape.part(48).x, shape.part(48).y],
#                    [shape.part(54).x, shape.part(54).y]]
#     return np.array(imagePoints, dtype=np.float64)

# # Drawing face landmarks for head pose estimation
# def drawPolyline(img, shapes, start, end, isClosed=False):
#     points = []
#     for i in range(start, end + 1):
#         point = [shapes.part(i).x, shapes.part(i).y]
#         points.append(point)
#     points = np.array(points, dtype=np.float32)
#     cv2.polylines(img, np.int32([points]), isClosed, (255, 80, 0), thickness=1, lineType=cv2.LINE_8)

# def draw(img, shapes):
#     drawPolyline(img, shapes, 0, 16)
#     drawPolyline(img, shapes, 17, 21)
#     drawPolyline(img, shapes, 22, 26)
#     drawPolyline(img, shapes, 27, 30)
#     drawPolyline(img, shapes, 30, 35, True)
#     drawPolyline(img, shapes, 36, 41, True)
#     drawPolyline(img, shapes, 42, 47, True)
#     drawPolyline(img, shapes, 48, 59, True)
#     drawPolyline(img, shapes, 60, 67, True)

# # Main logic for tracking
# def generate_frames():
#     global sleep, drowsy, active, status, color

#     # Initialize camera
#     cap = cv2.VideoCapture(0)

#     while True:
#         GAZE = "Face Not Found"
#         ret, img = cap.read()
#         if not ret:
#             break
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
#         # Detect faces
#         faces = detector(gray)
        
#         for face in faces:
#             x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
#             landmarks = predictor(gray, face)
#             landmarks_np = face_utils.shape_to_np(landmarks)
            
#             # Eye tracking
#             left_blink = blinked(landmarks_np[36], landmarks_np[37],
#                                  landmarks_np[38], landmarks_np[41], landmarks_np[40], landmarks_np[39])
#             right_blink = blinked(landmarks_np[42], landmarks_np[43],
#                                   landmarks_np[44], landmarks_np[47], landmarks_np[46], landmarks_np[45])

#             if left_blink == 0 or right_blink == 0:
#                 sleep += 1
#                 drowsy = 0
#                 active = 0
#                 if sleep > 6:
#                     status = "Distracted !!!"
#                     color = (255, 0, 0)
#             elif left_blink == 1 or right_blink == 1:
#                 sleep = 0
#                 active = 0
#                 drowsy += 1
#                 if drowsy > 6:
#                     status = "Drowsy !"
#                     color = (0, 0, 255)
#             else:
#                 drowsy = 0
#                 sleep = 0
#                 active += 1
#                 if active > 6:
#                     status = "Attentive :)"
#                     color = (0, 255, 0)

#             cv2.putText(img, status, (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)

#             # Head pose estimation
#             face3Dmodel = ref3DModel()
#             refImgPts = ref2DImagePoints(landmarks)
#             height, width, _ = img.shape
#             mtx = np.array([[width, 0, width/2], [0, width, height/2], [0, 0, 1]], dtype="double")
#             dist = np.zeros((4, 1))
#             success, rotationVector, translationVector = cv2.solvePnP(face3Dmodel, refImgPts, mtx, dist)

#             noseEndPoints3D = np.array([[0, 0, 1000.0]], dtype=np.float64)
#             noseEndPoint2D, _ = cv2.projectPoints(noseEndPoints3D, rotationVector, translationVector, mtx, dist)

#             rmat, _ = cv2.Rodrigues(rotationVector)
#             angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

#             if angles[1] < -15:
#                 GAZE = "Looking: Left"
#             elif angles[1] > 15:
#                 GAZE = "Looking: Right"
#             else:
#                 GAZE = "Forward"

#             draw(img, landmarks)
        
#         cv2.putText(img, GAZE, (20, 20), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 80), 2)
        
#         # Encode and yield the frame
#         ret, buffer = cv2.imencode('.jpg', img)
#         img = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n')

# # Flask routes
# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# # Correct the __name__ and __main__ block
# if __name__ == "__main__":
#     app.run(debug=True)

# from flask import Flask, Response, render_template, send_from_directory
# import cv2
# import numpy as np
# import dlib
# from imutils import face_utils
# import os

# app = Flask(__name__)

# # Initialize the face detector and the shape predictor
# detector = dlib.get_frontal_face_detector()
# predictor = dlib.shape_predictor(r"C:\Users\MIR\Downloads\Final Farukh Projects\Final Farukh Projects\shape_predictor_68_face_landmarks.dat")

# # Global status variables
# sleep = 0
# drowsy = 0
# active = 0
# status = ""
# color = (0, 0, 0)

# # Function to detect blink
# def compute(ptA, ptB):
#     dist = np.linalg.norm(ptA - ptB)
#     return dist

# def blinked(a, b, c, d, e, f):
#     up = compute(b, d) + compute(c, e)
#     down = compute(a, f)
#     ratio = up / (2.0 * down)
#     if ratio > 0.25:
#         return 2
#     elif 0.21 < ratio <= 0.25:
#         return 1
#     else:
#         return 0

# # 3D model for head pose
# def ref3DModel():
#     modelPoints = [[0.0, 0.0, 0.0],
#                    [0.0, -330.0, -65.0],
#                    [-255.0, 170.0, -135.0],
#                    [225.0, 170.0, -135.0],
#                    [-150.0, -150.0, -125.0],
#                    [150.0, -150.0, -125.0]]
#     return np.array(modelPoints, dtype=np.float64)

# def ref2DImagePoints(shape):
#     imagePoints = [[shape.part(30).x, shape.part(30).y],
#                    [shape.part(8).x, shape.part(8).y],
#                    [shape.part(36).x, shape.part(36).y],
#                    [shape.part(45).x, shape.part(45).y],
#                    [shape.part(48).x, shape.part(48).y],
#                    [shape.part(54).x, shape.part(54).y]]
#     return np.array(imagePoints, dtype=np.float64)

# def generate_frames():
#     global sleep, drowsy, active, status, color

#     cap = cv2.VideoCapture(0)

#     while True:
#         GAZE = "Face Not Found"
#         ret, img = cap.read()
#         if not ret:
#             break
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#         faces = detector(gray)

#         for face in faces:
#             landmarks = predictor(gray, face)
#             landmarks_np = face_utils.shape_to_np(landmarks)

#             # Blink detection
#             left_blink = blinked(landmarks_np[36], landmarks_np[37], landmarks_np[38], landmarks_np[41], landmarks_np[40], landmarks_np[39])
#             right_blink = blinked(landmarks_np[42], landmarks_np[43], landmarks_np[44], landmarks_np[47], landmarks_np[46], landmarks_np[45])

#             if left_blink == 0 or right_blink == 0:
#                 sleep += 1
#                 drowsy = 0
#                 active = 0
#                 if sleep > 6:
#                     status = "Distracted !!!"
#                     color = (255, 0, 0)
#             elif left_blink == 1 or right_blink == 1:
#                 sleep = 0
#                 drowsy += 1
#                 active = 0
#                 if drowsy > 6:
#                     status = "Drowsy !"
#                     color = (0, 0, 255)
#             else:
#                 active += 1
#                 if active > 6:
#                     status = "Attentive :)"
#                     color = (0, 255, 0)

#             cv2.putText(img, status, (100, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)

#         # Encode frame as JPEG
#         ret, buffer = cv2.imencode('.jpg', img)
#         img = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n')

# @app.route('/')
# def index():
#     return send_from_directory('frontend/build', 'index.html')

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# @app.route('/<path:path>')
# def serve_static(path):
#     return send_from_directory('frontend/build', path)

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, Response, render_template, request, jsonify
import cv2
import numpy as np
import dlib
import os
from imutils import face_utils
import datetime

app = Flask(__name__)

# Initialize the face detector and the shape predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(r"C:\Users\MIR\Downloads\Final Farukh Projects\Final Farukh Projects\shape_predictor_68_face_landmarks.dat")

# Eye blink detection functions
def compute(ptA, ptB):
    dist = np.linalg.norm(ptA - ptB)
    return dist

def blinked(a, b, c, d, e, f):
    up = compute(b, d) + compute(c, e)
    down = compute(a, f)
    ratio = up / (2.0 * down)
    if ratio > 0.25:
        return 2
    elif 0.21 < ratio <= 0.25:
        return 1
    else:
        return 0

def ref3DModel():
    modelPoints = [[0.0, 0.0, 0.0],
                   [0.0, -330.0, -65.0],
                   [-255.0, 170.0, -135.0],
                   [225.0, 170.0, -135.0],
                   [-150.0, -150.0, -125.0],
                   [150.0, -150.0, -125.0]]
    return np.array(modelPoints, dtype=np.float64)

def ref2DImagePoints(shape):
    imagePoints = [[shape.part(30).x, shape.part(30).y],
                   [shape.part(8).x, shape.part(8).y],
                   [shape.part(36).x, shape.part(36).y],
                   [shape.part(45).x, shape.part(45).y],
                   [shape.part(48).x, shape.part(48).y],
                   [shape.part(54).x, shape.part(54).y]]
    return np.array(imagePoints, dtype=np.float64)

def drawPolyline(img, shapes, start, end, isClosed=False):
    points = []
    for i in range(start, end + 1):
        point = [shapes.part(i).x, shapes.part(i).y]
        points.append(point)
    points = np.array(points, dtype=np.float32)
    cv2.polylines(img, np.int32([points]), isClosed, (255, 80, 0), thickness=1, lineType=cv2.LINE_8)

def draw(img, shapes):
    drawPolyline(img, shapes, 0, 16)
    drawPolyline(img, shapes, 17, 21)
    drawPolyline(img, shapes, 22, 26)
    drawPolyline(img, shapes, 27, 30)
    drawPolyline(img, shapes, 30, 35, True)
    drawPolyline(img, shapes, 36, 41, True)
    drawPolyline(img, shapes, 42, 47, True)
    drawPolyline(img, shapes, 48, 59, True)
    drawPolyline(img, shapes, 60, 67, True)

def generate_frames():
    cap = cv2.VideoCapture(0)

    while True:
        ret, img = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = detector(gray)
        
        for face in faces:
            landmarks = predictor(gray, face)
            landmarks_np = face_utils.shape_to_np(landmarks)

            # Eye tracking
            left_blink = blinked(landmarks_np[36], landmarks_np[37],
                                 landmarks_np[38], landmarks_np[41], landmarks_np[40], landmarks_np[39])
            right_blink = blinked(landmarks_np[42], landmarks_np[43],
                                  landmarks_np[44], landmarks_np[47], landmarks_np[46], landmarks_np[45])

            # Logic for drowsiness detection
            # (omitted for brevity, you can keep your logic here)
        
            draw(img, landmarks)
        
        # Encode and yield the frame
        ret, buffer = cv2.imencode('.jpg', img)
        img = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + img + b'\r\n')

@app.route('/')
def index():
    return render_template('Behavioral.jsx')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/submit_recording', methods=['POST'])
def submit_recording():
    # Save the video to the server
    video_data = request.files['video']
    filename = f'interview_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.webm'
    video_path = os.path.join('uploads', filename)
    video_data.save(video_path)
    return jsonify({"message": "Video saved successfully!", "url": video_path})

if __name__ == "__main__":
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
