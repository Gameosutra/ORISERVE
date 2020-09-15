import React, { Component } from 'react';
import './App.css';
import Navbar from '../components/Navbar/Nav';
import Photos from '../components/Photos/Photos';
import axios from 'axios'
import Loader from '../assets/loader.gif';
import Modal from '../components/Modal/Modal';
var XMLParser = require('react-xml-parser');


class App extends Component {
  state = {
    photos: [],
    searchOptions: [],
    searchedQuery: [],
    suggestions: [],
    searchText: '',
    loader: false,
    pageNo: 1,
    perPage: 20,
    isOpen: false,
    modalUrl: null,
    // closeAutocomplete: false
  }

  componentDidMount() {
    this.fetchResults(this.state.perPage, this.state.pageNo);
  }
  //Redering default view of images and also responsible for infinite loading
  fetchResults = (perPage, pageNo) => {
    this.setState({ perPage: perPage, pageNo: pageNo, loader: true });
    axios({
      method: 'GET',
      url: `https://www.flickr.com/services/rest/?method=${(!this.state.searchText || this.state.searchText === '') ? 'flickr.photos.getRecent' : 'flickr.photos.search'}&api_key=bf3c63b6c2ce762699e343b748587604`,
      params: {
        per_page: perPage,
        page: pageNo,
        text: this.state.searchText
      }
    }).then(response => {
      var xml = new XMLParser().parseFromString(response.data);    // Assume xmlText contains the example XML
      xml.getElementsByTagName('photo').map((photo) => {
        photo.value = `https://farm${photo.attributes.farm}.staticflickr.com/${photo.attributes.server}/${photo.attributes.id}_${photo.attributes.secret}.jpg`;
        photo.label = photo.attributes.title;
        return photo;
      })
      if (!this.state.searchText || this.state.searchText === '') {
        this.setState({
          photos: [...this.state.photos, ...xml.getElementsByTagName('photo')],
          loader: false
        })
      }
      else {
        if (!this.state.searchedQuery.includes(this.state.searchText)) {
          this.setState({
            searchedQuery: [...this.state.searchedQuery, this.state.searchText]
          })
        }
        this.setState({
          searchOptions: [...this.state.searchOptions, ...xml.getElementsByTagName('photo')],
          loader: false
        })
      }

    })
      .catch(error => {
        console.log('error ==>', error); // TODO: remove this
      })
  }

  //While searching, api fire is handled
  searchHandler = (event, flag) => {
    console.log('event ==>', event); // TODO: remove this
    // const value = !flag ? event.target.value : event;
    const value = event;
    let suggestions = []
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = this.state.searchedQuery.sort().filter(v => regex.test(v));
    }
    if (value.length >= 1 && !this.state.searchedQuery.includes(value)) {
      if (this.state.searchedQuery.length > 10) {
        this.state.searchedQuery.splice(0, 1);
      }
      this.setState({
        searchedQuery: [...this.state.searchedQuery, value]
      })
    }
    this.setState({
      searchText: value,
      suggestions: suggestions,
      loader: true,
      closeAutocomplete: false
    })
    axios({
      method: 'GET',
      url: 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=bf3c63b6c2ce762699e343b748587604',
      params: {
        text: value, per_page: '20',
        page: '1',
      }
    }).then(response => {
      var xml = new XMLParser().parseFromString(response.data);    // Assume xmlText contains the example XML
      xml.getElementsByTagName('photo').map((photo) => {
        photo.value = `https://farm${photo.attributes.farm}.staticflickr.com/${photo.attributes.server}/${photo.attributes.id}_${photo.attributes.secret}.jpg`;
        photo.label = photo.attributes.title;
        return photo;
      })
      this.setState({
        searchOptions: xml.getElementsByTagName('photo'),
        loader: false
        // searchText: event.target.value
      })
      const params = new URLSearchParams();
      params.append("searchText", this.state.searchText);
      window.location.hash = `?${params.toString()}`;
    })
      .catch(error => {
        console.log('error ==>', error); // TODO: remove this
      })
  }

  // Modal opening ++ search query selection related modal opening ++ saving searched results 
  dialogHandler = (url) => {
    if (url && url.value && !this.state.searchedQuery.includes(url)) {
      this.setState({
        searchedQuery: [...this.state.searchedQuery, url]
      })
    }
    if (url) {
      this.setState({
        isOpen: !this.state.isOpen,
        modalUrl: url.value ? url.value : url,
        searchText: this.state.searchText
      })
    }
  }

  //on input change, setting searchtext in state value
  autocompleteSelect = (inputValue) => {
    this.searchHandler(inputValue, true);
  }

  render() {
    return (
      <div className="App">
        <Navbar
          loading={this.state.loader}
          photos={this.state.searchText === "" ? this.state.searchedQuery : this.state.suggestions}
          searchText={this.state.searchText}
          setSearchText={this.searchHandler}
          clearQueries={() => {
            this.autocompleteSelect("", true);
            this.setState({
              suggestions: [],
              searchedQuery: []
            })
          }}
        >
        </Navbar>
        <Modal
          show={this.state.isOpen}
          dialog={this.dialogHandler}
          url={this.state.modalUrl}
          closemodal={() => {
            this.setState({ isOpen: !this.state.isOpen })
          }} />
        <Photos
          pages={this.state.perPage}
          pagesNo={this.state.pageNo}
          callMore={(perPage, pageNo) => this.fetchResults(perPage, pageNo)}
          loading={this.state.loader}
          photos={(!this.state.searchText || this.state.searchText === '') ? this.state.photos : this.state.searchOptions}
          dialog={(url) => this.dialogHandler(url)} />
        {this.state.loader ? <img src={Loader} alt="loader" className="loader"></img> : null}
      </div>
    );
  }
}

export default App;
