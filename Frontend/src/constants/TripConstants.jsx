// var BASE_URL = 'http://localhost:8000/';
var BASE_URL = 'http://174.129.85.123/';
var TripConstants = {
    BASE_URL: BASE_URL,
    SEARCH_CITY_STATE_URL: BASE_URL + 'city_state_search/?city_state=',
    SEARCH_FULL_TRIP_URL: BASE_URL + 'full_trip_search/?',
    SEARCH_OUTSIDE_TRIP_URL: BASE_URL + 'outside_trip_search/?',
    UPDATE_FULL_TRIP_DELETE_POI_URL: BASE_URL + 'update_trip/delete/?full_trip_id=',
    UPDATE_FULL_TRIP_SUGGEST_POI_URL: BASE_URL + 'update_trip/suggest_search/?full_trip_id=',
    UPDATE_FULL_TRIP_SUGGEST_CONFIRM_URL: BASE_URL + 'update_trip/suggest_confirm/',
    UPDATE_FULL_TRIP_ADD_POI_SEARCH_URL: BASE_URL + 'update_trip/add_search/?poi_name=',
    UPDATE_FULL_TRIP_ADD_POI_URL: BASE_URL + 'update_trip/add/?',
    
    CREATE_FULL_TRIP_URL: BASE_URL + 'create_full_trip/',
    CREATE_OUTSIDE_TRIP_URL: BASE_URL + 'create_outside_trip/',

    IP_LOCATION_API: '359263af1b8a0a7c1d725ec86751962cc8801f6a',
    IP_LOCATION_URL: BASE_URL + 'iplocation/?ip=',

    FULL_TRIP_URL: BASE_URL + 'full_trip/',
    OUTSIDE_TRIP_URL: BASE_URL + 'outside_trip/'
};

export default TripConstants;