import { useRef } from 'react';
import * as facemesh from '@tensorflow-models/facemesh';
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';

import './App.css';
import { drawMesh } from './utils';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const videoConstraints = {
    facingMode: 'user',
  };

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution: {
        width: 640,
        height: 480,
      },
      scale: 0.8,
    });
    console.log(net);

    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      try {
        const face = await net.estimateFaces(video);
        console.log(face);

        const ctx = canvasRef.current.getContext('2d');
        drawMesh(face, ctx);
      } catch (error) {
        console.log('err===', error);
      }
    }
  };

  runFacemesh();
  return (
    <header className='App-header'>
      <Webcam
        videoConstraints={videoConstraints}
        ref={webcamRef}
        style={{
          position: 'absolute',
          margin: '0 auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          width: 640,
          height: 480,
          border: '1px solid',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          margin: '0 auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          width: 640,
          height: 480,
        }}
      />
    </header>
  );
}

export default App;
