import React, { useEffect, useState } from 'react';
import './Nav.css';

const Navbar = (props) => {
  const[search,setSearch] = useState(props.searchText);

  // Calling search query after 1 second, to maintain searched Query array
  useEffect(() => {
      const timer = setTimeout(() => {
        props.setSearchText(search);
      }, 1000);

      return () => clearTimeout(timer);
    }, [search]);
    // -- end


    return (
        <nav className="navbar navbar-light Nav">
          <form className="form-inline NavForm">
            <div className="navInput">
              <h3 style={{color: "white"}}>Search Photos</h3>
              <div className="outerBox">
                <input 
                    className="searchBox"
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    value={search}
                    placeholder="Search Here..."
                  />
                  { props.photos.length > 0 ? 
                    <ul>
                      {props.photos.map((item,index) => {
                        return (
                        <li key={item} onClick={() => {
                          props.setSearchText(props.photos[index])
                          setSearch(props.searchText)
                          }}>
                          {item}
                        </li>
                        )
                      })}
                      <li style={{textAlign:"end"}}>
                        <button className="clearButton" onClick={props.clearQueries}>Clear</button>
                      </li>
                    </ul>
                    :
                    null
                  }
              </div>
            </div>
          </form>
        </nav>
    );
}

export default Navbar;