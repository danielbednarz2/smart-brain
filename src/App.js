import React, { useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import Clarifai from 'clarifai';
import './App.css';
 
const app = new Clarifai.App({
 apiKey: 'c69b1964a2ae498f97fba34a8c89646a'
});

function App() {
  const [ input, setInput ] = useState('')
  const [ imageUrl, setImageUrl ] = useState('')
  const [ box, setBox ] = useState({})
  const [ route, setRoute ] = useState('signin')
  const [ isSignedIn, setIsSignedIn ] = useState(false)
  const [ user, setUser ] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  })

  const loadUser = (data) => {
    setUser((prevState) => ({
      ...prevState,
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }))
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box)
  }

  const onInputChange = (e) => {
    setInput(e.target.value)
  }

  const onSubmit = () => {
    setImageUrl(input)
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              setUser(Object.assign(user, {entries: count}))
        })
      }
        displayFaceBox(calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
}

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false)
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route);
  }

  return (
    <div className="App">
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === 'home' 
      ? <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm onInputChange={onInputChange} onSubmit={onSubmit} />
          <FaceRecognition imageUrl={imageUrl} box={box} />
        </div>
      : (
          route === 'signin'
          ? <SignIn onRouteChange={onRouteChange} loadUser={loadUser} /> 
          : <Register onRouteChange={onRouteChange} loadUser={loadUser} />
        )
      }
    </div>
  );
}

export default App;
