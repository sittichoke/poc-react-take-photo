import {useRef, useState,useEffect} from 'react';
import './App.css';

const App = (props:any) => {
  const [imageData,setImageData] = useState<any>(null)
  const [cameraNum,setCameraNum] = useState(0)
  const [deviceName,setDeviceName] = useState("")
  const [useFrontCamera,setUseFrontCamera] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null) 
  let video:any 

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo= async()=>{
    let stream = await navigator.mediaDevices.getUserMedia({video:{width:300}})
    video = videoRef.current;
    if (video) {
      video.srcObject = stream ||null
      video.play()
      console.log("video",video)
    }

  }

  const handleOpenCamera = async() => {
    setImageData(null)
    if(!("mediaDevices" in navigator) || !("getUserMedia" in navigator.mediaDevices)){
      console.log("not support")
    }
    let constraints = {
      video: {
        width:{
          max:300
        },
        facingMode: 'user'
      },
    }
    // navigator.mediaDevices.getUserMedia(constraints)
    console.log("navigator",navigator)
    //Get the details of video inputs of the device
    const videoInputs = await getListOfVideoInputs();
    //The device has a camera
    console.log("video input",videoInputs)
    constraints.video.facingMode = useFrontCamera ? "user" : "environment";
    if (videoInputs.length) {
      const updateConstraints = {
          ...constraints,
          deviceId: {
           exact: videoInputs[cameraNum].deviceId
          }
      }
      console.log("constraint",updateConstraints)
      setDeviceName(videoInputs[cameraNum].label)
      let stream = await navigator.mediaDevices.getUserMedia(constraints)
      video = videoRef.current;
      if (video) {
        video.srcObject = stream ||null
        video.play()
        console.log("video",video)
      }
    } else {
      alert("The device does not have a camera");
    }
  }
  const handleSwitchCamera = async() => {
    const listOfVideoInputs = await getListOfVideoInputs();

    // The device has more than one camera
    if (listOfVideoInputs.length > 1) {
      setUseFrontCamera(!useFrontCamera)
      // switch to second camera
      if (cameraNum === 0) {
        setCameraNum(1);
      }
      // switch to first camera
      else if (cameraNum === 1) {
        setCameraNum(0);
      }
      handleOpenCamera()
    }else{
      alert("You has only one camera!")
    }
  }
  const handleCaptureImage = () => {
    let canvas = document.createElement("canvas");
    console.log("capture video", video)
    video = videoRef.current;
    if (video){
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      let contex = canvas.getContext("2d");
      contex?.drawImage(video, 0, 0, canvas.width, canvas.height);
      //video?.srcObject?.getVideoTracks().forEach((track) => {
      //  track.stop();
      //});

      console.log(canvas.toDataURL());
      setImageData(canvas.toDataURL());
    }
  }
  const getListOfVideoInputs = async () => {
    // Get the details of audio and video output of the device
    const enumerateDevices = await navigator.mediaDevices.enumerateDevices();

    //Filter video outputs (for devices with multiple cameras)
    return enumerateDevices.filter((device) => device.kind === "videoinput");
  };
  
  //const PreviewScreen = imageData===""?(
  //):''

  return (
    <div className="App">
      <video autoPlay ref={videoRef} />
      <p>{deviceName}</p>
      <hr></hr>
      <button onClick={handleOpenCamera}>Open Camera</button>
      <button onClick={handleSwitchCamera}>Switch Camera</button>
      <button onClick={handleCaptureImage}>Capture</button>
      <hr></hr>
      <img src={imageData} alt="imageCaptured" />
      {/* {PreviewScreen} */}
    </div>
  );
}

export default App;
