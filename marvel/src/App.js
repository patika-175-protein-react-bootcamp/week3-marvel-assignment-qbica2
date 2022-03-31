/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState,useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const API_KEY = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
  const HASH = process.env.REACT_APP_MARVEL_HASH;
  const [cards,setCards]= useState([]);
  const [pages,setPages] = useState(1);
  const [totalPages,setTotalPages] = useState(10);

  useEffect(()=>{
    const getData= async ()=>{
      const res= await axios(`https://gateway.marvel.com/v1/public/characters?apikey=${API_KEY}&hash=${HASH}&ts=1&offset=${(pages-1)*20}`);
      setCards(res.data.data.results);
      setTotalPages(res.data.data.total/20);
      
    };
    getData();
  },[pages]);
  const array = [...Array(totalPages).keys()];
  console.log(array.map(x=>x+1));
  return (
    <div className="App">
      <div className="header">
        <div className="logo">
          <img src="./image2.png" alt="logo" /> 
        </div>
      </div>
      <div className="cards">
        {
          cards.map(card=>(
            <div className="card" key={card.id}>
              <img  src={`${card.thumbnail.path}/portrait_incredible.${card.thumbnail.extension}`} alt={card.name} />
              <div className="title">{card.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
