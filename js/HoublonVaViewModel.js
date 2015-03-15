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
    var indexStreetNumber = 15;
    var indexRoute = 16;
    var indexLocality = 17;
    var indexProvince = 18;
    var indexCountry = 19;
    var indexPostalCode = 20;

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
            self.TryGet(row[indexName]),
            self.TryGet(row[indexWebsite]),
            self.TryGet(row[indexRating]),
            self.TryGet(row[indexReference]),
            self.TryGet(row[indexLongitude]),
            self.TryGet(row[indexLatitude]),
            self.TryGet(row[indexInternationalPhoneNumber]),
            self.TryGet(row[indexVicinity]),
            self.TryGet(row[indexFormattedPhoneNumber]),
            self.TryGet(row[indexUrl]),
            self.TryGet(row[indexFormattedAddress]),
            self.TryGet(row[indexId]),
            self.TryGet(row[indexTypes]),
            self.TryGet(row[indexIcon]),
            self.TryGet(row[indexCategory]),
            self.TryGet(row[indexStreetNumber]),
            self.TryGet(row[indexRoute]),
            self.TryGet(row[indexLocality]),
            self.TryGet(row[indexProvince]),
            self.TryGet(row[indexCountry]),
            self.TryGet(row[indexPostalCode])
        );
    };

    self.TryGet = function(cell) {
        if (cell) return cell.v;
        return "";
    }

    self.SortPlaces = function() {
        // Sort by distance
        self.Places.sort(function(left, right) { 
            return left.Distance() == right.Distance() ? 0 : (left.Distance() < right.Distance() ? -1 : 1);
        });
    }

    self.FilterByType = function(category) {
        _.each(self.Places(), function(place) {
            place.IsVisible(place.Category() === category) 
        });
    }
    
    self.ResetFilter = function() {
         _.each(self.Places(), function(place) {
            place.IsVisible(true) 
        });
    }
}		