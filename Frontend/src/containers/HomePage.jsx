import React from 'react';
import { Card, CardTitle, CardActions } from 'material-ui/Card';
import SearchInputField from '../components/SearchInputField.jsx';
import MenuItemDays from '../components/MenuItemDays.jsx';
import FullTripSearchButton from '../components/FullTripSearchButton.jsx';
import FullTripList from '../components/FullTripList.jsx';
import FullTripAddEventButton from '../components/FullTripAddEventButton.jsx';
import FullTripResetButton from '../components/FullTripResetButton.jsx';
import FullTripConfirmButton from '../components/FullTripConfirmButton.jsx';
import DirectionsTrip from '../components/GoogleMapComponent.jsx';
import ReactMaterialUiNotifications from 'react-materialui-notifications/lib/ReactMaterialUiNotifications'
// import FullDirectionsTrip from '../components/GoogleMapFullTripComponent.jsx';
import GoogleMapUrlButton from '../components/GoogleMapUrlButton.jsx';
import FullTripUserSubmitButton from '../components/FullTripUserSubmitButton.jsx';
import UserStore from '../stores/UserStore.jsx';
import TripConstants from '../constants/TripConstants';
import $ from 'jquery';

// Version B: Delete method showed in front end only, dont update the backend until final click. Beter for performance!
// add_search event use local search instead of calling backend for updates.!
// alot to updates...>__<
// Version C: update backend for the add event order or use front end to do so

// Bug to be fixed: full trip list disappear when prev state with trip_days >1, tab on day 2 or larger
// and changes trip_days lower to 1.
const divStyle = {
  width: '100%',
  height: '400px',
};

class HomePage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);
    // set the initial component state
    this.state = {
      place: "",
      days: "",
      cityStateDataSource: [],
      addEventDataSource: [],
      poiDict: {},
      searchInputValue: '',
      searchEventValue: '',
      daysValue: '1',
      fullTripDetails: [],
      fullTripId: '',
      tripLocationIds: [],
      cloneFullTripDetails: [],
      updateEventId: '',
      updateEventName: '',
      updateTripLocationId: '',
      suggestEventArr: {},
      updateSuggestEvent: {},
      currentMapUrl: '',
      newFullTrip: '',
      errorsCityState: {},
      errors: {},
    };

    this.performSearch = this.performSearch.bind(this)
    this.onUpdateInput = this.onUpdateInput.bind(this)
    this.handleDaysOnChange = this.handleDaysOnChange.bind(this)
    this.onFullTripSubmit = this.onFullTripSubmit.bind(this)
    this.onFullTripUserSubmit = this.onFullTripUserSubmit.bind(this)
    this.onDeleteEvent = this.onDeleteEvent.bind(this)
    this.onSuggestEvent = this.onSuggestEvent.bind(this)
    this.onFullTripReset = this.onFullTripReset.bind(this)
    this.onFullTripConfirm = this.onFullTripConfirm.bind(this)
    this.performDeleteEventId = this.performDeleteEventId.bind(this)
    this.performSuggestEventLst = this.performSuggestEventLst.bind(this)
    this.onAddEventInput = this.onAddEventInput.bind(this)
    this.getTapName = this.getTapName.bind(this)
    this.getMapUrl = this.getMapUrl.bind(this)
    this.onAddEventSubmit = this.onAddEventSubmit.bind(this)
  }

  performSearch() {
    // const dbLocationURI = 'http://127.0.0.1:8000/city_state_search/?city_state=';
    const _this = this;
    const valid_input = encodeURIComponent(_this.state.searchInputValue);
    const cityStateSearchUrl = TripConstants.SEARCH_CITY_STATE_URL + valid_input;

    if(_this.state.searchInputValue !== '') {
      console.log(cityStateSearchUrl);
      $.ajax({
        type: "GET",
        url: cityStateSearchUrl,
      }).done(function(res) {
        _this.setState({
          cityStateDataSource : res.city_state,  
        });
      });
    };
  }

  onUpdateInput(searchInputValue) {
    this.setState({
        searchInputValue,
      },function(){
      this.performSearch();
    });
  }

  handleDaysOnChange = (event, index, value) => this.setState({ daysValue: event.target.innerText});

  onFullTripSubmit = () => {
    // const dbLocationURI = 'http://127.0.0.1:8000/full_trip_search/?';
    const _this = this;
    const city = this.state.searchInputValue.split(',')[0];
    const state = this.state.searchInputValue.split(',')[1];
    const fullTripSearchUrl = TripConstants.SEARCH_FULL_TRIP_URL + 'city=' + encodeURIComponent(city) + '&state='+ encodeURIComponent(state) + '&n_days='+ _this.state.daysValue;
    console.log('fulltrip url: ', fullTripSearchUrl)
    if(_this.state.searchInputValue !== '') {
      $.ajax({
        type: "GET",
        url: fullTripSearchUrl,
      }).done(function(res) {
        _this.setState({
          fullTripDetails : res.full_trip_details,  
          fullTripId: res.full_trip_id,
          tripLocationIds: res.trip_location_ids,
          updateTripLocationId: res.trip_location_ids[0],
          addEventDataSource: [],
          poiDict: {},
          searchEventValue: '',
          errorsCityState: {},
        });
      }).fail(function(res, status, errorThrown){
        _this.setState({
            errorsCityState: JSON.parse(res.responseText)
          });
      });
    };
  }

  //may want to reset!
  performDeleteEventId() {
    const { fullTripId, updateEventId, updateTripLocationId } = this.state;
    // const myUrl = 'http://127.0.0.1:8000/update_trip/delete/?full_trip_id=' + fullTripId +
    //                     '&event_id=' + updateEventId +
    //                     '&trip_location_id='+ updateTripLocationId;
    const updateFullTripDeletePoiUrl = TripConstants.UPDATE_FULL_TRIP_DELETE_POI_URL + fullTripId + '&event_id=' + updateEventId + '&trip_location_id='+ updateTripLocationId;
    const _this = this;
    console.log('delete event id: ',updateFullTripDeletePoiUrl)
    if(updateEventId !== '') {
      console.log('delete event id: ',updateFullTripDeletePoiUrl);
      $.ajax({
        type: "GET",
        url: updateFullTripDeletePoiUrl,
      }).done(function(res) {
        _this.setState({
          fullTripDetails : res.full_trip_details,  
          fullTripId: res.full_trip_id,
          tripLocationIds: res.trip_location_ids,
          updateTripLocationId: res.current_trip_location_id,
          updateEventId: '',
        });
      });
    };
  }

  onDeleteEvent(updateEventId, updateEventName, updateTripLocationId) {
    this.setState({
      updateEventId,
      updateEventName,
      updateTripLocationId
    },this.performDeleteEventId);
  }

  onSuggestEvent(updateEventId, updateEventName, updateTripLocationId) {
    if (this.state.suggestEventArr.hasOwnProperty(updateEventId)) {
      const suggestEventArrLength = Object.keys(this.state.suggestEventArr).length
      const randomSuggestEventArrIdx = Math.floor(Math.random()*suggestEventArrLength)
      const suggestEvent = this.state.suggestEventArr[randomSuggestEventArrIdx];
      const updateSuggestEvent = Object.assign({}, this.state.updateSuggestEvent, {[this.state.updateEventId]:suggestEvent});
      const errors = {};
      this.setState({
        updateEventId,
        // updateTripLocationId: updateTripLocationId,
        updateEventName,
        updateSuggestEvent,
        errors,
      }); 
    } else {
      this.setState({
        updateEventId,
        updateEventName,
        // updateTripLocationId
      }, this.performSuggestEventLst);
    }
  }


  performSuggestEventLst(){
    // const myUrl = 'http://127.0.0.1:8000/update_trip/suggest_search/?full_trip_id=' + this.state.fullTripId +
    //                     '&event_id=' + this.state.updateEventId +
    //                     '&trip_location_id='+this.state.updateTripLocationId;
    const updateFullTripSuggestPoiUrl = TripConstants.UPDATE_FULL_TRIP_SUGGEST_POI_URL + this.state.fullTripId + '&event_id=' + this.state.updateEventId + '&trip_location_id='+this.state.updateTripLocationId;
    const _this = this;
    console.log('suggest poi url: ', updateFullTripSuggestPoiUrl)
    if(_this.state.updateEventId !== '') {
      $.ajax({
        type: "GET",
        url: updateFullTripSuggestPoiUrl,
      }).done(function(res) {
        let suggestEventArr = Object.assign({}, _this.state.suggestEventArr[_this.state.updateEventId], res.suggest_event_array);
        let suggestEvent = suggestEventArr[Math.floor(Math.random()*Object.keys(suggestEventArr).length)];
        let updateSuggestEvent = Object.assign({}, _this.state.updateSuggestEvent, {[_this.state.updateEventId]:suggestEvent});
        _this.setState({
          suggestEventArr: suggestEventArr,
          updateSuggestEvent: updateSuggestEvent,
        });
      }).fail(function(res, status, errorThrown){
        const errors = JSON.parse(res.responseText);
        ReactMaterialUiNotifications.showNotification({
          title: _this.state.updateEventName,
          additionalText: errors.error_no_suggestion,
        });
        _this.setState({
          errors: errors
        });
      });
    };
  }

  onFullTripReset(){
    this.setState({
      updateSuggestEvent: {}
    })
  }

  onFullTripConfirm(){
    // const suggestConfirmUrl = 'http://127.0.0.1:8000/update_trip/suggest_confirm/';
    const suggestConfirmUrl = TripConstants.UPDATE_FULL_TRIP_SUGGEST_CONFIRM_URL;
    const _this = this;
    let data = {
      updateSuggestEvent: JSON.stringify(this.state.updateSuggestEvent),
      fullTripId: this.state.fullTripId,
      updateTripLocationId: this.state.updateTripLocationId,
    };
    $.ajax({
      type: 'POST',
      url: suggestConfirmUrl,
      data: data
    })
    .done(function(res) {
      _this.setState({
        updateSuggestEvent: '',
        fullTripDetails: res.full_trip_details,
        fullTripId: res.full_trip_id,
        tripLocationIds: res.trip_location_ids,
        updateEventId: '',
        updateTripLocationId: res.current_trip_location_id,
      })
    })
    .fail(function(jqXhr) {
      console.log('failed to register');
    });
  }

  performAddEventSearch() {
    // const dbLocationURI = 'http://127.0.0.1:8000/update_trip/add_search/?poi_name=';
    const _this = this;
    const validInput = encodeURIComponent(this.state.searchEventValue);
    const addPoiSearchUrl = TripConstants.UPDATE_FULL_TRIP_ADD_POI_SEARCH_URL + validInput + '&trip_location_id=' + _this.state.updateTripLocationId + '&full_trip_id=' + _this.state.fullTripId;
    if(_this.state.searchEventValue !== '') {
      console.log('add search url: ', addPoiSearchUrl);
      $.ajax({
        type: "GET",
        url: addPoiSearchUrl,
      }).done(function(res) {
        _this.setState({
          addEventDataSource : res.poi_names,  
          poiDict: res.poi_dict,
        });

      });
    };
  }

  onAddEventInput(searchEventValue) {
    this.setState({
        searchEventValue,
      },function(){
      this.performAddEventSearch();
    });
  }

  getTapName(updateTripLocationId) {
    this.setState({
        updateTripLocationId: updateTripLocationId,
        addEventDataSource: [],
        searchEventValue: '',
    });
  }

  getMapUrl(currentMapUrl) {
    console.log('the currentMapUrl: ',currentMapUrl)
    this.setState({
      currentMapUrl
    })
  }

  onAddEventSubmit = () => {
    // const dbLocationURI = 'http://127.0.0.1:8000/update_trip/add/?';
    const _this = this;
    const poiId = this.state.poiDict[this.state.searchEventValue];
    const validPoiName = encodeURIComponent(this.state.searchEventValue);
    const addPoiUrl = TripConstants.UPDATE_FULL_TRIP_ADD_POI_URL + 'poi_id=' + poiId + '&poi_name='+ validPoiName +'&full_trip_id='+ this.state.fullTripId + '&trip_location_id='+this.state.updateTripLocationId;
    console.log('add submit',addPoiUrl)
    if(this.state.searchEventValue !== '') {
      $.ajax({
        type: "GET",
        url: addPoiUrl,
      }).done(function(res) {
        _this.setState({
          fullTripDetails : res.full_trip_details,  
          fullTripId: res.full_trip_id,
          tripLocationIds: res.trip_location_ids,
          updateTripLocationId: res.current_trip_location_id,
          addEventDataSource: [],
          searchEventValue: '',
        });
        // call a func: map fulltrip detail to clone => cloneFullTripDetails = 
      });
    };
  }
  // Wrap all `react-google-maps` components with `withGoogleMap` HOC
  // and name it GettingStartedGoogleMap
  
  onFullTripUserSubmit = () =>  {
    // const fullTripUrl = 'http://localhost:8000/create_full_trip/';
    const fullTripUrl = TripConstants.CREATE_FULL_TRIP_URL
    const token = localStorage.getItem('user_token')
    // const headers = {
    //                 'Authorization': 'Token ' + UserStore.token
    //                 }
    const headers = {
    // 'Authorization': 'Token ' + localStorage.user_token
    'Authorization': 'Token ' + token
    }
    const _this = this;
    console.log('headers: ', headers, token)
    let data = {
      fullTripId: _this.state.fullTripId,
    };
    // data = JSON.stringify(data)
    $.ajax({
      type: 'POST',
      url: fullTripUrl,
      data: data,
      headers: headers,
    })
    .done(function(res) {
      _this.setState({
        updateSuggestEvent: '',
        updateEventId: '',
        newFullTrip: res.response,
      })
      console.log('done creating the full trip!')
    })
    .fail(function(jqXhr) {
      console.log('failed to create the full trip.');
    });

  }

  render() { 
    return (
      <div>
        <ReactMaterialUiNotifications
            desktop={true}
            transitionName={{
              leave: 'dummy',
              leaveActive: 'fadeOut',
              appear: 'dummy',
              appearActive: 'zoomInUp'
            }}
            transitionAppear={true}
            transitionLeave={true}
            autoHide={3000}
          />

        <Card className="container" >
          <CardTitle title="Angel Trip!" subtitle="This is the home page." />
          <CardActions>
            
            <div className="col-md-8 col-md-offset-2">
              <div className="col-md-5">
                <SearchInputField 
                  name='searchCityState'
                  searchText={this.state.searchInputValue}
                  floatingLabelText='Location' 
                  dataSource={this.state.cityStateDataSource} 
                  onUpdateInput={this.onUpdateInput} 
                  errors={this.state.errorsCityState} />
              </div>
              <div className="col-md-5">
                <MenuItemDays daysValue={this.state.daysValue} handleDaysOnChange={this.handleDaysOnChange}/>
              </div>
              <div className="col-md-2">
                <FullTripSearchButton onFullTripSubmit={this.onFullTripSubmit}/>
              </div>
              <br/>
              <div className="col-md-12 ">
                {this.state.fullTripDetails.length>0 && 
                  <FullTripList 
                    onDeleteEvent={this.onDeleteEvent} 
                    onSuggestEvent={this.onSuggestEvent}
                    updateSuggestEvent={this.state.updateSuggestEvent}
                    fullTripDetails={this.state.fullTripDetails} 
                    tripLocationIds={this.state.tripLocationIds}
                    getTapName={this.getTapName} 
                    />}
              </div>
              <div className="col-md-10 col-md-offset-2">
                <div className="col-md-5 col-md-offset-1">
                  {this.state.fullTripDetails.length>0 && 
                    <SearchInputField
                      name='searchAddEvent'
                      searchText={this.state.searchEventValue}
                      hintText='Add New Event'
                      inputStyle={{ textAlign: 'center' }}
                      dataSource={this.state.addEventDataSource} 
                      onUpdateInput={this.onAddEventInput} />}
                </div>
                <div className="col-md-2">
                  {this.state.fullTripDetails.length>0 && 
                    <FullTripAddEventButton onAddEventSubmit={this.onAddEventSubmit}/>}
                </div>
                <div className="col-md-4">
                  <div className="col-md-4">
                    {Object.keys(this.state.updateSuggestEvent).length>0 && 
                      <FullTripResetButton onFullTripReset={this.onFullTripReset}/>}
                  </div>
                  <div className="col-md-4">
                    {Object.keys(this.state.updateSuggestEvent).length>0 && 
                      <FullTripConfirmButton onFullTripConfirm={this.onFullTripConfirm}/>}
                  </div>
                </div>
                
              </div>
              <div className="col-md-12">
                <div style={divStyle}>
                    {this.state.fullTripDetails.length > 0 && <DirectionsTrip fullTripDetails={this.state.fullTripDetails}
                                                                              updateTripLocationId={this.state.updateTripLocationId}
                                                                              tripLocationIds={this.state.tripLocationIds} 
                                                                              getMapUrl={this.getMapUrl} />}
                </div>
                <br />
                <div className="col-md-6">
                  {this.state.currentMapUrl.length >0 && <GoogleMapUrlButton googleMapUrl={this.state.currentMapUrl} />}
                </div>
                <div className="col-md-6">
                  {this.state.currentMapUrl.length >0 && <FullTripUserSubmitButton onFullTripUserSubmit={this.onFullTripUserSubmit} />}
                </div>

              </div>            
            </div>
              
          </CardActions>
        </Card>
      </div>
    )
  }
};


export default HomePage;
