import React, { useState , useEffect } from "react";
import "./App.css";
import axios from "axios";
import Loading from "./Loading";

function App() {
  // eslint-disable-next-line no-undef
  const API_KEY = process.env.REACT_APP_MARVEL_PUBLIC_KEY;
  // eslint-disable-next-line no-undef
  const HASH = process.env.REACT_APP_MARVEL_HASH;
  // State tanımlarımız( sayfa yenilendiğinde session storageda istediğimiz veriler varsa onları alıyoruz )
  const [cards,setCards]= useState([]);
  const [pages,setPages] = useState(sessionStorage.getItem("currentPage") || 1);
  const [totalPages,setTotalPages] = useState(sessionStorage.getItem("totalPages") || 10);
  const [loading,setLoading] = useState(false);

  // Sayfa her değiştiğinde o sayfanın verilerini daha önce session storage a kayıt edip etmediğimizi kontrol ediyoruz. Eğer kayıt edilmişse verileri storagetan alıyoruz. Yoksa apidan çekip storage a kayıt ediyoruz.
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

  // Sayfalar arasında gezmemizi sağlayan fonksiyonlar
  const handlePageChange = (e)=>{
    setPages(e.target.value);
  };

  const handlePrevPage = ()=>{
    setPages(Number(pages)-1);
  };

  const handleNextPage = ()=>{
    setPages(Number(pages)+1);
  };
  // Card names de kullanacağımız standart sağlaması için yazdığım fonksiyon
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
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
                <div className="title">{truncate(card.name,25)}</div>
              </div>
            ))
        }
      </div>
      
      <div className="footer">
        {
          pages<=4 && (
            <div className="pagination">
              {
                pages!=1 && (<button onClick={()=>handlePrevPage()}><i className="fa-solid fa-xl fa-angle-left"></i></button>)
              }
              {
                [...Array(5).keys()].map(x=>{
                  return (
                    <button 
                      key={x} className={pages==x+1 ? "active" : ""}
                      onClick={(e)=>handlePageChange(e)} value={x+1}>
                      {x+1}
                    </button>
                  );
                })
              }
              <button>...</button>
              <button onClick={(e)=>handlePageChange(e)} value={totalPages}>{totalPages}</button>
              <button onClick={handleNextPage}><i className="fa-solid fa-xl fa-angle-right"></i></button>
            </div>
          )
        }
        {
          pages>4 && pages<=totalPages-4 && (
            <div className="pagination">
              <button onClick={handlePrevPage}><i className="fa-solid fa-xl fa-angle-left"></i></button>
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
              <button onClick={handleNextPage}><i className="fa-solid fa-xl fa-angle-right"></i></button>
            </div>
          )
        }
        {
          pages>totalPages-4 && (
            <div className="pagination">
              <button onClick={handlePrevPage}><i className="fa-solid fa-xl fa-angle-left"></i></button>
              <button onClick={(e)=>handlePageChange(e)} value={1}>1</button>
              <button>...</button>
              {
                [...Array(5).keys()].reverse().map(x=>{
                  return (
                    <button 
                      key={x} className={pages==Number(totalPages)-x ? "active" : ""}
                      onClick={(e)=>handlePageChange(e)} value={Number(totalPages)-x}>
                      {Number(totalPages)-x}
                    </button>
                  );
                })
              }
              {
                pages!=totalPages && (<button onClick={handleNextPage}><i className="fa-solid fa-xl fa-angle-right"></i></button>)
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
