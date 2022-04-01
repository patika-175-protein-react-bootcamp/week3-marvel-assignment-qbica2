import React, { useState,useEffect } from "react";
import "./App.css";
import axios from "axios";
import Loading from "./Loading";

function App() {
  // eslint-disable-next-line no-undef
  const API_KEY = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
  // eslint-disable-next-line no-undef
  const HASH = process.env.REACT_APP_MARVEL_HASH;
  const [cards,setCards]= useState([]);
  const [pages,setPages] = useState(sessionStorage.getItem("currentPage") || 1);
  const [totalPages,setTotalPages] = useState(10);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }, []);

  useEffect(()=>{
    const getData= async ()=>{
      const fetchedPages= sessionStorage.getItem(`page:${pages}`);
      if(fetchedPages){
        setCards(JSON.parse(fetchedPages));
        setTotalPages(sessionStorage.getItem("totalPages"));
      }else{
        setLoading(true);
        const res= await axios(`https://gateway.marvel.com/v1/public/characters?apikey=${API_KEY}&hash=${HASH}&ts=1&offset=${(pages-1)*20}`);
        setCards(res.data.data.results);
        setTotalPages(res.data.data.total/20);
        sessionStorage.setItem(`page:${pages}`, JSON.stringify(res.data.data.results));
        sessionStorage.setItem("totalPages", res.data.data.total/20);
      }
      setLoading(false);
    };
    getData();
    sessionStorage.setItem("currentPage", pages);
    window.scrollTo(0, 500);
  },[pages]);

  const handlePageChange = (e)=>{
    setPages(e.target.value);
  };

  const handlePrevPageChange = ()=>{
    setPages(Number(pages)-1);
  };

  const handleNextPageChange = ()=>{
    setPages(Number(pages)+1);
  };

  return (
    <div className="App">

      <div className="header">
        <div className="logo">
          <img src="./image2.png" alt="logo" /> 
        </div>
      </div>

      <div className="cards">
        {
          loading ? <Loading /> :
            cards.map(card=>(
              <div className="card" key={card.id}>
                <img  src={`${card.thumbnail.path}/portrait_incredible.${card.thumbnail.extension}`} alt={card.name} />
                <div className="title">{card.name}</div>
              </div>
            ))
        }
      </div>
      
      <div className="footer">
        {
          pages<=4 && (
            <div className="pagination">
              {
                pages!=1 && (<button onClick={()=>handlePrevPageChange()}>Prev</button>)
              }
              <button
                className={pages==1 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={1}>
                  1
              </button>
              <button
                className={pages==2 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={2}>
                  2
              </button>
              <button 
                className={pages==3 && "active"}
                onClick={(e)=>handlePageChange(e)} value={3}>
                  3
              </button>
              <button 
                className={pages==4 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={4}>
                  4
              </button>
              <button 
                className={pages==5 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={5}>
                  5
              </button>
              <button>...</button>
              <button onClick={(e)=>handlePageChange(e)} value={totalPages}>{totalPages}</button>
              <button onClick={()=>handleNextPageChange()}>Next</button>
            </div>
          )
        }
        {
          pages>4 && pages<=totalPages-4 && (
            <div className="pagination">
              <button onClick={()=>handlePrevPageChange()}>Prev</button>
              <button onClick={(e)=>handlePageChange(e)} value={1}>1</button>
              <button>...</button>
              <button 
                onClick={(e)=>handlePageChange(e)} value={Number(pages)-1}>
                {Number(pages)-1}
              </button>
              <button 
                className="active" 
                onClick={(e)=>handlePageChange(e)} value={Number(pages)}>
                {Number(pages)}
              </button>
              <button 
                onClick={(e)=>handlePageChange(e)} value={Number(pages)+1}>
                {Number(pages)+1}
              </button>
              <button>...</button>
              <button onClick={(e)=>handlePageChange(e)} value={totalPages}>{totalPages}</button>
              <button onClick={()=>handleNextPageChange()}>Next</button>
            </div>
          )
        }
        {
          pages>totalPages-4 && (
            <div className="pagination">
              <button onClick={()=>handlePrevPageChange()}>Prev</button>
              <button onClick={(e)=>handlePageChange(e)} value={1}>1</button>
              <button>...</button>
              <button 
                className={pages==Number(totalPages)-4 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={Number(totalPages)-4}>
                {Number(totalPages)-4}
              </button>
              <button 
                className={pages==Number(totalPages)-3 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={Number(totalPages)-3}>
                {Number(totalPages)-3}
              </button>
              <button 
                className={pages==Number(totalPages)-2 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={Number(totalPages)-2}>
                {Number(totalPages)-2}
              </button>
              <button 
                className={pages==Number(totalPages)-1 && "active"} 
                onClick={(e)=>handlePageChange(e)} value={Number(totalPages)-1}>
                {Number(totalPages)-1}
              </button>
              <button 
                className={pages==totalPages && "active"} 
                onClick={(e)=>handlePageChange(e)} value={totalPages}>
                {totalPages}
              </button>
              {
                pages!=totalPages && (<button onClick={()=>handleNextPageChange()}>Next</button>)
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
