import React, { useState, useEffect } from "react";

function App() {

  const [ dogList, setDogList ] = useState([]);
  const [ selectedDogInfo, setSelectedDogInfo ] =useState({}) 
  const [ filterOn, setFilterOn ] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/pups")
    .then(res => res.json())
    .then(data => setDogList(data))
  },[])

  let filteredDogList = dogList;
  if(filterOn){
    filteredDogList = dogList.filter(dog => dog.isGoodDog === true)
  }else{
    filteredDogList = dogList;
  }

  function handleDogClick(e){
    setSelectedDogInfo(dogList.find(dog => dog.name === e.target.id))
  }

  function handleButtonClick(){

    fetch(`http://localhost:3001/pups/${selectedDogInfo.id}`,{
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isGoodDog: !selectedDogInfo.isGoodDog,
          }),
        })
          .then(r => r.json())
          .then(updatedItem => setSelectedDogInfo(updatedItem))
  }

  function filterClickHandle(){
    setFilterOn(!filterOn);
  }


  const dogNamesOnBar = filteredDogList.map( dog => <span onClick={handleDogClick} key={dog.id} id={dog.name} >{dog.name}</span> )
  let buttonText = selectedDogInfo.isGoodDog? "Good Dog": "Bad Dog"
  
  let selecteDogOnPage = ""
  if(selectedDogInfo.name){
    selecteDogOnPage = 
      <>
        <img src={selectedDogInfo.image} alt="Mr. Bonkers" />
        <h2>{selectedDogInfo.name}</h2>
        <button onClick={handleButtonClick} >{buttonText}</button>
      </> 
  }

  return (
    <div className="App">
      <div id="filter-div">
        <button id="good-dog-filter" onClick={filterClickHandle} >{filterOn? "Filter good dogs: ON" : "Filter good dogs: OFF"}</button>
      </div>
      <div id="dog-bar">
        {dogNamesOnBar}
      </div>
      <div id="dog-summary-container">
        <h1>DOGGO:</h1>
        <div id="dog-info">
          {selecteDogOnPage}
        </div>
      </div>
    </div>
  );
}

export default App;
