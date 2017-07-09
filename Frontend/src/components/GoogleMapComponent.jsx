import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, DirectionsRenderer,Marker} from "react-google-maps";

export default class FullTripDirectionsTrip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      directionDetails: {},
      mapUrl: '',
      marker: {},
    };
    this.getWaypts = this.getWaypts.bind(this)
    this.getDirections = this.getDirections.bind(this)
  }

  componentWillMount() {
    this.setState({directionDetails: this.getWaypts(this.props.fullTripDetails, this.props.tripLocationIds, this.props.updateTripLocationId)});
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.fullTripDetails !== this.props.fullTripDetails) || ((nextProps.updateTripLocationId !== this.props.updateTripLocationId))) {
      this.setState({directionDetails: this.getWaypts(nextProps.fullTripDetails, nextProps.tripLocationIds, nextProps.updateTripLocationId)});
    }
  }

  componentDidMount() {
    this.getDirections();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.fullTripDetails !== this.props.fullTripDetails) || ((prevProps.updateTripLocationId !== this.props.updateTripLocationId))) {
      this.getDirections();
    }
  }

  shouldComponentUpdate(nextProps,nextState) {
      const differentFullTripDetails = nextProps.fullTripDetails !== this.props.fullTripDetails;
      const differentTripLocationId = nextProps.updateTripLocationId !== this.props.updateTripLocationId;
      const differentDirectionDetails = nextState.directions !== this.state.directions;
      if (differentFullTripDetails || differentTripLocationId || differentDirectionDetails){
        console.log(differentFullTripDetails, differentTripLocationId, differentDirectionDetails)
      }
      return differentFullTripDetails || differentTripLocationId || differentDirectionDetails;
    }

  getWaypts = function(fullTripDetails, tripLocationIds, updateTripLocationId) {
    let waypts = [];
    const currentDay = tripLocationIds.findIndex(x => x === updateTripLocationId);
    const oriIndex = fullTripDetails.findIndex(x => x.day === currentDay);
    const dayAry = fullTripDetails.map(function(a) {return a.day;});
    const destIndex = dayAry.lastIndexOf(currentDay);
    const _this = this;
    let origin = '';
    let location = '';
    let destination = '';
    let mapWayptUrl = 'https://www.google.com/maps/dir/?api=1&travelmode=driving';
    let mapWaypts = [];
    let originUrl = '';
    let destUrl = '';
    let center_coords = '';
    console.log('fullTripDetails', fullTripDetails, oriIndex, tripLocationIds, updateTripLocationId)

    if (oriIndex !== -1) {
      for (let i = oriIndex; i <= destIndex; i++){
        if (fullTripDetails[i].check_full_address === 0){
          location = fullTripDetails[i].name + ',' + fullTripDetails[i].city + ',' + fullTripDetails[i].state;
          console.log('not full address: ', location)
          // location = new window.google.maps.LatLng(fullTripDetails[i].coord_lat, fullTripDetails[i].coord_long);
        }
        else {
          location = fullTripDetails[i].address
        }
        if(i === oriIndex) {
          center_coords = new window.google.maps.LatLng(fullTripDetails[i].coord_lat, fullTripDetails[i].coord_long);
          origin = location;
          originUrl = '&origin='+encodeURIComponent(origin) ; 
        }
        else if(i === destIndex) {
          destination = location;
          destUrl = '&destination='+ encodeURIComponent(destination); 
        }
        else {
          waypts.push({location: location, stopover: true});
          mapWaypts.push(fullTripDetails[i].coord_lat+','+fullTripDetails[i].coord_long);
        }
      }
      const mapWayptsStr = mapWaypts.join('%7C');
      mapWayptUrl += originUrl + destUrl + '&waypoints=' + mapWayptsStr;
      this.props.getMapUrl(mapWayptUrl);
      return {
        origin: origin,
        destination: destination,
        waypts: waypts,
        center_coords: center_coords
      };
    }
    
  }

  getDirections() {
    const DirectionsService = new window.google.maps.DirectionsService();
    if(this.state.directionDetails.origin && this.state.directionDetails.waypts.length !== 0){ 
      DirectionsService.route({
        origin: this.state.directionDetails.origin,
        destination: this.state.directionDetails.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        waypoints: this.state.directionDetails.waypts,
        optimizeWaypoints: false,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
            marker: {},
          });
          console.log('reuslt: ', result)
        } else {
          console.error('error fetching directions: ', result);
        }
      });
    } else {
      const position = this.state.directionDetails.center_coords;
      this.setState({
        marker: {
          position: position,
          key: `origin`,
          defaultAnimation: 2,
        },
      })
    }
  }

  render() {
    const DirectionsGoogleMap = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={11}
        defaultCenter={this.state.directionDetails.center_coords}
      > 
        {Object.keys(this.state.marker).length === 0  && <DirectionsRenderer directions={this.state.directions} /> }
        <Marker
          {...this.state.marker}
        />
      </GoogleMap>
    ));

    return (
      <DirectionsGoogleMap
        containerElement={
          <div style={{ height: `100%` }} />
        }
        mapElement={
          <div style={{ height: `100%` }} />
        }
      />
    );
  }
}