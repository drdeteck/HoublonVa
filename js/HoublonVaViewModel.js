function HoublonVaViewModel(dataLoadedCallback) {
	var self = this;
	
	// Table indexes
	var indexName = 0;
	var indexWebsite = 1;
	var indexRating = 2;
	var indexReference = 3;
	var indexLongitude = 4;
	var indexLatitude = 5;
	var indexInternationalPhoneNumber = 6;
	var indexVicinity = 7;
	var indexFormattedPhoneNumber = 8;
	var indexUrl = 9;
	var indexFormattedAddress = 10;
	var indexId = 11;
	var indexTypes = 12;
	var indexIcon = 13;
	var indexCategory = 14;
	
	var firstPage = true;
	var pageBottomPadding = "";
	
	self.Longitude = ko.observable(0);
	self.Latitude = ko.observable(0);
	self.MenuSelectedIndex = ko.observable(-1);
	self.DataLoadedCallback = dataLoadedCallback;
	self.Places = ko.observableArray();
	
	self.MapperCallback = function(data, textStatus, jqXHR) {

		data = PL.SpreadSheet.CleanVizResponse(data);
		
		var lastRegion = "";
		var firstTime = true;

		// For each Place.. map the view model
		_.each(data, function(place){ 
	
			// Add the Place to the List of Places
			self.Places.push(self.PlaceMapper(place));
		});

		self.SortPlaces();

		// Job is done. Call the callbacks
		_.each(self.DataLoadedCallback, function(callback) {
			callback();
		});
	};
	
	// Receive a Google Spreadsheet row and return a PlaceViewModel
	self.PlaceMapper = function(place, index) {
		var row = place.c;
		return new PlaceViewModel(
			row[indexName].v,
			row[indexWebsite].v,
			row[indexRating].v,
			row[indexReference].v,
			row[indexLongitude].v,
			row[indexLatitude].v,
			row[indexInternationalPhoneNumber] ? row[indexInternationalPhoneNumber].v : "",
			row[indexVicinity] ? row[indexVicinity].v : "",
			row[indexFormattedPhoneNumber] ? row[indexFormattedPhoneNumber].v : "",
			row[indexUrl].v,
			row[indexFormattedAddress] ? row[indexFormattedAddress].v : "",
			row[indexId].v,
			row[indexTypes].v,
			row[indexIcon].v,
			row[indexCategory].v
		);
	};
	
	self.SortPlaces = function() {
		// Sort by distance
		self.Places.sort(function(left, right) { 
			return left.Distance() == right.Distance() ? 0 : (left.Distance() < right.Distance() ? -1 : 1);
		});
	}

	// self.MenuDisplayMode = function(menuItem) {
	// 	return menuItem.Class ? "menu-header-template" : "menu-item-template";
	// };
}		