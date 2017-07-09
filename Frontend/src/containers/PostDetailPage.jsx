import axios from 'axios';
import React, { Component } from 'react';
import moment from 'moment';
import BlogConstants from '../constants/BlogConstants.jsx';
import TripConstants from '../constants/TripConstants.jsx';
import PostFullTripList from '../components/PostFullTripList.jsx';
import PostOutsideTripList from '../components/PostOutsideTripList.jsx';

export default class Post extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      postData: {},
      fullTripData: null,
      outsideTripData: null,
      updateTripLocationId: '',
      baseBackgroundImg: '',
    }
    this.fetchPost = this.fetchPost.bind(this);
    this.fetchTripDetails = this.fetchTripDetails.bind(this);
    this.postBase = this.postBase.bind(this);
    this.getTapName = this.getTapName.bind(this);

  }

  fetchPost(slug) {
    console.log('post url: ', BlogConstants.POST_URL + slug)
    axios.get(BlogConstants.POST_URL + slug)
     .then(response => {
      this.setState({
        postData: response.data
      });
      this.fetchTripDetails();
     });
  }

  fetchTripDetails() {
    if (this.state.postData.full_trip_id !== null){
      axios.get(TripConstants.FULL_TRIP_URL + this.state.postData.full_trip_id)
       .then(response => {
        this.setState({
          fullTripData: response.data
        });
        this.postBase();
       });
    } 
    if (this.state.postData.outside_trip_id !== null){
      axios.get(TripConstants.OUTSIDE_TRIP_URL + this.state.postData.outside_trip_id)
       .then(response => {
        this.setState({
          outsideTripData: response.data
        });
        this.postBase();
       });
    }
  }

  getTapName(updateTripLocationId) {
    this.setState({
      updateTripLocationId: updateTripLocationId,
    });
  }

  postBase() {
    if (this.state.fullTripData !== null) {
      console.log('fullTripData img_url: ', this.state.fullTripData)
      this.setState({
        // baseBackgroundImg: this.state.postData.full_trip_details[0].img_url
        baseBackgroundImg: this.state.fullTripData.full_trip_details[0].img_url
      });
    } else if (this.state.outsideTripData !== null) {
      console.log('outsideTripData img_url: ', this.state.outsideTripData.outside_trip_details[0][0].img_url)
      this.setState({
        baseBackgroundImg: this.state.outsideTripData.outside_trip_details[0][0].img_url
      });
    }
  }


  componentWillMount() {
    this.fetchPost(this.props.params.slug);
  }

  render() {
    const imgUrl = this.state.baseBackgroundImg;
    const postTitle = this.state.postData.title;
    const postBody = this.state.postData.body;
    const postAurthor = this.state.postData.username;
    const postDate = this.state.postData.pub_date ? moment(this.state.postData.pub_date).calendar() : moment().subtract(30, 'days').calendar();  
    const avatarUrl = 'https://s3.amazonaws.com/travel-with-friends/profile.jpg';
    const avatarStyle = {
      backgroundImage:`url(${avatarUrl})`,
      backgroundColor: '#263238',
      backgroundSize: 'cover',
    }
    const bgImg = {
      backgroundSize: 'cover',
      backgroundImage: `url(${imgUrl})`,
      backgroundColor: '#263238',
    };
    const postBgImg = {
      backgroundSize: 'cover',
      backgroundImage: `linear-gradient(rgba(255,255,255,.7), rgba(255,255,255,.7)), url(${imgUrl})`,
      backgroundColor: '#263238',
    };
    return (
      <div className="demo-blog demo-blog--blogpost mdl-layout mdl-js-layout has-drawer is-upgraded" style={postBgImg}>
        <main className="mdl-layout__content">
          <div className="demo-back">
            <a className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" href={'/posts/'} title="go back" role="button">
              <i className="material-icons" role="presentation">arrow_back</i>
            </a>
          </div>
          <div className="demo-blog__posts mdl-grid">
            <div className="mdl-card mdl-shadow--4dp mdl-cell mdl-cell--12-col">
              <div className="mdl-card__media mdl-color-text--grey-50" style={bgImg}>
                <h3>{postTitle}</h3>
              </div>
              <div className="mdl-color-text--grey-700 mdl-card__supporting-text meta">
                <div className="minilogo" style={avatarStyle}></div>
                <div>
                  <strong>{postAurthor}</strong>
                  <span>{postDate}</span>
                </div>
                <div className="section-spacer"></div>
              </div>
              <div className="mdl-color-text--grey-700 mdl-card__supporting-text">
                {postBody}
                {console.log('outside trip data: ', this.state.outsideTripData)}
                {this.state.fullTripData !== null && 
                  <div className="col-md-8">
                    <PostFullTripList 
                      fullTripDetails={this.state.fullTripData.full_trip_details} 
                      tripLocationIds={this.state.fullTripData.trip_location_ids}
                      getTapName={this.getTapName} 
                      />
                  </div> }
                {this.state.outsideTripData !== null && 
                  <PostOutsideTripList 
                    outsideRouteDetails={this.state.outsideTripData.outside_trip_details[0]} 
                    getTapName={this.getTapName} 
                    outsideRouteTitle={postTitle}
                    />} 
              </div>
              
            </div>
          </div>
        </main>
        <div className="mdl-layout__obfuscator"></div>
      </div>
    )
  }
}
